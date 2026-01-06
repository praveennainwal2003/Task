const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  subjectName: String,
  className: String,
  schoolName: String,
  pdfUrl: String,
  uploadedBy: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model("Pdf", pdfSchema);
