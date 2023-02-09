const express = require("express");
const path = require("path");
const logger = require("morgan");
const app = express();
const session = require("express-session");
const nocache = require("nocache");

const db = require("./model/server");

const userRouter = require("./routes/userrouter");
const adminRouter = require("./routes/adminrouter");

app.use("/contents", express.static("contents"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(
  session({
    secret: "sessionkey",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 },
  })
);

app.use(nocache());

app.use(logger("dev"));

app.use(express());

db.connect((err) => {
  if (err) {
    console.log("error occured " + err);
  } else {
    console.log("data base connected successfully");
  }
});


app.use(express.urlencoded({ extended: false }));

app.use("/", userRouter);
app.use("/admin", adminRouter);

app.listen(3000);
