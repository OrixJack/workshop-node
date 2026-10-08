const fs = require('node:fs');
const { pipeline } = require('node:stream');
const Formateador = require('./etl');
const { clearInterval } = require('node:timers');
const createCSV = require('./seed');


(async () => {
    //crear csv
    await createCSV('big.csv', 10000000); // Crear un CSV grande con 1,000,000 de filas

    //tranformar
    const input = fs.createReadStream('big.csv');
    const transformer = new Formateador();
    const output = fs.createWriteStream('final.txt');

    const intervalo = setInterval(() => {
        const mb = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`[+] Consumo de RAM: ${mb.toFixed(2)} MB`);
    }, 500);

    await new Promise((resolve, reject) => {
        pipeline(input, transformer, output, (err) => {
            clearInterval(intervalo);
            if (err) {
                console.log(`Error de Stream: ${err}`);
                reject(err);
            } else {
                console.log('Procesamiento completado sin crashear');
                resolve();
            }
        });
    });
})();