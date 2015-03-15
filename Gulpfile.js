var gulp = require('gulp'),
    plug = require('gulp-load-plugins')(),
    pkg = require('./package.json'),
    del = require('del'),
    merge = require('merge-stream'),
    spawn = require('child_process').spawn

    TARGET = './phonegap/www';

/*
  library CSS
 */
gulp.task('css:lib', ['fonts'], function() {

  return gulp.src([
      './app/styles/bootstrap.less',
      './bower_components/angular/angular-csp.css',
      './bower_components/angular-motion/dist/angular-motion.min.css',
      './bower_components/font-awesome/css/font-awesome.min.css'
    ])
    .pipe(plug.if('*.less', plug.less()))
    .pipe(plug.concat('lib.css'))
    .pipe(gulp.dest(TARGET + '/assets/bundle'));
});


/*
  fonts
 */
gulp.task('fonts', function() {
  return gulp.src([
      './app/styles/fonts/*',
      './bower_components/font-awesome/fonts/*'
    ])
    .pipe(gulp.dest(TARGET + '/assets/fonts'));
});


/*
  application CSS
 */
gulp.task('css:app', function() {
  return gulp.src([
      './app/styles/common.less',
      './app/styles/themes/*.less',
      './app/directives/**/*.{less,css}',
      './app/features/**/*.{less,css}'
    ])
    .pipe(plug.if('*.less', plug.less()))
    .pipe(plug.concat('app.css'))
    .pipe(
      plug.autoprefixer(
        [ 'iOS >= 7', 'Android >= 4', 'last 2 Chrome versions' ],
        { cascade:true }
      )
    )
    .pipe(gulp.dest(TARGET + '/assets/bundle'));
});



/*
  library javascript
 */
gulp.task('js:lib', function() {
  return gulp.src([
      './bower_components/angular/angular.js',

      './bower_components/angular-touch/angular-touch.js',
      './bower_components/angular-sanitize/angular-sanitize.js',
      './bower_components/angular-animate/angular-animate.js',
      './bower_components/angular-resource/angular-resource.js',

      './bower_components/angular-ui-router/release/angular-ui-router.js',

      './bower_components/angular-strap/dist/modules/dimensions.js',
      // './bower_components/angular-strap/dist/modules/button.js',
      // './bower_components/angular-strap/dist/modules/tab.js',
      // './bower_components/angular-strap/dist/modules/tab.tpl.js',
      // './bower_components/angular-strap/dist/modules/tooltip.js',
      // './bower_components/angular-strap/dist/modules/tooltip.tpl.js',
      // './bower_components/angular-strap/dist/modules/dropdown.js',
      // './bower_components/angular-strap/dist/modules/dropdown.tpl.js',
      './bower_components/angular-strap/dist/modules/modal.js',
      './bower_components/angular-strap/dist/modules/modal.tpl.js',
      './bower_components/angular-strap/dist/modules/alert.js',
      './bower_components/angular-strap/dist/modules/alert.tpl.js',
      // './bower_components/angular-strap/dist/modules/popover.js',
      // './bower_components/angular-strap/dist/modules/popover.tpl.js',
      // './bower_components/angular-strap/dist/modules/collapse.js',
      // './bower_components/angular-strap/dist/modules/parse-options.js',
      // './bower_components/angular-strap/dist/modules/typeahead.js',
      // './bower_components/angular-strap/dist/modules/typeahead.tpl.js',
      // './bower_components/angular-strap/dist/modules/select.js',
      // './bower_components/angular-strap/dist/modules/select.tpl.js',

      './bower_components/ngstorage/ngStorage.js'


    ])
    .pipe(plug.concat('lib.js'))
    .pipe(gulp.dest(TARGET + '/assets/bundle'));
});



/*
  application javascript
 */
gulp.task('js:app', function() {
  var PKG = JSON.stringify({
    name: pkg.name,
    v: pkg.version
  });
  return gulp.src([
      './app/main.js',
      './app/features/*/module.js',
      './app/**/*.js',
      '!./app/**/*-test.js'
    ])
    .pipe(plug.ngAnnotate())
    .pipe(plug.wrapper({
       header: '\n(function (PKG){ /* ${filename} */\n',
       footer: '\n})('+PKG+');\n'
    }))
    .pipe(plug.concat('app.js'))
    .pipe(gulp.dest(TARGET + '/assets/bundle'));
});



/*
  images
  TODO: imgmin?
 */
gulp.task('img', function() {
  return gulp.src('./app/styles/img/**/*')
    .pipe(gulp.dest(TARGET + '/assets/img'));
});




/*
  template cache
 */
