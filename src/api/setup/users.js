import request from '@/router/axios';
export const getList = (size, current) => {
  return request({
    url: '/api/admin/users',
    method: 'get',
    params: {
      current,
      size,
    }
  })
}
// 封禁用户
export const banUser = (id,isDisable) => {
    return request({
      url: '/api/admin/users/disable',
      method: 'put',
      data: {
        id,isDisable
      }
    })
  }
  // 搜索
export const getUserByname = (data) => {
    return request({
      url: '/api/admin/users',
      method: 'get',
      params: data
    })
  }
   // 修改个人信息
export const update = (data) => {
  return request({
    url: '/api/users/info',
    method: 'put',
    data
  })
}
// 修改密码
export const updatePassword = (data) => {
  return request({
    url: '/api/admin/users/password',
    method: 'put',
    data
  })
}
// 管理员修改用户昵称和用户角色
export const updateUserMsg = (data) => {
  return request({
    url: '/api/admin/users/role',
    method: 'put',
    data
  })
}