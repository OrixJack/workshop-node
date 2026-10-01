import express from 'express';
import { Worker } from 'node:worker_threads';

const app = express();
const port = 3500;

//Ruta rapida
app.get('/fast', (req, res) =>{
    res.json({
        status: 'OK',
        messsage: 'Respuesta rapida (Event loop)'
    });
});

//Ruta lenta
app.get('/slow-io', (req, res) =>{
    setTimeout(() => {
        res.json({
            status: 'OK',
            messsage: 'Respuesta despues de 4 Segundos'
        });
    }, 4000);
});

//Ruta pesada
app.get('/heavy-cpu-block', (req, res) =>{
    console.time('heavy-cpu-block:::before loop');

    for(let i=0; i < 5_000_000_000; i++){};

    console.time('heavy-cpu-block:::after loop');
    res.json({
        status: 'OK',
        messsage: 'CPU TERMINADA. Event loop secuestrado'
    });
});

const runHeavyTask = (data) =>
    new Promise((resolve, reject) => {
        const worker = new Worker (new URL('./worker.js', import.meta.url));
        
        worker.once('message', resolve);
        worker.once('error', reject);
        worker.once('exit', (code)=>{
            if (code !== 0) {
                reject(new Error(`El worker termino con codigo ${code}`));
            }
        });

        worker.postMessage(data)
    });

app.get('/heavy-cpu-worker', async (req, res) => {
    try{
        console.time('heavy-cpu-worker:::before call');
        const result = await runHeavyTask({ iterations: 5_000_000_000});
        console.timeEnd('heavy-cpu-worker:::after call');

        res.json({
            status: 'OK',
            messsage: 'CPU TERMINADA. Call worker',
            result: result
        });
    }
    catch(error){
        res.status(500).json({
            status: 'ERROR',
            messsage: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}`);
});