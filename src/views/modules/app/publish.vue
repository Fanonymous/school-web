<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="app-container">
		<el-card class="blue-shadow">
			<el-form :inline="true" @keyup.enter.native="getDataList()">
				<el-form-item>
					<el-select  placeholder="请选择应用" class="filter-item" v-model="applicationId" clearable @change="getDataList">
						<el-option v-for="item in appSearchList" :key="item.applicationId" :label="item.applicationName" :value="item.applicationId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="keywords" placeholder="请输入名称查询" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="$router.push({name:'publish-add',query:{type:0}, params: {id: ''}})">发布应用</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="dataList" v-loading="dataListLoading" border fit highlight-current-row>
				<el-table-column  align="center" label='序号' width="95">
					<template slot-scope="scope">
			          {{scope.$index+1+pageSize*(pageIndex-1)}}
			        </template>
				</el-table-column>
				<el-table-column  prop="applicationName" align="center" label="应用">
				</el-table-column>
				<el-table-column prop="forShort" align="center" label="简称">
				</el-table-column>
				<el-table-column  prop="applicationId" align="center" label="应用编号">
				</el-table-column>
				<el-table-column  prop="type" align="center" label="终端">
				</el-table-column>
				<el-table-column prop="version" align="center" label="版本">
				</el-table-column>
				<el-table-column prop="createDate" align="center" label="创建时间">
				</el-table-column>
				<el-table-column prop="status" align="center" label="是否启用">
					<template slot-scope="scope">
						<el-switch active-text="是" :width="50" inactive-text="否"  v-model="scope.row.status" active-color="#13ce66" :active-value="0" :inactive-value="1" @change="changeSatus(scope.row.productId,scope.row.enabled)">
						</el-switch>
					</template>
				</el-table-column>
				<!--<el-table-column prop="order" align="center" label="排序">
				</el-table-column>-->
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button @click="$router.push({name:'publish-look', query: {id: scope.row.productId}})" type="text" size="small">详情</el-button>
						<el-button type="text" size="small" @click="$router.push({name:'publish-add', query: {type:1,id: scope.row.productId}})">更新</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
		</el-card>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, getExportFile, deleteData } from '@/utils/common'
	import YearTerm from '../common/yearterm'
	import YearTermForm from '../common/yearterm-form'
	import Grade from '../common/grade'
	export default {
		name: 'exportExcel',
		data() {
			return {
				keywords:'',
				list: null,
				appSearchList: [],
				applicationId:'',
				listLoading: true,
				schoolType: '',
				classTotal: 1,
				dataList: null,
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: true,
				form: {
					gradeId: '',
					schoolClassTypeIdList: [],
					schoolYearId: '',
					termId: '',
					classList: []
				},
				sectionOptions: null,
				sTypeOptions: null,
				showReviewer: false,
				dialogFormVisible: false,
				dialogStatus: '',
				textMap: {
					update: '编辑',
					create: '添加',
					look: '查看'
				},
				dialogPvVisible: false,
				pvData: [],
				addLoading: false,
				rules: {
					//      classList: [{ required: true, message: '不能为空', trigger: 'blur' }],
					//      gradeId: [{ required: true, message: '不能为空', trigger: 'change' }]
				}
			}
		},
		components: {
			YearTerm,
			YearTermForm,
			Grade
		},
		watch: {
			keywords(val) {
				this.getDataList()
			}
		},
		mounted() {
			var that = this
			getCommHttpData({
				url: 'application/list',
				method: 'post',
				contentType: 2,
				data: {}
			}, function(data) {
				if(data && data.code === 0) {
					that.appSearchList = data.list
				}
			})
			this.getDataList();
		},
		methods: {
			getDataList() {
				this.dataListLoading = true
				var that = this
				let keywords = this.keywords.length == 0 ? undefined : this.keywords
				let applicationId = this.applicationId.length == 0 ? undefined : this.applicationId
				getCommHttpData({
					url: 'application/product/list',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						sidx: "",
						order: "",
						keywords: keywords,
						applicationId:applicationId
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length==0 && that.pageIndex !=1){
							that.pageIndex =1
							that.getList()
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
			resetTemp() {
				this.form.gradeId = ''
				this.form.schoolClassTypeIdList = []
				this.form.classList = []
			},
			handleCreate() {
				this.dialogStatus = 'create'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.$refs.yearTermForm.yearTermDis = false
					this.$refs.grade.disabled = false
					this.form.schoolYearId = this.$refs.yearTermForm.getInitData()
					this.resetTemp()
					this.classTotal = 1
					this.$refs['dataForm'].clearValidate()
				})

			},
			handleLook(row) {
				let form = Object.assign({}, row)
				this.$router.push({name:'pulish-add',params:form})
			},
			handleUpdate(row) {
				let form = Object.assign({}, row)
				this.$router.push({name:'pulish-add',params:form})
			},
			deleteData(delJson) {
				var that = this
				deleteData(this, {
					url: 'cms/classMge/del',
					method: 'post',
					serverType: 1,
					contentType: 1,
					operateType: 1,
					data: delJson
				}, function(data) {
					that.dialogFormVisible = false
					that.getDataList()
				})
			},
			changeSatus(id, status) {
				var that = this
				getCommHttpData({
					url: `application/product/updateStatus`,
					method: 'post',
					contentType: 1,
					data: {
						productId: id
					}
				}, function(data) {
					that.getDataList()
				})
			}
		}
	}
</script>