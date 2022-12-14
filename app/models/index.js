const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.accessToken = require("./accessToken.model");
db.product = require("./product.model");

module.exports = db;
