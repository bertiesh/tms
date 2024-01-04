export default [{
    path: '/wel',
    redirect:'/wel/index',
    children: [{
      path: 'index',
      name: '首页',
      meta: {
        i18n: 'dashboard'
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/wel/index')
    }],
    component: () => import(/* webpackChunkName: "about" */ '@/pages/index')
  }, {
    path: '/info',
    component: () => import(/* webpackChunkName: "about" */ '@/pages/index'),
    children: [{
      path: 'index',
      name: '个人信息',
      meta: {
        i18n: 'info'
      },
      component: () =>
        import( /* webpackChunkName: "views" */ '@/views/user/info')
    }]
  },
  {
    path: '/login',
    name: '登录页',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/pages/login/index'),
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
{
    path: '/lock',
    name: '锁屏页',
    component: () =>
        import( /* webpackChunkName: "page" */ '@/pages/lock/index'),
    meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
    }
},
]