const nodemailer = require('nodemailer');

const config = {
    host: 'mail.thehillz.org',
    port: 587,
    secure: false, // Port 587 is STARTTLS
    auth: {
        user: 'noreply@thehillz.org',
        pass: 'k&#5yZd$ghP_OFaP'
    },
    tls: {
                // Must be true for most modern servers using STARTTLS
        rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
};

async function test() {
    console.log('Testing Port 587 (secure: false)...');
    let transporter = nodemailer.createTransport(config);
    try {
        await transporter.verify();
        console.log('✅ Port 587 works!');
    } catch (err) {
        console.log('❌ Port 587 failed:', err.message);
    }
}

test();
