# Capability `tasks`

La lista de trabajo del equipo. Hay una sola lista, compartida por todas las cuentas. En ella se crea una tarea escribiendo solo el título, y desde ella se ve quién lleva cada tarea y en qué estado está. Cada tarea tiene además su propia pantalla, donde se pone o se quita la fecha de vencimiento y se ve si está vencida.

> **Las reglas de negocio no se escriben en este README.** Están en [`openspec/specs/tasks/spec.md`](../../../openspec/specs/tasks/spec.md), que es la fuente de verdad (ver [ADR 0001](../../adr/0001-openspec-como-fuente-de-verdad.md)). Aquí solo se enlazan. Si este documento y la spec no coinciden, manda la spec.

## Endpoints

Todos van bajo `/api/v1` y exigen `Authorization: Bearer <token>` ([`start/routes.ts`](../../../backend/start/routes.ts)). Toda respuesta correcta llega envuelta en `{ "data": ... }`.

| Método | Ruta | Controlador | Devuelve |
|---|---|---|---|
| `GET` | `/tasks` | [`TasksController.index`](../../../backend/app/controllers/tasks_controller.ts) | Lista de [`TaskTransformer`](../../../backend/app/transformers/task_transformer.ts) |
| `POST` | `/tasks` | [`TasksController.store`](../../../backend/app/controllers/tasks_controller.ts) | [`TaskTransformer`](../../../backend/app/transformers/task_transformer.ts) |
| `GET` | `/tasks/:id` | [`TasksController.show`](../../../backend/app/controllers/tasks_controller.ts) | [`TaskDetailTransformer`](../../../backend/app/transformers/task_detail_transformer.ts) |
| `PATCH` | `/tasks/:id/status` | [`TaskStatusesController.update`](../../../backend/app/controllers/task_statuses_controller.ts) | [`TaskTransformer`](../../../backend/app/transformers/task_transformer.ts) |
| `PUT` | `/tasks/:id/due-date` | [`TaskDueDatesController.update`](../../../backend/app/controllers/task_due_dates_controller.ts) | [`TaskDetailTransformer`](../../../backend/app/transformers/task_detail_transformer.ts) |

Con el backend arrancado, el contrato completo de cada operación (parámetros, cuerpos, códigos de respuesta y esquemas) se lee en **`http://localhost:3333/api.json`**, y se puede explorar en la interfaz de `http://localhost:3333/api`. Ese documento se genera a partir de los decoradores de los controladores y de [`app/openapi/schemas.ts`](../../../backend/app/openapi/schemas.ts), así que **describe lo que hace el código, no lo que pide la spec**.

En el frontend, la capability ocupa dos pantallas protegidas ([`routes/app-routes.tsx`](../../../frontend/src/routes/app-routes.tsx)):

- `/tasks`: la lista ([`pages/tasks-page.tsx`](../../../frontend/src/pages/tasks-page.tsx), con [`task-item.tsx`](../../../frontend/src/components/task-item.tsx) y [`task-filter.tsx`](../../../frontend/src/components/task-filter.tsx)).
- `/tasks/:id`: la pantalla de una tarea ([`pages/task-page.tsx`](../../../frontend/src/pages/task-page.tsx)).

Las llamadas a la API pasan todas por [`lib/api.ts`](../../../frontend/src/lib/api.ts).

## Reglas de negocio

Índice de los requisitos de la spec, agrupados por tema. Cada enlace lleva al requisito, con sus scenarios.

