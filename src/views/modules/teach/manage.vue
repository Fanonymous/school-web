<template>
	<div class="teachers_manage">
		<el-card class="blue-shadow">
			<el-select v-model="teacherType" @change="getDataList" clearable placeholder="请选择教职工类别">
				<el-option v-for="item in teacherTypecodeTypeList" :key="item.value" :label="item.dictName" :value="item.value">
				</el-option>
			</el-select>
			<el-select v-model="teacherOriginType" @change="getDataList" clearable placeholder="请选择教职工来源">
				<el-option v-for="item in teacherOriginTypeList" :key="item.value" :label="item.dictName" :value="item.value">
				</el-option>
			</el-select>
			<el-select v-model="fullTime" @change="getDataList" clearable placeholder="请选择在编状态">
				<el-option v-for="item in fullTimeList" :key="item.value" :label="item.dictName" :value="item.value">
				</el-option>
			</el-select>
			<el-input v-model="msg" @input="getDataList" style="width:300px" placeholder="请输入姓名/身份证号/教职工号查询"></el-input>
			
			<el-button type="danger" class="right margin-left-10" @click="batchDelHandle()">批量删除</el-button>
			<el-button type="primary" class="right">导出</el-button>
			<el-table v-loading="dataListLoading"  @selection-change="selectionChangeHandle" element-loading-text="拼命加载中" border ref="singleTable" :data="dataList" highlight-current-row style="width: 100%;margin-top: 10px;">
				<el-table-column
			        type="selection"
			        header-align="center"
			        align="center"
			        width="50">
				</el-table-column>
				<el-table-column type="index" label="序号" align="center" width="80">
				</el-table-column>
				<el-table-column property="teacherName" label="姓名" align="center">
					<template slot-scope="scope">
						<router-link :to="{name:'teach-manage-look',query:{teacherId:scope.row.teacherId},params:{teacherId:scope.row.teacherId}}" style="text-decoration: none;">
							{{scope.row.teacherName}}
						</router-link>
					</template>
				</el-table-column>
				<el-table-column property="identityNum" label="身份证号" align="center">
				</el-table-column>
				<el-table-column property="telPhone" label="手机号" align="center">
				</el-table-column>
				<el-table-column property="email" label="邮箱" align="center">
				</el-table-column>
				<el-table-column property="teacherCode" label="教职工号" align="center">
				</el-table-column>
				<el-table-column property="enterDate" label="入职时间" align="center">
				</el-table-column>
				<el-table-column property="teacherTypecodeName" label="教职工类别" align="center">
				</el-table-column>
				<el-table-column property="teacherOriginName" label="教职工来源" align="center">
				</el-table-column>
				<el-table-column property="isSpecialTrain" label="是否在编" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.isSpecialTrain === 0" size="small">否</span>
						<span v-if="scope.row.isSpecialTrain === 1" size="small">是</span>
					</template>
				</el-table-column>
				<el-table-column property="createDate" label="添加时间" align="center">
					<template slot-scope="scope">
						{{scope.row.createDate.substr(0,10)}}
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center" width="140">
					<template slot-scope="scope">
						<router-link :to="{name:'teach-leave-data',query:{leaveType:1},params:{teacherId:scope.row.teacherId}}" style="text-decoration: none;">
							<el-button type="text" size="small">离职</el-button>
						</router-link>
						<router-link :to="{name:'teach-retire-data',query:{leaveType:2},params:{teacherId:scope.row.teacherId}}" style="text-decoration: none;">
							<el-button type="text" size="small">退休</el-button>
						</router-link>
						<router-link :to="{name:'teach-manage-add',params:{teacherId:scope.row.teacherId}}" style="text-decoration: none;">
							<el-button type="text" size="small">完善信息</el-button>
						</router-link>
						<el-button @click="deleteData(scope.row)" type="text" size="small">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div style="margin-top: 20px">
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
				schoolId: this.GLOBAL.getOrgId(),
				msg: '',
				teacherType:'',
				teacherOriginType:'',
				teacherOriginTypeList:[],
				teacherTypecodeTypeList:[],
				fullTimeList:[{value:1,dictName:'是'},{value:2,dictName:'否'}],
				fullTime:'',
				dataListLoading: true,
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				addOrUpdateVisible: false
			}
		},
		
		created() {
			
		},
		mounted(){
			this.getDataList();
			//教职工来源
			getCommonDictByType(this, 'teacher_origin_type', 'teacherOriginTypeList')
			//教职工类别
			getCommonDictByType(this, 'teacher_typecode_type', 'teacherTypecodeTypeList')
			
		},
		methods: {
			// 多选
		    selectionChangeHandle (val) {
		        this.dataListSelections = val
		    },
			// 获取数据列表
			getDataList() {
				this.dataListLoading = true
				this.keywords = this.keywords == '' ? undefined : this.keywords;
				var that = this
				getCommHttpData({
					url: 'teacherManage/queryList',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						keywords: this.keywords,
						schoolId: this.schoolId
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndex != 1) {
							that.pageIndex = 1
							that.getDataList()
						}
						that.dataList = data.page.list
						that.totalPage = data.page.totalCount
					} else {
						that.dataList = []
						that.totalPage = 0
					}
					that.dataListLoading = false
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
			// 删除
			deleteHandle(id, tagName) {
				var ids = id ? [id] : this.dataListSelections.map(item => {
					return item.id
				})
				var that = this
				deleteData(this, {
					url: 'teacherManage/delete',
					method: 'post',
					contentType: 2,
					operateType: 1,
					data: {
						teacherId: teacherId
					}
				}, function(data) {
					that.getDataList()
				})
			}
			
		}
	}
</script>

<style scoped lang="scss">

</style>