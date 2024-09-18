const express = require("express");
const dotenv = require("dotenv");
const createError = require("http-errors");
const userRoute = require("./routes/user.route");
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
const connect = require("./config/connections");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/user", userRoute);

// Error handling
app.use((req, res, next) => {
  //const error = new Error("Not found");
  //error.status = 500;
  //next(error);
  next(createError.NotFound("This route does not exist"));
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      status: error.status,
      message: error.message,
    },
  });
});

// Connect to MongoDB
connect();

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
