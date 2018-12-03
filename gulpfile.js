const config = require('./config.js');

const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const runSequence = require('run-sequence');
const through = require('through2');

const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');

const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');

const browserify = require('browserify');
const watchify = require('watchify');

const source = require('vinyl-source-stream');
const extend = require('extend');
const parseArgs = require('minimist');

// Broswerify opts
const customOpts = {
  entries: [config.input.js],
  debug: true
};

let browserS;

const envConf = extend({ env: process.env.NODE_ENV }, parseArgs(process.argv.slice(2)));

// Dev env
gulp.task('set-dev-node-env', () => {
  process.env.NODE_ENV = 'DEV';
  envConf.env = 'DEV';
  return envConf.env;
});

// Prod env
gulp.task('set-prod-node-env', () => {
  envConf.env = 'PROD';
  process.env.NODE_ENV = 'PROD';
  return envConf.env;
});

// Bundle dev
function bundleDev(b) {
  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest(config.output.dev.js))
    .pipe(through.obj((file, enc, cb) => {
      browserS.reload();
      cb(null, file);
    }));
}

// Bundle dist
function bundleDist(b) {
  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify().on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
      this.emit('end');
    }))
    .pipe(gulp.dest(config.output.dist.js));
}

// Watchify
gulp.task('watchify', () => {
  const b = watchify(browserify(customOpts)).transform('babelify', { presets: ['es2015'] });
  b.on('log', gutil.log);
  b.on('update', () => {
    bundleDev(b);
  });
  bundleDev(b);
});

// Browserify
gulp.task('browserify', () => {
  const b = browserify(customOpts).transform('babelify', { presets: ['es2015'] });
  b.on('log', gutil.log);
  b.on('update', () => {
    bundleDist(b);
  });
  bundleDist(b);
});

// Watch SASS.
gulp.task('sass', () =>
  gulp.src(config.input.scss)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gutil.env.type === 'DEV' ? browserS.stream() : gutil.noop())
    .pipe(gulp.dest(envConf.env === 'DEV' ? config.output.dev.scss : config.output.dist.scss))
);

// Clean tmp or dist
gulp.task('clean', () =>
  gulp.src(envConf.env === 'DEV' ? config.base : config.dist, { read: false })
    .pipe(clean())
);

// Dev Server
gulp.task('browserSync', () => {
  browserS = browserSync.create();
  browserS.init({
    server: {
      baseDir: config.dist
    },
    ghostMode: false,
    open: false,
    serveStatic: [{
      route: '',
      dir: config.static
    }]
  });
});

// Copy Static files
gulp.task('copyStatic', () =>
  gulp.src([`${config.static}/**/*`, `${config.static}/**/.*`])
    .pipe(gulp.dest(config.dist))
);


// Copy Static files
gulp.task('copyMainProcess', () =>
  gulp.src(['package.json'])
    .pipe(gulp.dest(config.dist))
);

// JS Lint
gulp.task('eslint', () =>
  gulp.src([`${config.src}/**/*.js`])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

// Stylelint
gulp.task('stylelint', () =>
  gulp.src(`${config.src}/**/*.scss`).pipe(stylelint({
    reporters: [
      { formatter: 'string', console: true }
    ]
  }))
);


// Global watch devserver
gulp.task('watch', ['set-dev-node-env'], () => {
  runSequence('clean', 'browserSync', 'copyStatic', ['sass', 'watchify'], () => {
    gulp.watch(['src/style.scss'], ['sass']);
    // gulp.watch(['src/**/*.js'], ['browserify', browserS.reload]);
    gulp.watch([`${config.static}/**/*`], ['copyStatic', browserS.reload]);
  });
});

// Dist
gulp.task('dist', ['set-prod-node-env'], () => {
  runSequence('clean', 'copyMainProcess', 'copyStatic', ['sass', 'browserify']);
});

// Default
gulp.task('default', ['watch']);
