// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import chartRoutes from "./routes/chartRoutes.js";
// import Material from "./models/Material.js";
// import materialsRouter from "./routes/materials.js";
// import dashboardOrdersRoutes from "./routes/dashboardOrders.js";
// import OrderManagement from "./models/OrderManagement.js";




// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use("/api/charts", chartRoutes);
// app.use("/api/materials", materialsRouter);
// app.use("/api/dashboard-orders", dashboardOrdersRoutes);






// // Connect MongoDB
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.error(err));

// // Schema + Model
// const orderSchema = new mongoose.Schema({
//   id: String,
//   customer: String,
//   product: String,
//   amount: String,
//   status: String,
//   date: String,
// });
// const Order = mongoose.model("Customer", orderSchema);


// // Seed route (for one-time use)
// // app.get("/api/seed", async (req, res) => {
// //   const sample = [
// //     { id: "5847", customer: "Rohan Patel", product: "Cement", amount: "₹ 1,250.00", status: "Pending", date: "2025-10-07" },
// //     { id: "5848", customer: "Neha Sharma", product: "Bricks", amount: "₹ 2,200.00", status: "Completed", date: "2025-10-06" },
// //     { id: "5849", customer: "Amit Verma", product: "Iron Rods", amount: "₹ 5,480.00", status: "Pending", date: "2025-10-06" },
// //     { id: "5850", customer: "Pooja Mehta", product: "River Sand", amount: "₹ 3,700.00", status: "Completed", date: "2025-10-06" },
// //     { id: "5851", customer: "Karan Singh", product: "Tiles", amount: "₹ 1,850.00", status: "Cancelled", date: "2025-10-06" }
// //   ];
// //   await Order.insertMany(sample);
// //   res.send("Sample data added successfully!");
// // });

// // Seed materials route (for one-time use)
// // app.get("/api/seed-materials", async (req, res) => {
// //   try {
// //     const sampleMaterials = [
// //       {
// //         name: "Cement",
// //         quantity: 120,
// //         unit: "bags",
// //         category: "Building Materials",
// //         minStock: 50,
// //         lastUpdated: "2025-10-15"
// //       },
// //       {
// //         name: "Sand",
// //         quantity: 80,
// //         unit: "tons",
// //         category: "Aggregates",
// //         minStock: 100,
// //         lastUpdated: "2025-10-18"
// //       },
// //       {
// //         name: "Iron Rods",
// //         quantity: 45,
// //         unit: "bundles",
// //         category: "Steel",
// //         minStock: 60,
// //         lastUpdated: "2025-10-10"
// //       },
// //       {
// //         name: "Bricks",
// //         quantity: 5000,
// //         unit: "pieces",
// //         category: "Building Materials",
// //         minStock: 3000,
// //         lastUpdated: "2025-10-19"
// //       }
// //     ];

// //     await Material.insertMany(sampleMaterials);
// //     res.send("Sample materials added successfully!");
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });
// // Seed dashboard orders route (for one-time use)

// // ✅ SEED DASHBOARD ORDERS (Run once, then comment out)
// app.get("/api/seed-dashboard-orders", async (req, res) => {
//   try {
//     // Clear existing orders
//     await OrderManagement.deleteMany({});

//     const sampleOrders = [
//       {
//         id: "ORD-1001",
//         type: "mine",
//         client: "N/A",
//         pair: "Cement/UNITS",
//         side: "Buy",
//         quantity: 50,
//         price: 420,
//         status: "open",
//       },
//       {
//         id: "ORD-1002",
//         type: "customers",
//         client: "Alpha Builders",
//         pair: "Bricks/UNITS",
//         side: "Sell",
//         quantity: 5000,
//         price: 0.15,
//         status: "completed",
//       },
//       {
//         id: "ORD-1003",
//         type: "customers",
//         client: "Beta Construction",
//         pair: "Iron Rods/KG",
//         side: "Buy",
//         quantity: 1000,
//         price: 55,
//         status: "cancelled",
//       },
//       {
//         id: "ORD-1004",
//         type: "mine",
//         client: "N/A",
//         pair: "Sand/TONS",
//         side: "Sell",
//         quantity: 30,
//         price: 1200,
//         status: "executed",
//       },
//       {
//         id: "ORD-1005",
//         type: "customers",
//         client: "Gamma Projects",
//         pair: "Tiles/UNITS",
//         side: "Buy",
//         quantity: 2000,
//         price: 25,
//         status: "open",
//       },
//       {
//         id: "ORD-1006",
//         type: "mine",
//         client: "N/A",
//         pair: "Cement/UNITS",
//         side: "Buy",
//         quantity: 100,
//         price: 410,
//         status: "completed",
//       },
//       {
//         id: "ORD-1007",
//         type: "customers",
//         client: "Delta Supplies",
//         pair: "Gravel/TONS",
//         side: "Sell",
//         quantity: 50,
//         price: 900,
//         status: "open",
//       },
//       {
//         id: "ORD-1008",
//         type: "mine",
//         client: "N/A",
//         pair: "Bricks/UNITS",
//         side: "Sell",
//         quantity: 10000,
//         price: 0.14,
//         status: "executed",
//       },
//     ];
//     const savedOrders = await OrderManagement.insertMany(sampleOrders);
//     res.json({
//       message: "Sample dashboard orders seeded successfully!",
//       count: savedOrders.length,
//       data: savedOrders,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // API route
// app.get("/api/orders", async (req, res) => {
//   const orders = await Order.find();
//   res.json(orders);
// });

// app.listen(5000, () => console.log("Server running on port 5000"));


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import chartRoutes from "./routes/chartRoutes.js";
import materialsRouter from "./routes/materials.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import dashboardOrdersRoutes from "./routes/dashboardOrders.js";
import transportationRoutes from "./routes/transportation.js";
import authRoutes from "./routes/auth.js";
import emailRoutes from "./routes/email.js";
import invoicesRouter from "./routes/invoices.js";
import Material from "./middleware/models/Material.js";
import OrderManagement from "./middleware/models/OrderManagement.js";
import customerRoutes from "./routes/customerRoutes.js";



// Load environment variables
dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase payload limit for PDF data
app.use("/api/charts", chartRoutes);
app.use("/api/materials", materialsRouter);
app.use("/api/dashboard-orders", dashboardOrdersRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/transportation", transportationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/invoices", invoicesRouter);
app.use("/api/customers", customerRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Schema + Model
const orderSchema = new mongoose.Schema({
  id: String,
  customer: String,
  product: String,
  amount: String,
  status: String,
  date: String,
});
const Order = mongoose.model("Order", orderSchema);


app.get("/", (req, res) => res.send("API is running"));


// API route
app.get("/api/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running on port 5000" });
});

app.listen(5000, '0.0.0.0', () => console.log("Server running on port 5000"));
