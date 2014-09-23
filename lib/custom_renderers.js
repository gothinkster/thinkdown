'use strict';

var highlight = require('highlight.js');

var renderer = {};

// code blocks - need to add the 'hljs' class to <code> tag
renderer.highlightCode = function(code, lang, escaped) {
  var out = highlight.highlightAuto(code).value;
  if (out !== null && out !== code) {
    escaped = true;
    code = out;
  }

  if (!lang) {
    return '<pre><code class="hljs">' +
      (escaped ? code : encodeURIComponent(code, true)) +
      '\n</code></pre>';
  }

  return '<pre><code class="hljs ' +
    this.options.langPrefix +
    encodeURIComponent(lang, true) +
    '">' +
    (escaped ? code : encodeURIComponent(code, true)) +
    '\n</code></pre>\n';
};

/*
 * add target="_blank" to link tags
 */
renderer.addBlankToLinks = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(href)
        .replace(/[^\w:]/g, '')
        .toLowerCase();

      if (prot.indexOf('javascript:') === 0) {
        return '';
      }
    } catch (e) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += ' target="_blank">' + text + '</a>';
  return out;
};

/*
 * allow creation of dynamic checkboxes. Markdown is as follows:
 * [x] <some name>: <checkbox text>
 * if <some name> isn't specified, checkbox text will be hashed and used
 * instead
 */
var forbiddenFirebaseCharacters = /\$|\[|\]|\/|\.|\s+/g;
var hashCode = function(s){
  return s.split('').reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
};

renderer.addCheckboxes = function(text) {

  if(text.trim().indexOf('[x]') === 0) {
    // remove [x]
    text = text.replace('[x]', '').trim();

    var i = text.indexOf(':');
    var id = '';
    if(i === -1) {
      id = hashCode(text).toString(16);
    } else if(i === 0) {
      text = text.substring(i+1).trim();
      id = hashCode(text).toString(16);
    } else {
      id = text.substr(0,i);
      text = text.substring(i+1).trim();
    }

    id = id.replace(forbiddenFirebaseCharacters,'_');

    return ['<li class="progress-checkbox"><input id="'+id+'" type="checkbox" ng-model="checkboxes[tutorialName][\''+id+'\']" ><label for="'+id+'" ></label>' + text, ''].join('\n');

  } else {
    return '<li>' + text + '</li>\n';
  }
};


module.exports = renderer;
