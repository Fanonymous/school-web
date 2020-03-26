<template>
	<el-card class="userinfo-body">
		<el-tabs v-model="activeName2" type="card">
			<el-tab-pane label="个人信息" name="first">
				<div class="header-body">个人信息</div>
				<el-form class="body-left" v-loading="imageLoading" element-loading-text="拼命加载中" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
					<el-row :gutter="12">
						<el-col :span="4">
							<el-card style="padding-bottom: 20px;">
								<div class="userinfo-body bofy-left">
									<!--<div><img src="~@/assets/img/pic_default.jpg" :onerror="errorGoodsImg" width="100px" height="100px" /></div>
									<div>
										<el-button type="text" size="small" @click="bindDept"> 修改头像</el-button>
									</div>-->

									<el-upload class="avatar-uploader" :action="apiUrl+'/sys/oss/picUpload'" :show-file-list="false" :on-success="handleAvatarSuccess" :data="uploadFile" :before-upload="beforeAvatarUpload">
										<img v-if="imageUrl == null" src="~@/assets/img/pic_avatar.jpg" width="100px" height="100px" style="border-radius: 50%;" />
										<img v-else :src="defaultPic" v-real-img="imgUrl+imageUrl"  width="100px" height="100px" style="border-radius: 50%;" />
										<div >
											<el-button type="text" size="small" style="height: 20px;"> 修改头像</el-button>
										</div>
									</el-upload>
									
								</div>
							</el-card>
						</el-col>
						<el-col :span="20">
							<el-card>
								<div class="userName">
									<div>{{fullName1}}
                    <label v-if="deptNameArr == null" >未绑定机构</label>
										<!-- <el-button v-if="deptNameArr == null" type="text" @click="bindDept">（未绑定，请点击 绑定机构）</el-button> -->
										<label v-else>（{{deptNameArr}}）</label>
									</div>
										
									<div style="margin-top: 30px;">
										<span v-show="!isEditSign" >{{dataForm.sign ? dataForm.sign : '请输入您的个性签名~'}}</span>
										<el-input v-show="isEditSign" v-model.trim="dataForm.sign" placeholder="请输入个性签名" style="width:320px" maxlength="30"></el-input>
										<i v-show="!isEditSign" @click="isEditSign = true" style="color: #3C85EE;font-size: 20px;" class="el-icon-edit-outline"></i></div>
								</div>
							</el-card>
						</el-col>
					</el-row>
					<div class="header-body">基本信息</div>
					<el-form-item label="用户名" prop="username">
						<el-input v-model.trim="dataForm.username" placeholder="请输入用户名" style="width:220px"></el-input>
					</el-form-item>
					<el-form-item label="姓名" prop="fullName">
						<el-input v-model.trim="dataForm.fullName" placeholder="请输入姓名" style="width:220px"></el-input>
					</el-form-item>
					<el-form-item label="身份证号" prop="userNum">
						<el-input v-model.trim="dataForm.userNum" placeholder="请输入身份证号" style="width:220px"></el-input>
					</el-form-item>
					<div class="header-body">联系信息</div>
					<el-form-item label="手机号" prop="mobile">
						<el-input v-model.trim="dataForm.mobile" placeholder="请输入手机号" style="width:220px"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input type="email" v-model.trim="dataForm.email" placeholder="请输入邮箱" style="width:220px"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="dataFormSubmit">保存</el-button>
						<!--<el-button @click="resetDataForm">重置</el-button>-->
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="我的身份" name="second" >
				<div class="header-body" style="padding-bottom:10px;border-bottom: 1px #e4e7ed solid;">我的身份</div>
				<template v-if="roleList.length > 0">
					<div class="cardBox" v-for="(item,index) in roleList" style="margin-top: 50px;">
						<div class="cardOne" style="border-bottom: 1px #e4e7ed solid;width: 100%;padding-bottom: 20px;margin-bottom: 20px;padding-left: 20px;" >
							<h3>{{item.userTypeName}}</h3>
							<el-form label-width="70px">
							<!--<div class="cardtwoLine" style="padding-left: 20px;">-->
							 <el-form-item label="角色：" style="margin-bottom: 0;">	
								<span v-for="name in item.roleNameList">{{name}}<span style="padding-left: 5px;" v-if="name!=item.roleNameList[item.roleNameList.length-1]">、</span></span>
								<span v-if="item.roleNameList==null" style="color:red">角色暂未授权</span>
							<!--</div>-->
							</el-form-item>
							<!--<div class="cardoneLine" v-for="" style="width: 100%;margin-top: 20px;padding-left: 20px;padding-right: 20px;">-->
							<el-form-item label="机构：" style="margin-bottom: 0;">	
								<div v-for="(orgname,i) in item.deptNameList">
									<span style="margin-right:50px;">{{orgname}}</span>
