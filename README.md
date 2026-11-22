
# eSports Arena Manager — Frontend

## Desarrollo Fullstack II | Evaluación Parcial 3

eSports Arena Manager es una aplicación web académica para
gestionar torneos de videojuegos, equipos, inscripciones,
usuarios y sanciones.

El frontend está desarrollado con React y Vite y se comunica
con un backend de microservicios Spring Boot mediante API REST.

El proyecto evolucionó durante tres etapas:

- **EP1:** interfaz inicial con HTML, CSS y JavaScript.
- **EP2:** migración a React, componentes reutilizables,
  validaciones, localStorage y pruebas automatizadas.
- **EP3:** integración con los microservicios, autenticación
  JWT, permisos por rol y consulta de información real.

---

## 1. Repositorios

**Frontend:**

https://github.com/itskevin02/Ea-Sports-Frontend

**Backend:**

https://github.com/itskevin02/Ea-Sports-Backend

El backend utiliza Java 21, Spring Boot, Eureka, Gateway,
Spring Security, JWT, Spring Data JPA y H2 Database.

---

## 2. Tecnologías

### Desarrollo frontend

- React 19
- Vite 8
- JavaScript
- JSX
- HTML5
- CSS3
- Bootstrap 5
- React Bootstrap
- Node.js y npm

### Pruebas

- Jasmine
- Karma
- karma-esbuild
- React Testing Library
- ChromeHeadless
- karma-coverage

### Herramientas

- Visual Studio Code
- Git y GitHub
- PowerShell
- Navegador web
- GitHub Actions

---

## 3. Arquitectura e integración

El frontend consume las API del backend a través de
Spring Cloud Gateway.

```text
          USUARIO
             |
             v
      FRONTEND REACT
        Puerto 5173
             |
             | HTTP / JSON
             v
       API GATEWAY
        Puerto 8080
             |
             v
          EUREKA
        Puerto 8761
             |
    +--------+----------+
    |        |          |
    v        v          v
   AUTH     USER     OTROS SERVICIOS
   8081     8083      Spring Boot
    |        |          |
    +--------+----------+
             |
             v
       BASES DE DATOS H2
```

Gateway recibe las peticiones y las dirige al
microservicio correspondiente.

En el frontend se utiliza una capa de servicios
para centralizar las peticiones HTTP.

### Carpeta `src/services`

Los archivos de esta carpeta permiten consultar
las diferentes API:

- `api.js`: función común para las peticiones HTTP.
- `auth.js`: inicio de sesión.
- `sesion.js`: manejo de la sesión JWT.
- `usuarios.js`: operaciones de usuarios y mi perfil.
- `juegos.js`: gestión de juegos.
- `torneos.js`: consulta de torneos.
- `equipos.js`: gestión de equipos.
- `inscripciones.js`: gestión de inscripciones.
- `sanciones.js`: gestión de sanciones.

---

## 4. Funcionalidades del frontend

### 4.1 Inicio

La aplicación dispone de una pantalla inicial
con información de eSports Arena Manager y
accesos a sus funcionalidades.

### 4.2 Torneos

La vista de torneos permite:

- Consultar torneos obtenidos del backend.
- Buscar por nombre o videojuego.
- Filtrar por juego.
- Filtrar por estado.
- Filtrar por fechas.
- Validar rangos de fechas incorrectos.
- Limpiar filtros.
- Consultar el detalle de un torneo.

Cuando la información de un juego no está disponible,
el sistema puede mostrar su identificador.

### 4.3 Detalle de torneo

La vista integrada con la API presenta datos como:

- Nombre.
- Juego asociado.
- Plataforma.
- Ubicación.
- Estado.
- Cantidad de equipos.
- Fecha de inicio.
- Cierre de inscripción.
- Descripción.
- Imagen opcional.

Las funcionalidades históricas de EP2 se conservan
en componentes separados cuando corresponde.

### 4.4 Videojuegos

La sección Juegos permite consultar
los videojuegos registrados en el backend.

Las cuentas con permisos administrativos pueden
realizar las operaciones habilitadas de gestión.

### 4.5 Equipos

La aplicación permite trabajar con equipos
registrados en el microservicio Team.

Se integraron las operaciones de:

- Consulta de equipos.
- Creación.
- Actualización.
- Eliminación.

