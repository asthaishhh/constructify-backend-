import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  product: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  date: { type: String, default: new Date().toISOString().split("T")[0] }
});

export default mongoose.model("Order", orderSchema);
