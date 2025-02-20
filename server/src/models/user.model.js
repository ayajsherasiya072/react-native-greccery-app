import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "admin", "deliverypartner"],
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
});

const customerSchema = new mongoose.Schema(
  {
    ...userSchema.obj,
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer"],
      default: "customer",
    },
    location: {
      latitute: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

const deliverypartnerSchema = new mongoose.Schema(
  {
    ...userSchema.obj,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      enum: ["deliverypartner"],
      default: "deliverypartner",
    },
    livelocation: {
      latitute: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    address: {
      type: String,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
  },
  { timestamps: true }
);

const adminSchema = new mongoose.Schema(
  {
    ...userSchema.obj,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);
export const Admin = mongoose.model("Admin", adminSchema);
export const DeliveryPartner = mongoose.model(
  "DeliveryPartner",
  deliverypartnerSchema
);
