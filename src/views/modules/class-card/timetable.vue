<template>
	<div class="timetable_management">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="班级课表" name="first">
				<el-select v-model="gradeClassId" placeholder="请选择年级班级" style="margin-bottom: 10px;width:250px;" @change="gradeClass">
					<el-option v-for="(item,index) in theGcoption" :key="index" :label="item.gradeName+item.className" :value="index">
					</el-option>
				</el-select>
				<el-table :data="tableData" border style="margin-top: 10px;" v-loading="loading" element-loading-text="拼命加载中">
					<el-table-column prop="date" label="节次" align="center">
						<template slot-scope="scope">
							<p>{{scope.row.lessioncodeName}}&nbsp;&nbsp;{{scope.row.startTime+"-"+scope.row.endTime}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="星期一" align="center">
						<template slot-scope="scope">
							<p v-if="tableData[scope.$index].list.length !=0">{{tableData[scope.$index].list[0].subjectName}}</p>
							<p v-else>无</p>

						</template>
					</el-table-column>
					<el-table-column prop="address" label="星期二" align="center">
						<template slot-scope="scope">
							<p v-if="tableData[scope.$index].list.length >1">{{tableData[scope.$index].list[1].subjectName}}</p>
							<p v-else>无</p>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="星期三" align="center">
						<template slot-scope="scope">
							<p v-if="tableData[scope.$index].list.length >2">{{tableData[scope.$index].list[2].subjectName}}</p>
							<p v-else>无</p>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="星期四" align="center">
						<template slot-scope="scope">
							<p v-if="tableData[scope.$index].list.length >3">{{tableData[scope.$index].list[3].subjectName}}</p>
							<p v-else>无</p>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="星期五" align="center">
						<template slot-scope="scope">
							<p v-if="tableData[scope.$index].list.length >4">{{tableData[scope.$index].list[4].subjectName}}</p>
							<p v-else>无</p>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="星期六" align="center" v-if="isShow.isShowSt">
						<template slot-scope="scope">
							<p v-if="tableData[scope.$index].list.length >5">{{tableData[scope.$index].list[5].subjectName}}</p>
							<p v-else>无</p>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="星期日" align="center" v-if="isShow.isShowSun">
						<template slot-scope="scope">
							<p v-if="tableData[scope.$index].list.length >6">{{tableData[scope.$index].list[6].subjectName}}</p>
							<p v-else>无</p>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="教师课表" name="second" v-loading="loading1" element-loading-text="拼命加载中">
				<!--<el-select v-model="schoolTrem" placeholder="请选择学年学期" style="width:200px;margin-right: 10px;" @change="schoolTerm">
					<el-option v-for="(item,index) in theStoption" :key="index" :label="item.schoolYearName+item.termName" :value="index">
					</el-option>
				</el-select>
				<el-select v-model="gradeClassId1" placeholder="请选择年级班级" style="width:250px;margin-right: 10px;" @change="getTeaname">
					<el-option v-for="(item,index) in theGcoption1" :key="index" :label="item.gradeName+item.className" :value="index">
					</el-option>
				</el-select>-->
				<!--<el-select v-model="teaName" clearable placeholder="请选择老师" style="width:250px;margin-bottom: 10px; float: right;" @change="getTeatable">
					<el-option v-for="item in teaOption" :key="item.teacherId" :label="item.teacherName" :value="item.teacherId">
					</el-option>
				</el-select>-->
				<el-autocomplete v-model="teaName" :fetch-suggestions="querySearch" clearable @clear="teaId='',getTeatable()"  placeholder="请输入姓名" @select="handleSelect"></el-autocomplete>
				<el-table :data="teaTablelist" border style="margin-top: 10px;">
					<el-table-column prop="date" label="节次" align="center">
						<template slot-scope="scope">
							<p>{{scope.row.lessioncodeName}}</p>
							<p>{{scope.row.startTime+"-"+scope.row.endTime}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="星期一" align="center">
						<template slot-scope="scope">
							<div v-if="teaTablelist[scope.$index].list.length>0">
								<p>{{teaTablelist[scope.$index].list[0].subjectName}}</p>
								<p>{{teaTablelist[scope.$index].list[0].gradeName}}{{teaTablelist[scope.$index].list[0].className}}</p>
							</div>
							<div v-else>无</div>

						</template>
					</el-table-column>
					<el-table-column prop="address" label="星期二" align="center">
						<template slot-scope="scope">
							<div v-if="teaTablelist[scope.$index].list.length>1">
								<p>{{teaTablelist[scope.$index].list[1].subjectName}}</p>
								<p>{{teaTablelist[scope.$index].list[1].gradeName}}{{teaTablelist[scope.$index].list[1].className}}</p>
							</div>
							<div v-else>无</div>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="星期三" align="center">
						<template slot-scope="scope">
							<div v-if="teaTablelist[scope.$index].list.length>2">
								<p>{{teaTablelist[scope.$index].list[2].subjectName}}</p>
								<p>{{teaTablelist[scope.$index].list[2].gradeName}}{{teaTablelist[scope.$index].list[2].className}}</p>
							</div>
							<div v-else>无</div>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="星期四" align="center">
						<template slot-scope="scope">
							<div v-if="teaTablelist[scope.$index].list.length>3">
								<p>{{teaTablelist[scope.$index].list[3].subjectName}}</p>
								<p>{{teaTablelist[scope.$index].list[3].gradeName}}{{teaTablelist[scope.$index].list[3].className}}</p>
							</div>
							<div v-else>无</div>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="星期五" align="center">
						<template slot-scope="scope">
							<div v-if="teaTablelist[scope.$index].list.length>4">
								<p>{{teaTablelist[scope.$index].list[4].subjectName}}</p>
								<p>{{teaTablelist[scope.$index].list[4].gradeName}}{{teaTablelist[scope.$index].list[4].className}}</p>
							</div>
							<div v-else>无</div>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="星期六" align="center" v-if="teaShow.isShowSt">
						<template slot-scope="scope">
							<div v-if="teaTablelist[scope.$index].list.length>5">
								<p>{{teaTablelist[scope.$index].list[5].subjectName}}</p>
								<p>{{teaTablelist[scope.$index].list[5].gradeName}}{{teaTablelist[scope.$index].list[5].className}}</p>
							</div>
							<div v-else>无</div>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="星期日" align="center" v-if="teaShow.isShowSun">
						<template slot-scope="scope">
							<div v-if="teaTablelist[scope.$index].list.length>6">
								<p>{{teaTablelist[scope.$index].list[6].subjectName}}</p>
								<p>{{teaTablelist[scope.$index].list[6].gradeName}}{{teaTablelist[scope.$index].list[6].className}}</p>
							</div>
							<div v-else>无</div>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>

	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	export default {
		data() {
			return {
				activeName: "first",
				gradeClassId: undefined,
				theGcoption: [],
				tableData: [],
				loading: true,
				loading1: true,
				teaOption: [],
				teaTablelist: [],
				gradeClassId1: 0,
				theGcoption1: [],
				schoolTrem: 0,
				theStoption: [],
				teaName: '',
				teaId:'',
				teaOption: '',
//				loading: false,
				isShow: {
					isShowSt: true,
					isShowSun: true
				},
				teaShow: {
					isShowSt: true,
					isShowSun: true
				}
			}
		},
		created() {
			this.schoolTerm();
			this.gradeClass();

		},
		methods: {
			schoolTerm() {
				let that = this;
				getCommHttpData({
					url: 'common/queryYearTerm',
					method: 'get',
					contentType: 1,
					//				data:{},
				}, function(data) {
					that.theStoption = data.list;
					that.gradeClass();
					that.getTeatable();
				})
			},
			//切换
			handleClick() {
				if(this.activeName == 'first') {
					this.gradeClass();
				} else if(this.activeName == 'second') {
					this.getTeaname();
					this.getTeatable();
				}
			},
			gradeClass() {
				let that = this;
				let yearTermId;
				getCommHttpData({
					url: 'common/queryGradeAndClassByUser',
					method: 'get',
					contentType: 1,
					data: {
						yearTermId: 0
					},
				}, function(data) {
					that.theGcoption = data.list;
					that.getTablelist()
				})

			},
			//			gradeClass1() {
			//				let that = this;
			//				getCommHttpData({
			//					url: 'common/queryGradeAndClass',
			//					method: 'get',
			//					contentType: 1,
			//					data: {
			//						yearTermId: this.theStoption[this.schoolTrem].yearTermId
			//					},
			//				}, function(data) {
			//					that.theGcoption1 = data.list;
			//				})
			//			},

			//		学生课表
			getTablelist() {
				let that = this;
				let gradeId, classId;
				if(this.gradeClassId>=0&&this.theGcoption.length>0) {
					gradeId = this.theGcoption[this.gradeClassId].gradeId
				} else {
					gradeId = undefined
				}
				if(this.gradeClassId>=0&&this.theGcoption.length>0) {
					classId = this.theGcoption[this.gradeClassId].classId
				} else {
					classId = undefined
				}
				if(gradeId){
						getCommHttpData({
						url: 'cms/eClass/courseList',
						method: 'get',
						contentType: 1,
						data: {
							type: 1,
							gradeId: gradeId,
							classId: classId
						},
					}, function(data) {
						that.tableData = data.list;
						let isShowSt = true
						let isShowSun = true
						for(let i in data.list) {
							if(data.list[i].list.length > 5 && data.list[i].list[5].subjectId == 0) {
								isShowSt = false
							}
							if(data.list[i].list.length > 6 && data.list[i].list[6].subjectId == 0) {
								isShowSun = false
							}
						}
						that.isShow = {
							isShowSt: isShowSt,
							isShowSun: isShowSun
						}
					
					})
				}
					that.loading = false
			},
			//			getTeaname() {
			//				let that = this;
			//				let gradeId, classId;
			//				if(that.theGcoption1[that.gradeClassId1].gradeId != undefined) {
			//					gradeId = this.theGcoption[this.gradeClassId].gradeId
			//				} else {
			//					gradeId = undefined
			//				}
			//				if(that.theGcoption1[that.gradeClassId1].classId != undefined) {
			//					classId = this.theGcoption[this.gradeClassId].classId
			//				} else {
			//					classId = undefined
			//				}
			//				getCommHttpData({
			//					url: 'common/queryTeacherByGradeAndClass',
			//					method: 'get',
			//					contentType: 1,
			//					data: {
			//						gradeId:gradeId,
			//						classId:classId,
			//						schoolYearId: that.theStoption[that.schoolTrem].schoolYearId,
			//						termId: that.theStoption[that.schoolTrem].termId,
			//					},
			//				}, function(data) {
			//					that.teaOption = data.list;
			//					that.getTeatable()
			//				})
			//			},
			//queryString 为在框中输入的值
			//callback 回调函数,将处理好的数据推回
			getTeaname(queryString,callback) {
				//调用的后台接口
				this.teaOption = [];
					let that = this;
					getCommHttpData({
						url: 'common/queryTeacherByGradeAndClass',
						method: 'get',
						contentType: 1,
						data: {
							//							schoolId: this.schoolId,
							keywords: queryString
						},
					}, function(data) {
						for(let i in data.list) {
							data.list[i].value= data.list[i].teacherName //将想要展示的数据作为value
						}
						that.teaOption = data.list;
				})
		},
		handleSelect(item) {
		    console.log(item);
			 if (item!='') {
	          this.teaId = item.teacherId;
	          this.getTeatable();
	          //此处需要特别注意：当精确匹配查询时，当选中建议项时，需要把该对象的值赋给其他元素，
	          //页面数据不会马上更新，当再次点击输入框使输入框值有所变化时，页面数据才会更新出来,目前的解决办法为重新给输入值赋值时加上一个""
	        } else {
	          this.teaId = "";
	        }
		    //do something
		},
		querySearch(queryString, cb) {
			var teaOption = this.teaOption;
	        var results = queryString ? teaOption.filter(this.createFilter(queryString)) : teaOption;
	        // 调用 callback 返回建议列表的数据
	        cb(results);
     	},
     	createFilter(queryString) {
     		let teaOption=this.teaOption
	        return (teaOption) => {
	          return (teaOption.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
	        };
	      },
		getTeaname(query) {
			this.teaOption = [];
			if(query !== '') {
				this.loading = true;
				let that = this;
				getCommHttpData({
					url: 'common/queryTeacherByGradeAndClass',
					method: 'get',
					contentType: 1,
					data: {
						//							schoolId: this.schoolId,
						keywords: query
					},
				}, function(data) {
					that.loading = false;
					that.teaOption = data.list;
					for(let i in data.list) {
							data.list[i].value= data.list[i].teacherName //将想要展示的数据作为value
						}
					that.teaOption = data.list;
				})
			}
		},
		//		教师课表
		getTeatable() {
			let that = this;
			let gradeId, classId;
			//				if(that.theGcoption1[that.gradeClassId1].gradeId != undefined) {
			//					gradeId = this.theGcoption[this.gradeClassId].gradeId
			//				} else {
			//					gradeId = undefined
			//				}
			//				if(that.theGcoption1[that.gradeClassId1].classId != undefined) {
			//					classId = this.theGcoption[this.gradeClassId].classId
			//				} else {
			//					classId = undefined
			//				}
			getCommHttpData({
				url: 'cms/eClass/courseList',
				method: 'get',
				contentType: 1,
				data: {
					type: 2,
					schoolId: this.schoolId,
					//						gradeId:gradeId,
					//						classId:classId,
					teacherId: this.teaId
				},
			}, function(data) {
				that.teaTablelist = data.list;
				let isShowSt = true
				let isShowSun = true
				for(let i in data.list) {
					if(data.list[i].list.length > 5 && data.list[i].list[5].subjectId == null) {
						isShowSt = false
					}
					if(data.list[i].list.length > 6 && data.list[i].list[6].subjectId == null) {
						isShowSun = false
					}
				}
				that.teaShow = {
					isShowSt: isShowSt,
					isShowSun: isShowSun
				}
				that.loading1 = false
			})
		}
	}
	}
</script>

<style>

</style>