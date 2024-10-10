export function starts_with(str, what) {
  return str.substr(0, what.length) === what;
}