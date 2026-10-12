# 1. Las delta-specs de OpenSpec como fuente de verdad viva

## Estado

Aceptada — 2026-10-12.

## Contexto

FlowSync describe su comportamiento en `openspec/`, con el esquema `spec-driven` (`openspec/config.yaml`, sin contexto ni reglas propias configuradas). Hoy hay ahí dos cosas distintas:

- **La spec viva**, en `openspec/specs/`: dos capabilities, `auth` (45 scenarios) y `tasks` (124 scenarios). Cada requisito lleva sus scenarios en forma WHEN/THEN, y la mayoría fija códigos HTTP, rutas y cuerpos concretos (`POST /api/v1/tasks` → `201`, `?status=archivado` → `422`…).
- **Los changes archivados**, en `openspec/changes/archive/`, los tres con fecha `2026-08-13`. Cada uno trae `proposal.md`, `design.md`, `tasks.md` y una **delta-spec** por capability que toca, con secciones `ADDED` y `MODIFIED`:
  - `add-task-list` crea la capability `tasks` (14 requisitos `ADDED`) y modifica tres requisitos de `auth` y añade uno.
  - `add-task-due-date` (FS-118) añade 11 requisitos y modifica *Una sola vista de tareas, sin señales de presencia*.
  - `add-task-status-filter` (FS-142) añade 7 requisitos y modifica 4, entre ellos el mismo *Una sola vista de tareas…* y *Una sola lista compartida del espacio*, que antes afirmaba que la lista devolvía todas las tareas.

La relación entre las dos partes es mecánica: al archivar un change, sus deltas se aplican sobre `openspec/specs/`. Un `ADDED` añade el requisito, y un `MODIFIED` **sustituye el requisito entero**, con todos sus scenarios. Así, la spec viva es el resultado de aplicar en orden todos los changes archivados, y cada change explica por qué un requisito dice lo que dice.

El proyecto ya ha visto los dos sentidos de esa relación:

- **Delta antes del código**, en `add-task-list` y `add-task-due-date`: la propuesta describe lo que se va a construir.
- **Delta después del código**, en `add-task-status-filter`. Su propuesta lo dice tal cual: «Este change documenta comportamiento que ya está implementado y funcionando en el repositorio». El filtro existía y la spec viva afirmaba lo contrario, así que el change sirvió para corregir requisitos que el código ya había vuelto falsos.

Fuera de `openspec/` hay otras descripciones del producto, que no se mantienen al día con cada cambio: el PRD (`docs/prd/`), el backlog por épicas (`docs/backlog/`) y, desde hace poco, el documento OpenAPI generado de los controladores (`/api.json`).

## Decisión

La fuente de verdad sobre **qué hace FlowSync** es `openspec/specs/`, y la única forma de cambiarla es una delta-spec dentro de un change de OpenSpec que se archiva al terminar.

En concreto:

1. **Ningún cambio de comportamiento observable entra sin su delta.** Si el código ya lo hace y la spec no lo dice, se abre un change que lo documente, como se hizo con `add-task-status-filter`. No se edita `openspec/specs/` a mano.
2. **Si el código y la spec viva discrepan, el defecto está en el código** mientras no exista un change que diga lo contrario. Arreglar la spec para que case con el código es un change más, con su propuesta y su porqué; no se hace en silencio.
3. **Los scenarios son el contrato que se prueba.** Los tests funcionales citan el requisito y los scenarios que cubren, como ya hace `tests/functional/tasks/assignee.spec.ts`.
4. **El resto de documentos son derivados o históricos.** El PRD y el backlog explican el origen y el alcance. El documento OpenAPI describe la forma de la API. Ninguno decide comportamiento: si contradicen a la spec viva, manda la spec.

## Consecuencias

**Lo que ganamos**

- **Una respuesta única** a «¿qué debería pasar aquí?», escrita en forma comprobable (WHEN/THEN con códigos y cuerpos concretos), que sirve igual a una persona que a un agente.
- **El porqué no se pierde.** Un requisito de `openspec/specs/` se rastrea hasta el change que lo introdujo o lo cambió, con su `proposal.md` y su `design.md`. Por ejemplo, que la lista no lleve el vencimiento es una decisión razonada en FS-118, no un olvido.
- **Los cambios se revisan como cambios.** Un `MODIFIED` deja ver en el diff qué deja de ser verdad, como el «todas las tareas» que retiró FS-142.
- **La deriva se puede nombrar.** Con una spec que manda, «el código no hace lo que dice la spec» es un defecto concreto y no una opinión.

**Lo que nos cuesta**

- **La spec no se hace cumplir sola.** Nada en el repo ejecuta los scenarios ni compara el código con `openspec/specs/`. La prueba ya está en el historial:
  - La propuesta de FS-142 advirtió que la distinción entre «filtro inválido» (`422`) y «filtro sin resultados» (`200` vacío) quedaba «sin red» por falta de tests.
  - Cinco días después de archivarla, el commit `8c15707` cambió `listTasksValidator` a `vine.string().optional()`.
  - Hoy `GET /api/v1/tasks?status=archivado` responde `200` con lista vacía, contra el scenario «Estado inventado».
  - La spec siguió diciendo lo correcto y nadie se enteró. Esta decisión solo vale lo que valgan los tests que traduzcan los scenarios, y hoy `tasks` tiene 124 scenarios y un único fichero de tests funcionales.
- **Trabajo doble en cada cambio.** Cada cambio de comportamiento exige escribir propuesta, diseño, tareas y delta antes o después del código. Para un ajuste pequeño, el change puede pesar más que el propio cambio.
- **Un `MODIFIED` sustituye el requisito entero.** Dos changes que tocan el mismo requisito tienen que coordinarse a mano. FS-142 tuvo que copiar en su versión de *Una sola vista de tareas…* los scenarios que había añadido FS-118 («La lista no adelanta el vencimiento», «La pantalla de una tarea no reúne tareas»). Si se le hubiera olvidado alguno, archivarlo lo habría borrado de la spec viva sin dejar error.
- **Documentar después rompe la secuencia.** Cuando el código va por delante, como con FS-142, durante un tiempo la spec viva es falsa y la fuente de verdad deja de serlo. La regla obliga a cerrar ese hueco, pero no evita que se abra.
- **Los artefactos derivados quedan por detrás.** El OpenAPI, el PRD y el backlog no se regeneran desde la spec. El primero ya describe el `status` de la lista como un texto libre, porque refleja el código y no el contrato. Hay que revisarlos a mano o aceptar que se queden atrás.
- **Las specs son largas y en prosa.** `openspec/specs/tasks/spec.md` pasa de 750 líneas. Mantenerla legible y sin contradicciones internas lleva esfuerzo de edición, y crecerá con cada change.
- **Dependemos de la herramienta y de su convención.** El formato de las deltas, el archivado y la aplicación de `MODIFIED` los define OpenSpec. Si cambia su esquema o se deja de usar, `openspec/specs/` sigue siendo Markdown legible, pero perdemos el mecanismo que la mantiene coherente.
