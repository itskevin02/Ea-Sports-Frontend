
# eSports Arena Manager — Aplicación React

Frontend desarrollado con React 19, Vite 8,
JavaScript y Bootstrap 5 para el proyecto
académico eSports Arena Manager.

## Evaluación Parcial 3

La aplicación integra las API REST de los
microservicios Spring Boot mediante Gateway.

Entre las funcionalidades implementadas están:

- Inicio de sesión mediante Auth y JWT.
- Manejo de sesión y permisos por rol.
- Consulta de videojuegos.
- Consulta y filtros de torneos.
- Gestión de equipos e inscripciones.
- Administración de usuarios y sanciones.
- Consulta del perfil vinculado mediante
  `/users/mi-perfil`.
- Compatibilidad con algunas vistas de EP2.

## Requisitos

- Node.js 22 recomendado.
- npm.
- Backend disponible para las funciones
  conectadas a las API.

## Instalación

```powershell
npm install
```

## Configuración local

El archivo `.env.development` utiliza:

```properties
VITE_API_URL=http://localhost:8080
```

## Ejecutar

```powershell
npm run dev
```

Aplicación local:

http://localhost:5173

## Pruebas

```powershell
npm test
```

Resultado verificado en EP3:

```text
TOTAL: 63 SUCCESS
```

Las pruebas utilizan Jasmine, Karma,
React Testing Library y ChromeHeadless.

## Compilación

```powershell
npm run build
```

La salida se genera en `dist/`.

## Cobertura

Existe una configuración de cobertura
para cinco módulos de lógica heredados
de EP2:

```powershell
.\node_modules\.bin\karma.cmd start karma.coverage.conf.cjs
```

La cobertura medida en esos módulos
no representa la cobertura total de React.

## Backend

Repositorio:

https://github.com/itskevin02/Ea-Sports-Backend

## Documentación completa

Consultar el [README principal](../README.md).

## Estado

Versión académica EP3 integrada en `develop`.

La ejecución completa requiere que estén
disponibles Gateway y los microservicios
necesarios. GitHub Pages solo publica
los archivos estáticos del frontend.
