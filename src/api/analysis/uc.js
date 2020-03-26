import request from '@/utils/request'
const querystring = require('querystring');

//用户登录分析
export function getUserLoginToday(data) {
  return request({
    url: 'bi/analysis/today',
    method: 'get',
    params:data
  })
}

//用户登录分析
export function getUserLoginDate(data) {
  return request({
    url: 'bi/analysis/date',
    method: 'get',
    params:data
  })
}


//运维数据中心
export function getMaintenanceToday(data) {
  return request({
    url: 'bi/memcpu/today',
    method: 'get',
    params:data
  })
}

//运维数据中心
export function getMaintenanceDate(data) {
  return request({
    url: 'bi/memcpu/date',
    method: 'get',
    params:data
  })
}

