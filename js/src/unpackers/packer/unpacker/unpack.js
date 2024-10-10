import { get_chunks } from './get_chunks.js'
import { unpack_chunk } from './unpack_chunk.js'

export function unpack(str) {
  var chunks = get_chunks(str),
    chunk;
  for (var i = 0; i < chunks.length; i++) {
    chunk = chunks[i].replace(/\n$/, '');
    str = str.split(chunk).join(unpack_chunk(chunk));
  }
  return str;
}