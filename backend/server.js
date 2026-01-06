const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:");
    console.error(err.message);
  });


app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/pdfs", require("./routes/pdf.routes"));

app.listen(5000, () => console.log("Server running on port 5000"));