El backend mantiene las validaciones de negocio,
incluyendo la restricción para eliminar equipos
que tengan inscripciones asociadas.

### 4.6 Inscripciones

La sección Inscripción se conecta al servicio
Registration para administrar las inscripciones
registradas en el servidor.

El proyecto conserva componentes de EP2
con validaciones y lógica anterior, separados
de las operaciones integradas con la API.

### 4.7 Administración

El panel de Administración utiliza los
servicios User y Sanction.

Incluye funcionalidades para:

- Consultar usuarios.
- Crear usuarios.
- Actualizar usuarios.
- Eliminar usuarios.
- Consultar sanciones.
- Crear y administrar sanciones.

El backend valida los permisos y las reglas
de negocio correspondientes.

La sección administrativa solo se muestra
a las cuentas identificadas como ADMIN.

También se conserva una vista opcional
de los registros anteriores de EP2.

### 4.8 Inicio de sesión

Se implementó una pantalla de autenticación
con usuario y contraseña.

La petición se realiza mediante:

```http
POST /auth/login
```

El backend verifica las credenciales y devuelve
un token JWT junto con los datos de la cuenta.

El frontend utiliza esa información para
administrar el estado de sesión.

### 4.9 Sesión JWT

La aplicación incorpora:

- Almacenamiento local de la sesión.
- Recuperación de sesión al abrir la aplicación.
- Comprobación de vencimiento del JWT.
- Cierre de sesión.
- Manejo de respuestas HTTP 401.
- Manejo de respuestas HTTP 403.
- Envío del token en peticiones protegidas.

Ejemplo de encabezado:

```http
Authorization: Bearer TOKEN_JWT
```

La validación efectiva de permisos se realiza
en los microservicios protegidos, no solamente
ocultando botones en React.

### 4.10 Mi cuenta y mi perfil

La pantalla Perfil distingue dos fuentes
de información.

**Información de Auth**

- Nombre de usuario.
- Rol.

**Información de User**

- Nombre del perfil.
- Nickname.
- Correo.
- Estado.

El frontend consulta:

```http
GET /users/mi-perfil
```

El backend obtiene `authId` desde el JWT
y busca el perfil correspondiente.

De esta forma, el frontend no necesita
indicar manualmente el ID de otro usuario.

Si la cuenta no tiene un perfil vinculado,
la pantalla presenta un aviso.

Los administradores también pueden acceder
a los perfiles históricos de EP2.

---

## 5. Estructura del repositorio

```text
Ea-Sports-Frontend/
|
|-- README.md
|-- index.html
|-- torneos.html
|-- detalle-torneo.html
|-- equipo.html
|-- inscripcion.html
|-- perfil.html
|-- css/
|-- js/
|
|-- frontend-react/
|   |-- public/
|   |-- src/
|   |   |-- auth/
|   |   |-- components/
|   |   |-- data/
|   |   |-- logica/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- tests/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |
|   |-- .env.development
|   |-- package.json
|   |-- vite.config.js
|   |-- karma.conf.cjs
|   |-- karma.coverage.conf.cjs
|   |-- README.md
|
|-- .github/
    |-- workflows/
        |-- deploy-react-pages.yml
```

### Organización

- `auth`: contexto y gestión de autenticación.
- `components`: componentes React reutilizables.
- `data`: datos y recursos de las etapas anteriores.
- `logica`: funciones y validaciones del frontend.
- `pages`: pantallas principales.
- `services`: comunicación con las API y sesión.
- `tests`: pruebas automatizadas.
- `public`: recursos estáticos.

---

## 6. Requisitos de ejecución

Para ejecutar el frontend se requiere:

- Node.js, preferentemente versión 22.
- npm.
- Git.
- Navegador web.
- Backend disponible para las funciones de EP3.

Comprobar las herramientas:

```powershell
node -v
npm -v
git --version
```

---

## 7. Instalación

Clonar el repositorio:

```powershell
git clone https://github.com/itskevin02/Ea-Sports-Frontend.git
```

Ingresar al proyecto:

```powershell
cd Ea-Sports-Frontend
```

Seleccionar la rama de integración:

```powershell
git switch develop
git pull origin develop
```

Entrar a React:

```powershell
cd frontend-react
```

Instalar dependencias:

```powershell
npm install
```

---

