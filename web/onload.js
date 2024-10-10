/*jshint node:false, jquery:true, strict:false */

import packages from '../package.json' with {type:'json'}

import {
  the,
  read_settings_from_cookie,
  beautify,
  set_editor_mode,
  setPreferredColorScheme,
  getElm
} from './common-function.js'

window.Test = getElm('class', 'hide')

document.addEventListener("DOMContentLoaded", function() {

  function bind(el, eventType, eventHandler ){
    var eventType = eventType.split(" ")
    for( var n = 0, l = el.length; n < l; n++ ){
      var eventElem = el[n];
      for(var et of eventType) {
        //eventElem.addEventListener(eventType, eventHandler, false);
        eventElem.addEventListener(et, eventHandler, false);
       }
    }
    return el;
  }
  Element.prototype.bind = function (eventType, eventHandler){
    return bind(this, eventType, eventHandler )
  }

  read_settings_from_cookie();
  
  document.getElementById('version-number').textContent = '(v' + packages.version + ')';

  var default_text =
    "// This is just a sample script. Paste your real code (javascript or HTML) here.\n\nif ('this_is'==/an_example/){of_beautifier();}else{var a=b?(c%d):e[f];}";
  var textArea = document.getElementById('source');
  document.getElementById('source').value = default_text;

  if (the.use_codemirror && typeof CodeMirror !== 'undefined') {
    

    the.editor = CodeMirror.fromTextArea(textArea, {
      lineNumbers: true
    });
    set_editor_mode();
    the.editor.focus();

    document.getElementsByClassName('CodeMirror')[0].onclick = (function() {
      if (the.editor.getValue() === default_text) {
        the.editor.setValue('');
      }
    });
  }
  else {
    document.getElementById('source').bind('click focus', function() {
      if (this.value === default_text) {
        this.value = '';
      }
    })
    document.getElementById('source').bind('blur', function() {
      if (!this.value) {
        this.value = default_text;
      }
    });
  }

  setPreferredColorScheme()
  
  window.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.keyCode === 13) {
      beautify();
    }
  },false);

  var submits = document.getElementsByClassName("submit")
  for(var submit = 0 ; submit<submits.length;submit++) {
    submits[submit].addEventListener("click",beautify,false)
  }
  
  var selects = document.getElementsByTagName("select")
  for(var select = 0; select < selects.length; select++){
    selects[select].addEventListener("change",beautify,false)
  }
  
  var inputTags = document.getElementsByTagName("input")
  var checkBox = []
  for(var tag in inputTags) {
    if(tag.type === "checkbox"){
      checkBox.push(tag)
    }
  }
  for(var cb of checkBox) {
    cb.addEventListener("change", beautify, false)
  }
  
  document.getElementById('additional-options').addEventListener("change", beautify, false)


  var aTag = getElm('href', '#')
  var runTestElm 
  if(aTag.length > 1) {
    for(var runTestEl of aTag ) {
      if(runTestEl.textContent === 'Run the tests') {
        runTestElm = runTestEl
      }
    }
  } else {
    if(aTag.textContent === 'Run the tests') {
      runTestElm = aTag
    }
  }
  
  document.getElementById('test-session').addEventListener("change", function(){
    if(Test.getAttribute('class') === 'hide') {
      Test.classList.remove('hide')
      runTestElm.focus()
    } else {
      Test.classList.add('hide')
    }
  }, false)
  


},false);
