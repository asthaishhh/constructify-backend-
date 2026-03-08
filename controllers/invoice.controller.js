import mongoose from "mongoose";
import Invoice from "../models/Invoice.js";
import Material from "../models/Material.js";

// Helper to detect whether MongoDB server supports transactions
const serverSupportsTransactions = async () => {
  try {
    const adminInfo = await mongoose.connection.db.admin().command({ ismaster: 1 });
    return Boolean(adminInfo.setName || adminInfo.msg === "isdbgrid");
  } catch (e) {
    return false;
  }
};

/**
 * Compute invoice amount from line items
 */
const computeAmount = (materials = []) =>
  materials.reduce((sum, item) => {
    const qty = Number(item.quantity || 0);
    const rate = Number(item.rate || 0);
    return sum + qty * rate;
  }, 0);

/**
 * POST /api/invoices
 * Creates invoice + deducts inventory atomically (transaction)
 */
export const createInvoice = async (req, res) => {
  let session;
  let usingTransaction = false;

  try {
    const supports = await serverSupportsTransactions();
    if (supports) {
      session = await mongoose.startSession();
      session.startTransaction();
      usingTransaction = true;
    } else {
      usingTransaction = false;
    }

    const { customerId, customer, status, materials, date } = req.body;

    const customerRef = customerId || customer;
    if (!customerRef) {
      await session.abortTransaction();
      return res.status(400).json({ message: "customerId/customer is required" });
    }

    if (!Array.isArray(materials) || materials.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "materials must be a non-empty array" });
    }

    // 1) Validate + stock check
    const matchedMaterials = [];
    for (const item of materials) {
      const name = String(item.name || "").trim();
      const qtyNeeded = Number(item.quantity);
      const itemRate = Number(item.rate);

      if (!name || !Number.isFinite(qtyNeeded) || qtyNeeded <= 0) {
        if (usingTransaction && session) await session.abortTransaction();
        return res.status(400).json({ message: "Each item needs valid name and quantity" });
      }

      const query = Material.findOne({ name: new RegExp(`^${name}$`, "i") });
      if (usingTransaction && session) query.session(session);
      const dbMat = await query;

      if (!dbMat) {
        if (usingTransaction && session) await session.abortTransaction();
        return res.status(404).json({ message: `Material not found: ${name}` });
      }

      if (dbMat.quantity < qtyNeeded) {
        if (usingTransaction && session) await session.abortTransaction();
        return res.status(400).json({
          message: `Insufficient stock for ${dbMat.name}. Available: ${dbMat.quantity}, required: ${qtyNeeded}`,
        });
      }

      // ensure we have a rate (fallback to material price if available)
      const rate = Number.isFinite(itemRate) ? itemRate : Number(dbMat.rate || 0);
      matchedMaterials.push({ dbMat, qtyNeeded, rate });
    }

    // 2) Deduct stock (use matchedMaterials order)
    for (const m of matchedMaterials) {
      const upd = Material.updateOne({ _id: m.dbMat._id }, { $inc: { quantity: -m.qtyNeeded } });
      if (usingTransaction && session) await upd.session(session);
      else await upd;
    }

    // 3) Save invoice
    // 3) Save invoice
    const amount = computeAmount(materials);

    // Prepare invoice materials in schema format ({ material: ObjectId, quantity, rate })
    const invoiceMaterials = matchedMaterials.map((m) => ({
      material: m.dbMat._id,
      quantity: m.qtyNeeded,
      rate: m.rate,
    }));

    const invoiceNumber = `INV-${Date.now()}`;

    const createOpts = usingTransaction && session ? { session } : undefined;
    const [created] = await Invoice.create(
      [
        {
          invoiceNumber,
          customer: customerRef,
          status: status || "pending",
          materials: invoiceMaterials,
          amount,
          date: date || new Date(),
        },
      ],
      createOpts
    );

    if (usingTransaction && session) await session.commitTransaction();

    const populated = await Invoice.findById(created._id)
      .populate("customer")
      .populate("materials.material");
    return res.status(201).json(populated);
  } catch (err) {
    if (usingTransaction && session) await session.abortTransaction();
    console.error("createInvoice error:", err);
    return res.status(500).json({ message: "Failed to create invoice", error: err.message });
  } finally {
    if (session) session.endSession();
  }
};

/**
 * GET /api/invoices
 */
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 }).populate("customer").populate("materials.material");
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch invoices", error: err.message });
  }
};

/**
 * PUT /api/invoices/:id
 * Safe update (status/date/customer only).
 * If you want material-editing later, we’ll implement stock re-adjustment properly.
 */
export const updateInvoice = async (req, res) => {
  try {
    const { status, date, customerId, customer } = req.body;

    const payload = {
      ...(status ? { status } : {}),
      ...(date ? { date } : {}),
      ...(customerId || customer ? { customer: customerId || customer } : {}),
    };

    const updated = await Invoice.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    }).populate("customer").populate("materials.material");

    if (!updated) return res.status(404).json({ message: "Invoice not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update invoice", error: err.message });
  }
};

/**
 * DELETE /api/invoices/:id
 * Restores stock before deleting invoice (transaction)
 */
export const deleteInvoice = async (req, res) => {
  let session;
  let usingTransaction = false;

  try {
    const supports = await serverSupportsTransactions();
    if (supports) {
      session = await mongoose.startSession();
      session.startTransaction();
      usingTransaction = true;
    } else {
      usingTransaction = false;
    }

    const invoiceQuery = Invoice.findById(req.params.id);
    if (usingTransaction && session) invoiceQuery.session(session);
    const invoice = await invoiceQuery;
    if (!invoice) {
      if (usingTransaction && session) await session.abortTransaction();
      return res.status(404).json({ message: "Invoice not found" });
    }

    // restore stock
    for (const item of invoice.materials || []) {
      const name = String(item.name || "").trim();
      const qty = Number(item.quantity || 0);

      if (name && qty > 0) {
        const upd = Material.updateOne({ name: new RegExp(`^${name}$`, "i") }, { $inc: { quantity: qty } });
        if (usingTransaction && session) await upd.session(session);
        else await upd;
      }
    }

    if (usingTransaction && session) await Invoice.deleteOne({ _id: invoice._id }).session(session);
    else await Invoice.deleteOne({ _id: invoice._id });

    if (usingTransaction && session) await session.commitTransaction();
    res.json({ message: "Invoice deleted and stock restored" });
  } catch (err) {
    if (usingTransaction && session) await session.abortTransaction();
    res.status(400).json({ message: "Failed to delete invoice", error: err.message });
  } finally {
    if (session) session.endSession();
  }
};