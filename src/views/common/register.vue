<template>
	<div class="site-wrapper site-page--login">
		<div class="login-header">
			<img src="~@/assets/img/logo-g.png" />
			<div class="login-header-text">{{systemName}}</div>
		</div>

		<div :class="loginBg">
			<div class="login-main">
				<h3 class="login-title">用户注册</h3>
				<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="70px">
					<el-form-item label="用户名" prop="userName">
						<el-input v-model.trim="dataForm.userName" placeholder="请输入用户名"></el-input>
						<!--<div class="form-tips">注：1-18位数字、字母、汉字的组合</div>-->
					</el-form-item>
					<el-form-item label="姓名" prop="name">
						<el-input v-model.trim="dataForm.name" placeholder="请输入姓名"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="userPassword">
						<el-input type="password" v-model.trim="dataForm.userPassword" placeholder="请输入密码"></el-input>
					</el-form-item>
					<el-form-item label="" prop="isRead">
						<el-checkbox v-model="dataForm.isRead">阅读并接受 </el-checkbox>
						<router-link to="/user-agreement" target="_blank">《用户注册协议》</router-link>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="dataFormSubmit">注册</el-button>
						<el-button @click="goLogin">取消</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<com-footer></com-footer>
	</div>
</template>

<script>
	import logincss from '@/assets/scss/login.scss'
	import ComFooter from './com-footer'
	import { getCommHttpData ,getDomainType} from '@/utils/common'
	import sha256 from 'js-sha256'
	export default {
		components: {
			ComFooter
		},
		data() {
			return {
        systemName:window.SITE_CONFIG.systemName,
				platformName:'',
				domainType:getDomainType(),
				loginBg:'login-cont-bg',
				dataForm: {
					userName: '',
					name: '',
					userPassword: '',
					isRead: '',
				},

				dataRule: {
					userName: [{
						required: true,
						message: '用户名不能为空',
						trigger: 'blur'
					}, {
						min: 1,
						max: 18,
						message: '用户名长度不能大于18 个字符'
					}],
					userPassword: [{
						required: true,
						message: '密码不能为空',
						trigger: 'blur'
					}, {
						min: 6,
						max: 18,
						message: '密码长度在 6 到18个字符'
					}],
					name: [{
						required: true,
						message: '姓名不能为空',
						trigger: 'blur'
					}, {
						min: 1,
						max: 20,
						message: '姓名长度不能大于20 个字符'
					}],
					isRead: [{ validator: this.checkBox, trigger: 'blur' }]

				}
			}
		},
		mounted() {
			//班牌1，课堂2，集控3,课题4, 其他0
			if(this.domainType == 1){
				this.platformName = this.$t('navbar.systemName1')
				this.loginBg='login-cont-bg-bp'
			}else if(this.domainType == 2){
				this.platformName = this.$t('navbar.systemName2')
				this.loginBg='login-cont-bg-kt'
			}else if(this.domainType == 3){
				this.platformName = this.$t('navbar.systemName3')
				this.loginBg='login-cont-bg-jk'
			}else if(this.domainType == 4){
				this.platformName = this.$t('navbar.systemName4')
				this.loginBg='login-cont-bg-qy'
			}else {
				this.platformName = this.$t('navbar.systemName')
				this.loginBg='login-cont-bg'
			}
			this.dataForm = {
				userName: '',
				name: '',
				userPassword: '',
				isRead: '',
			}
		},
		methods: {
			dataFormSubmit() {
				//提交---注册
				let isClient = this.dataForm.isClient
				isClient = isClient ? 1 : 0
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						var that = this
						getCommHttpData({
							url: 'register',
							method: 'post',
							serverType: 2,
							contentType: 2,
							operateType: 2,
							that: this,
							data: {
								username: this.dataForm.userName,
								password: sha256(this.dataForm.userPassword),
								fullName: this.dataForm.name,
							}
						}, function(data) {
							that.$router.push({
								name: 'login'
							})
						})
					}
				})
			},
			checkBox(rule, value, callback){
				 if (!value) {
					    return callback(new Error('请阅读并接受《用户注册协议》'))
					  }else {
					    callback()
					  }
			},
			goLogin(){
				window.location.href = window.location.origin +'/login'

			}
		}
	}
</script>
