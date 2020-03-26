<template>
	<!--:class="{ 'site-sidebar--fold': sidebarFold }"-->
	<div class="site-wrapper site-sidebar--fold" :class="{'site-sidebar-sub-menu--fold':sideSubFold}" v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中">
		<template v-if="!loading">
			<main-navbar />
			<!-- <main-sidebar /> -->
			<main-sidebar-sub  />
			<div :class="sideMenuApp?'site-content__wrapper':'site-content__wrapper1'" :style="{ 'min-height': documentClientHeight-37 + 'px' }" style="overflow: auto">
				<main-content />
			</div>
			<!--v-if="menuList.length >0 && isUserInfo" <div class="site-content__wrapper1" v-else :style="{ 'min-height': documentClientHeight-37 + 'px'}">
				<main-content />
			</div>-->

			<div style="margin: 0px 0px;padding:10px 0px; text-align: center;background-color: #ffffff;">
				Copyright © 2016-{{date}}&nbsp;&nbsp;

				<template v-if="domainType == 4">{{$t('navbar.otherAddress')}}</template>
				<template v-else></template>	
				

				&nbsp;&nbsp;{{$t('navbar.record')}}&nbsp;&nbsp;版本：{{version}}&nbsp;&nbsp;
				<template v-if="domainType == 4">{{$t('navbar.addressQy')}}</template>
				<template v-else-if="domainType == 5">{{$t('navbar.addressEmpty')}}</template>
				<template v-else>{{$t('navbar.address')}}</template>
			</div>

		</template>
	</div>
</template>

<script>
	import MainNavbar from './main-navbar'
	// import MainSidebar from './main-sidebar'
	import MainContent from './main-content'
	import MainSidebarSub from './main-sidebar-sub'
	import MainBreadcrumb from './main-breadcrumb'
	import { getCommHttpData,getDomainType } from '@/utils/common'
	import router from '@/router'
	export default {
		data() {
			return {
        version:window.SITE_CONFIG.sysVersion,
				domainType:getDomainType(),
				userId: this.GLOBAL.getUserId(),
				userType: this.GLOBAL.getUserType(),
				loading: true,
				menuList: [],
				date:(new Date()).getFullYear(),
				isUserInfo:true
			}
		},
		components: {
			MainNavbar,
			// MainSidebar,
			MainContent,
			MainSidebarSub,
			MainBreadcrumb
		},
		computed: {
			documentClientHeight: {
				get() {
					return this.$store.state.common.documentClientHeight
				},
				set(val) {
					this.$store.commit('common/updateDocumentClientHeight', val)
				}
			},
			sidebarFold: {
				get() {
					return this.$store.state.common.sidebarFold
				}
			},
			sideSubFold: {
				get() {
					return this.$store.state.common.sideSubFold
				}
			},
			sideMenuApp:{
		      	get () { return this.$store.state.common.sideMenuApp },
		    },
			//    userId: {
			//      get () { return this.$store.state.user.id },
			//      set (val) { this.$store.commit('user/updateId', val) }
			//    },
			userName: {
				get() {
					return this.$store.state.user.name
				},
				set(val) {
					this.$store.commit('user/updateName', val)
				}
			},
			userAvatar: {
				get() {
					return this.$store.state.user.avatar
				},
				set(val) {
					this.$store.commit('user/updateAvatar', val)
				}
			}
		},
		created() {
			this.getUserInfo()
		},
		watch:{
			$route: 'isShowMenuSub',
		},
		mounted() {
			this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')

			this.resetDocumentClientHeight()
			this.isShowMenuSub(this.$route)


		},
		methods: {
			isShowMenuSub(route){
				if(route.name == 'userinfo' || route.name == 'message-receive-my' || route.name == 'index' ){
					this.isUserInfo = false
				}else{
					this.isUserInfo = true
				}

			},
			// 重置窗口可视高度
			resetDocumentClientHeight() {
				this.documentClientHeight = document.documentElement['clientHeight']
				window.onresize = () => {
					this.documentClientHeight = document.documentElement['clientHeight']
				}
			},
			// 获取当前管理员信息
			getUserInfo() {
				this.loading = false
				let that = this
				getCommHttpData({
					url: 'uc/user/userInfo',
					method: 'get',
					serverType: 2,
					contentType: 1,
					data: {
						userId: this.userId
					}
				}, function(data) {
					that.loading = false
					that.userId = data.user.userId
					that.userName = data.user.fullName
					that.userAvatar = data.user.imageUrl
				})
			}
		}
	}
</script>
