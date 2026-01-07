const router = require("express").Router();
const multer = require("multer");
const Pdf = require("../models/pdf");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const redis = require("../utils/redisClient");

/* ===== MULTER (MEMORY STORAGE – RENDER SAFE) ===== */
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
        pdfUrl: req.file.originalname, // placeholder (S3/Cloudinary ready)
        uploadedBy: req.user.id,
      });

      res.json({ msg: "PDF uploaded", pdf });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

/* ===== STUDENT SEARCH ===== */
router.get("/", auth, async (req, res) => {
  try {
    Object.keys(req.query).forEach(
      (k) => req.query[k] === "" && delete req.query[k]
    );

    const key = `pdfs:${JSON.stringify(req.query)}`;

    if (redis) {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }

    const data = await Pdf.find(req.query);

    if (redis && data.length > 0) {
      await redis.set(key, JSON.stringify(data), { EX: 3600 });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