## 8. Configuración de la API

La aplicación utiliza la variable:

```properties
VITE_API_URL=http://localhost:8080
```

Esta configuración se encuentra en:

```text
frontend-react/.env.development
```

La dirección corresponde a Spring Cloud Gateway.

Para trabajar localmente, se deben iniciar
los servicios del backend necesarios para
la funcionalidad que se quiera probar.

El backend tiene su propio README con
las instrucciones de ejecución.

### Puertos principales

| Componente | Puerto |
|---|---|
| React / Vite | 5173 |
| Gateway | 8080 |
| Auth | 8081 |
| Game | 8082 |
| User | 8083 |
| Team | 8084 |
| Tournament | 8085 |
| Registration | 8086 |
| Sanction | 8089 |
| Eureka | 8761 |

Los demás puertos se encuentran documentados
en el repositorio backend.

---

## 9. Iniciar la aplicación

Desde `frontend-react`:

```powershell
npm run dev
```

Abrir en el navegador:

http://localhost:5173

Para utilizar las funciones conectadas con
Spring Boot, comprobar que Gateway y los
microservicios requeridos estén ejecutándose.

---

## 10. Pruebas automatizadas

Se implementaron pruebas utilizando Jasmine,
Karma y React Testing Library.

Se comprueban funcionalidades relacionadas con:

- Componentes React.
- Validaciones de formularios.
- Búsqueda y filtros.
- Navegación.
- Torneos.
- Equipos.
- Inscripciones.
- Sanciones.
- Información de administración.
- Sesión y autenticación.
- Perfil conectado con la API.
- Respuestas correctas y errores del servidor.

### Ejecutar las pruebas

```powershell
npm test
```

### Resultado comprobado durante EP3

```text
TOTAL: 63 SUCCESS
```

Las 63 pruebas finalizaron correctamente
durante la comprobación final del frontend.

Varias pruebas utilizan respuestas simuladas
de API; por eso no es necesario mantener
todos los microservicios encendidos para
ejecutar la suite de Karma.

---

## 11. Cobertura de código

Desde EP2 se cuenta con una configuración
independiente para medir cobertura.

Archivo:

```text
karma.coverage.conf.cjs
```

Los casos correspondientes están en:

```text
pruebas-cobertura/
```

Los módulos seleccionados son:

- `validarInscripcion.js`
- `eliminarInscripcion.js`
- `ranking.js`
- `eliminarEquipo.js`
- `gestionarJugadores.js`

### Ejecutar cobertura

```powershell
.\node_modules\.bin\karma.cmd start karma.coverage.conf.cjs
```

Abrir el informe HTML:

```powershell
Start-Process .\coverage\html\index.html
```

En la evaluación anterior se registró
100 % de cobertura para los cinco módulos
de lógica seleccionados.

Ese resultado no representa la cobertura
total de la aplicación React ni una nueva
medición global de EP3.

---

## 12. Compilación

Para comprobar que el frontend compila:

```powershell
npm run build
```

Los archivos generados quedan en:

```text
frontend-react/dist/
```

También se puede ejecutar:

```powershell
npm run lint
```

Este último comando utiliza Oxlint
para revisar el código.

---

## 13. Persistencia y almacenamiento

Durante EP2 se utilizó localStorage para
guardar información en el navegador.

En EP3 se incorporó la integración con los
microservicios del backend.

### Datos obtenidos desde el backend

- Cuentas de autenticación.
- Perfiles User.
- Videojuegos.
- Torneos.
- Equipos.
- Inscripciones.
- Sanciones.

### Datos locales conservados

Se mantienen determinados registros de
EP2 en localStorage, como parte de la
compatibilidad con las funcionalidades
anteriores.

La sesión JWT también se almacena en el
navegador, de acuerdo con la implementación
actual del proyecto.

La persistencia de los datos del servidor
depende de las bases H2 del backend y del
perfil utilizado al iniciar cada microservicio.

### Modo persistente del backend

El backend permite iniciar servicios con:

```powershell
mvn -pl msvc-user spring-boot:run "-Dspring-boot.run.profiles=persistente"
```

Esto activa una base H2 en archivo para
el servicio indicado.

El frontend no administra directamente
los archivos de base de datos.

---

## 14. Git y trabajo colaborativo

