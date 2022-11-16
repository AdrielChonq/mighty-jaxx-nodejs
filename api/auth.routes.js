const controller = require("../app/controllers/auth.controller");
const authJwt = require("../app/middlewares/auth.middleware");

module.exports = function (app) {
  app.post("/api/auth/signup", controller.signup);
  app.post("/api/auth/signin", controller.signin);
  app.post(
    "/api/auth/refresh-token",
    authJwt.verifyRefreshToken,
    controller.refreshToken
  );
};
