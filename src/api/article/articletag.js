import request from '@/router/axios';
// 获取文章标签
export const getArticleTags = (data) => request({
 
  url: '/api/admin/tags',
  method: 'get',
  params:data
});
// 增加和编辑文章标签
export const addArticleTag = (data) => request({
 
    url: '/api/admin/tags',
    method: 'post',
    data
  });
  // 删除文章标签
export const deleteArticleTag = (data) => request({
 
    url: '/api/admin/tags',
    method: 'delete',
    data
  });
