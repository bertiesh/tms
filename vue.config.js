
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
     // 端口配置
     https: true,
     port: 8060,
    // 反向代理配置
    proxy: {
      '/api': {
        target: 'https://10.32.20.50:8898',
            changeOrigin: true,
            pathRewrite: {
                '^/api': ''
            }
      },
    }
  },
})
