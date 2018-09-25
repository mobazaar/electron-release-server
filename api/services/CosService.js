/**
 * Cos Service
 *
 * Handles uploads & downloads of versions
 */
var Cos = require('cos-nodejs-sdk-v5');

var CosService = {};

var cos = new Cos({
    SecretId: sails.config.cos.secretId,
    SecretKey: sails.config.cos.secretKey,
});

CosService.uploadFile = function (version, platform, file, callback) {
    var key = platform + '/' + version + '/' + file.filename;

    cos.sliceUploadFile({
        Bucket: sails.config.cos.bucket,
        Region: sails.config.cos.region,
        Key: key,
        FilePath: file.fd
    }, function (err, data) {
        if (err) {
            callback(err, "");
        } else {
            callback(err, data.Location);
        }
    });
};

CosService.delete = function (version, platform, filename, callback) {
    var key = platform + '/' + version + '/' + filename;
    var params = { Bucket: sails.config.cos.bucket, Region: sails.config.cos.region, Key: key};
    
    cos.deleteObject(params, function(err, data) {
        callback(err);
    });
};

module.exports = CosService;
