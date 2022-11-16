const moment = require("moment");
const { mongoose } = require("../models");
const db = require("../models");
const { product: Product } = db;

// api: get all products
exports.all = async (req, res) => {
  try {
    let currentPage = req.query.page || 1;
    let pageLimit = 5;

    if (req.query.query) {
      const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
      const searchRgx = rgx(req.query.query);

      let products = await Product.find({
        $or: [
          { title: { $regex: searchRgx, $options: "i" } },
          { sku: { $regex: searchRgx, $options: "i" } },
        ],
      })
        .limit(pageLimit)
        .sort([["createdAt", -1]])
        .skip(pageLimit * (currentPage - 1));

      let count = await Product.count({
        $or: [
          { title: { $regex: searchRgx, $options: "i" } },
          { sku: { $regex: searchRgx, $options: "i" } },
        ],
      });

      let totalPages = Math.ceil(count / pageLimit);
      res.send({
        data: products,
        totalData: count,
        currentPage: parseInt(currentPage),
        pages: totalPages,
        pageLimit,
        canNextPage: currentPage < totalPages,
        canPreviousPage: currentPage > 1,
      });
    } else {
      let products = await Product.find()
        .limit(pageLimit)
        .sort([["createdAt", -1]])
        .skip(pageLimit * (currentPage - 1));

      let count = await Product.count();

      let totalPages = Math.ceil(count / pageLimit);
      res.send({
        data: products,
        totalData: count,
        currentPage: parseInt(currentPage),
        pages: totalPages,
        pageLimit,
        canNextPage: currentPage < totalPages,
        canPreviousPage: currentPage > 1,
      });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// api: get product by id
exports.getById = async (req, res) => {
  try {
    let product = await Product.findOne(
      {
        _id: req.params.id,
      },
      req.body
    );

    if (product) {
      res.send({ message: "Product retrieve successfully.", data: product });
    } else {
      res.status(404).send("Product not found");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// api: create product
exports.new = async (req, res) => {
  try {
    if (!req.body.title) return res.status(400).send("Email is required.");
    if (!req.body.sku) return res.status(400).send("SKU is required.");

    const newProduct = new Product({
      title: req.body.title,
      sku: req.body.sku,
      createdAt: moment(),
    });

    let product = await Product.findOne({
      sku: req.body.sku,
    });

    if (product) {
      return res.status(400).send("SKU already exist. Please try another.");
    }

    await newProduct.save();

    res.send({ message: "Product added successfully.", data: newProduct });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// update product api
exports.update = async (req, res) => {
  try {
    if (req.body.sku) {
      let product = await Product.findOne({
        sku: req.body.sku,
      });

      if (product) {
        return res.status(400).send("SKU already exist. Please try another.");
      }
    }

    let existProduct = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body
    );

    if (!existProduct) res.status(404).send("Product not found");

    res.send({ message: "Product updated successfully.", data: existProduct });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// api: delete product
exports.remove = async (req, res) => {
  try {
    await Product.findOneAndRemove({
      _id: req.params.id,
    });

    res.send({ message: "Product removed successfully." });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// api: upload image file
exports.uploadImage = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send({ message: "Product not found." });
    }

    let product = await Product.findOne({
      _id: req.params.id,
    });

    if (!product) {
      return res.status(404).send({ message: "Product not found." });
    }

    if (!req.file) {
      return res.status(400).send({
        message: "Image is required.",
      });
    }

    let oldImageID = product.imageID || undefined;

    // update product image ID
    product.imageID = req.file.id?.toString();
    await product.save();

    if (oldImageID) {
      // remove image file and chunk record
      let gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "image",
      });
      gfs.delete(oldImageID);
    }

    res.send({
      message: "Image uploaded successfully.",
    });
  } catch (err) {
    res.status(500).send(`Error when trying upload image: ${err}`);
  }
};

// api: get image by id
exports.getImage = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).send({ message: "Image not found." });

    const _id = new mongoose.Types.ObjectId(req.params.id);

    let gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "image",
    });

    let files = gfs.find({ _id }).toArray();

    if (!files || files.length === 0)
      return res.status(404).send({ message: "Image not found." });

    gfs.openDownloadStream(_id).pipe(res);
  } catch (err) {
    return res.status(500).send(`Error when trying to read image: ${err}`);
  }
};

// api: delete image
exports.removeImage = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).send({ message: "Product not found." });

    const _id = new mongoose.Types.ObjectId(req.params.id);

    let product = await Product.findOne({
      _id: req.params.id,
    });

    if (!product)
      return res.status(404).send({ message: "Product not found." });

    // remove image file and chunk record
    let gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "image",
    });
    gfs.delete(product.imageID);

    // remove image ID key from the document
    product.imageID = undefined;
    await product.save();

    return res.send({
      message: "Image deleted successfully.",
    });
  } catch (err) {
    return res.status(500).send(`Error when trying delete image: ${err}`);
  }
};