<!-- 									<span style="color:#3C85EE;cursor: pointer;" v-if="item.userType !=7" @click="unbindDept(item.roleNameList,{userId:item.userId,userType:item.userType,deptId:item.deptIdList[i]})">解绑机构</span>
 -->								</div>
							</el-form-item>
							</el-form>
						</div>
					</div>
					<el-row class="margin-bottom-20">
						<!-- <el-button type="primary" @click="bindDept" icon="el-icon-plus">绑定新机构</el-button> -->
					</el-row>
				</template>
				<template v-else>
					<div style="text-align: center;margin-top: 40px;">暂未绑定机构
          <!-- ，<el-button type="primary" @click="bindDept" icon="el-icon-plus">绑定机构</el-button> -->
          </div>
				</template>
				<!--<el-table :data="roleList" :show-header="false" border v-loading="dataListLoading" style="">
					<el-table-column prop="userTypeName" header-align="center" align="center" width="200">
					</el-table-column>
					<el-table-column header-align="center" align="center" label="">
						<template slot-scope="scope">
							角色：{{scope.row.roleName || '- -'}}
						</template>
					</el-table-column>
					<el-table-column header-align="center" align="center" label=""  width="500">
						<template slot-scope="scope">
							<el-table :data="scope.row.deptNameList" :show-header="false" border v-loading="dataListLoading" style="width: 100%;">

								<el-table-column header-align="center" align="center" label="">
									<template slot-scope="scope1">
										机构：{{scope1.row}}
									</template>
								</el-table-column>
								<el-table-column fixed="right" header-align="center" align="center" width="150" label="">
									<template slot-scope="scope1">
										<!--{{scope.row.deptIdList[scope1.$index]}}-->
										<!--<el-button type="text" size="small" v-if="scope.row.userType !=7" @click="unbindDept({userId:scope.row.userId,userType:scope.row.userType,deptId:scope.row.deptIdList[scope1.$index]})">解绑</el-button>
									</template>
								</el-table-column>
							</el-table>
						</template>
					</el-table-column>
				</el-table>-->
			</el-tab-pane>
			<el-tab-pane label="安全设置" name="third" style="margin-bottom: 20px;">
				<!--<el-row :gutter="12" class="margin-bottom-10">
					<el-col :span="3">您当前的账号安全程度</el-col>
					<el-col :span="6">
						<el-progress :percentage="50" :stroke-width="15" status="exception" :show-text=false></el-progress>
					</el-col>
					<el-col :span="6">安全级别：低</el-col>
				</el-row>-->
				<div class="header-body">安全设置</div>
				<el-table :data="dataList" :show-header="false" border v-loading="dataListLoading" style="width: 100%;">
					<el-table-column prop="label1" header-align="center" align="center" width="200">
					</el-table-column>
					<el-table-column prop="label2" header-align="center" align="center">
					</el-table-column>
					<el-table-column fixed="right" header-align="center" align="center" width="150">
						<template slot-scope="scope">
							<el-button type="text" v-if="scope.row.type==1 && isLinkUser" size="small" disabled>修改</el-button>
							<el-button type="text" v-if="scope.row.type==1 && !isLinkUser" size="small" @click="updatePassHandle(scope.row)">修改</el-button>
							<el-button type="text" v-if="scope.row.type==2" size="small" @click="addOrUpdateHandle(scope.row)">绑定</el-button>
							<!--<el-button type="text" v-if="scope.row.type==3 && isLinkUser" size="small" disabled>注销账号</el-button>-->
							<!--<el-button type="text" v-if="scope.row.type==3 && !isLinkUser" size="small" @click="logoff(scope.row.userId)">注销账号</el-button>-->
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
		<!-- 弹窗, 新增 / 修改 -->
		<el-dialog title="机构激活" :visible.sync="dialogFormVisible">
			<el-form :rules="layerRules" ref="layerRules" :model="layerForm" label-position="right" label-width="100px">
				<el-form-item label="激活码" prop="deptCode">
					<el-input v-model.trim="layerForm.deptCode" placeholder="请输入激活码" class="input-with-select">
						<el-button type="primary" slot="append" icon="el-icon-search" @click="searchDept">查询</el-button>
					</el-input>
				</el-form-item>
				<el-form-item label="">
					<div>{{deptName}}</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="createData" :loading="addLoading">确定</el-button>
			</div>
		</el-dialog>
		<!-- 弹窗, 修改密码 -->
		<el-dialog title="修改密码" :visible.sync="dialogFormPassVisible">
			<el-form :rules="layerPassRules" ref="layerPass" :model="layerPass" label-position="right" label-width="100px">
				<el-form-item label="用户名" prop="email">
					<el-input v-model="username" class="input-with-select" disabled></el-input>
				</el-form-item>
				<el-form-item label="旧密码" prop="password">
					<el-input type="password" v-model.trim="layerPass.password" placeholder="请输入旧密码"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="newPassword">
					<el-input type="password" v-model.trim="layerPass.newPassword" placeholder="请输入新密码"></el-input>
				</el-form-item>
				<!--<el-form-item label="激活码" prop="email">
					<el-input v-model.trim="layerPass.deptCode" placeholder="请输入激活码"></el-input>
				</el-form-item>-->
				<el-form-item label="确认密码" prop="comfirmPassword">
					<el-input type="password" v-model.trim="layerPass.comfirmPassword" placeholder="请输入确认密码"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormPassVisible = false">取消</el-button>
				<el-button type="primary" @click="updatePassData" :loading="addLoading">确定</el-button>
			</div>
		</el-dialog>

	</el-card>

