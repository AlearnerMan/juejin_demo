// const HtmlWebpackPlugin = require("html-webpack-plugin");
// console.log(process.env.NODE_ENV);s
module.exports = {
  publicPath:
    process.env.NODE_ENV === "production" ? "/production-sub-path/" : "/",
  //   css: {
  //     requireModuleExtension: false
  //   },
  //   devServer: {
  //     historyAPiFallback: true
  //   },
  productionSourceMap: false,
  // 去掉文件名中的hash
  filenameHashing: false,
  configureWebpack: config => {
    // config 为webpack的配置项
    // console.log(config.plugins)
    // config.plugins.push(
    //     new HtmlWebpackPlugin({
    //         title:"aaaa",
    //         template:"public/index.html"
    //     })
    // )
    // console.log('HtmlWebpackPlugin',config.plugins[1])
  },
  chainWebpack: config => {
    // console.log(config);
    // config
    //     .plugin('html')
    //         .use(HtmlWebpackPlugin)
    //         .tap(options=>{
    //             options.title = "aaaa"
    //             return options;
    //         })
    // console.log('HtmlWebpackPlugin2',config)
    // config.plugin('prefetch').tap(options => {
    //     console.log(options)
    //     options[0].fileBlacklist = options[0].fileBlacklist || []
    //     options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
    //     return options
    //   })
    // console.log("module", config.module);
  },

  pluginOptions: {
    // "HtmlWebpackPlugin":{
    //     title:"aaaa"
    // }
  }
  // Invalid options in vue.config.js: child "chainWebpack" fails because ["chainWebpack" must be a Functio
  // chainWebpack:{
  //     plugins:[
  //         new HtmlWebpackPlugin({
  //             title:"123aaa"
  //         })
  //     ]
  // }
};
