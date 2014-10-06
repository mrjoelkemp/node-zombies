var getModulesToBuild = require('get-modules-to-build');
var getJSFiles = require('get-all-js-files');
var getTree = require('dependency-tree').treeAsList;
var resolveAlias = require('module-lookup-amd');
var ConfigFile = require('requirejs-config-file').ConfigFile;
var q = require('q');

/**
 *
 * @param  {Object}   options
 * @param  {String}   options.directory - The directory to search for zombies
 * @param  {String}   options.config - The path to a requirejs config
 * @param  {Function} options.cb - Executed with the list of zombie module paths
 */
module.exports = function (options) {
  var configObject = new ConfigFile(options.config).read();

  var modules = getModulesToBuild(config);
  var treeLists = modules.map(getTreePromise);

  // Join all lists into a single lookup table
  treeLists
  .all(function(lists) {
    var usedFiles = {};

    lists.forEach(function(list) {
      list.forEach(function(file) {
        file = resolveAlias(configObject, file);
        usedFile[file] = true;
      });
    });

    return usedFiles;
  })
  .then(function(usedFiles) {
    // For every JS file, if it's not in the lookup table, it's a zombie
    return getJSFilesPromise(options.directory)
    .then(function(files) {
      var zombies = [];

      files.forEach(function(file) {
        // Strip extension
        file = file.replace('.js', '');
        // Strip directory
        file = file.replace(options.directory, '');

        // @todo: make sure the filesystem filename and the module's path format match up
        if (!usedFile[file]) {
          zombies.push(file);
        }
      });

      return zombies;
    });
  })
  .done(options.cb);
};

/**
 * Promisified version of getTrees
 * @param  {String} module
 * @return {Promise}
 */
function getTreePromise(module) {
  var deferred = q.defer();

  getTree(module, function(tree) {
    deferred.resolve(tree);
  });

  return deferred.promise;
}

/**
 * Promisified version of getJSFiles
 * @param  {String} directory
 * @return {Promise}
 */
function getJSFilesPromise(directory) {
  var deferred = q.defer();

  getJSFiles({
    directory: directory,
    filesCb: function(files) {
      deferred.resolve(files);
    }
  });

  return deferred.promise;
}
