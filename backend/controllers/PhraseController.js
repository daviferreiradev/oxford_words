const Sequelize = require('sequelize');

const Phrase = require('../models/Phrase');

class PhraseController {
    static async getRandomPhrase(req, res) {
        try {
            const phrase = await Phrase.findOne({ 
                where: { 
                    stage: 'new' 
                },
                order: Sequelize.literal('rand()') 
            });
            
            res.render('randomPhrase', { phrase: phrase.dataValues });
        } catch (error) {
            res.status(500).send('Error occurred: ' + error.message);
        }
    };

    static async handleKnewPhrase(req, res) {
        const { phraseId } = req.body;
        try {
            const phrase = await Phrase.findByPk(phraseId);

            let nextReview = new Date();
            switch (phrase.stage) {
                case 'new':
                    nextReview.setDate(nextReview.getDate() + 1);
                    phrase.stage = '1 day';
                    break;
                case '1 day':
                    nextReview.setDate(nextReview.getDate() + 3);
                    phrase.stage = '3 days';
                    break;
                case '3 days':
                    nextReview.setDate(nextReview.getDate() + 7);
                    phrase.stage = '1 week';
                    break;
                case '1 week':
                    nextReview.setDate(nextReview.getDate() + 15);
                    phrase.stage = '15 days';
                    break;
                case '15 days':
                    nextReview.setDate(nextReview.getDate() + 30);
                    phrase.stage = '1 month';
                    break;
                case '1 month':
                    phrase.stage = 'learned';
                    break;
                default:
                    break;
            }
            phrase.nextReviewDate = nextReview;
            await phrase.save();
            res.redirect('/');
        } catch (error) {
            res.status(500).send('Error occurred: ' + error.message);
        }
    };

    static async handleDidntKnowPhrase(req, res) {
        const { phraseId } = req.body;
        try {
            const phrase = await Phrase.findByPk(phraseId);

            phrase.stage = 'new';
            await phrase.save();
            res.redirect('/');
        } catch (error) {
            res.status(500).send('Error occurred: ' + error.message);
        }
    };

    static async getDailyReview(req, res) {
        try {
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

            const phrases = await Phrase.findAll({
                where: {
                    nextReviewDate: {
                        [Sequelize.Op.gte]: startOfDay,
                        [Sequelize.Op.lt]: endOfDay 
                    }
                },
                order: [
                    ['nextReviewDate', 'ASC']
                ]
            });
            
            res.render('dailyReview', { phrases });
        } catch (error) {
            res.status(500).send('Error occurred: ' + error.message);
        }
    }
}

module.exports = PhraseController;