const router = require("express").Router();
const multer = require("multer");
const Pdf = require("../models/pdf");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

/* ===== MULTER (MEMORY STORAGE) ===== */
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF allowed"));
    }
  },
});

/* ===== ACADEMY UPLOAD ===== */
router.post(
  "/upload",
  auth,
  role("academy"),
  upload.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: "No PDF uploaded" });
      }

      const pdf = await Pdf.create({
        subjectName: req.body.subjectName,
        className: req.body.className,
        schoolName: req.body.schoolName,
        pdfUrl: req.file.originalname,
        uploadedBy: req.user.id,
      });

      res.json({ msg: "PDF uploaded successfully", pdf });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

/* ===== STUDENT SEARCH ===== */
router.get("/", auth, async (req, res) => {
  try {
    // remove empty query values
    Object.keys(req.query).forEach(
      (k) => req.query[k] === "" && delete req.query[k]
    );

    const searchQuery = {};

    if (req.query.subjectName) {
      searchQuery.subjectName = {
        $regex: req.query.subjectName,
        $options: "i",
      };
    }

    if (req.query.className) {
      searchQuery.className = {
        $regex: req.query.className,
        $options: "i",
      };
    }

    if (req.query.schoolName) {
      searchQuery.schoolName = {
        $regex: req.query.schoolName,
        $options: "i",
      };
    }

    const data = await Pdf.find(searchQuery);
    res.json(data);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;