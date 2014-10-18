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

/*
 * <li>
 * allow creation of dynamic checkboxes. Markdown is as follows:
 * [x] <some name>: <checkbox text>
 * if <some name> isn't specified, checkbox text will be hashed and used
 * instead
 */
var forbiddenFirebaseCharacters = /\$|\[|\]|\/|\.|\s+/g;
var hashCode = function(s){
  return s.split('').reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
};

renderer.addListCheckboxes = function(text) {

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

    return ['<li class="progress-checkbox">',
      '<input id="'+id+'" type="checkbox" ng-model="checkboxes[tutorialName][\''+id+'\']" >',
      '<label for="'+id+'" ></label>',
      text,
      // '<button class="comment-button" ng-click="showCommentsModal(\''+id+'\')">Comments</button>',
      '</li>',
      ''].join('\n');

  } else {
    return '<li>' + text + '</li>\n';
  }
};

/**
 * <p>
 * add checkboxes to paragraphs
 */
renderer.addParagraphCheckboxes = function(text) {
  var p = text.split('\n');

  if(p[0].indexOf('[x]') === 0) {
    var id = p.shift().replace('[x]', '').trim();
    text = p.join('\n');

    if(id === '') {
      id = hashCode(text).toString(16);
    }

    id = id.replace(forbiddenFirebaseCharacters,'_');

    return ['<p class="progress-checkbox">',
      '<input id="'+id+'" type="checkbox" ng-model="checkboxes[tutorialName][\''+id+'\']" >',
      text,
      '</p>',
      ''].join('\n');

  } else if(p[0].indexOf('{alert}') === 0) {
    p.shift();
    text = p.join('\n');
    return '<p class="alert alert-danger">' + text + '</p>\n';
  } else {
    return '<p>' + text + '</p>\n';
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
