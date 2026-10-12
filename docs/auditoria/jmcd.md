# Auditoría de las reglas de proceso (jmcd)

Qué se audita: las **reglas de proceso** de `CLAUDE.md`, contrastadas con los **últimos 15 commits** (`b955a72..a3bb962`) y con el árbol en la rama `auditoria-jmcd`, el 2026-10-12.

Para que las filas se lean bien:

- **Los commits son importados.** El historial es lineal, sin merges (`git log --merges -n 20` solo devuelve `9987cf0` , **comprobado manualmente**,  que es de s1). En 11 de los 15 el autor es Earvin Saúl Pérez Ramos y el *committer*, «LIDR Academy», y las fechas no van en orden (`b955a72` tiene fecha 28-ago y va antes que los del 20-ago, **comprobado manualmente**). O sea, se rebasaron o se cherry-pickearon hasta las ramas `sN/*`, y la rama donde se escribió cada uno no queda en ningún sitio.
- **Dos reglas cambiaron dentro de la ventana.** `0e56705` reescribe las de rama, commit y PR, y `160fbc7` añade la del contrato. Todo se juzga contra las reglas actuales. Cuando un commit es anterior a la regla, la matriz pone `—`.

## Tabla (una fila por regla)


| #   | Qué pide la regla                                                                                                                          | Qué se miró                                                                                        | Veredicto                            | Evidencia                                                                                                                                                                                                                                                  | Qué haría |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| R1  | Una rama por unidad de trabajo: si ya estás en una rama de trabajo sigues en ella, y solo desde `main` o una `sN/*` se crea `feat/<slug>`. | `git branch -a --contains <sha>` para cada uno de los 15, y `git status -sb`                       | No se puede comprobar con lo que hay | Git no guarda en qué rama nació un commit, y el rebase borró cualquier pista. Haría falta que los cambios entraran por merge o por PR. Además, en el árbol la rama `auditoria-jmcd` no sigue el patrón `feat/<slug>`.                                      | bajarla   |
| R2  | No se commitea nunca directamente en `main` ni en una `sN/*`.                                                                              | `git branch -a --contains`, `git log --merges` y `gh api repos/LIDR-academy/…/commits/<sha>/pulls` | No se cumple                         | Los 15 solo están en refs `sN/*` (`s4/start`, `s5/start`, `upstream/s4/end`), sin ningún merge ni PR que los traiga. Llegaron a las `sN/*` por rebase o commit directo.                                                                                    | bajarla   |
| R3  | El commit sí es por petición: al cerrar cada una, usar la skill `/commit`.                                                                 | `git log -1 --format=%B <sha> | sed '/^[[:space:]]*$/d' | tail -1` para cada uno de los 15         | No se cumple                         | 12 de los 15 terminan en `Co-Authored-By: Claude …`. Los otros 3 no: `a3bb962`, `afc4b74` y `b955a72`. El trailer demuestra que intervino un agente, no que se usara `/commit`, porque la skill no lo añade.                                               | bajarla   |
| R4  | Si un commit toca rutas, controladores, validadores o transformers, el mismo commit actualiza el OpenAPI y el README de la capability.     | `git show --stat` de cada commit y `backend/.adonisjs/client/data.d.ts`                            | Se cumple                            | El único caso posterior a la regla es `cbe9617`: toca 3 controladores y en el mismo commit cambian los decoradores OpenAPI y `docs/capabilities/tasks/README.md`. No necesitaba diff en `.adonisjs/` porque el registro solo importa tipos. Un único caso. | bajarla   |
| R5  | El PR (`gh pr create`, con la descripción completa) se abre una sola vez, al terminar la unidad de trabajo.                                | `gh api …/commits/<sha>/pulls` para los 15 y `gh pr list --state all`                              | No se cumple                         | Ningún commit tiene un PR asociado en el repo del curso. Por ejemplo, la unidad `4427afc` + `4e03d1f` (tests y fix del responsable) no tiene PR. Si hubo PR en el repo de origen, aquí no consta.                                                          | dejarla   |
| R6  | El último paso de la unidad, antes de darla por terminada, es pasar el subagente `adversarial-reviewer` sobre el PR.                       | `.claude/agents/adversarial-reviewer.md` y los PRs de arriba                                       | No se puede comprobar con lo que hay | El subagente es de solo lectura y no escribe nada, y sin PR tampoco hay comentarios de review. Para poder comprobarla, la review tendría que quedar publicada en el PR.                                                                                    | bajarla   |
| R7  | Al abrir el PR, en el chat solo se responde la URL.                                                                                        | Nada: el chat no queda guardado                                                                    | No se puede comprobar con lo que hay | Solo afecta a una sesión que se pierde, así que no deja rastro en el repo ni en GitHub.                                                                                                                                                                    | borrarla  |


