import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ParserController from '../../controllers/parserController';
import { authenticate } from '../../middlewares/authMiddleware';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// multer({ storage: multer.memoryStorage() }).single('filee')

router.get('/test', authenticate, (req, res) => {
  res.json({ valid: true, user: req.user });
});

router.post('/', authenticate, upload.single('file'), ParserController.parseHTML);

export default router;
