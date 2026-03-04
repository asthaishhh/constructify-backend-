import express from "express";
import Invoice from "../middleware/models/Invoice.js";
import  authenticateToken  from "../middleware/auth.js";
import authorizeRoles  from "../middleware/authorize.js";

const router = express.Router();

/* -------------------------
   🔐 Authentication Required
--------------------------*/
router.use(authenticateToken);


/* -------------------------
   ✅ GET all invoices
   Admin + User
--------------------------*/
router.get("/", authorizeRoles("admin", "user"), async (req, res) => {
  try {
   
    const invoices = await Invoice.find().populate("customer");
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



/* -------------------------
   ✅ POST new invoice (Generate Bill)
   Admin + User
--------------------------*/
router.post("/", authorizeRoles("admin", "user"), async (req, res) => {
  const newInvoice = new Invoice(req.body);

  try {
    const saved = await newInvoice.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/* -------------------------
   ✅ PUT update invoice
   Admin + User
--------------------------*/
router.put("/:id", authorizeRoles("admin", "user"), async (req, res) => {
  try {
    const updated = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/* -------------------------
   ❌ DELETE invoice
   Admin ONLY
--------------------------*/
router.delete("/:id", authorizeRoles("admin"), async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;