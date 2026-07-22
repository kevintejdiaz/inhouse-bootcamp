# 🎨 BOOTCAMP FRONTEND — JavaScript moderno + Angular + TypeScript (4 semanas)
### Reactivación de fundamentos + especialización en Angular para dev backend .NET

**Dedicación estimada:** 2–3h/día · Parte A (semanas 1–2): JS puro. Parte B (semanas 3–4): TypeScript + Angular.

---

# PARTE A — JavaScript esencial y manipulación del DOM

## 📅 Semana 1 — JavaScript profundo: scope, closures, coerción y tipos

### 🎯 Checklist de objetivos
- [ ] Explicar hoisting y la "temporal dead zone" de `let`/`const`
- [ ] Diferenciar scope de función vs scope de bloque (`var` vs `let`/`const`)
- [ ] Crear y explicar un closure real (contador privado, memoización)
- [ ] Predecir el resultado de comparaciones `==` vs `===` y coerción de tipos
- [ ] Listar todos los valores falsy de JS de memoria

### 📖 Teoría resumida

**Hoisting**: las declaraciones (no las asignaciones) se "elevan" al inicio del scope. `var` se inicializa como `undefined`; `let`/`const` existen pero están en la "temporal dead zone" (TDZ) — acceder antes de la declaración lanza `ReferenceError`, no `undefined`.

```javascript
console.log(a); // undefined (var hoisted)
var a = 1;

console.log(b); // ReferenceError (TDZ)
let b = 1;
```

**Scope**: `var` tiene function scope (ignora bloques `if`/`for`); `let`/`const` tienen block scope. Esto es la causa clásica del bug de closures en loops:

```javascript
for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); } // 3, 3, 3
for (let i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); } // 0, 1, 2
```
Con `let`, cada iteración crea un nuevo binding de `i`; con `var`, todas las funciones comparten la misma variable.

**Closures**: una función "recuerda" el scope en el que fue creada, incluso después de que ese scope termine de ejecutarse. No es magia — es que la función mantiene una referencia al *entorno léxico*, no una copia de los valores.

**Coerción y `==` vs `===`**: `==` convierte tipos antes de comparar (reglas complejas e inconsistentes); `===` compara sin conversión. Regla práctica: usa siempre `===`, sin excepciones, salvo el caso idiomático `if (x == null)` para chequear `null` o `undefined` a la vez.

**Valores falsy en JS** (los 8 que existen): `false`, `0`, `-0`, `0n` (BigInt cero), `""`, `null`, `undefined`, `NaN`. Todo lo demás es truthy, incluyendo `"0"`, `[]`, y `{}`.

### 💻 Ejercicios prácticos

**Ejercicio 1.1 — Predice la salida**
```javascript
console.log(typeof null);          // ?
console.log([] == false);          // ?
console.log(NaN === NaN);          // ?
console.log(1 + "1");              // ?
console.log(1 + +"1");             // ?
console.log([1,2] + [3,4]);        // ?
```
<details><summary>Solución</summary>

```
"object"     // bug histórico de JS, null nunca fue realmente un object
true         // [] se coerciona a "" luego a 0, false a 0 → 0 == 0
false        // NaN nunca es igual a sí mismo; usa Number.isNaN()
"11"         // concatenación de strings
2            // el + unario convierte "1" a number antes de sumar
"1,23,4"     // ambos arrays se convierten a string y se concatenan
```
</details>

**Ejercicio 1.2 — Closures: contador privado**
Implementa una fábrica de contadores donde cada instancia tenga su propio estado privado, sin usar clases.

<details><summary>Solución</summary>

```javascript
function crearContador(inicial = 0) {
  let valor = inicial; // privado, solo accesible vía closure
  return {
    incrementar: () => ++valor,
    decrementar: () => --valor,
    valorActual: () => valor,
  };
}

const contadorA = crearContador();
const contadorB = crearContador(10);
contadorA.incrementar();
contadorA.incrementar();
console.log(contadorA.valorActual()); // 2
console.log(contadorB.valorActual()); // 10 — estados totalmente independientes
```
</details>

**Ejercicio 1.3 — Memoización con closures**
Crea una función `memoize(fn)` genérica que cachee resultados de cualquier función pura basándose en sus argumentos.

<details><summary>Solución</summary>

```javascript
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const resultado = fn(...args);
    cache.set(key, resultado);
    return resultado;
  };
}

const fibMemo = memoize(function fib(n) {
  return n <= 1 ? n : fibMemo(n - 1) + fibMemo(n - 2);
});
```
Nota el paralelismo directo con el ejercicio de memoización en C# de la Semana 2 del bootcamp backend — mismo concepto, distinto lenguaje.
</details>

