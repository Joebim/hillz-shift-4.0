const nodemailer = require('nodemailer');

const config = {
    host: 'mail.thehillz.org',
    port: 465,
    secure: true,
    auth: {
        user: 'noreply@thehillz.org',
        pass: 'k&#5yZd$ghP_OFaP'
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000
};

async function test() {
    console.log('Testing Port 465 (secure: true)...');
    let transporter = nodemailer.createTransport(config);
    try {
        await transporter.verify();
        console.log('✅ Port 465 works!');
    } catch (err) {
        console.log('❌ Port 465 failed:', err.message);
        
        console.log('\nTesting Port 587 (secure: false)...');
        transporter = nodemailer.createTransport({
            ...config,
            port: 587,
            secure: false
        });
        try {
            await transporter.verify();
            console.log('✅ Port 587 works!');
        } catch (err2) {
            console.log('❌ Port 587 failed:', err2.message);
        }
    }
}

test();
