import request from '@/router/axios';
// 获取所有商品
export const getAllGoodsList= (data) => request({
  url: '/api/admin/spu',
  method: 'get',
  params:data,
});
// 上传商品图片
export const addGoodsImg= (file) => request({
  url: '/api/admin/talks/images',
  method: 'post',
  data:file,
    headers: {
      // 表示上传的是文件,而不是普通的表单数据
      'Content-Type': 'multipart/form-data'
    }
});
// 上传修改商品
export const addGoods= (data) => request({
  url: '/api/admin/spu',
  method: 'post',
  data
});
// 上传修改商品规格
export const addGoodsSize= (data) => request({
  url: '/api/admin/sku',
  method: 'post',
  data
});