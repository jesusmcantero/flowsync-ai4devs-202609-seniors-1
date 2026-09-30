# Cuentas y acceso

## Purpose

Permite que una persona cree su cuenta en FlowSync, inicie y cierre sesión, y consulte su perfil, de modo que el resto del sistema sepa quién hace cada petición. Cubre tanto la API (`/api/v1`) como las pantallas de registro, login y perfil.

## Requirements

### Requirement: Registro de cuenta por API

El sistema SHALL permitir crear una cuenta mediante `POST /api/v1/auth/signup` con `fullName`, `email`, `password` y `passwordConfirmation`, y SHALL responder con el usuario creado y un token de acceso ya válido, envueltos en `{ "data": { "user": ..., "token": ... } }`, con estado 200.

#### Scenario: Registro correcto
- **WHEN** se envía un email válido que no está registrado, una contraseña de entre 8 y 32 caracteres, la misma contraseña en `passwordConfirmation` y un `fullName` con texto
- **THEN** la respuesta es 200 con `data.user` (con `id`, `fullName`, `email`, `initials`, `createdAt`, `updatedAt`) y `data.token`, y ese token permite acceder al perfil sin hacer login

#### Scenario: Registro sin nombre
- **WHEN** se envía `fullName: null` junto con un email, contraseña y confirmación válidos
- **THEN** la cuenta se crea igualmente y `data.user.fullName` es `null`

#### Scenario: Falta la clave del nombre
- **WHEN** el cuerpo de la petición no incluye la clave `fullName` (ni siquiera con valor `null`)
- **THEN** la respuesta es 422 con un error de regla `required` sobre el campo `fullName`

### Requirement: Validación de los datos de registro

El sistema SHALL rechazar el registro con estado 422 y un cuerpo `{ "errors": [...] }`, donde cada error indica `message`, `rule` y `field`, cuando los datos no cumplan las reglas, y SHALL NOT crear la cuenta en ese caso.

#### Scenario: Email con formato inválido
- **WHEN** se envía un `email` que no tiene formato de dirección de correo
- **THEN** la respuesta es 422 con un error de regla `email` sobre el campo `email`

#### Scenario: Email demasiado largo
- **WHEN** se envía un `email` de más de 254 caracteres
- **THEN** la respuesta es 422 con un error de regla `maxLength` sobre el campo `email`

#### Scenario: Email ya registrado
- **WHEN** se envía un `email` que ya pertenece a otra cuenta
- **THEN** la respuesta es 422 con un error de regla `database.unique` sobre el campo `email`, y no se crea una segunda cuenta

#### Scenario: Contraseña demasiado corta o demasiado larga
- **WHEN** se envía una `password` de menos de 8 caracteres o de más de 32
- **THEN** la respuesta es 422 con un error de regla `minLength` o `maxLength` sobre el campo `password`

#### Scenario: Confirmación que no coincide
- **WHEN** `passwordConfirmation` es distinta de `password`
- **THEN** la respuesta es 422 con un error de regla `sameAs` sobre el campo `passwordConfirmation`

#### Scenario: Campos obligatorios ausentes
- **WHEN** falta `email`, `password` o `passwordConfirmation`
- **THEN** la respuesta es 422 con un error de regla `required` sobre cada campo que falta

### Requirement: Inicio de sesión por API

El sistema SHALL permitir iniciar sesión mediante `POST /api/v1/auth/login` con `email` y `password`, y SHALL responder con el usuario y un token de acceso nuevo, envueltos en `{ "data": { "user": ..., "token": ... } }`, con estado 200.

#### Scenario: Credenciales correctas
- **WHEN** se envían el email y la contraseña de una cuenta existente
- **THEN** la respuesta es 200 con `data.user` y `data.token`, y ese token permite acceder al perfil

#### Scenario: Varias sesiones a la vez
- **WHEN** la misma cuenta inicia sesión varias veces
- **THEN** cada inicio de sesión devuelve un token distinto y todos siguen siendo válidos a la vez hasta que se cierre cada uno

#### Scenario: Credenciales incorrectas
- **WHEN** el email no pertenece a ninguna cuenta, o la contraseña no es la de esa cuenta
- **THEN** la respuesta es 400 con `{ "errors": [{ "message": "Invalid user credentials" }] }`, idéntica en ambos casos, sin revelar si el email existe

#### Scenario: Email con formato inválido en el login
- **WHEN** se envía un `email` sin formato de dirección de correo, o falta `email` o `password`
- **THEN** la respuesta es 422 con los errores de validación por campo, sin llegar a comprobar las credenciales

### Requirement: Tokens de acceso sin caducidad

El sistema SHALL identificar a la persona en las rutas protegidas mediante la cabecera `Authorization: Bearer <token>`, y SHALL mantener cada token válido indefinidamente mientras no se cierre esa sesión.

