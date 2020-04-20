module.exports = function(config) {
  config.set({
    basePath: "", // Root path used for resolving relative paths defined in files and exclude. BasePath is relative to __dirname.
    frameworks: ["jasmine","requirejs"], // List of testing frameworks for writing tests.
    files: [ // Which files are included and served by karma.
      "node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js",
      { pattern: "**/*.test.js", type: "module", included: true }, // Include test files automatically
      { pattern: "**/*.js", type: "module", included: false } // source files should be loaded manually.
    ],
    exclude: [], // Files that should not be loaded.
    
    reporters: ["spec"], // Reporters are used to display test results.
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome", "Firefox"], // Add Edge or Safari if they are available.
    singleRun: true, // Run all tests on all browsers in a single run.
    concurrency: Infinity // Karma can launch as many browsers as needed.
  })
};