/**
 * Asset Service
 *
 * Delegates uploads & downloads of versions
 */

var path = require('path');
var crypto = require('crypto');

var AssetService = {};

var delegateService = require(path.resolve(__dirname, './'+sails.config.asset_service+'.js'));

AssetService.serveFile = delegateService.serveFile;

/**
 * Asyncronously generates a SHA1 hash from a file
 * @param  {String} fd File descriptor of file to hash
 * @return {String}    Promise which is resolved with the hash once complete
 */
AssetService.getHash = delegateService.getHash;

/**
 * Deletes an asset from the database.
 * Warning: this will NOT remove fd from the file system.
 * @param   {Record}  asset The asset's record object from sails
 * @param   {Object}  req   Optional: The request object
 * @returns {Promise}       Resolved once the asset is destroyed
 */
AssetService.destroy = delegateService.destroy;

/**
 * Deletes an asset's file from the filesystem.
 * Warning: this will NOT remove the reference to the fd in the database.
 * @param   {Object}  asset The asset object who's file we would like deleted
 * @returns {Promise}       Resolved once the file is deleted
 */
AssetService.deleteFile = delegateService.deleteFile;

module.exports = AssetService;
