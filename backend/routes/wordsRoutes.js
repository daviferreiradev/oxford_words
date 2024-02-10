const express = require('express');
const router = express.Router();

const WordController = require('../controllers/WordController');

router.get('/words', WordController.getRandomWord);
router.get('/words/daily-review', WordController.getDailyReview);

router.post('/word/knew', WordController.handleKnewWord);
router.post('/word/didnt-know', WordController.handleDidntKnowWord);

module.exports = router;