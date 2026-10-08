// app.js
const PriorityQueue = require('./queue');
const q = new PriorityQueue();

// Inyección Bloqueante Base Prio 1
console.log('Cargando 10000 reportes lentos...');
for(let i = 0; i < 10000; i++) {
  q.add(`Rep-${i}`, { mock: true }, 1);
}

// Despacho no bloqueante
q.start();

// Simulación Inyección Asinciona Urgente
setTimeout(() => {
  console.log('\n--- LLEGA TRÁFICO VIP ---');
  q.add('Transf-A', { user: 'CEO' }, 10);
  q.add('Transf-B', { user: 'CFO' }, 10);
  q.add('Transf-C', { user: 'CTO' }, 10);
}, 1000);
// Válida que el Event Loop no está colap  sado