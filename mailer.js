const nodemailer = require('nodemailer');
const chalk = require('chalk');
const { EMAIL_USER, EMAIL_PASS } = require('./config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

function sendEmails(recipients, modules) {
    const mailOptions = {
        from: EMAIL_USER,
        to: recipients.join(','),
        subject: '⏰ Reminder: Environment Module Deadline',
        text: `Hi,\n\nThe following environment modules are due today:\n\n${modules.map(m => `• ${m.Module}`).join('\n')}\n\nRegards,\nAutoCronBot`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(chalk.red('✉️  Error sending email:'), error);
        } else {
            console.log(chalk.green(`📨 Email sent to ${recipients.length} user(s): ${info.response}`));
        }
    });
}

module.exports = { sendEmails };
