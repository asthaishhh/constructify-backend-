import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNo: { type: String, required: true, unique: true },
  experience: { type: Number, default: 0 },
  contact: { type: String, required: true },
  assignedVehicle: { type: String },
  route: { type: String },
  status: {
    type: String,
    enum: ["Active", "On Route", "Inactive"],
    default: "Active",
  },
});

const Driver = mongoose.model("Driver", DriverSchema);

export default Driver;
