const fs = require('node:fs');

function escribirBloque(out, iter){
    let ok = true;

    while (iter > 0 && ok) {
        iter--;
        const fila = `${iter}, ${Math.random() * 5000}, Activo \n`;

        if (iter === 0) out.write(fila);
        else ok = out.write(fila);
    }

    if (iter > 0 ) {
        out.once('drain', () => escribirBloque(out, iter));
    } else {
        out.end(); // Cerrar el stream
    }
}

module.exports = ((fileName, rows) => {
    return new Promise((resolve) => {
        const out = fs.createWriteStream(fileName);
        escribirBloque(out, rows);
        out.on('finish', () => {
            console.log(`Sembrado masivo COMPLETADO`);
            resolve();
        });
    });
});
