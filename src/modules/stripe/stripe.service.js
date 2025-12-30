const Stripe = require("stripe");

// Create ONE Stripe client (important for serverless)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createProduct({ name, description, price, metadata = {} }) {
  // 1. Create product in Stripe
  const product = await stripe.products.create({
    name,
    description,
    metadata,
  });

  // 2. Create price for product
  const stripePrice = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(price * 100), // dollars → cents
    currency: "usd",
  });

  return {
    stripeProductId: product.id,
    stripePriceId: stripePrice.id,
  };
}

async function updateProduct(stripeProductId, { name, description, price }) {
  // Update product details
  if (name || description) {
    await stripe.products.update(stripeProductId, { name, description });
  }

  // Create new price if price changed
  if (price) {
    const newPrice = await stripe.prices.create({
      product: stripeProductId,
      unit_amount: Math.round(price * 100), // dollars → cents
      currency: "usd",
    });
    return newPrice.id;
  }

  return null;
}

async function archiveProduct(stripeProductId) {
  await stripe.products.update(stripeProductId, { active: false });
}

module.exports = {
  createProduct,
  updateProduct,
  archiveProduct,
};
