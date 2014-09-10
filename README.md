# Jekyll Gulp Sass Foundation

A starting point for a Jekyll site that uses the Foundation Sass framework and includes modern front-end tools like gulp.js and BrowserSync that streamline your work flow

Thanks to [@shakyShane](https://github.com/shakyShane) for the amazing BrowserSync package and the Jekyll example he provided [here](https://github.com/shakyShane/jekyll-gulp-sass-browser-sync)

## System Preparation

To use this starter project, you'll need the following things installed on your machine.

1. [Jekyll](http://jekyllrb.com/) - `gem install jekyll`
2. [NodeJS](http://nodejs.org) - use the installer.
3. [GulpJS](https://github.com/gulpjs/gulp) - `npm install -g gulp` (mac users may need sudo)
4. [Bundler](http://bundler.io/) - `gem install bundler` (mac users may need sudo)

## Local Installation

1. Clone this repository, or download it into a directory of your choice.
2. Inside the directory, run `npm install`.
3. Inside the directory, run `bundle install`.

## Usage

1. Start Gulp – `gulp` <br> This will build your Jekyll site, give you file watching, browser synchronization, auto-rebuild, CSS injecting etc.
2. Generate icon font – `gulp iconfont` <br> This will look for SVG files in the assets/icons directory and generate them into an icon font into the assets/fonts directory. The SCSS needed to use the icon font will automatically be updated in scss/base/_icons.scss.
3. Prettify HTML – `gulp prettify-html` <br> This will take Jekyll's compiled HTML and prettify it up!
4. Push to S3 Bucket – `gulp push-to-s3` <br> First, you'll need to copy .s3config.example to .s3config and add your AWS S3 credentials. Now you can run `gulp push-to-s3` and your site will be pushed to your S3 bucket and set to be publicly accessible.
5. Deploy – `gulp deploy` <br> This will conveniently run both `gulp-prettify` and `gulp push-to-s3` sequentially.