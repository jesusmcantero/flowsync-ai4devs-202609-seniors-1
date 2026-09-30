# Cuentas y acceso

## Purpose

Permite que una persona cree su cuenta en FlowSync, entre y salga de ella, y consulte su perfil, de modo que el resto del sistema sepa quién hace cada petición. La web habla con la API bajo `/api/v1`, que identifica a cada persona con un token de acceso enviado como `Authorization: Bearer <token>`.

## Requirements

### Requirement: Crear una cuenta

El sistema SHALL permitir que una persona sin sesión cree una cuenta con nombre opcional, email y contraseña repetida, y SHALL dejarla dentro de su perfil con la sesión ya iniciada, sin pasar por el login.

#### Scenario: Registro correcto
- **WHEN** la persona rellena en "Crea tu cuenta" un email válido que no está registrado, una contraseña de entre 8 y 32 caracteres (la pantalla lo indica con "Entre 8 y 32 caracteres."), la misma contraseña en "Repite la contraseña" y, opcionalmente, su nombre, y pulsa "Crear cuenta"
- **THEN** el botón pasa a "Creando cuenta…" y se deshabilita; la web envía `POST /api/v1/auth/signup` con `fullName`, `email`, `password` y `passwordConfirmation`; la API responde 200 con `{ "data": { "user": ..., "token": ... } }`, donde `user` trae `id`, `fullName`, `email`, `initials`, `createdAt` y `updatedAt` (nunca la contraseña); y la persona ve su perfil con la sesión guardada en el navegador

#### Scenario: Registro sin nombre
- **WHEN** la persona deja el nombre vacío o solo con espacios
- **THEN** la web envía igualmente la clave `fullName` con valor `null`, la cuenta se crea sin nombre y el perfil muestra "Sin nombre"

#### Scenario: Registro directo contra la API
- **WHEN** alguien llama a la API de registro sin pasar por la web
- **THEN** la clave `fullName` es obligatoria aunque admita `null` (si falta, 422 con regla `required` sobre `fullName`); una cadena vacía cuenta como `null`, pero un nombre solo de espacios se guarda tal cual, porque la API no recorta el texto

#### Scenario: Contraseñas que no coinciden
- **WHEN** la contraseña y su repetición son distintas
- **THEN** la web no envía nada al servidor y muestra únicamente "Las contraseñas no coinciden." bajo "Repite la contraseña", aunque otros campos también tengan errores; esos solo aparecerán en el siguiente envío, cuando las contraseñas coincidan. Por API directa, el mismo caso da 422 con regla `sameAs` sobre `passwordConfirmation`

#### Scenario: Datos que el servidor rechaza
- **WHEN** las contraseñas coinciden pero el email no tiene formato válido o supera 254 caracteres, la contraseña tiene menos de 8 o más de 32 caracteres, o falta algún campo obligatorio (la pantalla no comprueba formato ni longitud antes de enviar)
- **THEN** la API responde 422 con `{ "errors": [...] }`, donde cada error trae `message` (en inglés), `rule`, `field` y, en las reglas de longitud, `meta` con el límite; no crea la cuenta; y la web muestra bajo cada campo afectado su traducción al castellano, como "Introduce una dirección de email válida.", "la contraseña debe tener al menos 8 caracteres.", "la contraseña no puede superar los 32 caracteres." o "Falta rellenar el email."

#### Scenario: Email ya registrado
- **WHEN** la persona intenta registrarse con un email que ya tiene cuenta
- **THEN** la API responde 422 con regla `database.unique` sobre `email` y la web muestra bajo el email "Ese email ya está registrado. Inicia sesión en su lugar."; a diferencia del login, el registro sí confirma que ese email existe

### Requirement: Iniciar sesión

El sistema SHALL permitir que una persona con cuenta entre con su email y su contraseña y la SHALL llevar a su perfil, sin revelar en el login si un email concreto está registrado.

#### Scenario: Login correcto
- **WHEN** la persona introduce en "Inicia sesión" el email y la contraseña de su cuenta y pulsa "Entrar"
- **THEN** el botón pasa a "Entrando…" y se deshabilita; la web envía `POST /api/v1/auth/login` con `email` y `password`; la API responde 200 con `{ "data": { "user": ..., "token": ... } }` con un token nuevo; y la persona ve su perfil con esa sesión guardada en el navegador

