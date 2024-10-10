/*jshint strict:false, node:false */
/*exported run_tests, read_settings_from_cookie, beautify, submitIssue, copyText, selectAll, clearAll, changeToFileContent, setPreferredColorScheme*/
import CodeMirror from '../libs/codemirror.js'
globalThis.CodeMirror = CodeMirror

import Cookies from '../libs/js.cookie.js'
import { JavascriptObfuscator, Packer as P_A_C_K_E_R, Urlencoded, MyObfuscate, } from '../js/src/unpacker.js'
import * as beautifier from '../js/src/index.js'
import SanityTest from '../js/test/sanitytest.js'
import SanitizeTest from '../js/test/sanitytest.js'
import { run_javascript_tests } from '../js/test/generated/beautify-javascript-tests.js'
import { run_css_tests } from '../js/test/generated/beautify-css-tests.js'
import { run_html_tests } from '../js/test/generated/beautify-html-tests.js'

import darcula_css from '../libs/codemirror/6.65.7/theme/darcula.css' with {type: 'css'}
import dialog_css from '../libs/codemirror/6.65.7/addon/dialog/dialog.css' with {type: 'css'}
import common_style_css from './common-style.css' with {type:'css'}
globalThis.document.adoptedStyleSheets.push(darcula_css, dialog_css, common_style_css);

export function getElm(attr, name){
  var all = document.getElementsByTagName('*')
  var result = []
  for(var tag of all) {
    if(tag.getAttribute(attr) === name) {
      result.push(tag)
    }
  }
  if(result.length>1) return result
  return result[0]
}

var document = window.document

function getId(id){
  return getElm('id', id)
}

export var the = {
  use_codemirror: !window.location.href.match(/without-codemirror/),
  beautifier_file: window.location.href.match(/debug/) ? beautifier : beautifier,
  beautifier: null,
  beautify_in_progress: false,
  editor: null // codemirror editor
};

var turn_off_codemirror = document.getElementsByClassName('turn-off-codemirror')[0]
if(window.location.href.match(/without-codemirror/)) {
  turn_off_codemirror.href = 'index.html'
  turn_off_codemirror.innerHTML = 'Use Codemirror for code input?'
} else {
  turn_off_codemirror.href = 'index.html?without-codemirror'
  turn_off_codemirror.innerHTML = 'Use a simple textarea for code input?'

}

function set(beauty) {
  the.beautifier = beauty;
}
set(beautifier)


function any(a, b) {
  return a || b;
}

export function set_editor_mode() {
  if (the.editor) {
    var language = getId('language').value;
    var mode = 'javascript';
    if (language === 'js') {
      mode = 'javascript';
    } else if (language === 'html') {
      mode = 'htmlmixed';
    } else if (language === 'css') {
      mode = 'css';
    }
    the.editor.setOption("mode", mode);
  }
}

function run_tests() {
  Promise.all([
      SanitizeTest, run_javascript_tests, run_css_tests, run_html_tests
    ]).then(function() {
      var st = new SanityTest();
      run_javascript_tests(st, Urlencoded, the.beautifier.js, the.beautifier.html, the.beautifier.css);
      run_css_tests(st, Urlencoded, the.beautifier.js, the.beautifier.html, the.beautifier.css);
      run_html_tests(st, Urlencoded, the.beautifier.js, the.beautifier.html, the.beautifier.css);
      JavascriptObfuscator.run_tests(st);
      P_A_C_K_E_R.run_tests(st);
      Urlencoded.run_tests(st);
      MyObfuscate.run_tests(st);
      var results = st.results_raw()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/ /g, '&nbsp;')
        .replace(/\r/g, '·')
        .replace(/\n/g, '<br>');
      
      var testResult = getId('testresults')
      testResult.style.display = "block";
      testResult.innerHTML = results
  });
}

