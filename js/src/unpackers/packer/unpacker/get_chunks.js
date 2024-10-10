export function get_chunks(str) {
  var chunks = str.match(/eval\(\(?function\(.*?(,0,\{\}\)\)|split\('\|'\)\)\))($|\n)/g);
  return chunks ? chunks : [];
}