### 🔗 Recursos
- [MDN — Closures](https://developer.mozilla.org/es/docs/Web/JavaScript/Closures)
- [MDN — Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)
- [JavaScript Equality Table](https://dorey.github.io/JavaScript-Equality-Table/)

---

## 📅 Semana 2 — Event loop, promesas, DOM avanzado y proyecto To-Do

### 🎯 Checklist de objetivos
- [ ] Explicar el Event Loop, call stack, microtasks vs macrotasks
- [ ] Encadenar promesas correctamente y manejar errores con `.catch`/`try-catch` + `async/await`
- [ ] Seleccionar y crear elementos DOM de forma eficiente (`DocumentFragment`, delegación de eventos)
- [ ] Implementar delegación de eventos en vez de listeners individuales
- [ ] Construir el proyecto To-Do List con persistencia en `localStorage`

### 📖 Teoría resumida

**Event Loop**: JS es single-threaded. El *call stack* ejecuta código síncrono. Las Web APIs (timers, fetch, DOM events) corren en el navegador y, al completarse, encolan callbacks: **microtasks** (promesas, `queueMicrotask`) tienen prioridad sobre **macrotasks** (`setTimeout`, eventos de UI). El loop vacía *todas* las microtasks antes de procesar la siguiente macrotask.

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// Orden: 1, 4, 3, 2 — síncrono primero, luego microtasks, luego macrotasks
```

**Promesas y async/await**: `async/await` es azúcar sintáctico sobre promesas. Un error en una función `async` se debe capturar con `try/catch`; si olvidas el `catch`, obtienes una "unhandled promise rejection".

**Delegación de eventos**: en vez de agregar un listener a cada `<li>` de una lista dinámica, agrega **un solo listener** al contenedor padre y usa `event.target` para identificar qué elemento disparó el evento. Ventajas: mejor performance con listas grandes, funciona automáticamente con elementos añadidos dinámicamente.

```javascript
// ❌ Ineficiente: un listener por cada item, se rompe con items nuevos
document.querySelectorAll("li").forEach(li => li.addEventListener("click", handler));

// ✅ Delegación: un listener, funciona con items futuros
document.querySelector("ul").addEventListener("click", (e) => {
  if (e.target.matches("li")) handler(e);
});
```

**Rendimiento en el DOM**: cada modificación al DOM puede disparar reflow/repaint. Para insertar múltiples elementos, usa `DocumentFragment` (se construye en memoria, un solo reflow al insertarlo) en vez de múltiples `appendChild` sueltos.

### 💻 Ejercicios prácticos

**Ejercicio 2.1 — Orden de ejecución**
```javascript
async function ejemplo() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}
console.log("inicio");
ejemplo();
console.log("fin");
```
<details><summary>Solución</summary>

Orden: `inicio`, `A`, `fin`, `B`. Todo lo síncrono antes del primer `await` corre inmediatamente. El `await` pausa la función y la reanuda como microtask, por eso `fin` (síncrono) se imprime antes que `B`.
</details>

**Ejercicio 2.2 — Manejo de errores en cadenas async**
Escribe una función que haga fetch a una API, con manejo de errores robusto (red caída, respuesta no-OK, JSON inválido).

<details><summary>Solución</summary>

```javascript
async function obtenerDatos(url) {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}: ${respuesta.statusText}`);
    }
    return await respuesta.json();
  } catch (error) {
    if (error instanceof TypeError) {
      console.error("Error de red:", error.message);
    } else {
      console.error("Error de la API:", error.message);
    }
    throw error; // re-lanzar para que el caller decida qué hacer
  }
}
```
</details>

**Ejercicio 2.3 — Delegación de eventos con creación dinámica**
Crea una lista donde cada `<li>` tenga un botón "eliminar", usando un solo listener delegado en el `<ul>` padre.

<details><summary>Solución</summary>

```javascript
const lista = document.querySelector("#lista");

function agregarItem(texto) {
  const li = document.createElement("li");
  li.innerHTML = `<span>${texto}</span> <button data-action="eliminar">✕</button>`;
  lista.appendChild(li);
}

lista.addEventListener("click", (e) => {
  if (e.target.dataset.action === "eliminar") {
    e.target.closest("li").remove();
  }
});
```
</details>

### 🚀 Proyecto intermedio — To-Do List con filtros y localStorage

**Requisitos:**
1. Agregar, editar, eliminar y marcar tareas como completadas.
2. Filtros: "Todas" / "Activas" / "Completadas" usando delegación de eventos.
3. Persistencia en `localStorage` (guardar en cada cambio, cargar al iniciar).
4. Usar `DocumentFragment` para el render inicial de listas grandes.
5. Manejo de errores al leer/parsear `localStorage` (puede estar corrupto o vacío).
6. Sin frameworks — JS vanilla puro, para consolidar fundamentos antes de Angular.

**Estructura sugerida:**
```
todo-app/
  index.html
  style.css
  app.js       // orquestación general
  storage.js   // funciones getTareas/guardarTareas con try-catch
  render.js    // funciones de creación de DOM
```

### 🔗 Recursos
- [Jake Archibald — In The Loop (charla sobre Event Loop)](https://www.youtube.com/watch?v=cCOL7MC4Pl0)
- [MDN — Using Promises](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Using_promises)
- [MDN — Event delegation](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation)
- [web.dev — DocumentFragment performance](https://web.dev/articles/dom-size)

---

# PARTE B — TypeScript + Angular (especialización)

## 📅 Semana 3 — TypeScript a fondo + fundamentos de Angular

### 🎯 Checklist de objetivos
- [ ] Tipar correctamente con interfaces, types, genéricos y union types
- [ ] Explicar diferencias clave entre `interface` y `type`
- [ ] Entender decoradores (`@Component`, `@Injectable`) y cómo Angular los usa
- [ ] Crear componentes standalone con data binding (interpolación, property, event, two-way)
- [ ] Implementar servicios con inyección de dependencias y entender jerarquía de inyectores

### 📖 Teoría resumida

**TypeScript no es "JS con tipos" nada más** — trae genéricos, tipos estructurales, discriminated unions, y un sistema de tipos que atrapa errores en compile-time que en C# das por sentado (¡así que te sentirás como en casa!).

```typescript
// Interfaces vs types: ambos tipan objetos, pero...
interface Usuario { nombre: string; edad: number; }
type UsuarioType = { nombre: string; edad: number; };

// interface se puede extender/fusionar (declaration merging); type no
interface Usuario { activo: boolean; } // se fusiona con la anterior

// type soporta uniones y primitivos directamente; interface no
type Estado = "cargando" | "listo" | "error"; // discriminated union
```

**Genéricos**: igual que en C# (`List<T>`), TS permite `Array<T>`, y puedes crear tus propias funciones/clases genéricas:
```typescript
function primero<T>(arr: T[]): T | undefined { return arr[0]; }
```

**Decoradores en Angular**: son funciones que añaden metadata a clases. `@Component` le dice a Angular "esta clase es un componente, aquí está su template y estilos". `@Injectable` marca una clase como disponible para el sistema de DI. Si vienes de .NET, son conceptualmente similares a los atributos de C# (`[ApiController]`, `[Inject]`), pero los decoradores de TS ejecutan código en runtime al aplicarse.

**Data binding en Angular:**
| Sintaxis | Dirección | Uso |
|---|---|---|
| `{{ valor }}` | Componente → Vista | Interpolación de texto |
| `[propiedad]="valor"` | Componente → Vista | Property binding |
| `(evento)="metodo()"` | Vista → Componente | Event binding |
| `[(ngModel)]="valor"` | Bidireccional | Formularios |

**Standalone components** (Angular moderno, desde v14+, default desde v17+): ya no necesitas `NgModule` para todo. Un componente standalone declara sus propias dependencias con `imports: [...]` directamente. Simplifica muchísimo el árbol de dependencias comparado con Angular clásico basado en módulos.

**Inyección de dependencias**: Angular tiene un sistema jerárquico de inyectores (root → módulo → componente). Un servicio con `providedIn: 'root'` es un singleton a nivel de toda la app — conceptualmente equivalente a un `Singleton` en el DI container de .NET que ya conoces.

### 💻 Ejercicios prácticos

**Ejercicio 3.1 — Tipado con genéricos y discriminated unions**
Modela el estado de una petición HTTP (`idle`, `loading`, `success` con datos, `error` con mensaje) usando discriminated unions.

<details><summary>Solución</summary>

```typescript
type EstadoPeticion<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function manejarEstado<T>(estado: EstadoPeticion<T>) {
  switch (estado.status) {
    case "idle": return "Sin iniciar";
    case "loading": return "Cargando...";
    case "success": return `Datos: ${JSON.stringify(estado.data)}`; // TS sabe que .data existe aquí
    case "error": return `Error: ${estado.message}`; // TS sabe que .message existe aquí
  }
}
```
Esto es TypeScript "narrowing" el tipo automáticamente dentro de cada `case` — muy similar al pattern matching de C# con records.
</details>

**Ejercicio 3.2 — Componente standalone con binding completo**
Crea un componente `contador` con un botón que incrementa un valor, mostrado con interpolación, y un input de texto vinculado con `ngModel`.

<details><summary>Solución</summary>

```typescript
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contador',
  standalone: true,
  imports: [FormsModule],
  template: `
    <p>Valor: {{ contador() }}</p>
    <button (click)="incrementar()">+1</button>
    <input [(ngModel)]="nombre" placeholder="Tu nombre" />
    <p>Hola, {{ nombre }}</p>
  `
})
export class ContadorComponent {
  contador = signal(0);
  nombre = '';
  incrementar() { this.contador.update(v => v + 1); }
}
```
</details>

**Ejercicio 3.3 — Servicio con DI**
Crea un `LoggerService` inyectable a nivel root y úsalo en dos componentes distintos, demostrando que es la misma instancia (singleton).

<details><summary>Solución</summary>

```typescript
@Injectable({ providedIn: 'root' })
export class LoggerService {
  private contador = 0;
  log(msg: string) {
    this.contador++;
    console.log(`[Log #${this.contador}] ${msg}`);
  }
}

@Component({ selector: 'app-a', standalone: true, template: `<button (click)="log.log('desde A')">A</button>` })
export class ComponenteA { constructor(public log: LoggerService) {} }

@Component({ selector: 'app-b', standalone: true, template: `<button (click)="log.log('desde B')">B</button>` })
export class ComponenteB { constructor(public log: LoggerService) {} }
// El contador se comparte entre A y B porque ambos reciben la misma instancia singleton
```
</details>

### 🔗 Recursos
- [TypeScript Handbook — Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Angular.dev — Essentials](https://angular.dev/essentials)
- [Angular.dev — Signals](https://angular.dev/guide/signals)
- [Angular.dev — Dependency Injection](https://angular.dev/guide/di)

---

## 📅 Semana 4 — HttpClient, RxJS, buenas prácticas y proyecto final

### 🎯 Checklist de objetivos
- [ ] Consumir APIs con `HttpClient` y tipar las respuestas
- [ ] Implementar un interceptor HTTP (para auth headers o manejo global de errores)
- [ ] Entender Observables vs Promesas, y operadores RxJS básicos (`map`, `filter`, `switchMap`, `debounceTime`)
- [ ] Implementar lazy loading de rutas
- [ ] Escribir al menos 3 tests unitarios con Jasmine/Karma
- [ ] Construir el proyecto final: SPA consumiendo una API pública

### 📖 Teoría resumida

**HttpClient**: siempre devuelve un `Observable`, no una Promise. Debes suscribirte (`.subscribe()`) o usar el pipe `async` en el template para que la petición se dispare — un Observable no ejecutado no hace nada (son "lazy" por diseño, a diferencia de las Promises que se ejecutan inmediatamente al crearse).

```typescript
interface Producto { id: number; nombre: string; precio: number; }

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.ejemplo.com/productos';

  obtenerTodos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
}
```

**Interceptores**: middleware para todas las peticiones HTTP salientes — perfecto para agregar tokens de auth o capturar errores globalmente, análogo conceptual a los middlewares de ASP.NET Core que ya conoces.

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error HTTP:', error.status, error.message);
      return throwError(() => error);
    })
  );
};
```

**Observables vs Promesas**: una Promise resuelve un único valor una vez; un Observable puede emitir múltiples valores a lo largo del tiempo y es cancelable (`unsubscribe()`). RxJS brilla en casos como autocompletado (debounce de input), WebSockets, o combinar múltiples streams de datos.

Operadores esenciales:
- `map`: transforma cada valor emitido.
- `filter`: descarta valores que no cumplen una condición.
- `switchMap`: cancela la petición anterior si llega una nueva (ideal para búsquedas — evita "race conditions" de respuestas fuera de orden).
- `debounceTime`: espera N ms de silencio antes de emitir (perfecto para inputs de búsqueda).

```typescript
busqueda$ = this.inputBusqueda.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(termino => this.productoService.buscar(termino))
);
```

**Lazy loading**: divide el bundle de la app en chunks que se cargan solo cuando el usuario navega a esa ruta, mejorando el tiempo de carga inicial.

```typescript
export const routes: Routes = [
  {
    path: 'productos',
    loadComponent: () => import('./productos/productos.component').then(m => m.ProductosComponent)
  }
];
```

### 💻 Ejercicios prácticos

**Ejercicio 4.1 — Búsqueda con debounce y switchMap**
Implementa un buscador que consulte una API mientras el usuario escribe, sin saturar de peticiones y evitando respuestas fuera de orden.

<details><summary>Solución</summary>

```typescript
export class BuscadorComponent {
  private http = inject(HttpClient);
  control = new FormControl('');

  resultados$ = this.control.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter(termino => (termino ?? '').length >= 2),
    switchMap(termino =>
      this.http.get<Producto[]>(`/api/buscar?q=${termino}`).pipe(
        catchError(() => of([])) // fallback ante error, no rompe el stream
      )
    )
  );
}
```
```html
<input [formControl]="control" placeholder="Buscar..." />
<ul>
  <li *ngFor="let p of resultados$ | async">{{ p.nombre }}</li>
</ul>
```
</details>

**Ejercicio 4.2 — Interceptor + manejo de errores async**
Crea un interceptor que agregue un header `Authorization` y otro que capture errores 401 redirigiendo a login.

<details><summary>Solución</summary>

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const clonado = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(clonado);
};

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) router.navigate(['/login']);
      return throwError(() => error);
    })
  );
};

