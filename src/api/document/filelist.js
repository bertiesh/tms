import request from '@/router/axios';
// 获取文档中的文件
export const getDocumentFile= (data) => request({
 
  url: '/api/admin/files',
  method: 'get',
  params:data
});
// // 删除文档中的文件
export const deleteDocumentFile= (data) => request({
 
  url: '/api/admin/files/collection',
  method: 'put',
  data
});
 //  上传文件
 export const addDocumentFileToServer = (file) => {
  return request({
    url: '/api/admin/files/collections/cover',
    method: 'post',
    data:file,
    headers: {
      // 表示上传的是文件,而不是普通的表单数据
      'Content-Type': 'multipart/form-data'
    }
  })
 }
 // // 添加文档中的文件
export const addDocumentFile= (file,id) => request({
 
  url: '/api/admin/files',
  method: 'post',
  data:{
    collectionId:id*1,
    fileUrlList:file
  }
});