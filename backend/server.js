const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

/* ================== MIDDLEWARE ================== */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ================== ROOT HEALTH CHECK ================== */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ================== DATABASE ================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:");
    console.error(err.message);
  });

/* ================== ROUTES ================== */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/pdfs", require("./routes/pdf.routes"));

/* ================== SERVER ================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
