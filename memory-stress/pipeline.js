const fs = require('node:fs');
const { pipeline } = require('node:stream');
const Formateador = require('./etl');
const { clearInterval } = require('node:timers');

const input = fs.createReadStream('big.csv');
const transformer = new Formateador();
const output = fs.createWriteStream('final.txt');

const intervalo = setInterval(() => {
    const mb = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`[+] Consumo de RAM: ${mb.toFixed(2)} MB`);
}, 500);

pipeline(input, transformer, output, (err) => {
    clearInterval(intervalo);
    if (err) console.log(`Error de Stream: ${err}`);
    else console.log('Procesamiento completado sin crashear');
});