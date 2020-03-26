<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="edu-class">
		<el-card>
			<el-row class="filter-container">
				<div style="float: right;" v-if="type == 0">
					<el-dropdown @command="shareHandle" style="margin-right: 10px;">
						<el-button type="primary">
							分享<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="1">QQ</el-dropdown-item>
							<el-dropdown-item command="2">二维码</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<el-button type="primary" @click="downLoadFile">{{$t('table.downLoad')}}</el-button>
					<el-button type="primary" @click="printHandle">打印</el-button>
				</div>
			</el-row>
			<section ref="print" id="printContent" v-loading="listLoading">
				<template v-if="type == 0 && list.length > 0">
					<div class="schedule-title">{{courseName}}</div>
					<div class="font-num margin-bottom-20">周课时量：<span class="font-color">{{totalCourse}}</span> 课时</div>
					<table id="class-table" width="100%" cellspacing="0">
						<tbody>
							<tr>
								<th width="10%"></th>
								<th v-for="item in weekDay" :width="(90/weekDay.length)+'%'">
									{{item}}
								</th>
							</tr>
							<template v-for="item in list">
								<tr>
									<td width="10%">
										<div>{{item.lessionCodeName}}</div>
										<div v-if="item.startTime">{{item.startTime}}<template v-if="item.endTime&&item.endTime!==item.startTime">-{{item.endTime}}</template></div>
									</td>
									<template v-for="(cItem,index) in weekDay">
										<td style="position: relative;" :width="(90/weekDay.length)+'%'" @mouseenter="enter(item.courseList[index])" @mouseleave="leave" :class="item.courseList[index].isSame == 1 ? 'isSame' : ''">
											<template v-if="item.courseList[index].list.length > 0">
												<template v-if="userType == 2">
													<div style="font-size: 16px;margin-bottom: 5px;">{{item.courseList[index].list[0].gradeName + item.courseList[index].list[0].className}}</div>
													<div style="font-size: 12px;">{{item.courseList[index].list[0].subjectName ? '( '+item.courseList[index].list[0].subjectName+' )' : ''}}</div>
													<template v-if="item.courseList[index].list.length > 1">
														<el-popover placement="bottom-start" width="200" trigger="click">
															<el-table :show-header=false :data="item.courseList[index].list">
																<el-table-column property="date" label="班级">
																	<template slot-scope="scope">
																		<span>{{scope.row.gradeName + scope.row.className}}</span>
																	</template>
																</el-table-column>
																<el-table-column property="subjectName" label="科目"></el-table-column>
															</el-table>
															<el-button type="text" slot="reference" style="font-size:10px;position: absolute;bottom: 0;right: 0;padding:5px">更多</el-button>
														</el-popover>
													</template>
												</template>
												<template v-else>
													<div style="font-size: 16px;margin-bottom: 5px;">{{item.courseList[index].list[0].subjectName}}</div>
													<div style="font-size: 12px;">{{item.courseList[index].list[0].teacherName ? '('+item.courseList[index].list[0].teacherName+')' : ''}}</div>
												</template>
											</template>
			
										</td>
									</template>
			
								</tr>
							</template>
						</tbody>
					</table>
				</template>
				<template v-else>
					<div class="no-course-list" :style="'height: '+appHeight+'px'">
						<div><img src="~@/assets/img/nodata2.png" /></div>
						
							<div v-if="type == 1">暂无您的任课班级，请点击
								<el-button type="primary" @click="dialogTeachVisible = true">添加 </el-button>
							</div>
							<div v-else>暂无课表信息</div>
					</div>
				</template>
			</section>
		</el-card>
		<el-dialog title="" :visible.sync="dialogFormVisible" width="290px">
			<div class="qrcode-box">
				<div class="qrcode-title margin-bottom-20">{{courseName}}</div>
				<div class="margin-bottom-20" id="qrcode" ref="qrCodeDiv"></div>
				<div class="qrcode-remark">请使用手机扫描二维码访问</div>
			</div>
		</el-dialog>
		<el-dialog title="添加" :visible.sync="dialogTeachVisible" width="740px">
			<div v-show="firstModel">
				<div style="margin-top: -20px;" class="margin-bottom-20">请选择您的任课科目：</div>
				<el-checkbox-group style="overflow: hidden;" v-model="checkSub">
					<el-col :span="6" v-for="item in subList" style="margin-top: 10px;">
						<el-checkbox :label="item.subjectId+'-'+item.subjectName">{{item.subjectName}}</el-checkbox>
					</el-col>
				</el-checkbox-group>
				<div slot="footer" class="dialog-footer" style="margin-top: 40px;text-align: right;">
					<el-button type="primary" size="mini" :disabled="checkSub.length ==0"  @click="goNext">下一步</el-button>
				</div>
			</div>
			<div v-show="!firstModel">
				<div style="margin-top: -20px;" class="margin-bottom-20">请选择您的任课班级：</div>
				 <el-table :data="checkSubList" border fit highlight-current-row>
				      <el-table-column align="center" label='科目' width="95" prop="subjectName">
				      </el-table-column>
				      <el-table-column  align="center" label="任课班级">
				        <template slot-scope="scope">
							<div class="nalist" style="display: inline-block;">
								<el-tag style="margin-top: 6px;margin-left: 6px;" v-for="(tag,index) in scope.row.gradeClassList" :key="tag.classId" closable :type="tag.classId" @close="deleteClass(scope.$index,index)">
									<span>{{tag.gradeName+tag.className}}</span>
								</el-tag>
								<i class="el-icon-circle-plus showAdd" style="color:#3C85EE;font-size: 20px;cursor:pointer;"  @click="selectClass(scope.$index)"></i>
							</div>
						</template>
				      </el-table-column>
				   </el-table>
				<div slot="footer" class="dialog-footer margin-bottom-10" style="margin-top: 40px;display: flex;justify-content: space-between;">
					<el-button size="mini" type="primary" @click="firstModel=true;checkSubList=[]">上一步</el-button>
					<el-button size="mini" type="primary" @click="submitClass">保存</el-button>
				</div>
				<span style="font-size: 12px;">注：保存后不可编辑，请谨慎操作。</span>
			</div>
		</el-dialog>
		<el-dialog title="请选择班级" :visible.sync="dialogClassVisible" width="30%">
			<div id="scrool-class" style="margin-top:-20px;height: 400px;overflow-y: auto;">
				<template v-for="item in gradeClassList">
					<div class="class-title">{{item.gradeName}}</div>
					<el-checkbox-group style="overflow: hidden;" v-model="checkClass">
						<el-col :span="6" v-for="item1 in item.classList" style="margin-top: 10px;">
							<el-checkbox :label="item.gradeId+'-'+item.gradeName+'-'+item1.classId+'-'+item1.className">{{item1.className}}</el-checkbox>
						</el-col>
					</el-checkbox-group>
				</template>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button size="mini" @click="dialogClassVisible = false">取 消</el-button>
		    <el-button size="mini" type="primary" :disabled="checkClass.length ==0" @click="setGradeClass">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import { getCommHttpData, getExportFile, compareDate } from '@/utils/common'
	import QRCode from 'qrcodejs2'
	export default {
		name: 'class-schedule',
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				userType:this.GLOBAL.getUserType(),
				weekDay: [],
				htmlTitle: '教师课表',
				list: [],
				dialogFormVisible: false,
				appHeight: 800,
				listLoading: false,
				yearTermName: '',
				totalCourse: '',
				yearTermId: '',
				courseName: '',
				dialogTeachVisible: false,
				type: '',
				subList: [],
				checkSub: [],
				firstModel: true,
				checkSubList:[],
				dialogClassVisible: false,
				schoolYearId:'',
				termId:'',
				gradeClassList:[],
				checkClass:[],
				subjectIndex:''
			}
		},
		mounted() {
			window.addEventListener('resize', () => {
				this.appHeight = window.innerHeight - 330
			})
			this.appHeight = window.innerHeight - 330
			this.schoolTerm();
			if(this.userType == 2){
				this.getSubjectList()	
			}
		},
		methods: {
			schoolTerm() {
				let that = this;
				getCommHttpData({
					url: 'common/queryYearTermAll',
					method: 'get',
					contentType: 1,
					//					data: {},
				}, function(data) {
					that.yearTermId = data.yearTermId;
					that.yearTermName = data.schoolYearName + data.termName;
					that.schoolYearId = data.schoolYearId
					that.termId= data.termId
					if(that.userType == 2){
						that.getGradeClassList()	
					}
					that.getCourseList();
				})
			},
			//查询科目
			getSubjectList() {
				var that = this
				getCommHttpData({
					url: 'eduManageSubject/list',
					method: 'post',
					contentType: 2,
					data: {
						schoolId: this.schoolId,
						page: 1,
						limit: 9999,
						status: 0
					}
				}, function(data) {
					if(data.code === 0) {
						that.subList = data.page.list
					}
				})
			},
			//查询班级年级
			getGradeClassList(){
				var that = this
				getCommHttpData({
					url: 'common/queryGradeClassList',
					method: 'get',
					contentType: 1,
					data: {
						schoolId: this.schoolId,
						schoolYearId: this.schoolYearId,
						termId: this.termId
					}
				}, function(data) {
					if(data.code === 0) {
						that.gradeClassList = data.list
					}
				})
			},
			deleteClass(index,index1){
				this.checkSubList[index].gradeClassList.splice(index1,1)
			},
			goNext() {
				let teacherId = this.GLOBAL.getUserId()
				this.checkSub.forEach(item=>{
					let temp = item.split('-')
					this.checkSubList.push({
						subjectId: temp[0],
						subjectName:temp[1],
						gradeClassList:[]
					})
				})
				this.firstModel = false	
			},
			selectClass(index){
				this.subjectIndex = index
				this.checkClass= []
				if(this.checkSubList[index].gradeClassList.length > 0){
					this.checkSubList[index].gradeClassList.forEach(item=>{
						this.checkClass.push(item.gradeId+'-'+item.gradeName+'-'+item.classId+'-'+item.className)
					})	
				}
				this.dialogClassVisible = true
			},
			setGradeClass(){
				this.checkSubList[this.subjectIndex].classList = []
				this.checkClass.forEach(item=>{
					let temp = item.split('-')
					this.checkSubList[this.subjectIndex].gradeClassList.push({
						gradeId:temp[0],
						gradeName: temp[1],
						classId:temp[2],
						className: temp[3]
					})
				})
				this.dialogClassVisible = false
			},
			submitClass(){
				let that = this
				let subjectNoClass = []
				this.checkSubList.forEach(item=>{
					if(item.gradeClassList.length == 0){
						subjectNoClass.push(item.subjectName)
					}
				})
				if(subjectNoClass.length > 0){
					let tempInfo = subjectNoClass.length > 1 ? subjectNoClass.join(',') : subjectNoClass.join()
					that.$message({
			          message: tempInfo+'任课班级不能为空',
			          type: 'error',
			          onClose: () => {
			        	that.getCourseList()
			          }
			        });
				}else{
					getCommHttpData({
						url: 'eduManageTeachingSubject/saveBatchTeacher',
						method: 'post',
						contentType: 2,
						data: {
							schoolId: this.schoolId,
							yearTermId: this.yearTermId,
							list: this.checkSubList
						}
					}, function(data) {
						if(data.code === 0) {
							that.dialogTeachVisible = false
							that.$message({
					          message: '任课信息设置成功',
					          type: 'success',
					          onClose: () => {
					        	that.getCourseList()
					          }
					        });
						}
					})	
				}
				
			},
			enter(e) {
				let that = this
				if(that.userType == 2){
					that.list.map(item => {
						item.courseList && item.courseList.map(cItem => {
							if(e.list.length > 0 && cItem.list.length > 0 && e.list[0].classId == cItem.list[0].classId && e.list[0].gradeId == cItem.list[0].gradeId) {
								cItem.isSame = 1
							} else {
								cItem.isSame = 0
							}
							return cItem
						})
						return item
					})	
				}else{
					that.list.map(item => {
						item.courseList && item.courseList.map(cItem => {
							if(e.list.length > 0 && cItem.list.length > 0 && e.list[0].subjectId == cItem.list[0].subjectId) {
								cItem.isSame = 1
							} else {
								cItem.isSame = 0
							}
							return cItem
						})
						return item
					})
				}
				this.$forceUpdate();

			},
			leave(e) {
				this.list.forEach(item => {
					item.courseList && item.courseList.forEach(cItem => {
						cItem.isSame = 0
					})
				})
				this.$forceUpdate();
			},
			getCourseList() {
				let that = this
				that.listLoading = true
				getCommHttpData({
					url: 'eduManageCourse/userCourseList?schoolId=' + this.schoolId + '&yearTermId=' + this.yearTermId,
					method: 'get',
					contentType: 2
				}, function(data) {
					that.listLoading = false
					if(data && data.code == 0) {
						that.weekDay = data.weekType == 0 ? ['星期一', '星期二', '星期三', '星期四', '星期五'] : ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
						that.courseName = data.courseName
						that.list = data.list
						that.totalCourse = data.lessonNum
						that.type = data.type
					}
				})
			},
			//分享
			shareHandle(command) {
				let userId = this.GLOBAL.getUserId();
				let param = this.schoolId + '-' + this.yearTermId + '-' + userId + '-' + this.userType;
				if(command == 1) {
					//QQ
					let url = window.SITE_CONFIG.webIp + 'my-course-detail?schoolId=' + param
					let str = `connect.qq.com/widget/shareqq/index.html?url=${url}&title=${this.courseName}&source=点击查看更多详情`
					window.open('http://' + str);
				} else {
					//二维码

					this.dialogFormVisible = true
					this.$nextTick(function() {
						document.getElementById("qrcode").innerHTML = "";
						let qrcode = new QRCode(this.$refs.qrCodeDiv, {
							text: window.SITE_CONFIG.webIp + 'my-course-detail?schoolId=' + param, // 二维码内容  
							width: 150,
							height: 150, // 高度  [图片上传失败...(image-9ad77b-1525851843730)]
							// render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）  
							colorDark: "#333333", //二维码颜色
							colorLight: "#ffffff", //二维码背景色
							correctLevel: QRCode.CorrectLevel.H //容错率，L/M/H  
						})

					})
				}

			},
			printHandle() {
				this.$print(this.$refs.print)
			},
			downLoadFile(){
				let userId = this.GLOBAL.getUserId();
				window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia + 'eduManageCourse/download?schoolId=' + this.schoolId + '&yearTermId=' + this.yearTermId+'&userId='+userId+'&userType='+this.userType));
			}
		}
	}