export function read_settings_from_cookie() {
  getId('tabsize').value = any(Cookies.get('tabsize'), '2');
  getId('brace-style').value = any(Cookies.get('brace-style'), 'collapse');
  getId('detect-packers').checked = Cookies.get('detect-packers') !== 'on';
  getId('max-preserve-newlines').value = any(Cookies.get('max-preserve-newlines'), '5');
  getId('keep-array-indentation').checked = Cookies.get('keep-array-indentation') === 'on';
  getId('break-chained-methods').checked = Cookies.get('break-chained-methods') === 'on';
  getId('indent-scripts').value = any(Cookies.get('indent-scripts'), 'normal');
  getId('additional-options').value = any(Cookies.get('additional-options'), '{}');
  getId('space-before-conditional').checked = Cookies.get('space-before-conditional') !== 'off';
  getId('wrap-line-length').value = any(Cookies.get('wrap-line-length'), '0');
  getId('unescape-strings').checked = Cookies.get('unescape-strings') === 'on';
  getId('jslint-happy').checked = Cookies.get('jslint-happy') === 'on';
  getId('end-with-newline').checked = Cookies.get('end-with-newline') === 'on';
  getId('indent-inner-html').checked = Cookies.get('indent-inner-html') === 'on';
  getId('comma-first').checked = Cookies.get('comma-first') === 'on';
  getId('e4x').checked = Cookies.get('e4x') === 'on';
  getId('language').value = any(Cookies.get('language'), 'js');
  getId('indent-empty-lines').checked = Cookies.get('indent-empty-lines') === 'on';
  
  //getId('test-session').checked = Cookies.get('test-session') === 'off';
}

function store_settings_to_cookie() {
  var opts = {
    expires: 360
  };
  Cookies.set('tabsize', getId('tabsize').value, opts);
  Cookies.set('brace-style', getId('brace-style').value, opts);
  Cookies.set('detect-packers', getId('detect-packers').checked ? 'on' : 'off', opts);
  Cookies.set('max-preserve-newlines', getId('max-preserve-newlines').value, opts);
  Cookies.set('keep-array-indentation', getId('keep-array-indentation').checked ? 'on' : 'off', opts);
  Cookies.set('break-chained-methods', getId('break-chained-methods').checked ? 'on' : 'off', opts);
  Cookies.set('space-before-conditional', getId('space-before-conditional').checked ? 'on' : 'off',
    opts);
  Cookies.set('unescape-strings', getId('unescape-strings').checked ? 'on' : 'off', opts);
  Cookies.set('jslint-happy', getId('jslint-happy').checked ? 'on' : 'off', opts);
  Cookies.set('end-with-newline', getId('end-with-newline').checked ? 'on' : 'off', opts);
  Cookies.set('wrap-line-length', getId('wrap-line-length').value, opts);
  Cookies.set('indent-scripts', getId('indent-scripts').value, opts);
  Cookies.set('additional-options', getId('additional-options').value, opts);
  Cookies.set('indent-inner-html', getId('indent-inner-html').checked ? 'on' : 'off', opts);
  Cookies.set('comma-first', getId('comma-first').checked ? 'on' : 'off', opts);
  Cookies.set('e4x', getId('e4x').checked ? 'on' : 'off', opts);
  Cookies.set('language', getId('language').value, opts);
  Cookies.set('indent-empty-lines', getId('indent-empty-lines').checked ? 'on' : 'off', opts);
  
  //Cookies.set('test-session', getId('test-session').checked ? 'on' : 'off', opts);
}

function unpacker_filter(source) {
  var leading_comments = '',
    comment = '',
    unpacked = '',
    found = false;

  // cuts leading comments
  do {
    found = false;
    if (/^\s*\/\*/.test(source)) {
      found = true;
      comment = source.substr(0, source.indexOf('*/') + 2);
      source = source.substr(comment.length);
      leading_comments += comment;
    } else if (/^\s*\/\//.test(source)) {
      found = true;
      comment = source.match(/^\s*\/\/.*/)[0];
      source = source.substr(comment.length);
      leading_comments += comment;
    }
  } while (found);
  leading_comments += '\n';
  source = source.replace(/^\s+/, '');

  var unpackers = [P_A_C_K_E_R, Urlencoded, JavascriptObfuscator /*, MyObfuscate*/ ];
  for (var i = 0; i < unpackers.length; i++) {
    if (unpackers[i].detect(source)) {
      unpacked = unpackers[i].unpack(source);
      if (unpacked !== source) {
        source = unpacker_filter(unpacked);
      }
    }
  }

  return leading_comments + source;
}

