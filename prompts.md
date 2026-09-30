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

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
Dada la funcionalidad de cuentas y accesso ya implementada en el proyecto necesito que me des la especificacion que represente el estado actual de esa capability del sistema. Creala como archivo .md dentro de la carpeta docs/spec-viva/jmcd.md. El formato a seguir en la spec es:
- Arriba, un `## Purpose` de una o dos frases: para qué existe esta capability.
- Debajo, `## Requirements`, y colgando de él `### Requirement:` en los que el sistema **SHALL** hacer algo.
- Bajo cada requisito, al menos un `#### Scenario:` de cuatro almohadillas, con dos viñetas: `- **WHEN**` y `- **THEN**`. No hay casilla para el `GIVEN`: la precondición se mete dentro del `WHEN`.
- En castellano, salvo las mayúsculas de la RFC.
Necesito que sigas las siguientes reglas:
- Nada de ADDED, MODIFIED ni REMOVED. Eso es el vocabulario de un delta, y esto no es un delta: es la verdad actual del sistema. Si tu archivo tiene una de esas secciones, has escrito otra cosa.
- Solo comportamiento observable desde fuera. Ni un nombre de clase, ni un nombre de archivo, ni una ruta de código. En la API, observable es la petición y la respuesta. En la pantalla, observable es lo que una persona ve y puede hacer.
- No toques el código. Ni siquiera para arreglar lo que encuentres, y sobre todo para eso: lo que encuentres es material de la parte B.
```

**Qué salió:** creo dos commits, uno con el cambio inicial y otro con los cambios de el adversarial reviewer

## Prompt 2

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
Sin realizar ningun cambio en el archivo docs/spec-viva/jmcd.md busca inconsistencias entre los difirentes requerimientos. Listamelos aqui. Anade este prompt al archivo prompts con el mismo formato del prompt ya anadido
```

## Prompt 3

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
Necesito que consolides los requerimientos y escnarions en el documento docs/spec-viva/jmcd.md para que sean unidades funcionales de cara a un usuario. Puedes especificar como frontend y backend se comunican pero como parte de los escenarios, pero no como requierimientos separados. Resuelve las inconsistencias previas basandote en lo que ya esta implementado. Anade este prompt al archivo prompts con el mismo formato de los prompts ya anadidos
```

## Prompt 4

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
Sin realizar ningun cambio en el archivo docs/spec-viva/jmcd.md busca inconsistencias entre los difirentes requerimientos. Listamelos aqui. Anade este prompt al archivo prompts con el mismo formato del prompt ya anadido
```
