<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="edu-class">
		<el-card v-loading="listLoading" style="min-width:1000px">
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
													<el-table border :show-header=false :data="item.courseList[index].list">
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
					<div><img src="~@/assets/img/nodata2.png" width="300px" /></div>
					<div>啊哦~ 您访问的课表丢失啦~
					</div>
				</div>
			</template>
		</el-card>
	</div>
</template>

<script>
	import { getCommHttpData, compareDate } from '@/utils/common'
	export default {
		name: 'class-schedule',
		data() {
			return {
				weekDay: [],
				list: [],
				appHeight: 800,
				listLoading: false,
				yearTermName: '',
				subjectName:'',
				teacherName:'',
				totalCourse: '',
				name: '',
				courseName:''
			}
		},
		mounted() {
			window.addEventListener('resize', () => {
				this.appHeight = window.innerHeight
			})
			this.appHeight = window.innerHeight
			this.getCourseList();
		},
		methods: {
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
				let schoolId, yearTermId, subjectId, teacherId;
				if(this.$route.query.schoolId) {
					let str = this.$route.query.schoolId
					let tempStr = str.split('-')
					schoolId = tempStr[0];
					yearTermId = tempStr[1];
					subjectId = tempStr[2];
					teacherId = tempStr[3];
					let that = this
					that.listLoading = true
					getCommHttpData({
						url: 'eduManageCourse/teacherCourseList?schoolId=' + schoolId + '&yearTermId=' + yearTermId + '&subjectId=' + subjectId + '&teacherId=' + teacherId,
						method: 'get',
						contentType: 2
					}, function(data) {
						that.listLoading = false
						if(data && data.code == 0) {
							that.weekDay = data.weekType == 0 ? ['星期一','星期二','星期三','星期四','星期五'] : ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
							that.courseName = data.courseName;
							that.list = data.list
							that.totalCourse = data.lessonNum
						}
					})
				} else {
					this.list = []
				}
			}

		}
	}
</script>
<style>
	#class-table {
		text-align: center;
		background: #FFFFFF;
	}
	
	#class-table th {
		background: #3C85EE;
		color: #FFFFFF;
		border: 0.5px solid #e6e6e6;
		height: 45px;
	}
	
	#class-table td {
		/*border-right: 1px solid #EBEEF5;*/
		/*border-bottom: 1px solid #EBEEF5;*/
		border: 0.5px solid #EBEEF5;
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
		/*border-left: 1px solid #EBEEF5;*/
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
</style>