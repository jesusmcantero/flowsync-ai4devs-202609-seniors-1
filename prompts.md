# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Crear una matriz de trazabilidad para el requisito «Lo que cada tarea muestra de su responsable», solo ese requisito no analices ningun otro requisito, El formato de la matriz es una linea por escenario con las siguientes columnas:





Escenario (una linea)



Test que lo cubre



Estado (Cubierto, no cubierto o no lo se)



Explication del pq no puedo decidir si esta o no esta cubierto

La matriz guardala en el fichero docs/verificacion/jmcd.md Anade este prompt al fichero prompts.md
```

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Basado lo que el Adversarial reviewer ha encontrado, actualiza la matriz de trazabilidad. No commitees, pushes o crees ninguna PR. No toques ningun codigo. Anade este prompt al archivo prompts y cuando la matriz este actualizada, utiliza un subagente para volver a utilizar el adversarial reveiwer con la nueva version de la matriz
```

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
aplica la primera y anade el prompt al fichero prompt.md. No commitees ni crees PR
```

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Revisa el requerimiento y todos sus escenarios definidos. Busca edge cases y posibles escenarios no cubiertos que pueden romper la implementacion y que no se han tenido en cuenta. Anade el prompt a prompts.md y no hagas commit ni crees PR. Lanza un adversarial reviewer como subagente para retar los escenarios que se han descubierto
```

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
consider el feedback del adversarial reviewer y consolidad los Edge cases y escenarios no contemplados en la matriz de trazabilidad, pero reescribiendolos como escenarios funcionales y no tecnicos. No deben contener informacion detallada del modelo datos o  api endpoints. Anade el prompt a prompts.md y no comitees ni cres PR. Lanza un adversarial reviewer sobre la nueva matriz de trazabilidad
```

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Aplica las correcciones basadas en una unica tabla de trazabilidad como manualmente he cambiado en el md file. Anade el prompt a prompts.md y no committees ni hagas PR
```

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Para los escenarios con estado no cubiertos en la tabla de trazabilidad implementa los tests para esos escenarios siguiendo el formato que se esta utlizando ahora en el proyecto. Los test se consideraran echos cuando todos ellos no fallen y cubran el 90% del codigo generado para esa especificacion. Anade le prompt al fichero prompts y no realices ningun commit ni actualices la PR
```

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Si actualiza la matriz de trazablidad. Anade el prompt a prompts y no hagas ningun commit ni actualices la PR
```
