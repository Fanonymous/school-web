<template>
	<div class="add_status" >
		<el-form ref="stuForm" :model="form" :rules="rules" label-width="200px">
			<el-row  class="row-bg">
				<el-col :span="24">
					<header class="panel-heading">基本信息</header>
				</el-col>
			</el-row>
			<el-row>
				<el-col :lg="10">
					<el-form-item label="姓名：" prop='stuName'>
						<el-col style="width:276px">
							<el-input v-model="form.stuName" placeholder="请输入姓名"></el-input>
						</el-col>
					</el-form-item>
					<el-form-item label="手机号：" prop="telPhone">
						<el-col style="width:276px">
							<el-input v-model="form.telPhone" placeholder="请输入手机号"></el-input>
						</el-col>
					</el-form-item>
					<el-form-item label="身份证号：" prop="identityNum">
						<el-col style="width:276px">
							<el-input v-model="form.identityNum" placeholder="请输入身份证号"></el-input>
						</el-col>
					</el-form-item>
					<el-form-item label="" >
						<el-input  type="type" placeholder="请输入身份证号" style="visibility: hidden;" ></el-input>
					</el-form-item>
					<el-form-item label="曾用名：" prop="beforeName">
						<el-col style="width:276px">
							<el-input v-model="form.beforeName" placeholder="请输入曾用名"></el-input>
						</el-col>
					</el-form-item>
					<el-form-item label="民族：">
						<el-select v-model="form.folk" @change="getEthnic" placeholder="请选择民族" class="el-input-width">
							<el-option v-for="item in ethnicOption" :key="item.value" :label="item.dictName" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="政治面貌：">
						<el-select v-model="form.politics" placeholder="请选择政治面貌" @change="getPolitical" class="el-input-width">
							<el-option v-for="item in policOption" :key="item.value" :label="item.dictName" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="籍贯：">
						<area-cascader class="el-area-select" type='text' :level='1' style="padding:0;" :data="pcaa" v-model="form.nativePlace" placeholder="请选择地址"></area-cascader>
					</el-form-item>
					
					
					
					
				</el-col>
				<el-col :lg="10">
					<el-form-item label="班级：" prop="classId">
						<el-select v-model="form.gradeId" @change="changeGrade" placeholder="请选择年级" style="width:200px">
							<el-option v-for="item in gradeOption" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
							</el-option>
						</el-select>
						<el-select v-model="form.classId" @change="getClass" clearable placeholder="请选择班级" style="width:200px">
							<el-option v-for="item in classOption" :key="item.classId" :label="item.className" :value="item.classId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="邮箱：" prop="email">
						<el-col style="width:276px">
							<el-input v-model="form.email" maxlength="320" placeholder="请输入邮箱"></el-input>
						</el-col>
					</el-form-item>
					<el-form-item label="学籍号：" prop="studentCode">
						<el-col style="width:276px">
							<el-input v-model="form.studentCode" placeholder="请输入学籍号"></el-input>
						</el-col>
					</el-form-item>
					<el-form-item label="" prop="checkUnique">
						<span style="color: #999999;">注：手机号/邮箱/学籍号/身份证号 至少输入一项。</span>
						<!-- <el-input v-model="form.checkUnique" style="visibility: hidden;" ></el-input> -->
					</el-form-item>
					<el-form-item label="性别：">
						<el-radio-group v-model="form.sex">
							<el-radio label="0">男</el-radio>
							<el-radio label="1">女</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="出生日期：">
						<el-date-picker v-model="form.birthday" :picker-options="pickerOptions" value-format='yyyy-MM-dd' type="date" placeholder="选择出生日期" class="el-input-width">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="出生地：">
						<area-cascader class="el-area-select" type='text' :level='1' style="padding:0;" :data="pcaa" v-model="form.birthPlace" placeholder="请选择出生地"></area-cascader>
					</el-form-item>					
					
				</el-col>
				<el-col :lg="4">
					<el-upload class="avatar-uploader" style="text-align: center;" :action="apiUrl+'/sys/oss/picUpload'" :show-file-list="false" :on-success="handleAvatarSuccess" :data="uploadFile" :before-upload="beforeAvatarUpload">
						<img v-if="form.icon == null" src="~@/assets/img/pic_default.jpg" width="120px" height="auto" />
						<img v-else :src="imgUrl+form.icon" :onerror="errorGoodsImg" width="120px" height="auto" />
						<div>
							<el-button type="text" size="small"> 修改头像</el-button>
						</div>
					</el-upload>
				</el-col>
			</el-row>
			<el-row class="row-bg">
				<el-col :span="24">
					<header class="panel-heading">学校信息</header>
				</el-col>
			</el-row>
			<el-row >
				<el-col :span="10">
					<el-form-item label="入学年月：">
						<el-date-picker v-model="form.startYear" :picker-options="pickerOptions" value-format='yyyy-MM-dd' type="date" placeholder="选择入学年月" class="el-input-width">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="入学方式：">
						<el-select v-model="form.startSchool" @change="getStartSchool" placeholder="请选择入学方式" class="el-input-width">
							<el-option v-for="item in startSchoolOption" :key="item.value" :label="item.dictName" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="就读方式：">
						<el-select v-model="form.studyingOfWay" @change="getStuOfWay" placeholder="请选择就读方式" class="el-input-width">
							<el-option v-for="item in studyingOfWayOption" :key="item.value" :label="item.dictName" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="10">
					<el-form-item label="校内学号：">
						<el-col style="width:276px">
							<el-input v-model="form.schoolCode" placeholder="请输入校内学号"></el-input>
						</el-col>
					</el-form-item>

					<el-form-item label="学生来源：">
						<el-select v-model="form.studentSource" @change="getStuSource" placeholder="请选择学生来源" class="el-input-width">
							<el-option v-for="item in studentSourceOption" :key="item.value" :label="item.dictName" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-collapse>
					<el-col :span="24">
					<el-collapse-item title="学生个人辅助信息" class="auxiliary" style="width:100%">
					<el-row style="padding-top: 20px;">
						<el-col :span="10">
							<el-form-item label="健康状况：">
								<el-select v-model="form.health" placeholder="请选择健康状况" @change="getHealth" class="el-input-width">
									<el-option v-for="item in healthOption" :key="item.value" :label="item.dictName" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="留守儿童：">
								<el-radio-group v-model="form.isLeftBehindChild">
									<el-radio label="0">是</el-radio>
									<el-radio label="1">否</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="独生子女：">
								<el-radio-group v-model="form.isOnlyChild">
									<el-radio label="0">独生子女</el-radio>
									<el-radio label="1">非独生子女</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="流动人口状况：">
								<el-radio-group v-model="form.isFloatingPopulation">
									<el-radio label="0">流动人口</el-radio>
									<el-radio label="1">非流动人口</el-radio>
								</el-radio-group>
							</el-form-item>
							<el-form-item label="户口所在地：">
								<area-cascader class="el-area-select" type='text' :level='1' style="padding:0;" :data="pcaa" v-model="form.registeredPlace" placeholder="请选择户口所在地"></area-cascader>
							</el-form-item>
							<el-form-item label="学籍所在地：">
								<area-cascader class="el-area-select" type='text' :level='1' style="padding:0;" :data="pcaa" v-model="form.stuStatusPlace" placeholder="请选择学籍所在地"></area-cascader>
							</el-form-item>
						</el-col>
						<el-col :span="10">
							<el-form-item label="血型：">
								<el-select v-model="form.bloodType" @change="getBloodType" placeholder="请选择血型" class="el-input-width">
									<el-option v-for="item in bloodTypeOption" :key="item.value" :label="item.dictName" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="家庭年收入：" prop="familyIncome">
								<el-col style="width:276px">
									<el-input v-model="form.familyIncome" placeholder="请输入家庭年收入"></el-input>
								</el-col>
							</el-form-item>
							<el-form-item label="学生类别：">
								<el-select v-model="form.stuType" @change="getStuType" placeholder="请选择学生类别" class="el-input-width">
									<el-option v-for="item in stuTypeOption" :key="item.value" :label="item.dictName" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="现住址：">
								<area-cascader class="el-area-select" type='text' :level='1' style="padding:0;" :data="pcaa" v-model="form.presentAddress" placeholder="请选择现住址"></area-cascader>
							</el-form-item>
							<el-form-item label="邮政编码：" prop="postCode">
								<el-col style="width:276px">
									<el-input v-model="form.postCode" placeholder="请输入邮政编码"></el-input>
								</el-col>
							</el-form-item>
						</el-col>
					</el-row>
					</el-collapse-item>
					</el-col>
				</el-collapse >
			</el-row>
			<el-row>
				<el-collapse>
					<el-col :span="24">
						<el-collapse-item title="学生监护人信息" class="guardian" style="width:100%;">
								<el-row style="margin-bottom: 0;padding-top: 0;padding-left: 20px;">
									<el-col :span="24">
										<el-col :span="4">
											<div class="name" style="text-align:center">姓名</div>
										</el-col>
										<el-col :span="4">
											<div class="name" style="text-align:center">关系</div>
										</el-col>
										<el-col :span="4">
											<div class="name" style="text-align:center">联系地址</div>
										</el-col>
										<el-col :span="4">
											<div class="name" style="text-align:center">联系电话</div>
										</el-col>
										<el-col :span="4">
											<div class="name" style="text-align:center">邮箱</div>
										</el-col>
									</el-col>
								</el-row>
								<el-row style="padding-bottom: 0;margin-bottom: 0;padding-top: 0;padding-left: 20px;">
									<el-col :span="24">
										<el-col :span="4">
											<el-form-item label="" style="margin-bottom: 20px;" label-width="10px" prop="guardianName">
												<el-input v-model="form.guardianName" placeholder="请输入姓名"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="4">
											<el-form-item label="" label-width="10px" prop="guardianRelation">
												<el-input v-model="form.guardianRelation" placeholder="请输入关系"></el-input>
											</el-form-item>
										</el-col>
										<el-col :span="4">
											<el-form-item label="" label-width="10px" prop="guardianPostalAddress">
												<el-input v-model="form.guardianPostalAddress" placeholder="请输入联系地址"></el-input>
											</el-form-item>	
										</el-col>
										<el-col :span="4">
											<el-form-item label="" label-width="10px" prop="guardianTelephone">
												<el-input v-model="form.guardianTelephone" placeholder="请输入电话"></el-input>
											</el-form-item>	
										</el-col>
										<el-col :span="4">
											<el-form-item label="" label-width="10px" prop="guardianEmail">
												<el-input v-model="form.guardianEmail" placeholder="请输入邮箱"></el-input>
											</el-form-item>	
										</el-col>
									</el-col>
								</el-row>
								<el-row  style="padding-top: 0;padding-bottom: 30px;padding-top: 0;padding-left: 20px;">
								<el-col :span="24">
									<el-col :span="4">
										<el-form-item label="" label-width="10px" prop="guardianName1">
											<el-input v-model="form.guardianName1" placeholder="请输入姓名"></el-input>
										</el-form-item>	
									</el-col>
									<el-col :span="4">
										<el-form-item label="" label-width="10px" prop="guardianRelation1">
											<el-input v-model="form.guardianRelation1" placeholder="请输入关系"></el-input>
										</el-form-item>	
									</el-col>
									<el-col :span="4">
										<el-form-item label="" label-width="10px" prop="guardianPostalAddress1">
											<el-input v-model="form.guardianPostalAddress1" placeholder="请输入联系地址"></el-input>
										</el-form-item>	
									</el-col>
									<el-col :span="4">
										<el-form-item label="" label-width="10px" prop="guardianTelephone1">
											<el-input v-model="form.guardianTelephone1" placeholder="请输入电话"></el-input>
										</el-form-item>	
									</el-col>
									<el-col :span="4">
										<el-form-item label="" label-width="10px" prop="guardianEmail1">
											<el-input v-model="form.guardianEmail1" placeholder="请输入邮箱"></el-input>
										</el-form-item>	
									</el-col>
								</el-col>
							</el-row>
						</el-collapse-item>
					</el-col>
				</el-collapse >
			</el-row>
			<el-form-item class="submit" style="margin-top:30px;padding-bottom: 30px;">
				<div style="text-align:center;">
					<el-button type="primary" @click="createData">确定</el-button>
					<el-button @click="cancel">取消</el-button>
				</div>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import { pca, pcaa } from 'area-data'; // v5 or higher
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	import { isEmail, isMobile,isIdentityNum } from '@/utils/validate'
	export default {
		data() {
			let userType = this.$cookie.get('userType')
			var validateEmpty = (rule, value, callback) => {
		      	if(this.form.identityNum == '' && this.form.telPhone=='' && this.form.email=='' && this.form.studentCode==''){
		          callback(new Error('手机号/邮箱/学籍号/身份证号 至少输入一项。'))
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
									name:that.form.stuName,
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
									name:that.form.stuName,
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
									name:that.form.stuName,
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
									name:that.form.stuName,
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
				pickerOptions:{
					disabledDate(time) {
			            return time.getTime() > Date.now();
			        },
				},
				schoolId: this.GLOBAL.getOrgId(),
				apiUrl: window.SITE_CONFIG.baseUrlMedia,
				imgUrl: window.SITE_CONFIG.imgIP,
				imageUrl: '',
				uploadFile: {
					type: ''
				},
				errorGoodsImg: 'this.src="' + require('../../../assets/img/pic_default.jpg') + '";this.onerror = null',
				ethnicOption: [], //民族
				policOption: [], //政治面貌
				gradeOption: [], //年级
				startSchoolOption: [], //入学方式
				studyingOfWayOption: [], //就读方式
				classOption: [], //班级
				stuTypeOption: [], //学生类别
				studentSourceOption: [], //学生来源
				healthOption: [], //健康状况
				bloodTypeOption: [], //血型
				pca: pca,
				pcaa: pcaa,
				changeInfo: {},
				guardianList: [],
				stuId: '',
				userId:undefined,
				form: {
					checkUnique:'check',
					stuName: '', //姓名
					sex: '0', //性别
					birthday: '', //出生日期
					birthPlace: [], //出生地
					identityNum: '', //身份证号
					telPhone: '', //手机号
					beforeName: '', //曾用名
					folk: '', //民族
					politics: '', //政治面貌
					nativePlace: [], //籍贯
					email: '', //邮箱
					studentCode: '', //学籍号
					gradeId: undefined, //年级
					classId: '', //班级
					startSchool: '', //入学方式
					studyingOfWay: '', //就读方式					
					startYear: '', //入学年月
					schoolCode: '', //校内学号
					studentSource: '', //学生来源
					health: '', //健康状况
					isLeftBehindChild: "", //留守儿童
					isOnlyChild: "", //独生子女
					isFloatingPopulation: "", //流动人口          
					registeredPlace: [], //户口所在地
					stuStatusPlace: [], //学籍所在地
					bloodType: '', //血型
					familyIncome: '', //家庭年收入
					stuType: '', //学生类别
					presentAddress: [], //现住址
					postCode: '', //邮政编码
					icon: '', //照片
					guardianName: '', //监护人姓名
					guardianName1: '',
					guardianRelation: '', //与监护人关系
					guardianRelation1: '',
					guardianPostalAddress: '', //监护人联系地址
					guardianPostalAddress1: '',
					guardianTelephone: '', //联系人电话
					guardianTelephone1: '',
					guardianEmail: '', //邮箱
					guardianEmail1: '',
				},
				rules: {
					checkUnique: [{required: true,message: '手机号/邮箱/学籍号/身份证号 至少输入一项。',trigger: 'blur'},{ validator: validateEmpty, trigger: 'blur' }],
					stuName: [{
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
					beforeName: [{
						min: 1,
						max: 20,
						message: '曾用名不能超过20个字符',
						trigger: 'blur'
					}],
					classId: [{
						required: true,
						message: '请选择年级班级',
						trigger: 'blur'
					}],
					familyIncome: [{
						pattern: /^[1-9]\d*(\.\d+)?$/,
						message: '年收入必须为数字'
					}],
					postCode: [{
						pattern:/^[0-9]\d{5}$/,
						message: '请输入正确的邮政编码'
					}],
					identityNum: [ { validator: validateIdentity, trigger: 'blur' },{ validator: checkIdentityNumDuplication, trigger: 'blur' }],
					telPhone: [{ validator: validateMobile, trigger: 'blur' },{ validator: checkPhoneDuplication, trigger: 'blur' }],
					email: [{ validator: validateEmail, trigger: 'blur' },{ validator: checkEmailDuplication, trigger: 'blur' }],
					studentCode:[{
						max: 20,
						message: '学籍号长度不能大于20 个字符'
					},{ validator: checkTeacherNumDuplication, trigger: 'blur' }],
					guardianName: [{
						min: 1,
						max: 20,
						message: '姓名不能超过20个字符',
						trigger: 'blur'
					}],
					guardianName1: [{
						min: 1,
						max: 20,
						message: '姓名不能超过20个字符',
						trigger: 'blur'
					}],
					guardianRelation: [{
						min: 1,
						max: 20,
						message: '不能超过20个字符',
						trigger: 'blur'
					}],
					guardianRelation1: [{
						min: 1,
						max: 20,
						message: '不能超过20个字符',
						trigger: 'blur'
					}],
					guardianPostalAddress: [{
						min: 1,
						max: 100,
						message: '不能超过100个字符',
						trigger: 'blur'
					}],
					guardianPostalAddress1: [{
						min: 1,
						max: 100,
						message: '不能超过100个字符',
						trigger: 'blur'
					}],
					guardianTelephone: [{ validator: validateMobile, trigger: 'blur' }],
					guardianTelephone1: [{ validator: validateMobile, trigger: 'blur' }],
					guardianEmail:  [{ validator: validateEmail, trigger: 'blur' }],
					guardianEmail1: [{ validator: validateEmail, trigger: 'blur' }],
				}
			}
		},
		mounted() {
			this.getEthnic();
			this.getPolitical();
			this.getStartSchool();
			this.getStuOfWay();
			this.getStuSource();
			this.getHealth();
			this.getBloodType();
			this.getStuType();
			this.getGrade();
			
		},
		created() {
			this.stuId = this.$route.query.stuId;
			if(this.stuId&&this.stuId!=''){
				this.getList()
			}
		},
		methods: {
			//编辑
			getList() {
				//	this.listLoading = true
				let that = this;
				getCommHttpData({
					url: 'stu/basicInfo/getStuBasicInfo',
					method: 'post',
					contentType: 1,
					data: {
						stuId: this.stuId,
					}
				}, function(data) {
					if(data && data.code === 0) {
						that.form.stuName = data.stuInfo.stuName //姓名
						that.form.beforeName = data.stuInfo.beforeName //曾用名
						that.form.sex = data.stuInfo.sex //性别
						that.form.folk = data.stuInfo.folk //民族
						that.form.birthday = data.stuInfo.birthday //出生日期
						that.form.politics = data.stuInfo.politics //政治面貌
						that.form.birthPlace =!data.stuInfo.birthPlace||data.stuInfo.birthPlace==""?'':data.stuInfo.birthPlace.split(',') //出生地
						that.form.nativePlace =!data.stuInfo.nativePlace||data.stuInfo.nativePlace==""?'':data.stuInfo.nativePlace.split(',') //籍贯
						that.form.telPhone = data.stuInfo.telPhone //手机号
						that.form.email = data.stuInfo.email //邮箱
						that.form.studentCode = data.stuInfo.stuCode //学籍号
						that.form.identityNum = data.stuInfo.identityNum //身份证号
						that.form.gradeId = data.stuInfo.changeInfo.gradeId//
						that.form.classId = that.form.gradeId ? data.stuInfo.changeInfo.classId : null //班级
						that.form.startYear = data.stuInfo.changeInfo.enterSchoolDate //入学年月
						that.form.startSchool = data.stuInfo.changeInfo.enterSchoolType //入学方式
						that.form.schoolCode = data.stuInfo.changeInfo.schoolStuCode //校内学号
						that.form.studyingOfWay = data.stuInfo.changeInfo.attendSchoolType //就读方式
						that.form.studentSource = data.stuInfo.changeInfo.comeFrom //学生来源
						that.form.health = data.stuInfo.health //健康状况
						that.form.bloodType = data.stuInfo.bloodType//血型
						//that.form.isLeftBehindChild = ?data.stuInfo.isLeftBehindChild.toString():'', //留守儿童
						if(data.stuInfo.isLeftBehindChild != null){
							that.form.isLeftBehindChild = data.stuInfo.isLeftBehindChild.toString()
						}else{
							that.form.isLeftBehindChild = ''
						}
						that.form.familyIncome =data.stuInfo.familyIncome, //家庭年收入
						that.form.isOnlyChild =data.stuInfo.isOnlyChild != null?data.stuInfo.isOnlyChild.toString():'', //独生子女
						that.form.stuType =data.stuInfo.stuType, //学生类别
						that.form.isFloatingPopulation =data.stuInfo.isFloatingPopulation != null? data.stuInfo.isFloatingPopulation.toString():'', //流动人口   
						that.form.registeredPlace = !data.stuInfo.registeredPlace||data.stuInfo.registeredPlace==""?'':data.stuInfo.registeredPlace.split(','), //户口所在地
						that.form.presentAddress =!data.stuInfo.presentAddress||data.stuInfo.presentAddress==""?'':data.stuInfo.presentAddress.split(','), //现住址
						that.form.stuStatusPlace =!data.stuInfo.stuStatusPlace ||data.stuInfo.stuStatusPlace==""?'':data.stuInfo.stuStatusPlace.split(','), //学籍所在地
						that.form.postCode =data.stuInfo.postCode; //邮政编码				
						that.form.icon = data.stuInfo.icon; //照片
						if(data.stuInfo.guardianList){
								that.form.guardianName = data.stuInfo.guardianList.length>0?data.stuInfo.guardianList[0].name:'';//监护人姓名
								that.form.guardianName1 = data.stuInfo.guardianList.length>0?data.stuInfo.guardianList[1].name:'';
								that.form.guardianRelation =data.stuInfo.guardianList.length>0?data.stuInfo.guardianList[0].relation:''; //与监护人关系
								that.form.guardianRelation1 =data.stuInfo.guardianList.length>0?data.stuInfo.guardianList[1].relation:'';
								that.form.guardianPostalAddress =data.stuInfo.guardianList.length>0?data.stuInfo.guardianList[0].address:''; //监护人联系地址
								that.form.guardianPostalAddress1 =data.stuInfo.guardianList.length>0?data.stuInfo.guardianList[1].address:'';
								that.form.guardianTelephone = data.stuInfo.guardianList.length>0?data.stuInfo.guardianList[0].telPhone:'';//联系人电话
								that.form.guardianTelephone1 = data.stuInfo.guardianList.length>0?data.stuInfo.guardianList[1].telPhone:'';
								that.form.guardianEmail = data.stuInfo.guardianList.length>0?data.stuInfo.guardianList[0].email:''; //邮箱
								that.form.guardianEmail1 = data.stuInfo.guardianList.length>0?data.stuInfo.guardianList[1].email:''
						};
						that.userId=data.stuInfo.userId
						that.getClass()
					}
				})
			},
			//添加修改图片
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
			//民族
			getEthnic() {
				getCommonDictByType(this, 'folk_type', 'ethnicOption');
			},
			//政治面貌
			getPolitical() {
				getCommonDictByType(this, 'politics_type', 'policOption');
			},
			//入学方式
			getStartSchool() {
				getCommonDictByType(this, 'start_school_type', 'startSchoolOption');
			},
			//就读方式
			getStuOfWay() {
				getCommonDictByType(this, 'of_way_type', 'studyingOfWayOption');
			},
			//学生来源
			getStuSource() {
				getCommonDictByType(this, 'student_source_type', 'studentSourceOption');
			},
			//健康状况
			getHealth() {
				getCommonDictByType(this, 'health_code_type', 'healthOption');
			},
			//血型
			getBloodType() {
				getCommonDictByType(this, 'blood_type', 'bloodTypeOption');
			},
			//学生类别
			getStuType() {
				getCommonDictByType(this, 'student_typecode_type', 'stuTypeOption');
			},
			//年级
			getGrade() {
				let that = this;
				getCommHttpData({
					url: 'common/queryGradeListAuthority',
					method: 'get',
					contentType: 1,
//					data: {},
				}, function(data) {
					that.gradeOption=data.list;
				})
			},
			//改变年级
			changeGrade(){
					this.form.classId='';
					this.getClass()
			},
			//班级
			getClass() {
				let that = this;
				if(!!this.form.gradeId){
					getCommHttpData({
						url: 'common/queryClassListAuthority',
						method: 'get',
						contentType: 1,
						data: {
							gradeId:this.form.gradeId
						}
					}, function(data) {
						that.classOption=data.list;
					})	
				}

			},
			createData() {
				this.$refs['stuForm'].validate((valid) => {
					if(valid) {
						this.form.nativePlace = this.form.nativePlace.length > 0 ? (this.form.nativePlace).toString() : ''
						this.form.birthPlace =this.form.birthPlace.length >0 ? (this.form.birthPlace).toString() : ''
						this.form.registeredPlace = this.form.registeredPlace.length >0 ? (this.form.registeredPlace).toString() : ''
						this.form.stuStatusPlace =this.form.stuStatusPlace.length >0 ? (this.form.stuStatusPlace).toString() : ''
						this.form.presentAddress =this.form.presentAddress.length > 0 ? (this.form.presentAddress).toString() :''
						let changeInfo = {
							'schoolId': this.schoolId,
							gradeId: this.form.gradeId,
							'classId': this.form.classId,
							'schoolStuCode': this.form.schoolCode,
							'enterSchoolType': this.form.startSchool,
							'attendSchoolType': this.form.studyingOfWay,
							'comeFrom': this.form.studentSource,
							enterSchoolDate:this.form.startYear
						};
						let guardianList = [{
							name: this.form.guardianName,
							relation: this.form.guardianRelation,
							address: this.form.guardianPostalAddress,
							telPhone: this.form.guardianTelephone,
							postCode: this.form.guardianPostalCode,
							email: this.form.guardianEmail
						}, {
							name: this.form.guardianName1,
							relation: this.form.guardianRelation1,
							address: this.form.guardianPostalAddress1,
							telPhone: this.form.guardianTelephone1,
							postCode: this.form.guardianPostalCode1,
							email: this.form.guardianEmail1
						}];
						let stuId=this.stuId==''?undefined:this.stuId;
						let that = this
						getCommHttpData({
							url: 'stu/basicInfo/saveOrUpdate',
							method: 'post',
							contentType: 2,
							data: {
								stuName: this.form.stuName,
								icon: this.form.icon,
								stuCode: this.form.studentCode,
								beforeName: this.form.beforeName,
								birthday: this.form.birthday,
								nativePlace: this.form.nativePlace,
								politics: this.form.politics,
								folk: this.form.folk,
								identityNum: this.form.identityNum,
								telPhone: this.form.telPhone,
								email: this.form.email,
								birthPlace: this.form.birthPlace,
								presentAddress: this.form.presentAddress,
								registeredPlace: this.form.registeredPlace,
								postCode: this.form.postCode,
								stuStatusPlace: this.form.stuStatusPlace,
								health: this.form.health,
								bloodType: this.form.bloodType,
								isLeftBehindChild: this.form.isLeftBehindChild,
								familyIncome: this.form.familyIncome,
								isOnlyChild: this.form.isOnlyChild,
								stuType: this.form.stuType,
								isFloatingPopulation: this.form.isFloatingPopulation,
								guardianList: guardianList,
								changeInfo:changeInfo,
								sex:this.form.sex,
								stuId:stuId,
								schoolId:this.schoolId,
								userId:this.userId
							}
						}, function(data) {
							if(data.code == 0) {
								that.$message({
									type: 'success',
									message: '操作成功!'
								})
								that.$router.go(-1);
							}
						})
					}
				})
			},
			//返回前一页
			cancel() {
				this.$router.go(-1);
			}
		}
	}
</script>
<style scoped lang="scss">
.add_status{
	background: white;
	.el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .el-collapse{
        width: 100%;
    }
    .panel-heading {
        font-size: 15px;
        font-weight: 600;
        color: #797979;
        background: #f9fafc;
        padding: 15px 15px;
        border-top-right-radius: 0px;
        border-top-left-radius: 0px;
        border-left: 6px #3C85EE solid;
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
        .el-collapse{
        border:none
    }
    .el-collapse-item__wrap{
        background: white;
    }
    .add_status{
        background-color: #ffffff;
    }
    .el-collapse-item__wrap{
        border:none
    }
    .portrait img {
        display: block;
        height: auto;
        max-width: 100%;
        margin-right: auto;
        margin-left: auto;
        vertical-align: middle;
    }
    .name{
        margin-top: 10px;
    }
    .avatar-uploader .el-upload:hover {
		border-color: none;
	}
}
   
</style>