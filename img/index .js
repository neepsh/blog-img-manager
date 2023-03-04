const isProduction = process.env.NODE_ENV === 'production';
const cdn = {
  css: [],
  js: [
    'https://cdn.jsdelivr.net/npm/vue@2.6.11',
    'https://unpkg.com/vue-router@2.7.0',
    'https://unpkg.com/vuex@3.4.0',
    'https://unpkg.com/three@0.140.0/build/three.js'
  ]
}

module.exports = {
  devServer: {
    host: "0.0.0.0",
    hot: true,
    port: 5443,
    disableHostCheck: true,
  },
  css: { extract: false },

  configureWebpack: config => {
    if (isProduction) {
      // 用cdn方式引入,分离第三方插件
      config.externals = {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': "Vuex",
        'three': "THREE",
      }

      config.optimization.splitChunks = {
        cacheGroups: { // 缓存组，将所有加载模块放在缓存里面一起分割打包
          vendors: { // 自定义打包模块
            name: 'chunk-vendors',// 打包后的文件名
            test: /[\\/]node_modules[\\/]/, // 匹配对应文件
            priority: 1, // 优先级，先打包到哪个组里面，值越大，优先级越高
            // initial: 对于匹配文件，非动态模块打包进该vendor,动态模块优化打包
            // async: 对于匹配文件，动态模块打包进该vendor,非动态模块不进行优化打包
            // all: 匹配文件无论是否动态模块，都打包进该vendor
            chunks: 'all',
            enforce: true, // true/false。为true时，忽略minSize，minChunks
            reuseExistingChunk: true,
          },
          base: {
            name: 'chunk-editor',
            // test: /[\\/]node_modules[\\/](element-ui|vue)[\\/]/,
            test: /[\\/]node_modules[\\/](mavon-editor)[\\/]/,
            priority: 2,
            chunks: 'all',
            enforce: true,
            reuseExistingChunk: true,
          },

        },
      }
    }
  },
  chainWebpack: config => {
    if (isProduction) {
      config.plugin('html')
        .tap(args => {
          args[0].cdn = cdn;
          return args;
        })
    }
  }
}
