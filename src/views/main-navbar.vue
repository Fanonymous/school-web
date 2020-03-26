<template>
	<nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">

		<div class="site-navbar__body clearfix" style="padding-right: 0;">
			<div class="site-navbar__header">
				<h1 class="site-navbar__brand">
					<img src="~@/assets/img/logo.png" width="" height="30px" />
				</h1>
			</div>
			<el-menu v-if="userType != 7" class="site-navbar__menu site-navbar__menu-margin-l10" mode="horizontal">
				<el-menu-item :class="this.$route.name == 'index'&& isActive == 1 ? 'navbar-checked-switch' : ''" class="site-navbar__switch"
				 @click="$router.push({ name: 'index' });isActive = 1">
					<img src="~@/assets/img/icons/index2.png" style="width:18px;height:18px;margin-right:15px;" />
					<font size="3">我的工作台</font>
				</el-menu-item>
				<el-menu-item class="site-navbar__switch" :class="isActive == 2 && productShow==true ? 'navbar-checked-switch' : ''">
					<el-popover popper-class="aside-popover" ref="popover-product" @show="onShowProduct" @hide="onHideProduct"
					 placement="right" width="popperWidth" v-model="visible2" transition="fade-in-linear" trigger="click">
						<div slot="reference">
							<img src="~@/assets/img/icons/index1.png" style="width:18px;height:18px;margin-right:15px;" />
							<font size="3">全部产品</font>
						</div>
						<div :style=" 'height: '+(productList.length >6 ? sideHeight : '565')+'px;margin-left: 0px;padding: -12px;overflow: hidden;'"
						 v-show="productShow">
							<div class="scrool-product" style="width:200px;height:100%;float: left;font-size:14px;overflow: auto;border: 1px solid #C3CCE2;">
								<div class="aside-left-menu" style="height:100%">
									<div class="popover-title">收藏</div>
									<template v-for="(menu,index) in collectMenuList">
										<div class="left-popover" style="position: relative;" @click="productChange('childrens',menu.productId,'','',menu.menuId)">
											<span class="left-popover-icon" style="position: absolute; top: 15px;left: 22px;">
												<img class="icon_blue" v-real-img="imgUrl+menu.iconPath" :src="defaultImg" width="16px" height="16px" />
											</span>
											<span style="position: absolute; left: 52px; top: 16px;">{{menu.menuName.length > 6 ? menu.menuName.substr(0,6)+'...': menu.menuName}}</span>
											<i class="el-collect_icon el-icon el-icon-close" @click.stop="cancelCollect(menu.productId,menu.menuId,index)"></i>
										</div>
									</template>
								</div>
							</div>
							<!--菜单列表-->
							<div class="product-list scrool-product" :style="'height:100%;min-height: '+(productList.length >6 ? sideHeight : '565')+'px;width:'+sideWidthLeft+'px;overflow-y: auto;overflow-x: hidden; position: relative;padding-left: 35px;padding-right: 35px;'">
								<div style="height: 60px;background-color: #FFFFFF;">
									<el-input @mouseout.native="showSearch()" v-model.trim="keywords" prefix-icon="el-icon-search" clearable
									 placeholder="搜索平台产品" class="keywords"></el-input>
								</div>

								<div v-if="productList.length == 0" style="width:100%; text-align: center;">
										<div class="margin-bottom-20" style="margin-top: 130px;"><img src="~@/assets/img/datano.png" /></div>
										<div>暂无数据</div>
								</div>
								<div v-else style="display: inline-block;">
									<div v-loading="dataListLoading" class="product-cont-waterfall" :style="'width: '+(sideWidthLeft-50)+'px;'">
										<el-row v-for="rIndex of Math.ceil(productList.length/columnNum)" :key="rIndex">
											<template v-for="(productItem,pindex) in productList">
												<el-col :span="columnCount" v-if="pindex < columnNum && productList[(rIndex-1)*columnNum+pindex]">
													<div class="product-item" v-if="applicationSort==0  || ( applicationSort == productList[(rIndex-1)*columnNum+pindex].applicationSort)">
														<div class="product-content">

															<div :id="productList[(rIndex-1)*columnNum+pindex].productId+'productId'" class="header-panel app-header">
																{{productList[(rIndex-1)*columnNum+pindex].forShort}}
																<span v-if="productList[(rIndex-1)*columnNum+pindex].menuList.length == 0 && productList[(rIndex-1)*columnNum+pindex].url.indexOf('http') == -1"
																 style="color: #CCCCCC;font-weight: 100;">(尚未接入)</span>
															</div>
															<template v-if="productList[(rIndex-1)*columnNum+pindex].url.indexOf('http') != -1">
																<div>
																	<div class="header-menu icon-menu-item">
																		<label class="label-item2" @click="routerThirdLink(productList[(rIndex-1)*columnNum+pindex].url,productList[(rIndex-1)*columnNum+pindex].productId,productList[(rIndex-1)*columnNum+pindex].isThirdSys)">
																			<div class="icon-pro">
																				<img class="icon_white" v-real-img="imgUrl+productList[(rIndex-1)*columnNum+pindex].icon" :src="defaultImg" width="14px" />
																			</div>
																			{{productList[(rIndex-1)*columnNum+pindex].forShort}}
																		</label>
																	</div>
																</div>
															</template>
															<div v-for="(item1,index1) in productList[(rIndex-1)*columnNum+pindex].menuList">
																<div class="header-menu icon-menu-item" v-if="item1.parentId == '1'">
																	<label class="label-item2" @click="productChange('childrens',productList[(rIndex-1)*columnNum+pindex].productId,pindex,index1,item1.menuId)">
																		<div class="icon-pro">
																			<img class="icon_white" v-real-img="imgUrl+item1.icon" :src="defaultImg" width="14px" />
																		</div>
																	{{item1.menuName}}</label>
																	<el-rate v-if="parseInt(item1.isCollect) == 0" class="rate-star" value.number="item1.isCollect" :max="1"
																	 void-color="#ffffff" :colors="colors" @change="saveOrCancelStar(productList[(rIndex-1)*columnNum+pindex].productId,item1.menuId,item1.isCollect)"></el-rate>
																	<el-rate v-else :value.number="1" :max="1" :colors="colors" void-color="#ffffff" @change="saveOrCancelStar(productList[(rIndex-1)*columnNum+pindex].productId,item1.menuId,item1.isCollect)"></el-rate>

																</div>
															</div>
														</div>
													</div>
												</el-col>
											</template>
										</el-row>
									</div>
								</div>
							</div>
						</div>
					</el-popover>
				</el-menu-item>
			</el-menu>
			<el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
				<el-menu-item class="site-navbar__switch1" style="margin-right:64px">
					<el-input class="input-class" suffix-icon="el-icon-search" v-model="keywords1" @focus="handleFoucs" placeholder="搜索平台产品" v-clickoutside="handleClose"></el-input>
					<transition name="el-zoom-in-top">
						<div class="drop-down el-select-dropdown el-popper select--list" v-show="visibleSelect" v-loading="loadingSe">
							<div class="el-scrollbar">
								<div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -17px; margin-right: -17px;" v-if="productList1.length > 0">
									<ul class="el-scrollbar__view el-select-dropdown__list">							
										<ul class="el-select-group__wrap el-select-group-pad" v-for="(group,pindex) in productList1" :key="group.productId">
											<li class="el-select-group__title" style="cursor: auto;">{{group.forShort}}</li>
											<li>
												<ul class="el-select-group">
													<li class="el-select-dropdown__item" :class="keywords1 == group.applicationName ? 'selected': ''" v-if="group.url.indexOf('http') != -1" @click="changeRouter(group);routerThirdLink(group.url,group.productId,group.isThirdSys)">
														<span>{{group.forShort}}</span>
													</li>
													<li v-else-if="group.menuList.length == 0 && group.url.indexOf('http') == -1" class="el-select-dropdown__item">
														<span>(尚未接入)</span>
													</li>
													<template v-for="(item,index1) in group.menuList">
														<li v-if="item.parentId == '1'" :class="keywords1 == item.menuName ? 'selected': ''" @click="changeRouter(item);productChange('childrens',group.productId,pindex,index1,item.menuId)" class="el-select-dropdown__item"><span>{{item.menuName}}</span></li>
														<!-- <template v-if="item.children.length>0" v-for="(item1,index2) in item.children">
															<template v-if="item1.children.length>0" v-for="(item2,index3) in item1.children">
																<li class="el-select-dropdown__item" :class="keywords1 == item2.menuName ? 'selected': ''" @click="changeRouter(item2);productChange(group.productId,pindex,index1,item1.menuId,item2.menuId)"><span>{{item2.menuName}}</span></li>
															</template>
															<li class="el-select-dropdown__item" :class="keywords1 == item1.menuName ? 'selected': ''" @click="changeRouter(item1);productChange(group.productId,pindex,index1,item1.menuId)"><span>{{item1.menuName}}</span></li>
														</template> -->
													</template>
												</ul>
											</li>
										</ul>
									</ul>
								</div>
								<p class="el-select-dropdown__empty" v-if="productList1.length == 0">
								  无匹配数据
								</p>
							</div>
						</div>
					</transition>
				</el-menu-item>
				<el-menu-item class="site-navbar__avatar site-navbar__switch1" index="3">
					<el-popover popper-class="aside-popover" placement="right" width="350" v-model="dialogFormVisible" transition="fade-in-linear"
					 trigger="click">
						<div slot="reference">
							<el-badge :value="noReadCount" v-if="noReadCount >0" class="item">
								<i class="el-icon-bell" style="color: #FFFFFF;font-size: 22px;"></i>
							</el-badge>
							<i class="el-icon-bell" v-else style="color: #FFFFFF;font-size: 22px;"></i>
						</div>
						<div class="app-popper__right" :style="'height: '+appHeight-200+'px;overflow: auto'">
							<div class="app-popover-title">
								<div style="display:inline-block;">消息通知</div>
								<el-button size="small" style="margin-left: 187px;" @click="setReadMessageList">全部标记已读</el-button>
							</div>
							<el-form :loading="listLoading" id="message-list-box" :style="'height: '+appFormHeight+'px;overflow: auto;marging-bottom:100px;padding-bottom:100px;'"
							 :rules="rules" ref="dataForm" :model="dataForm" label-position="right" label-width="100px">
								<div v-if="messageList.length==0" style="text-align: center;color:#CCCCCC;padding-top: 60%;padding-bottom: 60%;">
									<img src="~@/assets/img/icons/nodata-msg.png" style="margin-bottom: 20px;" /></br>
									<span>暂无消息</span>
								</div>
								<div v-for="item in messageList" class="message-navbar-item">
									<div @click="getMsgDetail(item.msgId,item.isRead,item.id,item.type)">
										<div class="item-right">
											<div class="item-name margin-bottom-10">
												<img :src="msg12" v-if="item.type ==1" />
												<img :src="msg8" v-else-if="item.type ==2" />
												<img :src="msg11" v-else-if="item.type ==3" />
												<img :src="msg10" v-else-if="item.type ==4" />
												<img :src="msg13" v-else-if="item.type ==5" />
												<img :src="msg9" v-else-if="item.type ==6" />
												<img :src="msg14" v-else-if="item.type ==7" />
												<img :src="msg15" v-else />&nbsp;&nbsp;
												<el-badge :is-dot="item.isRead == 0" class="item message-list-dot">
													<span class="message-senduser">{{item.sendUserName}}</span>
												</el-badge>
												<span style="display: inline-block;float: right;">{{item.createTime | dateFilter}}</span>
											</div>
											<div class="item-title">{{item.title}} <span style="display: inline-block;float: right;" class="mseeage-bold">{{item.typeName || '通知公告'}}</span></div>
										</div>
									</div>

								</div>
							</el-form>
							<div slot="footer" class="popper-footer" style="position: fixed;bottom: 0px;width: 100%;background-color: #FFFFFF;padding: 20px 0px;">
								<el-button @click="dialogFormVisible = false" type="primary" size="small">关闭</el-button>
								<el-button size="small" style="margin-left: 187px;" @click="getMsgDetail(0)">查看全部通知</el-button>
							</div>
						</div>
					</el-popover>
				</el-menu-item>
				<el-menu-item class="site-navbar__avatar site-navbar__switch1" style="padding-right:10px;padding-left: 10px;" index="3"
				 @click="$router.push({name:'userinfo', params: {id: ''}})">
					<span class="el-dropdown-link">

						<img style="width:34px;height:34px;" v-real-img="imgIp+userAvatar" :src="defaultPic">
						{{ userName }}
					</span>
				</el-menu-item>
				<el-menu-item class="site-navbar__avatar site-navbar__switch1" index="3">
					<el-dropdown trigger="click" @command="handleCommand" v-if="roleNameList && roleNameList.length > 1">
					  <span class="el-dropdown-link" style="outline: none;text-decoration:underline">
						{{currentRoleName ? currentRoleName : ''}}
					  </span>
					  <el-dropdown-menu slot="dropdown">
						<el-dropdown-item v-for="(item,uIndex) in roleNameList" :command="uIndex">{{item}}</el-dropdown-item>
					  </el-dropdown-menu>
					</el-dropdown>
					<span class="el-dropdown-link" style="outline: none;text-decoration:underline" v-else>
											{{currentRoleName ? currentRoleName : ''}}
					</span>
				</el-menu-item>
				<el-menu-item class="site-navbar__avatar site-navbar__switch1" index="3" @click="logoutHandle()">
					<img src="~@/assets/img/out.png" style="height: 18px;width:18px;vertical-align:middle" />
				</el-menu-item>
			</el-menu>
		</div>
		<!-- 弹窗, 修改密码 -->
		<update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
		<update-userinfo v-if="updateUserInfoVisible" ref="updateUserinfo"></update-userinfo>
	</nav>
