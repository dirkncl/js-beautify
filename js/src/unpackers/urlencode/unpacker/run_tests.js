import { detect } from './detect.js'
import { unpack } from './unpack.js'
import SanityTest from '../../../../test/sanitytest.js'

export function run_tests(sanity_test) {
  var t = sanity_test || new SanityTest();
  t.test_function(detect, "detect");
  t.expect('', false);
  t.expect('var a = b', false);
  t.expect('var%20a+=+b', true);
  t.expect('var%20a=b', true);
  t.expect('var%20%21%22', true);
  t.expect('javascript:(function(){var%20whatever={init:function(){alert(%22a%22+%22b%22)}};whatever.init()})();', true);
  t.test_function(unpack, 'unpack');

  t.expect('javascript:(function(){var%20whatever={init:function(){alert(%22a%22+%22b%22)}};whatever.init()})();',
    'javascript:(function(){var whatever={init:function(){alert("a"+"b")}};whatever.init()})();'
  );
  t.expect('', '');
  t.expect('abcd', 'abcd');
  t.expect('var a = b', 'var a = b');
  t.expect('var%20a=b', 'var a=b');
  t.expect('var%20a=b+1', 'var a=b+1');
  t.expect('var%20a=b%2b1', 'var a=b+1');
  return t;
}
