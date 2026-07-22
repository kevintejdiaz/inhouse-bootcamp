# 🧭 Guía complementaria: rutina de estudio, herramientas y motivación

Aplica a ambos bootcamps (Backend .NET y Frontend JS/Angular).

---

## 🗓️ Rutina de estudio sugerida (2–3h/día)

| Bloque | Duración | Actividad |
|---|---|---|
| 1 | 30–40 min | Lectura de teoría del día + toma de notas propias (no copiar-pegar, reescribe con tus palabras) |
| 2 | 60–90 min | Ejercicios prácticos — intenta resolverlos SIN ver la solución primero, mínimo 15 min de intento real antes de mirar |
| 3 | 30–45 min | Avance del mini-proyecto semanal |
| 4 | 10–15 min | Repaso rápido de lo aprendido el día anterior (repetición espaciada) |

**Estructura semanal:**
- Días 1–4: teoría + ejercicios de cada bloque temático.
- Día 5: mini-proyecto semanal completo.
- Días 6–7 (opcional): buffer para atrasos, o repaso/refuerzo de la semana. No es necesario estudiar los 7 días — mejor 5 días sólidos que 7 días a medias.

**Técnica recomendada:** Pomodoro (25 min enfoque + 5 min descanso) para los bloques de ejercicios, donde la fatiga mental es mayor.

---

## 🛠️ Herramientas recomendadas

### Para el bootcamp Backend (.NET)
- **IDE**: Visual Studio 2022 o JetBrains Rider (si prefieres algo más ligero que VS completo)
- **VS Code + extensiones** (si prefieres VS Code): C# Dev Kit, .NET Install Tool, NuGet Package Manager
- **Testing de APIs**: [Postman](https://www.postman.com/) o el archivo `.http` nativo de VS Code/Rider (más liviano, versionable en git)
- **Documentación de API**: Swagger/OpenAPI (viene integrado en plantillas de ASP.NET Core)
- **Benchmarking**: [BenchmarkDotNet](https://benchmarkdotnet.org/) para medir complejidad de forma rigurosa (más allá del `Stopwatch` básico de los ejercicios)
- **DB local**: SQLite para desarrollo rápido sin instalar SQL Server completo

### Para el bootcamp Frontend (JS/Angular)
- **Editor**: VS Code (el estándar de facto para Angular)
- **Extensiones VS Code esenciales**:
  - Angular Language Service (autocompletado en templates)
  - ESLint
  - Prettier - Code formatter
  - Pretty TypeScript Errors (hace los errores de TS legibles)
  - Auto Rename Tag
- **CLI**: Angular CLI (`npm install -g @angular/cli`) — genera componentes, servicios, y sirve la app localmente
- **DevTools de navegador**: Angular DevTools (extensión de Chrome/Edge) para inspeccionar el árbol de componentes y profiling
- **Testing de API pública sin backend propio**: [PokéAPI](https://pokeapi.co/), [JSONPlaceholder](https://jsonplaceholder.typicode.com/), o la API pública de GitHub

### Transversales
- **Git/GitHub**: repositorio por bootcamp, un commit por ejercicio o mini-proyecto (esto además te da un historial visible de progreso)
- **Notion / Obsidian / simple README.md**: para tu bitácora de notas personales — reescribir teoría con tus palabras fija el aprendizaje mucho mejor que solo leer

---

## 💡 Consejos para mantener la motivación

1. **Construye en público (aunque sea mínimo)**: sube cada mini-proyecto a un repo de GitHub, aunque no esté "perfecto". Verlo acumularse semana a semana es motivador y te sirve de portafolio.

2. **No saltes de bootcamp sin terminar los ejercicios de "predicción de salida"**: son los que más rápido detectan huecos reales de conocimiento — es fácil sentir que "ya sabes" algo hasta que te piden predecir el resultado exacto de un fragmento de código.

3. **Compara explícitamente con lo que ya sabes de .NET**: cada vez que veas un concepto nuevo en JS/Angular (closures, DI, async), pregúntate "¿cómo se ve esto en C#?". Ya tienes el andamiaje mental — solo estás mapeando vocabulario nuevo a conceptos que dominas.

4. **Si te atascas más de 30 min en un ejercicio**, mira la solución, entiéndela completamente, ciérrala, y vuelve a escribirla desde cero sin mirar. Es mejor que quedarte frustrado sin avanzar.

5. **Los proyectos finales son intencionalmente exigentes**: no busques completarlos en un día. Divide el proyecto final en sub-tareas diarias dentro de la Semana 4 (día 1: estructura y modelos, día 2: CRUD, día 3: patrones y DI, día 4: tests, día 5: pulido y README).

6. **Lleva un "log de errores propios"**: cada vez que un bug te tome más de 15 minutos, anótalo (qué pasó, por qué, cómo lo resolviste). Después de unas semanas vas a notar patrones en tus propios errores recurrentes — es la señal de aprendizaje más valiosa que existe.

---

## 📌 Siguiente paso posible

Si quieres, puedo generar el **scaffolding inicial de código** (estructura de carpetas + archivos base) para cualquiera de los dos proyectos finales, o armar un tablero de seguimiento semanal en formato Markdown/checklist que puedas ir marcando a medida que avanzas.
