Node Stupid GSO - Timetable API
====================

[![Build Status](https://travis-ci.org/medokin/node-stupid-gso.png?branch=master)](https://travis-ci.org/medokin/node-stupid-gso)
[![Code Climate](https://codeclimate.com/github/medokin/node-stupid-gso.png)](https://codeclimate.com/github/medokin/node-stupid-gso)
[![Dependency Status](https://david-dm.org/medokin/node-stupid-gso.png)](https://david-dm.org/medokin/node-stupid-gso)

How to use
---------
- Install Package

```
npm install stupid-gso
```


- Use it!

```js
var stupid = require('stupid-gso');

// Gets available weeks
stupid.weeks().then(function(types){
  console.log(types);
});


// Gets all types
stupid.types().then(function(types){
  console.log(types);
});

// Gets all elements
stupid.elements(type).then(function(elements){
  console.log(elements);
});

// Gets a timetable
stupid.timetable(type, element, week).then(function(lessons){
  console.log(lessons);
});


```


License: MIT

