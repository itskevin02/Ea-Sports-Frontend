
# eSports Arena Manager - Frontend React

Aplicación frontend desarrollada con React, Vite y Bootstrap para la Evaluación Parcial 2 del proyecto eSports Arena Manager.

La EP2 corresponde a la migración del proyecto original desarrollado con HTML, CSS y JavaScript hacia React.

## Tecnologías

- React 19
- JavaScript
- JSX
- Vite 8
- Bootstrap 5
- React Bootstrap
- Jasmine
- Karma
- karma-esbuild
- React Testing Library

## Funcionalidades

La aplicación permite:

- Consultar y filtrar torneos.
- Visualizar detalles, participantes y premios.
- Registrar y administrar jugadores.
- Crear y gestionar equipos.
- Inscribir jugadores y equipos.
- Cancelar inscripciones.
- Aplicar y levantar sanciones.
- Validar sanciones antes de inscribir equipos.
- Almacenar datos mediante localStorage.

## Instalación

Desde la carpeta `frontend-react`:

```powershell
npm install
```

## Ejecutar aplicación

```powershell
npm run dev
```

Vite mostrará la dirección local para abrir la aplicación.

## Ejecutar pruebas

```powershell
npm test
```

### Resultado verificado

```text
TOTAL: 29 SUCCESS
```

Las 29 pruebas unitarias finalizaron correctamente.

Las pruebas utilizan Jasmine y Karma, con karma-esbuild para procesar JavaScript y JSX.

## Cobertura de código

Se revisó el procedimiento de cobertura con karma-coverage incluido en el material de clases.

La configuración experimental no generó porcentajes válidos para los archivos fuente React.

Por lo tanto, no se reportan métricas de cobertura no verificadas.

La implementación de una cobertura compatible queda como mejora pendiente.

## Compilar para producción

```powershell
npm run build
```

Los archivos compilados se generan en:

```text
dist/
```

La compilación fue comprobada correctamente.

## Publicación

La aplicación se publica mediante GitHub Actions desde la rama `develop`.

Sitio web:

https://itskevin02.github.io/Ea-Sports-Frontend/

## Información adicional

La aplicación utiliza localStorage y datos de demostración.

No cuenta con backend ni base de datos centralizada en esta evaluación.

Para conocer el proyecto completo, revisar el [README principal](../README.md).
