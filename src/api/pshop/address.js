import request from '@/router/axios';
// 获取用户地址
export const getUserAddress= (data) => request({
  url: '/api/admin/address',
  method: 'get',
  params:data,
});