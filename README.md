
# eSports Arena Manager

**eSports Arena Manager** es una aplicación frontend para la gestión de torneos de videojuegos competitivos.

Permite consultar torneos, registrar jugadores, crear equipos, realizar inscripciones y administrar sanciones mediante una interfaz desarrollada con React.

Esta versión corresponde a la **Evaluación Parcial 2 (EP2)** de Desarrollo Fullstack II y continúa el proyecto realizado durante la EP1.

## 1. Tecnologías utilizadas

El proyecto fue desarrollado utilizando:

- HTML5
- CSS3
- JavaScript
- React 19
- Vite 8
- Bootstrap 5
- React Bootstrap
- Node.js y npm
- Git y GitHub

Para las pruebas automatizadas se utilizaron:

- Jasmine
- Karma
- karma-esbuild
- React Testing Library
- ChromeHeadless

La aplicación utiliza `localStorage` para almacenar información en el navegador.

Actualmente funciona como un frontend independiente, sin backend ni base de datos externa.

## 2. Migración de la EP1 a React

Durante la EP1, el proyecto se desarrolló utilizando páginas HTML, CSS y JavaScript.

Para la EP2 se realizó una migración a React utilizando Vite como herramienta de desarrollo.

### Proceso de migración

1. Se creó la estructura inicial del proyecto React con Vite.
2. Se configuró Bootstrap para mantener el diseño adaptable.
3. Se transformaron las pantallas originales en páginas React.
4. Se crearon componentes reutilizables.
5. Se implementaron props y estados para manejar la información.
6. Se separaron las validaciones y funciones del sistema.
7. Se implementó almacenamiento local mediante localStorage.
8. Se desarrollaron pruebas unitarias con Jasmine y Karma.
9. Se configuró la publicación en GitHub Pages.

### Ventajas de la migración

La migración permitió:

- Reutilizar componentes entre distintas pantallas.
- Separar mejor las responsabilidades.
- Mantener el código organizado.
- Actualizar información mediante estados.
- Facilitar la incorporación de funcionalidades.
- Realizar pruebas automatizadas.

## 3. Funcionalidades principales

### Inicio

La pantalla de inicio incluye:

- Presentación de eSports Arena Manager.
- Información general de la plataforma.
- Estadísticas de torneos, equipos e inscripciones.
- Torneos destacados.
- Próximos cierres de inscripción.
- Video relacionado con competencias de eSports.
- Accesos rápidos a las funcionalidades.

### Torneos

El catálogo permite:

- Consultar los torneos registrados.
- Buscar torneos por nombre o videojuego.
- Filtrar por videojuego.
- Filtrar por estado.
- Filtrar por fechas de inicio.
- Validar rangos de fechas incorrectos.
- Limpiar los filtros.
- Mostrar mensajes cuando no existen resultados.
- Acceder al detalle de cada torneo.

### Detalle del torneo

Cada torneo presenta:

- Nombre, videojuego y plataforma.
- Descripción de la competencia.
- Fecha de inicio y cierre de inscripción.
- Estado del torneo.
- Participantes inscritos.
- Cupos disponibles.
- Listado de participantes.
- Tabla de posiciones.
- Llaves de enfrentamientos.
- Calendario de partidas.
- Premios simbólicos.

Los resultados y las clasificaciones se muestran según el estado del torneo y los datos disponibles.

### Inscripciones

El sistema permite inscribir jugadores y equipos.

Se implementaron validaciones para:

- Estado del torneo.
- Fecha de cierre.
- Cupos disponibles.
- Tipo de participante.
- Cantidad de integrantes.
- Estado activo del equipo.
- Inscripciones duplicadas.
- Sanciones de jugadores.
- Sanciones de integrantes de equipos.

También permite cancelar inscripciones mediante un botón de eliminación con confirmación.

Al eliminar una inscripción se libera el cupo correspondiente.

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

Al eliminar un equipo también se eliminan sus inscripciones locales asociadas.

### Perfil de jugador

Permite:

- Registrar perfiles.
- Consultar información del jugador.
- Editar apodo y correo electrónico.
- Consultar equipos asociados.
- Consultar inscripciones.
- Visualizar el historial disponible.
- Consultar sanciones registradas.

### Administración

El panel permite:

- Registrar jugadores.
- Editar información.
- Consultar jugadores registrados.
- Eliminar jugadores sin vínculos pendientes.
- Identificar sanciones vigentes.
- Aplicar sanciones.
- Registrar motivo y fecha de término.
- Levantar sanciones.
- Conservar el historial de sanciones.

Los jugadores sancionados no pueden realizar nuevas inscripciones mientras exista una sanción vigente.

El sistema también impide inscribir equipos que tengan integrantes sancionados.

## 4. Estructura del proyecto

La aplicación React se encuentra en la carpeta `frontend-react`.

```text
Ea-Sports-Frontend/
|
|-- README.md
|
|-- frontend-react/
|   |-- public/
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
|   |-- README.md
|
|-- .github/
    |-- workflows/
        |-- deploy-react-pages.yml
```

### Responsabilidad de las carpetas

