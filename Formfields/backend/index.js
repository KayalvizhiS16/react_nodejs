const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Routes = require("./routes/route");
const formRoutes = require("./routes/formRoute");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;
dotenv.config();

// DB connection
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

// Middleware to check and process authorization header
app.use((req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    // Assuming you're using a Bearer token, you can extract it like this:
    req.token = token.split(" ")[1];
  }

  next();
});

// Routes
app.use("/", Routes);
app.use("/form", formRoutes);

// Listen
app.listen(PORT, () => {
  console.log(`The server is listening at http://localhost:${PORT}`);
});
