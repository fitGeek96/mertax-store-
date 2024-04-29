import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public

const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip((page - 1) * pageSize);
  res.send({
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Fetch a product
// @route   GET /api/products/:id
// @access  Public

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404);
    throw new Error("Product Not Found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    user: req.user.id,
    name: "Sample name",
    price: 0,
    image: "/images/sample.jpg",
    description: "Sample description",
    category: "Sample Category",
    brand: "Sample Brand",
    countInStock: 0,
    rating: 0,
    numReviews: 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update Prodcut
// @route   PUT /api/products/:id
// @access  Private/Admin

const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    category,
    brand,
    image,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.category = category;
    product.brand = brand;
    product.image = image;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.send(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product Not Found");
  }
});

// @desc    Delete Prodcut
// @route   DELETE /api/products/:id
// @access  Private/Admin

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      message: "Article supprimé avec succès",
    });
  } else {
    res.status(404);
    throw new Error("Product Not Found");
  }
});

// @desc    Create a New Review
// @route   POST /api/products/:id/reviews
// @access  Private/Admin

const createdProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewd = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewd) {
      res.status(400).json({
        success: false,
        message: "Vous avez déjà évalué ce produit",
      });
    } else {
      const newReview = {
        user: req.user?._id,
        name: req.user?.username,
        product,
        rating: Number(rating),
        comment,
      };

      product.reviews.push(newReview);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({
        success: true,
        message: "Votre évaluation a bien été prise en compte",
      });
    }
  } else {
    res.status(404);
    throw new Error("Produit introuvable");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public

const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json(products);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createdProductReview,
  getTopProducts,
};
