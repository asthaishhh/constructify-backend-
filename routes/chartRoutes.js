import express from "express";
import ChartData from "../middleware/models/ChartData.js";
import authenticateToken  from "../middleware/auth.js";
import authorizeRoles from "../middleware/authorize.js";

const router = express.Router();

/* -------------------------
   🔐 Protect Entire Router
--------------------------*/
router.use(authenticateToken);
router.use(authorizeRoles("admin"));


// -------------------
// GET: Fetch chart data by type
// -------------------
router.get("/:type", async (req, res) => {
  const chartType = req.params.type;

  try {
    const chart = await ChartData.findOne({ type: chartType });
    if (!chart)
      return res.status(404).json({ message: `No data found for type ${chartType}` });

    res.status(200).json(chart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// -------------------
// POST: Seed all chart data (Admin only)
router.post("/seed", async (req, res) => {
  try {
    const charts = [ /* your data */ ];

    await ChartData.deleteMany();
    await ChartData.insertMany(charts);

    res.status(200).json({ message: "All chart data seeded successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to seed chart data", error });
  }
});

export default router;