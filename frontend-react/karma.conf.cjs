
module.exports = function (config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      {
        pattern: 'src/**/*.spec.js*',
        watched: false,
        type: 'module'
      }
    ],

    preprocessors: {
      'src/**/*.spec.js*': ['esbuild']
    },

    esbuild: {
  target: 'es2022',
  jsx: 'automatic',
  loader: { '.js': 'jsx' },
  define: {
    'import.meta.env.VITE_API_URL': '"http://localhost:8080"'
  }
},

    reporters: ['progress'],

    browsers: ['ChromeHeadless'],

    singleRun: true,
    autoWatch: false,

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    concurrency: 1
  })
}
