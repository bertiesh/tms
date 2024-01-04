import request from '@/router/axios';
// 获取用户积分
export const getUserIntegral= (data) => request({
  url: '/api/admin/rewardPoints',
  method: 'get',
  params:data
});
// 补偿用户积分
export const addUserIntegral= (data) => request({
  url: '/api/admin/rewardPoints',
  method: 'post',
  data
});