</template>

<script>
  import { clearLoginInfo } from '@/utils'
	import sha256 from 'js-sha256'
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	import { isEmail, isMobile,isIdentityNum } from '@/utils/validate'
	import errorImgUrl from '@/assets/img/pic_avatar.jpg'
import { setTimeout } from 'timers';
	export default {
		
		data() {
			var validateConfirmPassword = (rule, value, callback) => {
		        if (this.layerPass.newPassword !== value) {
		          callback(new Error('确认密码与新密码不一致'))
		        } else {
		          callback()
		        }
		      }
		      var validateNewPassword = (rule, value, callback) => {
		      	if (this.layerPass.password == value) {
		          callback(new Error('新密码和旧密码重复'))
		        } else {
		          callback()
		        }
		      }
		      var validateMobile = (rule, value, callback) => {
		      	
		      	if(value == '' || value == null ){
		      		callback()
		      	}
		        if (!isMobile(value)) {
		          callback(new Error('请输入正确的手机号'))
		        } else {
		          callback()
		        }
		      }
		      var validateIdentity = (rule, value, callback) => {
		      	if(value == '' || value == null){
		      		callback()
		      	}
		        if (!isIdentityNum(value)) {
		          callback(new Error('请输入正确的身份证号'))
		        } else {
		          callback()
		        }
		      }
		      var validateEmail = (rule, value, callback) => {
				if(value == '' || value == null){
		      		callback()
		      	}
		        if (!isEmail(value)) {
		          callback(new Error('请输入正确的邮箱'))
		        } else {
		          callback()
		        }
		      }
			return {
				isEditSign: false,
				imageLoading: false,
				isLinkUser:false,
				apiUrl: window.SITE_CONFIG.baseUrlMedia,
				imgUrl: window.SITE_CONFIG.imgIP,
				imageUrl: '',
				uploadFile: {
					type: ''
				},
				activeName2: 'first',
				curUserId: this.GLOBAL.getUserId(),
				userId: this.GLOBAL.getUserId(),
				errorGoodsImg: 'this.src="' + require('../../../assets/img/pic_avatar.jpg') + '";this.onerror = null',
				isRead: false,
				dataListLoading: false,
				fullName1: '',
				deptNameArr: '',
				username:'',
				dataForm: {

					username: '',
					fullName: '',
					userNum: '',
					mobile: '',
					email: '',
					sign:''
				},
				roleList: [{
					label1: '教职工',
					label2: '机构：教务处、团委         角色：教务处长、任课老师',
					type: 1
				}, {
					label1: '家长',
					label2: '孩子：张三（纳吉特初中 | 初一1班）',
					type: 2
				}, {
					label1: '家长',
					label2: '孩子：张四（纳吉特高中 | 高三1班）',
					type: 3

				}],
				dataList: [{
						label1: '登录密码',
						label2: '安全性高的密码可以使帐号更安全。建议您定期更换密码，设置一个包含字母，符号或数字中至少两项且长度超过6位的密码。',
						type: 1
					},
					//				{
					//					label1: '第三方账号绑定',
					//					label2: '您在登录时，可以在“其他登录方式”入口中，通过绑定的三方账号直接登录平台。',
					//					type: 2
					//				}, 
//					{
//						label1: '注销帐号',
//						label2: '如果您不再使用此账号，可以将其注销。账号成功注销后，其下所有服务、数据及隐私信息将会被删除并将无法恢复。',
//						type: 3
//
//					}
				],
				dataRule: {
					username: [{
						required: true,
						message: '用户名不能为空',
						trigger: 'blur'
					}, {
						min: 1,
						max: 18,
						message: '用户名长度不能大于18 个字符'
					}],

					fullName: [{
						required: true,
						message: '姓名不能为空',
						trigger: 'blur'
					}, {
						min: 1,
						max: 20,
						message: '姓名长度不能大于20 个字符'
					}],
					userNum:  [{ validator: validateIdentity, trigger: 'blur'}],
					mobile: [{ validator: validateMobile, trigger: 'blur'}],
					email: [{ validator: validateEmail, trigger: 'blur'}],

				},
				dialogFormVisible: false,
				layerForm: {
					deptCode: ''
				},
				layerRules: {
					deptCode: [{
						required: true,
						message: '激活码不能为空',
						trigger: 'blur'
					}],
				},
				deptName: '',
				deptId: '',
				addLoading: false,
				durableYearsList: [],
				brandIdList: [],
				fileList: [],
				dialogFormPassVisible: false,
				layerPass: {
					password: '',
					newPassword: '',
					comfirmPassword: ''
				},
				layerPassRules: {
					password: [{
						required: true,
						message: '密码不能为空',
						trigger: 'blur'
					}, {
						min: 6,
						max: 20,
						message: '密码长度在 6 到18个字符'
					}],
					newPassword: [{
						required: true,
						message: '新密码不能为空',
						trigger: 'blur'
					}, {
						min: 6,
						max: 20,
						message: '密码长度在 6 到 18个字符'
					},{ validator: validateNewPassword, trigger: 'blur' }],
					comfirmPassword: [{
						required: true,
						message: '确认密码不能为空',
						trigger: 'blur'
					}, {
						min: 6,
						max: 20,
						message: '密码长度在 6 到 18个字符'
					},{ validator: validateConfirmPassword, trigger: 'blur' }],
				},
				defaultPic : ''
			}
		},
		 watch: {
			'$route' (to, from) {
				this.initData() // 这是我ajax获取用户信息的方法
			}
		},
		computed: {
	      sideMenuApp:{
	      	get () { return this.$store.state.common.sideMenuApp },
	        set (val) { this.$store.commit('common/updateSideMenuApp', val) }
	      }
	    },
		mounted() {
			this.initData()
		},
		methods: {
			handleAvatarSuccess(res, file) {
				this.imageUrl = res.url;
				//this.imageUrl = URL.createObjectURL(file.raw);
			},
			beforeAvatarUpload(file) {
				const fileExt = file.name.substring(file.name.lastIndexOf("."), file.name.length).toUpperCase();
				const isLt2M = file.size / 1024/1024< 10;
				let isFormat = true;
				this.uploadFile.type = fileExt;
				if(fileExt != ".PNG" && fileExt != ".GIF" && fileExt != ".JPG" && fileExt != ".JPEG" && fileExt != ".BMP") {
					this.$message.error('文件类型错误，请选择jpg,png,bmp或gif类型的文件');
					isFormat = false;
				}
				if(!isLt2M) {
					this.imageLoading = true
				    const _this = this
				    return new Promise(resolve => {
				      const reader = new FileReader()
				      const image = new Image()
				      image.onload = (imageEvent) => {
				        const canvas = document.createElement('canvas');
				        const context = canvas.getContext('2d');
				        const width = image.width * 0.5
				        const height = image.height * 0.5
				        canvas.width = width;
				        canvas.height = height;
				        context.clearRect(0, 0, width, height);
				        context.drawImage(image, 0, 0, width, height);
				        const dataUrl = canvas.toDataURL(file.type);
				        const blobData = _this.dataURItoBlob(dataUrl, file.type);
				        resolve(blobData)
				      }
				      reader.onload = (e => { image.src = e.target.result; });
				      reader.readAsDataURL(file);
				    })
//					this.$message.error('上传图片大小不能超过 10MB!');
//					isFormat = false;
					isFormat = true;
				}
				return isFormat;
			},
			dataURItoBlob(dataURI, type) {
				this.imageLoading = false
			  var binary = atob(dataURI.split(',')[1]);
			  var array = [];
			  for(var i = 0; i < binary.length; i++) {
			    array.push(binary.charCodeAt(i));
			  }
			  return new Blob([new Uint8Array(array)], {type: type});
			},
			
			//		      beforeAvatarUpload(file) {
			//		        const isJPG = file.type === 'image/jpeg';
			//		        const isLt2M = file.size / 1024 / 1024 < 2;
			//		
			//		        if (!isJPG) {
			//		          this.$message.error('上传头像图片只能是 JPG 格式!');
			//		        }
			//		        if (!isLt2M) {
			//		          this.$message.error('上传头像图片大小不能超过 2MB!');
			//		        }
			//		        return isJPG && isLt2M;
			//		      },
			//			getPicSrc(picSrc) {
			//				this.dataForm.deviceTypeIcon = picSrc
			//			},
			initData() {
				//初始化查询用户的基本信息
				let that = this
				
				if(this.$route.query.id != undefined){
					this.sideMenuApp = true
					this.userId = this.$route.query.id
					if(this.$route.query.id == this.curUserId){
						this.isLinkUser = false
					}else{
						this.isLinkUser = true
					}
				}else{
					this.sideMenuApp = false
					this.userId = this.GLOBAL.getUserId()
				}
				getCommHttpData({
					url: 'uc/user/userInfo',
					method: 'get',
					serverType: 2,
					contentType: 1,
					data: {
						userId: this.userId
					}
				}, function(data) {
					that.fullName1 = data.user.fullName
					
					if(data.user.userInfo.length == 0){
						that.deptNameArr = null
					}else{
						let deptNames = new Array()
						for(let i in data.user.userInfo){
							deptNames.push(data.user.userInfo[i].deptName)
						}
						that.deptNameArr = deptNames.toString()
					}
					that.username = data.user.username,
					that.dataForm = {
						username: data.user.username,
						fullName: data.user.fullName,
						userNum: data.user.userNum,
						mobile: data.user.mobile,
						email: data.user.email,
						sign: data.user.sign
					}
					that.imageUrl = data.user.imageUrl
					that.roleList = data.user.userInfo
				})
			},
			bindDept() {
				this.addLoading = false
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.deptName = ''
					this.deptId = ''
					this.layerForm = {
							deptCode: ''
						},
						this.$refs['layerForm'].clearValidate()
				})
			},
			unbindDept(roleList,unbindData) {
				//解绑
				var that = this
				if(!roleList){
					deleteData(that, {msg:'您确定解绑此机构码？',delJson:{
						url: 'uc/user/delUntied',
						method: 'post',
						contentType: 2,
						operateType: 2,
						data: unbindData
					}}, function(data) {
						//解绑刷新页面
						window.location.reload()
	//					that.initData()
					})	
				}else{
					this.$message({
			          message: '您正在任职中，不可解绑!',
			          type: 'warning'
			        });
				}
			},
			updatePassHandle() {
				//修改密码
				this.addLoading = false
				this.dialogFormPassVisible = true
				this.$nextTick(() => {
					this.layerPass = {
						password: '',
						newPassword: '',
						comfirmPassword: ''
					}
					this.$refs['layerPass'].clearValidate()
				})
			},
			updatePassData() {
				this.$refs['layerPass'].validate((valid) => {
					if(valid) {
						var that = this
						let tempData = this.dataForm
						tempData['userId'] = this.userId
						getCommHttpData({
							url: 'uc/user/password',
							method: 'post',
							contentType: 2,
							data: {
								password: sha256(this.layerPass.password),
								newPassword: sha256(this.layerPass.newPassword),
							}
						}, function(data) {
							that.dialogFormPassVisible = false
							that.$message({
						        message: '密码修改成功，请重新登录！',
						        type: 'success',
						        onClose: () => {
						        	that.$router.replace({
										name: 'login'
									})
						        }
						    })
							
						})
					}
				})
			},
			createData() {
				//激活
				this.$refs['layerRules'].validate((valid) => {
					if(valid) {
						if(this.deptId == ''){
							let that = this
							getCommHttpData({
								url: 'uc/dept/queryDeptByCode',
								method: 'get',
								serverType: 2,
								contentType: 1,
								data: {
									deptCode: this.layerForm.deptCode
								}
							}, function(data) {
								if(data.sysDeptEntity != null) {
									that.deptId = data.sysDeptEntity.deptId
									that.deptName = data.sysDeptEntity.name
									that.createBindDept()
								} else {
									that.deptId = ''
									that.deptName = '暂无数据，请重新查询'
								}
							})
								
						}else{
							this.createBindDept()
						}
//						if(this.deptId == '') {
//							this.$message({
//								message: '请输入一个正确的激活码',
//								type: 'error'
//							})
//							return
//						}
						
					}
				})
			},
			createBindDept(){
				let that = this
				getCommHttpData({
					url: 'uc/user/deptActive',
					method: 'post',
					serverType: 2,
					contentType: 2,
					operateType: 2,
					data: {
						deptId: this.deptId,
						userId: this.userId
					}
				}, function(data) {
					that.dialogFormVisible = false
					that.initData()
				})
			},
			searchDept() {
				let that = this
				this.$refs['layerRules'].validate((valid) => {
					if(valid) {
						getCommHttpData({
							url: 'uc/dept/queryDeptByCode',
							method: 'get',
							serverType: 2,
							contentType: 1,
							data: {
								deptCode: this.layerForm.deptCode
							}
						}, function(data) {
							if(data.sysDeptEntity != null) {
								that.deptId = data.sysDeptEntity.deptId
								that.deptName = data.sysDeptEntity.name
							} else {
								that.deptId = ''
								that.deptName = '暂无数据，请重新查询'
							}
						})
					}
				})
			},
			getDataInfo() {

				if(this.$route.params.deviceId == undefined) {
					this.deviceId = undefined
					this.dataForm = {
						deviceName: '',
						deviceTypeIcon: '',
						deviceYears: '',
						isClient: true,
						brandList: [],
						faultDesc: '',
						order: '',
						deviceRemark: ''
					}
					this.fileList = []
					return;
				}
				this.deviceId = this.$route.params.deviceId
				this.$http({
					url: this.$http.adornUrlMedia('/device/findTypeList'),
					method: 'post',
					data: this.$http.adornParams({
						deviceId: this.$route.params.deviceId
					})
				}).then(({
					data
				}) => {
					
					this.dataForm = data.list[0]
					this.dataForm.isClient = data.list[0].isClient == 1 ? true : false;
					if(data.list[0].brandNames != null) {
						let brandNames = data.list[0].brandNames.split(',')
						let brandIds = data.list[0].brandIds.split(',')
						let temArr = new Array()
						for(var i in brandIds) {
							temArr.push(parseInt(brandIds[i]))
						}
						this.dataForm.brandList = temArr;
					} else {
						this.dataForm.brandList = []
					}

					if(data.list[0].deviceTypeIcon == '') {
						this.$refs.uploadpic.picList = []
					} else {
						this.$refs.uploadpic.picList = [{
							name: data.list[0].deviceName,
							url: window.SITE_CONFIG.baseUrlMedia + 'svrimg/' + data.list[0].deviceTypeIcon
						}]
					}

				})
			},

			dataFormSubmit() {
				//提交
				this.$refs['dataForm'].validate((valid) => {
					
					if(valid) {
						var that = this
						let tempData = this.dataForm
						tempData['userId'] = this.userId
						this.dataForm.imageUrl = this.imageUrl
						if(this.userId == this.curUserId && this.username != this.dataForm.username ){
							this.$confirm('您确认修改用户名吗？修改后需要以新的用户名“'+that.dataForm.username+'”重新登录。', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
					          type: 'warning'
					        }).then(() => {
					        	getCommHttpData({
									url: 'uc/user/update',
									method: 'post',
									serverType: 2,
									contentType: 2,
									that: this,
									data: tempData
								}, function(data) {
									that.$message({
						              type: 'success',
						              message: '修改成功!',
						              duration:3000,
						              onClose:function(){
                            //退出系统重新登录
                            
                                getCommHttpData({
                                		url: 'logout',
                                		method: 'get',
                                		contentType: 1,
                                    serverType:4,
                                		data: {}
                                	}, function(data) {
                                  if (data && data.code === 0) {
                                    clearLoginInfo()
                                    that.$router.push({ name: 'login' })
                                  }
                                })
                            	
						              	// that.$router.replace({
                     //          name: 'login'
                     //        })
						              }
						            });
									
								})
					        }).catch(() => {
					          this.$message({
					            type: 'info',
					            message: '已取消修改'
					          });          
					        });
						}else{
							getCommHttpData({
								url: 'uc/user/update',
								method: 'post',
								serverType: 2,
								contentType: 2,
								operateType: 2,
								that: this,
								data: tempData
							}, function(data) {
								that.isEditSign = false
								that.initData()
							})
						}	
					}
				})
			},
			logoff() {
				//注销账号

				let that = this
				
				deleteData(that, {msg:'您确定注销账号吗？',delJson:{
					url: 'uc/user/userUntied',
					method: 'post',
					contentType: 2,
					operateType: 2,
					data: {
						userId: this.userId
					}
				}}, function(data) {
					that.$router.replace({
						name: 'login'
					})
				})
//				
//				getCommHttpData({
//					url: 'uc/user/userUntied',
//					method: 'post',
//					serverType: 2,
//					contentType: 2,
//					operateType: 2,
//					data: {
//						userId: this.userId
//					}
//				}, function(data) {
//
//				})
			},
			resetDataForm(){
				this.dataForm ={
					username: '',
					fullName: '',
					userNum: '',
					mobile: '',
					email: '',
					sign:''
				}
			}
		}
	}
