import request from '@/router/axios';
// 获取文档中的文件
export const getDocumentFile= (data) => request({
 
  url: '/api/admin/files',
  method: 'get',
  params:data
});
// // 删除文档中的文件
export const deleteDocumentFile= (data) => request({
 
    url: '/api/admin/files/delete',
    method: 'put',
    data
  });
  // // 获取文档中的文件流
export const getDocumentFileBlob= (url) => request({
 
    url: '/api/files/display',
    method: 'get',
    params:{
        filePath:url
    },
    responseType:'blob'
  });