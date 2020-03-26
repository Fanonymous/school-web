<template>
	<div class="show-register" style="background:#ffffff;padding: 20px;">
		<!--<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="个人档案" name="first">-->
				<el-form ref="stuForm" :model="form" :rules="rules" label-width="150px">
					<el-row type="flex" class="row-bg">
						<el-col :span="24">
							<header class="panel-heading">基本信息</header>
						</el-col>
					</el-row>
					<el-row type="flex" class="row-bg row-top">
						<el-col :span="6">
							<el-form-item label="姓名：" prop="stuName">
								<div>{{form.stuName}}</div>
							</el-form-item>
							<el-form-item label="性别：">
								<div v-if="form.sex==0">男</div>
								<div v-if="form.sex==1">女</div>
							</el-form-item>
							<el-form-item label="出生日期：">
								<div>{{form.birthday}}</div>
							</el-form-item>
							<el-form-item label="出生地：">
								<div>{{form.birthPlace}}</div>
							</el-form-item>
							<el-form-item label="手机号：">
								<div>{{form.telPhone}}</div>
							</el-form-item>
							<el-form-item label="学籍号：">
								<div>{{form.stuCode}}</div>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="曾用名：" prop="beforeName">
								<div>{{form.beforeName}}</div>
							</el-form-item>
							<el-form-item label="民族：">
								<div>{{form.folk}}</div>
							</el-form-item>
							<el-form-item label="政治面貌：">
								<div>{{form.politics}}</div>
							</el-form-item>
							<el-form-item label="籍贯：" style="padding-bottom: 5px;">
								<div>{{form.nativePlace}}</div>
							</el-form-item>
							<el-form-item label="邮箱：">
								<div>{{form.email}}</div>
							</el-form-item>
							<el-form-item label="身份证号：">
								{{form.identityNum}}
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<div>
								<img v-if="form.icon == null" src="~@/assets/img/pic_default.jpg" width="100px" height="auto" />
								<img v-else :src="imgUrl+form.icon" :onerror="errorGoodsImg" width="100px" height="auto" />
							</div>
						</el-col>
					</el-row>
					<el-row type="flex" class="row-bg ">
						<el-col :span="24">
							<header class="panel-heading">学校信息</header>
						</el-col>
					</el-row>
					<el-row type="flex" class="row-bg row-top">
						<el-col :span="6">
							<el-form-item label="班级：" prop='classId'>
								<div>{{form.gradeName}}{{form.className}}</div>
							</el-form-item>
							<el-form-item label="入学方式：">
								<div>{{form.startSchool}}</div>
							</el-form-item>
							<el-form-item label="就读方式：">
								<div>{{form.studyingOfWay}}</div>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="入学年月：">
								<div>{{form.startYear}}</div>
							</el-form-item>
							<el-form-item label="校内学号：">
								<div>{{form.schoolCode}}</div>
							</el-form-item>
							<el-form-item label="学生来源：">
								<div>{{form.studentSource}}</div>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row type="flex" class="row-bg">
						<el-col :span="24">
							<header class="panel-heading">学生个人辅助信息</header>
						</el-col>
					</el-row>
					<el-row type="flex" class="row-bg row-top">
						<el-col :span="6">
							<el-form-item label="健康状况：">
								<div>{{form.health}}</div>
							</el-form-item>
							<el-form-item label="留守儿童：">
								<div v-if="form.isLeftBehindChild===0">是</div>
								<div v-if="form.isLeftBehindChild===1">否</div>
							</el-form-item>
							<el-form-item label="独生子女：">
								<div v-if="form.isOnlyChild===0">是</div>
								<div v-if="form.isOnlyChild===1">否</div>
							</el-form-item>
							<el-form-item label="流动人口状况：">
								<div v-if="form.isFloatingPopulation===0">是</div>
								<div v-if="form.isFloatingPopulation===1">否</div>
							</el-form-item>
							<el-form-item label="户口所在地：">
								<div>{{form.registeredPlace}}</div>
							</el-form-item>
							<el-form-item label="学籍所在地：">
								<div>{{form.stuStatusPlace}}</div>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="血型：">
								<div>{{form.bloodType}}</div>
							</el-form-item>
							<el-form-item label="家庭年收入：">
								<div>{{form.familyIncome}}</div>
							</el-form-item>
							<el-form-item label="学生类别：">
								<div>{{form.stuType}}</div>
							</el-form-item>
							<el-form-item label="现住址：">
								<div>{{form.presentAddress}}</div>
							</el-form-item>
							<el-form-item label="邮政编码：">
								<div>{{form.postCode}}</div>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row type="flex" class="row-bg">
						<el-col :span="24">
							<header class="panel-heading">学生监护人信息</header>
						</el-col>
					</el-row>
					<el-row type="flex" class="row-bg  row-top" style="margin-bottom: 0;">
						<el-col :span="24" style="padding-top: 10px;padding-bottom: 5px;">
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
					<el-row type="flex" class="row-bg" style="padding-bottom: 0;margin-bottom: 0;padding-top: 0;">
						<el-col :span="24">
							<el-col :span="4">
								<el-input v-model="form.guardianName" disabled></el-input>
							</el-col>
							<el-col :span="4">
								<el-input v-model="form.guardianRelation" disabled></el-input>
							</el-col>
							<el-col :span="4">
								<el-input v-model="form.guardianPostalAddress" disabled></el-input>
							</el-col>
							<el-col :span="4">
								<el-input v-model="form.guardianTelephone" disabled></el-input>
							</el-col>
							<el-col :span="4">
								<el-input v-model="form.guardianEmail" disabled></el-input>
							</el-col>
						</el-col>
					</el-row>
					<el-row type="flex" class="row-bg" style="padding-top: 0;padding-bottom: 30px">
						<el-col :span="24">
							<el-col :span="4">
								<el-input v-model="form.guardianName1" disabled></el-input>
							</el-col>
							<el-col :span="4">
								<el-input v-model="form.guardianRelation1" disabled></el-input>
							</el-col>
							<el-col :span="4">
								<el-input v-model="form.guardianPostalAddress1" disabled></el-input>
							</el-col>
							<el-col :span="4">
								<el-input v-model="form.guardianTelephone1" disabled></el-input>
							</el-col>
							<el-col :span="4">
								<el-input v-model="form.guardianEmail1" disabled></el-input>
							</el-col>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>
			<!--<el-tab-pane label="变更记录" name="second">
				<el-table :data="tableData" border style="width: 100%;margin-top: 10px;">
					<el-table-column label="序号" type="index" width="55" align="center">
					</el-table-column>
					<el-table-column prop="date" label="变动类型" width="150" align="center">
					</el-table-column>
					<el-table-column prop="name" label="性情" align="center">
					</el-table-column>
					<el-table-column prop="province" label="变动时间" align="center">
					</el-table-column>
					<el-table-column prop="city" label="操作时间" align="center">
					</el-table-column>
				</el-table>
				<el-pagination @size-change="sizeChangeHandleLog" @current-change="currentChangeHandleLog" :current-page="pageIndexLog" :page-sizes="[10, 20, 50, 100]" :page-size="pageSizeLog" :total="totalPageLog" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</el-tab-pane>-->
		<!--</el-tabs>-->
	</div>
