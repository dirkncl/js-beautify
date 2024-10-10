import { detect } from './detect.js'
import { starts_with } from './starts_with.js'
import { ends_with } from './ends_with.js'

export function unpack(str) {
  if (detect(str)) {
    var evals = eval
    var __eval = eval;
    try {
      evals = function(unpacked) { // jshint ignore:line
        if (starts_with(unpacked, 'var _escape')) {
          // fetch the urlencoded stuff from the script,
          var matches = /'([^']*)'/.exec(unpacked);
          var unescaped = unescape(matches[1]);
          if (starts_with(unescaped, '<script>')) {
            unescaped = unescaped.substr(8, unescaped.length - 8);
          }
          if (ends_with(unescaped, '</script>')) {
            unescaped = unescaped.substr(0, unescaped.length - 9);
          }
          unpacked = unescaped;
        }
        // throw to terminate the script
        unpacked = "// Unpacker warning: be careful when using myobfuscate.com for your projects:\n" +
          "// scripts obfuscated by the free online version may call back home.\n" +
          "\n//\n" + unpacked;
        throw unpacked;
      }; // jshint ignore:line
      __eval(str); // should throw
    } catch (e) {
      // well, it failed. we'll just return the original, instead of crashing on user.
      if (typeof e === "string") {
        str = e;
      }
    }
    evals = __eval; // jshint ignore:line
  }
  return str;
}