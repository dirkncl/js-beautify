// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

// Depends on csslint.js from https://github.com/stubbornella/csslint

// declare global: CSSLint

import CodeMirror from '../../src/codemirror.js'


CodeMirror.registerHelper("lint", "css", function(text, options) {
  var found = [];
  if (!window.CSSLint) {
    if (window.console) {
        window.console.error("Error: window.CSSLint not defined, CodeMirror CSS linting cannot run.");
    }
    return found;
  }
  var results = CSSLint.verify(text, options), messages = results.messages, message = null;
  for ( var i = 0; i < messages.length; i++) {
    message = messages[i];
    var startLine = message.line -1, endLine = message.line -1, startCol = message.col -1, endCol = message.col;
    found.push({
      from: CodeMirror.Pos(startLine, startCol),
      to: CodeMirror.Pos(endLine, endCol),
      message: message.message,
      severity : message.type
    });
  }
  return found;
});
