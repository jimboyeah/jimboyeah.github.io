module.exports = {
  inlineImports: false,
  plugins: {
    // process.env.HUGO_ENVIRONMENT === 'production'? [purgecss] : [],
    'autoprefixer': {},
    'postcss-apply': {},
    'postcss-nested': {},
    // 'postcss-sass': {},
    'postcss-mixins': {},
    'postcss-import': {browsers: 'last 5 version'} ,
    'postcss-cssnext': { browsers: ['last 2 versions', '> 5%'], }
    }  
};
