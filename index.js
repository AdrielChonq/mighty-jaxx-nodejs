const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var bcrypt = require("bcryptjs");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const User = require("./app/models/user.model");

db.mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Successfully connect to MongoDB.");

    let testUser = await User.exists({ email: "tester@mail.com" });

    if (!testUser) {
      const newUser = new User({
        email: "tester@mail.com",
        password: bcrypt.hashSync("P@ssw0rd1234"),
        firstName: "Mr",
        lastName: "Tester",
      });

      await newUser.save();
    }
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Server is up." });
});

// routes
require("./api/auth.routes")(app);
require("./api/product.routes")(app);

// set port, listen for requests
app.listen(process.env.PORT || 8081, () => {
  console.log(`Server is running on port 8081.`);
});

// export the express API
module.exports = app;
