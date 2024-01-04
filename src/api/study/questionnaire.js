import request from '@/router/axios';
// 获取题目模板
export const uploadPicture = (file) => {
  return request({
    url: '/api/admin/questions/images',
    method: 'post',
    data:{
      file
    },
    headers: {
      // 表示上传的是文件,而不是普通的表单数据
      'Content-Type': 'multipart/form-data'
    }
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