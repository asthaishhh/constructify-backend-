import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  experience: { type: Number, required: true },
  salary: { type: Number, required: true },
  shift: { type: String, required: true },
  contact: { type: String, required: true },
  photo: { type: String },
}, { timestamps: true });

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
