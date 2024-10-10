export function detect(str) {
  if (/^var _?[0O1lI]{3}\=('|\[).*\)\)\);/.test(str)) {
    return true;
  }
  if (/^function _?[0O1lI]{3}\(_/.test(str) && /eval\(/.test(str)) {
    return true;
  }
  return false;
}