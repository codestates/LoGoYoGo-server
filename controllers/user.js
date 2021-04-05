const models = require("../models");
const { user, logo, preset } = models;
const jwt = require("jsonwebtoken");
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

  signin: async (req, res) => {
    const userInfo = await user.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!userInfo) {
      res.status(404).json({ message: "undefined" });
    } else {
      if (userInfo.dataValues.password !== req.body.password) {
        res.status(404).json({ message: "fail" });
      } else {
        delete userInfo.dataValues.password;
        const accessToken = jwt.sign(
          userInfo.dataValues,
          process.env.ACCESS_SECRET,
          { expiresIn: "1h" }
        );
        res.status(200).json({ accessToken: accessToken, message: "ok" });
      }
    }
  },

  signout: async (req, res) => {
    res.status(200).json({ message: "ok" });
  },

  editpw: async (req, res) => {
    const accessToken = req.body.accessToken;
    const userInfo = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    const users = await user.findOne({
      where: {
        email: userInfo.email,
      },
    });
    if (req.body.password !== users.dataValues.password) {
      console.log("###########", req.body.password, users.dataValues.password);
      res.status(404).json({ message: "check agin" });
    } else {
      user
        .update(
          {
            password: req.body.editpw,
          },
          { where: { email: userInfo.email } }
        )
        .then(() => {
          res.status(200).json({ message: "ok" });
        });
    }
  },

  userinfo: async (req, res) => {
    const accessToken = req.body.accessToken;
    const userinfo = jwt.verify(accessToken, process.env.ACCESS_SECRET);

    res.status(200).json({ message: "ok", data: userinfo });
  },

  deleteid: async (req, res) => {
    const accessToken = req.body.accessToken;
    const userInfo = jwt.verify(accessToken, process.env.ACCESS_SECRET);

    console.log(userInfo);

    user
      .destroy({
        where: {
          email: userInfo.email,
        },
      })
      .then(() => {
        res.status(200).json({ message: "ok" });
      });
  },
};