/* exported downloadBeautifiedCode */
export function downloadBeautifiedCode() {
  var content = the.editor ? the.editor.getValue() : window.document.getElementById('source').value;

  // Getting the selected language to determine the file extension
  var language = window.document.getElementById('language').value;
  var fileExtension = "txt"; // Default extension

  // Setting the  file extension based on the selected language
  if (language === 'html') {
    fileExtension = 'html';
  } else if (language === 'css') {
    fileExtension = 'css';
  } else if (language === 'js') {
    fileExtension = 'js';
  }

  // Creating a Blob object with the content
  var blob = new Blob([content], { type: "text/plain;charset=utf-8" });

  // Creating a temporary anchor element to trigger the download
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  try {
    link.download = "beautified." + fileExtension; // Dynamic file name based on extension

    // Triggering the download
    link.click();
  } finally {
    // Cleanup
    URL.revokeObjectURL(link.href);
  }
}

export function beautify() {
  if (the.beautify_in_progress) {
    return;
  }

  store_settings_to_cookie();

  the.beautify_in_progress = true;

  var source = the.editor ? the.editor.getValue() : getId('source').value,
    output,
    opts = {};
  the.lastInput = source;

  var additional_options = getId('additional-options').value;

  var language = getId('language').value;
  var theLanguage = getId('language');
  var options = theLanguage.getElementsByTagName("optons")
  for(var i = 0; i <options.length;i++) {
    if(options[i].selected === true) {
      the.language = options[i].textContent;
    }
  }

  opts.indent_size = getId('tabsize').value;
  opts.indent_char = parseInt(opts.indent_size, 10) === 1 ? '\t' : ' ';
  opts.max_preserve_newlines = getId('max-preserve-newlines').value;
  opts.preserve_newlines = opts.max_preserve_newlines !== "-1";
  opts.keep_array_indentation = getId('keep-array-indentation').checked;
  opts.break_chained_methods = getId('break-chained-methods').checked;
  opts.indent_scripts = getId('indent-scripts').value;
  opts.brace_style = getId('brace-style').value + (getId('brace-preserve-inline').checked ? ",preserve-inline" : "");
  opts.space_before_conditional = getId('space-before-conditional').checked;
  opts.unescape_strings = getId('unescape-strings').checked;
  opts.jslint_happy = getId('jslint-happy').checked;
  opts.end_with_newline = getId('end-with-newline').checked;
  opts.wrap_line_length = getId('wrap-line-length').value;
  opts.indent_inner_html = getId('indent-inner-html').checked;
  opts.comma_first = getId('comma-first').checked;
  opts.e4x = getId('e4x').checked;
  opts.indent_empty_lines = getId('indent-empty-lines').checked;
  getId('additional-options-error').style.display = "none";
  getId('open-issue').style.display = "none";
  
  //opts.test_session = getId('test-session').checked
  
  if (additional_options && additional_options !== '{}') {
    try {
      additional_options = JSON.parse(additional_options);
      opts = mergeObjects(opts, additional_options);
    } catch (e) {
      getId('additional-options-error').style.dispay = "";
    }
  }

  var selectedOptions = JSON.stringify(opts, null, 2);
  
  getId('options-selected').value = selectedOptions;

  if (language === 'html') {
    output = the.beautifier.html(source, opts);
  } else if (language === 'css') {
    output = the.beautifier.css(source, opts);
  } else {
    if (getId('detect-packers').checked===true) {
      source = unpacker_filter(source);
    }
    output = the.beautifier.js(source, opts);
  }

  if (the.editor) {
    the.editor.setValue(output);
  } else {
    getId('source').value = output;
  }

  the.lastOutput = output;
  the.lastOpts = selectedOptions;

  getId('open-issue').style.dispay = "";
  set_editor_mode();

  the.beautify_in_progress = false;
}

function mergeObjects(allOptions, additionalOptions) {
  var finalOpts = {};
  var name;

  for (name in allOptions) {
    finalOpts[name] = allOptions[name];
  }
  for (name in additionalOptions) {
    finalOpts[name] = additionalOptions[name];
  }
  return finalOpts;
}

function submitIssue() {
  var url = 'https://github.com/beautifier/js-beautify/issues/new?';

  var encoded = encodeURIComponent(getSubmitIssueBody()).replace(/%20/g, "+");
  if (encoded.length > 7168) {
    var confirmText = [
      'The sample text is too long for automatic template creation.',
      '',
      'Click OK to continue and create an issue starting with template defaults.',
      'Click CANCEL to return to the beautifier and try beautifying a shorter sample.'
    ];

    if (!confirm(confirmText.join('\n'))) {
      getId('open-issue').style.displey = "none";
      return;
    }
    encoded = encodeURIComponent(getSubmitIssueBody(true)).replace(/%20/g, "+");
  }
  url += 'body=' + encoded;

  console.log(url);
  console.log(url.length);

  window.open(url, '_blank').focus();
}

