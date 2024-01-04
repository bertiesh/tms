import request from '@/router/axios';
// 获取文章分类
export const getArticleClass = (data) => request({
 
  url: '/api/admin/categories',
  method: 'get',
  params:data
});
// 增加和编辑文章分类
export const addArticleClass = (data) => request({
 
    url: '/api/admin/categories',
    method: 'post',
    data
  });
  // 删除文章分类
export const deleteArticleClass = (data) => request({
 
    url: '/api/admin/categories',
    method: 'delete',
    data
  });