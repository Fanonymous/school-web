<template>
	<div class="update-course" v-loading="isCourseLoading" element-loading-text="正在发布课表">
		<el-card class="margin-bottom-10">
			<div class="step-course">
				<div class="step-item current">
					<span>
						<span v-if="active==0">1</span>
					<i v-if="active==1" class="el-icon-check"></i>
					</span>
					录入课表
				</div>
				<div class="hr" :class="active ==1 ? 'currenthr' : ''"></div>
				<div class="step-item" :class="active ==1 ? 'current' : ''"><span>2</span>发布课表</div>
			</div>
		</el-card>
		<div v-show="active==0">
			<el-card>
				<div class="first-step" style="position: relative;" :style="'height: '+appHeight+'px;overflow-y: auto;'">
					<div v-show="!isShowImport">
						<div class="schedule-title margin-bottom-20" style="margin-top: 110px;">试一试？导入excel课表自动识别哦~</div>
						<div class="form-data">
							<el-form ref="dataForm" label-width="160px">
								<el-form-item label="请选择学期：" prop="applicationType">
									<el-select v-model="yearTermId" placeholder="请选择学期" @change="changeSchoolTerm">
										<el-option v-for="item in yearList" v-if = "!item.isDisabled" :key="item.yearTermId" :label="item.yearName" :value="item.yearTermId">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="请选择年级：" prop="applicationType">
									<el-select v-model="gradeId" clearable placeholder="请选择年级" @change="changeGrade" style="margin-right: 5px;">
										<el-option v-for="item in gradeList " :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
										</el-option>
									</el-select>
								</el-form-item>
								<template v-if="!!gradeInfo">
									<div style="color:red;font-size: 12px;margin-left: 160px;margin-bottom: 15px;">{{gradeInfo}}</div>
									<div style="color:red;font-size: 12px;margin-left: 160px;margin-bottom: 15px;">{{noGradeInfo}}</div>
								</template>
								<div style="position: relative;">
									<uploadfile label="请选择录入文件：" ref="uploadpic" :limit=1 :fileExt="fileExtWechat" uploadUrl="picUpload" @refreshDataList="getPicSrc"></uploadfile>
									<div class="import-btn1">
										<el-button type="success" size="small" @click="dataFormSubmit()">导入</el-button>
										<el-button type="text" style="margin-left: 10px;" @click="downloadTemplate">下载模板</el-button>
										<el-popover v-model="visible1" placement="bottom" width="400" trigger="click">
											<div class="popover-container">
												<span class="popver-close" @click="visible1=false"><i class="el-icon-close"></i></span>
												<div>提高识别率？</div>
												<div>按照以下规则优化课表，识别率会更高哦~</div>
												<div>1. 班级名称: 样式最好如“1班”，“2班”。</div>
												<div>2. 科目名称：最好使用科目全称。</div>
												<div>3. 星期名称：样式最好如“星期一”或“周一” 。</div>
												<div>4. 节次名称：样式最好如“第一节”，“第二节”。</div>
											</div>
											<el-button type="text" slot="reference" style="margin-left: 10px;">提高识别率？</el-button>
										</el-popover>
									</div>
								</div>
								<el-dialog title="" :visible.sync="batchClick">
									<el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"></el-progress>
								</el-dialog>
								<!--<el-form-item label="">
									
								</el-form-item>-->
								<!--<template v-if="batchClick && (!!noClassInfo || !!repeatClass)">
									<div style="font-size: 14px;margin-left: 160px;border: 1px solid #E0E0E0;padding: 15px;">
										<div>{{noClassInfo}}</div>
										<div>{{repeatClass}}</div>
									</div>
								</template>-->
							</el-form>
						</div>
					</div>
					<div v-show="isShowImport" :style="'height: '+appHeight+'px;overflow-y: auto;'">
						<div class="schedule-title">录入确认</div>
						<div style="text-align: right;">
							<el-popover v-model="visible2" placement="bottom" width="400" trigger="click">
								<div class="popover-container">
									<span class="popver-close" @click="visible2=false"><i class="el-icon-close"></i></span>
									<div>提高识别率？</div>
									<div>按照以下规则优化课表，识别率会更高哦~</div>
									<div>1. 班级名称: 样式最好如“1班”，“2班”。</div>
									<div>2. 科目名称：最好使用科目全称。</div>
									<div>3. 星期名称：样式最好如“星期一”或“周一” 。</div>
									<div>4. 节次名称：样式最好如“第一节”，“第二节”。</div>
								</div>
								<el-button type="text" slot="reference" style="margin-left: 10px;">提高识别率？</el-button>
							</el-popover>
						</div>
						<div class="course-item">
							<el-form label-position="left" :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
								<div class="course-title">
									<div>1. 检测到有以下科目，为保证录入准确性，请您确认哪些是科目：</div>
									<div class="font-grey">（使用科目全称，识别率会更高哦~）</div>
								</div>
								<el-form-item label="已有科目" v-if="subjectList && subjectList.length > 0">
									<el-checkbox-group v-model="ruleForm.subject">
										<el-checkbox v-for="item in subjectList" :label="item">
											{{item.length > 10 ? item.substr(0,10) : item}}
											<i v-if="item.length > 10" style="color: red;" class="el-icon-warning" title="支持10个汉字"></i>
										</el-checkbox>
									</el-checkbox-group>
								</el-form-item>
								<el-form-item label="待确认科目" v-if="subjectList2 && subjectList2.length > 0">
									<el-checkbox-group v-model="ruleForm.subject1">
										<el-checkbox v-for="item in subjectList2" :label="item">
											{{item.length > 10 ? item.substr(0,10) : item}}
											<i v-if="item.length > 10" class="el-icon-warning" style="color: red;" title="支持10个汉字"></i>
										</el-checkbox>
									</el-checkbox-group>
								</el-form-item>
								<div class="course-title" style="margin-bottom: 10px;">
									<div>2. 检测到有以下节次，请您确认哪些是节次：</div>
									<div class="font-grey">（使用样式如“第一节”，识别率会更高哦~）</div>
								</div>
								<el-checkbox-group v-model="ruleForm.lession" style="margin-left: 20px;">
									<el-checkbox v-for="item in lessionList" :label="item">
										{{item.length > 10 ? item.substr(0,10) : item}}
										<i v-if="item.length > 10" class="el-icon-warning" style="color: red;" title="支持10个汉字"></i>
									</el-checkbox>
								</el-checkbox-group>
							</el-form>
							<div class="footer">
								<el-button @click="$router.push({name:'edu-class-schedule',params:{yearTermId:oldYearTermId,gradeId: oldGradeId,classId: oldClassId,termId:oldTermId,schoolYearId:oldSchoolYearId,className: oldClassName}})">取消录入</el-button>
								<el-button type="info" @click="againImport">重新录入</el-button>
								<el-button type="primary" @click="goNext" :disabled="classList.length ==0 || lessionList.length ==0 || (subjectList.length ==0 && subjectList2.length ==0) ||(ruleForm.subject.length == 0 && ruleForm.subject1.length == 0) || ruleForm.lession.length == 0 ? true : false">确定</el-button>
							</div>
						</div>
					</div>
				</div>
			</el-card>

		</div>
		<div v-show="active==1">
			<el-card>
				<div class="second-step" :style="'height: '+appHeight+'px;overflow-y:auto;'">
					<div class="grey">以下是您录入课表的班级视图，您可点击单元格修改课表内容。</div>
					<el-row>
						<el-col :span="20">
							<div style="margin-top: 10px;text-align: center;" class="margin-bottom-20">
								<template v-if="courseTotalList[index]">
									<el-input class="schedule-input" v-model="courseTotalList[index].courseName" placeholder="请输入课表名称"></el-input>
								</template>
							</div>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="20" style="min-height: 400px;">
							<table id="table" width="100%" cellspacing="0">
								<tbody>
									<tr>
										<th class="th-add" width="10%"></th>
										<th class="th-add" width="12.8%" v-for="item in weekDay">
											{{item.weekName}}
										</th>
									</tr>
									<template v-if="courseTotalList[index]">
										<tr v-for="(item,courseIndex) in courseTotalList[index].list">
											<td width="10%">{{item.lessionCodeName}}</td>
											<td width="12.8%" :class="!!item.courseList && item.courseList[weekIndex].isEdit === 1 ? 'isEdit' : ''" @click="openModal(courseIndex,weekIndex)" v-for="(item1,weekIndex) in weekDay">
												<template v-if="!!item.courseList">
													<div>{{item.courseList[weekIndex].subjectName}}</div>
												</template>
											</td>
										</tr>
									</template>
								</tbody>
							</table>
						</el-col>
						<el-col :span="4">
							<div class="tag-box">
								<div class="tab-item" :class="cindex === index ? 'current' : ''" @click="tabClass(cindex)" v-for="(item,cindex) in courseTotalList">{{item.className+'('+item.lessonNum+'节)'}}</div>
							</div>

						</el-col>
					</el-row>
					<el-row>
						<div class="second-footer">
							<el-button type="primary" @click="goPrev">上一步 </el-button>
							<el-button type="primary" @click="courseSubmit">发布课表</el-button>
						</div>
					</el-row>
				</div>
				<el-dialog title="请选择科目" :visible.sync="subShow" width="740px">
					<el-radio-group style="width:100%" v-model="checkSub" size="small">
						<el-col :span="6" style="margin-top: 10px;">
							<el-radio label="0">无课</el-radio>
						</el-col>
						<el-col :span="6" v-for="item in subList" style="margin-top: 10px;">
							<el-radio :label="item">{{item}}</el-radio>
						</el-col>
					</el-radio-group>
					<span slot="footer" class="dialog-footer">
				    <el-button @click="subShow = false">取 消</el-button>
				    <el-button type="primary" @click="changeSubject">确 定</el-button>
				  </span>
				</el-dialog>
			</el-card>
		</div>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, getExportFile, deleteData } from '@/utils/common'
	import Uploadfile from '../common/upload-file'

	export default {
		name: 'class-schedule',
		data() {
			return {
				isCourseLoading: false,
				active: 0,
				schoolId: this.GLOBAL.getOrgId(),
				isShowImport: false,
				yearList: [],
				yearTermId: '',
				percentage: 0,
				batchLoading: false,
				batchClick: false,
				appendixPath: '',
				fileExtWechat: ['.XLS', '.XLSX'],
				ruleForm: {
					subject: [],
					subject1: [],
					hasClass: [],
					lession: []
				},
				gradeList: [],
				gradeId: '',
				visible1: false,
				visible2: false,
				classList: [],
				lessionList: [],
				subjectList: [],
				subjectList2: [],
				isNext: false,
				subList: [],
				gradeName: '',
				yearTermName: '',
				appHeight: 800,
				courseName: '',
				weekDay: [{
						weekDay: 1,
						weekName: "星期一"
					},
					{
						weekDay: 2,
						weekName: "星期二"
					},
					{
						weekDay: 3,
						weekName: "星期三"
					},
					{
						weekDay: 4,
						weekName: "星期四"
					},
					{
						weekDay: 5,
						weekName: "星期五"
					},
					{
						weekDay: 6,
						weekName: "星期六"
					},
					{
						weekDay: 7,
						weekName: "星期日"
					},
				],
				subShow: false,
				checkSub: '',
				courseIndex: '',
				weekIndex: '',
				index: 0,
				courseTotalList: [],
				gradeInfo: '',
				noGradeInfo: '',
				noClassInfo: '',
				repeatClass: '',
				downloadType:'',
				oldYearTermId:'',
				oldGradeId:'',
				oldClassId:'',
				oldTermId:'',
				oldSchoolYearId:'',
				oldClassName:'',
				termId:'',
				schoolYearId:''
			}
		},
		mounted() {
			window.addEventListener('resize', () => {
				this.appHeight = window.innerHeight - 300
			})
			this.appHeight = window.innerHeight - 300
			this.schoolTerm()
		},
		components: {
			Uploadfile
		},
		methods: {
			schoolTerm() {
				let that = this;
				getCommHttpData({
					url: 'common/queryYearTermAll',
					method: 'get',
					contentType: 2,
					//					data: {},
				}, function(data) {

					let yearlist = data.list,
						index = null
					yearlist.map((item, yindex) => {
						if(item.yearTermId == data.yearTermId) {
							index = yindex
						}
						item.isDisabled = true
						return item
					})
					yearlist[index].isDisabled = false;
					yearlist[(index + 1)].isDisabled = false;
					that.yearList = yearlist;
					let query = that.$route.query
					that.yearTermId = parseInt(query.yearTermId);
					that.oldYearTermId = parseInt(query.yearTermId);
					that.oldGradeId = query.gradeId;
					that.oldClassId = query.classId;
					that.oldTermId = query.termId;
					that.oldSchoolYearId = query.schoolYearId;
					that.oldClassName = query.clN;
					that.termId = query.termId;
					that.schoolYearId = query.schoolYearId;
					that.yearTermName = query.yearTermName
					that.getGradeData();
				})
			},
			//查询年级
			getGradeData() {
				var that = this
				getCommHttpData({
					url: 'common/queryGradeByParamsAuthority',
					method: 'get',
					contentType: 1,
					data: {
						schoolId: this.schoolId,
						schoolYearId: this.schoolYearId,
						termId: this.termId
					}
				}, function(data) {
					if(data.code == 0) {
						that.gradeList = data.list
						that.gradeId = that.$route.query.gradeId
						that.gradeName = that.$route.query.gradeName
						if(that.yearTermId != that.oldYearTermId){
							that.gradeId = data.list.length >0 ? data.list[0].gradeId: ''
							that.gradeName = data.list.length >0 ? data.list[0].gradeName : ''
						}
						that.getGradeImport();
					} else {
						that.gradeList = []
					}
				})
			},
			//获取录入年级信息
			getGradeImport() {
				var that = this
				getCommHttpData({
					url: 'eduManageCourse/classEnteredCourseList',
					method: 'get',
					contentType: 1,
					data: {
						schoolId: this.schoolId,
						yearTermId: this.yearTermId,
						gradeId: this.gradeId
					}
				}, function(data) {
					if(data.code == 0) {
						let gradeInfo = '',
							noGradeInfo = '';
						data.list.forEach(item => {
							if(item.type == 1) {
								gradeInfo += item.className + ','
							} else if(item.type == 0) {
								noGradeInfo += item.className + ','
							}
						})
						if(!gradeInfo) {
							that.gradeInfo = ''
							that.noGradeInfo = ''
						} else if(gradeInfo && noGradeInfo) {
							that.gradeInfo = data.list[0].gradeName + gradeInfo + '课表已录入，重复录入将更新课表'
							that.noGradeInfo = data.list[0].gradeName + noGradeInfo + '未录入，您可录入并发布课表。'
						} else if(!noGradeInfo) {
							that.gradeInfo = data.list[0].gradeName + '课表已录入，重复录入将更新课表'
							that.noGradeInfo = ''
						}
					}
				})
			},
			//模板下载
			downloadTemplate(){
				if(!this.gradeId){
					this.$message({
						message: '请选择年级',
						type: 'error'
					})
					return false
				}
				let getstr = '?excelType=xls&schoolId=' + this.schoolId + '&yearTermId=' + this.yearTermId + '&gradeId=' + this.gradeId +'&gradeName=' + this.gradeName;
				window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia+'eduManageCourse/courseModel'+getstr));
			},
			changeSchoolTerm(val) {
				let current = this.yearList.find(item => {
					return item.yearTermId == val
				})
				this.yearTermName = current.schoolYearName + current.termName;
				this.termId = current.termId;
				this.schoolYearId = current.schoolYearId;
				this.batchClick = false
				this.getGradeData()
			},
			changeGrade(val) {
				let current = this.gradeList.find(item => {
					return item.gradeId == val
				})
				this.gradeName = current.gradeName;
				this.batchClick = false
				this.getGradeImport();
			},
			getPicSrc(picSrc) {
				this.appendixPath = picSrc
				this.percentage = 0
				this.batchLoading = false
				this.batchClick = false
			},
			goNext() {
				let that = this
				let params = {
					subjectList: this.ruleForm.subject.concat(this.ruleForm.subject1),
					lessionList: this.ruleForm.lession,
					classList: this.ruleForm.hasClass,
					yearTermId: this.yearTermId,
					schoolId: this.schoolId,
					gradeId: this.gradeId,
					gradeName: this.gradeName,
					yearTermName: this.yearTermName
				}
				getCommHttpData({
					url: 'eduManageCourse/courseConfirmation',
					method: 'post',
					contentType: 2,
					data: {
						...params
					}
				}, function(data) {
					if(data && data.code == 0) {
						that.active = 1
						that.courseTotalList = data.list
						that.getSubjectList()
					}
				})

			},
			//查询科目
			getSubjectList() {
				var that = this
				getCommHttpData({
					url: 'eduManageCourse/courseSubject',
					method: 'post',
					contentType: 2,
					data: {
						schoolId: this.schoolId,
						yearTermId: this.yearTermId,
						subjectList:this.ruleForm.subject.concat(this.ruleForm.subject1)
					}
				}, function(data) {
					if(data.code === 0) {
						that.subList = data.list
					}
				})
			},
			againImport() {
				this.isShowImport = false
				this.visible2 = false
				this.percentage = 0
				this.$refs['uploadpic'].picList = []
				this.appendixPath = ''
				this.batchClick = false
			},
			// 文件导入
			dataFormSubmit() {
				var that = this
				if(this.appendixPath == '') {
					this.$message({
						message: '请先上传文件',
						type: 'error'
					})
					return;
				}

				let begin;
				that.batchClick = true
				that.percentage = 1
				begin = setInterval(function() {
					if(that.percentage < 99 ) {
						that.percentage++
					}
					if(that.percentage == 100 && that.batchLoading) {
						that.isShowImport = true
						that.visible1 = false
						clearInterval(begin);
					} else if(that.percentage == 100 && !that.batchLoading) {
						clearInterval(begin);
					}
				}, 100)

				getCommHttpData({
					url: 'eduManageCourse/batchUpload',
					method: 'post',
					contentType: 2,
					//					operateType: 2,
					that: this,
					data: {
						schoolId: this.schoolId,
						filePath: this.appendixPath,
						yearTermId: this.yearTermId,
						gradeId: this.gradeId
					}
				}, function(data) {
					if(data.code === 0) {
						that.batchClick = false
						if(data.msg != 'success'){
							
							that.$message.error(data.msg);
							clearInterval(begin);
						}else{
							that.classList = data.classList
							that.percentage = 100
							that.noClassInfo = '';
							that.repeatClass = '';
							if(data.classList2 && data.classList2.length > 0) {
								that.batchLoading = false
								//未确认班级
//								let noClass = data.classList2.map(item => {
//									item = item + '班'
//									return item
//								})
								that.noClassInfo = '暂无' + that.gradeName + data.classList2.join(',') + ',请到班级管理中添加。'
						        that.$alert(that.noClassInfo, '提示', {
						          confirmButtonText: '确定',
						          callback: action => {
						            console.log(action,'action')
						          }
						        });
//								that.$message.error(that.repeatClass);
							} else if(data.classRepeatList && data.classRepeatList.length > 0) {
								that.batchLoading = false
								that.repeatClass = that.gradeName + data.classRepeatList.join(',') + '在表格中重复出现，请修改后重新导入。'
								that.$alert(that.repeatClass, '提示', {
						          confirmButtonText: '确定',
						          callback: action => {
						            console.log(action,'action')
						          }
						        });
//								that.$message.error(that.repeatClass);
							} else {
								that.batchLoading = true
							}
							that.lessionList = data.lessionList
							that.subjectList = data.subjectList
							that.subjectList2 = data.subjectList2
							that.ruleForm = {
								subject: data.subjectList,
								subject1: [],
								hasClass: data.classList,
								lession: data.lessionList
							}	
						}
					}

				})
			},
			courseSubmit() {
				let that = this
				let tmpNameInfo='',temCourseLength='';
				that.courseTotalList.forEach(item=>{
					if(!item.courseName){
						tmpNameInfo += item.className+',' 
					}else if(item.courseName && item.courseName.length > 25){
						temCourseLength += item.className+','
					}
				})
				if(tmpNameInfo){
					 this.$message.error(tmpNameInfo+'课表名称不能为空');
					return
				}
				if(temCourseLength){
					 this.$message.error(temCourseLength+'课表名称长度超过限制');
					return
				}
				that.$confirm('课表发布后，将分发给各个老师和学生，您确认发布吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					that.isCourseLoading = true
					getCommHttpData({
						url: 'eduManageCourse/saveCourse',
						method: 'post',
						contentType: 2,
						data: {
							schoolId: that.schoolId,
							yearTermId: that.yearTermId,
							gradeId: that.gradeId,
							list: that.courseTotalList
						}
					}, function(data) {
						that.isCourseLoading = false
						that.$router.push({
							name: 'edu-class-schedule'
						})
					})
				}).catch(() => {

				});
			},
			openModal(index, index1) {
				this.courseIndex = index
				this.weekIndex = index1
				if(this.courseTotalList[this.index].list[index].courseList && this.courseTotalList[this.index].list[index].courseList[index1]) {
					let subject = this.courseTotalList[this.index].list[index].courseList[index1].subjectName
					if(subject) {
						this.checkSub = subject
					} else {
						this.checkSub = ''
					}
				} else {}
				this.subShow = true;

			},
			tabClass(val) {
				if(val !== this.index) {
					this.index = val;
				}
			},
			goPrev() {
				let that = this
				this.$confirm('选择“上一步”，会清空修改内容，您确定返回上一步吗？', '确认', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					that.active = 0

				}).catch(() => {

				});
			},
			changeSubject() {
				if(this.checkSub != 0) {
					var changeCourse = this.subList.find(item => {
						return item == this.checkSub
					})
				}
				let lessonNum = this.courseTotalList[this.index].lessonNum
				if(this.courseTotalList[this.index].list[this.courseIndex].courseList && !!this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].subjectName) {
					let oldName = this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['oldName'];
					if(this.checkSub == 0) {
						this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].subjectName = ''
						if(oldName == '无课') {
							this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['isEdit'] = ''
							this.courseTotalList[this.index].lessonNum = (parseInt(lessonNum) - 1)
						} else {
							this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['isEdit'] = 1
							this.courseTotalList[this.index].lessonNum = (parseInt(lessonNum) - 1)
						}
					} else {
						this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['oldName'] = oldName ? oldName : this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].subjectName;
						if(this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['oldName'] == changeCourse) {
							this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['isEdit'] = ''
						} else {
							this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['isEdit'] = 1
						}

						this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].subjectName = changeCourse
					}
				} else {
					if(this.checkSub == 0) {
						this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['isEdit'] = ''
					}else{
						this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['isEdit'] = 1
						this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['oldName'] = '无课'
						this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['subjectName'] = changeCourse
						this.courseTotalList[this.index].lessonNum = (parseInt(lessonNum) + 1)	
					}
				}
				this.subShow = false
				this.$forceUpdate();
			}

		}
	}
