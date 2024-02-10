const express = require('express');
const router = express.Router();

const PhraseController = require('../controllers/PhraseController');

router.get('/phrases', PhraseController.getRandomPhrase);
router.get('/phrase/daily-review', PhraseController.getDailyReview);

router.post('/phrase/knew', PhraseController.handleKnewPhrase);
router.post('/phrase/didnt-know', PhraseController.handleDidntKnowPhrase);

module.exports = router;