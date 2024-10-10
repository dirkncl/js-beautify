export function _unescape(str) {
  // inefficient if used repeatedly or on small strings, but wonderful on single large chunk of text
  for (var i = 32; i < 128; i++) {
    str = str.replace(new RegExp('\\\\x' + i.toString(16), 'ig'), String.fromCharCode(i));
  }
  str = str.replace(/\\x09/g, "\t");
  return str;
}