// app.config.ts
provideHttpClient(withInterceptors([authInterceptor, authErrorInterceptor]))
```
</details>

**Ejercicio 4.3 — Test unitario de un servicio**
Testea `ProductoService.obtenerTodos()` mockeando `HttpClient` con `HttpClientTestingModule`.

<details><summary>Solución</summary>

```typescript
describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoService]
    });
    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('debería obtener la lista de productos', () => {
    const mockData: Producto[] = [{ id: 1, nombre: 'Test', precio: 10 }];
    service.obtenerTodos().subscribe(productos => {
      expect(productos).toEqual(mockData);
      expect(productos.length).toBe(1);
    });
    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  afterEach(() => httpMock.verify());
});
```
</details>

### 🚀 PROYECTO FINAL — SPA con API pública (Pokémon API)

**Objetivo:** construir una Angular SPA con listado, detalle, búsqueda y filtros, aplicando todo lo aprendido.

**Requisitos funcionales:**
1. **Listado**: página con grid de Pokémon (imagen, nombre, tipo) consumiendo [PokéAPI](https://pokeapi.co/), con paginación.
2. **Búsqueda**: input con `debounceTime` + `switchMap` que filtra por nombre en tiempo real.
3. **Filtros**: por tipo (fuego, agua, planta, etc.) usando query params sincronizados con la URL (`ActivatedRoute`).
4. **Detalle**: ruta `pokemon/:id` con lazy loading, mostrando stats, habilidades y evoluciones.
5. **Manejo de estado de carga/error**: usar el patrón `EstadoPeticion<T>` del Ejercicio 3.1 para mostrar spinners y mensajes de error.
6. **Interceptor** de manejo global de errores HTTP con feedback visual (toast o banner).
7. **Componentes standalone** en toda la app, con `signals` para estado local reactivo.
8. **Al menos 5 tests unitarios**: 2 de servicios (mockeando HTTP), 3 de componentes (renderizado condicional, eventos de click).

**Estructura sugerida:**
```
pokemon-app/
  src/app/
    core/
      interceptors/
      services/
    features/
      pokemon-list/
      pokemon-detail/
      pokemon-search/
    shared/
      components/
      models/
    app.routes.ts
    app.config.ts
```

**Criterios de "hecho":**
- [ ] Sin `any` en el código — todo tipado explícitamente
- [ ] Sin memory leaks (usar `async` pipe en vez de `.subscribe()` manual sin `unsubscribe`, o `takeUntilDestroyed()`)
- [ ] Lazy loading funcionando (verificable en Network tab — chunks separados)
- [ ] README con capturas y decisiones de arquitectura

### 🔗 Recursos
- [Angular.dev — HttpClient](https://angular.dev/guide/http)
- [RxJS Operators Decision Tree](https://rxjs.dev/operator-decision-tree)
- [Angular.dev — Testing](https://angular.dev/guide/testing)
- [PokéAPI — documentación](https://pokeapi.co/docs/v2)
- [Learn RxJS (ejemplos por operador)](https://www.learnrxjs.io/)
