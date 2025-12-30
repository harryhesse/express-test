const productService = require("./product.service");

async function create(req, res) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function findAll(req, res) {
  const products = await productService.getProducts();
  res.json(products);
}

async function update(req, res) {
  try {
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  create,
  findAll,
  update,
  getById,
  remove,
};
