const net = require('net');

function checkPort(port, host) {
    const socket = new net.Socket();
    socket.setTimeout(5000);
    console.log(`Checking ${host}:${port}...`);
    socket.on('connect', () => {
        console.log(`✅ ${port} is reachable!`);
        socket.destroy();
    }).on('timeout', () => {
        console.log(`❌ ${port} timed out.`);
        socket.destroy();
    }).on('error', (err) => {
        console.log(`❌ ${port} failed:`, err.message);
        socket.destroy();
    }).connect(port, host);
}

checkPort(465, 'mail.thehillz.org');
checkPort(587, 'mail.thehillz.org');
checkPort(993, 'mail.thehillz.org');
checkPort(995, 'mail.thehillz.org');