- `components`: componentes reutilizables de React.
- `pages`: pantallas principales.
- `logica`: funciones y validaciones.
- `data`: información inicial y datos de demostración.
- `tests`: pruebas automatizadas.
- `public`: imágenes y recursos estáticos.

## 5. Requisitos

Se recomienda tener instalado:

- Node.js 22.
- npm.
- Visual Studio Code.
- Google Chrome.
- Git.

## 6. Instalación y ejecución

### Clonar el repositorio

```powershell
git clone https://github.com/itskevin02/Ea-Sports-Frontend.git
```

Entrar a la carpeta:

```powershell
cd Ea-Sports-Frontend
```

Seleccionar la rama correspondiente a la EP2:

```powershell
git switch develop
```

### Instalar dependencias

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

## 7. Pruebas automatizadas

Para verificar las funcionalidades se implementaron pruebas utilizando Jasmine, Karma y React Testing Library.

Se utilizó `karma-esbuild` para procesar los archivos JavaScript y JSX.

Las pruebas verifican comportamientos relacionados con:

- Visualización de torneos.
- Búsqueda y filtros.
- Navegación.
- Validaciones de inscripción.
- Cálculo de cupos.
- Fechas de inscripción.
- Requisitos de equipos.
- Sanciones.
- Componentes de ranking.
- Eliminación de equipos.
- Eliminación de inscripciones.
- Validaciones de jugadores.

### Ejecutar pruebas

Desde la raíz del repositorio:

```powershell
npm --prefix frontend-react test
```

### Resultado final

```text
TOTAL: 29 SUCCESS
```

Se ejecutaron correctamente las **29 pruebas unitarias**.

No se registraron pruebas fallidas en la última ejecución.

Durante las pruebas pueden aparecer advertencias de imágenes o recursos estáticos debido a que Karma utiliza un servidor diferente al de Vite.

Estas advertencias no impidieron finalizar correctamente las pruebas.

### Cobertura de código

Durante el desarrollo se revisó el contenido de informes de cobertura y se realizaron pruebas de configuración con `karma-coverage`.

Sin embargo, la configuración probada no produjo métricas válidas para los archivos fuente React.

Por este motivo, no se incluyen porcentajes de cobertura no verificados.

La generación de un informe de cobertura compatible con React queda como una mejora pendiente.

## 8. Compilación de producción

Para generar la versión de producción:

```powershell
npm --prefix frontend-react run build
```

Vite genera los archivos compilados en:

```text
frontend-react/dist/
```

La compilación fue verificada correctamente durante las pruebas finales de la EP2.

## 9. Almacenamiento de datos

La aplicación utiliza `localStorage` para conservar información en el navegador.

Entre los datos almacenados se encuentran:

- Jugadores registrados.
- Equipos creados.
- Inscripciones.
- Sanciones.
- Historial de sanciones.
- Datos de demostración.

La información se conserva al actualizar la página dentro del mismo navegador.

Los datos no se sincronizan entre dispositivos o navegadores, ya que esta versión no utiliza una base de datos centralizada.

## 10. Trabajo colaborativo y GitHub

El proyecto utiliza Git y GitHub para organizar el trabajo del equipo.

Las ramas principales son:

- `main`: versión correspondiente a la EP1.
- `develop`: integración y publicación de la EP2.
- `feature/react-torneos`: desarrollo del módulo de torneos.
- `feature/react-inscripciones`: desarrollo de inscripciones y equipos.
- `feature/react-administracion`: desarrollo de perfil y administración.
- `feature/cierre-final-ep2`: ajustes y mejoras finales.
- Otras ramas `feature/*`: correcciones y mejoras posteriores.

Las funcionalidades se desarrollaron en ramas separadas para conservar la autoría mediante commits individuales.

Los cambios se prueban antes de integrarse a `develop`.

## 11. Publicación en GitHub Pages

La aplicación se publica mediante GitHub Actions.

El archivo de despliegue se encuentra en:

```text
.github/workflows/deploy-react-pages.yml
```

Al actualizarse la rama `develop`, GitHub Actions ejecuta la compilación y publica la aplicación.

### Sitio publicado

https://itskevin02.github.io/Ea-Sports-Frontend/

La dirección muestra la última versión desplegada correctamente desde `develop`.

## 12. Alcance de la EP2

La evaluación está enfocada en el desarrollo frontend con React.

Se implementaron:

- Migración desde HTML, CSS y JavaScript.
- Componentes reutilizables.
- Props y estados.
- Formularios controlados.
- Validaciones.
- Navegación entre pantallas.
- Persistencia local.
- Diseño adaptable con Bootstrap.
- Pruebas automatizadas.
- Despliegue en GitHub Pages.
- Trabajo colaborativo mediante Git.

El sistema utiliza datos de demostración.

No incluye autenticación real, backend, base de datos centralizada ni sincronización entre usuarios.

## 13. Repositorio

Código fuente:

https://github.com/itskevin02/Ea-Sports-Frontend

Proyecto académico desarrollado para la Evaluación Parcial 2 de Desarrollo Fullstack II.
