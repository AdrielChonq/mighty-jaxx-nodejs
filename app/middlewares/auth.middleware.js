const jwt = require("jsonwebtoken");
const db = require("../models");
const { accessToken: AccessToken } = db;

verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  try {
    if (!token) return res.status(401).send("Unauthorized");

    let accessToken = await AccessToken.findOne({ token });

    if (!accessToken) return res.status(401).send("Unauthorized");

    let decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    req.accessToken = accessToken;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      await AccessToken.findOneAndRemove({ token });

      return res
        .status(401)
        .send("Unauthorized. Access token was expired.");
    }

    return res.status(401).send("Unauthorized");
  }
};

verifyRefreshToken = async (req, res, next) => {
  let refreshToken = req.headers["x-refresh-token"];

  try {
    if (!refreshToken) return res.status(401).send("Unauthorized");

    let accessToken = await AccessToken.findOne({ refreshToken });

    if (!accessToken) return res.status(401).send("Unauthorized");

    let decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    req.userId = decoded.id;
    req.refreshToken = refreshToken;
    next();
  } catch (err) {
    console.error('verifyRefreshToken', err);
    if (err instanceof jwt.TokenExpiredError) {
      await AccessToken.findOneAndRemove({ refreshToken });

      return res
        .status(401)
        .send("Unauthorized. Refresh token was expired.");
    }

    return res.status(401).send("Unauthorized");
  }
};

const authJwt = {
  verifyToken,
  verifyRefreshToken,
};

module.exports = authJwt;
