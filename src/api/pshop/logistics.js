import request from '@/router/axios';
// 获取所有物流信息
export const getLogisticsList= (data) => request({
  url: '/api/admin/freight',
  method: 'get',
  params:data,
});