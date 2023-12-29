const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());
const userRoutes = require("./routes/users.routes");
const connectToDb = require("./db/connection");
app.use(cors());
app.use("/users", userRoutes);
app.use((err, req, res, next) => {
  if (err.statuscode) {
    return res.status(err.statuscode).json({
      error: true,
      message: err.message,
    });
  }
  if (err.code === 11000) {
    if (err.message.includes("email")) {
      return res
        .status(401)
        .json({ error: true, message: "Email already Exists" });
    } else {
      return res
        .status(401)
        .json({ error: true, message: "Mobile number already Exists" });
    }
  }
  res.status(500).json({
    error: true,
    message: err.message,
  });
});

const startServer = async () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log("server running on port " + process.env.PORT);
    });

    await connectToDb(process.env.URL);
    console.log("db connected");
  } catch (err) {
    console.log(err.message);
  }
};

startServer();
