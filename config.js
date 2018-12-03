const config = {
  base: './dist',
  src: './src',
  dist: './dist',
  static: './static',
  input: {
    scss: [
      './src/style.scss'
    ],
    js: './src/app.js',
  }
};

// OUTPUT
config.output = {
  dev: {
    scss: `${config.base}/css`,
    js: `${config.base}/js`
  },
  dist: {
    scss: `${config.dist}/css`,
    js: `${config.dist}/js`
  }
};

module.exports = config;
