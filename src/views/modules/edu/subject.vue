<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="app-container">
		<el-card class="blue-shadow">
			<el-row>
				<el-input v-model="keywords" @input="getList" style="width:300px" placeholder="请输入科目名称搜索"></el-input>
				<el-button class="fr" style='margin-bottom:20px;float: right;' type="primary" @click="handleCreate" :loading="false">添加科目</el-button>
			</el-row>
			<el-table :data="list" v-loading="listLoading" border fit highlight-current-row>
				<el-table-column align="center" type="index" label='序号' width="95">
					 <template slot-scope="scope">
			          {{scope.$index+1+pageSize*(pageIndex-1)}}
			        </template>
				</el-table-column>
				<el-table-column align="center" prop="subjectName" label="科目名称">
				</el-table-column>
				<el-table-column align="center" prop="tagNames" label="科目类型">
				</el-table-column>
      <el-table-column align="center" prop="userNames" label="科目组长">
      </el-table-column>
				
				<el-table-column align="center" label="是否启用">
					<template slot-scope="scope">
						<el-switch active-text="是" :width="50" inactive-text="否"  v-model="scope.row.status" active-color="#13ce66" :active-value="0" :inactive-value="1" @change="changeSatus(scope.row)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
						<el-button type="text" :title="scope.row.schoolId ==0 ? '国家科目不可删除':''" :disabled="scope.row.schoolId ==0" style="color:#f56c6c" size="small" @click="deleteData(scope.row.subjectId)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
		</el-card>
		<!--删除-->
		<el-dialog title="删除" :visible.sync="dialogDelete" width="460px">
			<div style="font-size:16px;margin-top:-20px;margin-bottom: 20px;">您确定删除此科目吗?</div>
			<div style="font-size:12px;margin-bottom: 20px;color: #9c9c9c;"><i class="el-icon-warning" style="color: red"></i>&nbsp;删除后会同时删除科目相关的任课老师、课表、科目成绩等信息。</div>
			<div><el-checkbox v-model="isChecked"><span style="font-size: 12px;;">我已知晓</span></el-checkbox></div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogDelete=false">取消</el-button>
				<el-button type="primary" :disabled="!isChecked" @click="submitDelete">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="100px">
				<el-form-item label="科目名称" prop="subName">
					<el-input v-model="temp.subName"  placeholder="请输入科目名称" :disabled="mainDisabled" maxlength="10"></el-input>
					<div v-if="mainDisabled">注：国家科目，不可编辑名称</div>
				</el-form-item>
        <el-form-item label="科目组长" prop="index">
        	<el-select class="margin-bottom-10" v-model="temp.userIds" multiple remote reserve-keyword :remote-method="getTeacherList" filterable :loading="techerLoading" clearable placeholder="请选择教师">
        	  <el-option v-for="(item,index) in teacherList" :key="item.userId" :label="item.teacherName" :value="item.userId">
        	  </el-option>
        	</el-select>
        	<div>年级科目组长请到<router-link :to="{name:'edu-teaching-duty-sub'}"><span style="color: #3C85EE;">【教学职责管理】</span></router-link>页添加</div>
        </el-form-item>
				<el-form-item label="分类" prop="orderBy">
					<el-tag :key="tagId" v-for="tag in applicationTags" :disabled="isDisabled" closable :disable-transitions="false" @close="handleClose(tag)">
						{{tag.tagValue}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible" :disabled="isDisabled" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" :disabled="isDisabled" @click="addOrUpdateHandle">+ 添加</el-button>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible=false">取消</el-button>
				<el-button type="primary" v-if="dialogStatus=='create'" @click="createData"  :loading="addLoading">确定</el-button>
				<el-button type="primary" v-else-if="dialogStatus=='update'" @click="updateData"  :loading="addLoading">确定</el-button>
				
				
			</div>
		</el-dialog>
		<!-- 弹窗, 新增 / 修改 -->
		<label-dialog  tagLabelName="科目" v-if="addOrUpdateVisible" ref="labelDialog" @labelList="labelList"></label-dialog>
	</div>

</template>

<script>
	import { getCommHttpData, getCommonDictByType, getExportFile, deleteData } from '@/utils/common'
	import GLOBAL from '@/api/global'
	import LabelDialog from './label-dialog'
	export default {
		data() {
			return {
				isChecked:false,
				dialogDelete: false,
				deleteId:'',
				userType: GLOBAL.userType,
				schoolId:this.GLOBAL.getOrgId(),
				list: null,
				row:[],
				listLoading: false,
				schoolType: 0,
				gradeIsOptions: null,
				inputVisible: false,
				inputValue: [],
				applicationTags: [],
				isDisabled: false,
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				addOrUpdateVisible: false,
				temp: {
					subjectId: undefined,
					subName: '',
					list: [],
					orderBy: '',
          userIds:[]
				},
				addLoading:false,
				keywords:'',
				value6: true,
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
				tagTemp: [],
				tagName: [],
				mainDisabled:false,
				rules: {
					subName: [
					{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					},
					{ max: 10, message: '科目名称不能超过10个字！', trigger: 'blur' }
					],
				},
        techerLoading:false,
        teacherList:[]
			}
		},
		created() {
			this.getList();
      this.getTeacherList()
		},
		components: {
			LabelDialog
		},
		methods: {
      getTeacherList(query){
        let that = this
        getCommHttpData({
        	url: 'common/queryTeacherList',
        	method: 'get',
        	contentType: 1,
        	data: {schoolId:this.schoolId,keywords:query}
        }, function(data) {
          that.teacherList = data.list
        })
      },
			labelList(val) {
				this.applicationTags = val;
			},
			handleClose(tag) {
				this.applicationTags.splice(this.applicationTags.indexOf(tag), 1);
			},
			showInput() {

			},
			// 新增 / 修改
			addOrUpdateHandle(id) {
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					this.$refs.labelDialog.init(this.applicationTags)
				})
			},
			changeSatus(row){
				let that = this
				getCommHttpData({
					url: 'eduManageSubject/updateStatus',
					method: 'post',
					contentType: 2,
					data: {
						schoolId:row.schoolId,
						subjectId: row.subjectId,
						status:row.status
					}
				}, function(data) {
					that.$message({
						type: 'success',
						message: '操作成功!'
					});
					that.getList()
				})
			},
			getList() {
				//	this.listLoading = true
				let that = this
				let keywords = this.keywords.length == 0 ? undefined : this.keywords
				getCommHttpData({
					url: 'eduManageSubject/list',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						schoolId:this.schoolId,
						keywords: keywords
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndex != 1) {
							that.pageIndex = 1
							that.getList()
						}
						that.list = data.page.list
						that.totalPage = data.page.totalCount
					} else {
						that.dataList = []
						that.totalPage = 0
					}
					that.listLoading = false
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
			resetTemp() {
				this.temp = {
					subjectId: undefined,
					subName: '',
					list: [],
					orderBy: '',
          userIds:[]
				}
			},
			handleCreate() {
				this.resetTemp()
				this.dialogStatus = 'create'
				this.dialogFormVisible = true
				this.temp.subName='';
				this.mainDisabled=false;
				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate()
				})
				this.applicationTags=[]
			},
			handleLook(row) {
				this.temp = Object.assign({}, row) // copy obj
				this.dialogStatus = 'look'
				this.dialogFormVisible = true
			},
			handleUpdate(row) {
				this.resetTemp()
				this.row=row;
				if(row.schoolId== 0){
					this.mainDisabled=true;
				}else{
					this.mainDisabled=false;
				}
				let temp = Object.assign({}, row) // copy obj
        let userArr = []
        if(temp.userIds){
          if(temp.userIds.length>0 &&  temp.userIds.indexOf(',') >0){
            userArr = temp.userIds.split(',')
          }else{
            userArr = [temp.userIds]
          }
        }
				this.dialogStatus = 'update'
				this.temp = {
					subjectId: temp.subjectId,
					subName: temp.subjectName,
					list: [],
					orderBy: temp.orderBy,
          userIds:userArr
				}
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate()
				})
				let that = this;
				getCommHttpData({
					url: 'eduManageSubject/queryById',
					method: 'get',
					contentType: 1,
					data: {
						subjectId: row.subjectId
					}
				}, function(data) {
					that.applicationTags=data.list.tagList
				})
			},
			createData() {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						var tagTemp=[];
						for(let i in this.applicationTags) {
							tagTemp.push({tagId:this.applicationTags[i].tagId})
						}
						let that = this;
						that.addLoading = true
						getCommHttpData({
							url: 'eduManageSubject/save',
							method: 'post',
							contentType: 2,
							data: {
								subjectName: this.temp.subName,
								status: '0',
								tagList: tagTemp,
								schoolId:this.schoolId,
                userIdList:this.temp.userIds
							},
						}, function(data) {
							that.dialogFormVisible = false
							that.addLoading = false
							that.$message({
								type: 'success',
								message: '操作成功!'
							});
							that.getList()
						})
					}
				})
			},
			updateData() {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						var tagTemp=[];
						for(let i in this.applicationTags) {
							tagTemp.push({tagId:this.applicationTags[i].tagId})
						}
						let that = this;
						that.addLoading = true
						getCommHttpData({
							url: 'eduManageSubject/update',
							method: 'post',
							contentType: 2,
							data: {
								subjectId:this.row.subjectId,
								subjectName: this.temp.subName,
								status:this.row.status,
								tagList: tagTemp,
								schoolId:this.row.schoolId,
                userIdList:this.temp.userIds
							},
						}, function(data) {
							that.dialogFormVisible = false
							that.addLoading = false
							that.$message({
								type: 'success',
								message: '操作成功!'
							});
							that.getList()
						})
					}
				})
			},
			submitDelete(){
				let that = this
				getCommHttpData({
					url: 'eduManageSubject/delete?subjectId='+that.deleteId,
						method: 'get',
						contentType: 2,
						operateType: 3,
//						data: {
//							subjectId:that.deleteId
//						}
				}, function(data) {
					if(data.code == 0){
						that.dialogDelete = false;
						that.deleteId = '';
						that.$message({
				        	message: '删除成功',
				        	type: 'success'			       
				    	})
						that.getList()	
					}else{
						that.dialogDelete = false;
						that.deleteId = '';
					}
				})
			},
			deleteData(delJson) {
				this.isChecked= false;
				this.dialogDelete = true;
				this.deleteId = delJson;
//				let that = this;
//				getCommHttpData({
//					url: 'eduManageSubject/checkDelete',
//					method: 'get',
//					contentType: 1,
//					data: {
//						subjectId:delJson
//					},
//				}, function(data) {

//						deleteData(that, {
//						url: 'eduManageSubject/delete',
//						method: 'get',
//						contentType: 1,
//						operateType: 1,
//						data: {
//							subjectId:delJson
//						}
//					}, function(data) {
//						that.getList()
//					})
//				})
				
			}
		}
	}
</script>
<style scoped lang="scss">
	.el-tag+.el-tag {
		margin-left: 10px;
	}
	
	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}
	
	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
</style>