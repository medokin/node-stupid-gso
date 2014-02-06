var parser = require('./lib/parser');
var request = require('./lib/helper/request');
var strPad = require('./lib/helper/strPad');
var RSVP = require('rsvp');

var api = {
  types: function(){
    return new RSVP.Promise(function (resolve) {
      resolve(['classes', 'teachers', 'rooms']);
    });
  },

  weeks: function(){
    return new RSVP.Promise(function (resolve, reject) {

      request('http://stupid.gso-koeln.de/frames/navbar.htm').then(function (body) {

        parser.weeks.parse(body, function(weeks){
          resolve(weeks);
        });

      }, function(error){
        reject(error);
      });

    });
  },

  elements: function(type){
    return new RSVP.Promise(function (resolve, reject) {

      request('http://stupid.gso-koeln.de/frames/navbar.htm').then(function (body) {

        parser.elements.parse(body, type, function(elements){
          resolve(elements);
        });

      }, function(error){
        reject(error);
      });

    });
  },

  timetable: function(type, element, week){
    return new RSVP.Promise(function (resolve, reject) {

      request('http://stupid.gso-koeln.de/frames/navbar.htm').then(function (content) {
        return parser.elements.getRemoteId(content, type, element);
      })
        .then(function(remoteId){
          var typesMap = {
            teachers: 't',
            classes: 'c',
            rooms: 'r'
          };

          return request('http://stupid.gso-koeln.de/' + strPad(week,2) + '/' + typesMap[type] + '/' + typesMap[type] + remoteId + '.htm', 1000);

        })
        .then(function(content){
          return parser.timetable.parse(content);
        })
        .then(function(lessons){
          resolve(lessons);
        }, function(error){
          reject(error);
        });

    });
  }
}

module.exports = api;


