import {setToken, removeToken} from '@/util/auth'
import {setStore, getStore} from '@/util/store'
import {isURL, validatenull} from '@/util/validate'
import {deepClone} from '@/util/util'
import webiste from '@/config/website'
import {loginByUsername, getMenu, logout, refreshToken,getUserInfo} from '@/api/user'



// 用来判断是否有子菜单，有子菜单没啥变化，没有子菜单为菜单路径添加/index
function addPath(ele, first) {
  const menu = webiste.menu;
  const propsDefault = {
    label:'name',
    path:'path',
    icon:'source',//source
    children:'children'
  };
  const icon = ele[propsDefault.icon];
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;

  if (!isChild) ele[propsDefault.children] = [];

  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path] + '/index'
  } else {
    // 若为空数组则不执行forach循环
    ele[propsDefault.children].forEach(child => {
      addPath(child);
    })
  }
}
const user = {
  state: {
    userInfo: getStore({name: 'userInfo'}) || [],
    permission: getStore({name: 'permission'}) || {},
    roles: [],
    menu: getStore({name: 'menu'}) || [],
    menuAll: [],
    token: getStore({name: 'token'}) || '',
  },
  actions: {
    //根据用户名登录
    LoginByUsername({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo.username, userInfo.password).then(res => {
          const data = res.data;
          commit('SET_TOKEN', data.data.username);
          commit('SET_USER_INFO', data.data);
          commit('DEL_ALL_TAG');//设置标签tags
          commit('CLEAR_LOCK');//锁屏
          resolve(res);
        }).catch(error => {
          reject(error);
        })
      })
    },
    // 登出
    LogOut({commit}) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '');
          commit('SET_MENU', [])
          commit('SET_MENU_ALL', []);
          commit('SET_ROLES', []);
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    //注销session
    FedLogOut({commit}) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_MENU', []);
        commit('SET_MENU_ALL', []);
        commit('SET_ROLES', []);
        commit('DEL_ALL_TAG');
        commit('CLEAR_LOCK');
        removeToken()
        resolve()
      })
    },
    GetUserInfo({commit},id) {
      return new Promise((resolve, reject) => {
        getUserInfo(id).then((res) => {
          const data = res.data.data;
          resolve(data);
        }).catch(err => {
          reject(err);
        })
      })
    },

    //获取系统菜单
    GetMenu({commit, dispatch}, parentId) {
      return new Promise(resolve => {
        getMenu(parentId).then((res) => {
          const data = res.data.data
          let menu = deepClone(data);
          menu.forEach(ele => {
            addPath(ele, true);
          })
          commit('SET_MENU', menu);
          commit('SET_MENU_ALL', menu);
          resolve(menu)
        })
      })
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      setToken(token)
      state.token = token;
      setStore({name: 'token', content: state.token, type: 'session'})
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
      setStore({name: 'userInfo', content: state.userInfo})
    },
    SET_MENU_ALL: (state, menuAll) => {
      state.menuAll = menuAll
      setStore({name: 'menuAll', content: state.menuAll, type: 'session'})
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
      setStore({name: 'menu', content: state.menu, type: 'session'})
      if (validatenull(menu)) return;
      //合并动态路由去重
      let menuAll = state.menuAll
      menuAll = menuAll.concat(menu).reverse();
      let newMenu = [];
      for (let item1 of menuAll) {
        let flag = true;
        for (let item2 of newMenu) {
          if (item1.name === item2.name || item1.path === item2.path) {
            flag = false;
          }
        }
        if (flag) newMenu.push(item1);
      }
      state.menuAll = newMenu;
      setStore({name: 'menuAll', content: state.menuAll, type: 'session'})
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSION: (state, permission) => {
      let result = [];

      function getCode(list) {
        list.forEach(ele => {
          if (typeof (ele) === 'object') {
            const chiildren = ele.children;
            const code = ele.code;
            if (chiildren) {
              getCode(chiildren)
            } else {
              result.push(code);
            }
          }

        })
      }

      getCode(permission);
      state.permission = {};
      result.forEach(ele => {
        state.permission[ele] = true;
      });
      setStore({name: 'permission', content: state.permission, type: 'session'})
    },
  }

}
export default user
