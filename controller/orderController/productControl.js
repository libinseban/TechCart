const Product = require('../../models/server/productModel');

const createProduct = async (req, res) => {
  const { 
    title, 
    description, 
    price, 
    discountPrice, 
    discountPercentage, 
    quantity, 
    brand, 
    color, 
    imageUrl,
    category 
  } = req.body;

  console.log("Request Body:", req.body);

  if (!title || !price || !discountPrice || !discountPercentage || !quantity || !brand || !color || !category) {
    return res.status(400).json({ error: 'Please provide all required fields including category' });
  }

  try {
    const product = new Product({
      title,
      description,
      price,
      discountPrice,
      discountPercentage,
      quantity,
      brand,
      color,
      imageUrl,
      category // Save the category as a string
    });

    await product.save();
    return res.status(201).json(product);
  } catch (error) {
    console.error("Error in createProduct controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};


const updateProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error("Error in updateProduct controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error in deleteProduct controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const findProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId).populate('ratings reviews category');
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error in findProductById controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
      const products = await Product.find()
      return res.status(200).json(products);
  } catch (error) {
      console.error("Error in getAllProducts controller:", error.message);
      return res.status(500).json({ error: error.message });
  }
};
const createMultipleProducts = async (req, res) => {
  try {
    const products = await Product.insertMany(req.body);
    return res.status(201).json({ message: "Products created successfully", products });
  } catch (error) {
    console.error("Error in createMultipleProducts controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  findProductById,
  getAllProducts,
  createMultipleProducts,
};
