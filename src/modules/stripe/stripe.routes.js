const express = require("express");
const router = express.Router();
const controller = require("./stripe.controller");
const bodyParser = require("body-parser");

// Use raw body only for this route
router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  controller.handleWebhook
);

module.exports = router;
