import request from '@/utils/request'
const querystring = require('querystring');

//查询装备故障列表
export function equipFault(data) {
    return request({
        url: 'cms/equipfault/getFaultList',
        method: 'post',
        data
    })
}

//装备常见问题添加
export function equipProblem(data) {
    return request({
        url: 'cms/equipfault/addFaultQuestion',
        method: 'post',
        data
    })
}

//装备故障删除
export function equipDelete(data) {
    return request({
        url: 'cms/equipfault/delFault',
        method: 'post',
        data: querystring.stringify({
            emFaultId: data
        })
    })
}

//装备故障添加
export function equipFaultAdd(data) {
    return request({
        url: 'cms/equipfault/addFault',
        method: 'post',
        data
    })
}

//装备故障编辑
export function equipFaultEdit(data) {
    return request({
        url: 'cms/equipfault/updateFault',
        method: 'post',
        data
    })
}

//装备问题方案删除
export function equipProblemDelete(data) {
    return request({
        url: 'cms/equipfault/delFaultQuestion',
        method: 'post',
        data: querystring.stringify(data)
    })
}

//装备问题编辑
export function equipProblemEdit(data) {
    return request({
        url: 'cms/equipfault/updateFaultQuestion',
        method: 'post',
        data
    })
}

//设备类型查询
export function equipmentType(data) {
    return request({
        url: 'cms/emType/findTypeList',
        method: 'post',
        data
    })
}

//设备类型修改
export function equipmodify(data) {
    return request({
        url: 'cms/Device/update',
        method: 'post',
        data
    })
}

//设备类型的更新
export function equipUpdate(data) {
    return request({
        url: 'cms/emType/update',
        method: 'post',
        data
    })
}

//设备类型添加
export function equiptypeAdd(data) {
    return request({
        url: 'cms/emType/save',
        method: 'post',
        data
    })
}

//标签信息查询
export function labelQuery(data) {
    return request({
        url: 'cms/emType/findAllOfTag',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data
    })
}

//标签管理
export function labelManage(data) {
    return request({
        url: 'cms/emType/mgeTag',
        method: 'post',
        data
    })
}

//设备删除
export function labelDel(data) {
    return request({
        url: 'cms/Device/del',
        method: 'post',
        data: querystring.stringify(data)
    })
}

//筛选条件
export function screen(data) {
    return request({
        url: 'cms/emType/getEquipCommonList',
        method: 'post',
        data
    })
}

//设备类型添加
//品牌查询
export function queryBrand(data) {
    return request({
        url: 'cms/equip/selectBrand',
        method: 'post',
        headers:{
        'Content-type': 'application/x-www-form-urlencoded'
	    },
	    data:querystring.stringify(data)
    })
}
//自定义品牌查询
//export function screen(data) {
//  return request({
//      url: 'cms/emType/getEquipCommonList',
//      method: 'post',
//      data
//  })
//}
//自定义品牌添加
export function addBrand(data) {
    return request({
        url: 'cms/equip/addBrand',
        method: 'post',
        headers:{
        	'Content-type': 'application/x-www-form-urlencoded'
	    },
	    data:querystring.stringify(data)
    })
}
//自定义品牌删除
export function delBrand(data) {
    return request({
        url: 'cms/equip/delBrand',
        method: 'post',
        data
    })
}
//故障类型查询
export function faultType(data) {
    return request({
        url: 'cms/emType/getEquipCommonList',
        method: 'post',
        data
    })
}
//标签查询
