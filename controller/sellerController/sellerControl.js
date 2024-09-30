const mongoose = require('mongoose');
const Seller = require('../../models/client/seller');
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
      category,
     sellerId
    } = req.body;
  
    if (!title || !price || !quantity || !brand || !color ) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
  
    // Example Discount Validation
    if (discountPrice >= price || discountPercentage >= 100) {
      return res.status(400).json({ error: 'Invalid discount values' });
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
        category,
        seller:sellerId 
      });
  
      const savedProduct = await product.save();
  
      const seller = await Seller.findById(sellerId);
      if (!seller) {
        return res.status(404).json({ error: 'Seller not found' });
      }
      seller.product.push(savedProduct._id);
      await seller.save();
  
      return res.status(201).json(savedProduct);
    } catch (error) {
      console.error("Error in createProduct controller:", error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const sellerId = req.body.sellerId; 

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, seller: sellerId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found or you do not have permission to update this product' });
    }

    return res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error("Error in updateProduct controller:", error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  const sellerId = req.body.sellerId; 

  try {
    const product = await Product.findOneAndDelete({ _id: productId, seller: sellerId });

    if (!product) {
      return res.status(404).json({ error: 'Product not found or you do not have permission to delete this product' });
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error in deleteProduct controller:", error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



const findProductById = async (req, res) => {
  const productId = req.params.id; 
  const sellerId = req.body.sellerId; 


  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(sellerId)) {
    return res.status(400).json({ error: 'Invalid productId or sellerId' });
  }

  try {
      const product = await Product.findOne({ _id: productId, seller: sellerId });
      console.log(product)
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error in findProductById controller:", error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getAllProducts = async (req, res) => {
    const sellerId = req.params.sellerId;
    console.log("SellerId received:", sellerId); // Debugging
  
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ error: 'Invalid sellerId' });
    }
  
    try {
      const products = await Product.find({ seller: sellerId }).populate('category');
      console.log("Products retrieved:", products); // Debugging
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error in getAllProducts controller:", error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const createMultipleProducts = async (req, res) => {
    const { sellerId, products } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ error: 'Invalid sellerId' });
    }
  
    try {
      // Ensure sellerId is added to each product
      const productsWithSeller = products.map(product => ({
        ...product,
        seller: sellerId // Add sellerId to each product
      }));
  
      const createdProducts = await Product.insertMany(productsWithSeller);
  
      // Optional: Add product IDs to seller document
      const seller = await Seller.findById(sellerId);
      if (seller) {
        seller.product.push(...createdProducts.map(p => p._id));
        await seller.save();
      }
  
      return res.status(201).json({ message: "Products created successfully", products: createdProducts });
    } catch (error) {
      console.error("Error in createMultipleProducts controller:", error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
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
