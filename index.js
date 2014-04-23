var _ = require('lodash');
var requestLib = require('request');
var RSVP = require('rsvp');

var requestLib = requestLib.defaults({jar: true});

var loginData = null;

function request(method, params){
  
  if(!params){
    params = {};
  }
  
  var message = {
    id: 1,
    method: method,
    params: params,
    jsonrpc: '2.0'
  };
  
  var options = {
    uri: 'https://webuntis.stadt-koeln.de/WebUntis/jsonrpc.do?school=K175055',
    method: 'post',
    json: message
  };
  
  return new RSVP.Promise(function (resolve, reject) {
    requestLib(options, function(err, res, body){
      if(err){
        reject(err);
      }
      
      if(body.error){
        if(body.error.code === -8520){
          return login().then(function(){
            request(method, params).then(function(data){
              resolve(data);
            });
          });
        }
        
        reject(body.error.message);
      }
      
      if(body.result === undefined){
        reject('No result');
      }
      
      resolve(body.result);
    });
    
  }); 
  
}

function login(){
  return request('authenticate', loginData).then(function(data){
    sessionId = data.sessionId;
    return true;
  });
}

function UntisRpc(user, password, client){
  loginData = {
    user: user,
    password: password,
    client: client
  };
}


var p = UntisRpc.prototype;

p.teachers = function(){
  return request('getTeachers');
};

p.classes = function(){
  return request('getKlassen');
};

p.rooms = function(){
  return request('getRooms');
};

p.subjects = function(){
  return request('getSubjects');
};

p.departments = function(){
  return request('getDepartments');
};

p.holidays = function(){
  return request('getHolidays');
};

p.timegridUnits = function(){
  return request('getTimegridUnits');
};

p.statusData = function(){
  return request('getTimegridUnits');
};

p.currentSchoolyear = function(){
  return request('getCurrentSchoolyear');
};

p.schoolyears = function(){
  return request('getSchoolyears');
};

p.timetable = function(id, type, startDate, endDate){
  return request('getTimetable', {
    id: id,
    type: type,
    startDate: startDate,
    endDate: endDate
  });
};

p.studentsForPeriod = function(ttid){
  return request('getStudentsForPeriod', {
    ttid: ttid
  });
};

p.latestImportTime = function(){
  return request('getLatestImportTime');
};

p.substitutions = function(){
  return request('getSubstitutions');
};


module.exports = UntisRpc;
