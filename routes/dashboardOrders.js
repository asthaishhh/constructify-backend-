import express from "express";
import  authenticateToken  from "../middleware/auth.js";
import authorizeRoles from "../middleware/authorize.js";
import OrderManagement from "../middleware/models/OrderManagement.js";
import Material from "../middleware/models/Material.js";

const router = express.Router();

/*
  🔒 Apply authentication + admin role to ALL routes in this file
  Since dashboard is admin-only
*/
router.use(authenticateToken);
router.use(authorizeRoles("admin"));


// =============================
// Helper function to update inventory
// =============================
const updateInventory = async (pair, quantity, action) => {
  try {
    const materialName = pair.split("/")[0];
    const material = await Material.findOne({ name: materialName });

    if (!material) {
      console.log(`Material ${materialName} not found in inventory`);
      return;
    }

    if (action === "increase") {
      material.quantity += quantity;
    } else if (action === "decrease") {
      material.quantity = Math.max(0, material.quantity - quantity);
    }

    material.lastUpdated = new Date();
    await material.save();

    console.log(
      `Inventory updated: ${materialName} ${action}d by ${quantity}`
    );
  } catch (err) {
    console.error("Error updating inventory:", err);
  }
};


// =============================
// ✅ GET all orders
// =============================
router.get("/", async (req, res) => {
  try {
    const orders = await OrderManagement.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =============================
// ✅ GET orders by type (mine/customers)
// =============================
router.get("/type/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const orders = await OrderManagement.find({ type }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =============================
// ✅ GET single order by ID
// =============================
router.get("/:id", async (req, res) => {
  try {
    const order = await OrderManagement.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =============================
// ✅ CREATE new order
// =============================
router.post("/", async (req, res) => {
  try {
    const { id, type, client, pair, side, quantity, price, status } = req.body;

    if (!id || !type || !pair || !side || !quantity || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = new OrderManagement({
      id,
      type,
      client: client || "N/A",
      pair,
      side,
      quantity,
      price,
      status: status || "open",
    });

    const savedOrder = await order.save();

    // Update inventory
    if (type === "mine" && side === "Buy") {
      await updateInventory(pair, quantity, "increase");
    } else if (type === "customers" && side === "Sell") {
      await updateInventory(pair, quantity, "decrease");
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =============================
// ✅ UPDATE order status
// =============================
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await OrderManagement.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =============================
// ✅ DELETE order
// =============================
router.delete("/:id", async (req, res) => {
  try {
    const order = await OrderManagement.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =============================
// ✅ BULK CREATE orders (Admin only)
// =============================
router.post("/bulk/seed", async (req, res) => {
  try {
    const orders = req.body;

    const savedOrders = await OrderManagement.insertMany(orders);

    res.status(201).json({
      message: `${savedOrders.length} orders created successfully`,
      data: savedOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;