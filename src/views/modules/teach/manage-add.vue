<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="manage-container">
		<el-card>
			<el-row :gutter="0">
				<el-col :span="24">
					<el-form inline :model="form" :rules="rules" ref="form" @keyup.enter.native="dataFormSubmit()" label-width="200px">
					
					<el-collapse v-model="activeNames" class="shrinkage">
					  <el-collapse-item title="基本信息" name="1" class="colwrap">
					    <template slot="title">
					       <header class="header-body-collapse">基本信息</header>
					    </template>
						<el-row class="el-r-border-top">
							<el-col :lg="dlg">
								<el-form-item label="姓名" prop="teacherName">
									<el-col :span="20">
										<el-input v-model="form.teacherName" placeholder="请输入姓名"></el-input>
									</el-col>
								</el-form-item>
								<el-form-item label="性别">
									<el-radio-group v-model="form.sex">
										<el-radio label="0">男</el-radio>
										<el-radio label="1">女</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="民族">
									<el-select v-model="form.folk" placeholder="请选择民族" class="el-input-width">
										<el-option v-for="item in folkTypeList" :key="item.value" :label="item.dictName" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="职称">
									<el-select v-model="form.professor" placeholder="请选择职称" class="el-input-width">
										<el-option v-for="item in teacherProfessorList" :key="item.value" :label="item.dictName" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="出生地">
									<area-cascader class="el-area-select" type='text' :level='1' style="padding:0;" :data="pcaa" v-model="form.birthPlace" placeholder="请选择出生地"></area-cascader>
								</el-form-item>
								<el-form-item label="微信">
									<el-col :span="20">
										<el-input v-model="form.weChat" placeholder="请输入微信号"></el-input>
									</el-col>
								</el-form-item>

								
							</el-col>
							<el-col :lg="dlg">
								<el-form-item label="曾用名" prop="beforeName">
									<el-col :span="20">
										<el-input v-model="form.beforeName" placeholder="请输入曾用名"></el-input>
									</el-col>
								</el-form-item>
								<el-form-item label="出生日期">
									<el-date-picker :picker-options="pickerOptions" v-model="form.birthday" value-format='yyyy-MM-dd' type="date" placeholder="选择出生日期" class="el-input-width">
									</el-date-picker>
								</el-form-item>
								<el-form-item label="政治面貌">
									<el-select v-model="form.politics" placeholder="请选择政治面貌" class="el-input-width">
										<el-option v-for="item in politicsTypeList" :key="item.value" :label="item.dictName" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="学历">
									<el-select v-model="form.degree" placeholder="请选择学历" class="el-input-width">
										<el-option v-for="item in degreeTypeList" :key="item.value" :label="item.dictName" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="籍贯" style="padding-bottom: 5px;">
									<area-cascader class="el-area-select" type='text' :level='1' style="padding:0;" :data="pcaa" v-model="form.nativePlace" placeholder="请选择籍贯"></area-cascader>
								</el-form-item>
								<el-form-item label="QQ">
									<el-col :span="20">
										<el-input v-model="form.qq" placeholder="请输入QQ号码"></el-input>
									</el-col>
								</el-form-item>
								
							</el-col>
							<el-col :lg="4" :sm="18">
								<el-upload class="avatar-uploader" style="text-align: center;" :action="apiUrl+'/sys/oss/picUpload'" :show-file-list="false" :on-success="handleAvatarSuccess" :data="uploadFile" :before-upload="beforeAvatarUpload">
									<img v-if="form.icon == null" src="~@/assets/img/pic_default.jpg" width="120px" height="auto" />
									<img v-else :src="imgUrl+form.icon" :onerror="errorGoodsImg" width="120px" height="auto" />
									<div>
										<el-button type="text" size="small"> 修改头像</el-button>
									</div>
								</el-upload>
							</el-col>
						</el-row>
						
						<el-row>
							<el-col :lg="dlg">
								<el-form-item label="以下内容最少输入一项" prop="checkUnique">
									<el-input v-model="form.checkUnique" type="type" placeholder="请输入"  style="visibility: hidden;"></el-input>
								</el-form-item>
						
								<el-form-item label="手机号" prop="telPhone">
									<el-col :span="20">
										<el-input v-model="form.telPhone" placeholder="请输入手机号"></el-input>
									</el-col>
								</el-form-item>
								<el-form-item label="教籍号">
									<el-col :span="20">
										<el-input v-model="form.teacherNum" placeholder="请输入教籍号"></el-input>
									</el-col>
								</el-form-item>
							</el-col>
							<el-col :lg="dlg">
								<el-form-item label="" class="xs-hidden">
                                    <el-input v-model="form.checkUnique" type="type" placeholder="请输入"  style="visibility: hidden;"></el-input>
								</el-form-item>
								<el-form-item label="邮箱">
									<el-col :span="20">
										<el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
									</el-col>
								</el-form-item>
								
								<el-form-item label="身份证号" prop="identityNum">
									<el-col :span="20">
										<el-input v-model="form.identityNum" placeholder="请输入身份证号"></el-input>
									</el-col>
								</el-form-item>
							</el-col>
						</el-row>
					  </el-collapse-item>
					  <el-collapse-item title="" name="2" class="colwrap">
					    <template slot="title">
					       <header class="header-body-collapse">工作信息</header>
					    </template>
						<el-row  class="el-r-border-top">
							<el-col :lg="dlg">
								<el-form-item label="教职工来源">
									<el-select v-model="form.teacherOrigin" placeholder="请选择教职工来源" class="el-input-width">
										<el-option v-for="item in teacherOriginTypeList" :key="item.value" :label="item.dictName" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="是否在编">
									<el-radio-group v-model="form.isEditing">
										<el-radio label="1">是</el-radio>
										<el-radio label="0">否</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="用人形式"  v-if="form.isEditing == 0">
									<el-select v-model="form.modality" placeholder="请选择人员状态" class="el-input-width">
										<el-option v-for="item in humanFormTypeList" :key="item.value" :label="item.dictName" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="教职工号">
									<el-col :span="20">
										<el-input v-model="form.teacherCode" placeholder="请输入教职工号"></el-input>
									</el-col>
								</el-form-item>
							</el-col>
							<el-col :lg="14">
								<el-form-item label="教职工类别" prop="teacherTypecode">
									<el-select v-model="form.teacherTypecode" placeholder="请选择教职工类别" class="el-input-width">
										<el-option v-for="item in teacherTypecodeTypeList" :key="item.value" :label="item.dictName" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="签订合同情况">
									<el-select v-model="form.contractState" placeholder="请选择签订合同情况" class="el-input-width">
										<el-option v-for="item in contractStateTypeList" :key="item.value" :label="item.dictName" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="进本校年月">
									<el-date-picker :picker-options="pickerOptions" v-model="form.enterDate" value-format='yyyy-MM-dd' type="date" placeholder="选择进本校日期" class="el-input-width">
									</el-date-picker>
								</el-form-item>

							</el-col>
						</el-row>
					  </el-collapse-item>
					  <el-collapse-item title="教职工个人辅助信息" name="3" class="colwrap">
					    <template slot="title">
					       <header class="header-body-collapse">教职工个人辅助信息</header>
					    </template>
						<el-row  class="el-r-border-top">
							<el-col :lg="dlg">
								<el-form-item label="健康状况">
									<el-select v-model="form.health" placeholder="请选择健康状况" class="el-input-width">
										<el-option v-for="item in healthCodeTypeList" :key="item.value" :label="item.dictName" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="是否全日制师范类专业毕业">
									<el-radio-group v-model="form.isFullTime">
										<el-radio label="1">是</el-radio>
										<el-radio label="0">否</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="是否受过特教专业培养培训">
									<el-radio-group v-model="form.isSpecialTrain">
										<el-radio label="1">是</el-radio>
										<el-radio label="0">否</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="信息技术能力">
									<el-select v-model="form.informationAbility" placeholder="请选择信息技术能力" class="el-input-width">
										<el-option v-for="item in informationAbilityTypeList" :key="item.value" :label="item.dictName" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="是否参加基层服务项目">
									<el-radio-group v-model="form.isGrassRoots">
										<el-radio label="1">是</el-radio>
										<el-radio label="0">否</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="是否县级以上骨干教师">
									<el-radio-group v-model="form.isCounty">
										<el-radio label="1">是</el-radio>
										<el-radio label="0">否</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="是否特级教师">
									<el-radio-group v-model="form.isSuperfine">
										<el-radio label="1">是</el-radio>
										<el-radio label="0">否</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>
							<el-col :lg="14">
								<el-form-item label="婚姻状况">
									<el-select v-model="form.marriage" placeholder="请选择婚姻状况" class="el-input-width">
										<el-option v-for="item in marriageCodeTypeList" :key="item.value" :label="item.dictName" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="参加工作年月">
									<el-date-picker :picker-options="pickerOptions" v-model="form.workDate" value-format='yyyy-MM-dd' type="date" placeholder="选择参加工作年月" class="el-input-width">
									</el-date-picker>
								</el-form-item>
								<el-form-item label="是否有特殊教育从业证书">
									<el-radio-group v-model="form.isSpecialCertificate">
										<el-radio label="1">是</el-radio>
										<el-radio label="0">否</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="是否属于免费（公费）师范生">
									<el-radio-group v-model="form.isFreeTeacherTraining">
										<el-radio label="1">是</el-radio>
										<el-radio label="0">否</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="参加基层服务项目年月">
									<el-date-picker :picker-options="pickerOptions" v-model="programYearMonth" type="daterange" value-format='yyyy-MM-dd' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
									</el-date-picker>
								</el-form-item>
								<el-form-item label="是否心理健康教育教师">
									<el-radio-group v-model="form.isInformationHealth">
										<el-radio label="1">是</el-radio>
										<el-radio label="0">否</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						</el-collapse-item>
					</el-collapse>
					<el-col :lg="24" style="text-align: center;">
						<el-form-item class="submit">
							<div class="center-align margin-20">
								<el-button type="primary" @click="createData">确定</el-button>
								<router-link :to="{name:'teach-entry-manage'}" class="cancel-btn">
									<el-button>取消</el-button>
								</router-link>
							</div>
						</el-form-item>
					</el-col>	
					</el-form>
				</el-col>
			</el-row>
		</el-card>

	</div>
