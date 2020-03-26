<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="edu-class">
		<el-card>
			<div class="filter-container" v-if="isShowSlect">
				<el-select v-model="yearTermId" @change="changeSchoolTerm">
					<el-option v-for="item in yearList" :key="item.yearTermId" :label="item.yearName" :value="item.yearTermId">
					</el-option>
				</el-select>
				<el-select v-model="subjectId" @change="changeSubject" clearable placeholder="请选择科目" style="margin-right: 5px;">
					<el-option v-for="item in subjectList " :key="item.subjectId" :label="item.subjectName" :value="item.subjectId">
					</el-option>
				</el-select>
				<el-select v-model="teacherId" @change="changeTeacher" placeholder="请选择老师" style="margin-right: 5px;">
					<el-option v-for="item in teacherList " :key="item.teacherId" :label="item.teacherName" :value="item.teacherId">
					</el-option>
				</el-select>
				<div class="margin-bottom-20" style="float: right;" v-show="list.length > 0">
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
			</div>
			<section ref="print" id="printContent" v-loading="listLoading">
				<template v-if="list.length > 0">
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
						<template v-if="operateYearTermIds.indexOf(yearTermId) > -1">
							<template v-if="goType == 1">
								<div>暂未录入此教师任课信息，请点击添加。
									<el-button type="primary" 
										@click="$router.push({name:'edu-teacher'})">添加教师任课信息</el-button>
								</div>
							</template>
							<template v-else>
								<div>暂未录入课表，请点击录入所带班级课表。<el-button type="primary" 
										@click="$router.push({path:'/edu-class-schedule'})">班级课表</el-button></div>
							</template>
						</template>
						<template v-else>
							<div>暂无课表信息</div>
						</template>
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
	</div>
</template>

<script>
	import { getCommHttpData, getExportFile,compareDate } from '@/utils/common'
	import QRCode from 'qrcodejs2'
	export default {
		name: 'class-schedule',
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				weekDay: [],
				htmlTitle: '教师课表',
				list:[],
				yearList: [],
				yearTermId: '',
				subjectList: [],
				subjectId:'',
				teacherList: [],
				teacherId:'',
				dialogFormVisible: false,
				appHeight: 800,
				listLoading:false,
				teacherName:'',
				totalCourse:'',
				isShowSlect : true,
				goType:'',
				courseName:'',
				operateYearTermIds:[]
			}
		},
		mounted() {
			window.addEventListener('resize', () => {
				this.appHeight = window.innerHeight - 330
			})
			this.appHeight = window.innerHeight - 330
			this.schoolTerm();
		},
		methods: {
			schoolTerm() {
				let that = this;
				getCommHttpData({
					url: 'common/queryYearTermBefore',
					method: 'get',
					contentType: 1,
					//					data: {},
				}, function(data) {
					let yearlist = data.list,
						index = null
					yearlist && yearlist.forEach((item, yindex) => {
						if(item.yearTermId == data.yearTermId) {
							index = yindex
						}
					})
					that.operateYearTermIds[0] = data.yearTermId;
					that.operateYearTermIds[1] = yearlist[(index + 1)].yearTermId;
					that.yearList = yearlist;
					that.yearTermId = data.yearTermId;
					that.getSubjectList();
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
						page:1,
						limit:9999,
						status:0
					}
				}, function(data) {
					if(data.code === 0) {
						that.subjectList = data.page.list
						that.subjectId =  ''
						that.getTeacherList()
					} 
				})
			},
			//查询laoshi
			getTeacherList() {
				var that = this
				getCommHttpData({
					url: 'eduManageTeachingSubject/teacherListBySubject',
					method: 'get',
					contentType: 1,
					data: {
						subjectId: this.subjectId,
						yearTermId: this.yearTermId,
						schoolId: this.schoolId
					}
				}, function(data) {
					if(data.code == 0) {
						that.teacherList = data.list
						if(data.list && data.list.length > 0){
							that.teacherId =  data.list[0].teacherId
							that.teacherName = data.list[0].teacherName	
						}else{
							that.teacherId =  ''
							that.teacherName = ''	
						}
					} 
					if(that.teacherId){
						that.getCourseList()	
					}
				})
			},
			changeSchoolTerm(val){
				this.getSubjectList()
			},
			changeSubject(val){
				this.getTeacherList()
			},
			changeTeacher(val){
				let current = this.teacherList.find(item=>{
					return item.teacherId == val
				})
				this.teacherName = current.teacherName;
				this.getCourseList()
			},
			enter(e) {
				let that = this
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
					url: 'eduManageCourse/teacherCourseList',
					method: 'get',
					contentType: 1,
					data:{
						schoolId: this.schoolId,
						yearTermId:this.yearTermId,
						subjectId:this.subjectId,
						teacherId:this.teacherId
					}
				}, function(data) {
					that.listLoading = false
					if(data && data.code == 0) {
						that.weekDay = data.weekType == 0 ? ['星期一','星期二','星期三','星期四','星期五'] : ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
						that.goType = data.type ;
						that.courseName = data.courseName;
						that.list = data.list
						that.totalCourse = data.lessonNum
					}
				})
			},
			//分享
			shareHandle(command) {
				let param = this.schoolId+'-'+this.yearTermId+'-'+this.subjectId+'-'+this.teacherId;
				if(command == 1) {
					//QQ
					let url = window.SITE_CONFIG.webIp + 'course-t-detail?schoolId='+param
					let str = `connect.qq.com/widget/shareqq/index.html?url=${url}&title=${this.courseName}&source=点击查看更多详情`
					window.open('http://' + str);
				} else {
					//二维码

					this.dialogFormVisible = true
					this.$nextTick(function() {
						document.getElementById("qrcode").innerHTML = "";
						let qrcode = new QRCode(this.$refs.qrCodeDiv, {
							text: window.SITE_CONFIG.webIp + 'course-t-detail?schoolId='+param, // 二维码内容  
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
				window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia + 'eduManageCourse/download?schoolId='+this.schoolId+'&yearTermId='+this.yearTermId+'&subjectId='+this.subjectId+'&teacherId='+this.teacherId));
			}
		}
	}
</script>

<!--<style type="text/css" media="print">
	
</style>-->
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
</style>