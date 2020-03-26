<template>
	<div class="tea-log">
		<el-card class="blue-shadow">
			<el-row>
				<el-col :span="24">
					<el-date-picker v-model="thedata" @change="getTableList" type="daterange" :clearable="false" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>
					<el-input placeholder="姓名/手机号/邮箱/身份证号/教籍号" style="width:300px;float: right;" v-model="keywords" @input="getTableList"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
				</el-col>
			</el-row>
			<template>
				<el-table :data="tableList" border style="width: 100%; margin-top: 20px">
					<el-table-column type="index" label="序号" width="80" align="center">
						<template  slot-scope="scope">
					          {{scope.$index+1+pageSize*(pageIndex-1)}}
					    </template>
					</el-table-column>
					<el-table-column prop="className" label="班级" align="center">
					</el-table-column>
					<el-table-column prop="subjectName" label="科目" align="center">
					</el-table-column>
					<el-table-column prop="changeDetails" label="变更详情" align="center">
					</el-table-column>
					<el-table-column prop="changeDate" label="变更时间" align="center">
					</el-table-column>
				</el-table>
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</template>
		</el-card>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, getExportFile, deleteData } from '@/utils/common'
	export default {
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				thedata:[],
				tableList:[],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				keywords:'',
			}
		},
		mounted() {
				 const end = new Date();
              	const start = new Date();
              	start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              	this.thedata=[start, end]
				this.getTableList()
				
		},
		methods:{
			getTableList() {
				let startTime,endTime;
				if(this.thedata.length>0){
					startTime=this.thedata[0];
					endTime=this.thedata[1]
				}else{
					startTime:undefined;
					endTime:undefined
				}
				let that = this
				getCommHttpData({
					url: 'eduManageTeachingSubject/lessonRecord',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						schoolId: this.schoolId,
						keywords:this.keywords,
					    yearTermId:0,
					    startTime:startTime,
					    endTime:endTime
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndex != 1) {
							that.pageIndex = 1
							that.getTableList()
						}
						that.tableList = data.page.list
						that.totalPage = data.page.totalCount
					} else {
						that.tableList = []
						that.totalPage = 0
					}
					//					that.listLoading = false
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getTableList()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getTableList()
			},
		}
	}
</script>

<style>

</style>