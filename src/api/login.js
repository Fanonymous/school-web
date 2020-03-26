import request from '@/utils/request'
const querystring = require('querystring');
export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: 'sys/login',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify({username:username,password:password})
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

