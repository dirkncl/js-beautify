export function _fix_quotes(str) {
  var matches = /^"(.*)"$/.exec(str);
  if (matches) {
    str = matches[1];
    str = "'" + str.replace(/'/g, "\\'") + "'";
  }
  return str;
}