#### Scenario: Token antiguo sigue funcionando
- **WHEN** se usa un token emitido hace tiempo y cuya sesión no se ha cerrado
- **THEN** el sistema lo acepta y responde como con un token recién emitido

### Requirement: Consulta del perfil propio

El sistema SHALL devolver, en `GET /api/v1/account/profile`, los datos de la persona dueña del token, envueltos en `{ "data": ... }` con `id`, `fullName`, `email`, `initials`, `createdAt` y `updatedAt`, y SHALL NOT incluir nunca la contraseña.

#### Scenario: Perfil con token válido
- **WHEN** se pide el perfil con un token válido
- **THEN** la respuesta es 200 con los datos de la cuenta dueña de ese token

#### Scenario: Perfil sin token o con token inválido
- **WHEN** se pide el perfil sin cabecera `Authorization`, con un token inventado o con un token de una sesión ya cerrada
- **THEN** la respuesta es 401 con `{ "errors": [{ "message": "Unauthorized access" }] }`

### Requirement: Iniciales del usuario

El sistema SHALL calcular `initials` en mayúsculas a partir del nombre, o del email cuando no hay nombre.

#### Scenario: Nombre con dos o más palabras
- **WHEN** el nombre es "Ada Lovelace"
- **THEN** `initials` es "AL" (primera letra de la primera y de la segunda palabra)

#### Scenario: Nombre de una sola palabra
- **WHEN** el nombre es "Ada"
- **THEN** `initials` es "AD" (las dos primeras letras)

#### Scenario: Sin nombre
- **WHEN** la cuenta no tiene nombre y su email es "ada@example.com"
- **THEN** `initials` es "AE" (primera letra de lo que hay antes y después de la arroba)

### Requirement: Cierre de sesión por API

El sistema SHALL invalidar, en `POST /api/v1/account/logout`, únicamente el token con el que se hace la petición, y SHALL responder 200 con `{ "message": "Logged out successfully" }`, sin el envoltorio `data`.

#### Scenario: Cierre correcto
- **WHEN** se cierra sesión con un token válido
- **THEN** la respuesta es 200 con ese mensaje y, a partir de ahí, ese token recibe 401 en cualquier ruta protegida

#### Scenario: Otras sesiones no se ven afectadas
- **WHEN** la misma cuenta tiene dos tokens y cierra sesión con uno de ellos
- **THEN** el otro token sigue siendo válido

#### Scenario: Cierre sin sesión
- **WHEN** se llama a cerrar sesión sin token o con un token inválido
- **THEN** la respuesta es 401

### Requirement: Respuestas siempre en JSON

El sistema SHALL responder en JSON en todas las rutas de la API, también en los errores, aunque la petición no lo pida expresamente.

#### Scenario: Petición sin cabecera Accept
- **WHEN** se hace una petición a la API sin cabecera `Accept` y la respuesta es un error de autenticación o de validación
- **THEN** el cuerpo es JSON con la lista `errors`, nunca una página HTML ni una redirección

### Requirement: Navegación según el estado de sesión

La aplicación web SHALL ofrecer las pantallas de login (`/login`), registro (`/register`) y perfil (`/profile`), SHALL mostrar login y registro solo a quien no tiene sesión y el perfil solo a quien sí la tiene, y SHALL enviar cualquier otra dirección al perfil.

#### Scenario: Sin sesión intenta ver el perfil
- **WHEN** una persona sin sesión abre `/profile` o cualquier dirección desconocida
- **THEN** la aplicación la lleva a la pantalla de login

#### Scenario: Con sesión intenta ver login o registro
- **WHEN** una persona con sesión abre `/login` o `/register`
- **THEN** la aplicación la lleva a su perfil

#### Scenario: Enlaces entre login y registro
- **WHEN** una persona está en la pantalla de login o en la de registro
- **THEN** ve un enlace "Crea una" hacia el registro, o "Inicia sesión" hacia el login, respectivamente

### Requirement: Pantalla de registro

La aplicación web SHALL mostrar un formulario "Crea tu cuenta" con nombre completo (marcado como opcional), email, contraseña (con la ayuda "Entre 8 y 32 caracteres.") y repetición de contraseña, y SHALL dejar a la persona dentro de su perfil, con la sesión iniciada, en cuanto el registro tenga éxito.

#### Scenario: Registro correcto desde la pantalla
- **WHEN** la persona rellena el formulario con datos válidos y pulsa "Crear cuenta"
- **THEN** el botón pasa a "Creando cuenta…" y queda deshabilitado mientras espera, y al terminar ve su perfil sin tener que iniciar sesión

#### Scenario: Nombre en blanco
- **WHEN** la persona deja el nombre vacío o solo con espacios
- **THEN** la cuenta se crea sin nombre

