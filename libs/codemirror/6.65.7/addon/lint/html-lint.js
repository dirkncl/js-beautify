// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

// Depends on htmlhint.js from http://htmlhint.com/js/htmlhint.js

// declare global: HTMLHint

import CodeMirror from '../../src/codemirror.js'
import { HTMLHint } from './htmlhint.js'

var defaultRules = {
  "tagname-lowercase": true,
  "attr-lowercase": true,
  "attr-value-double-quotes": true,
  "doctype-first": false,
  "tag-pair": true,
  "spec-char-escape": true,
  "id-unique": true,
  "src-not-empty": true,
  "attr-no-duplication": true
};

CodeMirror.registerHelper("lint", "html", function(text, options) {
  var found = [];
  if (HTMLHint && !HTMLHint.verify) {
    if(typeof HTMLHint.default !== 'undefined') {
      HTMLHint = HTMLHint.default;
    } else {
      HTMLHint = HTMLHint.HTMLHint;
    }
  }
  if (!HTMLHint) HTMLHint = window.HTMLHint;
  if (!HTMLHint) {
    if (window.console) {
        window.console.error("Error: HTMLHint not found, not defined on window, or not available through define/require, CodeMirror HTML linting cannot run.");
    }
    return found;
  }
  var messages = HTMLHint.verify(text, options && options.rules || defaultRules);
  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    var startLine = message.line - 1, endLine = message.line - 1, startCol = message.col - 1, endCol = message.col;
    found.push({
      from: CodeMirror.Pos(startLine, startCol),
      to: CodeMirror.Pos(endLine, endCol),
      message: message.message,
      severity : message.type
    });
  }
  return found;
});