#### Scenario: Varias sesiones a la vez
- **WHEN** la misma cuenta inicia sesión desde varios navegadores o varias veces
- **THEN** cada login emite un token distinto y todos siguen siendo válidos a la vez; ninguno caduca por tiempo, solo deja de valer cuando se cierra esa sesión concreta

#### Scenario: Credenciales incorrectas
- **WHEN** el email no pertenece a ninguna cuenta o la contraseña no es la de esa cuenta
- **THEN** la API responde 400 (no 401) con `{ "errors": [{ "message": "Invalid user credentials" }] }`, idéntico en ambos casos, y la web muestra sobre el formulario el aviso "El email o la contraseña no son correctos."

#### Scenario: Campos inválidos o vacíos
- **WHEN** la persona envía el email mal formado, o el email o la contraseña vacíos (la pantalla no lo impide)
- **THEN** la API responde 422 con regla `email` o `required` sobre el campo afectado, sin comprobar las credenciales, y la web muestra bajo cada campo su mensaje, como "Introduce una dirección de email válida." o "Falta rellenar la contraseña."; en el login la contraseña no tiene requisito de longitud

#### Scenario: Aviso previo de sesión perdida
- **WHEN** la persona llega al login con un aviso de sesión perdida en pantalla y entra con éxito
- **THEN** el aviso desaparece; si el intento falla, el aviso del intento sustituye al de la sesión perdida

### Requirement: Consultar el propio perfil

El sistema SHALL mostrar a la persona con sesión sus datos de cuenta: iniciales en un círculo, nombre (o "Sin nombre"), email y fecha de alta como "Miembro desde" en formato largo en castellano, junto a un botón "Cerrar sesión".

#### Scenario: Ver el perfil
- **WHEN** una persona con sesión abre su perfil
- **THEN** la web obtiene los datos con `GET /api/v1/account/profile` enviando su token, la API responde 200 con `{ "data": { "id", "fullName", "email", "initials", "createdAt", "updatedAt" } }`, y la pantalla muestra, por ejemplo, "Miembro desde 30 de septiembre de 2026"

#### Scenario: Perfil sin sesión válida
- **WHEN** se pide el perfil a la API sin token, con un token inventado o con el de una sesión ya cerrada
- **THEN** la API responde 401 con `{ "errors": [{ "message": "Unauthorized access" }] }`, sin distinguir entre los tres casos

#### Scenario: Iniciales a partir del nombre
- **WHEN** el nombre es "Ada Lovelace" o "Ada Byron King"
- **THEN** las iniciales son "AL" y "AB": la primera letra de las dos primeras palabras separadas por un espacio, en mayúsculas

#### Scenario: Iniciales de un nombre de una sola palabra
- **WHEN** el nombre es "Ada" o "A"
- **THEN** las iniciales son "AD" y "A": los dos primeros caracteres de esa palabra, o el único que haya

#### Scenario: Iniciales con espacios irregulares
- **WHEN** el nombre, enviado por API directa, contiene dos espacios seguidos ("Ada  Lovelace") o solo espacios
- **THEN** las iniciales son "AD" en el primer caso, porque la segunda palabra se considera vacía, y quedan vacías en el segundo

#### Scenario: Iniciales sin nombre
- **WHEN** la cuenta no tiene nombre y su email es "ada@example.com"
- **THEN** las iniciales son "AE": la primera letra de lo que hay antes y después de la arroba

### Requirement: Cerrar sesión

El sistema SHALL cerrar la sesión en el navegador en cuanto la persona pulse "Cerrar sesión" y llevarla al login, y SHALL invalidar en el servidor solo el token de ese navegador cuando el servidor pueda confirmarlo.

#### Scenario: Cierre normal
- **WHEN** la persona pulsa "Cerrar sesión" con el servidor disponible
- **THEN** el botón pasa a "Cerrando sesión…"; el navegador olvida la sesión; la web envía `POST /api/v1/account/logout` con el token; la API responde 200 con `{ "message": "Logged out successfully" }`, sin el envoltorio `data` que usan las demás respuestas correctas; a partir de ahí ese token recibe 401; y la persona queda en el login sin ningún aviso, y sigue sin sesión al recargar

