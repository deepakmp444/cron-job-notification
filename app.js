const chalk = require('chalk');
const cron = require('node-cron');
const { connectToDB, closeConnection } = require('./db');
const { sendEmails } = require('./mailer');
const { getModulesDueToday } = require('./deadlineProcessor');
const { CRON_SCHEDULE } = require('./config');

const main = async () => {
    const db = await connectToDB();
    try {
        const settingsCol = db.collection('Setting');
        const usersCol = db.collection('User');

        const setting = await settingsCol.findOne({ IsDeleted: 0, Status: 1 });
        const users = await usersCol.find({ IsDeleted: 0, Status: 1 }).toArray();

        if (!setting || !users.length > 0) {
            console.log(chalk.yellow('⚠️  No active settings or users found.'));
            return;
        }

        console.log("setting.Environment", setting.Environment)
        if (!Array.isArray(setting.Environment)) {
            console.log(chalk.red('❌ Environment modules missing in setting.'));
            return;
        }

        const emailList = users.map(user => user.EmailID);
        console.log("emailList", emailList)
        const modulesDueToday = getModulesDueToday(setting.Environment);
        console.log("modulesDueToday", modulesDueToday)
        if (modulesDueToday.length > 0) {
            console.log(chalk.green(`📢 Modules due today: ${modulesDueToday.map(m => m.Module).join(', ')}`));
            sendEmails(emailList, modulesDueToday);
        } else {
            console.log(chalk.blue('✅ No modules due today.'));
        }
    } catch (err) {
        console.error(chalk.red('💥 Error in cron job:'), err);
    } finally {
        await closeConnection();
        console.log(chalk.yellow('🔌 MongoDB connection closed.'));
    }
}

// Schedule for 12:01 AM every day (configurable via CRON_SCHEDULE env variable)
cron.schedule(CRON_SCHEDULE, () => {
    console.log(chalk.magenta(`🔄 Running scheduled task at ${CRON_SCHEDULE}...`));
    main();
});

// Optional: run once immediately
main();
