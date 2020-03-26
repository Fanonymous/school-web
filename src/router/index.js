/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo } from '@/utils'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [{
		path: '/404',
		component: _import('common/404'),
		name: '404',
		meta: {
			title: '404未找到'
		}
	},{
		path: '/authorization-fail',
		component: _import('common/authorization-fail'),
		name: 'authorization-fail',
		meta: {
			title: '授权失败'
		}
	},
	{
		path: '/login',
		component: _import('common/login'),
		name: 'login',
		meta: {
			title: '登录'
		}
	},
	
	{
		path: '/register',
		component: _import('common/register'),
		name: 'register',
		meta: {
			title: '注册'
		}
	},
	{
		path: '/user-agreement',
		component: _import('common/user-agreement'),
		name: 'user-agreement',
		meta: {
			title: '注册'
		}
	},
	{
		path: '/screen-link',
		component: _import('common/screen-link'),
		name: 'screen-link',
		meta: {
			title: '可视化'
		}
	},
	{
		path: '/screen-link-s',
		component: _import('modules/screen/school'),
		name: 'screen-link-s',
		meta: {
			title: '可视化-学校'
		}
	},
  {
  	path: '/diama-china-out',
  	component: _import('modules/diama/china'),
  	name: 'diama-china-out',
  	meta: {
  		title: 'diama-全国'
  	}
  },
  {
  	path: '/diama-province',
  	component: _import('modules/diama/province'),
  	name: 'diama-province',
  	meta: {
  		title: 'diama-省'
  	}
  },
  {
  	path: '/diama-school',
  	component: _import('modules/diama/school'),
  	name: 'diama-school',
  	meta: {
  		title: 'diama-学校'
  	}
  },
	{
		path: '/screen-link-e',
		component: _import('modules/screen/edu'),
		name: 'screen-link-e',
		meta: {
			title: '可视化-教育局'
		}
    
	},
	{
		path: '/screen-link-c',
		component: _import('modules/screen/city'),
		name: 'screen-link-c',
		meta: {
			title: '可视化-市'
		}
	},
	{
		path: '/screen-link-p',
		component: _import('modules/screen/province'),
		name: 'screen-link-p',
		meta: {
			title: '可视化-省'
		}
	},
	{
		path: '/screen-link-cc',
		component: _import('modules/screen/china'),
		name: 'screen-link-cc',
		meta: {
			title: '全国教育信息化动态'
		}
	},
	{
		path: '/screen-link-ch',
		component: _import('modules/screen/china-expo'),
		name: 'screen-link-ch',
		meta: {
			title: '全国教育信息化动态'
		}
	},
	
	{
		path: '/time-table-detail',
		component: _import('common/time-table-detail'),
		name: 'time-table-detail',
		meta: {
			title: '作息时间'
		}
	},
	{
		path: '/course-detail',
		component: _import('common/course-detail'),
		name: 'course-detail',
		meta: {
			title: '班级课表'
		}
	},
	{
		path: '/course-t-detail',
		component: _import('common/course-t-detail'),
		name: 'course-t-detail',
		meta: {
			title: '教师课表'
		}
	},
	{
		path: '/my-course-detail',
		component: _import('common/my-course-detail'),
		name: 'my-course-detail',
		meta: {
			title: '我的课表'
		}
	}
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
	path: '/',
	component: _import('main'),
	name: 'main',
	redirect: {
		name: 'index'
	},
	meta: {
		title: '首页'
	},
	children: [
		// 通过meta对象设置路由展示方式
		// 1. isTab: 是否通过tab展示内容, true: 是, false: 否
		// 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
		// 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
		{
			path: '/home',
			component: _import('common/index1'),
			name: 'home',
			meta: {
				title: '首页'
			}
		},
		{
			path: '/index',
			component: _import('common/index'),
			name: 'index',
			meta: {
				title: '首页'
			}
		},
//		{
//			path: '/school',
//			component: _import('modules/a-media/school'),
//			name: 'a-media-school',
//			meta: {
//				title: '首页',
//				isTab: true,
//				keepAlive: false
//			}
//		},
		//	{ path: '/home', component: _import('modules/a-media/school'), name: 'home', meta: { title: '首页' } },
		//  { path: '/theme', component: _import('common/theme'), name: 'theme', meta: { title: '主题' } },
		////  { path: '/demo-echarts', component: _import('demo/echarts'), name: 'demo-echarts', meta: { title: 'demo-echarts', isTab: true } },
		////  { path: '/demo-ueditor', component: _import('demo/ueditor'), name: 'demo-ueditor', meta: { title: 'demo-ueditor', isTab: true } },
		////  { path: '/uc-echarts', component: _import('modules/uc/echarts'), name: 'uc-echarts', meta: { title: 'uc-echarts', isTab: true } },
		////  { path: '/uc-ueditor', component: _import('modules/uc/ueditor'), name: 'uc-ueditor', meta: { title: 'uc-ueditor', isTab: true } },
		{
			path: '/equip-add',
			component: _import('modules/media/equip-add'),
			name: 'equip-add',
			meta: {
				
				title: '装备添加',
				isTab: true
			}
		},
		{
			path: '/type-add',
			component: _import('modules/media/type-add'),
			name: 'type-add',
			meta: {
				parent:{
					path:'/type',
					title:'装备类型管理',
				},
				title: '类型添加',
				isTab: true
			}
		},
		{
			path: '/type-edit',
			component: _import('modules/media/type-add'),
			name: 'type-edit',
			meta: {
				parent:{
					path:'/type',
					title:'装备类型管理',
				},
				title: '类型修改',
				isTab: true
			}
		},
		{ 
			path: '/type',
			component: _import('modules/media/type'),
			name: 'type', 
			meta: {
				title: '装备类型管理', 
				isTab: true 
			}
		},
		{
			path: '/monitor',
			component: _import('modules/media/monitor-basicinfo'),
			name: 'monitor-basicinfo',
			meta: {
				parent:{
					path:'/media-monitor',
					title:'设备监控',
				},
				title: '详情',
				isTab: true
			}
		},
		{
			path: '/monitor_mana',
			component: _import('modules/media/monitor-basicinfo'),
			name: 'monitor_mana',
			meta: {
				parent:{
					path:'/media-equip',
					title:'设备管理',
				},
				title: '详情',
				isTab: true
			}
		},
		{
			path: '/media-equip-edit',
			component: _import('modules/media/equip-edit'),
			name: 'media-equip-edit',
			meta: {
				parent:{
					path:'/media-equip',
					title:'设备管理',
				},
				title: '信息编辑',
				isTab: true
			}
		},
		{
			path: '/add-register',
			component: _import('modules/stu/add-register'),
			name: 'add-register',
			meta: {
				parent:{
					path:'/stu-stu-register',
					title:'学籍注册',
				},
				title: '添加',
				isTab: true
			}
		},
		{
			path: '/add-register',
			component: _import('modules/stu/add-register'),
			name: 'edit-register',
			meta: {
				parent:{
					path:'/stu-stu-register',
					title:'学籍注册',
				},
				title: '完善信息',
				isTab: true
			}
		},
		{
			path: '/show-register',
			component: _import('modules/stu/show-register'),
			name: 'show-register',
			meta: {
				parent:{
					path:'/stu-stu-register',
					title:'学籍注册',
				},
				title: '学生详细信息',
				isTab: true
			}
		},
		{
			path: '/show-register',
			component: _import('modules/stu/show-register'),
			name: 'show-register1',
			meta: {
				parent:{
					path:'/stu-his_divclass',
					title:'调班管理',
				},
				title: '学生详细信息',
				isTab: true
			}
		},
		{
			path: '/show-register',
			component: _import('modules/stu/show-register'),
			name: 'show-register2',
			meta: {
				parent:{
					path:'/stu-graduates',
					title:'毕业生管理',
				},
				title: '学生详细信息',
				isTab: true
			}
		},
		{
			path: '/show-register',
			component: _import('modules/stu/show-register'),
			name: 'show-register3',
			meta: {
				parent:{
					path:'/stu-leave_school',
					title:'离校复学管理',
				},
				title: '学生详细信息',
				isTab: true
			}
		},
		{
			path: '/detail',
			component: _import('modules/a-media/detail'),
			name: 'a-detail',
			meta: {
				parent:{
					path:'/',
					title:'图文发布',
				},
				title: '装备详情',
				isTab: true
			}
		},
		{
			path: '/role-authorize',
			component: _import('modules/user/role-authorize'),
			name: 'authorize',
			meta: {
				parent:{
					path:'/user-role',
					title:'角色管理',
				},
				title: '分配权限',
				isTab: true
			}
		},
		{
			path: '/user-add',
			component: _import('modules/user/user-add'),
			name: 'user-add',
			meta: {
				parent:{
					path:'/user-user',
					title:'用户管理',
				},
				title: '添加用户',
				isTab: true
			}
		},
		{
			path: '/app-add',
			component: _import('modules/app/app-add'),
			name: 'app-add',
			meta: {
				parent:{
					path:'/app-manage',
					title:'应用管理',
				},
				parentName:'app-publish',
				title: '添加应用',
				isTab: true
			}
		},
		{
			path: '/userinfo',
			component: _import('modules/user/userinfo'),
			name: 'userinfo',
			meta: {
				title: '个人中心',
				isTab: true
			}
		},
		{
			path: '/infor-detail',
			component: _import('modules/a-media/infor-detail'),
			name: 'infor-detail',
			meta: {
				title: '个人中心',
				isTab: true
			}
		},
		{
			path: '/userinfo-user',
			component: _import('modules/user/userinfo'),
			name: 'userinfo-user',
			meta: {
				parent:{
					path:'/user-user',
					title:'用户管理',
				},
				title: '个人中心',
				isTab: true
			}
		},
		{
			path: '/message-receive-my',
			component: _import('modules/message/receive'),
			name: 'message-receive-my',
			meta: {
				title: '我的消息',
				isTab: true
			}
		},
		{
			path: '/publish-look',
			component: _import('modules/app/publish-look'),
			name: 'publish-look',
			meta: {
				parent:{
					path:'/app-publish',
					title:'应用发布',
				},
				title: '应用发布详情',
				isTab: true
			}
		},{
			path: '/publish-add',
			component: _import('modules/app/publish-add'),
			name: 'publish-add',
			meta: {
				parent:{
					path:'/app-publish',
					title:'应用发布'
				},
				title: '添加应用',
				isTab: true
			}
		},{ 
			path: '/publish_infors', 
			component: _import('modules/class-card/publish_infor'),
			name: 'publish_infors', 
			meta: { 
				parent:{
					path:'/class-card-ceefax-class',
					title:'班级资讯'
				},
				title: '发布资讯',
				isTab: true 
			}
		},{ 
			path: '/publish_infor', 
			component: _import('modules/class-card/publish_infor'),
			name: 'publish_infor', 
			meta: { 
				parent:{
					path:'/class-card-ceefax',
					title:'校园资讯'
				},
				title: '发布资讯',
				isTab: true 
			}
		},{ 
			path: '/edit_publish',
			component: _import('modules/class-card/edit_publish'),
			name: 'edit_publish', 
			meta: {
				parent:{
					path:'/class-card-ceefax',
					title:'校园资讯'
				},
				title: '编辑资讯', 
				isTab: true 
			}
		},{ 
			path: '/edit_publishs',
			component: _import('modules/class-card/edit_publish'),
			name: 'edit_publishs', 
			meta: {
				parent:{
					path:'/class-card-ceefax-class',
					title:'班级资讯'
				},
				title: '编辑资讯', 
				isTab: true 
			}
        },
        { 
			path: '/view_new',
			component: _import('modules/class-card/edit_publish'),
			name: 'view_new', 
			meta: {
				parent:{
					path:'/class-card-ceefax',
					title:'校园资讯'
				},
				title: '查看资讯', 
				isTab: true 
			}
		},
        { 
			path: '/view_news',
			component: _import('modules/class-card/edit_publish'),
			name: 'view_news', 
			meta: {
				parent:{
					path:'/class-card-ceefax-class',
					title:'班级资讯'
				},
				title: '查看资讯', 
				isTab: true 
			}
		},
		{ 
			path: '/ceefax',
			component: _import('modules/class-card/ceefax'),
			name: 'ceefax', 
			meta: {
				title: '图文发布', 
				isTab: true 
			}
		},
		{ 
			path: '/tea-log',
			component: _import('modules/edu/tea-log'),
			name: 'tea-log', 
			meta: {
				parent:{
					path:'/edu-teacher',
					title:'教师任课管理'
				},
				title: '任课记录', 
				isTab: true 
			}
		},
		{ 
			path: '/teach-manage-add',
			component: _import('modules/teach/manage-add'),
			name: 'teach-manage-add', 
			meta: {
				parent:{
					path:'/teach-entry-manage',
					title:'入职管理'
				},
				title: '添加', 
				isTab: true 
			}
		},
		{ 
			path: '/teach-manage-look',
			component: _import('modules/teach/manage-look'),
			name: 'teach-manage-look', 
			meta: {
				parent:{
					path:'/teach-manage',
					title:'教职工档案管理'
				},
				title: '详情', 
				isTab: true 
			}
		},
		{ 
			path: '/teach-retire-data',
			component: _import('modules/teach/retire-leave-data'),
			name: 'teach-retire-data', 
			meta: {
				parent:{
					path:'/teach-retire-manage',
					title:'退休'
				},
				title: '添加', 
				isTab: true 
			}
        },
        { 
			path: '/stu-add-change',
			component: _import('modules/stu/add-change'),
			name: 'stu-add-change', 
			meta: {
				parent:{
					path:'/stu-leave_school',
					title:'离校复学管理'
				},
				title: '添加', 
				isTab: true 
			}
		},
		{ 
			path: '/teach-leave-data',
			component: _import('modules/teach/add-leave'),
			name: 'teach-leave-data', 
			meta: {
				parent:{
					path:'/teach-leave-manage',
					title:'离职管理'
				},
				title: '添加', 
				isTab: true 
			}
		},
		{ 
			path: '/teach-entry-data',
			component: _import('modules/teach/entry-data'),
			name: 'teach-entry-data', 
			meta: {
				parent:{
					path:'/teach-entry-manage',
					title:'入职管理'
				},
				title: '添加', 
				isTab: true 
			}
		},
		{ 
			path: '/tea-batch',
			component: _import('modules/edu/tea-batch'),
			name: 'tea-batch', 
			meta: {
				parent:{
					path:'/edu-teacher',
					title:'教师任课管理'
				},
				title: '批量导入', 
				isTab: true 
			}
		},{ 
			path: '/screen-school-sc',
			component: _import('modules/screen/school'),
			name: 'screen-school-sc', 
			meta: {
				parent:{
					path:'/screen-edu',
					title:'教育信息化'
				},
				title: '学校智慧信息化', 
				isTab: true 
			}
		},{ 
			path: '/screen-province-sc',
			component: _import('modules/screen/province'),
			name: 'screen-province-sc', 
			meta: {
				parent:{
					path:'/screen-china',
					title:'全国教育信息化'
				},
				title: '省教育信息化', 
				isTab: true 
			}
		},{ 
			path: '/screen-city-sc',
			component: _import('modules/screen/city'),
			name: 'screen-city-sc', 
			meta: {
				parent:{
					path:'/screen-province',
					title:'省教育信息化'
				},
				title: '市教育信息化', 
				isTab: true 
			}
		},{ 
			path: '/screen-edu-sc',
			component: _import('modules/screen/edu'),
			name: 'screen-edu-sc', 
			meta: {
				parent:{
					path:'/screen-city',
					title:'市教育信息化'
				},
				title: '区域教育信息化', 
				isTab: true 
			}
		},{
			path: '/data-add',
			component: _import('modules/evaluate/data-add'),
			name: 'data-add',
			meta: {
				parent:{
					path:'/evaluate-report',
					title:'学校信息化数据',
				},
				title: '数据填报',
				isTab: true
			}
		},
		{
			path: '/edu-time-table-look1',
			component: _import('modules/edu/time-table-look'),
			name: 'edu-time-table-look1',
			meta: {
				parent:{
					path:'/edu-time-table',
					title:'作息时间添加',
				},
				title: '作息时间管理'
			}
		},
		{
			path: '/edu-time-table',
			component: _import('modules/edu/time-table'),
			name: 'edu-time-table',
			meta: {
				parent:{
					path:'/edu-time-table-look',
					title:'作息时间管理',
				},
				title: '作息时间添加'
			}
		},{
			path: '/edu-add-course',
			component: _import('modules/edu/add-schedule'),
			name: 'edu-add-course',
			meta: {
				parent:{
					path:'/edu-class-schedule',
					title:'班级课表',
				},
				title: '添加课表',
				isTab: true
			}
		},{
			path: '/edu-add-m-course',
			component: _import('modules/edu/add-m-schedule'),
			name: 'edu-add-m-course',
			meta: {
				parent:{
					path:'/edu-master-schedule',
					title:'班级课表',
				},
				title: '添加课表',
				isTab: true
			}
		},{
			path: '/edu-update-course',
			component: _import('modules/edu/update-schedule'),
			name: 'edu-update-course',
			meta: {
				parent:{
					path:'/edu-class-schedule',
					title:'班级课表',
				},
				title: '更新课表',
				isTab: true
			}
		},{
			path: '/a-media-infor-area-sch',
			component: _import('modules/a-media/infor-area-s'),
			name: 'a-media-infor-area-sch',
			meta: {
				parent:{
					path:'/a-media-infor-area',
					title:'区域数据填报进度',
				},
				title: '数据采集进度分析'
			}
		},
    
		{
			path: '/a-monitor',
			component: _import('modules/media/monitor-basicinfo'),
			name: 'a-monitor-basicinfo',
			meta: {
				parent:{
					path:'/a-media-area-monitor',
					title:'设备监控',
				},
				title: '监控信息',
				isTab: true
			}
		},
		{
			path: '/class-card-news-letter',
			component: _import('modules/class-card/news-letter'),
			name: 'class-card-news-letter',
			meta: {
				parent:{
					path:'/class-card-broadcast',
					title:'播报计划',
				},
				title: '消息简讯',
				isTab: true
			}
		},
		{
			path: '/class-card-news-image',
			component: _import('modules/class-card/news-image'),
			name: 'class-card-news-image',
			meta: {
				parent:{
					path:'/class-card-broadcast',
					title:'播报计划',
				},
				title: '图片下发',
				isTab: true
			}
		},
		{
			path: '/class-card-news-video',
			component: _import('modules/class-card/news-video'),
			name: 'class-card-news-video',
			meta: {
				parent:{
					path:'/class-card-broadcast',
					title:'播报计划',
				},
				title: '视频播报',
				isTab: true
			}
		},
    {
    	path: '/system-second',
    	component: _import('common/system-second'),
    	name: 'system-second',
    	meta: {
    		
    		title: '第三方链接',
    		isTab: true
    	}
    },
    {
    	path: '/edu-teaching-duty-sub',
    	component: _import('modules/edu/teaching-duty'),
    	name: 'edu-teaching-duty-sub',
    	meta: {
    		parent:{
    			path:'/edu-subject',
    			title:'科目管理',
    		},
    		title: '教学职责管理',
    		isTab: true
    	}
    },
	],
	beforeEnter(to, from, next) {
		let token = Vue.cookie.get('accesstoken')
		if(!token || !/\S/.test(token)) {
			clearLoginInfo()
			next({
				name: 'login'
			})
		}
		next()
	}
}

