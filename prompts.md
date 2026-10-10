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
