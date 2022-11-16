const mongoose = require("mongoose");

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    title: String,
    sku: String,
    imageID: {
      type: mongoose.Schema.Types.ObjectId
    },
    createdAt: Date,
  })
);

module.exports = Product;