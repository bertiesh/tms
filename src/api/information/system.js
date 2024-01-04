import request from '@/router/axios';
// 获取系统通知
export const getSystemInform= (data) => request({
  url: '/api/admin/notices',
  method: 'get',
  params:data
});
// 发布系统通知
export const addSystemInform= (data) => request({
  url: '/api/admin/messages',
  method: 'post',
  data
});
//修改系统通知
export const updateSystemInform= (data) => request({
  url: '/api/admin/notices',
  method: 'post',
  data
});