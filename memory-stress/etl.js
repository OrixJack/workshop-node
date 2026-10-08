const { Transform } = require('node:stream');

class FormateadorCSV extends Transform {
    _transform(chunk, encoding, callback) {
        let dataTexto = chunk.toString();
        let dataMutada = dataTexto.replaceAll(', ', ' | ');
        this.push(dataMutada);
        callback();
    }
}

module.exports = FormateadorCSV;
