const net = require('node:net');
const NODES = [3001, 3002, 3003];
let idx = 0;

const balancer = net.createServer((client) => {
    const targetPort = NODES[idx % NODES.length];
    idx++;
    console.log(`Enrutando trafico -> Puerto ${targetPort}`);

    const node = net.createConnection({ port: targetPort });

    client.pipe(node);
    node.pipe(client);

    node.on('error', (err) => {
        console.error(`Nodo ${targetPort}: caido`);
        client.end(`Error interno en el servidor\n`);
    });
});

balancer.listen(8080, () => {
    console.log('Balancer escuchando en el puerto 8080');
});