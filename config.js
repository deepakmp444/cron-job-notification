require('dotenv').config();

module.exports = {
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017',
    DB_NAME: 'TESTAPP',
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    DEFAULT_DAY: 15,
    CRON_SCHEDULE: process.env.CRON_SCHEDULE || '1 0 * * *' // Default to 12:01 AM
};

console.log("email, pass", process.env.EMAIL_USER, process.env.EMAIL_PASS)
