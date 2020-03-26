<template>
	<el-card v-loading="isCourseLoading" element-loading-text="正在变更课表">
		<div v-loading="isLoading" class="second-step" style="position: relative;" :style="'height: '+appHeight+'px'">
			<div class="grey">您可点击单元格修改课表内容。已变更：{{editNum}}条</div>
			<el-row>
				<el-col :span="20">
					<div style="margin-top: 10px;" class="margin-bottom-20">
						<el-input class="schedule-title grey" v-model="courseTotalList[index].editCourseName" placeholder="请输入课表名称"></el-input>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="20">
					<template v-if="courseTotalList[index].list.length > 0">
						<table id="table" width="100%" cellspacing="0">
							<tbody>
								<tr>
									<th class="th-add" width="10%"></th>
									<th class="th-add" width="12.8%" v-for="item in weekDay">
										{{item.weekName}}
									</th>
								</tr>
								<tr v-for="(item,courseIndex) in courseTotalList[index].list">
									<td width="10%">{{item.lessionCodeName}}</td>
									<td width="12.8%" :class="item.courseList[weekIndex] && item.courseList[weekIndex].isEdit === 1 ? 'isEdit' : ''" @click="openModal(courseIndex,weekIndex)" v-for="(item1,weekIndex) in weekDay">
										<template v-if="item.courseList[weekIndex].list.length > 0">
											<div>{{item.courseList[weekIndex].list[0].subjectName}}</div>
										</template>
									</td>
								</tr>
							</tbody>
						</table>
					</template>
					<template v-else>
						<div class="no-course-list" style="height: 397px;">
							<div><img src="~@/assets/img/nodata2.png" /></div>
							<div>暂无课表</div>
						</div>
					</template>
				</el-col>
				<el-col :span="4">
					<div class="tag-box">
						<div class="tab-item" @click="tabClass(cIndex)" :class="index == cIndex ? 'current' : ''" v-for="(item,cIndex) in courseTotalList">{{item.className}}</div>
					</div>

				</el-col>
			</el-row>
			<div class="footer">
				<el-button type="primary" @click="courseSubmit">发布变更内容</el-button>
			</div>
		</div>
		<el-dialog title="请选择科目" :visible.sync="subShow" width="740px">
			<el-radio-group v-model="checkSub" size="small">
				<el-col :span="6" style="margin-top: 10px;">
					<el-radio label="0">无课</el-radio>
				</el-col>
				<el-col :span="6" v-for="item in subList" style="margin-top: 10px;">
					<el-radio :label="item.subjectName">{{item.subjectName}}</el-radio>
				</el-col>
			</el-radio-group>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="subShow = false">取 消</el-button>
			    <el-button type="primary" @click="changeSubject">确 定</el-button>
			  </span>
		</el-dialog>
	</el-card>
</template>

