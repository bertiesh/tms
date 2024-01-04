/**
 * 全局配置文件
 */
export default {
  title: "培训后台管理系统",
  indexTitle: 'Tms Admin',
  clientId: 'tms', // 客户端id
  clientSecret: 'tms_secret', // 客户端密钥
  tenantMode: false, // 是否开启租户模式
  captchaMode: false, // 是否开启验证码模式
  logo: "T",
  key: 'tms',//配置主键,目前用于存储
  lockPage: '/lock',
  tokenTime: 6000,
  //http的status默认放行不才用统一处理的,
  statusWhiteList: [],
  //配置首页不可关闭
  isFirstPage: false,
  pubKey: "02f1c734ba5016ed3128e573fcbe43130b6ee7bd75c7825ceb751a5be736f3dc88",
  fistPage: {
    label: "首页",
    value: "/wel/index",
    params: {},
    query: {},
    meta: {
      i18n: 'dashboard'
    },
    group: [],
    close: false
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: 'source',
      children: 'children',
      isAuth: true
    }
  },
  // 授权地址
  authUrl: 'http://localhost/blade-auth/oauth/render',
  // 报表设计器地址(cloud端口为8108,boot端口为80)
  reportUrl: 'http://localhost:8108/ureport',
}
