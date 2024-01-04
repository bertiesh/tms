import request from '@/router/axios';
// 获取所有链接
export const getLinksList = (data) => {
  return request({
    url: '/api/admin/links',
    method: 'get',
    params:data
  })
}
// 物理删除删除题目列表
export const deleteLink = (data) => {
    return request({
      url: '/api/admin/links',
      method: 'delete',
      data
    })
  }
  // 上传链接
  export const addLink = (data) => {
    return request({
      url: '/api/admin/links',
      method: 'post',
      data
    })
  }