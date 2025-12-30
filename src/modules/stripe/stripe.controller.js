const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

async function handleWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "invoice.paid":
      console.log("Invoice paid:", event.data.object);
      break;
    case "charge.refunded":
      console.log("Charge refunded:", event.data.object);
      break;
    case "customer.subscription.deleted":
      console.log("Subscription deleted:", event.data.object);
      break;
    case "payment_intent.succeeded":
      console.log("PaymentIntent succeeded:", event.data.object);
      break;
    case "payment_intent.payment_failed":
      console.log("PaymentIntent failed:", event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}

module.exports = { handleWebhook };
