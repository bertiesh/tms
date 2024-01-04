import request from '@/router/axios';
// 获取所有订单
export const getAllOrderList= (data) => request({
  url: '/api/admin/order',
  method: 'get',
  params:data,
});
// 管理订单
export const updateOrderList= (data) => request({
  url: '/api/admin/order',
  method: 'post',
  data,
});
// 根据物流id查询物流
export const getLogisticsList= (data) => request({
  url: '/api/admin/order',
  method: 'get',
  params:data,
});