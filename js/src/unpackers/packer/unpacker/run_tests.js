import { detect } from './detect.js'
import { unpack } from './unpack.js'
import SanityTest from '../../../../test/sanitytest.js'


export function run_tests(sanity_test) {
  var t = sanity_test || new SanityTest();

  var pk1 = "eval(function(p,a,c,k,e,r){e=String;if(!''.replace(/^/,String)){while(c--)r[c]=k[c]||c;k=[function(e){return r[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}('0 2=1',3,3,'var||a'.split('|'),0,{}))";
  var unpk1 = 'var a=1';
  var pk2 = "eval(function(p,a,c,k,e,r){e=String;if(!''.replace(/^/,String)){while(c--)r[c]=k[c]||c;k=[function(e){return r[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}('0 2=1',3,3,'foo||b'.split('|'),0,{}))";
  var unpk2 = 'foo b=1';
  var pk_broken = "eval(function(p,a,c,k,e,r){BORKBORK;if(!''.replace(/^/,String)){while(c--)r[c]=k[c]||c;k=[function(e){return r[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}('0 2=1',3,3,'var||a'.split('|'),0,{}))";
  var pk3 = "eval(function(p,a,c,k,e,r){e=String;if(!''.replace(/^/,String)){while(c--)r[c]=k[c]||c;k=[function(e){return r[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}('0 2=1{}))',3,3,'var||a'.split('|'),0,{}))";
  var unpk3 = 'var a=1{}))';

  t.test_function(detect, "detect");
  t.expect('', false);
  t.expect('var a = b', false);
  t.test_function(unpack, "unpack");
  t.expect(pk_broken, pk_broken);
  t.expect(pk1, unpk1);
  t.expect(pk2, unpk2);
  t.expect(pk3, unpk3);
  t.expect("function test (){alert ('This is a test!')}; " +
    "eval(function(p,a,c,k,e,r){e=String;if(!''.replace(/^/,String))" +
    "{while(c--)r[c]=k[c]||c;k=[function(e){return r[e]}];e=function" +
    "(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp(" +
    "'\\b'+e(c)+'\\b','g'),k[c]);return p}('0 2=\\\'{Íâ–+›ï;ã†Ù¥#\\\'',3,3," +
    "'var||a'.split('|'),0,{}))",
    "function test (){alert ('This is a test!')}; var a='{Íâ–+›ï;ã†Ù¥#'");


  var filler = '\nfiller\n';
  t.expect(filler + pk1 + "\n" + pk_broken + filler + pk2 + filler, filler + unpk1 + "\n" + pk_broken + filler + unpk2 + filler);

  return t;
}