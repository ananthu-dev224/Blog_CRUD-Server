const express = require("express");
const cors = require("cors");
const session = require('express-session')
require("dotenv").config();
const userRoutes = require('./routes/userRoute')
const db = require("./config/db")

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);
db()
app.use("/user",userRoutes);


app.listen(port, () => {
  console.log(`Server starts at http://localhost:${port}`);
});