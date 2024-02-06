const Sequelize = require('sequelize');

const Word = require('../models/Word');

class WordController {
    static async getRandomWord(req, res) {
        try {
            const word = await Word.findOne({ 
                where: { 
                    stage: 'new' 
                },
                order: Sequelize.literal('rand()') 
            });
            
            res.render('randomWord', { word: word.dataValues });
        } catch (error) {
            res.status(500).send('Error occurred: ' + error.message);
        }
    };

    static async handleKnewWord(req, res) {
        const { wordId } = req.body;
        try {
            const word = await Word.findByPk(wordId);

            let nextReview = new Date();
            switch (word.stage) {
                case 'new':
                    nextReview.setDate(nextReview.getDate() + 1);
                    word.stage = '1 day';
                    break;
                case '1 day':
                    nextReview.setDate(nextReview.getDate() + 3);
                    word.stage = '3 days';
                    break;
                case '3 days':
                    nextReview.setDate(nextReview.getDate() + 7);
                    word.stage = '1 week';
                    break;
                case '1 week':
                    nextReview.setDate(nextReview.getDate() + 15);
                    word.stage = '15 days';
                    break;
                case '15 days':
                    nextReview.setDate(nextReview.getDate() + 30);
                    word.stage = '1 month';
                    break;
                case '1 month':
                    word.stage = 'learned';
                    break;
                default:
                    break;
            }
            word.nextReviewDate = nextReview;
            await word.save();
            res.redirect('/');
        } catch (error) {
            res.status(500).send('Error occurred: ' + error.message);
        }
    };

    static async handleDidntKnowWord(req, res) {
        const { wordId } = req.body;
        try {
            const word = await Word.findByPk(wordId);

            word.stage = 'new';
            await word.save();
            res.redirect('/');
        } catch (error) {
            res.status(500).send('Error occurred: ' + error.message);
        }
    };

    // Show all words that need to be reviewed today
    static async getDailyReview(req, res) {
        try {
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

            const words = await Word.findAll({
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
            res.render('dailyReview', { words });
        } catch (error) {
            res.status(500).send('Error occurred: ' + error.message);
        }
    }
}

module.exports = WordController;