const axios = require("axios");
require("dotenv").config();
const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

module.exports = (req, res) => {
  axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token`,
    headers: {
      accept: "application/json",
    },
    data: {
      client_id: clientID,
      client_secret: clientSecret,
      code: req.body.authorizationCode,
    }, //
  })
    .then((response) => {
      accessToken = response.data.access_token;
      console.log(res.data);
      res.status(200).json({ accessToken: accessToken }); // 토큰 전달
    })
    .catch((e) => {
      res.status(404);
    });
};
