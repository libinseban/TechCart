

const mongoose = require("mongoose");
const Seller = require("../../models/client/seller");
const Product = require("../../models/server/productModel");
const Category = require("../../models/cart/category");

const createProduct = async (req, res) => {
  const {
    title,
    description,
    price,
    discountPrice,
    discountPercentage,
    brand,
    color,
    category,
  } = req.body;

  const sellerId = req.cookies.sellerId
  
  console.log("Request Body:", req.body);
  
  const productImages = req.uploadedImages;

  if (!productImages || productImages.length === 0) {
    return res.status(400).json({ message: "Product images are required" });
  }

  let foundCategory = await Category.findOne({ name: category });

  if (!foundCategory) {
    foundCategory = new Category({ name: category, level: 1 });
    await foundCategory.save();
  }
  if (!title || !price || !discountPrice || !discountPercentage  || !brand || !color || !category||!productImages) {
    return res.status(400).json({ error: 'Please provide all required fields including category' });
  }
  if (discountPrice >= price || discountPercentage >= 100) {
    return res.status(400).json({ error: "Invalid discount values" });
  }

  try {
    const product = new Product({
      title,
      description,
      price,
      discountPrice,
      discountPercentage,
      brand,
      color,
      productImages,
      category:foundCategory._id,
      seller: sellerId,
    });

    const savedProduct = await product.save();

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    seller.product.push(savedProduct._id);
    await seller.save();

    return res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error in createProduct controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const updateProduct = async (req, res) => {
  const productId = req.params.productId
  const sellerId=req.cookies.sellerId
  const allowedUpdates = [
      "title",
      "description",
      "price",
      "discountPrice",
      "brand",
      "color",
      "productImages"
  ];

  const updates = Object.keys(req.body).reduce((acc, key) => {
      if (allowedUpdates.includes(key)) {
          acc[key] = req.body[key];
      }
      return acc;
  }, {});

  const newImages = req.uploadedImages;
  if (newImages && newImages.length > 0) {
      updates.productImages = newImages;
  }

  try {
    console.log("Updates to apply:", updates);
    
      const productToUpdate = await Product.find({ _id: productId, seller: sellerId });
      console.log("Found Product:", productToUpdate);
      
      const updatedProduct = await Product.findOneAndUpdate(
          { _id: productId, seller: sellerId },
          { $set: updates },
          { new: true, runValidators: true }
      );

      console.log("Updated Product:", updatedProduct);

      if (!updatedProduct) {
          return res.status(404).json({
              error: "Product not found or you do not have permission to update this product",
          });
      }

      return res.status(200).json({
          message: "Product updated successfully",
          product: updatedProduct,
      });
  } catch (error) {
      console.error("Error in updateProduct controller:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
  }
};


const deleteProduct = async (req, res) => {
  const productId = req.params.productId;
  const sellerId = req.cookies.sellerId;

  try {
    const product = await Product.findOneAndDelete({
      _id: productId,
      seller: sellerId,
    });

    if (!product) {
      return res
        .status(404)
        .json({
          error:
            "Product not found or you do not have permission to delete this product",
        });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const findProductById = async (req, res) => {
  const productId = req.params.productId;
  const sellerId = req.cookies.sellerId;

  console.log("product id", productId)
  console.log("seller id", sellerId)

  if (
    !mongoose.Types.ObjectId.isValid(productId) ||
    !mongoose.Types.ObjectId.isValid(sellerId)
  ) {
    return res.status(400).json({ error: "Invalid productId or sellerId" });
  }

  try {
    const product = await Product.findOne({ _id: productId, seller: sellerId });
    console.log(product);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error in findProductById controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllProducts = async (req, res) => {
  const sellerId = req.cookies.sellerId;

  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    return res.status(400).json({ error: "Invalid sellerId" });
  }

  try {
    const products = await Product.find({ seller: sellerId }).populate(
      "category"
    );
    console.log("Products retrieved:", products);
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error in getAllProducts controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createMultipleProducts = async (req, res) => {

  const { products } = req.body;

  const sellerId = req.cookies.sellerId
  
  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    return res.status(400).json({ error: "Invalid sellerId" });
  }

  try {
    const productsWithSeller = products.map((product) => ({
      ...product,
      seller: sellerId,
    }));

    const createdProducts = await Product.insertMany(productsWithSeller);

    const seller = await Seller.findById(sellerId);
    if (seller) {
      seller.product.push(...createdProducts.map((p) => p._id));
      await seller.save();
    }

    return res
      .status(201)
      .json({
        message: "Products created successfully",
        products: createdProducts,
      });
  } catch (error) {
    console.error("Error in createMultipleProducts controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
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
