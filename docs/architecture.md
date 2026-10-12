# Arquitectura de FlowSync

Diagrama de contenedores (nivel 2 de C4) de FlowSync tal y como está hoy en el código. Una persona del equipo usa la SPA de React (`frontend/`), que guarda el token de sesión en el `localStorage` del navegador y habla con la API AdonisJS (`backend/`) por HTTP/JSON bajo `/api/v1` y con `Authorization: Bearer`, siempre a través de `src/lib/api.ts`. La API autentica con access tokens opacos (guard `api`), valida con VineJS, da forma a las respuestas con transformers dentro del envoltorio `{ data }` y persiste con Lucid en un único fichero SQLite (`tmp/db.sqlite3`). Cada contenedor solo nombra controladores, modelos, transformers y tablas que existen en el repo.

```mermaid
C4Container
  title FlowSync — diagrama de contenedores

  Person(member, "Miembro del equipo", "Se registra, inicia sesión y gestiona las tareas del espacio")

  System_Boundary(flowsync, "FlowSync") {
    Container_Boundary(browser, "Navegador") {
      Container(spa, "SPA web", "React 19, Vite 8, react-router, Tailwind v4, shadcn/ui", "Rutas públicas /login y /register; protegidas /tasks, /tasks/:id y /profile. AuthProvider gestiona la sesión y src/lib/api.ts es el único cliente HTTP del backend")
      ContainerDb(storage, "localStorage", "Web Storage", "Token de acceso bajo la clave flowsync.token, rehidratado al arrancar contra GET /account/profile")
    }

    Container(api, "API REST", "AdonisJS 7, Lucid 22, VineJS 4, Auth 10", "auth: NewAccountController, AccessTokensController · account: ProfileController · tasks: TasksController, TaskStatusesController, TaskDueDatesController. Modelos User y Task (belongsTo assignee). Transformers User, Task, TaskDetail y TaskAssignee; respuestas envueltas en { data }")

    ContainerDb(db, "Base de datos", "SQLite (better-sqlite3), tmp/db.sqlite3", "Tablas users, auth_access_tokens y tasks (title, status, assignee_id → users, due_date)")
  }

  Rel(member, spa, "Usa", "HTTP, localhost:5173")
  Rel(spa, storage, "Lee y escribe el token")
  Rel(spa, api, "signup, login, logout, profile, listar/crear/ver tareas, cambiar estado y vencimiento", "fetch, JSON, Bearer token, /api/v1 en localhost:3333")
  Rel(api, db, "Lee y escribe usuarios, tokens y tareas", "Lucid ORM")
```

