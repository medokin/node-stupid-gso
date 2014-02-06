var fs = require("fs");

var parser = require("../../../lib/parser");

describe("On parsing timetable", function() {
    
  describe("when getting a row", function() {
    var row = null;
    
    beforeEach(function() {
      var fileContent = fs.readFileSync("spec/mocks/timetable.htm");
      row = parser.timetable.getRow(fileContent, 1);
    });
    
    it("it should exist", function() {
      expect(row).toBeDefined();
      expect(row).not.toBe(null);
    });
    
    it("it should be a tr tag", function() {
      expect(row.is('tr')).toBe(true);
    });
    
  });
  
  describe("when getting all cells from row", function() {
    var cells = null;
    
    beforeEach(function() {
      var fileContent = fs.readFileSync("spec/mocks/timetable.htm");
      var row = parser.timetable.getRow(fileContent, 1);
      cells = parser.timetable.getCells(row);
    });
    
    it("they should exist", function() {
      expect(cells).toBeDefined();
      expect(cells).not.toBe(null);
    });
    
    it("it should be 5 cells", function() {
      expect(cells.contents().length).toBe(5);
    });
    
    it("they should always have a rowspan attribute", function() {
      cells.each(function(i,element){
          expect(element.attribs.rowspan).toBeDefined();
      });
      
    });
    
  });
  
  describe("when checking cell content", function() {
    var withContent = null;
    var withoutContent = null;
    
    beforeEach(function() {
      var fileContent = fs.readFileSync("spec/mocks/timetable.htm");
      var row = parser.timetable.getRow(fileContent, 1);
      var cells = parser.timetable.getCells(row);
      withContent = parser.timetable.hasContent(cells[2]);
      withoutContent = parser.timetable.hasContent(cells[1]);
    });
    
    it("it should be false if empty", function() {
      expect(withoutContent).toBe(false);
    });

    it("it should be true if not empty", function() {
      expect(withContent).toBe(true);
    });
    
  });
 
  describe("when getting cell content", function() {
    var content = null;
    var content2 = null;
    
    beforeEach(function() {
      var fileContent = fs.readFileSync("spec/mocks/timetable.htm");
      var row = parser.timetable.getRow(fileContent, 1);
      var cells = parser.timetable.getCells(row);
      content = parser.timetable.getContent(cells[2]);
      content2 = parser.timetable.getContent(cells[3]);
    });
    
    it("first line should be KP", function() {
      expect(content.text[0]).toBe('KP');
    });

    it("second line should be C114", function() {
      expect(content.text[1]).toBe('C114');
    });
    
    it("third line should be BTP", function() {
      expect(content.text[2]).toBe('BTP');
    });
    
    it("it should not be changed", function() {
      expect(content.changed).toBe(false);
    });

    it("it should be changed", function() {
      expect(content2.changed).toBe(true);
    });
    
  });
  
  describe("when parsing page", function() {
    var result = null;
    
    beforeEach(function() {

    });

    it("it should exist", function() {
      var fileContent = fs.readFileSync("spec/mocks/timetable.htm");
      parser.timetable.parse(fileContent, function(content){
        expect(content).toBeDefined();
        expect(content).not.toBe(null);
      });
      
    });
    
    
    it("it should match lesson", function() {
      var result = null;
      var expected = {
        hour: 1,
        day: 3,
        text: ['KP', 'C114', 'BTP'],
        changed: false
      }
      var fileContent = fs.readFileSync("spec/mocks/timetable.htm");
      
      parser.timetable.parse(fileContent).then(function(content){
        result = content;
      });
      
      waitsFor(function(){
        return result;
      });
      
      runs(function(){
        expect(result[0]).toEqual(expected);
      })
      
    });
    
    it("it should be a double lesson", function() {
      var expected = {
        hour: 2,
        day: 3,
        text: ['KP', 'C114', 'BTP'],
        changed: false
      }
      var result = null;
      var fileContent = fs.readFileSync("spec/mocks/timetable.htm");
      
      parser.timetable.parse(fileContent).then(function(content){
        result = content;
      });
      
      waitsFor(function(){
        return result;
      });
      
      runs(function(){
        expect(result[1]).toEqual(expected);
      })
      
    });
    
    it("it should be the third lesson on friday", function() {
      var expected = {
        hour: 3,
        day: 5,
        text: ['HL', 'C105', 'MPO'],
        changed: false
      }
      var result = null;
      var fileContent = fs.readFileSync("spec/mocks/timetable.htm");
      
      parser.timetable.parse(fileContent).then(function(content){
        content.forEach(function(item){
          if(item.day == 5 && item.hour == 3){
            result = item;
          }
        })
      });
      
      waitsFor(function(){
        return result;
      });
      
      runs(function(){
        expect(result).toEqual(expected);
      })
      
    });
    
    it("it should be the nineth lesson on monday", function() {
      var expected = {
        hour: 9,
        day: 1,
        text: ['ST', 'C103', 'BTP'],
        changed: false
      }
      var result = null;
      var fileContent = fs.readFileSync("spec/mocks/timetable.htm");
      
      parser.timetable.parse(fileContent).then(function(content){
        content.forEach(function(item){
          if(item.day == 1 && item.hour == 9){
            result = item;
          }
        })
      });
      
      waitsFor(function(){
        return result;
      });
      
      runs(function(){
        expect(result).toEqual(expected);
      })
      
    });
    
  });
  
});