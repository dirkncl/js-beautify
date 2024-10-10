import { detect } from './detect.js'

export function unpack(str) {
  if (detect(str)) {
    if (str.indexOf('%2B') !== -1 || str.indexOf('%2b') !== -1) {
      // "+" escaped as "%2B"
      return unescape(str.replace(/\+/g, '%20'));
    } else {
      return unescape(str);
    }
  }
  return str;
}