#### Scenario: Otras sesiones siguen abiertas
- **WHEN** la misma cuenta tiene sesión en dos navegadores y cierra sesión en uno
- **THEN** la sesión del otro navegador sigue siendo válida

#### Scenario: Cierre con el servidor caído
- **WHEN** la persona pulsa "Cerrar sesión" y el servidor no responde o falla
- **THEN** el navegador olvida la sesión igualmente y la persona queda en el login sin aviso, pero el token no se invalida en el servidor y, como no caduca, sigue siendo válido indefinidamente para quien lo tenga

#### Scenario: Cierre sin sesión por API
- **WHEN** se llama a la API de cierre de sesión sin token o con un token que no vale
- **THEN** la API responde 401 con `{ "errors": [{ "message": "Unauthorized access" }] }`

### Requirement: Recuperar la sesión al volver

El sistema SHALL recordar la sesión en el navegador entre recargas y visitas y SHALL confirmarla con el servidor al arrancar, mostrando un indicador de carga mientras tanto; solo una sesión confirmada en esta visita da acceso al perfil.

#### Scenario: Sesión confirmada
- **WHEN** una persona con sesión guardada recarga la página o vuelve más tarde, por mucho tiempo que haya pasado
- **THEN** ve un indicador de carga mientras la web pide `GET /api/v1/account/profile` con el token guardado y, tras la respuesta 200, entra directamente a la pantalla que había pedido

#### Scenario: Sesión que el servidor no reconoce
- **WHEN** al arrancar, la API responde 401 al token guardado, sea porque esa sesión se cerró desde otro sitio o porque el token no es válido
- **THEN** el navegador olvida la sesión y la persona ve el login con el aviso "Tu sesión ha caducado. Vuelve a iniciar sesión."; es el mismo texto sea cual sea la causa, aunque los tokens nunca caducan por tiempo

#### Scenario: Servidor inalcanzable o con error al arrancar
- **WHEN** al arrancar, la web no puede contactar con el servidor o este responde con un error que no es 401
- **THEN** la persona ve el login con el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado." o "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento.", respectivamente; la sesión guardada no se borra, así que recargar con el servidor ya disponible la recupera sin volver a entrar; si en cambio la persona inicia sesión de nuevo, la sesión guardada se sustituye por la nueva y el token anterior sigue siendo válido en el servidor

### Requirement: Acceso a las pantallas según la sesión

El sistema SHALL mostrar el login (`/login`) y el registro (`/register`) solo mientras no haya una sesión confirmada en esta visita, y el perfil (`/profile`) solo cuando la haya; cualquier otra dirección, incluida la raíz, SHALL tratarse como una petición del perfil. En todos los formularios, un fallo ajeno a los datos introducidos SHALL mostrarse como aviso en castellano y SHALL dejar el botón disponible para reintentar.

#### Scenario: Sin sesión confirmada
- **WHEN** alguien sin sesión confirmada abre `/profile`, la raíz o cualquier dirección desconocida
- **THEN** la web lo lleva al login

#### Scenario: Con sesión confirmada
- **WHEN** una persona con sesión confirmada abre `/login`, `/register` o cualquier dirección desconocida
- **THEN** la web la lleva a su perfil

#### Scenario: Paso entre login y registro
- **WHEN** una persona está en el login o en el registro
- **THEN** ve el enlace "Crea una" hacia el registro o "Inicia sesión" hacia el login, respectivamente

#### Scenario: Servidor inalcanzable al enviar un formulario
- **WHEN** la persona envía el login o el registro y el servidor no responde
- **THEN** ve sobre el formulario "No se pudo conectar con el servidor. Comprueba que el backend está arrancado." y el botón vuelve a estar disponible

#### Scenario: Error inesperado del servidor
- **WHEN** la persona envía el login o el registro y el servidor responde con un error inesperado
- **THEN** ve sobre el formulario "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento." y el botón vuelve a estar disponible
