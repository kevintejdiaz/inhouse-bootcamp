//Semana 2 JavaScript es un Single-Threaded. El Event-Loop se encarga para coordinar el orden de ejecucion segun prioridades y tiempo de ejecucion
// CALL STACK: 
// Ejecuta TODO el código síncrono inmediatamente.
// Si encuentra operaciones asíncronas, las delega al navegador/Node.

// MICROTASK (Prioridad 1 - ¡MÁXIMA!):
// Promise.then/catch/finally, queueMicrotask, MutationObserver, process.nextTick[Node]
// Se ejecutan INMEDIATAMENTE después de que el Call Stack se vacíe.
// TODAS las microtasks se ejecutan antes de cualquier macrotask.

// MACROTASK (Prioridad 2 - ¡BAJA!):
// setTimeout, setInterval, UI Events, I/O Operations, fetch
// Se ejecutan DESPUÉS de que TODAS las microtasks se hayan completado.
// Solo UNA macrotask se ejecuta por ciclo del Event Loop.

console.log("----SEMANA 2:Event loop, promesas, DOM avanzado y proyecto To-Do----")
//EVENT LOOP
console.log("1: Inicio")

setTimeout(()=>console.log("4. MacroTask"),0)

Promise.resolve().then(()=>console.log("3. Microtask"))

console.log("2. Call Stack pero desde abajo")

//Promesas y Async/Await

async function funcionAsincrona() {
    console.log("A: Dentro de la async(Sincrono)");

    const resultado = await Promise.resolve("B: Promesa resuelta")
    console.log("resultado")

    console.log("C: Continuacion despues del await")
}