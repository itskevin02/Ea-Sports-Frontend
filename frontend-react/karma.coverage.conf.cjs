
module.exports = function (config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      {
        pattern: 'src/logica/validarInscripcion.js',
        included: false,
        watched: false
      },
      {
        pattern: 'src/logica/eliminarInscripcion.js',
        included: false,
        watched: false
      },
      {
        pattern: 'src/logica/ranking.js',
        included: false,
        watched: false
      },
      {
        pattern: 'src/logica/eliminarEquipo.js',
        included: false,
        watched: false
      },
      {
        pattern: 'src/logica/gestionarJugadores.js',
        included: false,
        watched: false
      },
      {
        pattern: 'pruebas-cobertura/*.spec.js',
        watched: false,
        type: 'module'
      }
    ],

    preprocessors: {
      'src/logica/validarInscripcion.js': ['coverage'],
      'src/logica/eliminarInscripcion.js': ['coverage'],
      'src/logica/ranking.js': ['coverage'],
      'src/logica/eliminarEquipo.js': ['coverage'],
      'src/logica/gestionarJugadores.js': ['coverage']
    },

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'text-summary' },
        { type: 'html', subdir: 'html' }
      ]
    },

    browsers: ['ChromeHeadless'],

    singleRun: true,
    autoWatch: false,

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO
  })
}
