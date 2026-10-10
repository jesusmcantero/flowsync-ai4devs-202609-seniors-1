# Verificación — «Lo que cada tarea muestra de su responsable»

Requisito de `openspec/specs/tasks/spec.md`.

- **Scenarios del requisito:** 3
- **Scenarios que pensaba que estaban cubiertos:** 3
- **Scenarios que estaban cubiertos antes del ejercicio:** 0
- **Scenarios cubiertos:** 2
- **Escenarios adicionales (no están en la spec):** 6 · **cubiertos:** 3

## Matriz de trazabilidad

Las tres primeras filas son los scenarios de la spec; el resto son escenarios adicionales que la spec no recoge. En los adicionales, «No lo sé» significa que la spec no dice qué debería pasar, y sin eso no se puede decidir si algo lo cubre.

«Cubierto» quiere decir que hay un test que lo comprueba, no que pase: ✔ es un test en verde y ✖ uno en rojo. Los rojos señalan un incumplimiento real del código, que se deja sin arreglar a propósito.


| Scenario                                                                                                                       | Test que lo cubre                                                                                                                                                           | Estado   | Qué me faltó para decidirlo                                                                |
| ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| Al ver una tarea cuyo responsable es "Ada Lovelace", aparecen ese nombre y sus iniciales                                       | `tasks/assignee.spec.ts` › «una tarea muestra el nombre y las iniciales de su responsable» ✔                                                                                | Cubierto | —                                                                                          |
| Al ver cualquier tarea, suelta o en la lista, su responsable aparece sin email ni ningún otro dato de acceso                   | `tasks/assignee.spec.ts` › «la tarea suelta no muestra el email ni datos de acceso del responsable» ✔ · «la lista no muestra el email ni datos de acceso del responsable» ✖ | Cubierto | —                                                                                          |
| Si el responsable se registró sin nombre, la tarea lo muestra sin nombre pero con iniciales                                    | `auth/initials.spec.ts` › «sin nombre, las iniciales salen del email»                                                                                                       | No lo sé | El test se parece, pero mira las iniciales al entrar en la cuenta, no en una tarea         |
| Al crear una tarea o cambiarle el estado, la tarea que se devuelve tampoco muestra el email de su responsable                  | `tasks/assignee.spec.ts` › «crear una tarea no devuelve el email del responsable» ✖ · «cambiar el estado no devuelve el email del responsable» ✖                            | Cubierto | —                                                                                          |
| Junto al responsable no aparece ningún otro dato de su cuenta, como la fecha en que se dio de alta                             | `tasks/assignee.spec.ts` › «junto al responsable no aparecen las fechas de su cuenta» ✖                                                                                     | Cubierto | —                                                                                          |
| Si el responsable se registró con un nombre solo de espacios o que empieza por espacio, la tarea sigue mostrando sus iniciales | `tasks/assignee.spec.ts` › «un nombre solo de espacios sigue dando iniciales en la tarea» ✖ · «un nombre que empieza por espacio sigue dando iniciales en la tarea» ✖       | Cubierto | —                                                                                          |
| Si dos responsables se llaman igual, la tarea permite distinguirlos sin mostrar más datos de su cuenta                         |                                                                                                                                                                             | No lo sé | La spec solo permite nombre e iniciales, y hoy ya se muestra además una referencia interna |
| Si el responsable no tiene nombre, sus iniciales no revelan letras de su email                                                 | `auth/initials.spec.ts` › «sin nombre, las iniciales salen del email»                                                                                                       | No lo sé | Ese test fija justo lo contrario, y la spec no aclara si se permite                        |
| Si el responsable tiene un nombre muy largo, la tarea sigue mostrando su nombre y sus iniciales                                |                                                                                                                                                                             | No lo sé | La spec no fija una longitud máxima ni dice si se recorta                                  |




**El escenario que no supe si faltaba o faltaba la regla en la spec:** "Si el responsable se registró sin nombre, la tarea lo muestra sin nombre pero con iniciales" No tengo claro como se puede calcular las iniciales de un nombre vacio o si eso realmente debe de estar permitido.

**Algo que el escenario no determinaba y tuviste que decidir al escribir el test**: En los escenarios que estan en estado no lo se, que son nuevos escenarios a definir, hay que determinar la regla de como evitar usuarios con nombres duplicados o al menos como visualizarlos.