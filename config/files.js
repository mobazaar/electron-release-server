/**
 * File options
 * Options which relate to filesystem storage of assets
 */
module.exports.files = {
  // Maximum allowed file size in bytes
  // Defaults to 500MB
  maxBytes: 524288000,
  adapter: require('skipper-s3'),
  key: 'AKIAITHHFZYBSIAWYZ6Q',
  secret: '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',
  bucket: 'io.teamsql.version',
  region: 'us-east-1',
  endpoint: process.env.S3_ENDPOINT || undefined,
  token: process.env.S3_TOKEN || undefined
};
