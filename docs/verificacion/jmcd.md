# Verificación — «Lo que cada tarea muestra de su responsable»

Requisito de `openspec/specs/tasks/spec.md`.

- **Scenarios del requisito:** 3
- **Scenarios cubiertos:** 0

## Matriz de trazabilidad

| Scenario | Test que lo cubre | Estado | Por qué no puedo decidir |
|---|---|---|---|
| Al obtener una tarea cuyo responsable es "Ada Lovelace", su `assignee` trae ese nombre y sus iniciales | — (no existe ningún test de `tasks`; `backend/tests/functional/` solo tiene `auth/`) | No cubierto | — |
| Al obtener cualquier tarea, suelta o en la lista, su `assignee` no incluye el email ni otro dato de acceso | — (ningún test pide `/api/v1/tasks` ni inspecciona `assignee`) | No cubierto | — |
| Si el responsable se registró sin nombre, su nombre llega nulo y sus iniciales siguen llegando | — (`auth/initials.spec.ts` › «sin nombre, las iniciales salen del email» comprueba las iniciales del usuario en el login, no el `assignee` de una tarea) | No cubierto | — |
