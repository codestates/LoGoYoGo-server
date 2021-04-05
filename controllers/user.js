const models = require("../models");
const { user, logo, preset } = models;
require("dotenv").config();

module.exports = {
  signup: async (req, res) => {
    const userInfo = await user.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (userInfo) {
      res.status(404).json({ message: "duplicated" });
    } else {
      user
        .create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        })
        .then(() => {
          res.status(200).json({ message: "ok" });
        });
    }
  },
};
