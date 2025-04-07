const chalk = require('chalk');
const { DEFAULT_DAY } = require('./config');

function getModulesDueToday(environmentModules) {
    const today = new Date();
    const currentDay = today.getDate();
    
    console.log(chalk.cyan(`📅 Today is: ${currentDay}`));

    const modulesDueToday = environmentModules.filter(env => {
        const deadlineDay = env.DeadlineDay || DEFAULT_DAY;
        
        // Calculate the effective deadline day based on the rules
        let effectiveDeadlineDay = deadlineDay;
        
        if (deadlineDay > 7) {
            effectiveDeadlineDay = deadlineDay - 5;
        } else if (deadlineDay < 7 && deadlineDay !== 1) {
            effectiveDeadlineDay = deadlineDay - 1;
        }
        // If deadlineDay is 1, don't subtract anything
        
        // Check if today matches the effective deadline day
        const isDueToday = currentDay === effectiveDeadlineDay;
        
        logModuleInfo(env.Module, deadlineDay, effectiveDeadlineDay, isDueToday);
        return isDueToday;
    });

    return modulesDueToday;
}

// Helper function to log module information
function logModuleInfo(moduleName, originalDeadlineDay, effectiveDeadlineDay, isDueToday) {
    console.log(chalk.gray(`🔍 Module: ${moduleName}`));
    console.log(chalk.gray(`   Original Deadline Day: ${originalDeadlineDay}`));
    console.log(chalk.gray(`   Effective Deadline Day: ${effectiveDeadlineDay}`));
    console.log(chalk.gray(`   Is due today: ${isDueToday ? 'Yes' : 'No'}`));
}

module.exports = { getModulesDueToday };