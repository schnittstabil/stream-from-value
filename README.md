# stream-from-value [![Dependencies Status Image](https://gemnasium.com/schnittstabil/stream-from-value.svg)](https://gemnasium.com/schnittstabil/stream-from-value) [![Build Status Image](https://travis-ci.org/schnittstabil/stream-from-value.svg)](https://travis-ci.org/schnittstabil/stream-from-value) [![Coverage Status](https://coveralls.io/repos/schnittstabil/stream-from-value/badge.png)](https://coveralls.io/r/schnittstabil/stream-from-value)

Create streams from (single) arbitrary Javascript values like strings, functions, arrays, etc.

```bash
npm install stream-from-value --save
```

## Usage

### Stream of single `String | Buffer`

```JavaScript
var StreamFromValue = require('stream-from-value');

StreamFromValue('some string')
  .pipe(process.stdout); // output: some string

StreamFromValue(new Buffer('some string'))
  .pipe(process.stdout); // output: some string
```

### Stream of (arbitrary) Javascript Value

```JavaScript
var StreamFromValue = require('stream-from-value');

StreamFromValue.obj(['some', 'mixed', 'array', 42]).on('data', function(data){
    console.log(data); // output: [ 'some', 'mixed', 'array', 42 ]
  });
```

### Stream of (single) [Gulp](http://gulpjs.com/) File

Gulp files are [vinyl](https://github.com/wearefractal/vinyl) files:

```bash
npm install vinyl
```

Test some awsome Gulp plugin:

```JavaScript
var StreamFromValue = require('stream-from-value'),
    File = require('vinyl');

var testfile = new File({
      cwd: '/',
      base: '/hello/',
      path: '/hello/world.js',
      contents: new Buffer('console.log("Hello world!");')
    });


StreamFromValue.obj(testfile)
  .pipe(someAwsomeGulpPlugin())
  .on('data', function(file){
    console.log(file.contents.toString()); // dunno what someAwsomeGulpPlugin does :)
  });
```

## API

### Class: StreamFromValue

StreamFromValues are [Readable](http://nodejs.org/api/stream.html#stream_class_stream_readable_1) streams.

#### new StreamFromValue(value, [options])

* _value_ `JavaScript value` Arbitrary Javascript value like numbers, strings, objects, functions, ...
* _options_ `Object` passed through [new Readable([options])](http://nodejs.org/api/stream.html#stream_new_stream_readable_options)

Note: The `new` operator can be omitted.

#### StreamFromValue#obj(value, [options])

A convenience wrapper for `new StreamFromValue(value, {objectMode: true, ...})`.

## License

Copyright (c) 2014 Michael Mayer

Licensed under the MIT license.
