Thinkster flavored Markdown
=========

This is a little CLI tool for easily viewing Markdown tutorials as they would
appear on the https://thinkster.io. Currently, the biggest change is the 
addition of special syntax for automatically adding dynamic progress checkboxes.

Some tutorials making use of this markdown format are

* [A better way to learn AngularJS](https://thinkster.io/angulartutorial/a-better-way-to-learn-angularjs)
* [A better way to learn Swift](https://thinkster.io/ios-tutorial/a-better-way-to-learn-swift/)

Installation
------------
```sh
npm install -g thinkdown
```

Usage
-----
Then naviagate to the directory where the Markdown file(s) are stored and run 
```sh
thinkdown
```

The tool will concatente and compile your markdown files before serving them 
through a local web server. It will also automatically update the webpage via 
livereload when changes to the markdown have been detected.

Future
------
Like the Thinkster platform, this tool is under heavy development. We'll update it as the platform evolves.
