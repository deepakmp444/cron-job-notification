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
        text: `Hi,\n\nThe following environment modules are due today:\n\n${modules.map(m => `• ${m.Module}`).join('\n')}\n\nRegards,\nESG APP`
    };

    console.log(chalk.blue(`📨 Sending email to ${recipients.length} user(s)...`));

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(chalk.red('❌ Failed to send email:'), error.message);
        } else {
            console.log(chalk.green('✅ Email delivered successfully!'));
            console.log(chalk.gray(`📬 Response: ${info.response}`));
            console.log(chalk.gray(`🧾 Accepted: ${info.accepted.join(', ') || 'None'}`));
            if (info.rejected.length > 0) {
                console.warn(chalk.yellow(`⚠️ Rejected: ${info.rejected.join(', ')}`));
            }
        }
    });
}

module.exports = { sendEmails };