</script>
<style>
	@media print {
		html,
		body {
			-webkit-print-color-adjust: exact;
			height: inherit;
		}
		@page {
			size: landscape;
		}
	}
	
	#class-table {
		text-align: center;
		background: #FFFFFF;
		border: 0.5px solid #EBEEF5;
	}
	
	#class-table th {
		background: #3C85EE;
		color: #FFFFFF;
		border: 0.5px solid #e6e6e6;
		height: 45px;
	}
	
	#class-table tr td {
		border: 0.5px solid #EBEEF5;
		/*border-bottom: 2px solid #EBEEF5;*/
		height: 59px;
	}
	
	.part-line {
		height: 18px !important;
		background: #3C85EE;
	}
	
	.font-color {
		color: #3C85EE;
		font-size: 20px;
	}
	
	.font-num {
		font-size: 16px;
		color: #808080;
		text-align: right;
	}
	
	#class-table td[rowstye="1"] {
		background: #f5f5f5 !important;
		/*border-left: 2px solid #EBEEF5;*/
		width: 3% !important;
	}
	
	.isSame {
		background-color: #DFE3EF;
		box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.14);
	}
	
	.no-course-list {
		margin-top: 20px;
		background: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	
	.no-course-list img {
		height: 230px;
	}
	.showAdd{
		display: none;
		
	}
	.el-icon-edit{
		display: none;
	}
	.is-center:hover .el-icon-edit{
		display: inline-block;
		cursor: pointer;
	}
	.is-center:hover .showAdd{
		display: inline-block;
		cursor: pointer;
	}
	.class-title{
		line-height: 40px;
		margin-top: 10px;
		font-size: 16px;
	}
	 #scrool-class::-webkit-scrollbar{/*滚动条整体部分，其中的属性有width,height,background,border等（就和一个块级元素一样）（位置1）*/  
            width:10px;  
            height:10px;  
    }
    #scrool-class::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        background: #ccc;
    }
	#scrool-class::-webkit-scrollbar-track {/*滚动条里面轨道*/
	        background: #F0F0F0;
	    }
</style>