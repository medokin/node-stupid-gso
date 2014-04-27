var requestLib = require('request');
var RSVP = require('rsvp');
var _ = require('lodash');
var moment = require('moment');

var requestLib = requestLib.defaults({jar: true});

var loginData = null;

var loginTry = 0;

function request(method, params) {

    if (!params) {
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
        //uri: 'https://demo.webuntis.com/WebUntis/jsonrpc.do?school=demo_inf',
        method: 'post',
        json: message
    };

    return new RSVP.Promise(function (resolve, reject) {
        requestLib(options, function (err, res, body) {
            if (err) {
                reject(err);
            }
            console.log(body.error)
            if (body.error) {
                if (body.error.code === -8520) {
                    return login().then(function () {
                        return request(method, params).then(function (data) {
                            resolve(data);
                        });
                    }, function(){
                        reject(body.error.message);
                    });
                }

                reject(body.error.message);
            }

            if (body.result === undefined) {
                reject('No result');
            }

            resolve(body.result);
        });

    });

}

function login() {
    return request('authenticate', loginData).then(function (data) {
        return true;
    });
}

function UntisRpc(user, password, client) {
    loginData = {
        user: user,
        password: password,
        client: client
    };
}


var p = UntisRpc.prototype;

p.teachers = function () {
    return request('getTeachers').then(function (teachers) {
        return _.map(teachers, function (item) {
            return {
                id: item.id,
                name: item.name,
                foreName: item.foreName,
                longName: item.longName,
                active: item.active
            }
        });
    });
};

p.classes = function () {
    return request('getKlassen').then(function (classes) {
        return _.map(classes, function (item) {
            return {
                id: item.id,
                name: item.name,
                longName: item.longName,
                active: item.active
            }
        });
    });
};

p.rooms = function () {
    return request('getRooms').then(function (rooms) {
        return _.map(rooms, function (item) {
            return {
                id: item.id,
                name: item.name,
                longName: item.longName,
                active: item.active,
                building: item.building
            }
        });
    });
};

p.subjects = function () {
    return request('getSubjects');
};

p.departments = function () {
    return request('getDepartments');
};

p.holidays = function () {
    return request('getHolidays').then(function(holidays){
        return _.map(holidays, function (item) {
            return {
                id: item.id,
                name: item.name,
                longName: item.longName,
                startDate: moment(item.startDate, 'YYYYMMDD').format(),
                endDate: moment(item.endDate, 'YYYYMMDD').format()
            }
        });
    });
};

p.timegrid = function () {
    return request('getTimegridUnits').then(function(timegrid){
        return _.map(timegrid, function (item) {
            return {
                day: item.day,
                lessons: _.map(item.timeUnits, function (lesson) {
                    return {
                        name: lesson.name,
                        startTime: {
                            hour: parseInt(lesson.startTime.toString().substr(0, lesson.startTime.toString().length - 2)),
                            minutes: parseInt(lesson.startTime.toString().substr(-2))
                        },
                        endTime: {
                            hour: parseInt(lesson.endTime.toString().substr(0, lesson.endTime.toString().length - 2)),
                            minutes: parseInt(lesson.endTime.toString().substr(-2))
                        }
                    }
                })
            }
        });
    });
};

p.statusData = function () {
    return request('getStatusData');
};

p.currentSchoolyear = function () {
    return request('getCurrentSchoolyear').then(function(currentSchoolyear){
        return {
            id: currentSchoolyear.id,
            name: currentSchoolyear.name,
            startDate: moment(currentSchoolyear.startDate, 'YYYYMMDD').format(),
            endDate: moment(currentSchoolyear.endDate, 'YYYYMMDD').format()
        };
    });
};

p.schoolyears = function () {
    return request('getSchoolyears').then(function(schoolyears){
        return _.map(schoolyears, function (item) {
            return {
                id: item.id,
                name: item.name,
                startDate: moment(item.startDate, 'YYYYMMDD').format(),
                endDate: moment(item.endDate, 'YYYYMMDD').format()
            }
        });
    });
};

p.timetable = function (id, type, startDate, endDate) {
    return request('getTimetable', {
        id: id,
        type: type,
        startDate: startDate,
        endDate: endDate
    }).then(function (timetable) {
        return _.map(timetable, function (item) {
            return {
                id: item.id,
                type: item.lstype,
                code: item.code,
                date: moment(item.date, 'YYYYMMDD').format(),
                startTime: {
                    hour: parseInt(item.startTime.toString().substr(0, item.startTime.toString().length - 2)),
                    minutes: parseInt(item.startTime.toString().substr(-2))
                },
                endTime: {
                    hour: parseInt(item.endTime.toString().substr(0, item.endTime.toString().length - 2)),
                    minutes: parseInt(item.endTime.toString().substr(-2))
                },
                classes: _.pluck(item.kl, 'id'),
                rooms: _.pluck(item.ro, 'id'),
                teachers: _.pluck(item.te, 'id'),
                subjects: _.pluck(item.su, 'id')

            }
        });
    });
};

p.studentsForPeriod = function (ttid) {
    return request('getStudentsForPeriod', {
        ttid: ttid
    });
};

p.latestImportTime = function () {
    return request('getLatestImportTime');
};

p.substitutions = function (startDate, endDate, departmentId) {
    return request('getSubstitutions', {
        startDate: startDate,
        endDate: endDate,
        departmentId: departmentId
    }).then(function(substitutions){
        return _.map(substitutions, function (item) {
            var result = {
                type: item.type,
                date: moment(item.date, 'YYYYMMDD').format(),
                startTime: {
                    hour: parseInt(item.startTime.toString().substr(0, item.startTime.toString().length - 2)),
                    minutes: parseInt(item.startTime.toString().substr(-2))
                },
                endTime: {
                    hour: parseInt(item.endTime.toString().substr(0, item.endTime.toString().length - 2)),
                    minutes: parseInt(item.endTime.toString().substr(-2))
                },
                classes: _.pluck(item.kl, 'id'),
                rooms: _.pluck(item.ro, 'id'),
                teachers: _.pluck(item.te, 'id'),
                subjects: _.pluck(item.su, 'id')
            }

            if (item.reschedule) {
                result['reschedule'] = {
                    date: moment(item.reschedule.date, 'YYYYMMDD').format(),
                    startTime: {
                        hour: parseInt(item.reschedule.startTime.toString().substr(0, item.reschedule.startTime.toString().length - 2)),
                        minutes: parseInt(item.reschedule.startTime.toString().substr(-2))
                    },
                    endTime: {
                        hour: parseInt(item.reschedule.endTime.toString().substr(0, item.reschedule.endTime.toString().length - 2)),
                        minutes: parseInt(item.reschedule.endTime.toString().substr(-2))
                    }
                }
            }

            return result;
        });
    });
};


module.exports = UntisRpc;
