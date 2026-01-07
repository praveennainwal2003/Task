const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

/* ================== CORS ================== */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://heroic-daffodil-c9f700.netlify.app",
    ],
    credentials: true,
  })
);

/* ================== MIDDLEWARE ================== */
app.use(express.json());

/* ================== ROOT ================== */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ================== DATABASE ================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

/* ================== ROUTES ================== */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/pdfs", require("./routes/pdf.routes"));

/* ================== SERVER ================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
