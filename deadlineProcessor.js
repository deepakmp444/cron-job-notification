const chalk = require('chalk');
const { DEFAULT_DAY } = require('./config');

function getModulesDueToday(environmentModules) {
    const today = new Date().getDate();
    console.log(chalk.cyan(`📅 Today is: ${today}`));

    const modulesDueToday = environmentModules.filter(env => {
        const original = env.DeadlineDay;
        if (original === null) {
            env.DeadlineDay = DEFAULT_DAY;
        } else {
            env.DeadlineDay = original - 5;
        }

        console.log(chalk.gray(`🔍 Module: ${env.Module}, Original: ${original}, Adjusted: ${env.DeadlineDay}`));
        return env.DeadlineDay === today;
    });

    return modulesDueToday;
}

module.exports = { getModulesDueToday };
