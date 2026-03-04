import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  category: { type: String, required: true },
  minStock: { type: Number, default: 0 },
  
}, { timestamps: true });

const Material = mongoose.model("Material", materialSchema);
export default Material;
