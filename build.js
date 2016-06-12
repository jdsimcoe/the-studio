var metalsmith = require('metalsmith'),
    paths = require('metalsmith-paths'),
    branch = require('metalsmith-branch'),
    permalinks = require('metalsmith-permalinks'),
    sass = require('metalsmith-sass'),
    concat = require('metalsmith-concat'),
    uglify = require('metalsmith-uglify'),
    sitemap = require('metalsmith-mapsite'),
    filenames = require('metalsmith-filenames'),
    inPlace = require('metalsmith-in-place'),
    redirect = require('metalsmith-redirect'),
    browserSync = require('metalsmith-browser-sync');

var site = metalsmith(__dirname)

  // Metadata
  .metadata({
    site: {
      url: 'http://studio.thesimcoes.net',
      year: new Date().getFullYear()
    }
  })

  // Metalsmith
  .source('./src')
  .destination('./build')

  // CSS
  .use(sass())

  // JS
  .use(uglify())
  .use(concat({
    files: [
      'js/jquery.min.js',
      'js/index.min.js',
    ],
    output: 'js/bundle.js'
  }))

  // Templates
  .use(filenames())
  .use(branch('**/*.html')
    .use(inPlace({
      engine: 'swig',
      basedir: './templates/',
      partials: 'partials'
    }))
  )
  .use(branch(['!index.html', '/']).use(permalinks({
    relative: false
  })))

  // Redirects
  .use(redirect({
    '/404.html': '/?status=404'
  }))

  // BrowserSync it up!
  if (process.env.NODE_ENV !== 'production') {
    site = site
      .use(browserSync({
        server : 'build',
        files  : [
          'src/css/*.scss',
          'src/js/*.js',
          'src/**/*.html',
          'templates/**/*.html',
          'src/img/**/*.*',
          'src/media/**/*.*'
        ]
      }))
  }

  // Sitemap
  if (process.env.NODE_ENV == 'production') {
    site = site
      .use(sitemap({
        hostname: 'http://studio.thesimcoes.net',
        changefreq: 'weekly',
        omitExtension: true,
        omitIndex: true,
        lastmod: new Date()
      }))
  }

  // Errors
  site.build(function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Site build complete!');
    }
  }
);