## Matriz commit × regla

✓ se cumple · ✗ no se cumple · ? no se puede comprobar · — no aplica (el commit no toca lo que la regla mira, o es anterior a la regla)


| Commit    | Qué es                      | R1  | R2  | R3  | R4  | R5  | R6  | R7  |
| --------- | --------------------------- | --- | --- | --- | --- | --- | --- | --- |
| `a3bb962` | docs: repos del grupo       | ?   | ✗   | ✗   | —   | ✗   | ?   | ?   |
| `21ce54d` | docs(s5): README generado   | ?   | ✗   | ✓   | —   | ✗   | ?   | ?   |
| `afc4b74` | docs(s5): enunciado         | ?   | ✗   | ✗   | —   | ✗   | ?   | ?   |
| `cbe9617` | docs(tasks): OpenAPI        | ?   | ✗   | ✓   | ✓   | ✗   | ?   | ?   |
| `8f9e715` | chore(harness): revisor     | ?   | ✗   | ✓   | —   | ✗   | ?   | ?   |
| `160fbc7` | docs(process): regla R4     | ?   | ✗   | ✓   | —   | ✗   | ?   | ?   |
| `7662fb1` | docs(tasks): README         | ?   | ✗   | ✓   | —   | ✗   | ?   | ?   |
| `c2fa70b` | docs(adr): ADR 0002         | ?   | ✗   | ✓   | —   | ✗   | ?   | ?   |
| `d789d5c` | docs(adr): ADR 0001         | ?   | ✗   | ✓   | —   | ✗   | ?   | ?   |
| `ea5db1f` | feat(openapi): rutas        | ?   | ✗   | ✓   | —   | ✗   | ?   | ?   |
| `190c80c` | docs(architecture): C4      | ?   | ✗   | ✓   | —   | ✗   | ?   | ?   |
| `4e03d1f` | fix(tasks): email           | ?   | ✗   | ✓   | —   | ✗   | ?   | ?   |
| `0e56705` | docs(process): reglas R1/R5 | ?   | ✗   | ✓   | —   | ✗   | ?   | ?   |
| `4427afc` | test(tasks): responsable    | ?   | ✗   | ✓   | —   | ✗   | ?   | ?   |
| `b955a72` | docs(s4): enunciado         | ?   | ✗   | ✗   | —   | ✗   | ?   | ?   |


En R3, ✓/✗ indica si la última línea del mensaje es `Co-Authored-By:`.

En R4: `ea5db1f` toca rutas y `4e03d1f` toca un transformer, pero los dos son anteriores a `160fbc7`. Aun así, `ea5db1f` ya trae el diff de `.adonisjs/`.

## Parte B: las tres líneas

1. **La regla sobre la que me equivoqué:** La rama es por unidad de trabajo, no por petición. Antes de tocar código, mira en qué rama estás: si ya es una rama de trabajo —cualquiera que no sea `main` ni una `sN/*`—, sigue en ella en vez de crear otra. Solo desde `main` o desde una `sN/*` se crea una nueva (`git checkout -b feat/<slug>`). Nunca commitear directo en `main` ni en una `sN/*`. Esta es la que tengo la sensacion de estar mas equivocado pero en general pensaba que se cumplian practicamente todas, aunque algunas fueran dificiles de comproabar. No era consciente de como los commits del repositorio se habian hecho, esto me despisto.
2. **La regla que no se puede comprobar con lo que hay:** El commit sí es por petición: al cerrar cada una, usar la skill `/commit`. En la tabla se asume que si la descripcion del commit contiene `Co-Authored-By: Claude …` es orginado por una peticion, pero es una suposicion con el conocimiento de los commits y el trabajo realizado. Realmente no se puede afirmar que cada commit se corresponda a una peticion. La peticion deberia ser parte del commit para poder comprobarlo.
3. **La regla que borraría, y por qué:** Cuando abras el PR, no repitas ese resumen en el chat: la sesión se va a perder, el PR no. Responde solo con la URL del PR. Lo unico que se puede comprobar aqui es que la PR tiene comentarios, pero si aparecen o no en el chat es algo que no se puede comprobar porque el historico desaparece. Esta regla la moveria a parte del skil o agente que se encarga de crear las PRs.