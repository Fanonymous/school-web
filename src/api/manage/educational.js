import request from '@/utils/request'
const querystring = require('querystring');

//科目查询
//
export function queryCmsSubsList(){
	return request({
    url: 'cms/subInfo/subGradelist',
    method: 'post'
  })
}

//修改截图状态
export function updateScreenStatus(data){
	return request({
    url: 'cms/subjectMge/isScreenshot',
    method: 'post',
    data
  })
}

//年级查询
//
export function queryCmsGradeList(){
	return request({
    url: 'cms/gradeInfo/schoolGradeList',
    method: 'post'
  })
}

//年级查询
export function querySchoolGrade(){
	return request({
    url: 'cms/gradeInfo/byTypelist',
    method: 'post'
  })
}


//角色查询
//
export function queryUcRoles(data){
	return request({
    url: 'uc/user/checkSchool',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}
//班级管理
export function queryClassList(data){
	return request({
    url: 'cms/classInfo/list',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}
//班级管理-添加
export function addClass(data){
	return request({
    url: 'cms/classMge/add',
    method: 'post',
    data
  })
}
//班级管理-更新
export function updateClass(data){
	return request({
    url: 'cms/classMge/update',
    method: 'post',
    data
  })
}
//班级管理-删除
export function delClassById(data){
	return request({
    url: 'cms/classMge/del',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}
//班级管理-班级类型
export function queryClassType(data){
	return request({
    url: 'uc/school/getClassType',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//学籍管理
//
export function queryStuList(data){
	return request({
    url: 'cms/stuInfo/list',
    method: 'post',
    data
  })
}
//学籍查询
export function queryStuList2(data){
	return request({
    url: 'cms/stuInfo/list2',
    method: 'post',
    data
  })
}
//添加学生
export function addStudent(data){
	return request({
    url: 'cms/studentMge/add',
    method: 'post',
    data
  })
}
//删除学生
export function delStuById(data){
	return request({
    url: 'cms/studentMge/del',
    method: 'post',
    data
  })
}
//学籍管理-查询日期
export function studentDateList(){
	return request({
    url: 'cms/stuInfo/datelist',
    method: 'post'
  })
}

//学籍管理-批量导入

export function importFileStu(data){
	return request({
    url: 'cms/studentMge/addList',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//根据年级查询班级
export function queryClassesByGrade(data){
	return request({
    url: 'cms/classInfo/listByGrade',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}
//教籍管理
//
export function queryTeacherList(data){
	return request({
    url: 'cms/teacherList/list',
    method: 'post',
    data
  })
}
//
export function saveTeacher(data){
	return request({
    url: 'cms/teacherMge/add',
    method: 'post',
    data
  })
}
//
export function delTeaById(data){
	return request({
    url: 'cms/teacherMge/del',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}
//
export function queryTeaLeave(data){
	return request({
    url: 'cms/teacherMge/leave',
    method: 'post',
    data
  })
}
//教师任课管理
//
export function queryClassTeaList(data){
	return request({
    url: 'cms/classteacher/getClassTeacher',
    method: 'post',
    data
  })
}
//
export function saveClassTeacher(data){
	return request({
    url: 'cms/classteacher/saveOrUpdateClassTeacher',
    method: 'post',
    data
  })
}
//新学期场景
//链接
//历史信息录入
//cms/history/list
export function queryHistoryList(data){
	return request({
    url: 'cms/history/list',
    method: 'post',
    data
  })
}
//
export function queryHistoryCheck(data){
	return request({
    url: 'cms/history/check',
    method: 'post',
    data
  })
}

export function queryHistoryFinish(data){
	return request({
    url: 'cms/history/finish',
    method: 'post',
    data
  })
}

export function querySubsByGradeId(data){
	return request({
    url: 'cms/subInfo/byGrade',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//教籍管理查询日期
export function querDateTeach(){
	return request({
    url: 'cms/teacherList/dateList',
    method: 'post'
  })
}

//教籍管理查询所有科目

export function querSubList(){
	return request({
    url: 'cms/subInfo/bySchoollist',
    method: 'post'
  })
}

//教籍管理-修改离校老师
export function updateTeaLeave(data){
	return request({
	    url: 'cms/teacherMge/leave',
	    method: 'post',
	    headers:{
	        'Content-type': 'application/x-www-form-urlencoded'
	    },
	    data:querystring.stringify(data)
	})
}
