# 🖥️ BOOTCAMP BACKEND — .NET / C# (4 semanas)
### Repaso de fundamentos y buenas prácticas para dev con experiencia previa en .NET

**Dedicación estimada:** 2–3h/día · **Nivel de entrada:** ya trabajas con C# en producción, este bootcamp refuerza *por qué* haces lo que haces, no *cómo* escribir un `for`.

---

## 📅 Semana 1 — Lógica, tipos de datos y manejo de errores

### 🎯 Checklist de objetivos
- [ ] Explicar la diferencia entre value types y reference types con ejemplos de memoria (stack/heap)
- [ ] Usar `Nullable<T>` y el operador `?.` / `??` correctamente
- [ ] Explicar boxing/unboxing y su costo de performance
- [ ] Implementar recursividad con caso base y caso recursivo (incluyendo memoización)
- [ ] Diseñar manejo de errores con excepciones personalizadas y `try/catch/finally` correctamente (sin "excepciones para control de flujo")

### 📖 Teoría resumida

**Value types vs Reference types**
- Value types (`struct`, `int`, `bool`, `enum`, `DateTime`) viven en el stack (o inline si están dentro de un objeto) y se copian por valor.
- Reference types (`class`, `string` es especial, `array`, `delegate`) viven en el heap; la variable guarda una referencia.
- Consecuencia práctica: pasar un `struct` grande por parámetro copia toda la estructura → considera `in` o `ref readonly` para structs grandes en hot paths.

**Nullable y boxing**
- `int?` es azúcar sintáctico para `Nullable<int>`, un struct que envuelve `HasValue` y `Value`.
- Boxing ocurre cuando un value type se convierte a `object` (o a una interfaz) → se crea una copia en el heap. Unboxing es el proceso inverso. Ambos tienen costo de CPU y GC; evítalos en loops calientes (ej: no uses `ArrayList`, usa `List<T>`).

**Manejo de errores**
- Las excepciones son para condiciones *excepcionales*, no para flujo de control normal (no uses `try/catch` para validar si un usuario existe; usa `TryGetValue` o pattern matching).
- Jerarquía de excepciones personalizada: hereda de `Exception`, no captures `Exception` genérico salvo en el borde de la aplicación (middleware, `Main`).
- `finally` se ejecuta siempre; úsalo para liberar recursos no gestionados por `using`.

**Recursividad**
- Todo algoritmo recursivo necesita: caso base (evita stack overflow) y reducción hacia el caso base.
- C# no optimiza tail-call automáticamente (a diferencia de F#), así que recursión muy profunda puede reventar el stack → considera versión iterativa o memoización con `Dictionary<TKey, TValue>`.

### 💻 Ejercicios prácticos

**Ejercicio 1.1 — Value vs Reference**
```csharp
// Predice la salida ANTES de ejecutar
struct PuntoStruct { public int X; }
class PuntoClass { public int X; }

void ModificarStruct(PuntoStruct p) { p.X = 100; }
void ModificarClass(PuntoClass p) { p.X = 100; }

var s = new PuntoStruct { X = 1 };
var c = new PuntoClass { X = 1 };
ModificarStruct(s);
ModificarClass(c);
Console.WriteLine($"{s.X}, {c.X}"); // ?
```
<details><summary>Solución</summary>

Salida: `1, 100`. El struct se copia al entrar al método (value semantics), así que la modificación es local. La clase pasa la referencia, así que ambas variables apuntan al mismo objeto en heap.
</details>

**Ejercicio 1.2 — Excepciones personalizadas**
Diseña una jerarquía para un sistema de pedidos: `StockInsuficienteException`, `PedidoInvalidoException`, ambas heredando de una base `DominioException`. Deben incluir un `ErrorCode` como propiedad.

<details><summary>Solución</summary>