</script>

<style>
	.step-course {
		width: 100%;
		text-align: center;
		/*display: flex;*/
	}
	
	.step-course .hr {
		width: 120px;
		height: 2px;
		background-color: #cccccc;
		display: inline-block;
	}
	
	.step-item {
		display: inline-block;
		margin-left: 30px;
		margin-right: 30px;
		color: #b3b3b3;
		vertical-align: sub;
	}
	
	.step-item span {
		display: inline-block;
		width: 33px;
		height: 33px;
		border-radius: 50%;
		text-align: center;
		line-height: 33px;
		background-color: #cccccc;
		font-size: 16px;
		color: #FFFFFF;
		margin-right: 20px;
	}
	
	.current {
		color: #3C85EE !important;
	}
	
	.currenthr {
		background-color: #3C85EE !important;
	}
	
	.current span {
		background-color: #3C85EE !important;
	}
	
	.import-btn1 {
		position: absolute;
		left: 250px;
		top: 0;
	}
	
	.popover-container {
		padding: 15px;
		line-height: 28px;
		position: relative;
	}
	
	.popver-close {
		position: absolute;
		right: 5px;
		top: 5px;
	}
	
	.popver-close i {
		font-size: 20px;
	}
	
	.popover-container div:first-child {
		font-size: 16px;
		padding-bottom: 5px;
		margin-bottom: 10px;
		border-bottom: 1px solid #CCCCCC;
	}
	
	.form-data {
		margin-top: 30px;
		/*text-align: center;*/
		width: 650px !important;
		margin-left: 36%;
	}
	
	@media only screen and (max-width: 1500px) {
		.form-data {
			margin-left: 30%;
		}
	}
	
	.el-upload__tip {
		width: 200px;
	}
	
	.course-title {
		line-height: 40px;
		border-top: 1px solid #f1f4f5;
		display: flex;
		justify-content: space-between;
	}
	
	.first-step .course-item .el-form-item {
		margin-bottom: 0;
	}
	
	.first-step .course-item .el-form-item__label {
		color: #3C85EE !important;
		padding-left: 20px;
	}
	
	.font-grey {
		color: #cccccc;
	}
	
	.first-step .footer {
		position: absolute;
		right: 0;
		bottom: 50px;
		/*margin-top: 20px;*/
	}
	
	.repeat-checkbox .is-checked .el-checkbox__inner {
		background-color: red !important;
		border-color: red !important;
	}
	
	.repeat-checkbox .el-checkbox__label {
		color: red !important;
	}
	/*second*/
	
	.grey {
		color: #808080;
	}
	.schedule-input{
		width: 500px;
	}
	
	#table {
		text-align: center;
		background: #FFFFFF;
	}
	
	.th-add {
		background: #f5f5f5;
		color: #808080;
		border: 1px solid #e5e5e5;
		height: 45px;
	}
	
	#table td {
		border-right: 1px solid #e5e5e5;
		border-bottom: 1px solid #e5e5e5;
		height: 44px;
	}
	
	#table tr td:first-child {
		border-left: 1px solid #e5e5e5;
		background: #f5f5f5;
	}
	
	.tag-box {
		position: absolute;
		right: 0;
		height: 350px;
		overflow: auto
	}
	.tag-box::-webkit-scrollbar{/*滚动条整体部分，其中的属性有width,height,background,border等（就和一个块级元素一样）（位置1）*/  
            width:10px;  
            height:10px;  
    }
    .tag-box::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        background: #c1c1c1;
    }
	.tag-box::-webkit-scrollbar-track {/*滚动条里面轨道*/
	        background: #f1f1f1;
	    }
	
	.tab-item {
		width: 134px;
		height: 44px;
		background-color: #ffffff;
		border-radius: 24px;
		border: solid 1px #e6e6e6;
		color: #808080;
		margin-bottom: 20px;
		line-height: 44px;
		text-align: center;
		cursor: pointer;
	}
	
	.tab-item.current {
		background-color: #3C85EE;
		color: #FFFFFF !important;
		border: none;
	}
	
	.second-step .second-footer {
		margin-top: 50px;
		display: flex;
		justify-content: space-between;
		width: 100%;
	}
	
	.isEdit {
		background-color: #e6f6f4;
	}
</style>