</template>
<style>
	.manage-container .avatar-uploader .el-upload{
		border: none;
	}
</style>
<script>
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	import { pca, pcaa } from 'area-data'; // v5 or higher
	import { isEmail, isMobile,isIdentityNum } from '@/utils/validate'
	export default {
		data() {
			let that = this
			let userType = this.$cookie.get('userType')
			var validateEmpty = (rule, value, callback) => {
		      	if(!that.form.identityNum && !that.form.telPhone && !that.form.email && !that.form.teacherNum){
		          callback(new Error('请至少输入以下一项内容'))
		        } else {
		          callback()
		        }
		      }
			var validateMobile = (rule, value, callback) => {
				if(value == '' || value == null ){
		      		callback()
					return
		      	}
		        if (!isMobile(value)) {
		          callback(new Error('请输入正确的手机号'))
		        } else {
		          callback()
		        }
		      }
			var validateIdentity = (rule, value, callback) => {
				if(value == '' || value == null ){
		      		callback()
					return
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
					return
		      	}
		        if (!isEmail(value)) {
		          callback(new Error('请输入正确的邮箱'))
		        } else {
		          callback()
		        }
		      }
			  var checkPhoneDuplication = (rule, value, callback)=>{
			   	let that = this
			  		  		
			   	getCommHttpData({
			   		url: 'uc/user/checkUnique',
			   		method: 'post',
			   		contentType: 2,
			   		data: { 
			   			mobile: value,
						userId:that.userId,
						name:that.form.teacherName,
						userType:userType
			   		}
			   	}, function(data) {
			   		if(data && data.code === 0) {
			   			if(data.msg != 'success'){
			   				callback(new Error(data.msg))
			   			}else{
			   				callback()
			   			}
			   		}
			   	})
			   }
			   var checkEmailDuplication =(rule, value, callback)=>{
			   	let that = this			  		
			   	getCommHttpData({
			   		url: 'uc/user/checkUnique',
			   		method: 'post',
			   		contentType: 2,
			   		data: { 
			   			email: value,
						userId:that.userId,
						name:that.form.teacherName,
						userType:userType
			   		}
			   	}, function(data) {
			   		if(data && data.code === 0) {
			   			if(data.msg != 'success'){
			   				callback(new Error(data.msg))
			   			}else{
			   				callback()
			   			}
			   		}
			   	})
			   }
			   var checkIdentityNumDuplication = (rule, value, callback)=>{
				   
			   	let that = this		  		
			   	getCommHttpData({
			   		url: 'uc/user/checkUnique',
			   		method: 'post',
			   		contentType: 2,
			   		data: { 
			   			identityNum: value,
						userId:that.userId,
						name:that.form.teacherName,
						userType:userType
			   		}
			   	}, function(data) {
			   		if(data && data.code === 0) {
			   			if(data.msg != 'success'){
			   				callback(new Error(data.msg))
			   			}else{
			   				callback()
			   			}
			   		}
			   	})
			   }
			   var checkTeacherNumDuplication = (rule, value, callback)=>{
			   	let that = this			  		
			   	getCommHttpData({
			   		url: 'uc/user/checkUnique',
			   		method: 'post',
			   		contentType: 2,
			   		data: { 
			   			teacherNum: value,
						userId:that.userId,
						name:that.form.teacherName,
						userType:userType
			   		}
			   	}, function(data) {
			   		if(data && data.code === 0) {
			   			if(data.msg != 'success'){
			   				callback(new Error(data.msg))
			   			}else{
			   				callback()
			   			}
			   		}
			   	})
			   }
			
			return {
				userId:'',
				schoolId: this.GLOBAL.getOrgId(),
				activeNames:['1','2'],
				isCheck:2,
				apiUrl: window.SITE_CONFIG.baseUrlMedia,
				imgUrl: window.SITE_CONFIG.imgIP,
				imageUrl: '',
				uploadFile: {
					type: ''
				},
				errorGoodsImg: 'this.src="' + require('../../../assets/img/pic_default.jpg') + '";this.onerror = null',
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				roleTeam: [], //角色
				subOption: [], //科目
				thesub: [], //教师代课

				degreeTypeList: [],
				politicsTypeList: [],
				folkTypeList: [],
				teacherProfessorList: [],
				teacherOriginTypeList: [],
				humanFormTypeList: [],
				contractStateTypeList: [],
				healthCodeTypeList: [],
				marriageCodeTypeList: [],
				teacherTypecodeTypeList: [],
				informationAbilityTypeList: [],

				pca: pca,
				pcaa: pcaa,
				userEntity: {},
				teacherId: '',
				activeName: 'first',
				dlg:10,
				form: {
					checkUnique:'check',
					teacherId: undefined,
					schoolYearId: 86,
					termId: 2,
					nativePlace:'',
					teacherName: '',
					identityNum: '',
					teacherNum: '',
					spellName: '',
					icon: '',
					beforeName: '',
					weChat:'',
					qq:'',
					sex: '1',
					folk: '',
					birthday: '',
					email: '',
					politics: '',
					nationality: '',
					telPhone: '',
					birthPlace: '',
					teacherOrigin: '',
					teacherTypecode: '',
					isEditing: '',
					modality: '',
					contractState: '',
					enterDate: '',
					teacherCode: '',
					health: 1,
					marriage: '',
					isFullTime: '',
					workDate: '',
					grassRootsStartDate: '',
					grassRootsEndDate: '',
					isSpecialTrain: '',
					isSpecialCertificate: '',
					informationAbility: '',
					isFreeTeacherTraining: '',
					isGrassRoots: '',
					isCounty: '',
					isInformationHealth: '',
					isSuperfine: '',
					
				},
				programYearMonth:[],
				rules: {
					checkUnique: [{required: true,message: '以下内容最少输入一项',trigger: 'blur'},{ validator: validateEmpty, trigger: 'blur' }],
					teacherTypecode:[{
						required: true,
						message: '请选择教职工类别',
						trigger: 'change'
					}],
					teacherName: [{
							required: true,
							message: '请输入姓名',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 20,
							message: '姓名不能超过20个字符',
							trigger: 'blur'
						}
					],
					usedName: [{
						min: 1,
						max: 20,
						message: '曾用名不能超过20个字符',
						trigger: 'blur'
					}],
					identityNum: [ 
						{ validator: validateIdentity, trigger: 'blur' },
						{ validator: checkIdentityNumDuplication, trigger: 'blur' }
						],
					telPhone: [
						{ validator: validateMobile, trigger: 'blur' },
						{ validator: checkPhoneDuplication, trigger: 'blur' }
						],
					email: [
						{ validator: validateEmail, trigger: 'blur' },
						{ validator: checkEmailDuplication, trigger: 'blur' }
						],
					teacherNum:[{
						max: 20,
						message: '教籍号长度不能大于20 个字符'
					},
					{ validator: checkTeacherNumDuplication, trigger: 'blur' }
					],
					qq:[{
						max: 20,
						message: 'qq长度不能大于20 个字符'
					}],
					weChat:[{
						max: 32,
						message: '微信号长度不能大于32 个字符'
					}],
//					modality:[{
//							required: true,
//							message: '请选择用人形式',
//							trigger: 'change'
//					}]
				},
				pickerOptions: {
		      		disabledDate(time) {
			            return time.getTime() > Date.now();
			        }
		     	}
			}
		},
		mounted() {
			this.getAppLgWidth()
			window.addEventListener('resize', () => {
				this.getAppLgWidth()
			})
			//学历
			getCommonDictByType(this, 'degree_type', 'degreeTypeList')
			//政治面貌
			getCommonDictByType(this, 'politics_type', 'politicsTypeList')
			//民族
			getCommonDictByType(this, 'folk_type', 'folkTypeList')
			//职称
			getCommonDictByType(this, 'teacher_professor', 'teacherProfessorList')
			//教职工来源
			getCommonDictByType(this, 'teacher_origin_type', 'teacherOriginTypeList')
			//教职工类别
			getCommonDictByType(this, 'teacher_typecode_type', 'teacherTypecodeTypeList')
			//用人形式
			getCommonDictByType(this, 'human_form_type', 'humanFormTypeList')
			//签订合同情况
			getCommonDictByType(this, 'contract_state_type', 'contractStateTypeList')

			//健康状况
			getCommonDictByType(this, 'health_code_type', 'healthCodeTypeList')
			//婚姻状况
			getCommonDictByType(this, 'marriage_code_type', 'marriageCodeTypeList')

			//信息技术能力
			getCommonDictByType(this, 'information_ability_type', 'informationAbilityTypeList')
			
			this.getDataInfo()
		},
		activated() {

		},
		methods: {
			getAppLgWidth(){
				if(window.innerWidth >=1600){
					this.dlg = 10
				}else if(window.innerWidth <1600){
					this.dlg = 14
				}
			},
			getDataInfo() {
				if(this.$route.query.teacherId == undefined) {
					this.form = {
						checkUnique:'check',
						teacherId: undefined,
						schoolYearId: 86,
						termId: 2,
						degree:'',
						professor:'',
						teacherName: this.$route.params.name,
						identityNum: this.$route.params.identityNum,
						teacherNum: this.$route.params.teacherNum,
						spellName: '',
						icon: '',
						beforeName: '',
						qq:'',
						weChat:'',
						sex: '1',
						folk: '',
						birthday: '',
						email: this.$route.params.email,
						politics: '',
						nationality: '',
						nativePlace: '',
						telPhone: this.$route.params.telPhone,
						birthPlace: '',
						teacherOrigin: '',
						teacherTypecode: '',
						isEditing: '',
						modality: '',
						contractState: '',
						enterDate: '',
						teacherCode: '',
						health: 1,
						marriage: '',
						isFullTime: '',
						workDate: '',
						grassRootsStartDate: '',
						grassRootsEndDate: '',
						isSpecialTrain: '',
						isSpecialCertificate: '',
						informationAbility: '',
						isFreeTeacherTraining: '',
						isGrassRoots: '',
						isCounty: '',
						isInformationHealth: '',
						isSuperfine: '',
						
					}
					this.programYearMonth = []
					return;
				}
				this.form.teacherId = this.$route.query.teacherId
				let that = this
				getCommHttpData({
					url: 'teacherManage/queryByTeacherId',
					method: 'get',
					contentType: 1,
					data: {
						teacherId: this.$route.query.teacherId
					}
				}, function(data) {
					if(data && data.code === 0) {
						that.form = data.list
						that.userId = data.list.userId;
						if(data.list.grassRootsStartDate != null && data.list.grassRootsStartDate != '' ){
							that.programYearMonth = [data.list.grassRootsStartDate,data.list.grassRootsEndDate]
						}else{
							that.programYearMonth = []
						}
						
						that.form.checkUnique ='check'
						that.form.sex = data.list.sex!= null ? data.list.sex.toString():''
						that.form.isFullTime =  data.list.isFullTime!= null ? data.list.isFullTime.toString():''
						that.form.isSpecialTrain =   data.list.isSpecialTrain!= null ? data.list.isSpecialTrain.toString():''
						that.form.isSpecialCertificate =  data.list.isSpecialCertificate!= null ? data.list.isSpecialCertificate.toString():''
						that.form.isFreeTeacherTraining =  data.list.isFreeTeacherTraining!= null ? data.list.isFreeTeacherTraining.toString():''
						that.form.isGrassRoots =   data.list.isGrassRoots!= null ? data.list.isGrassRoots.toString():''
						that.form.isCounty =   data.list.isCounty!= null ? data.list.isCounty.toString():''
						that.form.isInformationHealth =   data.list.isInformationHealth!= null ? data.list.isInformationHealth.toString():''
						that.form.isSuperfine =  data.list.isSuperfine!= null ? data.list.isSuperfine.toString():''
						that.form.isEditing =  data.list.isEditing!= null ? data.list.isEditing.toString():''
						
						
						
						if(that.form.birthPlace != null && that.form.birthPlace != ''){
							that.form.birthPlace = that.form.birthPlace.split(',')
						}
						if(that.form.nativePlace != null && that.form.nativePlace != ''){
							that.form.nativePlace = that.form.nativePlace.split(',')
						}
//						
						
						
					} 
					that.dataListLoading = false
				})
				
				
				
			},

			
			
			
			handleAvatarSuccess(res, file) {
				this.form.icon = res.url;
				//this.imageUrl = URL.createObjectURL(file.raw);
			},
			beforeAvatarUpload(file) {
				const fileExt = file.name.substring(file.name.lastIndexOf("."), file.name.length).toUpperCase();
				const isLt2M = file.size / 1024 / 1024 < 10;
				let isFormat = true;
				this.uploadFile.type = fileExt;
				if(fileExt != ".PNG" && fileExt != ".GIF" && fileExt != ".JPG" && fileExt != ".JPEG" && fileExt != ".BMP") {
					this.$message.error('上传图片格式不对!');
					isFormat = false;
				}
				if(!isLt2M) {
					this.$message.error('上传图片大小不能超过 10MB!');
					isFormat = false;
				}
				return isFormat;
			},
			createData() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						var that = this
						let paramData = this.form
						
						this.form.birthPlace = this.form.birthPlace!='' && this.form.birthPlace != null? this.form.birthPlace.toString():this.form.birthPlace
						this.form.nativePlace = this.form.nativePlace!=''  && this.form.nativePlace != null? this.form.nativePlace.toString():this.form.nativePlace
						
						let rootDate = this.programYearMonth
						
						if(rootDate !=null && rootDate.length!=0){
							this.form.grassRootsStartDate = rootDate[0]
							this.form.grassRootsEndDate = rootDate[1]
						}
						
						
						getCommHttpData({
							url: `/teacherManage/${this.$route.query.teacherId== undefined ? 'save' : 'update'}`,
							method: 'post',
							contentType: 2,
							operateType: 2,
							that: this,
							data: paramData
						}, function(data) {
							that.$router.push({
								name: 'teach-entry-manage'
							})
						})

					}
				})
			},

			//点击取消  返回
			cancel() {
				this.$emit("sure");
			},
			onSubmit() {
				console.log('submit!');
			}
		}
	}
