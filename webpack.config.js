module.exports = {
  
  entry: './src/main.js',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/i,
        use: ['css-loader'],
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', "css"]
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './'
  }
};