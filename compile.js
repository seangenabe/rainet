
var glob = require('traceur/node_modules/glob');
var path = require('path');
var NodeCompiler = require('traceur/src/node/NodeCompiler.js').NodeCompiler;
var FS = require('fs');
var mkdirp = require('mkdirp');

function compileAllJsFilesInDir(inputDir, outputDir, options) {
  inputDir = path.normalize(inputDir).replace(/\\/g, '/');
  outputDir = path.normalize(outputDir).replace(/\\/g, '/');
  glob(inputDir + '/**/*.js', {}, function (er, files) {
    if (er)
      throw new Error('While scanning ' + inputDir + ': ' + er);

    files.forEach(function(inputFilePath) {
      var outputFilePath = inputFilePath.replace(inputDir, outputDir);
      var outputFileDir = path.dirname(outputFilePath);
      mkdirp.sync(outputFileDir);
      var compiler = new NodeCompiler(options);

      var contents = FS.readFileSync(inputFilePath).toString()
      contents = 'require(\'traceur/bin/traceur-runtime\');' + contents
      var compiled = compiler.compile(contents, inputFilePath, outputFilePath)
      var sourceMap = compiler.getSourceMap()
      FS.writeFileSync(outputFilePath, compiled)
      FS.writeFileSync(outputFilePath.replace(/\.js$/g, '.map'), sourceMap)
    });
  });
}

var compilerOptions = {
  sourceMaps: true,
  modules: 'commonjs',
  experimental: true,
  types: true,
  annotations: true,
  typeAssertions: false
}

compileAllJsFilesInDir('src', 'src-es5', compilerOptions)
//compilerOptions.typeAssertions = true
