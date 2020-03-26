<template>
	<div v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中">
		<template v-if="!loading">
			<!--
        	作者：344514406@qq.com
        	时间：2019-02-26
        	描述：统一界面   子系统，便签，日期，日历
       -->
			<el-row :gutter="12" type="flex" style="margin-left: 0px; margin-right: 0px;">
				<el-col :lg="20" class="col-index">
					<el-col :lg="24">
						<el-card class="margin-b-10" style="box-shadow:0px 1px 1px 0px rgba(56, 96, 244, 0.35);" shadow="hover">
							<div class="index-title-1 margin-b-10">全部产品</div>
							<template v-if="likeList.length == 0 && applicationList.length == 0">
								<el-col :lg="24" style="text-align: center;color:#CCCCCC;padding: 20px 0px;">
									<img src="~@/assets/img/datano.png" class="margin-bottom-20" />
									<div>暂无数据</div>
								</el-col>
							</template>
							<template v-else>
								<template v-if="isAllAppShow ">
									<!-- <template v-if="likeList.length > 0">
										<div class="index-title-2 margin-b-10">最近使用</div>
										<el-col :lg="24" class="margin-b-10">
											<el-col :span="appLg" class="margin-b-10" v-for="(appItem,index) in likeList" v-if="index < 12">
												<div class="index-app-item" @click="productMenuLink(appItem.menuIds,appItem.productId,appItem.url,appItem.applicationName,appItem.isThirdSys)">
													<div class="index-app-img">
														<div class="index-app-img-cont"><img v-real-img="imgUrl+appItem.icon" :src="allPic"></div>
														<div class="index-app-text">{{appItem.applicationName}}</div>
													</div>
												</div>
											</el-col>
										</el-col>
									</template> -->

									<template v-for="(item,tIndex) in applicationList " v-if=" item.list.length > 0">

										<div class="index-title-2 margin-b-10" v-if="item.list.length > 0">
											{{item.dictName}}
											<i v-if="item.value==3" class="el-icon-question i-index-question" @click="thirdLink(1)"></i>
										</div>
										<el-col :lg="24" style="padding-left: 0px;">
											<el-col :span="appLg" style="padding-left: 0px;padding-right: 12px;" class="margin-b-10" v-for="(appItem,aIndex) in item.list"
											 v-if="item.value == appItem.applicationSort">
												<div class="index-app-item" @click="productMenuLink(appItem.menuIds,appItem.productId,appItem.url,appItem.applicationName,appItem.isThirdSys)">
													<!--<el-row>-->
													<div class="index-app-img">
														<div class="img-div" :style="'background-color:'+colorArr1[(tIndex+aIndex+1)%7]">
															<img v-real-img="imgUrl+appItem.icon" :src="allPic">
														</div>
														<!-- <div class="index-app-text">{{appItem.forShort}}</div> -->
														<div class="index-app-text">{{appItem.forShort}}</div>
													</div>
													<!--</el-row>-->
												</div>
											</el-col>
										</el-col>
									</template>
								</template>
								<template v-if="!isAllAppShow">
									<el-col :lg="24" style="padding-left: 0px;">
										<el-col :span="appLg" style="padding-left: 0px;padding-right: 12px;" class="margin-b-10" v-for="(appItem,index) in appCloseList"
										 v-if="index < 12">
											<div class="index-app-item" @click="productMenuLink(appItem.menuIds,appItem.productId,appItem.url,appItem.applicationName,appItem.isThirdSys)">
												<div class="index-app-img">
													<div class="img-div" :style="'background-color:'+colorArr1[(index+1)%7]"><img v-real-img="imgUrl+appItem.icon"
														 :src="allPic"></div>
													<!-- <div class="index-app-text">{{appItem.forShort}}</div> -->
													<div class="index-app-text">{{appItem.forShort}}</div>
												</div>

												<!--<el-row>-->
												<!--<el-col :lg="9" class="index-app-img">
														<img  v-real-img="imgUrl+appItem.icon" :src="allPic">
													</el-col>
													<el-col :lg="15" class="index-app-text">{{appItem.applicationName}}</el-col>-->
												<!--</el-row>-->
											</div>
										</el-col>
									</el-col>
								</template>
								<div style="text-align: center; cursor: pointer;">
									<span v-if="!isAllAppShow" @click="isAllAppShow=true">展开<i class="el-icon-arrow-down"></i></span>
									<span v-else @click="isAllAppShow=false">收起<i class="el-icon-arrow-up"></i></span>
								</div>
							</template>

						</el-card>
					</el-col>
					<el-col :lg="24" class="margin-b-10">
						<div class="index-title-2">服务概览</div>
					</el-col>
					<template v-for="(item, i) in myMicroList">
						<el-col :lg="12" :key="i">
							<el-card class="margin-b-10 card-el-item" shadow="hover">
								<div class="header-panel">
									<span class="title-bolder">{{item.mpName}}</span>

									<el-dropdown class="right" @command="deleteCard">
										<span class="el-dropdown-link ">
											<i class="el-icon-more "></i>
										</span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item icon="el-icon-delete" :command="item.mpId">删除</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
									<span class="right title-remark">{{item.microTypeName}}&nbsp;</span>
								</div>
								<!-- 应用概况-->
								<app v-if="item.mpId == 3"></app>
								<!-- 多媒体教学应用水平-->
								<media-edu v-if="item.mpId == 5 || item.mpId == 6"></media-edu>
								<!-- 校园概况-->
								<school-statistics v-if="item.mpId == 8 "></school-statistics>
								<!-- 教育局概况-->
								<edu-profile v-if="item.mpId == 10"></edu-profile>
								<!-- 学校概况-->
								<school-profile v-if="item.mpId == 9"></school-profile>
								<!-- 数据采集检测-->
								<data-center v-if="item.mpId == 11 || item.mpId == 15"></data-center>
								<!-- 多媒体建设情况-->
								<media-construction v-if="item.mpId == 12 || item.mpId == 16 "></media-construction>
								<!-- 数据资产量-->
								<data-statistics v-if="item.mpId == 17 "></data-statistics>
								<!-- 设备监控-->
								<media-monitor v-if="item.mpId == 18  || item.mpId == 23 "></media-monitor>
								<!--<visualization-system  v-if="item.mpId == 12 || item.mpId == 16 "></visualization-system>-->
								<!-- 班级空间-->
								<class-profile v-if="item.mpId == 19 "></class-profile>
								<!-- 课堂互动-->
								<class-interact v-if="item.mpId == 20 "></class-interact>
								<!-- 课表-->
								<school-timetable v-if="item.mpId == 22"></school-timetable>
								<school-timetable-class v-if="item.mpId == 21"></school-timetable-class>

								<!-- 课堂互动分析占位 -->
								<div v-if="item.mpId == 24" style="min-height:170px;"></div>
							</el-card>
						</el-col>
					</template>

					<el-col :lg="12">
						<el-card class="margin-b-10 add-card">
							<div class="panel-body-index1">
								<!--<el-button type="text" icon="el-icon-plus" @click="addCard">添加</el-button>-->
								<el-popover popper-class="aside-popover" placement="right" width="350" v-model="appDialogFormVisible"
								 transition="fade-in-linear" trigger="click">
									<div slot="reference">
										<span class="add-tittle"><i class="el-icon-plus" style="font-size: 16px;font-weight: 600;margin-right: 10px;"></i>自定义工作台</span>
									</div>
									<div class="app-popper__right" :style="'height: '+appHeight+'px;overflow: auto'">
										<div class="app-popover-title">自定义工作台</div>
										<el-form :rules="rules" ref="dataForm" :model="dataForm" label-position="right" label-width="100px">
											<div v-if="microList.length==0" style="text-align: center;padding-top: 85%;padding-bottom: 85%;">
												<img src="~@/assets/img/datano.png" style="margin-bottom: 20px;" /></br>
												<span>暂无数据</span>
											</div>
											<!--<el-collapse v-model="activeNames" v-else>
												<template v-for="item in microList">
													<el-collapse-item :name="item.applicationId">-->
											<!--<template slot="title">
															{{item.applicationName}}
														</template>-->
											<template v-else>
												<!--<template v-for="item in microList">-->
												<el-checkbox-group v-model="dataForm.checkCardList">
													<el-checkbox v-for="cardi in microList" :label="cardi.mpId" style="margin: 8px 10px 8px 0px;display: block; ">{{cardi.mpName}}</el-checkbox>
												</el-checkbox-group>
												<!--</template>-->
											</template>

											<!--</el-collapse-item>
												</template>
											</el-collapse>-->
										</el-form>
										<div slot="footer" class="popper-footer">
											<el-button @click="appDialogFormVisible = false">取消</el-button>
											<el-button type="primary" @click="saveCardData" :loading="addLoading">确定</el-button>
										</div>
									</div>
								</el-popover>
							</div>
						</el-card>
					</el-col>
				</el-col>
				<el-col style="width:350px;z-index: 999;">
					<el-card shadow="hover" class="margin-b-10 user-box card-el-item">
						<el-row style="padding-bottom: 15px;">
							<div v-if="userTypeList.length >0" style="border-bottom: 1px solid #CCCCCC;padding-bottom:7px;display: flex;justify-content: space-between;align-items: center;">
							<div>
								<template v-if="showPopoper">
									<el-tooltip v-if="userTypeList.length >0" class="item" effect="dark" :content="showName" placement="right-end">
										<template v-for="(item,index) in userTypeList">
											<el-button type="text" style="color:#606266" v-if="item.userType == userType">
												<img src="~@/assets/img/icons/index3.png" style="height: 32px;width:32px;margin-right: 5px;" alt="" /><span
												 style="font-size: 16px;color: #333333;font-weight: bold;">{{item.deptNameList[0]}}</span>
												<span v-if="item.deptNameList.length>1">...</span>
											</el-button>
										</template>
									</el-tooltip>
								</template>
								<template v-if="!showPopoper">
									<template v-for="(item,index) in userTypeList" v-if="item.userType == userType">
										<img src="~@/assets/img/icons/index3.png" style="height: 32px;width:32px;margin-right: 5px;" alt="" /><span
										 style="font-size: 16px;color: #333333;font-weight: bold;">{{item.deptNameList[0]}}</span>
										<span v-if="item.deptNameList.length>1">...</span>
									</template>
								</template>
								<!--<template v-else="!showPopoper">-->
								<!--</template>-->
								
								<!-- <template v-if="index < userTypeList.length-1">，</template> -->
							</div>
							<div style="display: flex;align-items: center;">
								<div style="color: #555555;font-weight: bold;margin-right: 10px;">
									{{currentRoleName ? currentRoleName : ''}}
								</div>
								<el-dropdown trigger="click" @command="handleCommand" v-if="userTypeList[0].roleNameList && userTypeList[0].roleNameList.length > 1">
								  <span class="el-dropdown-link" style="color: #3C85EE;cursor: pointer;outline: none;">
									切换
								  </span>
								  <el-dropdown-menu slot="dropdown">
									<el-dropdown-item v-for="(item,uIndex) in userTypeList[0].roleNameList" :command="uIndex">{{item}}</el-dropdown-item>
								  </el-dropdown-menu>
								</el-dropdown>
							</div>
							</div>
						</el-row>
						<el-row :gutter="12">
							<el-col :span="12" style="display: inline-flex;justify-content: center;align-items: center;width: 100%;">
								<img v-real-img="userAvatar == null?defaultImg:imgIp+userAvatar" :src="defaultPic" class="img-avatar" @click="$router.push({name:'userinfo', params: {id: ''}})"
								 style="cursor: pointer;margin-right: 35px;">
								<div class="username-box">
									<div style="color:#333333;overflow: hidden;text-overflow: ellipsis; word-break:break-all;font-size: 16px;font-weight: 600;line-height: 25px;"
									 :title="userName">{{userName ? ('Hi，'+ (userName.length > 5 ? userName.substring(0,5)+'..' : userName) +'，'+greeting) : ''}}</div>
									<div style="margin-top: 5px;font-size: 13px;" v-if="classInfo">{{classInfo}}</div>
									<!-- <div style="color:#333333;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;font-size: 16px;font-weight: 600;"
									 :title="userName">{{userName.length > 6 ? userName.substring(0,6)+'...' : userName}}</div>
									<div style="color: #555555;font-weight: bold;margin-top: 10px;">
										<tempList v-if="userType==7">
											游客
										</tempList>
										<tempList v-if="userTypeList.length == 1 && userType!=7">
											{{userTypeList[0].userTypeName}}
										</tempList>
									</div> -->
									<!-- <el-select v-if="userTypeList.length > 1  && userType!=7" v-model="userTypeCurr" placeholder="切换角色" size="mini"
									 @change="getUserTypeChange">
										<el-option v-for="item in userTypeList" :key="item.userType" :label="item.userTypeName" :value="item.userType">{{item.userTypeName}}</el-option>
									</el-select> -->
								</div>
							</el-col>
						</el-row>
					</el-card>
					<el-card shadow="hover" class="margin-b-10 padding15-t card-el-item">
						<full-calendar :events="monthData" :titleFormat='titleFormat' :weekNames='weekNames' class="test-fc" lang="zh">
							<img slot="fc-header-left" src="~@/assets/img/icons/index6.png" style="height: 32px;width:32px;margin-right: 5px;"
							 alt="" />
						</full-calendar>
					</el-card>
					<el-card shadow="hover" class="margin-b-10 padding15-t card-el-item">
						<div class="index-title"><img src="~@/assets/img/icons/index4.png" style="height: 32px;width:32px;margin-right: 5px;"
							 alt="" />备忘录 </div>
						<ul class="ul-index-book">
							<template v-for="(item,index) in bookList">
								<li class="li-book-nodata" :style="'background-color:'+colorArr[index%3]" v-if="index<3" @click="updateBook(item)">
									<!-- <div class="book-title">{{item.title | textFilter(10)}}</div> -->
									<div class="book-content">{{item.content | textFilter(15)}}</div>
									<div class="book-date">{{item.updateDate}}</div>
								</li>
							</template>
							<template v-for="index in (3-bookList.length)" v-if="bookList.length <3">
								<li class="li-book-nodata-add" :style="'background-color:'+colorArr[(index+bookList.length-1)%3]" @click="addBook">点击这里，添加备忘录吧~</li>
							</template>
						</ul>
					</el-card>
					<el-card shadow="hover" class="margin-b-10 help-index-bg card-el-item">
						<div class="index-title margin-bottom-20"> <img src="~@/assets/img/icons/index5.png" style="height: 32px;width:32px;margin-right: 5px;"
							 alt="" />云帮助中心 <a class="right"></a></div>
						<div class="margin-bottom-20">有问题，来帮助中心寻求答案吧</div>
						<div>
							<el-button type="primary" plain @click="thirdLink(2)">进入帮助中心</el-button>
						</div>
					</el-card>
					<!--<el-card shadow="hover" class="margin-b-10">
						<iframe id="weatheriFrame" name="weather_inc" :src="iframeSrc" style="" width="100%" height="160" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>
					</el-card>-->
					<el-card shadow="hover" class="margin-b-10 card-el-item">
						<el-col :span="8">
							<div class="gh-wechat">
								<img src="~@/assets/img/gh.jpg" alt="" v-if="domainType != 4" />
								<img src="~@/assets/img/gh-qy.jpg" alt="" v-else />
							</div>
						</el-col>
						<el-col :span="16">
							<div class="text-wechat">
								<div style="margin-left:10px" class="wechat-header" v-if="domainType != 4">纳智助手-小程序</div>
								<div style="margin-left:10px" class="wechat-header" v-else>{{systemName}}</div>
								<div style="margin-left:10px" class="wechat-slogen">即刻访问，让教育变得更简单！</div>
								<div style="margin-left:10px;color:#999999;" class="wechat-slogen">请使用手机微信扫一扫~</div>
							</div>
						</el-col>
					</el-card>
					<el-card shadow="hover" class="margin-b-10 card-el-item">
						<el-col :span="8">
							<div class="gh-wechat">
								<img src="~@/assets/img/app.png" alt="" v-if="domainType != 4" />
								<img src="~@/assets/img/gh-qy.jpg" alt="" v-else />
							</div>
						</el-col>
						<el-col :span="16">
							<div class="text-wechat">
								<div style="margin-left:10px" class="wechat-header" v-if="domainType != 4">纳智助手-APP</div>
								<div style="margin-left:10px" class="wechat-header" v-else>{{systemName}}</div>
								<div style="margin-left:10px" class="wechat-slogen">掌上教育，让教育变得更简单！</div>
								<div style="margin-left:10px;color:#999999;" class="wechat-slogen">请使用手机浏览器扫一扫~</div>
							</div>
						</el-col>
					</el-card>
				</el-col>

			</el-row>
		</template>
		<!-- 弹窗, 新增 / 修改 -->
		<el-dialog title="自定义工作台" :visible.sync="dialogFormVisible" :modal=true :close-on-click-modal=true class="dialog-card">
			<el-form :rules="rules" ref="dataForm" :model="dataForm" label-position="right" label-width="100px">
				<el-collapse v-model="activeNames">
					<template v-for="item in microList">
						<el-collapse-item :name="item.applicationId">
							<template slot="title">
								{{item.applicationName}}
							</template>
							<el-checkbox-group v-model="dataForm.checkCardList">
								<el-checkbox v-for="cardi in item.list" :label="cardi.mpId">{{cardi.mpName}}</el-checkbox>
							</el-checkbox-group>
						</el-collapse-item>

					</template>
				</el-collapse>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="saveCardData" :loading="addLoading">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogBookVisible" :modal=true :close-on-click-modal=true>
			<el-form :rules="bookRules" ref="bookForm" :model="bookForm" label-position="right" label-width="100px">
				<el-form-item label="标题" prop="title">
					<el-input v-model.trim="bookForm.title" placeholder="请输入标题" maxlength="30" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="内容" prop="content">
					<el-input type="textarea" rows="10" v-model="bookForm.content" placeholder="请输入内容" maxlength="500" show-word-limit></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogBookVisible = false">取消</el-button>
				<el-button type="primary" @click="bookSaveHandle(dialogStatus)" :loading="bookSaveLoading">确定</el-button>
			</div>
		</el-dialog>
		<!--<remote-js src="http://pv.sohu.com/cityjson?ie=utf-8"></remote-js>-->
	</div>
