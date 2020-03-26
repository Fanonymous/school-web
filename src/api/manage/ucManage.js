import request from '@/utils/httpRequest'
const querystring = require('querystring');

//修改密码
export function updatePassword(data){
	return request({
    url: 'uc/user/updatepwd',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//修改个人信息
export function updateUserInfo(data){
	return request({
    url: 'cms/teacherMge/userUpdate',
    method: 'post',
    data
  })
}

//子系统查询
export function queryUcSubSystem(data) {
  return request({
    url: 'cms/HomePage/findAllHomePage',
    method: 'post',
    data
  })
}
//子系统保存
export function saveUcSubSystem(data) {
  return request({
    url: 'cms/HomePage/save',
    method: 'post',
    data
  })
}
//子系统更新
export function updateUcSubSystem(data) {
  return request({
    url: 'cms/HomePage/update',
    method: 'post',
    data
  })
}

//子系统删除
export function delUcSubSystemById(data) {
  return request({
    url: 'cms/HomePage/del',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//角色查询
export function queryUcRole(data) {
  return request({
    url: 'uc/role/list',
    method: 'post',
    data
  })
}

//角色添加or更新
export function saveUcRole(data) {
  return request({
    url: 'uc/role/save',
    method: 'post',
    data
  })
}

//角色删除
export function deleteUcRole(data) {
  return request({
    url: 'uc/role/list',
    method: 'post',
    data
  })
}
//角色删除
export function deleteUcRoleById(data) {
  return request({
    url: 'uc/role/delete',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//查询已有的信息
export function queryRoleInfoAll(data){
	return request({
    url: 'uc/role/infoAll',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//根据角色Id查询角色权限
export function queryAuthByRoleId(data){
	return request({
    url: 'uc/role/beforeSave',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//策略查询
export function queryUcGroup(data) {
  return request({
    url: 'uc/group/list',
    method: 'post',
    data
  })
}
//策略添加和更新
export function saveUcGroup(data) {
  return request({
    url: 'uc/group/save',
    method: 'post',
    data
  })
}
//策略删除
export function deleteUcGroupById(data) {
  return request({
    url: 'uc/group/delete',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}


//策略中   根据用户类型查询角色
export function queryUcRolesById(data) {
  return request({
    url: 'uc/group/type',
    method: 'post',
    data
  })
}

//数据字典
export function queryUcDict(data) {
  return request({
    url: 'uc/dict/list',
    method: 'post',
    data
  })
}
//数据字典删除
export function deleteUcDictById(data) {
  return request({
    url: 'uc/dict/delete',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//数据字典添加
export function addUcDict(data){
	return request({
    url: 'uc/dict/save',
    method: 'post',
    data
  })
}

//数据字典更新
export function updateUcDict(data){
	return request({
    url: 'uc/dict/update',
    method: 'post',
    data
  })
}

//数据字典 根据类型查询所有标签
export function queryDictValueByType(data){
	return request({
    url: 'uc/dict/typeChange',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//数据字典 根据类型查询所有标签
export function queryDictAllType(){
	return request({
    url: 'uc/dict/type',
    method: 'post'
  })
}

//添加级届
export function addRemGrade(data){
	return request({
    url: 'cms/gradeMage/addRem',
    method: 'get'
  })
}

//年级查询
export function queryUcGrade(data) {
  return request({
    url: 'cms/gradeInfo/gradeSchoolTypeList',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//年级添加，编辑，删除
export function saveUcGrade(data) {
  return request({
    url: 'cms/gradeMage/add',
    method: 'post',
    data
  })
}

//超管查询所有年级
export function queryUcAllGrade() {
  return request({
    url: 'cms/gradeInfo/byTypelist',
    method: 'post'
  })
}

//科目查询
export function queryUcSubject() {
  return request({
    url: 'cms/subInfo/subGradelist',
    method: 'post'
  })
}

//科目添加和编辑
export function saveUcSubject(data) {
  return request({
    url: 'cms/subjectMge/add',
    method: 'post',
    data
  })
}

//科目删除
export function delUcSubjectById(data) {
  return request({
    url: 'cms/subjectMge/delete',
    method: 'post',
    data
  })
}

//评价元数据查询
export function queryUcAssessindex(data) {
  return request({
    url: 'cms/assessindex/query',
    method: 'post',
    data
  })
}

//评价元数据添加
export function addUcAssessindex(data) {
  return request({
    url: 'cms/assessindex/save',
    method: 'post',
    data
  })
}

//评价元数据更新
export function updateUcAssessindex(data) {
  return request({
    url: 'cms/assessindex/update',
    method: 'post',
    data
  })
}

//评价元数据删除
export function deleteUcAIndexById(data) {
  return request({
    url: 'cms/assessindex/del',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//模板查询
export function queryUcAssesstemplet(data) {
  return request({
    url: 'cms/assesstemplet/query',
    method: 'post',
    data
  })
}

//模板添加
export function addUcAssesstemplet(data) {
  return request({
    url: 'cms/assesstemplet/save',
    method: 'post',
    data
  })
}

//模板编辑
export function updateUcAssesstemplet(data) {
  return request({
    url: 'cms/assesstemplet/update',
    method: 'post',
    data
  })
}

//模板删除
export function deleteUcAssesstemplet(data) {
  return request({
    url: 'cms/assesstemplet/del',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//根据学校Id查询模板
export function queryUcAtempBySchoolId(data) {
  return request({
    url: 'cms/assesstemplet/queryItem',
    method: 'post',
    data
  })
}

//机构配置查询
export function queryUcAsstemschool(data) {
  return request({
    url: 'cms/asstemschool/query',
    method: 'post',
    data
  })
}
//机构配置添加
export function addUcAsstemschool(data) {
  return request({
    url: 'cms/asstemschool/save',
    method: 'post',
    data
  })
}

//机构配置编辑
export function updateUcAsstemschool(data) {
  return request({
    url: 'cms/asstemschool/update',
    method: 'post',
    data
  })
}

//机构配置删除
export function deleteUcAsstemschool(data) {
  return request({
    url: 'cms/asstemschool/del',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//场景查询
export function queryUcScene(data){
	return request({
    url: 'uc/scene/list',
    method: 'post',
    data
  })
}

//场景添加和编辑
export function saveUcScene(data){
	return request({
    url: 'uc/scene/save',
    method: 'post',
    data
  })
}

//场景删除根据场景Id
export function delUcSceneById(data){
	return request({
    url: 'uc/scene/del',
    method: 'post',
     headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//通知公告查询
export function queryOaNotice(data){
	return request({
    url: 'oa/notice/query',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//通知公告添加和编辑
export function saveOaNotice(data){
	return request({
    url: 'oa/notice/opt',
    method: 'post',
    data
  })
}

//通知公告删除
export function delOaNotice(data){
	return request({
    url: 'oa/notice/opt',
    method: 'post',
    data
  })
}

//通知公告 查询所有教育局和学校
export function queryAllUnits(data){
	return request({
    url: 'uc/unit/oldlist',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}


//报告查询
export function queryUcReport(data){
	return request({
    url: 'uc/report/list',
    method: 'post',
    data
  })
}

//查询系统的学年学期
export function queryYearTerm(){
	return request({
    url: 'cms/termList/list',
    method: 'post'
  })
}

//报告添加和编辑
export function saveUcReport(data){
	return request({
    url: 'uc/report/save',
    method: 'post',
    data
  })
}
//报告删除
export function delUcReport(data){
	return request({
    url: 'uc/report/delete',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//报告下载检查文件是否存在文件 
export function downCheckReport(data){
	return request({
    url: 'uc/report/checkDownload',
    method: 'get',
    params:data
 })
}

//报告下载文件 
export function downReport(data){
	return request({
    url: 'sys/oss/downloadFiles',
    method: 'get',
    params:data
 })
}


//微信公众号查询
export function queryWechatAccount(data){
	return request({
    url: 'wechat/account/list',
    method: 'post',
    data
  })
}

//微信公众号添加和编辑
export function saveWechatAccount(data){
	return request({
    url: 'wechat/account/save',
    method: 'post',
    data
  })
}

//微信公众号删除
export function delWechatById(data){
	return request({
    url: 'wechat/account/del',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}
//微信公众号-菜单查询
export function queWechatMenuById(data){
	return request({
    url: 'wechat/security/getList',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}
//微信公众号-菜单发布
export function createWechatMenu(data){
	return request({
    url: 'wechat/security/createMenu',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//微信公众号-菜单添加
export function saveWechatMenu(data){
	return request({
    url: 'wechat/security/saveMenu',
    method: 'post',
    data
  })
}

//微信公众号-菜单删除
export function delWechatMenu(data){
	return request({
    url: 'wechat/security/del',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

////微信公众号-菜单编辑
//export function delWechatMenuById(data){
//	return request({
//  url: 'wechat/account/del',
//  method: 'post',
//  headers:{
//      'Content-type': 'application/x-www-form-urlencoded'
//  },
//  data:querystring.stringify(data)
//})
//}

export function queryUcAuthority(data){
	return request({
    url: 'uc/authority/list',
    method: 'post',
    data
  })
}

//用户查询
export function queryUcUserList(data){
	return request({
    url: 'uc/user/list',
    method: 'post',
    data
  })
}

// 查询用户个人信息
export function queryUcUserInfo(){
	return request({
    url: 'uc/user/info',
    method: 'post'
  })
}

//重置密码
export function resetPasswordUc(data){
	return request({
    url: 'uc/user/resetPassword',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//根据机构类型查询机构
export function queryUnitNameByType(data){
	return request({
    url: 'uc/user/type',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//根据机构类型查询机构
export function queryRolesBySchoolId(data){
	return request({
    url: 'uc/user/checkSchool',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//用户类型添加
export function addUserCms(data){
	return request({
    url: 'cms/teacherMge/userAdd',
    method: 'post',
    data
  })
}

//查询所有学校
export function queryUcAllSchools(data){
	return request({
    url: 'uc/school/eduSchools',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//组织机构管理-查询
export function queryUnitList(data){
	return request({
    url: 'uc/unit/list',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//组织机构管理-教育局添加和编辑
export function saveUnitInfo(data){
	return request({
    url: 'uc/unit/save',
    method: 'post',
    data
  })
}

//组织机构管理-学校添加和编辑
export function saveSchoolInfo(data){
	return request({
    url: 'uc/school/save',
    method: 'post',
    data
  })
}

//组织机构管理-教育局删除
export function delUnitById(data){
	return request({
    url: 'uc/unit/delete',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//组织机构管理-学校删除
export function delSchoolById(data){
	return request({
    url: 'uc/school/delete',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}


//查询所有的策略
export function getAllGroup(){
	return request({
    url: 'uc/school/beforeSave',
    method: 'post'
  })
}

//查询所有的子系统
export function getAllSubSystem(data){
	return request({
    url: 'cms/HomePage/allHomePage',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//菜单管理-查询
export function queryMenuList(data){
	return request({
    url: 'uc/authority/list',
    method: 'post',
    data
  })
}

//菜单管理-添加和编辑
export function saveMenuInfo(data){
	return request({
    url: 'uc/authority/save',
    method: 'post',
    data
  })
}

//菜单管理-编辑
export function updateMenuInfo(data){
	return request({
    url: 'uc/authority/update',
    method: 'post',
    data
  })
}

//菜单管理-删除
export function delMenuById(data){
	return request({
    url: 'uc/authority/delete',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//上传文件
export function uploadFile(data){
	return request({
    url: 'sys/oss/uploads',
    method: 'post',
    data
 })
}

//评价设置-查询模板
export function queryTempletRel(data){
	return request({
    url: 'cms/assesstemplet/queryrel',
    method: 'post',
    data
 })	
}

/*
 * 评价设置-添加模板
 * 1、学业没有指标和观测点
 * 2、其他维度指标和观测点不能为空
 * */

export function saveTempletRel(data){
	return request({
    url: 'cms/assesstemplet/templetrel',
    method: 'post',
    data
 })	
}

/*
 * 评价设置-查询所有元数据
 * @param level-> 1 维度， level-> 2 指标， level-> 1 观测点
 */
export function queryIndexByLevel(data){
	return request({
    url: 'cms/assessindex/queryItem',
    method: 'post',
    data
 })	
}
