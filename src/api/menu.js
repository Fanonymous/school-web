import request from '@/utils/request'
const querystring = require('querystring');
//admin --获得菜单
export function GenerateRoutes(roleId, schoolId, unitId, homePageId) {
const data = {
    roleId,
    schoolId,
    unitId,
    homePageId
}
return request({
    url: 'uc/authority/check',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify({roleId:roleId, schoolId:schoolId, unitId:unitId, homePageId:homePageId})
})
}


//查询子系统
export function getSubSystem() {
  return request({
    url: 'cms/HomePage/findDisplayHomePage',
    method: 'post'
  })
}

