const net = require('node:net');

const PORT = process.argv[2] || 3001;
const NODE_ID = `Nodo-${PORT}`;

const server = net.createServer((socket) => {
    console.log(`[+] Conexion recibida en ${NODE_ID}`);

    setTimeout(() => {
        socket.write(`Respuesta desde ${NODE_ID}\n`);
        socket.end();
    }, 500);
});

server.listen(PORT, () => {
    console.log(`${NODE_ID} escuchando...`);
});