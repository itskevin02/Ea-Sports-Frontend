
# eSports Arena Manager

**eSports Arena Manager** es una aplicación frontend para la gestión de torneos de videojuegos competitivos.

El proyecto permite consultar torneos, registrar jugadores, crear equipos, realizar inscripciones y administrar sanciones, mediante una interfaz desarrollada con React.

Esta versión corresponde a la **Evaluación Parcial 2 (EP2)** y continúa el trabajo realizado durante la Evaluación Parcial 1.

## 1. Tecnologías utilizadas

El proyecto fue desarrollado utilizando:

- HTML5
- CSS3
- JavaScript
- React 19
- Vite 8
- Bootstrap 5
- Node.js y npm
- Git y GitHub

Para las pruebas automatizadas se utilizaron:

- Jasmine
- Karma
- React Testing Library
- ChromeHeadless

La aplicación utiliza `localStorage` para guardar datos en el navegador.

Actualmente funciona como un frontend independiente, sin conexión a un backend ni a una base de datos externa.

## 2. Funcionalidades principales

### Inicio

La pantalla de inicio incluye:

- Presentación de eSports Arena Manager.
- Información general de la plataforma.
- Estadísticas de torneos, equipos e inscripciones.
- Torneos destacados que todavía reciben participantes.
- Próximos cierres de inscripción.
- Video de referencia de una competencia de eSports.
- Accesos rápidos a las funcionalidades principales.

### Torneos

El catálogo permite:

- Consultar los torneos registrados.
- Buscar torneos por nombre o videojuego.
- Filtrar por videojuego.
- Filtrar por estado del torneo.
- Filtrar por rango de fechas de inicio.
- Validar rangos de fechas incorrectos.
- Limpiar los filtros.
- Mostrar un mensaje cuando no existen resultados.
- Acceder al detalle de cada torneo.

### Detalle del torneo

Cada torneo presenta:

- Nombre, videojuego y plataforma.
- Descripción de la competencia.
- Fecha de inicio y cierre de inscripción.
- Estado del torneo.
- Participantes inscritos.
- Cupos disponibles.
- Listado de participantes según el estado del torneo.
- Tabla de posiciones.
- Llaves de enfrentamientos.
- Calendario de partidas.
- Premios simbólicos para los primeros tres lugares.

Los resultados y las clasificaciones se muestran únicamente cuando corresponde al estado de la competencia y existen datos disponibles.

Los premios son demostrativos y no representan resultados reales.

### Inscripción a torneos

Los jugadores y equipos pueden inscribirse en torneos disponibles.

El sistema valida:

- Estado del torneo.
- Fecha de cierre.
- Cupos disponibles.
- Tipo de participante.
- Cantidad mínima de integrantes.
- Estado activo del equipo.
- Inscripciones duplicadas.
- Sanciones vigentes del jugador.
- Sanciones del equipo.
- Sanciones vigentes de los integrantes del equipo.

También permite cancelar inscripciones registradas mediante un botón de eliminación con confirmación.

Cuando se elimina una inscripción, se libera el cupo local correspondiente sin eliminar al jugador ni al equipo.

### Gestión de equipos

Permite:

- Crear equipos.
- Seleccionar un videojuego.
- Asignar un capitán.
- Agregar integrantes.
- Evitar integrantes repetidos.
- Comprobar la cantidad de integrantes.
- Retirar integrantes.
- Eliminar equipos con confirmación.

Al eliminar un equipo, también se eliminan sus inscripciones locales asociadas.

### Perfil de jugador

Permite:

- Registrar perfiles.
- Consultar información del jugador.
- Editar apodo y correo electrónico.
- Consultar equipos asociados.
- Consultar inscripciones.
- Visualizar el historial disponible.
- Consultar sanciones registradas.

### Panel de Administración

El panel permite:

- Registrar jugadores.
- Editar información.
- Eliminar jugadores cuando no tienen vínculos pendientes.
- Consultar jugadores registrados.
- Identificar sanciones vigentes.
- Aplicar sanciones a cualquier jugador registrado.
- Registrar motivo y fecha de término de la sanción.
- Levantar sanciones.
- Conservar el historial de sanciones.

Un jugador sancionado no puede realizar nuevas inscripciones mientras su sanción esté vigente.

El sistema también impide inscribir equipos que tengan integrantes sancionados.

## 3. Estructura del proyecto

La aplicación React se encuentra en la carpeta `frontend-react`.

```text
Ea-Sports-Frontend/
|
|-- README.md
|-- frontend-react/
|   |-- public/
|   |   |-- torneos/
|   |
|   |-- src/
|   |   |-- components/
|   |   |-- data/
|   |   |-- logica/
|   |   |-- pages/
|   |   |-- tests/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |
|   |-- package.json
|   |-- vite.config.js
|   |-- karma.conf.cjs
|
|-- .github/
    |-- workflows/
        |-- deploy-react-pages.yml
```

