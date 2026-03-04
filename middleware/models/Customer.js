import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    gstNumber: { type: String }, // optional for construction clients
    companyName: { type: String }
  },
  { timestamps: true }
);


// ✅ Prevent OverwriteModelError
export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);