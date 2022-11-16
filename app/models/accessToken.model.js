const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const AccessTokenSchema = new mongoose.Schema({
  token: String,
  refreshToken: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});


// API: create new token
AccessTokenSchema.statics.createToken = async function (userId) {
  let token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.JWT_EXPIRATION),
  });

  let refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRATION),
  });

  let _object = new this({
    token,
    refreshToken,
    user: mongoose.Types.ObjectId(userId),
  });

  let accessToken = await _object.save();

  return accessToken;
};

const AccessToken = mongoose.model("AccessToken", AccessTokenSchema);

module.exports = AccessToken;