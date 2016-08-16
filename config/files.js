/**
 * File options
 * Options which relate to filesystem storage of assets
 */
module.exports.files = {
  // Maximum allowed file size in bytes
  // Defaults to 500MB
  maxBytes: 524288000,
  key: sails.config.files.key,
  secret: sails.config.files.secret,
  bucket: sails.config.files.bucket,
  region: sails.config.files.region,
  endpoint: undefined,
  token: undefined
};
