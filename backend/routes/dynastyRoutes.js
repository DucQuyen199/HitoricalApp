const express = require('express');
const router = express.Router();
const dynastyController = require('../controllers/dynastyController');

// Get all dynasties
router.get('/', dynastyController.getAllDynasties);

// Get dynasty by name
router.get('/:name', dynastyController.getDynastyByName);

// Get kings of a dynasty
router.get('/:name/kings', dynastyController.getDynastyKings);

// Route cho chi tiết vua
router.get('/:dynastyName/kings/:kingId', dynastyController.getKingDetail);

module.exports = router; 