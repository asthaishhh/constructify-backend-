import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema({
  vehicleNo: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  capacity: { type: String, required: true },
  status: {
    type: String,
    enum: ["Available", "On Route", "Maintenance", "Inactive", "Standby"],
    default: "Available",
  },
  driver: { type: String },
  lastMaintenance: { type: Date },
  fuelLevel: { type: String },
});

const Vehicle = mongoose.model("Vehicle", VehicleSchema);

export default Vehicle;