</template>
<script>
	import UpdatePassword from './main-navbar-update-password'
	import UpdateUserinfo from './main-navbar-update-userinfo'
	import errorImgUrl from '@/assets/img/pic_avatar.jpg'
	import msg8 from '@/assets/img/icons/msg8.png'
	import msg9 from '@/assets/img/icons/msg9.png'
	import msg10 from '@/assets/img/icons/msg10.png'
	import msg11 from '@/assets/img/icons/msg11.png'
	import msg12 from '@/assets/img/icons/msg12.png'
	import msg13 from '@/assets/img/icons/msg13.png'
	import msg14 from '@/assets/img/icons/msg14.png'
	import msg15 from '@/assets/img/icons/msg16.png'
	//sidebar
	import {
		isURL
	} from '@/utils/validate'
	import {
		fnAddDynamicMenuRoutes1
	} from '@/router'
	import router from '@/router'
	import {
		getCommHttpData,
		getCommonDictByType
	} from '@/utils/common'
	import {
		clearLoginInfo
	} from '@/utils'
	import http from '@/utils/httpRequest'
	import defaultImg from '@/assets/img/default-pro.png'
	import md5 from 'js-md5'
	//end

	export default {
		data() {
			return {
				roleNameList:[],
				roleIdList:[],
				visibleSelect: false,
				loadingSe: false,
				colors: ['#ffffff', '#F7BA2A', '#FF9900'],
				userType: this.$cookie.get('userType'),
				imgIp: window.SITE_CONFIG.imgIP,
				updatePassowrdVisible: false,
				updateUserInfoVisible: false,
				messageVisible: false,
				defaultPic: errorImgUrl,
				errorGoodsImg: 'this.src="' + require('../assets/img/pic_avatar.jpg') + '";this.onerror = null',
				noReadCount: 0,
				apiUrl: process.env.BASE_API,
				visible: false,
				listLoading: false,
				messageList: [],
				dialogFormVisible: false,
				dataForm: {},
				activeNames: '',
				appHeight: 800,
				appFormHeight: 800,
				addLoading: false,
				rules: {},
				msg8: msg8,
				msg9: msg9,
				msg10: msg10,
				msg11: msg11,
				msg12: msg12,
				msg13: msg13,
				msg14: msg14,
				msg15: msg15,
				currPage: 1,
				totalPage: 0,
				reconnectTimeout: 5000,
				client: '',
				userId: this.GLOBAL.getUserId(),
				topic: '/notice/' + this.GLOBAL.getUserId(), // 订阅的主题
				//sidebar
				schoolId: this.GLOBAL.getOrgId(),
				imgUrl: window.SITE_CONFIG.imgIP,
				defaultImg: defaultImg,
				dynamicMenuRoutes: [],
				productListVisible: true,
				visible1: false,
				productList: [],
				productList1: [],
				value1: null,
				keywords: '',
				keywords1: '',
				dataListLoading: false,
				collectMenuList: [],
				visible2: false,
				sideHeight: 800,
				sideWidth: 200,
				sideWidthLeft: 1000,
				backColor: '#2e3743',
				loading: false,
				collectShow: false,
				productShow: false,
				popperWidth: 200,
				thirdLen: 0,
				myAppLen: 0,
				applicationSort: 0,
				appSortList: [],
				columnCount: '',
				columnNum: '',
				isActive: 1,
				isSelected: false
				//end

			}
		},
		filters: {
			dateFilter(item) {
				let temp = item.substr(0, 4)
				let str = item
				const today = new Date();
				if (parseInt(temp) == today.getFullYear()) {
					str = item.substr(5, 5)
				} else {
					str = item.substr(0, 10)
				}
				return str
			}
		},
		components: {
			UpdatePassword,
			UpdateUserinfo
		},
		computed: {
			navbarLayoutType: {
				get() {
					return this.$store.state.common.navbarLayoutType
				}
			},
			sideSubFold: {
				get() {
					return this.$store.state.common.sideSubFold
				},
				set(val) {
					this.$store.commit('common/updateSideSubFold', val)
				}
			},
			currentRoleName:{
				get() {
					return this.$cookie.get('currentRoleName')
				},
				set(val){
						this.$cookie.set('currentRoleName',val)
				}
			},
			sidebarFold: {
				get() {
					return this.$store.state.common.sidebarFold
				},
				set(val) {
					this.$store.commit('common/updateSidebarFold', val)
				}
			},
			sideMenuApp: {
				get() {
					return this.$store.state.common.sideMenuApp
				},
				set(val) {
					this.$store.commit('common/updateSideMenuApp', val)
				}
			},
			mainTabs: {
				get() {
					return this.$store.state.common.mainTabs
				},
				set(val) {
					this.$store.commit('common/updateMainTabs', val)
				}
			},
			userName: {
				get() {
					return this.$store.state.user.name
				}
			},
			userAvatar: {
				get() {
					return this.$store.state.user.avatar
				}
			},
			//sideber
			sidebarLayoutSkin: {
				get() {
					return this.$store.state.common.sidebarLayoutSkin
				}
			},
			sidebarFold: {
				get() {
					return this.$store.state.common.sidebarFold
				}
			},
			menuList: {
				get() {
					return this.$store.state.common.menuList
				},
				set(val) {
					this.$store.commit('common/updateMenuList', val)
				}
			},
			menuActiveName: {
				get() {
					return this.$store.state.common.menuActiveName
				},
				set(val) {
					this.$store.commit('common/updateMenuActiveName', val)
				}
			},
			mainTabs: {
				get() {
					return this.$store.state.common.mainTabs
				},
				set(val) {
					this.$store.commit('common/updateMainTabs', val)
				}
			},
			mainTabsActiveName: {
				get() {
					return this.$store.state.common.mainTabsActiveName
				},
				set(val) {
					this.$store.commit('common/updateMainTabsActiveName', val)
				}
			}
		},
		watch: {
			$route: 'routeHandle',
			keywords(val) {
				this.applicationSort = 0
				this.getDataList(2)
			},
			keywords1(n) {
					this.getDataList(1)
			},
			isActive(n){
				if(this.$route.name == 'index'){
					if(n == 3){
						this.isActive = 1
					}
				}
			}
		},
		mounted() {
			let roleNameList = this.$cookie.get('roleNameList')
			this.roleNameList = roleNameList ? roleNameList.split(','): []
			this.roleIdList =roleNameList ?  this.$cookie.get('roleIdList').split(',') : []
			this.MQTTconnect();
			window.addEventListener('resize', () => {
				this.appHeight = window.innerHeight
				this.appFormHeight = this.appHeight - 100
			})
			this.appHeight = window.innerHeight
			this.appFormHeight = this.appHeight - 100
			this.getNotReadCount()
			this.init()
			//sidebar
			window.addEventListener('resize', () => {
				this.getResizeWidth()

			})
			this.getResizeWidth()
			this.getCollectMenuList()
			this.getDataList()
			this.sideHeight = window.innerHeight - 50
			this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
			this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')

			this.routeHandle(this.$route)

		},
		destroyed() {
			this.websock.close() // 离开路由之后断开websocket连接
		},
		methods: {
			handleCommand(command){
				this.currentRoleName = this.roleNameList[command]
				let roleId = this.roleIdList[command]
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
					window.location.href = window.location.origin +'/index'
					
				})
			},
			handleFoucs() {
				this.visibleSelect = true
			},
			handleClose(){
				this.visibleSelect = false
				this.keywords1 = ''
			},
			onShowProduct() {
				this.productShow = true;
				this.popperWidth = 200;
				this.isActive = 2
				this.keywords = ''
			},
			onHideProduct() {
				this.productShow = false;
				this.isActive = 3
			},
			//sidebar
			showSearch() {
				if (!this.keywords) {}
			},
			changeRouter(val) {
				this.isSelected = false
				this.keywords1 = val.menuName ? val.menuName : val.applicationName
			},
			getResizeWidth() {
				this.sideHeight = window.innerHeight - 50
				let sideWidth = 800

				if (window.innerWidth >= 1200) {
					sideWidth = 800
					this.sideWidthLeft = 1000
					this.columnCount = 8
					this.columnNum = 3
				} else if (window.innerWidth < 1200 && window.innerWidth > 900) {
					sideWidth = window.innerWidth / 5 * 4
					this.sideWidthLeft = sideWidth - 200
					this.columnCount = 12
					this.columnNum = 2
				} else {
					sideWidth = window.innerWidth / 5 * 4
					this.sideWidthLeft = sideWidth - 200
					this.columnCount = 24
					this.columnNum = 1
				}
				if (!this.productShow) {
					this.sideWidth = 200
				} else {
					this.sideWidth = sideWidth
				}
				//this.sideWidth = sideWidth
			},
			//跳转第三方路由
			routerThirdLink(url, productId, isThirdSys) {
				let isOpen = url && url.substr(0, 4) == 'http' ? true : false
				let accesstoken = this.$cookie.get('accesstoken')
				if (isOpen) {

					//产品Id
					//保存使用的应用
					let that = this;
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

					//token  信息
					//用户类型
					// this.productShow = false
					this.$refs[`popover-product`].doClose()
					this.isActive = 3
					url = url.replace(/{token}/, accesstoken)
					url = url.replace(/{productId}/, productId)
					url = url.replace(/{orgId}/,this.GLOBAL.getOrgId())
					if (isThirdSys == 0) {
						this.$router.push({
							name: 'system-second',
							query: {
								url: url
							}
						})
					} else {
						if (url.indexOf('openapi.shijieu') > -1) {
							this.shijieLink(url);
						} else {
							window.open(url);
						}
					}
					this.keywords1 = ''

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
							 + '&grade_id=' + teaResList.sjGradeId + '&class_id=' + parseInt(teaResList.classId.substr(16, 2)) +
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
			routerMenuLink(idproduct) {

				document.getElementById(idproduct + 'productId').scrollIntoView();
			},

			// 路由操作
			routeHandle(route) {

				if (route.meta.isTab) {
					// tab选中, 不存在先添加
					var tab = this.mainTabs.filter(item => item.name === route.name)[0]
					if (!tab) {
						if (route.meta.isDynamic) {
							route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
							if (!route) {
								return console.error('未能找到可用标签页!')
							}
						}
						tab = {
							menuId: route.meta.menuId || route.name,
							name: route.name,
							title: route.meta.title,
							type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
							iframeUrl: route.meta.iframeUrl || '',
							productId: route.meta.productId
						}
						this.mainTabs = this.mainTabs.concat(tab)
					}
					if (sessionStorage.getItem('productList') == undefined) {

						if (window.SITE_CONFIG.cmsIp == 1) {
							this.$router.replace({
								name: 'login'
							})
						} else {
							window.location.href = window.SITE_CONFIG.cmsIp
						}
					}
					let productList = JSON.parse(sessionStorage.getItem('productList') || '[]')
					for (let i in this.productList) {
						if (this.productList[i].productId == tab.productId) {
							this.menuList = this.productList[i].menuList
						}
					}

					sessionStorage.setItem('menuList', JSON.stringify(this.menuList || '[]'))
					this.menuActiveName = tab.menuId + ''
					this.mainTabsActiveName = tab.name
				}
			},
			showProductList() {
				this.visible1 = true
				this.keywords = ''
				this.keywords1 = ''
			},
			getCollectMenuList() {
				let that = this
				// let menuList = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
				let menuList = JSON.parse(sessionStorage.getItem('productList') || '[]')
				let menuIds = new Array()
				for (let i in menuList) {
					menuIds.push(menuList[i].menuIds)
				}
				getCommHttpData({
					url: 'application/getCollectMenuList',
					method: 'post',
					contentType: 1,
					data: {
						menuIds: menuIds.toString(),
						roleId:this.$cookie.get('roleId')
					}
				}, function(data) {
					that.collectMenuList = data.list
				})

			},
			getDataList(type) {
				this.dataListLoading = true
				var that = this
				let keywords = this.keywords.length == 0 ? undefined : this.keywords
				let keywords1 = this.keywords1.length == 0 ? undefined : this.keywords1
				getCommHttpData({
					url: 'application/getProductByRole',
					method: 'post',
					contentType: 1,
					data: {
						keywords: keywords ? keywords : keywords1,
						roleId:this.$cookie.get('roleId')
					}
				}, function(data) {
					if (data && data.code === 0) {
						that.appSortList = data.applicationSortList == undefined ? [] : data.applicationSortList
						let menuListRemp = data.list
						let allMenuList = new Array()
						let tempMenuRoutes = new Array()
						for (let i in menuListRemp) {
							for (let j in menuListRemp[i].menuList) {
								tempMenuRoutes.push(menuListRemp[i].menuList[j])
							}
							allMenuList.push(menuListRemp[i].menuList)
						}
						let temArr = new Array()
						let temmmArr = new Array()
						let thirdLen = 0,
							myAppLen = 0
						if (menuListRemp.length > 0) {
							for (let mm in menuListRemp) {
								let arr = menuListRemp[mm].menuList

								temArr = []
								let ii = 0
								for (let i in arr) {
									//判断目录
									if (arr[i].parentId == 1 && arr[i].type === 'menu') {
										temArr[ii] = arr[i]
										ii++
									}
									if (arr[i].type === 'directory') {

										temArr[ii] = arr[i]
										let tempArrMenu = new Array()
										for (let j in arr) {
											if (arr[j].type === 'menu') {
												//菜单
												if (arr[i].menuId == arr[j].parentId) {
													tempArrMenu.push(arr[j])
												}
											}
										}
										temArr[ii]['children'] = tempArrMenu
										ii++
									}
								}
								temmmArr.push({
									url: menuListRemp[mm].url,
									productId: menuListRemp[mm].productId,
									applicationName: menuListRemp[mm].applicationName,
									forShort: menuListRemp[mm].forShort,
									applicationSort: menuListRemp[mm].applicationSort,
									menuList: temArr,
									isThirdSys: menuListRemp[mm].isThirdSys,
									menuIds: menuListRemp[mm].menuIds ? menuListRemp[mm].menuIds : '',
								})
								if (menuListRemp[mm].url.indexOf('http') > -1) {
									thirdLen++
								} else {
									myAppLen++
								}
							}
						}
						that.myAppLen = myAppLen
						that.thirdLen = thirdLen
						if(type != 1){
								that.productList = temmmArr
						}
						if(type != 2){
								that.productList1 = [...temmmArr]
						}
					} else {
						that.productList = []
					}
					that.dataListLoading = false
				})
			},
			productChange(children,productId, pindex, mindex1, menuId2, menuId3) {
				if(children && children != 'childrens'){
					menuId2 = children[0].menuId
				}else if(children == 'childrens'){
					let menuList1 = JSON.parse(sessionStorage.getItem('productList') || '[]')
					menuList1.forEach(item=>{
						if(item.productId == productId){
							item.menuList.forEach(val=>{
								if(val.menuId == menuId2 && val.children && val.children.length > 0){
									menuId2 = val.children[0].menuId
								}else{
									menuId2 = menuId2.toString()
								}
							})
						}
					})
				}
				//产品Id
				//保存使用的应用	
				if (this.$store.state.common.sideSubFold) {
					this.$store.commit('common/updateSideMenuApp', false)
					this.$store.commit('common/updateSideSubFold', false)
				}
				let that = this;
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
				this.visible2 = false
				this.isActive = 3
				this.keywords1 = ''
				if (sessionStorage.getItem('productList') == undefined) {

					if (window.SITE_CONFIG.cmsIp == 1) {
						this.$router.replace({
							name: 'login'
						})
					} else {
						window.location.href = window.SITE_CONFIG.cmsIp
					}
				}
				let productList = JSON.parse(sessionStorage.getItem('productList') || '[]')
				let productObj = this.productList.filter(item => item.productId === productId)[0]
				this.menuList = productObj.menuList

				sessionStorage.setItem('menuList', JSON.stringify(this.menuList || '[]'))
				//this.menuList = productList[pindex].menuList
				sessionStorage.setItem('curApp', JSON.stringify({
					id: productObj.productId,
					name: productObj.applicationName,
					curMenu: menuId2
				} || ''))
				this.visible1 = false
				this.routeHandle(this.$route)
				var route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === menuId2 && item.meta.productId === productId)
				if (route.length >= 1) {
					let that = this
					let menuId = menuId3 ? menuId3 : menuId2
					http({
						url: http.adornAnyUrl('user/power/change?productId=' + productId + '&menuId=' + menuId),
						method: 'get'
					}).then(({
						data
					}) => {
						if (data && data.code === 500) {
							that.$confirm('您访问的页面消失啦，请刷新后查看~', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								window.location.reload();
							}).catch(() => {
								that.$message({
									type: 'info',
									message: '已取消刷新'
								});
							});

						} else {
							let isOpen = route[0].name && route[0].name.substr(0, 4) == 'http' ? true : false
							if (isOpen) {
								that.$router.push({
									name: 'system-second',
									query: {
										url: route[0].name
									}
								})
							} else {
								that.$router.push({
									name: route[0].name
								})
							}

						}
					})
				} else {

				}
			},
			saveOrCancelStar(productId, menuId, isCollect, pindex, index1, index2, index3) {
				console.log(arguments,'dhdhdhdh')
				let that = this;
				getCommHttpData({
					url: 'application/saveOrCancel',
					method: 'post',
					contentType: 1,
					data: {
						productId: productId,
						menuId: menuId,
						operation: parseInt(isCollect) == 0 ? 'save' : 'cancel'
					},
				}, function(data) {
					that.getCollectMenuList()
					that.getDataList()
					if (!!index3) {
						that.productList[pindex].menuList[index1].children[index2].children[index3].isCollect = parseInt(isCollect) ==
							0 ? 1 : 0
					} else {
						that.productList[pindex].menuList[index1].children[index2].isCollect = parseInt(isCollect) == 0 ? 1 : 0
					}
					// that.getDataList()
					//window.location.reload()
				})
			},
			cancelCollect(productId, menuId, index) {
				let that = this;
				getCommHttpData({
					url: 'application/saveOrCancel',
					method: 'post',
					contentType: 1,
					data: {
						productId: productId,
						menuId: menuId,
						operation: 'cancel'
					},
				}, function(data) {
					that.getCollectMenuList()
					that.getDataList()
					that.collectMenuList = that.collectMenuList.slice(index, 1)
				})
			},

			//end



			MQTTconnect() {
				let ip = window.SITE_CONFIG.webSocketIp
				let port = window.SITE_CONFIG.webSocketPort
				this.websock = new WebSocket("ws:" + ip + ":" + port + "?token=admin&mac=" + this.userId);
				let that = this
				this.websock.onopen = function() {
					console.log('1')
					// Web Socket 已连接上，使用 send() 方法发送数据
				};

				this.websock.onmessage = function(e) {
					var data = e.data;
					var dataObj = eval("(" + data + ")"); //转换为json对象
					console.log(dataObj)
					if (dataObj.command == 6) //登陆命令返回状态处理
					{
						if (10007 == dataObj.code) {}
					} else if (dataObj.command == 11) {
						if (dataObj.data.cmd < 10) {
							that.$message({
								message: '您收到一条新消息',
								type: 'success',
								center: false
							})
						}
						that.getNotReadCount()
						that.init()
					}
				}
				this.websock.onclose = function() {
					if (this.userId != undefined) {
						setTimeout(that.MQTTconnect, that.reconnectTimeout);
					}
				};
			},
			getuuid() {
				var uid = [];
				var hexDigits = "0123456789abcdefghijklmnopqrst";
				for (var i = 0; i < 32; i++) {
					uid[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
				}
				uid[6] = "4";
				uid[15] = hexDigits.substr((uid[15] & 0x3) | 0x8, 1);
				var uuid = uid.join("");
				return uuid;
			},

			onConnectionLost: function(responseObject) {
				if (responseObject.errorCode !== 0) {
					console.log('onConnectionLost:' + responseObject.errorMessage);
					console.log('连接已断开');
				}
			},
			onMessageArrived: function(message) {

				let messageInfo = JSON.parse(message.payloadString)

				if (messageInfo.message.messageCode.toString().indexOf('notice_refresh') == -1) {
					console.log(messageInfo.message.messageCode)
					this.$message({
						message: '您收到一条新消息',
						type: 'success',
						center: false
					})
				}
				//刷新列表
				this.getNotReadCount()
				this.init()

			},
			onConnect: function() {
				console.log('onConnected');

				this.client.subscribe(this.topic, {
					qos: 2
				}); // 订阅主题
			},


			// 初始化
			init() {
				this.$nextTick(() => {
					this.$refs['dataForm'].resetFields()
				})
				let that = this;
				that.listLoading = true
				getCommHttpData({
					url: 'message/mylist',
					method: 'post',
					contentType: 2,
					data: {
						userId: this.userId,
						type: this.messageType,
						page: 1,
						limit: 100
					}
				}, function(data) {
					that.listLoading = false
					that.messageList = data.page.list
				})
			},
			//标记已读
			setReadMessageList() {
				let that = this;
				getCommHttpData({
					url: 'message/setRead',
					method: 'post',
					contentType: 2,
					operateType: 2,
					data: {}
				}, function(data) {
					that.init()
				})
			},
			//查看详情
			getMsgDetail(msgId, isRead, id, msgType) {
				this.dialogFormVisible = false

				if (msgId == 0) {
					this.$router.push({
						name: 'message-receive-my'
					})
				} else {
					if (isRead == 0) {
						if (this.noReadCount > 1) {
							this.noReadCount = this.noReadCount - 1
						}
					}
					this.$router.push({
						name: 'message-receive-my',
						query: {
							msgId: msgId,
							page: 1,
							id: id,
							isRead: isRead,
							msgType: msgType
						}
					})
				}
			},
			getNotReadCount() {
				let that = this
				getCommHttpData({
					url: 'message/getNotReadCount',
					method: 'post',
					contentType: 2,
					data: {}
				}, function(data) {
					let noReadCount = 0
					for (let i in data.list) {
						noReadCount += data.list[i].msgCount
					}
					that.noReadCount = noReadCount
				})
			},
			intScrollHeight() {
				var box = document.getElementById("message-list-box");
				box.onscroll = function() {
					//变量scrollTop是滚动条滚动时，距离顶部的距离
					var scrollTop = box.scrollTop;
					//变量windowHeight是可视区的高度
					var windowHeight = box.clientHeight;
					//变量scrollHeight是滚动条的总高度
					var scrollHeight = box.scrollHeight;
					//滚动条到底部的条件
					if (scrollTop + windowHeight == scrollHeight) {
						//写后台加载数据的函数
						if (this.currPage < this.totalPage) {
							this.currPage++
							this.init()
						}
					}
				}
			},
			routerIndex() {
				console.log(this.$cookie.get('userType'))
				if (this.$cookie.get('userType') != 1) {
					this.$router.replace({
						name: 'index'
					})
				}
			},
			// 修改密码
			updatePasswordHandle() {
				this.updatePassowrdVisible = true
				this.$nextTick(() => {
					this.$refs.updatePassowrd.init()
				})
			},
			// 修改个人中心
			updateUserInfoHandle() {
				this.updateUserInfoVisible = true
				this.$nextTick(() => {
					this.$refs.updateUserinfo.init()
				})
			},
			// 退出
			logoutHandle() {
				this.$confirm(`您确定退出系统吗?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					lockScroll: false
				}).then(() => {
					let that = this
					that.websock.close();
					getCommHttpData({
						url: 'sys/logout',
						method: 'post',
						contentType: 2,
						data: {
							appType: 1
						}
					}, function(data) {
						getCommHttpData({
							url: 'logout',
							method: 'get',
							contentType: 1,
							serverType: 4,
							data: {}
						}, function(data) {
							if (data && data.code === 0) {
								clearLoginInfo()
								if (window.SITE_CONFIG.cmsIp == 1) {
									that.$router.push({
										name: 'login'
									})
								} else {
									window.location.href = window.SITE_CONFIG.cmsIp
								}
							}
						})
					})

				}).catch(() => {})
			},
			messageHandle() {
				if (this.messageVisible) {
					this.messageVisible = false
				} else {
					this.messageVisible = true
					this.$nextTick(() => {
						this.$refs.messageList.init()
					})
				}

			}
		}
	}
</script>
<style>
	.popover-title {
		padding: 15px 22px;
		color: #999999;
	}
	

	.navbar-checked-switch {
		background-color: rgba(0, 77, 188, 0.3) !important;
	}
	.select--list{
		width: 220px;
	}
	.el-select-group-pad:not(:last-of-type){
		padding-bottom: 14px !important;
	}
	/* .site-navbar__switch:hover{
		color: #45c2b5 !important;
	} */
	.site-navbar__switch1:hover,.site-navbar__switch1:focus {
		background: #3C85EE !important;
		color: #ffffff !important;
		outline: 0 !important;
	}
	
	.site-navbar__switch1 i {
		color: #cccccc;
	}

	.app-popper__right {
		z-index: 9999;
		position: fixed;
		right: 0px;
		width: 400px;
		background-color: #FFFFFF;
		padding: 20px;
		box-shadow: -4px 0px 4px #cccccc;
	}

	.app-popper__right .app-popover-title {
		font-size: 16px;
		padding-bottom: 10px;
		margin: 0px 0px 10px 0px;
		border-bottom: 1px #E6E6E6 solid;
	}

	.popper-footer {
		position: absolute;
		bottom: 50px;
	}

	.dialog-card .el-dialog {
		position: fixed;
		bottom: 0px;
		right: 0px;
		height: 500px;
		margin-bottom: 0px;
	}

	.item-name img {
		display: inline-block;
	}

	.el-collect_icon {
		position: absolute;
		right: 15px;
		top: 17px;
		display: none;
	}

	.icon-menu-item:hover .el-icon-star-off {
		color: #FFFFFF !important;
	}

	.icon-menu-item:hover .el-icon-star-on {
		color: #FFFFFF !important;
	}

	.icon-menu-item .el-icon-star-on {
		color: #3C85EE !important;
	}

	.home-menu-icon {
		width: 64px;
		height: 50px;
		/*line-height: 35px;*/
		text-align: center;
		margin-left: 0px !important;
	}

	.left-popover-icon {
		display: inline-block;
		width: 16px;
		height: 18px;
		overflow: hidden;
	}

	.left-popover-icon svg {
		font-size: 20px;
	}

	.icon-white {
		fill: #FFFFFF !important;
	}

	.home-menu-icon:hover {
		background-color: #2ebbad;
		color: #FFFFFF;
	}

	.aside-popover {
		top: 50px !important;
		left: 15px !important;
		border: none !important;
		box-shadow: 0px 3px 8px 0px rgba(87, 87, 87, 0.24) !important;
		padding: 0 !important;
	}

	.aside-popover .popper__arrow {
		display: none;
	}

	.aside-left-menu {
		margin-top: 0px;
	}


	.left-popover {
		padding: 0 0 0 12px;
		height: 50px;
		cursor: pointer;
		color: #444444;
		font-size: 14px;
	}

	.left-popover:active {
		background-color: #DFE3EF;
		color: #3C85EE;
	}

	.left-popover:hover {
		background: #DFE3EF;
		color: #3C85EE;
	}
	.left-popover:hover .icon_blue{
		position: relative;
		left: -16px;
		-webkit-filter: drop-shadow(16px 0 0 #3C85EE);
		filter: drop-shadow(16px 0 0 #3C85EE);
	}

	.left-popover:hover .el-collect_icon {
		display: inline-block;
	}

	.product-list {
		margin-left: 20px;
		overflow: auto;
		/*overflow: hidden;*/
	}


	.product-list .el-dialog {
		position: absolute;
		left: 64px;
		margin-top: 50px !important;
		width: 900px;
		height: 90%;
		/*height: 90%;*/
	}

	.product-list .el-dialog__body {
		/*height: 500px;*/
		height: 90%;
		overflow-y: scroll;
	}

	.product-list .keywords {
		float: right;
		margin-top: 11px;
		margin-bottom: 10px;
		border-bottom: 1px solid #dcdfe6;
	}

	.product-list .keywords .el-input__inner {
		border: 1px solid #FFFFFF;
	}

	.input-class {
		width: 220px;
	}

	.input-class .el-input__inner {
		border: none;
		background: rgba(0, 77, 188, 0.3);
		height: 26px;
		border-radius: 13px;
		color: #CCCCCC;
	}

	.el-select-group__title {
		font-size: 13px;
		border-bottom: 1px solid #CCCCCC;
		margin-left: 10px;
		margin-right: 10px;
		padding-left: 0;
	}

	/* .el-select-dropdown__item span{
		color: #333333;
	} */
	.el-select-group .el-select-dropdown__item {
		padding-left: 10px;
	}

	.el-select-group__wrap:not(:last-of-type)::after {
		height: 0;
	}

	.app-header {
		width: 220px;
		text-align: left;
		padding-left: 5px;
		margin-bottom: 5px;
	}

	.product-content {
		margin-top: 15px;
		margin-bottom: 25px;
	}

	.product-list .product-item {
		box-sizing: border-box;
		break-inside: avoid;
		padding: 10px;
	}

	.product-list .header-panel {
		font-size: 16px;
		color: #333333;
		font-weight: bold;
		display: block;
		border-bottom: 1px solid #CCCCCC;
		padding-bottom: 15px;
	}

	.product-list .header-menu label {
		display: inline-block;
		width: 190px;
		padding: 5px 0px 5px 5px;
	}

	.label-item2 {
		text-indent: 0em;
	}

	.icon-menu-item {
		width: 220px;
		padding: 4px 0px;
		font-size: 14px;
		color: #666666;
	}

	.icon-menu-item .icon-svg {
		font-size: 14px;
		/*padding-bottom: 10px;*/
	}

	.icon-menu-item label {
		cursor: pointer;
	}

	.icon-menu-item:hover,
	.icon-menu-item:active {
		background: #3C85EE;
		color: #FFFFFF;
	}
	.icon-menu-item .icon-pro{
		display: inline-block;
		width: 14px;
		height: 17px;
		margin-right: 10px;
		overflow: hidden;
	}
	.icon-menu-item:hover .icon-pro .icon_white{
		position: relative;
		left: -14px;
		/* border-right: 30px solid transparent; */
		-webkit-filter: drop-shadow(14px 0 0 #ffffff);
		filter: drop-shadow(14px 0 0 #ffffff);
	}
	
	.icon-menu-item .rate-star {
		/*display: none;*/
		visibility: hidden;
	}

	.icon-menu-item:hover .rate-star {
		/*display: inline-block;*/
		visibility: visible;

	}

	.icon-menu-item:active .rate-star {
		/*display: inline-block;*/
		visibility: visible;
	}



	.el-rate {
		display: inline-block;
	}

	.product-right {
		display: inline-block;
		border-left: 2px #EEEEEE solid;
		width: 150px;
		position: absolute;
		top: 50px;
		right: 0px;
	}

	.product-right a {
		color: #686868;
	}

	.product-right div {
		cursor: pointer;
		padding: 10px 10px;
		border-left: 2px #EEEEEE solid;
	}

	.product-right div:focus,
	.product-right div:hover,
	.product-right div:active {
		border-left: 2px #3C85EE solid;
	}
	.scrool-product::-webkit-scrollbar{/*滚动条整体部分，其中的属性有width,height,background,border等（就和一个块级元素一样）（位置1）*/
	        width:5px;  
	        height:5px;  
	}
	.scrool-product::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
	    background: #999999;
	}
	.scrool-product::-webkit-scrollbar-track {/*滚动条里面轨道*/
	        background: #F0F0F0;
	    }
</style>
