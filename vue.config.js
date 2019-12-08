/*
 * @Author: akrio
 * @Date: 2019-12-07 07:30:55
 * @LastEditTime: 2019-12-08 15:37:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /image-crop/vue.config.js
 */
module.exports = {
  css: {
    sourceMap: true
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config.output.filename('[name].[hash].js').end()
    }
  }
}
