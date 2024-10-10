import { detect } from './detect.js'
import { _smart_split } from './smart_split.js'
import { _fix_quotes } from './fix_quotes.js'
import { _unescape } from './unescape.js'

export function unpack(str) {
  if (detect(str)) {
    var matches = /var (_0x[a-f\d]+) ?\= ?\[(.*?)\];/.exec(str);
    if (matches) {
      var var_name = matches[1];
      var strings = _smart_split(matches[2]);
      str = str.substring(matches[0].length);
      for (var k in strings) {
        str = str.replace(new RegExp(var_name + '\\[' + k + '\\]', 'g'),
          _fix_quotes(_unescape(strings[k])));
      }
    }
  }
  return str;
}