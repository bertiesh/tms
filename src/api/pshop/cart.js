import request from '@/router/axios';
// 获取用户地址
export const getUserCart= (data) => request({
  url: '/api/admin/shoppingCart',
  method: 'get',
  params:data,
});