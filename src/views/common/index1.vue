<template>
	<div v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中">

	</div>
</template>
<style>
	body {
		margin: 0px;
		background-color: #e6ecee;
	}
	
	.subsystem-index {
		height: 100px;
		margin-bottom: 10px;
		background-color: #3bbaab;
		color: #FFFFFF;
		border-radius: 10px;
		text-align: center;
	}
	
	.note-card {
		margin-bottom: 10px;
		padding: 10px;
	}
	
	.note-bg-y {
		background: #ffc;
	}
	
	.note-bg-g {
		background: #ccffcc;
	}
	
	.note-bg-b {
		background: #9fdcff;
	}
	
	.header-panel {
		font-size: 16px;
		padding: 5px 0px;
		/*font-weight: bolder;*/
	}
	
	.text-center {
		text-align: center;
	}
</style>
<script>
	import { clearLoginInfo } from '@/utils'
	export default {
		data() {
			return {
				roleId: this.GLOBAL.getRoleId(),
				userType: this.GLOBAL.getUserType(),
				loading: true,
				dynamicMenuRoutes: []
			}
		},

		computed: {

		},
		created() {
			//登录之后跳转到改用户的第一个菜单
			this.loading = false
			
			if(this.userType == 7){
				this.$router.push({
					name: 'userinfo'
				})
				return
			}
			this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
			if(this.dynamicMenuRoutes.length ==0){
				this.$router.push({
					name: 'userinfo'
				})
				return
			}
			
			this.$router.push({
				name: this.dynamicMenuRoutes[0].name
			})

		},
		mounted() {
			this.loading = false
			this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
			this.$router.push({
				name: this.dynamicMenuRoutes[0].name
			})
			
		},
		methods: {
			handleCreate() {
			}
		}
	}
</script>