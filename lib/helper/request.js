var request = require('request');
var RSVP = require('rsvp');
var cache = require('memory-cache');


module.exports = function (url, cacheTime) {
  var promise = new RSVP.Promise(function (resolve, reject) {

    if(cacheTime){
      var result = cache.get(url);
      if(result != null){
        resolve(result);
        return;
      }
    }

    request({url: url, timeout: 3000}, function (error, response, body) {
      if (!error && response.statusCode == 200) {

        if(cacheTime){
          cache.put(url, body, cacheTime);
        }

        resolve(body);

      } else {
        reject('Request error: ' + error + ' URL: ' + url);
      }
    });
  });

  return promise;
}
