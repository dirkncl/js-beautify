export function detect(str) {
  return /^var _0x[a-f0-9]+ ?\= ?\[/.test(str);
}