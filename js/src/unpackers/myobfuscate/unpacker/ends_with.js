export function ends_with(str, what) {
  return str.substr(str.length - what.length, what.length) === what;
}