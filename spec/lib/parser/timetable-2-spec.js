var fs = require("fs");

var parser = require("../../../lib/parser");

describe("On parsing timetable", function() {
    
  describe("when getting a row", function() {
    var row = null;
    
    beforeEach(function() {
      var fileContent = fs.readFileSync("spec/mocks/timetable2.htm");
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
      var fileContent = fs.readFileSync("spec/mocks/timetable2.htm");
      var row = parser.timetable.getRow(fileContent, 1);
      cells = parser.timetable.getCells(row);
    });
    
    it("they should exist", function() {
      expect(cells).toBeDefined();
      expect(cells).not.toBe(null);
    });
    
    it("it should be 1 cells", function() {
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
      var fileContent = fs.readFileSync("spec/mocks/timetable2.htm");
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
      var fileContent = fs.readFileSync("spec/mocks/timetable2.htm");
      var row = parser.timetable.getRow(fileContent, 1);
      var cells = parser.timetable.getCells(row);
      content = parser.timetable.getContent(cells[2]);
      content2 = parser.timetable.getContent(cells[3]);
    });
    
    it("first line should be LN", function() {
      expect(content.text[0]).toBe('LN');
    });

    it("second line should be C114", function() {
      expect(content.text[1]).toBe('UA01');
    });
    
    it("third line should be BTP", function() {
      expect(content.text[2]).toBe('ANW');
    });
    
    it("it should not be changed", function() {
      expect(content.changed).toBe(false);
    });

    it("it should not be changed", function() {
      expect(content2.changed).toBe(false);
    });
    
  });
  
  describe("when parsing page", function() {
    var result = null;
    
    beforeEach(function() {

    });

    it("it should exist", function() {
      var fileContent = fs.readFileSync("spec/mocks/timetable2.htm");
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
        text: ['LN', 'UA01', 'ANW'],
        changed: false
      }
      var fileContent = fs.readFileSync("spec/mocks/timetable2.htm");
      
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
        text: ['LN', 'UA01', 'ANW'],
        changed: false
      }
      var result = null;
      var fileContent = fs.readFileSync("spec/mocks/timetable2.htm");
      
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
    
  });
  
});