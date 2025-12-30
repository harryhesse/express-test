const express = require("express");
const controller = require("./product.controller");

const router = express.Router();

router.post("/", controller.create);
router.get("/", controller.findAll);
router.put("/:id", controller.update);
router.get("/:id", controller.getById);
router.delete("/:id", controller.remove);

module.exports = router;
