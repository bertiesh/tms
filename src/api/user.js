import request from '@/router/axios';
import qs from 'qs';
export const loginByUsername = ( username, password) =>request({
 
  url: '/api/login',
  method: 'post',
  headers: {
    "content-type"  : "application/x-www-form-urlencoded" 
  },
  data: 
  qs.stringify({
    username,
    password,
  })
})

export const getMenu = () => request({
  url: '/api/admin/user/menus',
  method: 'get'
});
// 退出登录
export const logout = () => request({
  url:'/api/logout',
  method: 'get'
})
// 获取个人信息
export const getUserInfo = (userInfoId) => request({
  url:'/api/',
  method: 'get',
  params:{
    userInfoId
  }
})
// 获取验证码
export const getCaptcha = () => request({
  url:'/api/captcha',
  method: 'get',
  responseType: "blob",
})
// 验证验证码
export const verifyCaptcha = (data) => request({
  url:'/api/captcha/check',
  method: 'get',
  params:data
})