</template>

<script>
	import { pca, pcaa } from 'area-data'; // v5 or higher
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	export default {
		data() {
			return {
				activeName: 'first',
				pageIndexLog: 1,
				pageSizeLog: 10,
				totalPageLog: 0,
				schoolId: this.GLOBAL.getOrgId(),
				pca: pca,
				pcaa: pcaa,
				sysUserEntity: {},
				stuGuardianList: [],
				stuId: '',
				tableData: [],
				imgUrl: window.SITE_CONFIG.imgIP,
				errorGoodsImg: 'this.src="' + require('../../../assets/img/pic_default.jpg') + '";this.onerror = null',
				form: {
					stuName: '', //姓名
					sex: '', //性别
					birthday: '', //出生日期
					birthPlace: '', //出生地
					identityNum: '', //身份证号
					telPhone: '', //手机号
					beforeName: '', //曾用名
					folk: '', //民族
					politics: '', //政治面貌
					nativePlace: '', //籍贯
					email: '', //邮箱
					stuCode: '', //学籍号
					gradeName: '', //年级
					className: '', //班级
					startSchool: '', //入学方式
					studyingOfWay: '', //就读方式					
					startYear: '', //入学年月
					schoolCode: '', //校内学号
					studentSource: '', //学生来源
					health: '', //健康状况
					isLeftBehindChild: "", //留守儿童
					isOnlyChild: "", //独生子女
					isFloatingPopulation: "", //流动人口          
					registeredPlace: '', //户口所在地
					stuStatusPlace: '', //学籍所在地
					bloodType: '', //血型
					familyIncome: '', //家庭年收入
					stuType: '', //学生类别
					presentAddress: '', //现住址
					postCode: '', //邮政编码
					icon: '', //照片
					guardianName: '', //监护人姓名
					guardianName1: '',
					guardianRelation: '', //与监护人关系
					guardianRelation: '',
					guardianPostalAddress: '', //监护人联系地址
					guardianPostalAddress1: '',
					guardianTelephone: '', //联系人电话
					guardianTelephone1: '',
					guardianPostalCode: '', //邮政编码
					guardianPostalCode1: '',
					guardianEmail: '', //监护人电子信箱
					guardianEmail1: '',
				},
				rules: {
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
					gradeId: [{
						required: true,
						message: '请选择年级',
						trigger: 'blur'
					}],
					classId: [{
						required: true,
						message: '请选择班级',
						trigger: 'blur'
					}]
				}
			}

		},
		created() {
			this.stuId = this.$route.query.stuId;
			this.getList();
		},
		methods: {
//			//切换
//			handleClick() {
//				if(this.activeName == 'first') {
//					this.getList();
//				} else if(this.activeName == 'second') {
//					this.getlogList();
//				}
//			},
			//学生详情
			getList() {
				//	this.listLoading = true
				let that=this
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
						that.form.beforeName = data.stuInfo.beforeName, //曾用名
						that.form.sex = data.stuInfo.sex, //性别
						that.form.folk = data.stuInfo.folkName, //民族
						that.form.birthday = data.stuInfo.birthday, //出生日期
						that.form.politics = data.stuInfo.politicsName, //政治面貌
						that.form.birthPlace =!data.stuInfo.birthPlace||data.stuInfo.birthPlace==""?'':data.stuInfo.birthPlace, //出生地
						that.form.nativePlace =!data.stuInfo.nativePlace||data.stuInfo.nativePlace==""?'':data.stuInfo.nativePlace, //籍贯
						that.form.telPhone = data.stuInfo.telPhone, //手机号
						that.form.email = data.stuInfo.email, //邮箱
						that.form.stuCode = data.stuInfo.stuCode, //学籍号
						that.form.identityNum = data.stuInfo.identityNum, //身份证号
						that.form.gradeName = data.stuInfo.changeInfo.gradeName, //
						that.form.className = data.stuInfo.changeInfo.className, //班级
						that.form.startYear = data.stuInfo.changeInfo.enterSchoolDate, //入学年月
						that.form.startSchool = data.stuInfo.changeInfo.enterSchoolTypeName, //入学方式
						that.form.schoolCode = data.stuInfo.changeInfo.schoolStuCode, //校内学号
						that.form.studyingOfWay = data.stuInfo.changeInfo.attendSchoolTypeName, //就读方式
						that.form.studentSource = data.stuInfo.changeInfo.comeFromName, //学生来源
						that.form.health = data.stuInfo.healthName, //健康状况
						that.form.bloodType = data.stuInfo.bloodTypeName, //血型
						that.form.isLeftBehindChild =data.stuInfo.isLeftBehindChild!=null? data.stuInfo.isLeftBehindChild:'', //留守儿童
						that.form.familyIncome =data.stuInfo.familyIncome, //家庭年收入
						that.form.isOnlyChild =data.stuInfo.isOnlyChild!=null?data.stuInfo.isOnlyChild:'', //独生子女
						that.form.stuType =data.stuInfo.stuTypeName, //学生类别
						that.form.isFloatingPopulation = data.stuInfo.isFloatingPopulation!=null?data.stuInfo.isFloatingPopulation:'', //流动人口   
						that.form.registeredPlace = !data.stuInfo.registeredPlace||data.stuInfo.registeredPlace==""?'':data.stuInfo.registeredPlace, //户口所在地
						that.form.presentAddress =!data.stuInfo.presentAddress||data.stuInfo.presentAddress==""?'':data.stuInfo.presentAddress, //现住址
						that.form.stuStatusPlace =!data.stuInfo.stuStatusPlace ||data.stuInfo.stuStatusPlace==""?'':data.stuInfo.stuStatusPlace, //学籍所在地
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
						}
					}
				})
			},
			//变更记录
			//			getlogList(){
			//				getCommHttpData({
			//					url: 'visitor/getList',
			//					method: 'post',
			//					contentType: 2,
			//					data: {
			//						page: this.pageIndex,
			//						limit: this.pageSize,
			//						startDate: startDate,
			//						endDate:endDate,
			//						keywords: keywords
			//					}
			//				}, function(data) {
			//					if(data && data.code === 0) {
			//						if(data.page.list.length == 0 && that.pageIndex != 1) {
			//							that.pageIndexLog = 1
			//							that.getlogList()
			//						}
			//						that.logList = data.page.list
			//						that.totalPage = data.page.totalCount
			//					} else {
			//						that.logList = []
			//						that.totalPage = 0
			//					}
			////					that.listLoading = false
			//				})
			//			},
			//			// 每页数
			//			sizeChangeHandleLog(val) {
			//				this.pageSizeLog = val
			//				this.pageIndexLog = 1
			//				this.getlogList()
			//			},
			//			// 当前页
			//			currentChangeHandleLog(val) {
			//				this.pageIndexLog = val
			//				this.getlogList()
			//			},

		}
	}
</script>
<style scoped lang="scss">
.show-register{
	.el-row {
		/*	margin-bottom: 20px;*/
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.row-bg {
		padding: 10px 0;
		padding-bottom: 0;
		background-color: white;
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
	
	.row-top {
		margin-top: 10px;
		border-top: 1px solid #f1f4f5;
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
	
	.area-select .area-selected-trigger {
		padding: 0px 10px;
	}
	
	.area-select.large {
		width: 276px;
	}
}
	
</style>