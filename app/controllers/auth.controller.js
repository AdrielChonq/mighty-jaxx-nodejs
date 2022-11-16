var bcrypt = require("bcryptjs");
const db = require("../models");
const { accessToken: AccessToken, user: User } = db;

// api: sign up
exports.signup = async (req, res) => {
  try {
    const newUser = new User({
      email: req.body.email?.toLower(),
      password: bcrypt.hashSync(req.body.password, 8),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    let existUser = await User.findOne({
      email: req.body.email,
    });

    if (existUser) {
      return res
        .status(400)
        .send("Email already taken. Please try another email again.");
    }

    await newUser.save();

    res.send({ message: "Account registered successfully.", data: newUser });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// api: sign in
exports.signin = async (req, res) => {
  try {
    if (!req.body.email) return res.status(400).send("Email is required.");

    let user = await User.findOne({
      email: req.body.email?.toLowerCase(),
    });

    if (!user) {
      if (!user) return res.status(401).send("Incorrect email or password.");
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid)
      return res.status(401).send("Incorrect email or password.");

    let accessToken = await AccessToken.createToken(user.id);

    res.status(200).send({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      accessToken: accessToken.token,
      refreshToken: accessToken.refreshToken,
    });
  } catch (error) {
    return res.status(500).send(err.message);
  }
};

// api: sign out
exports.signout = (req, res) => {
  try {
    console.log("sign out access token", req.accessToken);
  } catch (error) {
    return res.status(500).send(err.message);
  }
};

// api: refresh token
exports.refreshToken = async (req, res) => {
  try {
    await AccessToken.findOneAndRemove({ refreshToken: req.refreshToken });

    let accessToken = await AccessToken.createToken(req.userId);

    return res.status(200).json({
      accessToken: accessToken.token,
      refreshToken: accessToken.refreshToken,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};
