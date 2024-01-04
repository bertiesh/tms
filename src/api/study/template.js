import request from '@/router/axios';
// 获取题目模板
export const geTemplatesList = (data) => {
  return request({
    url: '/api/admin/templates',
    method: 'get',
    params:data
  })
}
// 上传题目模板
export const addTemplates = (data) => {
  return request({
    url: '/api/admin/templates',
    method: 'post',
    data
  })
}