```csharp
public abstract class DominioException : Exception
{
    public string ErrorCode { get; }
    protected DominioException(string errorCode, string message) : base(message)
        => ErrorCode = errorCode;
}

public class StockInsuficienteException : DominioException
{
    public StockInsuficienteException(string sku, int solicitado, int disponible)
        : base("STOCK_001", $"SKU {sku}: solicitado {solicitado}, disponible {disponible}") { }
}

public class PedidoInvalidoException : DominioException
{
    public PedidoInvalidoException(string motivo) : base("PEDIDO_001", motivo) { }
}
```
Uso: capturas `DominioException` en la capa de aplicación para mapear a respuestas HTTP (400/409) y dejas que excepciones no controladas suban como 500.
</details>

**Ejercicio 1.3 — Recursividad con memoización**
Implementa Fibonacci recursivo simple, mide su tiempo para `n=35`, luego optimízalo con memoización y compara.

<details><summary>Solución</summary>

```csharp
// Versión ingenua O(2^n)
long FibNaive(int n) => n <= 1 ? n : FibNaive(n - 1) + FibNaive(n - 2);

// Versión con memoización O(n)
Dictionary<int, long> cache = new();
long FibMemo(int n)
{
    if (n <= 1) return n;
    if (cache.TryGetValue(n, out var valor)) return valor;
    var resultado = FibMemo(n - 1) + FibMemo(n - 2);
    cache[n] = resultado;
    return resultado;
}
```
`FibNaive(35)` puede tardar varios segundos; `FibMemo(35)` es instantáneo. Este ejercicio es el puente natural hacia la Semana 2 (Big O).
</details>

### 🚀 Mini-proyecto semanal
**Validador de reglas de negocio con excepciones tipadas**: crea una clase `CarritoCompras` que lance excepciones personalizadas al agregar productos sin stock, aplicar cupones inválidos, o superar límite de items. Escribe un `Main` que capture cada tipo de excepción por separado y muestre mensajes distintos.

