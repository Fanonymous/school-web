<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="edu-class">
		<el-card>
			<div class="filter-container" v-if="isShowSlect">
				<el-select v-model="yearTermId" @change="changeSchoolTerm">
					<el-option v-for="item in yearList" :key="item.yearTermId" :label="item.yearName" :value="item.yearTermId">
					</el-option>
				</el-select>
				<el-select v-model="gradeId" @change="changeGrade" placeholder="请选择年级" style="margin-right: 5px;">
					<el-option v-for="item in gradeList " :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
					</el-option>
				</el-select>
				<el-select v-model="classId" @change="changeClass" placeholder="请选择班级" style="margin-right: 5px;">
					<el-option v-for="item in classList " :key="item.classId" :label="item.className" :value="item.classId">
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
					<el-button v-if="operateYearTermIds.indexOf(yearTermId) > -1" type="primary" @click="$router.push({path:'/edu-update-course',query: { schoolId : schoolId,yearTermId : yearTermId,gradeId :gradeId,classId:classId,name: (yearTermName + gradeName),clN:className}})">变更课表</el-button>
					<el-button type="primary" @click="downLoadFile">{{$t('table.downLoad')}}</el-button>
					<el-button type="primary" @click="printHandle">打印</el-button>
				</div>
			</div>
			<section ref="print" id="printContent" v-loading="listLoading">
				<template v-if="list.length > 0">
					<div class="schedule-title">{{courseName ? courseName : yearTermName + gradeName + className+'课程表'}}</div>
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
										<td :width="(90/weekDay.length)+'%'" @mouseenter="enter(item.courseList[index])" @mouseleave="leave" :class="item.courseList[index].isSame == 1 ? 'isSame' : ''">
											<template v-if="item.courseList[index].list.length > 0">
												<div style="font-size: 16px;margin-bottom: 5px;">{{item.courseList[index].list[0].subjectName}}</div>
												<div style="font-size: 12px;" v-if="item.courseList[index].list[0].teacherName">
													(<template v-for="(tItem,tIndex) in item.courseList[index].list">
														<span v-if="tIndex == 0">{{tItem.teacherName}}</span>
														<span v-else>{{','+tItem.teacherName}}</span>
													</template>)
												</div>
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
							<div>此班级暂未录入课表，请点击录入课表。
								<el-button type="primary" 
									@click="$router.push({path:'/edu-add-course',query: {termId:termId,schoolYearId:schoolYearId, schoolId : schoolId,yearTermId : yearTermId,gradeId :gradeId,classId:classId,yearTermName:yearTermName,gradeName:gradeName,clN:className}})">录入课表</el-button>
							</div>
						</template>
						<template v-else>
							<div>暂无课表信息
							</div>
						</template>
					</div>
				</template>
			</section>
		</el-card>
		<el-dialog title="" :visible.sync="dialogFormVisible" width="290px">
			<div class="qrcode-box">
				<div class="qrcode-title margin-bottom-20">{{courseName ? courseName : yearTermName + gradeName + className+'课程表'}}</div>
				<div class="margin-bottom-20" id="qrcode" ref="qrCodeDiv"></div>
				<div class="qrcode-remark">请使用手机扫描二维码访问</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, getExportFile, deleteData, compareDate } from '@/utils/common'
	import QRCode from 'qrcodejs2'
	export default {
		name: 'class-schedule',
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				weekDay: [],
				htmlTitle: '班级课表',
				list:[],
				yearList: [],
				yearTermId: '',
				gradeList: [],
				gradeId:'',
				classList: [],
				classId:'',
				dialogFormVisible: false,
				appHeight: 800,
				gradeClassify: '',
				listLoading:false,
				yearTermName:'',
				gradeName:'',
				className:'',
				totalCourse:'',
				isShowSlect : true,
				courseName:'',
				operateYearTermIds:[],
				schoolYearId:'',
				termId:''
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
					let params = that.$route.params
					that.yearTermId = params.yearTermId ? params.yearTermId : data.yearTermId;
					that.termId = params.termId ? params.termId : data.termId;
					that.schoolYearId = params.schoolYearId ? params.schoolYearId : data.schoolYearId;
					that.yearTermName = params.yearTermName ? params.yearTermName : (data.schoolYearName+data.termName);
					let yearlist = data.list,
						index = null
					yearlist.forEach((item, yindex) => {
						if(item.yearTermId == data.yearTermId) {
							index = yindex
						}
					})
					that.yearList = yearlist;
					that.operateYearTermIds[0] = data.yearTermId;
					that.operateYearTermIds[1] = yearlist[(index + 1)].yearTermId;
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
						if(data.list && data.list.length > 0){
							let params = that.$route.params
							that.gradeId = params.gradeId
							that.gradeName = params.gradeName
							if(params.yearTermId != that.yearTermId){
								that.gradeId = data.list[0].gradeId
								that.gradeName = data.list[0].gradeName
							}
							that.getClassData();
						}else{
							that.gradeId = ''
							that.gradeName = ''
							that.classId =  ''
							that.className = ''
							that.classList = []
						}
					} else {
						that.gradeList = []
					}
				})
			},
			//查询班级
			getClassData() {
				var that = this
				getCommHttpData({
					url: 'common/queryClassListAuthority',
					method: 'get',
					contentType: 1,
					data: {
						schoolId: this.schoolId,
						schoolYearId:this.schoolYearId,
						termId:this.termId,
						gradeId: this.gradeId
					}
				}, function(data) {
					if(data.code == 0) {
						that.classList = data.list
						if(data.list && data.list.length > 0){
							let params = that.$route.params
							that.classId =  params.classId ? params.classId : data.list[0].classId
							that.className = params.className ? params.className : data.list[0].className	
						}else{
							that.classId =  ''
							that.className = ''
						}
					} 
					if(that.classId){
						that.getCourseList()	
					}
				})
			},
			changeSchoolTerm(val){
				let current = this.yearList.find(item=>{
					return item.yearTermId == val
				})
				this.termId = current.termId;
				this.schoolYearId = current.schoolYearId;
				this.yearTermName = current.schoolYearName+current.termName;
				this.getGradeData()
			},
			changeGrade(val){
				let current = this.gradeList.find(item=>{
					return item.gradeId == val
				})
				this.gradeName = current.gradeName;
				this.getClassData()
			},
			changeClass(val){
				let current = this.classList.find(item=>{
					return item.classId == val
				})
				this.className = current.className;
				this.getCourseList()
			},
			enter(e) {
				let that = this
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
					url: 'eduManageCourse/classCourseList?schoolId='+this.schoolId+'&yearTermId='+this.yearTermId+'&gradeId='+this.gradeId+'&classId='+this.classId,
					method: 'get',
					contentType: 2
				}, function(data) {
					that.listLoading = false
					if(data && data.code == 0) {
						that.weekDay = data.weekType == 0 ? ['星期一','星期二','星期三','星期四','星期五'] : ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
						that.courseName = data.courseName
						that.list = data.list;
						that.totalCourse = data.lessonNum
					}
				})
			},
			//分享
			shareHandle(command) {
				let param = this.schoolId+'-'+this.yearTermId+'-'+this.gradeId+'-'+this.classId;
				if(command == 1) {
					//QQ
					let url = window.SITE_CONFIG.webIp + 'course-detail?schoolId='+param
					let str = `connect.qq.com/widget/shareqq/index.html?url=${url}&title=${this.courseName}&source=点击查看更多详情`
					window.open('http://' + str);
				} else {
					//二维码

					this.dialogFormVisible = true
					this.$nextTick(function() {
						document.getElementById("qrcode").innerHTML = "";
						let qrcode = new QRCode(this.$refs.qrCodeDiv, {
							text: window.SITE_CONFIG.webIp + 'course-detail?schoolId='+param, // 二维码内容  
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
				window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia + 'eduManageCourse/download?schoolId='+this.schoolId+'&yearTermId='+this.yearTermId+'&gradeId='+this.gradeId+'&classId='+this.classId));
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