export function detect(str) {
  // the fact that script doesn't contain any space, but has %20 instead
  // should be sufficient check for now.
  if (str.indexOf(' ') === -1) {
    if (str.indexOf('%2') !== -1) return true;
    if (str.replace(/[^%]+/g, '').length > 3) return true;
  }
  return false;
}