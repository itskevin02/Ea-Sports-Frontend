import puppeteer from 'puppeteer';

export default async function (config) {
  process.env.CHROME_BIN = await puppeteer.executablePath();

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-esbuild'
    ],
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
      loader: { 
        '.js': 'jsx', 
        '.jsx': 'jsx' 
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
  });
}