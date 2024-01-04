import request from '@/router/axios';
// 获取直播
export const getLiveList= (data) => request({
  url: '/api/admin/lives',
  method: 'get',
  params:data
});
// 编辑新增删除直播
export const updateLiveList= (data) => request({
  url: '/api/admin/lives',
  method: 'post',
  data
});
// 获取用户列表
export const getUserList= (data) => request({
  url: '/api/admin/users',
  method: 'get',
  params:data
});