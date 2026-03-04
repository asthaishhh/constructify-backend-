import mongoose from "mongoose";

const ChartDataSchema = new mongoose.Schema({
  type: { type: String, required: true },  // like 'revenue', 'sales', etc.
  data: { type: Array, required: true },   // your chart array
}, { timestamps: true });

export default mongoose.model("ChartData", ChartDataSchema);