Las carpetas principales tienen las siguientes responsabilidades:

- `components`: componentes reutilizables.
- `data`: datos iniciales y de demostración.
- `logica`: funciones de validación y procesamiento.
- `pages`: pantallas de la aplicación.
- `tests`: pruebas automatizadas Jasmine.
- `public`: imágenes y archivos estáticos.

## 4. Requisitos para ejecutar el proyecto

Se recomienda tener instalado:

- Node.js 22
- npm
- Visual Studio Code
- Google Chrome, para ejecutar las pruebas Karma

## 5. Instalación y ejecución

### Clonar el repositorio

```powershell
git clone https://github.com/itskevin02/Ea-Sports-Frontend.git
```

Entrar a la carpeta:

```powershell
cd Ea-Sports-Frontend
```

Para trabajar con la versión final de EP2:

```powershell
git switch feature/cierre-final-ep2
```

### Instalar dependencias

Desde la raíz del repositorio:

```powershell
npm install --prefix frontend-react
```

### Ejecutar la aplicación

```powershell
npm --prefix frontend-react run dev
```

Vite mostrará una dirección local, normalmente:

```text
http://localhost:5173/
```

Abrir esa dirección en el navegador.

## 6. Pruebas automatizadas

Para comprobar el funcionamiento del proyecto se implementaron pruebas utilizando Jasmine, Karma y React Testing Library.

Las pruebas verifican funciones y comportamientos relacionados con:

- Visualización de torneos.
- Búsqueda y filtros.
- Navegación hacia el detalle.
- Validaciones de inscripción.
- Cálculo de cupos.
- Plazos de inscripción.
- Requisitos de equipos.
- Sanciones vigentes.
- Componentes de ranking y partidas.
- Eliminación de equipos.
- Eliminación de inscripciones.

### Ejecutar las pruebas

Desde la raíz del repositorio:

```powershell
npm --prefix frontend-react test
```

**Último resultado verificado:**

```text
TOTAL: 29 SUCCESS
```

Las 29 pruebas finalizaron correctamente, sin pruebas fallidas.

Durante la ejecución pueden aparecer advertencias de archivos estáticos porque Karma utiliza un servidor diferente al de Vite. Estas advertencias no impidieron completar las pruebas.

## 7. Compilación de producción

Para generar la versión de producción:

```powershell
npm --prefix frontend-react run build
```

Vite genera los archivos compilados en:

```text
frontend-react/dist/
```

La compilación fue comprobada correctamente durante las pruebas finales de la EP2.

## 8. Almacenamiento de datos

El proyecto utiliza `localStorage` para conservar información en el navegador.

Entre los datos guardados se encuentran:

- Jugadores registrados.
- Equipos creados.
- Inscripciones realizadas.
- Sanciones e historial de los jugadores.
- Indicadores de inicialización de datos de demostración.

La información se conserva al actualizar la página dentro del mismo navegador.

**Importante:** los datos no se sincronizan entre dispositivos o navegadores, ya que esta versión no utiliza una base de datos centralizada.

## 9. Control de versiones

El proyecto utiliza Git y GitHub para organizar el desarrollo.

Las ramas principales son:

- `main`: versión anterior correspondiente a la EP1.
- `develop`: rama de integración y publicación de React.
- `feature/cierre-final-ep2`: mejoras funcionales finales de la EP2.

Los cambios se desarrollan y prueban antes de integrarse a `develop`.

## 10. Publicación en GitHub Pages

La aplicación se publica mediante GitHub Actions.

El flujo de despliegue se encuentra en:

```text
.github/workflows/deploy-react-pages.yml
```

Cuando se actualiza la rama `develop`, GitHub Actions instala las dependencias, compila el frontend y publica los archivos generados.

**Sitio web:**

https://itskevin02.github.io/Ea-Sports-Frontend/

La dirección publicada refleja la última versión desplegada desde `develop`. Las mejoras de la rama de cierre aparecerán allí después de integrarlas y completar el despliegue.

## 11. Alcance de la EP2

Esta evaluación está enfocada en el desarrollo frontend con React.

Se implementaron:

- Componentes reutilizables.
- Props y estado de React.
- Formularios controlados.
- Validaciones de datos.
- Navegación entre pantallas mediante estado.
- Persistencia local.
- Diseño adaptable con Bootstrap.
- Pruebas automatizadas.
- Publicación mediante GitHub Pages.

La aplicación utiliza datos simulados para demostrar las funcionalidades.

No incluye autenticación real, servicios backend, base de datos centralizada ni sincronización entre usuarios.

## 12. Repositorio

Código fuente:

https://github.com/itskevin02/Ea-Sports-Frontend

Proyecto académico desarrollado para la Evaluación Parcial 2 de eSports Arena Manager.
