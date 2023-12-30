const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Routes = require("./routes/route");
const formRoutes = require("./routes/formRoute");
const cookieParser = require("cookie-parser");
const { requireAuth } = require("./middleware/requireAuth");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
dotenv.config();

// DB connection
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));



// Routes
app.use("/",Routes);
app.use("/form",requireAuth,formRoutes);

// Listen
app.listen(PORT, () => {
  console.log(`The server is listening at http://localhost:${PORT}`);
});
