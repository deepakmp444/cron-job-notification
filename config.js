require('dotenv').config();

module.exports = {
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017',
    DB_NAME: 'TESTAPP',
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    DEFAULT_DAY: 15
};
