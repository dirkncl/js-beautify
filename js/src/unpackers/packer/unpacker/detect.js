import { get_chunks } from './get_chunks.js'

export function detect(str) {
  return (get_chunks(str).length > 0);
}