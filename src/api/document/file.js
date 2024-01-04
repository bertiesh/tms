import request from '@/router/axios';
// 获取文档合集
export const getDocumentList= (data) => request({
 
  url: '/api/admin/files/collections',
  method: 'get',
  params:data
});
// 新增文档合集
export const addDocument= (data) => request({
 
    url: '/api/admin/files/collections',
    method: 'post',
    data
  });
  // 删除文档合集
  export const deleteDocument= (id) => request({
 
    url: `/api/admin/files/collections/${id}`,
    method: 'delete',
  });