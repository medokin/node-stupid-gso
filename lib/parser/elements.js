var cheerio = require('cheerio');
var RSVP = require('rsvp');

function Class(){};
var p = Class.prototype;

function strPad(number, length){
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;
}


p.parse = function(content, type, callback){
    var $ = cheerio.load(content);
    
    var typesString = this.extractArrayString($);
    
    var result = this.getElements(typesString, type);
    
    callback(result);
}

p.typesMap = {
    "classes": 0,
    "teachers": 1,
    "rooms": 2
};

p.extractArrayString = function($){
    var scriptTags = $('script');
    var script = scriptTags[1].children[0].data; // Script with all elements
    return script.match(/\[".+?\"]/gi); // Match only arrays
}

p.getElements = function(typesString, type){
    var typeId = this.typesMap[type];
    return typesString[typeId].match(/([A-Z0-9])+/gi);
}

p.getRemoteId = function(content, type, element){
  var self = this;
  var promise = new RSVP.Promise(function(resolve, reject){
    self.parse(content,type, function(elements){
        for (var i=0; i<elements.length; i++){ 
            if (elements[i] == element) {
                var id = strPad(i+1, 5);
                resolve(id);
            }
        }
        
        reject("Id not found");
    });
  });
  
  return promise;
}



module.exports = new Class();