import express from "express";
import Customer from "../middleware/models/Customer.js";
import authenticateToken from "../middleware/auth.js"; 
import authorizeRoles from "../middleware/authorize.js";

const router = express.Router();

// Create customer
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Manager"),
  async (req, res) => {
    try {
      const customer = await Customer.create(req.body);
      res.status(201).json(customer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get all customers
router.get("/", authenticateToken, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single customer
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;