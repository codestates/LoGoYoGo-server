const models = require("../models");
const { user, logo, preset } = models;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require("fs");

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
          name: req.body.username,
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

        const accessToken = jwt.sign(userInfo.dataValues, process.env.ACCESS_SECRET, {
          expiresIn: "1h",
        });
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
      res.status(404).json({ message: "check agin" });
    } else {
      user
        .update(
          {
            password: req.body.editpw,
          },

          { where: { email: userInfo.email } },
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

  save: async (req, res) => {
    const text = req.body.json;
    fs.writeFileSync("./save.txt", JSON.stringify(text));
    res.status(200).json({ text: text });
  },

  saveimg: async (req, res) => {
    const text = req.body.dataurl;
    fs.writeFileSync("./saveimg.txt", JSON.stringify(text));
    res.status(200).json({ text: text });
  },

  savelogo: async (req, res) => {
    const accessToken = req.body.accessToken;
    const json = req.body.json;
    const userinfo = jwt.verify(accessToken, process.env.ACCESS_SECRET);

    const users = await user.findOne({
      where: { email: userinfo.email },
    });

    logo.create({ userId: users.dataValues.id, name: users.dataValues.name, setting: `${json}` });
    res.status(200).json({ message: "ok" });
  },

  loadlogo: async (req, res) => {
    const accessToken = req.body.accessToken;
    const userinfo = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    const userId = userinfo.id;
    const logos = await logo.findAll({
      where: { userId: userId },
    });

    if (logos.length > 3) {
      logo.destroy({ where: { id: logos[0].id } });
    }

    res.status(200).json({ message: "ok", json: logos.slice(-1) });
  },
};
