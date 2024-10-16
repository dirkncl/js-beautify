// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

// Depends on coffeelint.js from http://www.coffeelint.org/js/coffeelint.js

// declare global: coffeelint

import CodeMirror from '../../src/codemirror.js'


CodeMirror.registerHelper("lint", "coffeescript", function(text) {
  var found = [];
  if (!window.coffeelint) {
    if (window.console) {
      window.console.error("Error: window.coffeelint not defined, CodeMirror CoffeeScript linting cannot run.");
    }
    return found;
  }
  var parseError = function(err) {
    var loc = err.lineNumber;
    found.push({from: CodeMirror.Pos(loc-1, 0),
                to: CodeMirror.Pos(loc, 0),
                severity: err.level,
                message: err.message});
  };
  try {
    var res = coffeelint.lint(text);
    for(var i = 0; i < res.length; i++) {
      parseError(res[i]);
    }
  } catch(e) {
    found.push({from: CodeMirror.Pos(e.location.first_line, 0),
                to: CodeMirror.Pos(e.location.last_line, e.location.last_column),
                severity: 'error',
                message: e.message});
  }
  return found;
});

