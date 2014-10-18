'use strict';

var highlight = require('highlight.js');

var renderer = {};

/*
 *
 * code blocks - need to add the 'hljs' class to <code> tag
 */
renderer.highlightCode = function(code, lang, escaped) {
  var out = highlight.highlightAuto(code).value;
  if (out !== null && out !== code) {
    escaped = true;
    code = out;
  }

  if (!lang) {
    return '<pre><code ng-non-bindable class="hljs">' +
      (escaped ? code : encodeURIComponent(code, true)) +
      '\n</code></pre>';
  }

  return '<pre><code ng-non-bindable class="hljs ' +
    this.options.langPrefix +
    encodeURIComponent(lang, true) +
    '">' +
    (escaped ? code : encodeURIComponent(code, true)) +
    '\n</code></pre>\n';
};

/*
 * <a>
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

/**
 * <p>
 * add checkboxes to paragraphs
 */
var forbiddenFirebaseCharacters = /\$|\[|\]|\/|\.|\s+/g;
var hashCode = function(s){
  return s.split('').reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
};

renderer.addParagraphCheckboxes = function(text) {
  var p = text.split('\n');

  var match = p[0].match(/\{x:\s*(.*)\s*\}/);
  if(match) {
    var id = match[1];
    p.shift();
    text = p.join(' ');

    if(id === '') {
      id = hashCode(text).toString(16);
    }

    id = id.replace(forbiddenFirebaseCharacters,'_');

    return [
      '<p id="'+id+'"',
      'checkbox',
      'ng-model="checkboxes[tutorialName][\''+id+'\']" >',
      text,
      '</p>',
      ''].join('\n ');

  } else if(p[0].indexOf('{alert}') === 0) {
    p.shift();
    text = p.join(' ');
    return '<p class="alert alert-danger">' + text + '</p>\n';
  } else {
    return '<p>' + p.join(' ') + '</p>\n';
  }
};

renderer.headingPermalink = function(headingList, tutorialName, brandName) {
  return function(text, level, raw) {
    var id = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-');

    var html = '';

    if(level === 1) {
      headingList.push({id: id, text: text, h2:[]});
    } else if(level === 2) {
      id = id + '-' + headingList.length;
    }

    html = [
      '<h'+level+'>',
      text, ' ',
      '<a href="https://thinkster.io/',brandName,'/',tutorialName,'/#',id,'" class="permalink">',
      '<span class="fa fa-link"></span>',
      '</a>',
      '</h'+level+'>',
      '\n'
    ].join('');

    return html;
  };
};

module.exports = renderer;