</template>
<style>
	.test-fc .full-calendar-header {
		border-bottom: 1px solid #CCCCCC;
		padding-bottom: 10px;
	}

	.test-fc .full-calendar-body .dates .week-row {
		border: none;
	}

	.test-fc .full-calendar-body .dates .week-row .day-cell {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		color: #292621;
		font-size: 15px;
		border: none;
	}

	.test-fc .full-calendar-body .dates .week-row .day-cell.today {
		background-color: #FEB23A;
		border-radius: 50%;
		color: #ffffff;
	}

	.test-fc .weeks {
		color: #8A857C;
		background-color: #ffffff;
		border: none !important;
	}

	.test-fc .weeks .week {
		border-right: none !important;
	}
</style>
<script>
	import {
		clearLoginInfo
	} from '@/utils'
	import {
		getCommHttpData,
		getDomainType,
		getCommonDictByType
	} from '@/utils/common'
	import {
		FullCalendar
	} from 'vue-fullcalendar'
	import ComFooter from './com-footer'
	import EduInfo from './index-coms/edu-info'
	import EduProfile from './index-coms/edu-profile'
	import MediaEdu from './index-coms/media-edu'
	import MediaSchool from './index-coms/media-school'
	import AreaProfile from './index-coms/area-profile'
	import SchoolProfile from './index-coms/school-profile'
	import VisualizationSystem from './index-coms/visualization-system'

	import DataStatistics from './index-coms/data-statistics'
	import MediaConstruction from './index-coms/media-construction'
	import MediaMonitor from './index-coms/media-monitor'
	import SchoolStatistics from './index-coms/school-statistics'

	import ClassProfile from './index-coms/class-profile'
	import ClassInteract from './index-coms/class-interact'
	import SchoolTimetable from './index-coms/school-timetable'
	import SchoolTimetableClass from './index-coms/school-timetable-class'

	import DataCenter from './index-coms/data-center'
	import App from './index-coms/app'
	import errorImgUrl from '@/assets/img/app-icon.png'
	import md5 from 'js-md5'
	const defaultImg = require('../../assets/img/pic_avatar.jpg')
	export default {
		data() {
			return {
				greeting:'',
				currentRoleName:'',
				systemName: window.SITE_CONFIG.systemName,
				instituteList: ['hzyjy', '魏永霞', 'duzheyjy', '郜芹', '惠众研究院'],
				colorArr: ['rgba(138,190,120,0.2)', 'rgba(254,178,58,0.2)', 'rgba(60,133,238,0.2)'],
				colorArr1: ['#FF943D', '#3C85EE', '#FEB23A', '#8ABE78', '#E1BF6C', '#F15643','#3C85EE'],
				imgUrl: window.SITE_CONFIG.imgIP,
				allPic: errorImgUrl,
				userId: this.GLOBAL.getUserId(),
				userType: this.GLOBAL.getUserType(),
				defaultPic: defaultImg,
				domainType: getDomainType(),
				orgId: '',
				subList: [],
				loading: false,
				monthData: [],
				userName: '',
				userTypeList: [],
				classInfo:'',
				myMicroList: [],
				microList: [],
				showName: '',
				showPopoper: '',
				imgShow: [{
					id: 3,
					url: require('../../assets/img/card3.png')
				}, {
					id: 4,
					url: require('../../assets/img/card4.png')
				}],
				zh: {
					weekNames: ['一', '二', '三', '四', '五', '六', '日'],
					monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '11月', '12月'],
					titleFormat: 'yyyy年MM月'
				},
				weekNames: ['日', '一', '二', '三', '四', '五', '六'],
				titleFormat: 'yyyy/MM',
				userTypeCurr: '',
				imgIp: window.SITE_CONFIG.imgIP,
				userAvatar: '',
				defaultImg: defaultImg,
				errorGoodsImg: 'this.src="' + defaultImg + '";this.onerror = null',
				dialogFormVisible: false,
				dataForm: {
					checkCardList: []
				},
				rules: {
					parentName: [{
						required: true,
						message: '不能为空',
						trigger: 'change'
					}]
				},
				activeNames: [],
				addLoading: false,
				courseList: [],
				cardLoading: false,
				iframeSrc: 'http://i.tianqi.com/index.php?c=code&id=55&py=xian',
				appHeight: 800,
				appDialogFormVisible: false,
				appSortList: [],
				appLoading: false,
				applicationList: [],
				likeList: [],
				bookList: [],
				bookListLoading: false,
				bookSaveLoading: false,
				dialogBookVisible: false,
				bookForm: {
					title: '',
					content: ''
				},
				bookRules: {
					title: [{
						required: true,
						message: '标题不能为空',
						trigger: 'blur'
					}],
					content: [{
						required: false,
						message: '内容不能为空',
						trigger: 'blur'
					}]
				},
				helpList: [],
				appCloseList: [],
				isAllAppShow: false,
				textMap: {
					update: '编辑备忘录',
					create: '添加备忘录',
					look: '查看备忘录'
				},
				dialogStatus: '',
				appLg: 3
			}
		},
		filters: {
			textFilter(item, len) {
				if (item.length > len) {
					item = item.substr(0, len) + '...'
				}
				return item
			},
		},

		components: {
			ComFooter,
			EduInfo,
			EduProfile,
			MediaEdu,
			MediaSchool,
			SchoolProfile,
			AreaProfile,
			App,
			VisualizationSystem,
			DataCenter,
			DataStatistics,
			MediaConstruction,
			MediaMonitor,
			SchoolStatistics,
			ClassProfile,
			ClassInteract,
			SchoolTimetable,
			SchoolTimetableClass,
			'full-calendar': require('vue-fullcalendar'),
			'remote-js': {
				render(createElement) {
					return createElement('script', {
						attrs: {
							type: 'text/javascript',
							src: this.src
						}
					});
				},
				props: {
					src: {
						type: String,
						required: true
					},
				}
			}
		},
		computed: {
			sideSubFold: {
				get() {
					return this.$store.state.common.sideSubFold
				},
				set(val) {
					this.$store.commit('common/updateSideSubFold', val)
				}
			},
			sideMenuApp: {
				get() {
					return this.$store.state.common.sideMenuApp
				},
				set(val) {
					this.$store.commit('common/updateSideMenuApp', val)
				}
			}
		},
		created() {
			this.sideSubFold = false
			this.sideMenuApp = false
			/*this.getUserInfo();
			this.getRole()*/
		},
		mounted() {
			this.sideSubFold = false
			this.sideMenuApp = false
			//getCommonDictByType(this, 'application_sort', 'appSortList')
			this.getBookList()
			this.getAppList()
			//班牌1，课堂2，集控3,课题4, 其他0
			if (this.domainType == 1) {
				this.imgShow = [{
					id: 1,
					url: require('../../assets/img/card1.png')
				}]
			} else if (this.domainType == 2) {
				this.imgShow = [{
					id: 2,
					url: require('../../assets/img/card2.png')
				}]
			} else if (this.domainType == 3) {
				this.imgShow = [{
					id: 2,
					url: require('../../assets/img/card2.png')
				}, {
					id: 3,
					url: require('../../assets/img/card3.png')
				}, {
					id: 4,
					url: require('../../assets/img/card4.png')
				}]
			} else if (this.domainType == 4) {
				this.imgShow = []
			} else {
				this.imgShow = [{
					id: 1,
					url: require('../../assets/img/card1.png')
				}, {
					id: 2,
					url: require('../../assets/img/card2.png')
				}, {
					id: 3,
					url: require('../../assets/img/card3.png')
				}, {
					id: 4,
					url: require('../../assets/img/card4.png')
				}]
			}
			this.getAppLgWidth()
			window.addEventListener('resize', () => {

				this.getAppLgWidth()
				this.appHeight = window.innerHeight - 50
			})
			setTimeout(() => {
				this.getUserInfo()
				this.getMyMicroList()
				this.getMicroList()
			}, 1000)
			this.appHeight = window.innerHeight - 50
			this.userTypeCurr = parseInt(this.userType)
		},
		methods: {
			handleCommand(command){
				this.currentRoleName = this.userTypeList[0].roleNameList[command]
				let roleId = this.userTypeList[0].roleIdList[command]
				this.$cookie.set('currentRoleName',this.currentRoleName)
				this.$cookie.set('roleId',roleId)
				getCommHttpData({
					url: 'uc/user/changeUserRole',
					method: 'get',
					contentType: 1,
					that: this,
					data: {
						roleId: roleId
					},
				}, function(data) {
					window.location = location.href
					
				})
			},

			getAppLgWidth() {
				if (window.innerWidth <= 1700 && window.innerWidth > 1400) {
					this.appLg = 6
				} else if (window.innerWidth <= 1400 && window.innerWidth > 1200) {
					this.appLg = 8
				} else if (window.innerWidth > 1700) {
					this.appLg = 4
				} else {
					this.appLg = 12
				}
			},
			thirdLink(type) {
				if (type == 1) {
					window.open('https://support.qq.com/products/46942/faqs/51822', '_blank')
				} else {
					window.open('https://support.qq.com/products/46942', '_blank')
				}

			},
			officialWebsiteLink() {
				var a = document.createElement("a");
				a.setAttribute("href", "http://www.nuggetdata.com");
				a.setAttribute("target", "_blank");
				a.click();
			},
			addCard() {
				this.dialogFormVisible = true
			},
			saveCardData() {
				this.cardLoading = true
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						var that = this
						that.addLoading = true

						getCommHttpData({
							url: 'uc/micro/saveMyMicroParts',
							method: 'post',
							contentType: 2,
							operateType: 2,
							that: this,
							data: {
								list: this.dataForm.checkCardList
							},
						}, function(data) {
							that.cardLoading = false
							that.addLoading = false
							that.appDialogFormVisible = false
							that.getMyMicroList()
							that.getMicroList()
						})
					}
				})
			},

			getUserTypeChange() {
				let that = this;
				getCommHttpData({
					url: 'application/getProductByRole',
					method: 'post',
					contentType: 1,
					data: {
						userType: this.userTypeCurr,
						roleId:this.$cookie.get('roleId')
					},
				}, function(data) {
					that.$cookie.set('userType', that.userTypeCurr)
					that.getDeptInfo()

				})
			},
			getDeptInfo() {
				let that = this;
				//当前身份下的机构
				getCommHttpData({
					url: 'uc/user/userDept',
					method: 'get',
					contentType: 1,
					data: {
						userType: this.userTypeCurr
					},
				}, function(data) {
					that.$cookie.set('orgId', data.list[0].dept_id)
					let deptIds = new Array()
					for (let i in data.list) {
						deptIds.push(data.list[i].dept_id)
					}
					localStorage.setItem('orgEntity', JSON.stringify({
						orgId: data.list[0].dept_id,
						orgName: data.list[0].name,
						deptIds: deptIds.toString()
					}))
					window.location.reload()
				})
			},
			getMyMicroList() {
				let that = this;
				let productList = JSON.parse(sessionStorage.getItem('productList') || '[]')
				let menuList = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
				let productIds = new Array()
				let menuIds = new Array()
				for (let i in productList) {
					productIds.push(productList[i].productId)
				}
				for (let i in menuList) {
					menuIds.push(menuList[i].meta.menuId)
				}
				getCommHttpData({
					url: 'uc/micro/myList',
					method: 'get',
					contentType: 1,
					data: {
						productIds: productIds.toString(),
						menuIds: menuIds.toString()
					},
				}, function(data) {
					that.myMicroList = data.list
					let tempList = new Array()
					for (let i in that.myMicroList) {
						tempList.push(that.myMicroList[i].mpId)
					}
					that.dataForm.checkCardList = tempList
				})
			},
			getMicroList() {
				let that = this;
				let productList = JSON.parse(sessionStorage.getItem('productList') || '[]')
				let menuList = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
				let productIds = new Array()
				let menuIds = new Array()
				for (let i in productList) {
					productIds.push(productList[i].productId)
				}
				for (let i in menuList) {
					menuIds.push(menuList[i].meta.menuId)
				}
				getCommHttpData({
					url: 'uc/micro/list',
					method: 'get',
					contentType: 1,
					data: {
						productIds: productIds.toString(),
						menuIds: menuIds.toString()
					},
				}, function(data) {
					that.microList = data.list
					//					let tempList = new Array()
					//					for(let i in that.microList) {
					//						tempList.push(that.microList[i].applicationId)
					//					}
					//					that.activeNames = tempList
				})
			},
			deleteCard(microId) {

				//删除此卡片
				var that = this
				let deleteList = that.dataForm.checkCardList
				deleteList.splice(deleteList.findIndex(item => item === microId), 1)

				getCommHttpData({
					url: 'uc/micro/saveMyMicroParts',
					method: 'post',
					contentType: 2,
					operateType: 2,
					that: this,
					data: {
						list: deleteList
					},
				}, function(data) {
					//that.cardLoading = false
					that.getMyMicroList()
					that.getMicroList()
				})

			},
			// 获取当前管理员信息
			getUserInfo() {
				this.loading = false
				let that = this
				getCommHttpData({
					url: 'uc/user/userInfo',
					method: 'get',
					contentType: 1,
					data: {
						userId: this.userId
					}
				}, function(data) {
					that.loading = false
					that.userTypeList = data.user.userInfo
					that.classInfo = data.user.userInfo[0].classInfo
					that.currentRoleName = data.user.currentRoleName
					that.userId = data.user.userId
					that.userName = data.user.fullName
					that.userAvatar = data.user.imageUrl
					var arr = [];
					for (var i = 0; i < that.userTypeList.length; i++) {
						if (that.userTypeList[i].userType == data.user.userType) {
							that.showName = that.userTypeList[i].deptName
							that.showPopoper = that.userTypeList[i].deptNameList.length > 1 ? true : false
						}
					}
					let now = new Date(),hour = now.getHours()
					if (hour > 0 && hour <= 12){that.greeting = "上午好！"} 
					else if (hour > 12 && hour <= 18){that.greeting = "下午好！"} 
					else {that.greeting = "晚上好！"} 
				})

				//				getCommHttpData({
				//					url: 'ipToCity/select/' + returnCitySN.cip,
				//					method: 'get',
				//					contentType: 1,
				//					data: {}
				//				}, function(data) {
				//					that.iframeSrc = 'http://i.tianqi.com/index.php?c=code&id=55&py=' + data.page.citySpell
				//				})
			},
			getAppList() {
				let that = this
				that.appLoading = false
				getCommHttpData({
					url: 'application/getListByRole',
					method: 'get',
					contentType: 1,
					data: {
						roleId:this.$cookie.get('roleId')
					}
				}, function(data) {
					that.appLoading = false
					that.applicationList = data.list
					console.log(that.applicationList,'applicationListapplicationList')
					let appCloseList = []
					data.list.forEach(item => {
						if (item.list.length > 0) {
							item.list.forEach(aitem => {
								appCloseList.push(aitem)
							})
						}
					})
					if (data.likeList != undefined) {
						that.likeList = data.likeList
						if (data.likeList.length > 0) {
							//最近使用
							// that.appCloseList = data.likeList
							that.appCloseList = appCloseList
						} else {
							that.appCloseList = appCloseList
						}
					} else {
						that.appCloseList = appCloseList
					}
				})


			},
			//跳转链接
			productMenuLink(menuIds, productId, menuUrl, productName, isThirdSys) {
				console.log(arguments,'argument')
				//保存使用的应用
				let that = this;
				if (menuIds != undefined || menuUrl != '') {
					getCommHttpData({
						url: 'sys/sysuseapplication/save',
						method: 'post',
						contentType: 2,
						data: {
							userId: this.GLOBAL.getUserId(),
							productId: productId
						},
					}, function(data) {

					})
				}

				if (menuIds != undefined && isThirdSys == 0) {
					this.sideSubFold = false
					this.sideMenuApp = true
					let menuIdList = menuIds.split(',')
					this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
					//menuIdList.forEach(mitem => {
					let mitem = parseInt(menuIdList[0])
					var route = this.dynamicMenuRoutes.filter(item => item.meta.productId === productId)

					if (route.length >= 1) {
						sessionStorage.setItem('curApp', JSON.stringify({
							id: productId,
							name: productName,
							curMenu: route[0].meta.menuId
						} || ''))
						this.$router.push({
							name: route[0].name
						})
					}
					//})
				} else if (menuUrl != undefined && menuUrl != '') {
					//第三方跳转
					let isOpen = menuUrl && menuUrl.substr(0, 4) == 'http' ? true : false
					if (isOpen) {
						let accesstoken = this.$cookie.get('accesstoken')
						menuUrl = menuUrl.replace(/{token}/, accesstoken)
						menuUrl = menuUrl.replace(/{productId}/, productId)
            menuUrl = menuUrl.replace(/{orgId}/,this.GLOBAL.getOrgId())
						if (isThirdSys == 0) {
							this.$router.push({
								name: 'system-second',
								query: {
									url: menuUrl
								}
							})
						} else {

							if (menuUrl.indexOf('openapi.shijieu') > -1) {
								this.shijieLink(menuUrl);
							} else {
								window.open(menuUrl);
							}
							// window.open(menuUrl);
						}
						//token  信息
						//用户类型
						// if(menuUrl.indexOf('qxt2000') > -1 || menuUrl.indexOf('xst360') > -1){
						// 	window.open( menuUrl);
						// }else{
						// 	window.open( menuUrl+'&hpUserType='+this.userType);
						// }

					}
					//window.open(menuUrl,'_blank')
				} else {
					this.$alert(productName + '尚未接入平台!', '系统提示', {
						dangerouslyUseHTMLString: true,
						confirmButtonText: '关闭',
						cancelButtonText: '取消',
						type: ''
					}).then(() => {

					}).catch(() => {

					});
				}
			},
			//生涯规划系统
			async shijieLink(shijieLinkUrl) {
				var userType = this.userType;
				var shijieUrl = 'third/party/getSjInfo';
				var shijieJson;
				if (userType == 3) {
					shijieJson = {
						schoolId: this.schoolId
					};
					var userId = this.GLOBAL.getUserId();
					shijieUrl = '/third/party/stuInfo';
					shijieJson = {
						userId: userId
					};
				} else {
					shijieJson = {
						schoolId: this.schoolId
					};
				}
				let teaRes = null
				let that = this
				await getCommHttpData({
					url: shijieUrl,
					method: 'post',
					contentType: 2,
					data: shijieJson,
				}, function(res) {
					teaRes = res
					var linkObj = '',
						tsignature = '',
						ishref = '';
					var teaResList = teaRes.list;
					if (userType == 3) {
						if (!teaResList.schoolSharaCode) {
							that.$message.error('该学校暂未开通生涯规划系统，敬请期待！')
							return;
						}
						teaResList.mobile = teaResList.mobile = '' || teaResList.mobile == undefined ? '18866666666' : teaResList.mobile;
						linkObj = {
							school_shara_code: teaResList.schoolSharaCode,
							mobile: teaResList.mobile,
							school_stu_num: teaResList.userName,
							grade_year: teaResList.gradeClassName,
							grade_id: teaResList.sjGradeId,
							class_id: parseInt(teaResList.classId),
							real_name: teaResList.name,
							gender: teaResList.sex,
							appkey: teaResList.appKey,
							signtype: "md5"
						};
						tsignature = md5(that.objKeySort(linkObj) + teaRes.list.appSecret);
						ishref = shijieLinkUrl + '/openapi/students/login?school_shara_code=' + teaResList.schoolSharaCode +
							'&mobile=' + teaResList.mobile + '&school_stu_num=' + teaResList.userName + '&grade_year=' + teaResList.gradeClassName
							.substr(1, 4) + '&grade_id=' + teaResList.sjGradeId + '&class_id=' + parseInt(teaResList.classId.substr(16, 2)) +
							'&real_name=' + teaResList.name + '&gender=' + teaResList.sex + '&appkey=' + teaResList.appKey +
							'&signtype=md5&signature=' + tsignature

					} else {
						linkObj = {
							school_shara_code: teaResList.schoolSharaCode,
							mobile: teaResList.mobile,
							real_name: "管理员",
							job_title: "心理老师",
							appkey: teaResList.appKey,
							signtype: "md5"
						}
						tsignature = md5(that.objKeySort(linkObj) + teaRes.list.appSecret);
						ishref = shijieLinkUrl + '/openapi/teacher/login?school_shara_code=' + teaRes.list.schoolSharaCode +
							'&mobile=' + teaRes.list.mobile + '&real_name=管理员&job_title=心理老师&appkey=' + teaRes.list.appKey +
							'&signtype=md5&signature=' + tsignature;
					}


					window.open(ishref);
				})

			},
			objKeySort(obj) {
				var newkey = Object.keys(obj).sort();
				var newObj = {};
				for (var i = 0; i < newkey.length; i++) {
					newObj[newkey[i]] = obj[newkey[i]];
				}
				var str = Object.values(newObj);
				var s = '';
				for (var i = 0; i < str.length; i++) {
					s += str[i]
				}
				return s;
			},
			resetBookForm() {
				this.bookForm = {
					title: '',
					content: ''
				}
			},
			addBook() {
				this.dialogBookVisible = true
				this.resetBookForm()
				this.dialogStatus = 'create'
				this.$nextTick(() => {
					this.$refs['bookForm'].clearValidate()
				})
			},
			updateBook(row) {
				this.resetBookForm()
				this.bookForm = Object.assign({}, row) // copy obj
				this.dialogStatus = 'update'
				this.dialogBookVisible = true
				this.$nextTick(() => {
					this.$refs['bookForm'].clearValidate()
				})
			},
			//备忘录 查询
			getBookList() {
				let that = this
				that.bookListLoading = false
				getCommHttpData({
					url: 'sys/sysmemorandumbook/list',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					that.bookListLoading = false
					that.bookList = data.list

				})
			},
			//备忘录 添加
			bookSaveHandle() {
				this.$refs['bookForm'].validate((valid) => {
					if (valid) {
						let that = this
						that.bookSaveLoading = false
						getCommHttpData({
							url: `sys/sysmemorandumbook/${this.dialogStatus== 'create' ? 'save' : 'update'}`,
							method: 'post',
							contentType: 2,
							operateType: 2,
							that: this,
							data: this.bookForm
						}, function(data) {
							that.dialogBookVisible = false
							that.bookSaveLoading = false
							that.getBookList()
						})
					}
				})
			},
			//备忘录 删除
			bookDelHandle() {
				let that = this

				getCommHttpData({
					url: 'sys/sysmemorandumbook/delete',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {

				})


			},
		}
	}
</script>
<style scoped lang="scss">
	#imgs {
		display: inline-block;
		height: 90px;
		width: 90px;
		border-radius: 50%;
	}
</style>
