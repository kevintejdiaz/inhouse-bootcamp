// Semana 1 — JavaScript profundo: scope, closures, coerción y tipos

// Dos tipos de declaraciones de variables: las que se elevan en la ejecucion del script y las que no

// console.log(a)
// var a = 1;

// console.log(constante)
// const constante = 2;

// console.log(b)
// let b = 1;

//Tipos de Scope: VAR tiene function_scope = ignora bloques if/for
//                LET i CONST tienen block_scope

// for( var i=0; i<3; i++){
//     setTimeout(()=>console.log(i), 7000)
// }

// for(let i=0; i<5; i++){
//      setTimeout(()=>console.log("Hola" + i), 3000)
// }

// //Todas las iteraciones comparten la MISMA  variable => El loop se completa antes de llegar al setTImeout
// for(var i=0; i<5; i++){
//     setTimeout(()=>console.log("Adios" + i), 3000)
// }

// Ejercicios 1.1

console.log(typeof null);          // Null dentro de JS es considerado un objeto
console.log([] == false);          // True: No lo entiendo esta comparando una array con el bool false
console.log(NaN === NaN);          // Esto es false debido a que no esta comparando una variable que sea igual en tipo y valor
console.log(i= 1 + "1", typeof(i));              // 11 pero en string 
console.log(1 + +"1");             // El operador + al lado de un string numero cambia el tipo a number lo que resulta en una suma normal y corriente
console.log([1,2] + [3,4]);        // 1,23,4 hay una conversion de tipo a string y el "23" es una concatenacion de los valores debido a que no hay ningun operador y son dos strings

//Ejercicio 1.2 Closures

function saludoPersonalizado(nombre)
{
    const mensaje = "Hola "+ nombre;

    return ()=>{
        console.log(mensaje)
    }
}

// const saludar1 = saludoPersonalizado("lema")();
saludoPersonalizado("lema")()

function crearSaludo(nombre) {
    const mensaje = "Hola " + nombre;
    return function() {
        console.log(mensaje);
    };
}

const saludar2 = crearSaludo("mundo")
crearSaludo("Demi")()


function crearContador(inicial=0){
    let valor=inicial
    return{
        incrementar: (cantidad=1)=>{
            valor += cantidad
            return valor
        },
        decrementar: (cantidad =1)=>{
            valor -= cantidad;
            return valor
        },
        valorActual: ()=>console.log(valor)
    };
}

const contadorA = crearContador();

const contadorB = crearContador()

contadorA.valorActual()
contadorA.incrementar(7)
contadorA.valorActual()
contadorA.decrementar()
contadorA.valorActual()


contadorB.valorActual()
contadorB.incrementar(66)
contadorB.valorActual()


// 1.3 Memoizacion con closures Caching con JS


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
    
}