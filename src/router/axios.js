/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'
import store from '@/store/';
import router from '@/router/router'
import { serialize } from '@/util/util'
import { getToken } from '@/util/auth'
import website from '@/config/website';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { Base64 } from 'js-base64';
// 网络请求超时
axios.defaults.timeout = 10000;
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
  showSpinner: false
});
//HTTPrequest拦截
axios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  const meta = (config.meta || {});
  const isToken = meta.isToken === false;
  config.headers['Authorization'] = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`;
  if (getToken() && !isToken) {
    config.headers['token'] = getToken() // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
  }
  //headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
    config.data = serialize(config.data);
  }
  return config
}, error => {
  return Promise.reject(error)
});
//HTTPresponse拦截

axios.interceptors.response.use(res => {
  NProgress.done();
  const config = res.config
  const status = res.data.code || 200
  const statusWhiteList = website.statusWhiteList || [];
  const message = res.data.message || '未知错误';
  //如果在白名单里则自行catch逻辑处理
  if (statusWhiteList.includes(status)) return Promise.reject(res);
  //如果是401则跳转到登录页面
  if (status === 401) {
    store.dispatch('FedLogOut').then(() => {
      router.push({ path: '/login' })
  }
    );}
  if (status == 306) {
    store.dispatch('RefreshToken')
    .then(() => {
      window.location.reload();
    });
  }
  // 如果请求为非200否者默认统一处理
  if (status !== 200) { 
    console.log("!200",res);
    if (status == 400) {
      store.dispatch('LogOut').then(() => {
        router.push({ path: '/login' })
    });
    }
    return Promise.reject(new Error(message))
  }
  return res;
}, error => {
  console.log("let me see",error);
  NProgress.done();
  return Promise.reject(new Error(error));
})

export default axios;
