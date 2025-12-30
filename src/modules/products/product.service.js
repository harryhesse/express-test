const Product = require("./product.model");
const stripeService = require("../stripe/stripe.service");

async function createProduct(data) {
  // 1. Create product in DB first
  const product = await Product.create(data);

  // 2. Create product in Stripe
  const stripeData = await stripeService.createProduct({
    name: product.name,
    description: product.description,
    price: product.price,
    metadata: {
      appProductId: product._id.toString(),
    },
  });

  // 3. Save Stripe IDs
  product.stripeProductId = stripeData.stripeProductId;
  product.stripePriceId = stripeData.stripePriceId;
  await product.save();

  return product;
}

async function getProducts() {
  return Product.find();
}

async function updateProduct(productId, updateData) {
  // 1️⃣ Fetch product
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  // 2️⃣ Update MongoDB fields
  const { name, description, price } = updateData;
  if (name) product.name = name;
  if (description) product.description = description;
  if (price) product.price = price;

  // 3️⃣ Update Stripe product & price
  if (product.stripeProductId) {
    const newStripePriceId = await stripeService.updateProduct(
      product.stripeProductId,
      {
        name,
        description,
        price,
      }
    );

    if (newStripePriceId) product.stripePriceId = newStripePriceId;
  }

  // 4️⃣ Save changes
  await product.save();

  return product;
}

async function getProductById(productId) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");
  return product;
}

async function deleteProduct(productId) {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  // Always archive (soft delete)
  product.active = false;
  await product.save();

  // Archive in Stripe
  if (product.stripeProductId) {
    await stripeService.archiveProduct(product.stripeProductId);
  }

  return { message: "Product archived successfully", product };
}

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  getProductById,
  deleteProduct,
};
