import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
 customer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Customer",
  required: true
},
  status: { type: String, required: true, enum: ['pending', 'paid', 'completed'] },
  materials: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true }
  }],
  amount: { type: Number, required: true },
  date: { type: String, required: true },
}, { timestamps: true });





// ✅ Prevent OverwriteModelError

export default mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

