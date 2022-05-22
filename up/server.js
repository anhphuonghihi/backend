const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(port, () =>
  console.log("> Server is up and running on port : " + port)
);

const colors = require("colors");
const mongoose = require("mongoose");
mongoose
  .connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log("> Connected...".bgCyan))
  .catch((err) =>
    console.log(
      `> Error while connecting to mongoDB : ${err.message}`.underline.red
    )
  );
const cors = require("cors")
app.use(cors())
app.use("/public/upload", express.static(__dirname+"/public/upload"));
const productRouter = require("./routers/productRouter");
app.use(productRouter);
const categoryRouter = require("./routers/categoryRouter");
app.use(categoryRouter);
const userRouter = require("./routers/userRouter");
app.use(userRouter);
const orderRouter = require("./routers/orderRouter");
app.use(orderRouter);
