const chalk = require('chalk');
const { DEFAULT_DAY } = require('./config');

function getModulesDueToday(environmentModules) {
    const today = new Date();
    const currentDay = today.getDate();
    
    // Get the last day of current and previous month
    const lastDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    const lastDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    console.log(chalk.cyan(`📅 Today is: ${currentDay}`));
    console.log(chalk.gray(`   Last day of previous month: ${lastDayOfPrevMonth}`));
    console.log(chalk.gray(`   Last day of current month: ${lastDayOfCurrentMonth}`));

    const modulesDueToday = environmentModules.filter(env => {
        const original = env.DeadlineDay;
        const deadlineDay = original || DEFAULT_DAY;
        
        // Calculate the notification start day (5 days before deadline)
        const notificationStartDay = deadlineDay - 5;
        
        // Handle month transition and different month lengths
        let adjustedStartDay;
        if (notificationStartDay <= 0) {
            // If start day is negative, calculate from previous month's last day
            adjustedStartDay = lastDayOfPrevMonth + notificationStartDay;
        } else {
            adjustedStartDay = notificationStartDay;
        }
        
        console.log(chalk.gray(`🔍 Module: ${env.Module}`));
        console.log(chalk.gray(`   Deadline Day: ${deadlineDay}`));
        console.log(chalk.gray(`   Notification Period: ${adjustedStartDay} (${notificationStartDay <= 0 ? 'prev month' : 'current month'}) to ${deadlineDay}`));
        
        // Check if today is within the notification period
        let isWithinPeriod;
        if (notificationStartDay <= 0) {
            // Handle month transition case
            isWithinPeriod = (
                // Either we're in the previous month after the start day
                (currentDay >= adjustedStartDay && currentDay <= lastDayOfPrevMonth) ||
                // Or we're in the current month before or on the deadline day
                (currentDay <= deadlineDay)
            );
        } else {
            // Simple case - everything in current month
            isWithinPeriod = currentDay >= adjustedStartDay && currentDay <= deadlineDay;
        }
        
        console.log(chalk.gray(`   Today (${currentDay}) is ${isWithinPeriod ? 'within' : 'outside'} notification period`));
        
        return isWithinPeriod;
    });

    return modulesDueToday;
}

module.exports = { getModulesDueToday };