Se utilizó GitHub para organizar
los avances y mantener evidencia
de los cambios realizados.

### Flujo de ramas

- `main`: versión estable.
- `develop`: integración del proyecto.
- `feature/*`: nuevas funcionalidades.
- `fix/*`: correcciones.
- `refactor/*`: reorganización de código.

### Procedimiento

1. Crear una rama desde `develop`.
2. Implementar la funcionalidad.
3. Ejecutar las pruebas.
4. Comprobar la compilación.
5. Crear un commit.
6. Subir la rama.
7. Crear un Pull Request hacia `develop`.
8. Revisar y fusionar los cambios.

Durante EP3 se realizaron PR para
integración de API, autenticación, perfil,
administración y pruebas automatizadas.

---

## 15. GitHub Pages

El repositorio incluye un workflow de
GitHub Actions:

```text
.github/workflows/deploy-react-pages.yml
```

El workflow se ejecuta al actualizar
la rama `develop`.

Utiliza Node.js 22, instala dependencias,
compila React y publica los archivos de `dist`.

Dirección del sitio:

https://itskevin02.github.io/Ea-Sports-Frontend/

### Consideración sobre EP3

GitHub Pages aloja el frontend estático,
pero no ejecuta los microservicios Java.

La versión de EP3 utiliza una API configurada
localmente en `localhost:8080`.

Para que una versión publicada funcione
con el backend desde otros computadores,
es necesario desplegar un backend accesible
y configurar su URL pública en la compilación
del frontend.

La publicación de React, por sí sola,
no demuestra un despliegue completo de EP3.

---

## 16. Pruebas de integración realizadas

Durante EP3 se comprobó el funcionamiento
del frontend junto con los microservicios
ejecutados localmente.

Se verificaron funcionalidades como:

- Login con cuentas Auth.
- Reconocimiento de roles.
- Acceso administrativo.
- Consulta del perfil vinculado.
- Visualización de nombre, nickname,
  correo y estado desde User.
- Manejo de ausencia de perfil.
- Consulta de torneos y juegos.
- Integración de las pantallas administrativas.

También se comprobaron las peticiones HTTP
y las reglas de negocio del backend por separado.

---

## 17. Evolución del proyecto

### EP1

Desarrollo inicial con HTML, CSS y JavaScript.

### EP2

Migración a React, componentes reutilizables,
validaciones, formularios, almacenamiento local,
cobertura y pruebas automatizadas.

### EP3

Integración con los microservicios mediante
Gateway, autenticación JWT, control de permisos,
administración conectada a las API y consulta
del perfil real de usuario.

Se conservaron ciertas funcionalidades
históricas para facilitar la transición
entre evaluaciones.

---

## 18. Limitaciones y mejoras futuras

El proyecto se desarrolló para fines académicos.

Consideraciones actuales:

- El backend debe estar disponible para
  utilizar las funciones integradas.
- Los registros históricos de localStorage
  no se migraron automáticamente a H2.
- El perfil de usuario requiere una
  vinculación administrativa con Auth.
- GitHub Pages publica React, no Spring Boot.
- El despliegue completo requiere una API
  pública y configuración adicional.
- Las pruebas automatizadas no reemplazan
  las comprobaciones HTTP reales.
- La configuración de sesión en el navegador
  puede reforzarse en futuras versiones.

---

## 19. Estado final de EP3

- Frontend React integrado con API REST.
- Inicio de sesión JWT implementado.
- Permisos de interfaz por rol.
- Servicios centralizados para peticiones HTTP.
- Perfil de usuario conectado a Auth y User.
- Pantallas de equipos, inscripciones y
  administración conectadas al backend.
- 63 pruebas automatizadas exitosas.
- Compilación Vite verificada.
- Trabajo integrado mediante Pull Requests.
- Persistencia configurable en el backend.

**Estado:** versión académica EP3 integrada
en la rama `develop`.

---

## 20. Conclusión

eSports Arena Manager permitió integrar
los conocimientos de desarrollo frontend
con la arquitectura de microservicios
implementada en el backend.

La aplicación evolucionó desde una interfaz
estática hasta un frontend React que consume
API REST, administra sesiones y utiliza
información registrada en el servidor.

El proyecto permite continuar incorporando
mejoras de funcionalidad, seguridad,
persistencia y despliegue.
