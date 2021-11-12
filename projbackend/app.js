require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");

// middlewares - 3
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// // routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product");

const app = express();

// DB connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log(`DB CONNECTED TO -> ${process.env.DATABASE}`))
  .catch(() => {
    console.log("OOPS");
  });

//Using middleware in our app
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes
app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", categoryRoute);
app.use("/api", productRoute);

//Startina a server
app.listen(5000, () => {
  console.log(`App is listening at ${5000}`);
});
