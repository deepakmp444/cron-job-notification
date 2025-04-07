const chalk = require('chalk');
const { DEFAULT_DAY } = require('./config');

function getModulesDueToday(environmentModules) {
    const today = new Date().getDate();
    console.log(chalk.cyan(`📅 Today is: ${today}`));

    const modulesDueToday = environmentModules.filter(env => {
        const original = env.DeadlineDay;
        const deadlineDay = original || DEFAULT_DAY;
        
        // Calculate the notification start day (5 days before deadline)
        const notificationStartDay = deadlineDay - 5;
        
        // If notification start day is negative, wrap around to previous month
        const adjustedStartDay = notificationStartDay <= 0 ? 30 + notificationStartDay : notificationStartDay;
        
        console.log(chalk.gray(`🔍 Module: ${env.Module}`));
        console.log(chalk.gray(`   Deadline Day: ${deadlineDay}`));
        console.log(chalk.gray(`   Notification Period: ${adjustedStartDay} to ${deadlineDay}`));
        console.log(chalk.gray(`   Today (${today}) is ${today >= adjustedStartDay && today <= deadlineDay ? 'within' : 'outside'} notification period`));
        
        // Return true if today is between notification start day and deadline day
        return today >= adjustedStartDay && today <= deadlineDay;
    });

    return modulesDueToday;
}

module.exports = { getModulesDueToday };