<script>
	import { getCommHttpData } from '@/utils/common'
	export default {
		name: 'update-schedule',
		data() {
			return {
				editNum: 0,
				isLoading: false,
				isCourseLoading: false,
				appHeight: 800,
				courseTotalList: [],
				subShow: false,
				subList: [],
				checkSub: '',
				classId: '',
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
				gradeId: '',
				schoolId: '',
				yearTermId: '',
				courseName: '',
				weekIndex: '',
				courseIndex: '',
				changeCourseList: [],
				index: '',
				editList: []
			}
		},
		mounted() {
			let routeQuery = this.$route.query;
			this.gradeId = routeQuery.gradeId
			this.schoolId = routeQuery.schoolId
			this.yearTermId = routeQuery.yearTermId
			this.classId = routeQuery.classId
			this.courseName = routeQuery.name + routeQuery.clN + '课程表'

			window.addEventListener('resize', () => {
				this.appHeight = window.innerHeight - 330
			})
			this.appHeight = window.innerHeight - 330;
			this.getCourseList()
			this.getSubjectList()

		},
		methods: {
			courseSubmit() {
				let editCourseNameList = [],tmpNameInfo='',temCourseLength='';
				this.courseTotalList.forEach(item => {
					if(!item.editCourseName){
						tmpNameInfo += item.className+',' 
					}else if(item.editCourseName && item.editCourseName.length > 25){
						temCourseLength += item.className+','
					}
					if(item.editCourseName != item.courseName) {
						editCourseNameList.push({
							courseId: item.courseId,
							courseName: item.editCourseName
						})
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
				let that = this
				that.$confirm('课表更新后，将分发给各个老师和学生，您确认更新吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					that.isCourseLoading = true
					getCommHttpData({
						url: 'eduManageCourse/saveChangCourse',
						method: 'post',
						contentType: 2,
						data: {
							schoolId: that.schoolId,
							yearTermId: that.yearTermId,
							gradeId: that.gradeId,
							list: that.editList,
							courseNameList: editCourseNameList
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
			tabClass(val) {
				if(val !== this.index) {
					this.index = val;
				}
			},
			getCourseList() {
				let that = this
				that.isLoading = true
				getCommHttpData({
					url: 'eduManageCourse/courseList?schoolId=' + this.schoolId + '&yearTermId=' + this.yearTermId + '&gradeId=' + this.gradeId,
					method: 'get',
					contentType: 2
				}, function(data) {
					that.isLoading = false
					if(data && data.code == 0) {
						that.courseTotalList = data.list
						that.courseTotalList.forEach((item, index) => {
							if(item.classId == that.classId) {
								that.index = index
							}
						})
						console.log(that.courseTotalList, 'hdhdhhdhdh')
					}
				})
			},
			openModal(index, index1) {
				this.courseIndex = index
				this.weekIndex = index1
				if(this.courseTotalList[this.index].list[index].courseList[index1].list.length > 0) {
					let subject = this.courseTotalList[this.index].list[index].courseList[index1].list[0].subjectName
					if(subject) {
						this.checkSub = subject
					}else{
						this.checkSub = ''
					}
				} else {
					this.checkSub = ''
				}
				this.subShow = true;

			},
			changeSubject() {
				if(this.checkSub != 0) {
					var changeCourse = this.subList.find(item => {
						return item.subjectName == this.checkSub
					})
				}
				if(this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].list.length > 0) {
					let oldName = this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['oldName'];
					if(this.checkSub == 0) {
						if(oldName == '无课') {
							this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['isEdit'] = ''
							let option = {
								courseId: this.courseTotalList[this.index].courseId,
								lessionCode: this.courseTotalList[this.index].list[this.courseIndex].lessionCode,
								lessionCodeName: this.courseTotalList[this.index].list[this.courseIndex].lessionCodeName,
								weekDay: this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['weekDay'],
								weekDayName: this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['weekDayName'],
								subjectId: this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].list[0]['subjectId'],
								subjectName:this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].list[0]['subjectName'],
								classId: this.courseTotalList[this.index].classId,
								className: this.courseTotalList[this.index].className
							};
							let editIndex;
							this.editList && this.editList.forEach((item, index) => {
								if(JSON.stringify(item) == JSON.stringify(option)) {
									editIndex = index
								}
							})
							this.editList.splice(editIndex, 1);
							this.editNum = this.editNum - 1

						} else {
							this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['oldName'] = oldName ? oldName : this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].list[0].subjectName;
							this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['isEdit'] = 1
							let editIndex2 = null;
							this.editList && this.editList.forEach((item, index) => {
								if(item.detailId == this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].list[0]['detailId']) {
									editIndex2 = index
								}
							})
							if(editIndex2 != null) {
								delete this.editList[editIndex2].subjectId
							} else {
								this.editList.push({
									courseId: this.courseTotalList[this.index].courseId,
									lessionCode: this.courseTotalList[this.index].list[this.courseIndex].lessionCode,
									lessionCodeName: this.courseTotalList[this.index].list[this.courseIndex].lessionCodeName,
									weekDay: this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['weekDay'],
									weekDayName: this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['weekDayName'],
									detailId: this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].list[0]['detailId'],
									classId: this.courseTotalList[this.index].classId,
									className: this.courseTotalList[this.index].className
								})
								this.editNum = this.editNum + 1
							}
						}
						this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].list[0].subjectName = ''
					} else {
						
						this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['oldName'] = oldName ? oldName : this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].list[0].subjectName;
						if(this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['oldName'] == changeCourse.subjectName) {
							this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['isEdit'] = ''
							let option = {
								courseId: this.courseTotalList[this.index].courseId,
								lessionCode: this.courseTotalList[this.index].list[this.courseIndex].lessionCode,
								lessionCodeName: this.courseTotalList[this.index].list[this.courseIndex].lessionCodeName,
								weekDay: this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['weekDay'],
								weekDayName: this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['weekDayName'],
								subjectId: this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].list[0]['subjectId'],
								subjectName:this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].list[0]['subjectName'],
								classId: this.courseTotalList[this.index].classId,
								className: this.courseTotalList[this.index].className
							};
							let editIndex1;
							this.editList && this.editList.forEach((item, index) => {
								if(JSON.stringify(item) == JSON.stringify(option)) {
									editIndex = index
								}
							})
							this.editList.splice(editIndex1, 1);
							this.editNum = this.editNum - 1
						} else {
							this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['isEdit'] = 1
							let editIndex3 = null;
							this.editList && this.editList.forEach((item, index) => {
								if(item.detailId == this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].list[0]['detailId']) {
									editIndex3 = index
								}
							})
							if(editIndex3 != null) {
								this.editList[editIndex3].subjectId = changeCourse.subjectId
							} else {
								this.editList.push({
									courseId: this.courseTotalList[this.index].courseId,
									lessionCode: this.courseTotalList[this.index].list[this.courseIndex].lessionCode,
									lessionCodeName: this.courseTotalList[this.index].list[this.courseIndex].lessionCodeName,
									weekDay: this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['weekDay'],
									weekDayName: this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['weekDayName'],
									subjectId: changeCourse.subjectId,
									subjectName:changeCourse.subjectName,
									detailId: this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].list[0]['detailId'],
									classId: this.courseTotalList[this.index].classId,
									className: this.courseTotalList[this.index].className
								})
								this.editNum = this.editNum + 1
							}
						}

						this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].list[0].subjectName = changeCourse.subjectName
					}
				} else {
					if(this.checkSub == 0){
						this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['isEdit'] = ''
					}else{
						this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['isEdit'] = 1
						this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['oldName'] = '无课'
						this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex].list = [{
							subjectId: changeCourse.subjectId,
							subjectName: changeCourse.subjectName
						}]
						this.editList.push({
							courseId: this.courseTotalList[this.index].courseId,
							lessionCode: this.courseTotalList[this.index].list[this.courseIndex].lessionCode,
							lessionCodeName: this.courseTotalList[this.index].list[this.courseIndex].lessionCodeName,
							weekDay: this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['weekDay'],
							weekDayName: this.courseTotalList[this.index].list[this.courseIndex].courseList[this.weekIndex]['weekDayName'],
							subjectId: changeCourse.subjectId,
							subjectName:changeCourse.subjectName,
							classId: this.courseTotalList[this.index].classId,
							className: this.courseTotalList[this.index].className
	
						})
						this.editNum = this.editNum + 1	
					}
				}
				this.subShow = false
				this.$forceUpdate();
			}
		}
	}
</script>

<style>
	.grey {
		color: #808080;
	}
	
	.grey input {
		text-align: center;
		border: none;
	}
	
	.second-step #table {
		text-align: center;
		background: #FFFFFF;
	}
	
	.second-step th {
		background: #f5f5f5;
		color: #808080;
		border: 1px solid #e5e5e5;
		height: 45px;
	}
	
	.second-step #table td {
		border-right: 1px solid #e5e5e5;
		border-bottom: 1px solid #e5e5e5;
		height: 44px;
	}
	
	.second-step #table tr td:first-child {
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
		background-color: #2ebbad;
		color: #FFFFFF !important;
		border: none;
	}
	
	.second-step .footer {
		position: absolute;
		bottom: 0;
		right: 0;
	}
	
	.no-course-list {
		margin-top: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	
	.no-course-list img {
		height: 230px;
	}
	
	.isEdit {
		background-color: #e6f6f4;
	}
</style>