#### Scenario: Contraseñas distintas
- **WHEN** la contraseña y su repetición no coinciden
- **THEN** ve "Las contraseñas no coinciden." bajo el campo de repetición, sin que se envíe nada al servidor

#### Scenario: Email ya registrado desde la pantalla
- **WHEN** la persona intenta registrarse con un email que ya tiene cuenta
- **THEN** ve bajo el campo de email "Ese email ya está registrado. Inicia sesión en su lugar."

#### Scenario: Errores de validación en castellano
- **WHEN** el servidor rechaza algún campo (email mal formado, contraseña fuera de longitud, campo vacío…)
- **THEN** la persona ve bajo cada campo afectado un mensaje en castellano, como "Introduce una dirección de email válida.", "la contraseña debe tener al menos 8 caracteres." o "Falta rellenar el email."

### Requirement: Pantalla de login

La aplicación web SHALL mostrar un formulario "Inicia sesión" con email y contraseña, y SHALL llevar a la persona a su perfil en cuanto el inicio de sesión tenga éxito.

#### Scenario: Login correcto desde la pantalla
- **WHEN** la persona introduce credenciales correctas y pulsa "Entrar"
- **THEN** el botón pasa a "Entrando…" y queda deshabilitado mientras espera, y al terminar ve su perfil

#### Scenario: Credenciales incorrectas desde la pantalla
- **WHEN** la persona introduce un email o una contraseña que no son correctos
- **THEN** ve un aviso en rojo sobre el formulario: "El email o la contraseña no son correctos."

### Requirement: Pantalla de perfil

La aplicación web SHALL mostrar a la persona con sesión sus iniciales en un círculo, su nombre (o "Sin nombre" si no tiene), su email, la fecha de alta como "Miembro desde" en formato largo en castellano, y un botón "Cerrar sesión".

#### Scenario: Perfil de una cuenta sin nombre
- **WHEN** una persona registrada sin nombre abre su perfil
- **THEN** ve "Sin nombre" como título, sus iniciales calculadas a partir del email y la fecha de alta, por ejemplo "30 de septiembre de 2026"

### Requirement: Cierre de sesión desde la pantalla

La aplicación web SHALL cerrar la sesión en el navegador al pulsar "Cerrar sesión" y llevar a la persona al login, aunque el servidor no llegue a confirmar el cierre.

#### Scenario: Cierre normal
- **WHEN** la persona pulsa "Cerrar sesión"
- **THEN** acaba en la pantalla de login sin ningún aviso de error, y al recargar la página sigue sin sesión

#### Scenario: Cierre con el servidor caído
- **WHEN** la persona pulsa "Cerrar sesión" y el servidor no responde
- **THEN** la aplicación la lleva igualmente al login y el navegador deja de tener sesión, aunque el token no se haya invalidado en el servidor

### Requirement: Sesión persistente entre recargas

La aplicación web SHALL recordar la sesión en el navegador entre recargas y visitas, y SHALL comprobarla contra el servidor al arrancar antes de mostrar ninguna pantalla que dependa de ella.

#### Scenario: Recarga con sesión válida
- **WHEN** una persona con sesión recarga la página o vuelve más tarde
- **THEN** ve un indicador de carga mientras se comprueba la sesión y después su perfil, sin tener que iniciar sesión otra vez

#### Scenario: Sesión rechazada por el servidor
- **WHEN** al arrancar, el servidor rechaza la sesión guardada (por ejemplo, porque se cerró desde otro sitio)
- **THEN** la persona ve la pantalla de login con el aviso "Tu sesión ha caducado. Vuelve a iniciar sesión." y el navegador olvida esa sesión

#### Scenario: Servidor inalcanzable al arrancar
- **WHEN** al arrancar no se puede contactar con el servidor
- **THEN** la persona ve la pantalla de login con el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado.", y la sesión guardada se conserva para que, al recargar con el servidor ya disponible, vuelva a entrar sin iniciar sesión

#### Scenario: El aviso desaparece al volver a entrar
- **WHEN** la persona, tras ver un aviso de sesión perdida, inicia sesión con éxito
- **THEN** el aviso deja de mostrarse

### Requirement: Mensajes de error genéricos en la interfaz

La aplicación web SHALL mostrar un aviso comprensible en castellano cuando una operación de cuenta falle por causas ajenas a los datos introducidos.

#### Scenario: Servidor inalcanzable al enviar un formulario
- **WHEN** la persona envía el formulario de login o de registro y el servidor no responde
- **THEN** ve el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado." y el botón vuelve a estar disponible

#### Scenario: Error interno del servidor
- **WHEN** el servidor responde con un error inesperado
- **THEN** la persona ve el aviso "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento."
