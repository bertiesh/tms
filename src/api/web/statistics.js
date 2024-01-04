import request from '@/router/axios';
// 获取所有链接
export const getStatisticsList = () => {
  return request({
    url: '/api/admin',
    method: 'get',
  })
}
// 获取在线用户
export const getOnLineUser = (data) => {
  return request({
    url: '/api/admin/users/online',
    method: 'get',
    params:data
  })
}
// 强制用户下线
export const unLineUser = (id) => {
  return request({
    url: `/api/admin/users/${id}/online`,
    method: 'delete',
  })
}
// 获取用户区域
export const getUserArea = () => {
  return request({
    url: '/api/admin/users/area',
    method: 'get',
  })
}