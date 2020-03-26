import Vue from 'vue'
import VueCookie from 'vue-cookie' 
Vue.use(VueCookie)
const userType = Vue.cookie.get('userType')
let orgEntity 
let orgId 
let roleId


export function getOrgInfo(){
	if(userType != null && userType != 1){
		orgEntity = JSON.parse(localStorage.getItem('orgEntity'))
		orgId = orgEntity.orgId
		console.log(Vue.cookie.get('roleId'))
		roleId =  Vue.cookie.get('roleId')
	}
}
export function getUserId(){
	console.log(Vue.cookie.get('userId'))
	return Vue.cookie.get('userId')
}
export function getRoleId(){
	return Vue.cookie.get('roleId')
}
export function getUserType(){
	return Vue.cookie.get('userType')
}
export function getYearTerm(){
	orgEntity = JSON.parse(localStorage.getItem('orgEntity'))
	return Vue.cookie.get('roleId')
}
export function getOrgId(){
	orgEntity = JSON.parse(localStorage.getItem('orgEntity'))
	return Vue.cookie.get('orgId')
}
export function getOrgIds(){
	orgEntity = JSON.parse(localStorage.getItem('orgEntity'))
	return orgEntity.deptIds
}
export function getOrgName(){
	orgEntity = JSON.parse(localStorage.getItem('orgEntity'))
	return orgEntity.orgName
}
export function getYearTermId(){
	let yearTermData = JSON.parse(localStorage.getItem('yearTermData'))
	return yearTermData.yearTermId
}
export function getYearId(){
	let yearTermData = JSON.parse(localStorage.getItem('yearTermData'))
	return yearTermData.schoolYearId
}
export function getTermId(){
	let yearTermData = JSON.parse(localStorage.getItem('yearTermData'))
	return yearTermData.termId
}
export default {
	roleId,
	getUserId,
	userType,
    orgEntity,
    getRoleId,
    getUserType,
    getYearTerm,
    orgId,
    getOrgId,
    getOrgIds,
    getOrgName,
    getOrgInfo,
    getYearTermId,
    getYearId,
    getTermId
}