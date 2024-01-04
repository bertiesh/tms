import request from '@/router/axios';
// 获取题目列表
export const getquestionsList = (data) => {
  return request({
    url: '/api/admin/questions',
    method: 'get',
    params:data
  })
}
// 获取题目列表
export const getquestionById = (id) => {
  return request({
    url: `/api/admin/questions/${id}`,
    method: 'get',
  })
}
// 物理删除删除题目列表
export const deletequestion = (data) => {
  return request({
    url: '/api/admin/questions',
    method: 'delete',
    data
  })
}
// 上传题目列表
export const addquestion = (data) => {
  return request({
    url: '/api/admin/questions',
    method: 'post',
    data
  })
}