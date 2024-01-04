import router from './router/router'
import store from './store'
import {validatenull} from '@/util/validate'
import {getToken} from '@/util/auth'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({showSpinner: false});
const lockPage = store.getters.website.lockPage; //锁屏页
router.beforeEach((to, from, next) => {
  const meta = to.meta || {};
  const isMenu = meta.menu === undefined ? to.query.menu : meta.menu;
  store.commit('SET_IS_MENU', isMenu === undefined);
  if (getToken()&& to.path !== '/login') {
    // console.log("有token不去登录页1");
    if (store.getters.isLock && to.path !== lockPage) { //如果系统激活锁屏，全部跳转到锁屏页
      // console.log("1-去锁屏页");
      next({path: lockPage})
    } else {
      //如果用户信息为空则获取用户信息，获取用户信息失败，跳转到登录页
      if (store.getters.token.length === 0) {
        store.dispatch('FedLogOut').then(() => {
          next({path: '/login'})
        })
      } else {
        const value = to.query.src || to.fullPath;
        const label = to.query.name || to.name;
        const meta = to.meta || router.$avueRouter.meta || {};
        const i18n = to.query.i18n;
        if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
          store.commit('ADD_TAG', {
            label: label,
            value: value,
            params: to.params,
            query: to.query,
            meta: (() => {
              if (!i18n) {
                return meta
              }
              return {
                i18n: i18n
              }
            })(),
            group: router.$avueRouter.group || []
          });
        }
        next()
      }
    }
  } else if (getToken()&&to.path === '/login') { //如果登录成功访问登录页跳转到主页
    // console.log("有token去登录页面转去主页");
    next({path: '/'})
  }else if (!getToken()&&to.path !== '/login'){
    // console.log("没有token不去登录页面转去登录页面");
      next('/login')
  }else {
    // 剩下最后一种 没有token 但是去 login页面 通过
    // console.log("没有token 但是去 login页面通过");
      next()
    }
})