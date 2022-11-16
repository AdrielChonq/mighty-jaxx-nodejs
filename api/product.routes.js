const controller = require("../app/controllers/product.controller");
const authJwt = require("../app/middlewares/auth.middleware");
const uploadMiddleware = require("../app/middlewares/upload.middleware");

module.exports = function (app) {
  app.get("/api/products", authJwt.verifyToken, controller.all);
  app.get("/api/products/:id", authJwt.verifyToken, controller.getById);
  app.post("/api/products", authJwt.verifyToken, controller.new);
  app.patch("/api/products/:id", authJwt.verifyToken, controller.update);
  app.delete("/api/products/:id", authJwt.verifyToken, controller.remove);

  app.post("/api/products/:id/image", authJwt.verifyToken, uploadMiddleware, controller.uploadImage);
  app.delete("/api/products/:id/image", authJwt.verifyToken, controller.removeImage);
  app.get("/image/products/:id", controller.getImage);
};
