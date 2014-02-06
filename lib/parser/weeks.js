var cheerio = require('cheerio');

function Class(){};
var p = Class.prototype;

p.parse = function(content, callback){
    var weeks = [];
        
    $ = cheerio.load(content);
            
    $('select[name=week] > option').each(function(i, elem) {
        weeks.push(elem.attribs.value);
    });
            
    callback(weeks);

}

module.exports = new Class();