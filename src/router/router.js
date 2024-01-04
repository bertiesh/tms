import Vue from 'vue'
import VueRouter from 'vue-router'
import PageRouter from './page'
import ViewsRouter from './views'
import AvueRouter from './avue-router'
import i18n from '@/lang'
import Store from '../store/';
Vue.use(VueRouter)

// 获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
// 修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


const router = new VueRouter({
})
AvueRouter.install(Vue, router, Store, i18n);
// 解决刷新路由数据丢失问题
router.$avueRouter.formatRoutes(Store.state.user.menu, true, 6);
// 解决换人登录时路由不刷新问题
router.resetRouter = () => {
  const createRouter = new VueRouter({
    });
  // 用初始化的matcher替换当前router的matcher
  [...PageRouter, ...ViewsRouter].forEach(element => {
      createRouter.addRoute(element)
    });
  router.matcher = createRouter.matcher
}
[...PageRouter, ...ViewsRouter].forEach(element => {
  router.addRoute(element)
});
export default router
