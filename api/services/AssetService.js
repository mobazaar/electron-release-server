/**
 * File Service
 *
 * Handles uploads & downloads of versions
 */

var mime = require('mime');
var path = require('path');

var fsx = require('fs-extra');
var crypto = require('crypto');
var Promise = require('bluebird');
var AWSService = require(path.resolve(__dirname, './AWSService.js'));
var SkipperDisk = require('skipper-disk');

var AssetService = {};

AssetService.serveFile = function (req, res, asset) {
  if (_.isFunction(Asset.query)) {
    Asset.query(
      'UPDATE asset SET download_count = download_count + 1 WHERE name = \'' + asset.name + '\';',
      function (err) {
        if (err) {
          sails.log.error(
            'An error occurred while logging asset download', err
          );
        }
      });
  } else {
    asset.download_count++;

    Asset.update({
      name: asset.name
    }, asset)
      .exec(function (err) {
        if (err) {
          sails.log.error(
            'An error occurred while logging asset download', err
          );
        }
      });
  }

  res.redirect(307, asset.fd);
};

/**
 * Asyncronously generates a SHA1 hash from a file
 * @param  {String} fd File descriptor of file to hash
 * @return {String}    Promise which is resolved with the hash once complete
 */
AssetService.getHash = function (fd) {
  return new Promise(function (resolve, reject) {

    var hash = crypto.createHash('sha1');
    hash.setEncoding('hex');

    var fileStream = fsx.createReadStream(fd)
      .on('error', function (err) {
        reject(err);
      })
      .on('end', function () {
        hash.end();
        resolve(String.prototype.toUpperCase.call(hash.read()));
      })
      // Pipe to hash generator
      .pipe(hash);
  });
};


/**
 * Deletes an asset from the database.
 * Warning: this will NOT remove fd from the file system.
 * @param   {Record}  asset The asset's record object from sails
 * @param   {Object}  req   Optional: The request object
 * @returns {Promise}       Resolved once the asset is destroyed
 */
AssetService.destroy = function (asset, req) {
  if (!asset) {
    throw new Error('You must pass an asset');
  }

  return Asset.destroy(asset.name)
    .then(function destroyedRecord() {
      if (sails.hooks.pubsub) {
        Asset.publishDestroy(
          asset.name, !req._sails.config.blueprints.mirror && req, {
            previous: asset
          }
        );

        if (req && req.isSocket) {
          Asset.unsubscribe(req, record);
          Asset.retire(record);
        }
      }
    });
};

/**
 * Deletes an asset's file from the filesystem.
 * Warning: this will NOT remove the reference to the fd in the database.
 * @param   {Object}  asset The asset object who's file we would like deleted
 * @returns {Promise}       Resolved once the file is deleted
 */
AssetService.deleteFile = function (asset) {
  if (!asset) {
    throw new Error('You must pass an asset');
  }
  if (!asset.fd) {
    throw new Error('The provided asset does not have a file descriptor');
  }
  return new Promise((resolve, reject) => {
    AWSService.delete(asset.version.name, asset.platform, asset.name, function (err) {
      if(err){
        return reject(err);
      }
      else
      {
        return resolve();
      }
    });
  });

};

module.exports = AssetService;