</script>
<style>
	.userinfo-body	.el-card__body{
		padding-top: 0;
		padding-bottom: 0;
	}
	.userinfo-body .el-form-item.is-success .el-input__inner,.userinfo-body .el-form-item.is-success .el-textarea__inner{
		border-color:#dcdfe6
	}
.userinfo-body	.el-card{
		border: none;
	}
	.userinfo-body .el-tabs__header {
		width: 20%;
		display: inline-block;
		position: absolute;
		top: 80px;
	}
	
	.userinfo-body .el-tabs--card>.el-tabs__header {
		border-bottom: none;
	}
	
	.userinfo-body .el-tabs--card>.el-tabs__header .el-tabs__item:first-child {
		border-left: 1px #e4e7ed solid;
	}
	
	.userinfo-body .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
		border: 1px #3C85EE solid;
		border-left: 1px #3C85EE solid;
		border-bottom-color: #3C85EE;
	}
	
	.userinfo-body .el-tabs--card>.el-tabs__header .el-tabs__nav {
		border: none;
	}
	
	.userinfo-body .el-tabs__item {
		display: block;
		margin: 10px;
		border: 1px #e4e7ed solid;
	}
	
	.userinfo-body .el-tabs--card>.el-tabs__header .el-tabs__item {
		border-bottom: 1px solid #e4e7ed;
	}
	
	.userinfo-body .el-tabs__content {
		margin-left: 134px;
		border-left:10px solid #f1f4f5;
		padding-left: 20px;
		width: 92%;
		min-height: 200px;
	}
	
	.userinfo-body .userinfo-body {
		height: 120px;
		padding-top: 10px;
	}
	
	.userinfo-body .bofy-left {
		text-align: center;
	}
	
	.userinfo-body .userinfo-body img {
		height: 100px;
		border-radius: 20px;
	}
	.userName{
		padding-top: 10px;
		height: 140px;
	}
</style>