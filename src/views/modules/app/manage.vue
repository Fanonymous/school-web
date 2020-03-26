<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="app-container">
		<el-card class="blue-shadow">
			<div class="filter-container">
				<el-form :inline="true" @keyup.enter.native="getList()">
					<el-form-item>
						<el-input v-model="keywords" placeholder="请输入名称查询" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="$router.push({name:'app-add', query: {type: 0},params: {id: ''}})">添加应用</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="dataList" v-loading="dataListLoading" border fit highlight-current-row>
				<el-table-column align="center" label='序号' width="95">
					<template slot-scope="scope">
						{{scope.$index+1+pageSize*(pageIndex-1)}}
					</template>
				</el-table-column>
				<el-table-column prop="applicationName" align="center" label="应用名称">
				</el-table-column>
				<el-table-column align="center" label="图标">
					<!--<template slot-scope="scope">
						<i class="'el-'+scope.row.icon"></i>
						<i class="el-icon-delete"></i>
					</template>-->
					<template slot-scope="scope">
						<img :src="imgUrl+scope.row.icon" @click="largeImgMessage(scope.row.icon)" :onerror="defaultImg" width="26px" height="26px" />
					</template>
				</el-table-column>
				<el-table-column prop="applicationSort" align="center" label="应用分类">
				</el-table-column>
				<el-table-column prop="applicationType" align="center" label="应用场景">
				</el-table-column>
				<!--<el-table-column prop="targetUser" align="center" label="目标用户">
				</el-table-column>-->
				<el-table-column prop="createDate" align="center" label="创建日期">
				</el-table-column>
				<el-table-column prop="developer" align="center" label="开发商">
				</el-table-column>
				<el-table-column prop="order" align="center" label="排序">
				</el-table-column>
				<el-table-column align="center" label="操作" width="200px">
					<template slot-scope="scope">
						<el-button @click="handleLook(scope.row)" type="text" size="small">查看</el-button>
						<el-button type="text" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
						<el-button type="text" size="small"  @click="isAppPublish(scope.row.isAll,scope.row.applicationId)">发布应用</el-button>
						<el-button type="text" size="small" class="btn-text-color-red" @click="deleteData({applicationId:scope.row.applicationId},scope.row.appCount)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
		</el-card>
		<!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form :rules="rules" ref="dataForm" :model="formData" label-position="right" label-width="100px">
				<year-term-form ref="yearTermForm"></year-term-form>
				<el-form-item label="应用名称" prop="applicationName">
					<grade ref="grade"></grade>
				</el-form-item>
				<el-form-item label="图标">
					<el-input-number v-model="formData.classTotal" :min="1" :max="50"></el-input-number>
				</el-form-item>
				<el-form-item label="应用分类" prop="applicationType">
					<template v-for="item in classTotal">
						<el-tag style="margin:0px 10px 10px 0px">{{item}}班</el-tag>
					</template>
				</el-form-item>
				<el-form-item label="目标用户">
					<el-input-number v-model="formData.targetUser" :min="1" :max="50"></el-input-number>
				</el-form-item>
				<el-form-item label="应用介绍">
					<el-input-number v-model="formData.introduction" :min="1" :max="50"></el-input-number>
				</el-form-item>
				<el-form-item label="是否免费">
					<el-input-number v-model="formData.isFree" :min="1" :max="50"></el-input-number>
				</el-form-item>
				<el-form-item label="是否可适用">
					<el-input-number v-model="formData.canTry" :min="1" :max="50"></el-input-number>
				</el-form-item>
				<el-form-item label="联系QQ">
					<el-input-number v-model="formData.contactInfo" :min="1" :max="20"></el-input-number>
				</el-form-item>
				<el-form-item label="应用标签">
					<el-tag>3434</el-tag>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="addLoading">确定</el-button>
				<el-button v-else-if="dialogStatus=='update'" type="primary" @click="updateData" :loading="addLoading">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
			<el-table :data="pvData" border fit highlight-current-row style="width: 100%">
				<el-table-column prop="key" label="Channel">取消</el-table-column>
				<el-table-column prop="pv" label="Pv">确定</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false"></el-button>
      </span>
		</el-dialog>-->
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, getExportFile, deleteData } from '@/utils/common'
	export default {
		data() {
			return {
				imgUrl:window.SITE_CONFIG.imgIP,
				defaultImg: 'this.src="' + require('../../../assets/img/all.png') + '";this.onerror = null',
				keywords: '',
				dataList: null,
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: true,
				schoolType: '',
				canTryList: [],
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
		watch: {
			keywords(val) {
				this.getList()
			}
		},
		mounted() {

			this.getList();
		},
		methods: {
			//判断是否发布
			isAppPublish(isPublish,applicationId){
				if(isPublish == 1){
					this.$message({
			            message: '该应用所有终端已发布，请到应用发布中更新',
			            type: 'error'
			        })
				}else{
					this.$router.push({
						name:'publish-add',query:{type:0,applicationId:applicationId}
					})
				}
				
			},
			getList() {
				this.dataListLoading = true
				var that = this
				let keywords = this.keywords.length == 0 ? undefined : this.keywords
				getCommHttpData({
					url: 'application/list',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						sidx: "",
						order: "",
						keywords: keywords
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length==0 && that.pageIndex !=1){
							that.pageIndex = 1
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
				this.getList()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getList()
			},
			handleLook(row) {
				let form = Object.assign({}, row)
				this.$router.push({
					name: 'app-add',
					params: form,
					query: {
						id: form.applicationId,
						type: 2
					}
				})
			},
			handleUpdate(row) {
				let form = Object.assign({}, row)
				this.$router.push({
					name: 'app-add',
					params: form,
					query: {
						id: form.applicationId,
						type: 1
					}
				})
			},

			deleteData(delJson, appCount) {
				var that = this
				let delMsg = parseInt(appCount) == 0 ? '您确认删除吗？' : '此应用已经发布，删除后不可撤销，您确认删除吗？'
				deleteData(this, {
					msg: delMsg,
					delJson: {
						url: 'application/delApp',
						method: 'post',
						contentType: 1,
						operateType: 1,
						data: delJson
					}
				}, function(data) {
					that.dialogFormVisible = false
					that.getList()
				})
			},
			largeImgMessage(imgSrc){
				if(imgSrc == ''){
					return
				}
      	this.$alert('<img src="'+this.imgUrl+imgSrc+'" width="390px" height="auto" onerror="this.src=\"' + require('../../../assets/img/nothing.png') + '\";this.onerror = null" >', '预览', {
          dangerouslyUseHTMLString: true,
          showConfirmButton:false,
          closeOnClickModal:true
        });
      }
		}
	}
</script>