</script>
<style>
	.el-row {
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.row-bg {
		padding: 10px 0;
		background-color: #ffffff;
		margin-bottom: 10px;
	}
	
	.panel-heading {
		font-size: 15px;
		font-weight: 600;
		color: #797979;
		border-left: 6px #3C85EE solid;
		padding: 5px 15px;
		border-top-right-radius: 0px;
		border-top-left-radius: 0px;
	}
	
	.el-input-width {
		width: 276px !important;
	}
	
	.submit .el-form-item__content {
		margin: 0 auto !important;
	}
	
	.portrait {
		display: block;
		height: auto;
		max-width: 100%;
		padding: 4px;
		margin-bottom: 20px;
		line-height: 1.428571429;
		background-color: #ffffff;
		border: 1px solid #dddddd;
		border-radius: 4px;
		-webkit-transition: all 0.2s ease-in-out;
		transition: all 0.2s ease-in-out;
		width: 160px;
	}
	
	.portrait img {
		display: block;
		height: auto;
		max-width: 100%;
		margin-right: auto;
		margin-left: auto;
		vertical-align: middle;
	}
	.header-body-collapse{
		width:200px;
		padding: 6px 0px 6px 10px;
		
	}
	.manage-container .el-r-border-top{
		border: none;
	}
	.manage-container .el-collapse-item__header{
		background:#f9fafc ;
		font-size:15px;
		font-weight: 600;
		color: #797979;
		padding: 24px 0;
	}
</style>
<style lang="scss" scoped>
@media screen and (max-width: 1400px){
    .xs-hidden{
        display: none;
    }
}
</style>
