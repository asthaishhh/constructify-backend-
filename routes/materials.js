import express from "express";
import Material from "../middleware/models/Material.js";
import  authenticateToken  from "../middleware/auth.js";
import authorizeRoles  from "../middleware/authorize.js";

const router = express.Router();

/* -------------------------
   🔐 Require Login
--------------------------*/
router.use(authenticateToken);


/* -------------------------
   ✅ GET all materials
--------------------------*/
router.get("/", authorizeRoles("admin", "user"), async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* -------------------------
   ✅ POST new material
--------------------------*/
router.post("/", authorizeRoles("admin", "user"), async (req, res) => {
  try {
    const newMaterial = new Material(req.body);
    const saved = await newMaterial.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/* -------------------------
   ✅ PUT update material
--------------------------*/
router.put("/:id", authorizeRoles("admin", "user"), async (req, res) => {
  try {
    const updated = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/* -------------------------
   ✅ DELETE material
--------------------------*/
router.delete("/:id", authorizeRoles("admin", "user"), async (req, res) => {
  try {
    const deleted = await Material.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.json({ message: "Material deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;