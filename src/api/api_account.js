import axios from 'axios';

let base = 'http://localhost:8080/api.fenggese.com/manage/v1';  // 本地开发时的地址

const qs = require('qs');

// ******************* 登录 ****************************
// 设置有时间限制的键值对 exp为过期时间毫秒
export const setTimeStorage = (key, value, exp) => {
  let curTime = new Date().getTime();
  localStorage.setItem(key, JSON.stringify({data: value, time: curTime, expire: exp}));
};

// 返回localStorage中的值
export const getTimeStorage = (key) => {
  let data = localStorage.getItem(key);
  if(data === null) {
    return null
  }
  let dataObj = JSON.parse(data);

  if (new Date().getTime() - dataObj.time > dataObj.expire) {
    localStorage.removeItem(key);
    return null
  }else{
    return dataObj.data;
  }
};

// 登录
export const api_post_login = (account, password) => {
  return axios({
    method: "POST",
    url: `${base}/user/login`,
    data:
      qs.stringify({
        account: account,
        password: password
      }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(
    res => res.data
  );
};


// 查询菜单列表
export const api_get_menus = account => {
  return axios.get(`${base}/access/get_menus`, {
    params: {account: account}
  })
    .then(res => res.data);
};

// ******************* 权限 ****************************
// 添加权限
export const api_post_access = access => {
  return axios({
    method: "POST",
    url: `${base}/access/add`,
    data:
      qs.stringify({
        code: access.code,
        name: access.name
      }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(
    res => res.data
  );
};

// 删除权限
export const api_delete_access = code => {
  return axios({
    method: "DELETE",
    url: `${base}/access/delete`,
    data: {
        code: code
      },
    headers: {
      "Content-Type": "application/json"
    }
  }).then(
    res => res.data
  );
};

// 查询权限列表
export const api_post_access_list = (num=1, size=100) => {
  return axios({
    method: "POST",
    url: `${base}/access/list`,
    data:
      qs.stringify({
        page_number: num,
        page_size: size
      }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(
    res => res.data
  );
};

// ******************* 角色 ****************************
// 添加角色
export const api_post_role = name => {
  return axios({
    method: "POST",
    url: `${base}/role/add`,
    data:
      qs.stringify({
        name: name
      }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(
    res => res.data
  );
};

// 查询角色列表
export const api_post_role_list = (num=1, size=100) => {
  return axios({
    method: "POST",
    url: `${base}/role/list`,
    data:
      qs.stringify({
        page_number: num,
        page_size: size
      }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(
    res => res.data
  );
};


// 查询角色的权限列表
export const api_get_role_accesses = role_id => {
  return axios.get(`${base}/role/query_access`, {
    params: {role_id: role_id}
  })
    .then(res => res.data);
};


// 为角色绑定权限
export const api_post_bind_access = (role_id, access_id) => {
  return axios({
    method: "POST",
    url: `${base}/role/bind`,
    data:
      qs.stringify({
        role_id: role_id,
        access_id: access_id
      }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(
    res => res.data
  );
};

// 为角色解除绑定权限
export const api_post_unbind_access = (role_id, access_id) => {
  return axios({
    method: "POST",
    url: `${base}/role/unbind`,
    data:
      qs.stringify({
        role_id: role_id,
        access_id: access_id
      }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(
    res => res.data
  );
};

// 删除角色
export const api_delete_role = role => {
  return axios({
    method: "DELETE",
    url: `${base}/role/delete`,
    data: {
      id: parseInt(role.id)
    },
    headers: {
      "Content-Type": "application/json"
    }
  }).then(
    res => res.data
  );
};


// ******************* 账号 ****************************
// 添加账号
export const api_post_account = account => {
  return axios({
    method: "POST",
    url: `${base}/account/add`,
    data:
      qs.stringify({
        user_name: account.user_name,
        login_name: account.login_name,
        login_pwd: account.login_pwd,
        role_id: account.role_id,
      }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(
    res => res.data
  );
};

// 查询账号列表
export const api_post_account_list = (num=1, size=100) => {
  return axios({
    method: "POST",
    url: `${base}/account/list`,
    data:
      qs.stringify({
        page_number: num,
        page_size: size
      }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(
    res => res.data
  );
};

// 删除账号
export const api_delete_account = account => {
  return axios({
    method: "DELETE",
    url: `${base}/account/delete`,
    data: {
      id: parseInt(account.id)
    },
    headers: {
      "Content-Type": "application/json"
    }
  }).then(
    res => res.data
  );
};

// 查询账号的权限列表
export const api_post_account_access = login_name => {
  return axios({
    method: "POST",
    url: `${base}/account/access_list`,
    data:
      qs.stringify({
        login_name: login_name,
      }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(
    res => res.data
  );
};

// 根据账号获得菜单
export const api_post_account_menus = login_name => {
  return axios({
    method: "POST",
    url: `${base}/account/menus_list`,
    data:
      qs.stringify({
        login_name: login_name,
      }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(
    res => res.data
  );
};
