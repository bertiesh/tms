import request from '@/router/axios';
// 获取题目项目
export const getProjectsList = (data) => {
  return request({
    url: '/api/admin/projects',
    method: 'get',
    params:data
  })
}
// 根据id获取题目项目
export const getProjectById = (id) => {
  return request({
    url: `/api/admin/project/${id}/info`,
    method: 'get',
  })
}
// 上传题目项目
export const addProjects = (data) => {
  return request({
    url: '/api/admin/projects',
    method: 'post',
    data
  })
}
// 根据Id获取项目做过的记录
export const getProjectAnalyse = (id) => {
  return request({
    url: `/api/admin/project/${id}/analysis`,
    method: 'get',
  })
}