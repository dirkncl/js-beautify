export function _smart_split(str) {
  var strings = [];
  var pos = 0;
  while (pos < str.length) {
    if (str.charAt(pos) === '"') {
      // new word
      var word = '';
      pos += 1;
      while (pos < str.length) {
        if (str.charAt(pos) === '"') {
          break;
        }
        if (str.charAt(pos) === '\\') {
          word += '\\';
          pos++;
        }
        word += str.charAt(pos);
        pos++;
      }
      strings.push('"' + word + '"');
    }
    pos += 1;
  }
  return strings;
}