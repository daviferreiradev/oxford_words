const { DataTypes } = require('sequelize');

const db = require('../db/conn');

const Word = db.define('Word', {
    word: {
        type: DataTypes.STRING,
        required: true,
    },
    level: {
        type: DataTypes.ENUM,
        values: ['A1', 'A2', 'B1', 'B2', 'C1'],
        allowNull: false
    },
    stage: {
        type: DataTypes.ENUM,
        values: ['new', '1 day', '3 days', '1 week', '15 days', '1 month', 'learned'],
        defaultValue: 'new'
    },
    nextReviewDate: {
    type: DataTypes.DATE
    }
});

module.exports = Word;