gulp.task('tpl', function() {
  return merge(

    gulp.src([
      './app/directives/**/*.html'
    ])
      .pipe(plug.angularTemplatecache({
        module: pkg.name + '.commons'
      })),

    gulp.src([
      './app/features/home/home.html'
    ])
      .pipe(plug.angularTemplatecache({
        module: pkg.name + '.features',
        base: __dirname + '/app',
        root: '/assets/'
      }))

  )
    .pipe(plug.concat('tpl.js'))
    .pipe(gulp.dest(TARGET + '/assets/bundle'));
});



/*
  Markup
 */
gulp.task('html:partials', function() {
  return gulp.src('./app/features/**/*.html')
      .pipe(gulp.dest(TARGET + '/assets/features'));
});

gulp.task('html:main', function() {
  return gulp.src('./app/*.html')
      .pipe(gulp.dest(TARGET));
});

gulp.task('html', ['html:main', 'html:partials']);





/*
  JS hint
 */
gulp.task('lint', function() {
  return gulp.src(['./app/**/*.js', './server/*.js'])
    .pipe(plug.jshint())
    .pipe(plug.jshint.reporter())
    .pipe(plug.jshint.reporter('fail'));
});
gulp.task('jshint', ['lint']);
gulp.task('hint', ['lint']);




/*
  clean dist
 */
gulp.task('clean', function(cb) {
  del(['./phonegap/www/*'], cb);
});


/*
  minification
 */
gulp.task('js:minify', ['js'], function() {
  return gulp.src(TARGET + '/assets/bundle/{app,lib}.js')
    .pipe(plug.uglify())
    .pipe(gulp.dest(TARGET + '/assets/bundle'));
});

gulp.task('css:minify', ['css'], function() {
  return gulp.src(TARGET + '/assets/bundle/*.css')
    .pipe(plug.minifyCss({keepBreaks:true}))
    .pipe(gulp.dest(TARGET + '/assets/bundle'));
});

gulp.task('minify', ['js:minify', 'css:minify']);




/*
  rev'd assets
 */

gulp.task('rev:manifest', ['minify', 'tpl'], function() {
  return gulp.src([TARGET + '/assets/bundle/*'])
    .pipe(plug.rev())
    .pipe(plug.size({showFiles:true, gzip:true, total:true}))
    .pipe(gulp.dest(TARGET + '/assets/bundle'))  // write rev'd assets to build dir

    .pipe(plug.rev.manifest({path:'manifest.json'}))
    .pipe(gulp.dest(TARGET + '/assets/bundle')); // write manifest

});
gulp.task('rev:replace', ['html:main', 'rev:manifest'], function() {
  var rev = require(TARGET + '/assets/bundle/manifest.json'),
      out = gulp.src(TARGET + '/*.html'),
      p = '/assets/bundle/';
  for (var f in rev) {
    out = out.pipe(plug.replace(p+f, p+rev[f]));
  };
  return out.pipe(gulp.dest(TARGET));
});



/*
  alias tasks
 */
gulp.task('lib', ['js:lib', 'css:lib']);
gulp.task('app', ['js:app', 'css:app']);
gulp.task('js', ['js:lib', 'js:app']);
gulp.task('css', ['css:lib', 'css:app']);
gulp.task('style', ['css']);

gulp.task('build', ['js', 'css', 'img', 'tpl', 'html']);
gulp.task('distribute', ['build', 'rev:replace']);

gulp.task('default', ['lint', 'build']);



/*
  watch
 */
gulp.task('watch', ['build'], function() {

  gulp.watch(['./app/**/*.js', '!./app/**/*-test.js'], ['js:app']);
  gulp.watch('./app/**/*.{less,css}', ['css']);
  gulp.watch(['./app/directives/**/*.html', './app/features/home/home.html'], ['tpl']);
  gulp.watch('./app/features/**/*.html', ['html:partials']);
  gulp.watch('./app/img/**/*', ['img']);

});


/*
  develop
 */
gulp.task('develop', ['watch'], function() {

  var p = start(),
      t = null;

  gulp.watch('./phonegap/www/**/*', function() {
    clearTimeout(t);
    t = setTimeout(function() {
      plug.util.log(plug.util.colors.green('Restart!'));
      p.on('exit', function () {
        p = start();
      });
      p.kill('SIGTERM');
    }, 500); // debounced
  });

  function start () {
    var child = spawn( "node",
      ["../node_modules/cordova/bin/cordova", "serve"],
      { cwd: process.cwd()+'/phonegap'}
    );
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
      data.split('\n').forEach(function (line) {
        line && plug.util.log(plug.util.colors.blue(line));
      });
    });
    return child;
  }

});