function getSubmitIssueBody(trucate) {
  var input = the.lastInput;
  var output = the.lastOutput;

  if (trucate) {
    input = '/* Your input text */';
    output = '/* Output text currently returned by the beautifier */';
  }

  var submit_body = [
    '# Description',
    '<!-- Describe your scenario here -->',
    '',
    '## Input',
    'The code looked like this before beautification:',
    '```',
    input,
    '```',
    '',
    '## Current Output',
    'The  code actually looked like this after beautification:',
    '```',
    output,
    '```',
    '',
    '## Expected Output',
    'The code should have looked like this after beautification:',
    '```',
    '/* Your desired output text */',
    '```',
    '',
    '# Environment',
    '',
    '## Browser User Agent:',
    navigator.userAgent,
    '',
    'Language Selected:',
    the.language,
    '',
    '## Settings',
    '```json',
    the.lastOpts,
    '```',
    ''
  ];
  return submit_body.join('\n');
}


function copyText() {
  if (the.editor) {
    the.editor.execCommand('selectAll');
    var currentText = the.editor.getValue();
    var copyArea = document.createElement('textarea')
    copyArea.setAttribute('readonly','')
    copyArea.style = "position:absolute;left:-9999px"
    copyArea.textContent = currentText
    document.body.appendChild(copyArea);

    copyArea.select();
    document.execCommand('copy');
    console.log('copy')
    copyArea.remove();
  } else {
    getId('source').focus();
    getId('source').select();
    document.execCommand('copy');
  }
}

function selectAll() {
  if (the.editor) {
    the.editor.execCommand('selectAll');
  } else {
    getId('source').focus();
    getId('source').select();
  }
}

function clearAll() {
  if (the.editor) {
    the.editor.setValue('');
  } else {
    getId('source').value = '';
  }
}

function changeToFileContent(input) {
  var file = input.files[0];
  if (file) {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function(event) {
      if (the.editor) {
        the.editor.setValue(event.target.result);
      } else {
        getId('source').value = event.target.result;
      }
    };
  }
}

export function setPreferredColorScheme() {
  //var themeToggleBtn = document.querySelector('#theme-toggle-btn');
  var themeToggleBtn = document.getElementById('theme-toggle-btn');
  themeToggleBtn.addEventListener('change', switchTheme, false);
  var isPreferredColorSchemeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isPreferredColorSchemeDark) {
    themeToggleBtn.checked = true;
    for(var cm of document.getElementsByClassName('CodeMirror')) {
      cm.classList.add('cm-s-darcula')
    }
    window.document.body.classList.add('dark-mode')
    for(var logo of window.document.getElementsByClassName('logo')) {
      for(var img of logo.getElementsByTagName('img')) {
         img.setAttribute("src", "web/banner-dark.svg")
      }
    }
  }
}

function switchTheme(themeToggleEvent) {
  if (themeToggleEvent.target.checked) {
    for(var cm of document.getElementsByClassName('CodeMirror')) {
      cm.classList.add('cm-s-darcula')
    }
    window.document.body.classList.add('dark-mode')
    for(var logo of document.getElementsByClassName('logo')) {
      for(var img of logo.getElementsByTagName('img')) {
         img.setAttribute("src", "web/banner-dark.svg")
      }
    }
  } else {
    for(var cm of document.getElementsByClassName('CodeMirror')) {
      cm.classList.remove('cm-s-darcula')
    }
    window.document.body.classList.remove('dark-mode')
    for(var logo of document.getElementsByClassName('logo')) {
      for(var img of logo.getElementsByTagName('img')) {
         img.setAttribute("src", "web/banner-light.svg")
      }
    }
  }
}

globalThis.run_tests = run_tests
globalThis.read_settings_from_cookie = read_settings_from_cookie
globalThis.submitIssue = submitIssue
globalThis.copyText = copyText
globalThis.downloadBeautifiedCode = downloadBeautifiedCode
globalThis.selectAll = selectAll
globalThis.clearAll = clearAll
globalThis.changeToFileContent = changeToFileContent
