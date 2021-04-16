const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const https = require("https");
const cookieParser = require("cookie-parser");
const user = require("./controllers/user");
const callback = require("./controllers/callback");
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  }),
);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

app.post("/user/signup", user.signup);
app.post("/user/signin", user.signin);
app.post("/user/signout", user.signout);
app.post("/user/editpw", user.editpw);
app.post("/user/userinfo", user.userinfo);
app.post("/user/deleteid", user.deleteid);

app.post("/callback", callback);

http.createServer(app).listen(5000, () => {
  console.log("server on 5000");
});

app.get("/", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.send("hellow world");
});
