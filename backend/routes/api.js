const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const dynastyController = require('../controllers/dynastyController');
const analyzeController = require('../controllers/analyzeController');
const multer = require('multer');

// Cấu hình multer để lưu vào memory thay vì disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file hình ảnh'));
    }
  }
});

// Test route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is working'
  });
});

// Chat route với upload ảnh vào memory
router.post('/chat', upload.single('image'), (req, res) => chatController.handleChat(req, res));

// Dynasty routes
router.get('/dynasties', (req, res) => dynastyController.getAllDynasties(req, res));
router.get('/dynasties/:name', (req, res) => dynastyController.getDynastyDetail(req, res));
router.get('/dynasties/:name/kings', (req, res) => dynastyController.getDynastyKings(req, res));

// Analysis route
router.post('/analyze', (req, res) => analyzeController.analyzeContent(req, res));

module.exports = router; 