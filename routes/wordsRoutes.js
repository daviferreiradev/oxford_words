const express = require('express');
const router = express.Router();

const WordController = require('../controllers/WordController');

router.get('/', WordController.getRandomWord);

router.get('/daily-review', WordController.getDailyReview);

router.post('/word/knew', WordController.handleKnewWord);

router.post('/word/didnt-know', WordController.handleDidntKnowWord);

module.exports = router;