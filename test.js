'use strict';
var fromValue = require('./'),
    merge = require('merge-stream'),
    gulp = require('gulp'),
    recorder = require('stream-recorder'),
    assert = require('assert'),
    File = require('vinyl'),
    testfilePath = '/test/file.coffee',
    testfile = new File({
      cwd: '/',
      base: '/test/',
      path: testfilePath,
      contents: new Buffer('answer: 42')
    });

describe('fromValue', function() {

  describe('with string as value', function() {
    var input = '\uD834\uDF06';

    it('should emit value', function(done) {
      fromValue(input)
        .on('error', done)
        .pipe(recorder(function(result) {
          assert.deepEqual(result.toString(), input);
          done();
        }))
        .resume();
    });

    describe('and decodeStrings:false option', function() {
      it('should emit value', function(done) {
        fromValue(input, {decodeStrings: false})
          .on('error', done)
          .pipe(recorder(function(result) {
            assert.deepEqual(result.toString(), input);
            done();
          }))
          .resume();
      });
    });
  });

  it('constructor should return new instance w/o new', function() {
    var sut = fromValue;
    assert.strictEqual(sut() instanceof fromValue, true);
  });
});

describe('fromValue.obj', function() {

  describe('with string array as value', function() {
    var input = ['foo', 'bar'];
    it('should emit value in object mode', function(done) {
      var opts = {objectMode: true};
      fromValue(input, opts)
        .on('error', done)
        .pipe(recorder(opts, function(result) {
          assert.deepEqual(result, [input]);
          done();
        }))
        .resume();
    });
  });

  [null, undefined].forEach(function(eof) {
    describe('with value == ' + eof, function() {
      it('should end stream', function(done) {
        var opts = {objectMode: true};
        fromValue(eof, opts)
          .on('error', done)
          .pipe(recorder(opts, function(result) {
            assert.deepEqual(result, []);
            done();
          }))
          .resume();
      });
    });
  });

  describe('with mixed object as value', function() {
    var input = ['foo', 1, { foobar: 'foobar', answer: 42 }, {}, 'bar',
          undefined, null];

    it('should emit value', function(done) {
      var opts = {objectMode: true};
      fromValue.obj(input)
        .on('error', done)
        .pipe(recorder(opts, function(result) {
          assert.deepEqual(result, [input]);
          done();
        }))
        .resume();
    });
  });

  describe('in duplex mode', function() {
    it('should insert vinyl file in gulp stream', function(done) {
      var opts = {objectMode: true};
      var sut = new fromValue.obj(testfile);
      merge(gulp.src(__filename), sut)
        .on('error', done)
        .pipe(recorder(opts, function(result) {
          var paths = result.map(function(file) { return file.path; });
          assert.deepEqual(paths, [testfilePath, __filename]);
          done();
        }))
        .resume();
    });
  });

  it('constructor should return new instance w/o new', function() {
    var sut = fromValue.obj;
    assert.strictEqual(sut() instanceof fromValue, true);
  });
});
