import request from '@/router/axios';
// 获取所有链接
export const getResourcesList = (data) => {
  return request({
    url: '/api/admin/resources',
    method: 'get',
    params:data
  })
}
// 物理删除删除题目列表
export const deleteResource = (id) => {
    return request({
      url: `/api/admin/resources/${id}`,
      method: 'delete',
    })
  }
  // 上传链接
  export const addResource = (data) => {
    return request({
      url: '/api/admin/resources',
      method: 'post',
      data
    })
  }