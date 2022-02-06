module.exports = {
  //...
  resolve: {
    fallback: {
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      crypto: false,
      "crypto-browserify": false,
      os: false,
      stream: false, //if you want to use this module also don't forget npm i crypto-browserify
    },
  },
};
