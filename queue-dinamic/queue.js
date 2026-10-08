class PriorityQueue {
  constructor() {
    this.tareas = [];
    this.isProcessing = false;
  }

  add(id, data, priority = 1) {
    this.tareas.push({ id, data, priority });
    this.tareas.sort((a, b) => b.priority - a.priority);
  }

  get length(){
    return this.tareas.length;
  }

  next () {
    const job = this.tareas[0];
    console.log(`Procesando: ${job.id} (prioridad: ${job.priority})`);
    return this.tareas.shift();
  }

  start() {
    if (this.length === 0) {
      this.isProcessing = false;
      return console.log('No hay tareas pendientes.');
    }

    const tarea = this.next();
    JSON.stringify(tarea.data);

    if(tarea.priority > 5) {
      console.log(`Procesando tarea urgente: ${tarea.id} (prioridad: ${tarea.priority})`);
    }

    setImmediate(() => this.start());
  }
}

module.exports = PriorityQueue;
