const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    active: { type: Boolean, default: true },

    stripeProductId: String,
    stripePriceId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
