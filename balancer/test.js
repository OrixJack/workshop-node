const net = require('node:net');

for (let i = 1; i <= 6; i++) {
    const client = net.createConnection({ port: 8080 });
    client.write(`GET / HTTP/1.1\r\nHost: localhost\r\n\r\n`);

    client.on('data', (d) => {
        console.log(`Req ${i}: ${d.toString().split('\r\n')[0]}`);
        client.end();
    });
}