**Crear**
- [Creación de una tarea con solo el título](../../../openspec/specs/tasks/spec.md#requirement-creación-de-una-tarea-con-solo-el-título)
- [Ninguna tarea sin título](../../../openspec/specs/tasks/spec.md#requirement-ninguna-tarea-sin-título)
- [Aviso ante un título demasiado largo](../../../openspec/specs/tasks/spec.md#requirement-aviso-ante-un-título-demasiado-largo)

**La lista y el filtro**
- [Una sola lista compartida del espacio](../../../openspec/specs/tasks/spec.md#requirement-una-sola-lista-compartida-del-espacio)
- [Acotar la lista por estado](../../../openspec/specs/tasks/spec.md#requirement-acotar-la-lista-por-estado)
- [Un filtro válido sin resultados es una lista vacía legítima](../../../openspec/specs/tasks/spec.md#requirement-un-filtro-válido-sin-resultados-es-una-lista-vacía-legítima)
- [Un estado que no existe se rechaza, no se responde vacío](../../../openspec/specs/tasks/spec.md#requirement-un-estado-que-no-existe-se-rechaza-no-se-responde-vacío)
- [La lista no lleva el vencimiento](../../../openspec/specs/tasks/spec.md#requirement-la-lista-no-lleva-el-vencimiento)

**Responsable y estado**
- [Lo que cada tarea muestra de su responsable](../../../openspec/specs/tasks/spec.md#requirement-lo-que-cada-tarea-muestra-de-su-responsable)
- [Tres estados fijos](../../../openspec/specs/tasks/spec.md#requirement-tres-estados-fijos)
- [Cambio de estado de cualquier tarea](../../../openspec/specs/tasks/spec.md#requirement-cambio-de-estado-de-cualquier-tarea)

**Fecha de vencimiento**
- [Fecha de vencimiento opcional](../../../openspec/specs/tasks/spec.md#requirement-fecha-de-vencimiento-opcional)
- [Fijar, cambiar y retirar la fecha de vencimiento](../../../openspec/specs/tasks/spec.md#requirement-fijar-cambiar-y-retirar-la-fecha-de-vencimiento)
- [Cuándo una tarea está vencida](../../../openspec/specs/tasks/spec.md#requirement-cuándo-una-tarea-está-vencida)
- [El día de referencia lo pone quien mira](../../../openspec/specs/tasks/spec.md#requirement-el-día-de-referencia-lo-pone-quien-mira)
- [Consulta de una tarea suelta](../../../openspec/specs/tasks/spec.md#requirement-consulta-de-una-tarea-suelta)

**Acceso**
- [Las tareas exigen sesión](../../../openspec/specs/tasks/spec.md#requirement-las-tareas-exigen-sesión)

**Interfaz**
- [Pantalla de la lista del equipo](../../../openspec/specs/tasks/spec.md#requirement-pantalla-de-la-lista-del-equipo)
- [El espacio sin tareas](../../../openspec/specs/tasks/spec.md#requirement-el-espacio-sin-tareas)
- [Crear una tarea desde la lista](../../../openspec/specs/tasks/spec.md#requirement-crear-una-tarea-desde-la-lista)
- [Aviso al intentar crear sin un título válido](../../../openspec/specs/tasks/spec.md#requirement-aviso-al-intentar-crear-sin-un-título-válido)
- [Cambiar el estado desde la propia fila](../../../openspec/specs/tasks/spec.md#requirement-cambiar-el-estado-desde-la-propia-fila)
- [Una sola vista de tareas, sin señales de presencia](../../../openspec/specs/tasks/spec.md#requirement-una-sola-vista-de-tareas-sin-señales-de-presencia)
- [El control para acotar la lista](../../../openspec/specs/tasks/spec.md#requirement-el-control-para-acotar-la-lista)
- [El filtro se pide en la dirección de la lista](../../../openspec/specs/tasks/spec.md#requirement-el-filtro-se-pide-en-la-dirección-de-la-lista)
- [Una lista sin filas no significa siempre lo mismo](../../../openspec/specs/tasks/spec.md#requirement-una-lista-sin-filas-no-significa-siempre-lo-mismo)
- [Lo que sale de la vista no se pierde](../../../openspec/specs/tasks/spec.md#requirement-lo-que-sale-de-la-vista-no-se-pierde)
- [Pantalla de una tarea](../../../openspec/specs/tasks/spec.md#requirement-pantalla-de-una-tarea)
- [Poner y quitar la fecha desde la pantalla de la tarea](../../../openspec/specs/tasks/spec.md#requirement-poner-y-quitar-la-fecha-desde-la-pantalla-de-la-tarea)
- [Aviso ante una fecha que no vale](../../../openspec/specs/tasks/spec.md#requirement-aviso-ante-una-fecha-que-no-vale)
- [La señal de tarea vencida](../../../openspec/specs/tasks/spec.md#requirement-la-señal-de-tarea-vencida)
- [No tener fecha no se penaliza](../../../openspec/specs/tasks/spec.md#requirement-no-tener-fecha-no-se-penaliza)

El porqué de cada requisito está en los changes archivados que lo introdujeron: [`add-task-list`](../../../openspec/changes/archive/2026-08-13-add-task-list/), [`add-task-due-date`](../../../openspec/changes/archive/2026-08-13-add-task-due-date/) y [`add-task-status-filter`](../../../openspec/changes/archive/2026-08-13-add-task-status-filter/).

### Dónde vive cada regla en el código

Esto no repite las reglas: sirve para ir al punto del código que hay que comparar con la spec.

- **Estados y vista por defecto:** `TASK_STATUSES` y `DEFAULT_LIST_STATUSES` en [`app/models/task.ts`](../../../backend/app/models/task.ts). La vista por defecto tiene un espejo en el frontend, en [`lib/types.ts`](../../../frontend/src/lib/types.ts), y nada comprueba que los dos coincidan.
- **Cuándo está vencida:** `Task.isOverdueOn()` en [`app/models/task.ts`](../../../backend/app/models/task.ts). Es la única implementación; el frontend no compara fechas.
- **Validación de título, estado, filtro, `today` y `dueDate`:** [`app/validators/task.ts`](../../../backend/app/validators/task.ts).
- **Qué datos del responsable salen:** [`app/transformers/task_assignee_transformer.ts`](../../../backend/app/transformers/task_assignee_transformer.ts).
- **Esquema de datos:** las migraciones de [`database/migrations/`](../../../backend/database/migrations/) (`create_tasks_table` y `add_due_date_to_tasks_table`).

### Divergencias conocidas entre código y spec

A día de 2026-10-12:

- **Un `status` inventado en la lista no da `422`.** `GET /api/v1/tasks?status=archivado` responde `200` con lista vacía desde el commit `8c15707`, que cambió el validador a `vine.string().optional()`. Contradice el requisito *Un estado que no existe se rechaza, no se responde vacío*.
- **`PUT /tasks/:id/due-date` exige también `today`.** Hay que mandarlo junto con `dueDate`, y sin él responde `422`. El scenario «Poner una fecha a una tarea que no tenía» envía solo `dueDate`.

Cuando se resuelva una, hay que quitarla de esta lista.

## Cómo se prueba en local

### Arrancar

```bash
# backend (la primera vez: npm install, cp .env.example .env, node ace generate:key)
cd backend
node ace migration:run
npm run dev            # http://localhost:3333

# frontend, en otra terminal
cd frontend
npm install
npm run dev            # http://localhost:5173 → /tasks
```

### Tests automáticos

```bash
cd backend
npm test                                    # todas las suites
node ace test functional --files=assignee   # solo los de tareas
```

Hoy la capability solo tiene un fichero de tests, [`tests/functional/tasks/assignee.spec.ts`](../../../backend/tests/functional/tasks/assignee.spec.ts), que cubre el requisito *Lo que cada tarea muestra de su responsable*. El resto de requisitos no tiene tests. El frontend no tiene runner de tests.

Los tests funcionales usan **el mismo fichero SQLite que el servidor de desarrollo** (`backend/tmp/db.sqlite3`). Cualquier test que escriba en la base de datos debe aislarse con `group.each.setup(() => testUtils.db().withGlobalTransaction())`, como hace `assignee.spec.ts`. Si no, sus datos se quedan en tu base de desarrollo.

### A mano contra la API

```bash
API=http://localhost:3333/api/v1

# 1. Cuenta y token
TOKEN=$(curl -s -X POST $API/auth/signup -H 'Content-Type: application/json' \
  -d '{"fullName":"Ada Lovelace","email":"ada@example.com","password":"secreto123","passwordConfirmation":"secreto123"}' \
  | python3 -c 'import json,sys; print(json.load(sys.stdin)["data"]["token"])')
AUTH="Authorization: Bearer $TOKEN"

# 2. Crear, listar y filtrar
curl -s -X POST $API/tasks -H "$AUTH" -H 'Content-Type: application/json' -d '{"title":"Revisar el informe"}'
curl -s $API/tasks -H "$AUTH"
curl -s "$API/tasks?status=done" -H "$AUTH"

# 3. Una tarea suelta (today es obligatorio)
curl -s "$API/tasks/1?today=$(date +%F)" -H "$AUTH"

# 4. Cambiar estado y fecha
curl -s -X PATCH $API/tasks/1/status -H "$AUTH" -H 'Content-Type: application/json' -d '{"status":"in_progress"}'
curl -s -X PUT $API/tasks/1/due-date -H "$AUTH" -H 'Content-Type: application/json' \
  -d "{\"dueDate\":\"2026-09-30\",\"today\":\"$(date +%F)\"}"
```

Estos comandos escriben en la base de desarrollo. Para volver a dejarla vacía: `node ace migration:fresh`.
