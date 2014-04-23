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
var Stupid = require('stupid-gso');

var client = new Stupid('user', 'password', 'client');


client.teachers().then(function(teachers){
  console.log(teachers);
});

// Look into the code


```


License: MIT

