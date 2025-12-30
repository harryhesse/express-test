const productRoutes = require("./modules/products/product.routes");

module.exports = (app) => {
  // Products routes (regular JSON body parsing for product routes)
  app.use("/products", productRoutes);
};
