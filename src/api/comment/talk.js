import request from '@/router/axios';
// 获取动态评论
export const getUserTalks = (size,current) => request({
 
  url: '/api/admin/comments',
  method: 'get',
  params:{
    size,current,
    type:3
  }
});
// 获取文章评论
export const getArticleTalks = (size,current) => request({
 
  url: '/api/admin/comments',
  method: 'get',
  params:{
    size,current,
    type:1
  }
});
// 删除
export const deleteUserTalk = (data) => request({
 
  url: '/api/admin/comments',
  method: 'delete',
  data
});
// 根据id查询
export const getTalkById = (data) => request({
  url: '/api/comments',
  method: 'get',
  params:data
});
// 审核评论
export const reviewTalk = (data) => request({
  url: '/api/admin/comments/review',
  method: 'put',
  data
});