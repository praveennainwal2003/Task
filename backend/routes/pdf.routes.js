const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Pdf = require("../models/pdf");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const redis = require("../utils/redisClient");


const uploadDir = path.join(__dirname, "..", "uploads", "pdfs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF allowed"));
    }
  },
});

router.post(
  "/upload",
  auth,
  role("academy"),
  upload.single("pdf"),
  async (req, res) => {
    try {
      const pdf = await Pdf.create({
        subjectName: req.body.subjectName,
        className: req.body.className,
        schoolName: req.body.schoolName,
        pdfUrl: `uploads/pdfs/${req.file.filename}`,
        uploadedBy: req.user.id,
      });

      res.json(pdf);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


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
