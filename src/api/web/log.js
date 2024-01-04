import request from '@/router/axios';
// 获取数据库操作日志
export const getLogstList = (data) => {
  return request({
    url: '/api/admin/operation/logs',
    method: 'get',
    params:data
  })
}