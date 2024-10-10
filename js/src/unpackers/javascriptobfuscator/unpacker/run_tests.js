import { _smart_split } from './smart_split.js'
import { _unescape } from './unescape.js'
import { detect } from './detect.js'
import SanityTest from '../../../../test/sanitytest.js'

export function run_tests(sanity_test) {
  var t = sanity_test || new SanityTest();

  t.test_function(_smart_split, "_smart_split");
  t.expect('', []);
  t.expect('"a", "b"', ['"a"', '"b"']);
  t.expect('"aaa","bbbb"', ['"aaa"', '"bbbb"']);
  t.expect('"a", "b\\\""', ['"a"', '"b\\\""']);
  t.test_function(_unescape, '_unescape');
  t.expect('\\x40', '@');
  t.expect('\\x10', '\\x10');
  t.expect('\\x1', '\\x1');
  t.expect("\\x61\\x62\\x22\\x63\\x64", 'ab"cd');
  t.test_function(detect, 'detect');
  t.expect('', false);
  t.expect('abcd', false);
  t.expect('var _0xaaaa', false);
  t.expect('var _0xaaaa = ["a", "b"]', true);
  t.expect('var _0xaaaa=["a", "b"]', true);
  t.expect('var _0x1234=["a","b"]', true);
  return t;
}