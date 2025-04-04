const chalk = require('chalk');
const cron = require('node-cron');
const { connectToDB, closeConnection } = require('./db');
const { sendEmails } = require('./mailer');
const { getModulesDueToday } = require('./deadlineProcessor');

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

        if (!Array.isArray(setting.Environment)) {
            console.log(chalk.red('❌ Environment modules missing in setting.'));
            return;
        }

        const emailList = users.map(user => user.EmailID);
        const modulesDueToday = getModulesDueToday(setting.Environment);

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

// Schedule for 9 AM every day
cron.schedule('0 9 * * *', () => {
    console.log(chalk.magenta('🔄 Running scheduled task at 9AM...'));
    main();
});

// Optional: run once immediately
main();