### 🔗 Recursos
- [Value types vs reference types (Microsoft Docs)](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/types/)
- [Boxing and Unboxing](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/types/boxing-and-unboxing)
- [Exception handling best practices](https://learn.microsoft.com/en-us/dotnet/standard/exceptions/best-practices-for-exceptions)

---

## 📅 Semana 2 — Complejidad algorítmica (Big O)

### 🎯 Checklist de objetivos
- [ ] Identificar la complejidad temporal de un bloque de código a simple vista
- [ ] Diferenciar complejidad temporal de espacial
- [ ] Explicar por qué `Dictionary<K,V>` es O(1) amortizado y `List<T>.Contains` es O(n)
- [ ] Elegir la estructura de datos correcta según el caso de uso (List, HashSet, Dictionary, Queue, Stack)
- [ ] Refactorizar un algoritmo O(n²) a O(n log n) o O(n)

### 📖 Teoría resumida

Big O describe cómo crece el tiempo (o espacio) de ejecución conforme crece el tamaño de la entrada `n`. No mide tiempo real en segundos, mide *tendencia de crecimiento*.

| Notación | Nombre | Ejemplo típico en C# |
|---|---|---|
| O(1) | Constante | Acceso a `array[i]`, `Dictionary.TryGetValue` |
| O(log n) | Logarítmica | Búsqueda binaria, operaciones en `SortedSet<T>` |
| O(n) | Lineal | `foreach` simple, `List.Contains` |
| O(n log n) | Cuasi-lineal | `Array.Sort()` (Introsort), `OrderBy` de LINQ |
| O(n²) | Cuadrática | Loops anidados comparando todos contra todos |

**Estructuras de datos clave en .NET**
- `List<T>`: acceso por índice O(1), `Contains`/`IndexOf` O(n), `Insert(0, x)` O(n) por el shift.
- `Dictionary<K,V>` / `HashSet<T>`: `Add`/`Contains`/`Remove` O(1) amortizado gracias al hashing.
- `Queue<T>` (FIFO) y `Stack<T>` (LIFO): O(1) para enqueue/dequeue y push/pop.
- `SortedDictionary<K,V>`: O(log n) porque internamente es un árbol balanceado; úsalo cuando necesitas iterar en orden.

### 💻 Ejercicios prácticos

**Ejercicio 2.1 — Identifica la complejidad**
```csharp
// A
foreach (var item in lista) Console.WriteLine(item);

// B
for (int i = 0; i < lista.Count; i++)
    for (int j = 0; j < lista.Count; j++)
        if (lista[i] == lista[j]) contador++;

// C
var set = new HashSet<int>(lista);
bool existe = set.Contains(42);
```
<details><summary>Solución</summary>

A: O(n). B: O(n²) — loop anidado completo. C: construir el `HashSet` es O(n), pero el `Contains` en sí es O(1); si se llama una sola vez, el costo total dominante es O(n) por la construcción.
</details>

**Ejercicio 2.2 — Refactor de O(n²) a O(n)**
Dado un array de enteros, encuentra si existen dos números que sumen un valor `target`. Empieza con la solución de fuerza bruta y optimízala.

<details><summary>Solución</summary>

```csharp
// O(n²) - fuerza bruta
bool ExisteParNaive(int[] nums, int target)
{
    for (int i = 0; i < nums.Length; i++)
        for (int j = i + 1; j < nums.Length; j++)
            if (nums[i] + nums[j] == target) return true;
    return false;
}

// O(n) - usando HashSet
bool ExisteParOptimo(int[] nums, int target)
{
    var vistos = new HashSet<int>();
    foreach (var num in nums)
    {
        if (vistos.Contains(target - num)) return true;
        vistos.Add(num);
    }
    return false;
}
```
El truco clave de Big O: cambiamos tiempo por espacio. Usamos O(n) de memoria extra para bajar de O(n²) a O(n) en tiempo.
</details>

**Ejercicio 2.3 — Benchmark real**
Usa `System.Diagnostics.Stopwatch` para comparar `List<int>.Contains` vs `HashSet<int>.Contains` buscando 10,000 elementos en una colección de 100,000 items. Documenta la diferencia.

<details><summary>Solución (esqueleto)</summary>

```csharp
var lista = Enumerable.Range(0, 100_000).ToList();
var set = new HashSet<int>(lista);
var sw = Stopwatch.StartNew();
for (int i = 0; i < 10_000; i++) lista.Contains(i);
Console.WriteLine($"List: {sw.ElapsedMilliseconds}ms");

sw.Restart();
for (int i = 0; i < 10_000; i++) set.Contains(i);
Console.WriteLine($"HashSet: {sw.ElapsedMilliseconds}ms");
```
Esperado: la diferencia es de órdenes de magnitud (milisegundos vs microsegundos), demostrando O(n) vs O(1) en la práctica.
</details>

### 🚀 Mini-proyecto semanal
**Analizador de logs**: dado un archivo de texto con miles de líneas de logs (IP + timestamp), implementa dos versiones de "contar IPs únicas y las 5 más frecuentes": una con `List<T>` (O(n²)) y otra con `Dictionary<string,int>` (O(n)). Mide y documenta el tiempo de cada una.

### 🔗 Recursos
- [Big O Cheat Sheet](https://www.bigocheatsheet.com/)
- [Complejidad de colecciones .NET](https://learn.microsoft.com/en-us/dotnet/standard/collections/)
- [Data Structures & Algorithms in C# (video, freeCodeCamp)](https://www.youtube.com/watch?v=BBpAmxU_NQo)

---

## 📅 Semana 3 — Programación asíncrona: Task, async/await, CancellationToken

### 🎯 Checklist de objetivos
- [ ] Explicar la diferencia entre paralelismo y asincronía
- [ ] Usar `async`/`await` correctamente sin bloquear el hilo (evitar `.Result`/`.Wait()`)
- [ ] Explicar qué es un deadlock clásico en ASP.NET clásico (`SynchronizationContext`) y por qué en ASP.NET Core es menos común
- [ ] Implementar cancelación cooperativa con `CancellationToken`
- [ ] Usar `Task.WhenAll` / `Task.WhenAny` para paralelizar operaciones I/O-bound

### 📖 Teoría resumida

**Async ≠ paralelo.** Async libera el hilo mientras espera una operación I/O (red, disco, DB); paralelo usa múltiples hilos para CPU-bound work (`Parallel.For`, `Task.Run`).

**El anti-patrón más común**: mezclar código síncrono y asíncrono con `.Result` o `.Wait()`. En contextos con `SynchronizationContext` (como ASP.NET clásico o apps WPF/WinForms), esto causa **deadlock**: el hilo que espera el `.Result` es el mismo hilo que el `await` necesita para continuar. En ASP.NET Core no hay `SynchronizationContext` por defecto, así que el riesgo es menor, pero sigue siendo mala práctica.

**Regla de oro:** "async all the way down" — si un método es async, todo lo que lo llama debería serlo también, hasta el punto de entrada.

**CancellationToken**: no cancela nada por sí mismo — es un mecanismo cooperativo. El código debe revisar `token.IsCancellationRequested` o pasar el token a APIs que lo soporten (`HttpClient`, EF Core), y estas lanzan `OperationCanceledException` cuando se solicita cancelar.

### 💻 Ejercicios prácticos

**Ejercicio 3.1 — Detecta el deadlock**
```csharp
public class MiControlador : Controller
{
    public ActionResult Get()
    {
        var resultado = ObtenerDatosAsync().Result; // ⚠️
        return Ok(resultado);
    }
    async Task<string> ObtenerDatosAsync()
    {
        await Task.Delay(1000);
        return "datos";
    }
}
```
<details><summary>Solución</summary>

En ASP.NET clásico (con `SynchronizationContext`), esto puede colgarse: el hilo principal queda bloqueado en `.Result` esperando que `ObtenerDatosAsync` termine, pero el `await Task.Delay` necesita volver al mismo contexto de sincronización, que está ocupado. Fix: hacer `Get` async y usar `await` en toda la cadena, o usar `ConfigureAwait(false)` en librerías que no necesitan el contexto original.
</details>

**Ejercicio 3.2 — Paralelizar llamadas I/O-bound**
Tienes 3 métodos async independientes (`ObtenerClienteAsync`, `ObtenerPedidosAsync`, `ObtenerFacturasAsync`). Ejecútalos en paralelo en vez de secuencialmente y mide la diferencia.

<details><summary>Solución</summary>

```csharp
// Secuencial: suma los tiempos (~3s si cada uno tarda 1s)
var cliente = await ObtenerClienteAsync();
var pedidos = await ObtenerPedidosAsync();
var facturas = await ObtenerFacturasAsync();

// Paralelo: tarda lo del más lento (~1s)
var clienteTask = ObtenerClienteAsync();
var pedidosTask = ObtenerPedidosAsync();
var facturasTask = ObtenerFacturasAsync();
await Task.WhenAll(clienteTask, pedidosTask, facturasTask);
var cliente2 = clienteTask.Result; // seguro porque ya terminó
```
</details>

**Ejercicio 3.3 — CancellationToken en práctica**
Implementa un método que procese una lista de 1000 items de forma async, revisando cancelación cada 100 items, y desde `Main` cancela después de 2 segundos con `CancellationTokenSource`.

<details><summary>Solución</summary>

```csharp
async Task ProcesarAsync(List<int> items, CancellationToken token)
{
    for (int i = 0; i < items.Count; i++)
    {
        token.ThrowIfCancellationRequested();
        await Task.Delay(50, token); // simula trabajo I/O
    }
}

// Main
var cts = new CancellationTokenSource();
cts.CancelAfter(TimeSpan.FromSeconds(2));
try
{
    await ProcesarAsync(Enumerable.Range(0, 1000).ToList(), cts.Token);
}
catch (OperationCanceledException)
{
    Console.WriteLine("Procesamiento cancelado correctamente.");
}
```
</details>

### 🚀 Mini-proyecto semanal
**Descargador concurrente**: crea una consola que reciba una lista de URLs, las descargue en paralelo con `HttpClient` y `Task.WhenAll`, soporte cancelación tras N segundos con `CancellationTokenSource`, y reporte tiempo total vs tiempo estimado si fuera secuencial.

### 🔗 Recursos
- [Async/await best practices (Stephen Cleary)](https://learn.microsoft.com/en-us/archive/msdn-magazine/2013/march/async-await-best-practices-in-asynchronous-programming)
- [Task-based Asynchronous Pattern](https://learn.microsoft.com/en-us/dotnet/standard/asynchronous-programming-patterns/task-based-asynchronous-pattern-tap)
- [Cancellation in Managed Threads](https://learn.microsoft.com/en-us/dotnet/standard/threading/cancellation-in-managed-threads)

---

## 📅 Semana 4 — Clean Code, SOLID, patrones y proyecto final

### 🎯 Checklist de objetivos
- [ ] Aplicar los 5 principios SOLID identificando violaciones en código existente
- [ ] Implementar el patrón Repository desacoplando la lógica de negocio del acceso a datos
- [ ] Configurar Dependency Injection nativo de .NET (`IServiceCollection`) con los 3 lifetimes (Singleton, Scoped, Transient)
- [ ] Escribir código auto-documentado (nombres, funciones pequeñas, evitar comentarios innecesarios)
- [ ] Construir el proyecto final integrando todos los conceptos del bootcamp

### 📖 Teoría resumida

**SOLID aplicado, no memorizado:**
- **S**ingle Responsibility: una clase, una razón para cambiar. Si tu `PedidoService` valida, calcula impuestos y envía emails, son 3 responsabilidades → 3 clases.
- **O**pen/Closed: extender sin modificar. Usa interfaces + polimorfismo en vez de `switch` gigantes que crecen con cada nuevo caso.
- **L**iskov Substitution: una subclase debe poder sustituir a su clase base sin romper el comportamiento esperado (evita subclases que lancen `NotImplementedException` en métodos heredados).
- **I**nterface Segregation: interfaces pequeñas y específicas, mejor que una gigante que obliga a implementar métodos que no usas.
- **D**ependency Inversion: depende de abstracciones (`IPedidoRepository`), no de implementaciones concretas (`SqlPedidoRepository`). Esto es lo que habilita testing y DI.

**Repository Pattern**: abstrae el acceso a datos detrás de una interfaz. No es solo "para poder cambiar de base de datos" (eso rara vez pasa) — el valor real es testabilidad (mockear el repositorio) y separación de responsabilidades entre lógica de negocio y persistencia.

**Dependency Injection — lifetimes en .NET:**
- `Singleton`: una instancia para toda la vida de la app. Cuidado con estado mutable compartido entre requests.
- `Scoped`: una instancia por request HTTP. Es el default para `DbContext` de EF Core.
- `Transient`: una instancia nueva cada vez que se solicita. Útil para servicios stateless ligeros.

### 💻 Ejercicios prácticos

**Ejercicio 4.1 — Refactor SOLID**
```csharp
// Código con violaciones. Identifícalas y refactoriza.
public class PedidoService
{
    public void ProcesarPedido(Pedido p)
    {
        if (p.Total <= 0) throw new Exception("Total inválido");
        var impuesto = p.Total * 0.21m;
        var conexion = new SqlConnection("connectionString...");
        conexion.Open();
        // insert manual con SQL crudo...
        var smtp = new SmtpClient();
        smtp.Send("noreply@app.com", p.EmailCliente, "Pedido confirmado", "...");
    }
}
```
<details><summary>Solución</summary>

Violaciones: SRP (valida + calcula + persiste + envía email), DIP (depende de `SqlConnection` y `SmtpClient` concretos).

```csharp
public interface IPedidoRepository { Task GuardarAsync(Pedido pedido); }
public interface INotificadorPedidos { Task NotificarConfirmacionAsync(Pedido pedido); }
public interface ICalculadoraImpuestos { decimal Calcular(decimal total); }

public class PedidoService
{
    private readonly IPedidoRepository _repo;
    private readonly INotificadorPedidos _notificador;
    private readonly ICalculadoraImpuestos _calculadora;

    public PedidoService(IPedidoRepository repo, INotificadorPedidos notificador,
        ICalculadoraImpuestos calculadora)
    {
        _repo = repo; _notificador = notificador; _calculadora = calculadora;
    }

    public async Task ProcesarPedidoAsync(Pedido pedido)
    {
        if (pedido.Total <= 0) throw new PedidoInvalidoException("Total debe ser mayor a 0");
        pedido.Impuesto = _calculadora.Calcular(pedido.Total);
        await _repo.GuardarAsync(pedido);
        await _notificador.NotificarConfirmacionAsync(pedido);
    }
}
```
Ahora cada dependencia se puede mockear en tests unitarios, y cada clase tiene una sola razón para cambiar.
</details>

**Ejercicio 4.2 — DI con lifetimes**
Registra `IPedidoRepository` como Scoped, `ICalculadoraImpuestos` como Singleton, y un `IGeneradorIdUnico` como Transient. Explica por qué elegiste cada lifetime.

<details><summary>Solución</summary>

```csharp
builder.Services.AddScoped<IPedidoRepository, SqlPedidoRepository>(); // usa DbContext, debe vivir por request
builder.Services.AddSingleton<ICalculadoraImpuestos, CalculadoraImpuestos>(); // stateless, sin dependencias costosas
builder.Services.AddTransient<IGeneradorIdUnico, GeneradorIdUnico>(); // ligero, sin estado compartido deseado
```
`IPedidoRepository` es Scoped porque normalmente envuelve un `DbContext`, que no es thread-safe y debe limitarse a un request. `ICalculadoraImpuestos` no tiene estado ni dependencias caras, así que Singleton es seguro y eficiente. `IGeneradorIdUnico` como Transient evita cualquier posibilidad de estado compartido accidental.
</details>

### 🚀 PROYECTO FINAL — API REST CRUD asíncrona con medición de complejidad

**Objetivo:** construir una Web API en .NET (ASP.NET Core Minimal API o Controllers) para gestión de "Productos" que integre todo el bootcamp.

**Requisitos funcionales:**
1. CRUD completo (`GET`, `GET/{id}`, `POST`, `PUT`, `DELETE`) 100% async con `CancellationToken` propagado desde el request.
2. Capa de persistencia con **Repository Pattern** (puede ser in-memory con `Dictionary<Guid, Producto>` o EF Core con SQLite).
3. **Dependency Injection** correctamente configurada con los 3 lifetimes justificados.
4. Excepciones de dominio personalizadas mapeadas a códigos HTTP apropiados vía middleware (`ProblemDetails`).
5. Endpoint `GET /productos/buscar?nombre=x` implementado en dos variantes internas (comentadas): una O(n) con `List<T>.Where`, otra O(1) usando un índice `Dictionary<string, List<Producto>>` — documenta el trade-off.
6. Al menos un método recursivo real (ej: cálculo de jerarquía de categorías padre-hijo).
7. Tests unitarios básicos (xUnit) mockeando el repositorio con una implementación fake o Moq.

**Criterios de "hecho":**
- [ ] Swagger/OpenAPI documentando todos los endpoints
- [ ] Manejo de errores centralizado (no try/catch repetido en cada controller)
- [ ] README explicando decisiones de arquitectura y por qué elegiste cada patrón

### 🔗 Recursos
- [SOLID Principles explicados con C#](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/architectural-principles)
- [Dependency Injection en .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)
- [Minimal APIs overview](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis)
- [xUnit + Moq testing guide](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-with-dotnet-test)
