import request from '@/utils/request'
const querystring = require('querystring');


//查询备忘录信息
export function queryNoteList(data){
	return request({
    url: 'oa/note/list',
    method: 'post',
    data
  })
}

//查询子系统
export function queryHomeList(data){
	return request({
    url: 'cms/HomePage/findDisplayHomePage',
    method: 'post',
    headers:{
        'Content-type': 'application/x-www-form-urlencoded'
    },
    data:querystring.stringify(data)
  })
}

//查询学校或者教育局信息
export function getSchoolInfo(){
	return request({
    url: 'cms/teacherMge/school',
    method: 'post'
  })
}