const router = new Router({
	mode: 'history',
//	scrollBehavior: () => ({
//		y: 0
//	}),
	scrollBehavior(to,from,savedPosition){
      if(savedPosition){
        return savedPosition;
      }else{
        return {x:0,y:0}
      }
    },
	isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
	routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
	// 添加动态(菜单)路由
	// 1. 已经添加 or 全局路由, 直接访问
	// 2. 获取菜单列表, 添加并保存本地存储
	if(router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
		// if (from.name == 'stu-his_divclass') { // 当进入这个页面进行记录
		// 	if(localStorage.getItem("isShowLeave") == 'true'){
		// 			Vue.prototype.$confirm('当前还有未保存的调班学生，请先保存后再离开。', '离开此班级？', {
		// 				confirmButtonText: '继续离开',
		// 				cancelButtonText: '取消',
		// 				type: 'warning'
		// 			}).then(() => {
		// 				localStorage.removeItem("isShowLeave")
		// 				next()
		// 			}).catch(() => {
		// 				return
		// 			});
		// 	}else{
		// 		localStorage.removeItem("isShowLeave")
		// 		next()
		// 	}
		// }else{
			next()	
		// }
	} else {
		if(Vue.cookie.get('accesstoken') == null) {
      if(window.SITE_CONFIG.cmsIp == 1){
        router.push({
        	name: 'login'
        })
      }else{
        window.location.href = window.SITE_CONFIG.cmsIp
      }
			return
		}

		http({
			url: http.adornUrlMedia('application/getProductByRole'),
			method: 'post',
			data: {}
		}).then(({
			data
		}) => {
			if(data && data.code === 0) {
				//productMenuList
				//sessionStorage.setItem('productList', JSON.stringify(data.list || '[]'))
				let menuListRemp = data.list
				//menuListRemp = JSON.parse(menuListRemp)
				
				//sessionStorage.setItem('menuList', JSON.stringify(menuListRemp[0].menuList || '[]'))
				

				let allMenuList = new Array()
				let tempMenuRoutes = new Array()
				for(let i in menuListRemp) {
					for(let j in menuListRemp[i].menuList){
						tempMenuRoutes.push(menuListRemp[i].menuList[j])
					}
					allMenuList.push(menuListRemp[i].menuList)
				}
				console.log(menuListRemp)
				//console.log(allMenuList)
				
				//let arr = menuListRemp[0].menuList
				// let temArr = new Array()

				// let temmmArr = new Array()
				// if(menuListRemp.length > 0){
				// 	for(let mm in menuListRemp){
				// 		let arr = menuListRemp[mm].menuList
				// 		temArr = []
				// 		let ii = 0
				// 		if(arr != undefined){
				// 			if(arr.length == 1){
				// 				temArr=arr
				// 			}else{
				// 				for(let i in arr){
				// 					//判断目录
				// 					if(arr[i].type === 'directory'){
				// 						temArr[ii] = arr[i]
				// 						let tempArrMenu= new Array()
				// 						//let jj =0
				// 						for(let j in arr){
				// 							if(arr[j].type ==='menu'){
				// 								//菜单
				// 								if(arr[i].menuId == arr[j].parentId){
				// 									tempArrMenu.push(arr[j])
				// 								}
				// 							}
				// 						}
				// 						temArr[ii]['children'] = tempArrMenu
				// 						ii++
				// 					}
				// 				}
				// 			}
				// 		}
				// 		temmmArr.push({productId:menuListRemp[mm].productId,applicationName: menuListRemp[mm].applicationName,menuList:temArr})
				// 	}
				// }
         let temArr = new Array()
         	let temmmArr = new Array()
         	let thirdLen = 0,myAppLen=0
         	if(menuListRemp.length > 0) {
         		for(let mm in menuListRemp) {
         			let arr = menuListRemp[mm].menuList

         			temArr = []
         			let ii = 0
         			for(let i in arr) {
         				//判断目录
         				if(arr[i].parentId == 1 && arr[i].type === 'menu') {
         					temArr[ii] = arr[i]
                   ii++
         				}
         				if(arr[i].type === 'directory') {

         					temArr[ii] = arr[i]
         					let tempArrMenu = new Array()
         					for(let j in arr) {
         						if(arr[j].type === 'menu') {
         							//菜单
         							if(arr[i].menuId == arr[j].parentId) {
         								tempArrMenu.push(arr[j])
         							}
         						}
         					}
         					temArr[ii]['children'] = tempArrMenu
         					ii++
         				}
         			}
         			temmmArr.push({
         				url:menuListRemp[mm].url,
         				productId: menuListRemp[mm].productId,
         				applicationName: menuListRemp[mm].applicationName,
         				applicationSort: menuListRemp[mm].applicationSort,
         				menuList: temArr,
						isThirdSys:menuListRemp[mm].isThirdSys,
						menuIds:menuListRemp[mm].menuIds
         			})
         		}
         	}
         

				sessionStorage.setItem('productList', JSON.stringify(temmmArr || '[]'))
				if(temmmArr.length ==0){
					sessionStorage.setItem('menuList', '')
				}else{
					sessionStorage.setItem('menuList', JSON.stringify(temmmArr[0].menuList || '[]'))
				}
				if(sessionStorage.getItem('curApp') != undefined){
					let applicationObj = JSON.parse(sessionStorage.getItem('curApp') || '[]')
					let productObj = temmmArr.filter(item => item.productId === applicationObj.id  )[0]
					sessionStorage.setItem('menuList', JSON.stringify(productObj.menuList || '[]'))
				}
				
				console.log(temmmArr)
				//console.log(temArr[0])
//				sessionStorage.setItem('menuList', JSON.stringify(temArr[0] || '[]'))

				
//				for(let i in allMenuList){
//					tempMenuRoutes.push(allMenuList[i][0])
////					if(allMenuList[i].type === 'directory'){
////						let tempArr = []
////						for(let j in allMenuList){
////							if(allMenuList[i].productId == allMenuList[j].productId ){
////								tempArr.push(allMenuList[j])
////							}
////						}
////						tempMenuRoutes[i] = allMenuList[i]
////						tempMenuRoutes[i]['children'] = tempArr
////					}
//				}
				fnAddDynamicMenuRoutes1(tempMenuRoutes)
				router.options.isAddDynamicMenuRoutes = true
				sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
				next({ ...to,
					replace: true
				})
			} else {
				sessionStorage.setItem('menuList', '[]')
				sessionStorage.setItem('permissions', '[]')
				next()
			}
		}).catch((e) => {
			//console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      
			if(window.SITE_CONFIG.cmsIp == 1){
			  router.push({
			  	name: 'login'
			  })
			}else{
			  window.location.href = window.SITE_CONFIG.cmsIp
			}
		})
		
	
	
	}
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType(route, globalRoutes = []) {
	var temp = []
	for(var i = 0; i < globalRoutes.length; i++) {
		if(route.path === globalRoutes[i].path) {
			return 'global'
		} else if(globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
			temp = temp.concat(globalRoutes[i].children)
		}
	}
	return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes(menuList = [], routes = []) {
	var temp = []

	for(var i = 0; i < menuList.length; i++) {
		if(menuList[i].list && menuList[i].list.length >= 1) {
			temp = temp.concat(menuList[i].list)
		} else if(menuList[i].url && /\S/.test(menuList[i].url)) {
			menuList[i].url = menuList[i].url.replace(/^\//, '')
			var route = {
				path: menuList[i].url.replace('/', '-'),
				component: null,
				name: menuList[i].url.replace('/', '-'),
				meta: {
					menuId: menuList[i].menuId,
					title: menuList[i].name,
					isDynamic: true,
					isTab: true,
					isCollect: menuList[i].isCollect,
					iframeUrl: '',
					keepAlive: false
				}
			}
			// url以http[s]://开头, 通过iframe展示
			if(isURL(menuList[i].url)) {
				route['path'] = `i-${menuList[i].menuId}`
				route['name'] = `i-${menuList[i].menuId}`
				route['meta']['iframeUrl'] = menuList[i].url
			} else {
				try {
					route['component'] = _import(`modules/${menuList[i].url}`) || null
				} catch(e) {}
			}
			routes.push(route)
		}
	}
	if(temp.length >= 1) {
		fnAddDynamicMenuRoutes(temp, routes)
	} else {
		mainRoutes.name = 'main-dynamic'
		mainRoutes.children = routes
		router.addRoutes([
			mainRoutes,
			{
				path: '*',
				redirect: {
					name: '404'
				}
			}
		])
		sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
		//  console.log('\n')
		//  console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
		//  console.log(mainRoutes.children)
		//  console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
	}
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
export function fnAddDynamicMenuRoutes1(menuList = [], routes = []) {
	
	var temp = []
	for(var i = 0; i < menuList.length; i++) {
		if(menuList[i].children && menuList[i].children.length >= 1) {
			temp = temp.concat(menuList[i].children)
		} else if(menuList[i].url && /\S/.test(menuList[i].url)) {

			menuList[i].url = menuList[i].url.replace(/^\//, '')
			var route = {
				path: menuList[i].url.replace('/', '-'),
				component: null,
				name: menuList[i].url.replace('/', '-'),
				meta: {
					menuId: menuList[i].menuId,
					productId: menuList[i].productId,
					title: menuList[i].menuName,
					subtitle: menuList[i].menuName,
					isDynamic: true,
					isTab: true,
					iframeUrl: '',
//					keepAlive: false,
					isCollect: menuList[i].isCollect
				}
			}
			// url以http[s]://开头, 通过iframe展示
			if(isURL(menuList[i].url)) {
				route['path'] = `i-${menuList[i].menuId}`
				route['name'] = `i-${menuList[i].menuId}`
				route['meta']['iframeUrl'] = menuList[i].url
			} else {
				try {
					route['component'] = _import(`modules/${menuList[i].url}`) || null
				} catch(e) {}
			}
			routes.push(route)
		}
	}
	if(temp.length >= 1) {
		fnAddDynamicMenuRoutes1(temp, routes)
	} else {
		mainRoutes.name = 'main-dynamic'
		mainRoutes.children = routes
		router.addRoutes([
			mainRoutes,
			{
				path: '*',
				redirect: {
					name: '404'
				}
			}
		])
		sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
		//  conso
		//  console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
		//  console.log(mainRoutes.children)
		//  console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
	}
}

export default router