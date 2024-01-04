import request from '@/router/axios';
// 获取文章
export const getArticleList = (data) => request({
 
  url: '/api/admin/articles',
  method: 'get',
  params:data
});
// 删除文章
export const deleteArticle= (id) => request({
 
  url: '/api/admin/articles',
  method: 'delete',
  data:[id]
});
// 禁用文章
export const disableArticle= (data) => request({
 
  url: '/api/admin/articles',
  method: 'put',
  data
});
//根据ID搜索文章
export const getArticleById= (id) => request({
 
  url: `/api/admin/articles/${id}`,
  method: 'get',
});
//审核文章
export const checkArticle= (data) => request({
 
  url: `/api/admin/articles/review`,
  method: 'put',
  data
});
//管理员备份文章至hdfs
export const backupArticleToHdfs= (data) => request({
 
  url: '/api/admin/articles/export',
  method: 'post',
  data
});