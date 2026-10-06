class PriorityQueue {
  constructor() {
    this.jobs = [];
    this.running = false;
    this.pending = 0;
  }

  // Agrega un trabajo con prioridad (mayor número = mayor prioridad)
  add(id, data, priority = 0) {
    this.jobs.push({ id, data, priority });
    // Ordena por prioridad descendente
    this.jobs.sort((a, b) => b.priority - a.priority);
  }

  // Obtiene el siguiente trabajo
  shift() {
    return this.jobs.shift();
  }

  // Inicia el procesamiento de trabajos
  start() {
    if (this.running) return;
    this.running = true;
    this._process();
  }

  // Procesa los trabajos de forma no bloqueante
  _process() {
    if (this.jobs.length === 0) {
      this.running = false;
      return;
    }

    setImmediate(() => {
      const job = this.shift();
      if (job) {
        console.log(`Procesando: ${job.id} (prioridad: ${job.priority})`);
        this._process();
      }
    });
  }
}

module.exports = PriorityQueue;
