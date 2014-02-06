var request = require("../../lib/helper/request");

describe("On http request", function() {
  var httpServer = null;
  
  beforeEach(function() {
    var express = require('express');
    var app = express();
    
    app.get('/exists', function(req, res){
      res.send('exists');
    });
    
    app.get('/noRespond', function(req, res){

    }); 
    
    httpServer = require('http').createServer(app);
    httpServer.listen('3333');
    
  });

  afterEach(function() {
    httpServer.close();
  });
  
  describe("when page does not exist", function() {
    
    it("it should return error", function() {
      var ready = null;
      var errorMessage = null;
      
      request('http://localhost:3333/notExisting')
      .then(function(value){
        ready = true;
      }, function(error){
        ready = true;
        errorMessage = error;
      });
      
      waitsFor(function(){
        return ready;
      });
      
      runs(function(){
        expect(errorMessage).not.toBe(null);
      })
      
      
    });
    
  });

  describe("when page exists", function() {
    
    it("it should have content", function() {
      var ready = null;
      var errorMessage = null;
      var content = null;
      
      request('http://localhost:3333/exists')
      .then(function(value){
        ready = true;
        content = value;
      }, function(error){
        ready = true;
        errorMessage = error;
      });
      
      waitsFor(function(){
        return ready;
      });
      
      runs(function(){
        expect(errorMessage).toBe(null);
        expect(content).not.toBe(null);
      });
      
    });
    
  });

  describe("when response takes to long", function() {
    
    it("it should cancel", function() {
      var ready = null;
      var errorMessage = null;
      var content = null;
      
      request('http://localhost:3333/noRespond')
      .then(function(value){
        ready = true;
        content = value;
      }, function(error){
        ready = true;
        errorMessage = error;
      });
      
      waitsFor(function(){
        return ready;
      });
      
      runs(function(){
        expect(errorMessage).not.toBe(null);
      });
      
    });
    
  });

});