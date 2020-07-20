// console.log("=======================================>");
// console.log(process.env.NODE_ENV);
module.exports = {
  // change to .tsx if necessary
  entry: './src/app.tsx',
  output: {
    // filename: './dist/bundle.js'
    filename:  process.env.NODE_ENV !== 'production' ? './dist/bundle.js':'./bundle.js'
  },
  resolve: {
    // changed from extensions: [".js", ".jsx"]
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      // changed from { test: /\.jsx?$/, use: { loader: 'babel-loader' } },
      // { test: /\.(t|j)sx?$/, use: { loader: 'awesome-typescript-loader' } },
      { test: /\.(t|j)sx?$/, use: { loader: 'ts-loader' } },
      {
        test: /\.md$/,
        use: "raw-loader"
      },      
      {
        test: /\.css$/i,
        use: [{
            loader: "style-loader"
        }, {
            loader: 'css-loader',
            options: {
                modules: true,
            }
        }]
      },
      // newline - add source-map support 
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  },
  // newline - add source-map support
  devtool: "source-map"
}
