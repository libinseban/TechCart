

const Category = require("../../models/cart/category");
const Product = require("../../models/server/productModel");

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
    category,
  } = req.body;

  const productImages = req.uploadedImages;
  if (!productImages || productImages.length === 0) {
    return res.status(400).json({ message: "Product images are required" });
  }

  let foundCategory = await Category.findOne({ name: category });

  if (!foundCategory) {
    foundCategory = new Category({ name: category, level: 1 });
    await foundCategory.save();
  }

  console.log("Request Body:", req.body);
  console.log("Uploaded Images:", productImages);

  if (
    !title ||
    !price ||
    !discountPrice ||
    !discountPercentage ||
    !brand ||
    !color ||
    !category
  ) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields including category" });
  }

  console.log("Creating product...");

  try {
    const newProduct = new Product({
      title,
      description,
      price,
      discountPrice,
      discountPercentage,
      quantity,
      brand,
      color: color.split(","),
      productImages,
      category: foundCategory._id,
    });

    await newProduct.save();

    return res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error in createProduct controller:", error.message);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ message: "Error creating product", error: error.message });
    }
  }
};

const updateProduct = async (req, res) => {
  const allowedUpdates = [
    "title",
    "description",
    "price",
    "discountPrice",
    "brand",
    "color",
    "productImages",
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

    const productToUpdate = await Product.find({ _id: productId });
    console.log("Found Product:", productToUpdate);

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    console.log("Updated Product:", updatedProduct);

    if (!updatedProduct) {
      return res.status(404).json({
        error:
          "Product not found or you do not have permission to update this product",
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
  const productId = req.params.id;
  try {
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const findProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId).populate(
      "ratings reviews category"
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error in findProductById controller:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  const { category } = req.query;

  try {
    const filter = category ? { category } : {};
    const products = await Product.find(filter).populate("category");
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const createMultipleProducts = async (req, res) => {
  try {
    const products = await Product.insertMany(req.body);
    return res
      .status(201)
      .json({ message: "Products created successfully", products });
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
