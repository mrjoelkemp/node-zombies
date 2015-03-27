var getModulesToBuild = require('get-modules-to-build');
var getJSFiles = require('get-all-js-files');
var getTree = require('dependency-tree').toList;
var resolveAlias = require('module-lookup-amd');
var ConfigFile = require('requirejs-config-file').ConfigFile;
var resolveDependencyPath = require('resolve-dependency-path');

var q = require('q');
var path = require('path');

/**
 * @param  {Object} options
 * @param  {String} options.directory - The directory to search for zombies
 * @param  {String} options.config - The path to a requirejs config
 * @param  {String} options.buildConfig - The path to an r.js build config
 * @param  {String[]} options.exclude - List of files to exclude
 * @param  {String[]} options.excludir - List of directories to exclude
 * @param  {Function} options.success - Executed with the list of zombie module paths
 */
module.exports = function (options) {
  var configObject = new ConfigFile(options.config).read();

  var modules = getModulesToBuild(options.buildConfig);
  console.log('Modules: ', modules)
  console.log('Directory: ', options.directory)

  var treeCache = {};
  var treeLists = modules.map(function(module) {
    console.log('Current Module:', module);

    module = path.resolve(options.directory, module);
    if (path.extname(module) !== '.js') {
      module += '.js';
    }

    console.log('Resolved Module: ', module);

    return getTree({
      filename: module,
      directory: options.directory,
      cache: treeCache,
      config: options.config
    });
  });

  console.log('Tree Lists', treeLists);

  // Join all lists into a single lookup table
  var usedFiles = {};

  treeLists.forEach(function(list) {
    list.forEach(function(file) {
      console.log('File: ', file)

      // Make the filename look like a module's path
      // @todo: This is bad but due to the treeList having absolute paths
      var dependencyPath = convertToModuleName(file, options.directory);
      console.log('pathlike: ', dependencyPath)
      console.log('config: ', configObject)
      var resolvedPath = resolveAlias(configObject, dependencyPath);
      console.log('gotback: ', file)

      if (resolvedPath !== dependencyPath && resolvedPath.indexOf(options.directory) === -1) {
        file = path.resolve(options.directory, file) + '.js';
      }

      console.log('LookedupFile: ', file)

      usedFiles[file] = true;
    });
  });

  console.log('Used Files: ', usedFiles)
  // For every JS file, if it's not in the lookup table, it's a zombie
  return getJSFilesPromise(options)
  .then(function(files) {
    return files.filter(function(file) {
      return !usedFiles[file];
    });
  })
  .done(options.success);
};

function convertToModuleName(filepath, directory) {
  var extLess = path.basename(filepath, '.js');
  return extLess.replace(new RegExp(directory + '\/?'), '');
}

/**
 * Promisified version of getJSFiles
 * @param  {Object} options
 * @param  {String} options.directory
 * @param  {Regexp|String[]} options.exclude
 * @param  {Regexp|String[]} options.excludeDir
 * @return {Promise}
 */
function getJSFilesPromise(options) {
  var deferred = q.defer(),
      dirOptions = {};

  if (options.exclude) {
    dirOptions.exclude = options.exclude;
  }

  if (options.excludeDir) {
    dirOptions.excludeDir = options.excludeDir;
  }

  getJSFiles({
    directory: options.directory,
    dirOptions: dirOptions,
    filesCb: function(files) {
      deferred.resolve(files);
    }
  });

  return deferred.promise;
}
