# Jekyll Gulp Sass Foundation

A starting point for a Jekyll site that uses the Foundation Sass framework and includes modern front-end tools like gulp.js and BrowserSync that streamline your workflow

Thanks to [@shakyShane](https://github.com/shakyShane) for the amazing BrowserSync package and the Jekyll example he provided [here](https://github.com/shakyShane/jekyll-gulp-sass-browser-sync)

## System Preparation

To use this starter project, you'll need the following things installed on your machine.

1. [Jekyll](http://jekyllrb.com/) - `$ gem install jekyll`
2. [NodeJS](http://nodejs.org) - use the installer.
3. [GulpJS](https://github.com/gulpjs/gulp) - `$ npm install -g gulp` (mac users may need sudo)

## Local Installation

1. Clone this repo, or download it into a directory of your choice.
2. Inside the directory, run `npm install`.

## Usage

1. Compile Sass – `gulp sass`
2. Build Jekyll Site – `jekyll build` <br> Since this is just a Jekyll project, you can use any of the commands listed in their [docs](http://jekyllrb.com/docs/usage/)
3. Enter development mode – `gulp` <br> This will give you file watching, browser synchronisation, auto-rebuild, CSS injecting etc.
