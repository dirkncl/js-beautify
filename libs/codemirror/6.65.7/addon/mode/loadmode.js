// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE

import CodeMirror from "../../src/codemirror.js"

if (!CodeMirror.modeURL) CodeMirror.modeURL = "../mode/%N/%N.js";
var env = "plain"
var loading = {};
function splitCallback(cont, n) {
  var countDown = n;
  return function() { if (--countDown == 0) cont(); };
}
function ensureDeps(mode, cont, options) {
  var modeObj = CodeMirror.modes[mode], deps = modeObj && modeObj.dependencies;
  if (!deps) return cont();
  var missing = [];
  for (var i = 0; i < deps.length; ++i) {
    if (!CodeMirror.modes.hasOwnProperty(deps[i]))
      missing.push(deps[i]);
  }
  if (!missing.length) return cont();
  var split = splitCallback(cont, missing.length);
  for (var i = 0; i < missing.length; ++i)
    CodeMirror.requireMode(missing[i], split, options);
}

CodeMirror.requireMode = function(mode, cont, options) {
  if (typeof mode != "string") mode = mode.name;
  if (CodeMirror.modes.hasOwnProperty(mode)) return ensureDeps(mode, cont, options);
  if (loading.hasOwnProperty(mode)) return loading[mode].push(cont);

  var file = options && options.path ? options.path(mode) : CodeMirror.modeURL.replace(/%N/g, mode);
  if (options && options.loadMode) {
    options.loadMode(file, function() { ensureDeps(mode, cont, options) })
  } else if (env == "plain") {
    var script = document.createElement("script");
    script.type = "module";
    script.src = file;
    var others = document.getElementsByTagName("script")[0];
    var list = loading[mode] = [cont];
    CodeMirror.on(script, "load", function() {
      ensureDeps(mode, function() {
        for (var i = 0; i < list.length; ++i) list[i]();
      }, options);
    });
    others.parentNode.insertBefore(script, others);
  }
};

CodeMirror.autoLoadMode = function(instance, mode, options) {
  if (!CodeMirror.modes.hasOwnProperty(mode))
    CodeMirror.requireMode(mode, function() {
      instance.setOption("mode", instance.getOption("mode"));
    }, options);
};
