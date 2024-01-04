import request from '@/router/axios';
// 获取网站配置
export const getConfitList = () => {
  return request({
    url: '/api/admin/website/config',
    method: 'get',
  })
}
// 更新网站配置
export const updateConfitList = (data) => {
  return request({
    url: '/api/admin/website/config',
    method: 'put',
    data
  })
}