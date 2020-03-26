<template>
	<div class="teachers_manage_leave">
		<!-- <el-date-picker style="margin-bottom: 10px;" v-model="datapicker" type="daterange" unlink-panels range-separator="至"
		 start-placeholder="开始日期" end-placeholder="结束日期" @change="getDataList" value-format="yyyy-MM-dd"></el-date-picker>
		<el-select v-model="contractualType" @change="getDataList" style="width:200px" clearable placeholder="请选择离职类型">
			<el-option v-for="item in quitTypeList" :key="item.value" :label="item.dictName" :value="item.value">
			</el-option>
		</el-select> -->
		<el-card class="blue-shadow">
			<el-input v-model="keywords" @input="getDataList" style="width:260px" placeholder="姓名/手机号/身份证号/邮箱/教籍号"></el-input>
			<el-button type="primary" class="right" @click="$router.push({name:'teach-leave-data', params: {id: '',type: 0}})">添加</el-button>
			<el-table ref="singleTable" :data="dataList" fit border highlight-current-row style="width:100%;margin-top:10px">
				<el-table-column type="index" label="序号" align="center" width="80">
				</el-table-column>
				<el-table-column label="姓名" align="center" property="teacherName">
				<!-- 	<template slot-scope="scope">
						<el-button @click="goChange(scope.row)" type="text" size="small">{{scope.row.teacherName}}</el-button>
					</template> -->
				</el-table-column>
				<el-table-column property="telPhone" label="手机号" align="center">
				</el-table-column>
				<el-table-column property="email" label="邮箱" align="center">
				</el-table-column>
				<el-table-column property="identityNum" label="身份证号" align="center">
				</el-table-column>
				<el-table-column property="teacherNum" label="教籍号" align="center">
				</el-table-column>
			
				<el-table-column label="性别" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.sex === 0" size="small">男</span>
						<span v-else-if="scope.row.sex === 1" size="small" type="danger">女</span>
					</template>
				</el-table-column>
				<el-table-column property="contractualTypeName" label="合同关系" align="center">
				</el-table-column>
				<el-table-column property="endDate" label="离职时间" align="center">
				</el-table-column>
			
				<el-table-column fixed="right" label="操作" align="center" width="100">
					<template slot-scope="scope">
						<el-button @click="handleCheck(scope.row)" type="text" size="small">详情</el-button>
						<el-button @click="$router.push({path:'/teach-leave-data', query: {id: scope.row.teacherId,type: 1}})" type="text" size="small">编辑</el-button>
					</template>
				</el-table-column>
				<el-table-column type="expand"  width="1">
				  <template slot-scope="scope">
				    <el-form label-position="left">
				      <el-form-item label="备注：">
						<span>{{scope.row.remark ? scope.row.remark : '/'}}</span>
				      </el-form-item>
					  <el-form-item label="附件：">
						  <a class="el-upload-list__item-name" v-if="!!scope.row.appendixPath" @click="exportDoc(scope.row.appendixPath)"><i class="el-icon-document"></i>{{scope.row.appendixPath}}</a>
						  <span v-else>/</span>
				      </el-form-item>
				    </el-form>
				  </template>
				</el-table-column>
			</el-table>
			<div style="margin-top: 20px">
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
				 :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="this.totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</div>
		</el-card>

	</div>
</template>

<script>
	import {
		getCommHttpData,
		getCommonDictByType,
		deleteData
	} from '@/utils/common'
	export default {
		data() {
			return {
				datapicker: [],
				keywords:'',
				contractualType:'',
				quitTypeList: [],
				loading: false,
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataList: [],
				schoolId: this.GLOBAL.getOrgId(),
			}
		},
		mounted() {
			getCommonDictByType(this, 'quit_type', 'quitTypeList')
			this.getDataList()
		},
		methods: {
			exportDoc(name){
				// console.log(window.SITE_CONFIG.baseUrlMedia + 'file/common/getFile?fileName='+name)
				window.location.href = encodeURI(window.SITE_CONFIG.baseUrlMedia + 'file/common/getFile?fileName='+name);
			},
			handleCheck(row) {
			     const $table = this.$refs.singleTable
			     
			     $table.toggleRowExpansion(row)
			     $table.toggleRowSelection(row)
			},
			getDataList() {
				this.dataListLoading = true;
				let that = this
				
				getCommHttpData({
					url: 'teacherManage/queryLeaveList',
					method: 'post',
					contentType: 2,
					data: {
						keywords: this.keywords,
						limit: this.pageSize,
						page: this.pageIndex,
						schoolId: this.schoolId,
						schoolYearId: this.schoolYearId,
						state: 1,
						contractualType: this.contractualType,
						startDate: this.datapicker ? this.datapicker[0] : '',
						endDate: this.datapicker ? this.datapicker[1] : ''
					}
				}, function(data) {
					if (data && data.code == 0) {
						that.listLoading = false
						that.dataList = data.page.list
						that.totalPage = data.page.totalCount
					} else {
						that.dataList = []
						that.totalPage = 0
					}
				})

			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getDataList()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getDataList()
			},
			goChange(row) {
				this.forms.name = row.Name;
				this.forms.outData = row.quitDate;
				this.forms.theType = row.dictName;
				this.forms.outReson = row.quitReason;
				this.forms.leaschoolId = row.leaschoolId;
				this.forms.quitType = row.quitType;
				this.forms.teacherId = row.teacherId;
				this.forms.userId = row.userId
			}
		}
	}
</script>

<style scoped lang="scss">
	.teachers_manage_leave .el-form-item {
	    margin-bottom: 0 !important;
	}

</style>
