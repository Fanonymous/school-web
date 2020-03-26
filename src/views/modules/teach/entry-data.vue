<template>
	<div class="mod-config">
		<el-card>
			<el-row :gutter="0">
				<el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="200px" v-show="formVisible">
					<el-form-item label="姓名" prop="name">
						<el-input type="type" placeholder="请输入姓名" v-model="dataForm.name"></el-input>
					</el-form-item>
					<el-form-item label="以下内容最少输入一项" prop="checkUnique">
						<el-input v-model="dataForm.checkUnique" type="type" placeholder="请输入身份证号" v-show="isCheck == 1" ></el-input>
					</el-form-item>
					
					<el-form-item label="手机号" prop="telPhone">
						<el-input type="type" placeholder="请输入手机号" v-model="dataForm.telPhone"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input type="type" placeholder="请输入邮箱" maxlength="320" v-model="dataForm.email"></el-input>
					</el-form-item>
					<el-form-item label="教籍号" prop="teacherNum">
						<el-input type="type" placeholder="请输入教籍号" v-model="dataForm.teacherNum"></el-input>
					</el-form-item>
					<el-form-item label="身份证号" prop="identityNum" >
						<el-input type="type" placeholder="请输入身份证号" v-model="dataForm.identityNum"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="dataFormCheckSubmit">提交</el-button>
						<router-link :to="{name:'teach-entry-manage'}" class="cancel-btn">
							<el-button>取消</el-button>
						</router-link>

					</el-form-item>
				</el-form>

				<el-form :model="dataWorkForm" :rules="ruleWorks" ref="dataWorkForm" label-width="200px" v-show="workFormVisible">

					<el-alert title="姓名：*****     查看教师详情" type="success" show-icon :closable="false">
					</el-alert>
					<el-form-item label="教职工类别" prop="teacherTypecode">
						<el-select v-model="dataWorkForm.teacherTypecode" placeholder="请选择教职工类别" class="el-input-width">
							<el-option v-for="item in teacherTypecodeTypeList" :key="item.value" :label="item.dictName" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="教职工来源">
						<el-select v-model="dataWorkForm.teacherOrigin" placeholder="请选择教职工来源" class="el-input-width">
							<el-option v-for="item in teacherOriginTypeList" :key="item.value" :label="item.dictName" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否在编">
						<el-radio-group v-model="dataWorkForm.isSpecialTrain">
							<el-radio label="1">是</el-radio>
							<el-radio label="2">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="用人形式">
						<el-select v-model="dataWorkForm.modality" placeholder="请选择人员状态" class="el-input-width">
							<el-option v-for="item in humanFormTypeList" :key="item.value" :label="item.dictName" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="签订合同情况">
						<el-select v-model="dataWorkForm.contractState" placeholder="请选择签订合同情况" class="el-input-width">
							<el-option v-for="item in contractStateTypeList" :key="item.value" :label="item.dictName" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="进本校年月">
						<el-date-picker v-model="dataWorkForm.enterDate" value-format='yyyy-MM-dd' type="date" placeholder="选择进本校日期" class="el-input-width">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="备注">
						<el-input type="textarea" :rows="4" placeholder="备注" v-model="dataWorkForm.remark"></el-input>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="dataFormSubmit">提交</el-button>
						<router-link :to="{name:'teach-entry-manage',query:{type:0}}" class="cancel-btn">
							<el-button>取消</el-button>
						</router-link>
					</el-form-item>
				</el-form>
			</el-row>
		</el-card>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	import { isEmail, isMobile,isIdentityNum } from '@/utils/validate'
	export default {
		data() {
			var validateEmpty = (rule, value, callback) => {
				console.log(this.dataForm.identityNum)
				
				
		      	if(this.dataForm.identityNum == '' && this.dataForm.telPhone=='' && this.dataForm.email=='' && this.dataForm.teacherNum==''){
		          callback(new Error('请至少输入以下一项内容'))
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
			 // var checkPhoneDuplication = (rule, value, callback)=>{
			 //  	let that = this
		  		
			 //  	getCommHttpData({
			 //  		url: 'uc/user/checkUnique',
			 //  		method: 'post',
			 //  		contentType: 2,
			 //  		data: { 
			 //  			mobile: value
			 //  		}
			 //  	}, function(data) {
			 //  		if(data && data.code === 0) {
			 //  			if(data.msg != 'success'){
			 //  				callback(new Error(data.msg))
			 //  			}else{
			 //  				callback()
			 //  			}
			 //  		}
			 //  	})
			 //  }
			 //  var checkEmailDuplication =(rule, value, callback)=>{
			 //  	let that = this			  		
			 //  	getCommHttpData({
			 //  		url: 'uc/user/checkUnique',
			 //  		method: 'post',
			 //  		contentType: 2,
			 //  		data: { 
			 //  			email: value
			 //  		}
			 //  	}, function(data) {
			 //  		if(data && data.code === 0) {
			 //  			if(data.msg != 'success'){
			 //  				callback(new Error(data.msg))
			 //  			}else{
			 //  				callback()
			 //  			}
			 //  		}
			 //  	})
			 //  }
			 //  var checkIdentityNumDuplication = (rule, value, callback)=>{
			 //  	let that = this		  		
			 //  	getCommHttpData({
			 //  		url: 'uc/user/checkUnique',
			 //  		method: 'post',
			 //  		contentType: 2,
			 //  		data: { 
			 //  			identityNum: value
			 //  		}
			 //  	}, function(data) {
			 //  		if(data && data.code === 0) {
			 //  			if(data.msg != 'success'){
			 //  				callback(new Error(data.msg))
			 //  			}else{
			 //  				callback()
			 //  			}
			 //  		}
			 //  	})
			 //  }
			 //  var checkTeacherNumDuplication = (rule, value, callback)=>{
			 //  	let that = this			  		
			 //  	getCommHttpData({
			 //  		url: 'uc/user/checkUnique',
			 //  		method: 'post',
			 //  		contentType: 2,
			 //  		data: { 
			 //  			teacherNum: value
			 //  		}
			 //  	}, function(data) {
			 //  		if(data && data.code === 0) {
			 //  			if(data.msg != 'success'){
			 //  				callback(new Error(data.msg))
			 //  			}else{
			 //  				callback()
			 //  			}
			 //  		}
			 //  	})
			 //  }
			var validateIdentity = (rule, value, callback) => {
				if(value == '' || value == null ){
		      		callback()
		      	}
		        if (!isIdentityNum(value)) {
		          callback(new Error('请输入正确的身份证号'))
		        } else {
		          callback()
		        }
		      }
			var validateEmail = (rule, value, callback) => {
				if(value == '' || value == null ){
		      		callback()
		      	}
		        if (!isEmail(value)) {
		          callback(new Error('请输入正确的邮箱'))
		        } else {
		          callback()
		        }
		      }
			return {
				deviceId: undefined,
				isCheck:2,
				picList: [],
				fileExtWechat: ['.PNG', '.JPG', '.GIF', '.JPEG', '.BMP', '.XML'],
				dialogStatus: '',
				retireTypeList: [],
				quitTypeList: [],
				teacherTypecodeTypeList: [],
				teacherOriginTypeList: [],
				humanFormTypeList: [],
				contractStateTypeList: [],
				teacherList: [],
				leaveType: 1,
				textMap: {
					update: '编辑',
					create: '添加'
				},
				dataForm: {
					schoolId: this.GLOBAL.getOrgId(),
					checkUnique:'check',
					name: '',
					identityNum: '',
					telPhone: '',
					email: '',
					teacherNum: ''

				},
				dataWorkForm: {
					schoolId: '',
					teacherId: '',
					teacherTypecode: '',
					teacherOrigin: '',
					modality: '',
					contractState: '',
					enterDate: '',
					remark: '',
					isSpecialTrain: '1',
				},
				rules: {
					name: [{
						required: true,
						message: '请输入教师',
						trigger: 'blur'
					}],
					checkUnique: [{required: true,message: '以下内容最少输入一项',trigger: 'blur'},{ validator: validateEmpty, trigger: 'blur' }],
					identityNum: [{
						validator: validateIdentity,
						message: '请输入正确的身份证号'
					}
					// { validator: checkIdentityNumDuplication, trigger: 'blur' }
					],
					telPhone: [{
						validator: validateMobile,
						message: '请输入正确的手机号'
					}
					// { validator: checkPhoneDuplication, trigger: 'blur' }
					],
					email: [{
						validator: validateEmail,
						message: '请输入正确的邮箱'
					}
					// { validator: checkEmailDuplication, trigger: 'blur' }
					],
					teacherNum:[{
						max: 20,
						message: '教籍号长度不能大于20 个字符'
					}
					// { validator: checkTeacherNumDuplication, trigger: 'blur' }
					]
				},
				ruleWorks: {
					teacherTypecode: [{
						required: true,
						message: '请选择教职工类别',
						trigger: 'change'
					}],
				},
				loading: false,
				fileList: [],
				formVisible: true,
				workFormVisible: false
			}
		},

		mounted() {
			this.leaveType = this.$route.query.leaveType
			getCommonDictByType(this, 'quit_type', 'quitTypeList')
			getCommonDictByType(this, 'retire_type', 'retireTypeList')

			//教职工来源
			getCommonDictByType(this, 'teacher_origin_type', 'teacherOriginTypeList')
			//教职工类别
			getCommonDictByType(this, 'teacher_typecode_type', 'teacherTypecodeTypeList')
			//用人形式
			getCommonDictByType(this, 'human_form_type', 'humanFormTypeList')
			//签订合同情况
			getCommonDictByType(this, 'contract_state_type', 'contractStateTypeList')
		},
		methods: {

			getPicSrc(picSrc) {
				this.dataForm.appendixPath = picSrc
			},
			getDataInfo() {
				this.leaveType = this.$route.query.leaveType
				if(this.$route.params.deviceId == undefined) {
					this.deviceId = undefined
					this.dataForm = {
						schoolId: '',
						teacherId: '',
						contractualType: '',
						retireType: '',
						endDate: '',
						appendixPath: '',
						retireType: '',
						remark: '',
						state: ''
					}
					this.fileList = []
					return;
				}
				this.id = this.$route.params.id

			},
			//验证身份证  手机号  邮箱  教籍号至少输入一项
			checkUnique(rule, value, callback) {
				if(this.dataForm.identityNum == '' && this.dataForm.identityNum.telPhone=='' && this.dataForm.email=='' && this.dataForm.teacherNum==''){
					callback(new Error('请至少输入以下一项内容'))
				}else{
					callback()
				}
				
			},
			resetTemp() {
				this.dataForm = {
					teacherId: '',
					schoolId: '',
					contractualType: '',
					endDate: '',
					appendixPath: '',
					remark: '',
					state: ''
				}
			},
			saveData() {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						var that = this
						getCommHttpData({
							url: `/teacherManage/${this.$route.params.deviceId== undefined ? 'saveLeave' : 'saveLeave'}`,
							method: 'post',
							contentType: 2,
							operateType: 2,
							that: this,
							data: this.dataForm
						}, function(data) {

						})
					}
				})
			},
			getNames(query) {
				if(query !== '') {
					this.loading = true;
					this.$http({
						url: this.$http.adornUrl('/cms/teacherList/getTeacherBySchool'),
						method: 'post',
						data: this.$http.adornData({
							'teacherName': query,
							'schoolId': this.schoolId,
							'schoolYearId': this.schoolYearId,
							'termId': this.termId
						})
					}).then(({
						data
					}) => {
						this.loading = false;
						this.teacherList = data.list;
					});
				}
			},
			dataFormSubmit() {
				//提交
				this.$router.push({
					name: 'teach-manage-add'
				})
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						var that = this
						that.formVisible = false
						that.workFormVisible = true
						getCommHttpData({
							url: 'teacherManage/queryByNameAndIdentityNum',
							method: 'post',
							contentType: 2,
							operateType: 2,
							that: this,
							data: this.dataForm
						}, function(data) {
							that.$router.push({
								name: 'teach-manage-add',
								query:{type:0}
							})

						})
					}
				})
			},
			dataFormCheckSubmit() {
				//提交验证，教职工是否在本校任职
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						var that = this
						getCommHttpData({
							//url: `/teacherManage/${this.$route.params.deviceId== undefined ? 'saveLeave' : 'saveLeave'}`,
							url: 'teacherManage/queryTeacherByParam',
							method: 'post',
							contentType: 1,
							data: this.dataForm
						}, function(data) {
							//0:新加教师，1：此教职工已在本校任职中，2：他校转入教师，3：他校任职中的教师
							if(data.type == 0) {
								//跳转
								that.$router.push({
									name: 'teach-manage-add',query:{type:0},params:that.dataForm
								})
							} else if(data.type == 1) {
								that.$message({
									message: data.message,
									type: 'error'
								})
							} else if(data.type == 2) {
								that.formVisible = false
								that.workFormVisible = true
							}else{
								that.$message({
									message: data.message,
									type: 'error'
								})
							}


						})
					}
				})
			},
		}
	}
</script>