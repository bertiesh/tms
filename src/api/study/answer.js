import request from '@/router/axios';
// 根据id获取答案
export const getAnswerById = (id) => {
  return request({
    url: `/api/admin/answers/${id}`,
    method: 'get',
  })
}
// 根据id获取问题
export const getQuestionById = (id) => {
    return request({
      url: `/api/admin/questions/${id}`,
      method: 'get',
    })
  }
  // 上传答案
export const addAnswer = (data) => {
    return request({
      url: `/api/admin/answers`,
      method: 'post',
      data
    })
  }