var request = require('request');
var RSVP = require('rsvp');

module.exports = function (url, cacheTime) {
  var promise = new RSVP.Promise(function (resolve, reject) {

    request({url: url, timeout: 3000}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        reject('Request error: ' + error + ' URL: ' + url);
      }
    });
  });

  return promise;
}
