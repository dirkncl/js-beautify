import { detect } from './detect.js'

export function unpack_chunk(str) {
  var unpacked_source = '';
  var evals = eval
  var __eval = eval;
  if (detect(str)) {
    try {
      evals = function(s) { // jshint ignore:line
        unpacked_source += s;
        return unpacked_source;
      }; // jshint ignore:line
      __eval(str);
      if (typeof unpacked_source === 'string' && unpacked_source) {
        str = unpacked_source;
      }
    } catch (e) {
      // well, it failed. we'll just return the original, instead of crashing on user.
    }
  }
  evals = __eval; // jshint ignore:line
  return str;
}