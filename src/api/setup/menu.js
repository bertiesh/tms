import request from '@/router/axios';
// 获取菜单树
export const getMenuList = () => {
  return request({
    url: '/api/admin/menus',
    method: 'get',
  })
}
// 添加菜单信息
export const addMenu = (data) => {
  return request({
    url: '/api/admin/menus',
    method: 'post',
    data
  })
}
//删除菜单信息
export const deleteMenu = (id) => {
  return request({
    url: `/api/admin/menus/${id}`,
    method: 'delete',
  })
}
// 通过path和name查询
export const getMenuByPath = (keywords) => {
  return request({
    url: '/api/admin/menus',
    method: 'get',
    params:{keywords}

  })
}
export const getMenuByName = (keywords) => {
  return request({
    url: '/api/admin/menus',
    method: 'get',
    params:{keywords}
  })
}

