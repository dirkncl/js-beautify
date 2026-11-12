import { detect } from './detect.js'

export function unpack_chunk(str) {
    var unpacked_source = '';
    var __eval = window.eval;
    if (detect(str)) {
      try {
        window.eval = function(s) { // jshint ignore:line
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
    window.eval = __eval; // jshint ignore:line
    return str;
}
