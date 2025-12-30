if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); // Loads environment variables in dev mode
}

const express = require("express");
const mongoose = require("mongoose");
const registerRoutes = require("./routes");
const stripeRoutes = require("./modules/stripe/stripe.routes");
const bodyParser = require("body-parser");

const app = express();

// Stripe webhook route (must use raw body for Stripe signature verification)
app.use("/webhooks/stripe", stripeRoutes);

// Global middleware for all routes (regular JSON parsing)
app.use(express.json());

// Healthcheck route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch(console.error);

// Register routes (including stripe webhook route)
registerRoutes(app);

module.exports = app;
