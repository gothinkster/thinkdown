'use strict';

var highlight = require('highlight.js');

var renderer = {};

/*
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
 * code span - escape angular code
 */
renderer.escapeCodespan = function(text) {
  return '<code ng-non-bindable>' + text + '</code>';
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
      '<checkbox',
      'id="'+id+'"',
      '>',
      text,
      '</checkbox>',
      ''].join('\n ');

  } else if(p[0].indexOf('{alert}') === 0) {
    p.shift();
    text = p.join(' ');
    return '<p class="alert alert-danger">' + text + '</p>\n';
  } else if(p[0].indexOf('{info}') === 0) {
    p.shift();
    text = p.join(' ');
    return '<p class="alert alert-info">' + text + '</p>\n';
  } else {
    return '<p>' + p.join(' ') + '</p>\n';
  }
};

var lastH1Id = '';
renderer.headingPermalink = function(text, level, raw) {
  var id = this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, '-');

  var html = '';

  // don't permalink anything > h2
  if(level > 2) {
    html += [
      '<h'+level+'>',
      text,
      '</h'+level+'>',
    ].join('');

    return html;

  } else if(level === 1) {
    lastH1Id = id;

    html += [
      '</section>',
      '<section id='+id+'>',
      '<h'+level+'>',
    ].join('\n');

  } else if(level === 2){
    id = lastH1Id + '-' + id;
    html += '<h'+level+' id='+id+'>';
  }

  html += [
    text, ' ',
    '<a href="#',id,'" class="permalink" du-smooth-scroll>',
      '<span class="icon ion-link"></span>',
    '</a>',
    '</h'+level+'>',
    '\n'
  ].join('');

  return html;
};


renderer.image = function(url, href, title, text) {
  if(href.indexOf('/') === -1) {
    href = '/images/' + url + '/' + href;
  }

  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

module.exports = renderer;
