import request from '@/router/axios';
export const getMenuTree = () => request({
    url: '/api/admin/menus',
    method: 'get'
  });
  // 添加用户角色
export const  addUserRole = (data) => request({
    url: '/api/admin/role',
    method: 'post',
    data
  });
    //编辑用户角色
export const  updataUserRole = (data) => request({
    url: '/api/admin/role',
    method: 'post',
    data
  });
  //删除用户角色
export const  deleteUserRole = (data) => request({
    url: '/api/admin/roles',
    method: 'delete',
    data
  });
  // 根据角色获取对应的菜单树
export const getRoleTree = () => request({
    url: '/api/admin/roles',
    method: 'get',
  });
  // 设置角色菜单权限
export const setRole = ( data) => request({
    url: '/api/admin/role',
    method: 'post',
    data
  });
    // 获取角色接口权限list
export const getRoleResourcesList = () => request({
  url: '/api/admin/role/resources',
  method: 'get',
});