import request from '@/router/axios';
// 获取
export const getUserTalks = (size,current) => request({
 
  url: '/api/admin/talks',
  method: 'get',
  params:{
    size,current
  }
});
// 删除
export const deleteUserTalk = (data) => request({
 
  url: '/api/admin/talks',
  method: 'delete',
  data
});
// 根据id查询
export const getTalkById = (id) => request({
  url: `/api/admin/talks/${id}`,
  method: 'get',
});