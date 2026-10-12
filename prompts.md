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

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Para los últimos 15 commits del repositorio y el estado actual del árbol, utliza las Reglas de proceso del archivo claude.md para verificar cuales se cumplieron en cada uno de los commits. Necesito que para cada commit y cada regla me proporciones 





Qué pide la regla. Una frase, con tus palabras. Si necesitas tres, es que ahí hay dos reglas metidas en una.



Que se miro para comprobarla, comando concreto o archivo



Veredicto con valores se cumple, no se cumple o no se puede comprobar con lo que hay



La evedencia  en una línea. Si el veredicto es no se cumple, el sitio donde se rompió. Si es no se puede comprobar, qué falta para poder comprobarla.



Que harias con ella: dejar, borrarl o bajarla

anade este prompt al archivo prompts. No crees ninguna pr
```

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Para la regla R3 asume que si el commit contiene Co-Authored-By: en la ultima linea de la descripcion esta hecho con la ayuda de un agente. Anade le prompt a prompts. No hagas ningun pr
```
