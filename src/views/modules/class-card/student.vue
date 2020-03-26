<template>
	<div class="student_management">
		<el-card class="blue-shadow">
			<el-row>
				<el-col :span="24">
					<el-select v-model="schoolTrem" placeholder="请选择学年学期" style="width:200px;margin-right: 10px;" @change="getChange">
						<el-option v-for="(item,index) in theStoption" :key="index" :label="item.schoolYearName+item.termName" :value="index">
						</el-option>
					</el-select>
					<el-select v-model="gradeClassId" clearable placeholder="请选择年级班级" style="width:250px;margin-right: 10px;" @change="getTablelist">
						<el-option v-for="(item,index) in theGcoption" :key="index" :label="item.gradeName+item.className" :value="index">
						</el-option>
					</el-select>
					
					<el-input placeholder="请输入学生姓名"  clearable :inline="true" v-model="keywords" style="width: 250px;" @input="getTablelist"></el-input>
				</el-col>
			</el-row>
			<div class="table">
				<el-table :data="dataList" border >
					<el-table-column type="index" label="序号" align="center" width="80">
					</el-table-column>
					<el-table-column prop="stuCode" label="学籍号" align="center">
					</el-table-column>
					<el-table-column prop="stuName" label="姓名" align="center">
					</el-table-column>
					<el-table-column prop="sex" label="性别" align="center">
					</el-table-column>
					<el-table-column prop="nativePlace" label="籍贯" align="center">
					</el-table-column>
					<el-table-column prop="birthday" label="出生日期" align="center" :formatter="dateFormat">
					</el-table-column>
					<el-table-column prop="mobile" label="联系电话" align="center">
					</el-table-column>
				</el-table>
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</div>
		</el-card>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	export default {
		data() {
			return {
				gradeClassId: undefined,
				theGcoption: [],
				schoolTrem:0,
				theStoption: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataList: [],
				keywords:""
			}
		},
		created() {
			this.schoolTerm();
			
		},
		methods: {
			dateFormat(row, column, cellValue, index) {
				if(row[column.property]){
					const timeFormat = row[column.property].substring(0, 10);
					return timeFormat
				}
				
			},
			schoolTerm() {
				let that = this;
				getCommHttpData({
					url: 'common/queryYearTerm',
					method: 'get',
					contentType: 1,
//					data: {
			}, function(data) {
					that.theStoption = data.list;
					that.gradeClass()	
				})
			},
			getChange(){
				this.gradeClass()
				this.getTablelist()
			},
			gradeClass() {
				let that = this;
				let yearTermId;
				if(this.schoolTrem!=undefined){
					yearTermId=this.theStoption[this.schoolTrem].yearTermId
				}
				getCommHttpData({
					url: 'common/queryGradeAndClassByUser',
					method: 'get',
					contentType: 1,
					data:{
						yearTermId:yearTermId
					},
				}, function(data) {
					that.theGcoption = data.list;
					that.getTablelist()
				})
			},
			getTablelist() {
				let that = this;
				let gradeId,classId,schoolYearId,termId;
				
				if(this.gradeClassId != '' && this.gradeClassId>=0&&this.theGcoption){
					gradeId=this.theGcoption[this.gradeClassId].gradeId
				}else{
					gradeId=undefined
				}
				if(this.gradeClassId != '' && this.gradeClassId>=0&&this.theGcoption){
					classId=this.theGcoption[this.gradeClassId].classId
				}else{
					classId=undefined
				}
				if(this.schoolTrem>=0){
					schoolYearId=this.theStoption[this.schoolTrem].schoolYearId,
					termId=this.theStoption[this.schoolTrem].termId
				}else{
					schoolYearId=undefined,
					termId=undefined
				}
				getCommHttpData({
					url: 'cms/eClass/studentList',
					method: 'get',
					contentType: 1,
					data: {
						gradeId: gradeId,
						classId: classId,
						schoolYearId:schoolYearId,
						termId:termId,
						page: this.pageIndex,
						size: this.pageSize,
						keywords:this.keywords
					},
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndex != 1) {
							that.pageIndex = 1
							that.getTablelist()
						}
						that.dataList = data.page.list
						that.totalPage = data.page.totalCount					
					}else {
						that.dataList = []
						that.totalPage = 0
					}
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getTablelist()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getTablelist()
			},
		}
	}
</script>

<style>
	.table {
		margin-top: 10px;
	}
</style>