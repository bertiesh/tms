import request from '@/router/axios';
// 获取常见问题
export const getHelpList = (data) => {
  return request({
    url: '/api/admin/helps',
    method: 'get',
    params:data
  })
}
// 物理删除删除题目列表
export const deleteHelp = (data) => {
    return request({
      url: '/api/admin/helps',
      method: 'delete',
      data
    })
  }
  // 上传题目列表
  export const addHelp = (data) => {
    return request({
      url: '/api/admin/helps',
      method: 'post',
      data
    })
  }