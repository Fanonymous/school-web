<template>
	<div class="mod-config">
		<el-card class="blue-shadow">
			<el-form :inline="true" @keyup.enter.native="getDataList()">
				<!--<el-form-item>
					<el-select class="filter-item" v-model="type" clearable @change="getDataList">
						<el-option v-for="item in sTypeOptions" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select class="filter-item" v-model="use" clearable @change="getDataList">
						<el-option v-for="item in sUseOptions" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>-->
				<el-form-item v-clickoutsides:exactAreaClassName="closeTree" v-if="userType != 2">
      	<div>
      		<el-input placeholder="请选择机构" readonly class="dep-chose-input" :class="{'show-border-color-input' : isShowSelect}"  auto-complete="off" v-model="deptNameSelect" @click.native="changeSelectTree()"></el-input>
      		<span :class="[{'show-border-color' : isShowSelect}, inputIcon]" class="exactAreaClassName arrow-iconmy" @click="openTree"></span>
      	</div>
      	<div v-show="isShowSelect" class="search-tree exactAreaClassName">
      		<el-input v-model="treeSearchValue" placeholder="请选择机构名称查询" clearable auto-complete="off" style="padding: 5px 10px;"></el-input>
      		<el-tree style="min-width: 200px;" :check-strictly="true" node-key="deptId" @node-click="nodeClick" show-checkbox default-expand-all empty-text="暂无数据" :props="defaultProps" :highlight-current=true
      			:expand-on-click-node="true" :data="selfDeptList" :filter-node-method="filterNode" @check-change="selectClassfy" class="width-tree selectTree-input" ref="selectTree">
      		</el-tree>
      	</div>
      </el-form-item>
				<el-form-item>
					<el-input v-model="keywords" placeholder="请输入名称搜索" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleCreate" :loading="false">添加角色</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="dataList" ref="table"  border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
				<el-table-column header-align="center" align="center" width="80" label="序号">
					<template slot-scope="scope">
			          {{scope.$index+1+pageSize*(pageIndex-1)}}
			        </template>
				</el-table-column>
				<el-table-column prop="roleName" header-align="center" align="center" label="角色名称">
				</el-table-column>
				<!--<el-table-column prop="roleEname" header-align="center" align="center" label="英文名称">
				</el-table-column>-->
				<el-table-column prop="userTypeName" header-align="center" align="center" label="角色类型">
				</el-table-column>
				<el-table-column prop="order" header-align="center" align="center" label="排序">
				</el-table-column>
				<el-table-column prop="remark" header-align="center" align="center" label="备注">
				</el-table-column>
				<el-table-column header-align="center" align="center" label="角色权限">
					
					<template slot-scope="scope">
						<span v-if="scope.row.menus != null" @click="handleCheck(scope.row)" style="display:inline-block;width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;cursor: pointer;">{{scope.row.menus}}</span>
						<span v-else style="color:red">暂无权限</span>
					</template>
				</el-table-column>
				
				<el-table-column prop="enabled" width="200" header-align="center" align="center" label="是否启用">
					<template slot-scope="scope">
					
						<el-switch active-text="是" :width="50" inactive-text="否" v-if="scope.row.roleType == 1"  v-model="scope.row.enabled" active-color="#13ce66" :active-value="0" :inactive-value="1" @change="changeSatus(scope.row.roleId,scope.row.enabled)">
						</el-switch>
						<el-switch active-text="是" :width="50" inactive-text="否" v-else v-model="scope.row.enabled" active-color="#13ce66" :active-value="0" :inactive-value="1" disabled>
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="handleCheck(scope.row)">详情</el-button>
						<el-button type="text" v-if="scope.row.roleType == 1" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
						<el-button type="text" v-if="scope.row.roleType == 1"  size="small" @click="$router.push({ name:'authorize', query: {id: scope.row.roleId,roleName: scope.row.roleName}})">分配权限</el-button>
						<el-button type="text" v-if="scope.row.roleType == 1" size="small" class="btn-text-color-red" @click="deleteData({roleId:scope.row.roleId})">删除</el-button>
					</template>
				</el-table-column>
				<el-table-column type="expand"  width="1">  
			      <template slot-scope="scope">
			        <el-form label-position="left">
			          <el-form-item label="角色权限">
						<span v-if="scope.row.menus != null">
							<el-tag v-for="item in scope.row.menuNameList">{{item}}</el-tag>
							<!--{{scope.row.menus}}-->
						</span>
						<span v-else style="color:red">未授权</span>
			          </el-form-item>
			        </el-form>
			      </template>
			    </el-table-column>
			</el-table>
			<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
		</el-card>
		<!-- 弹窗, 新增 / 修改 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form :rules="rules" ref="dataForm" :model="form" label-position="right" label-width="100px">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model.trim="form.roleName" placeholder="请输入角色名称" :disabled="isDisabled"></el-input>
				</el-form-item>
				<!--<el-form-item label="英文名称" prop="roleEname">
					<el-input v-model.trim="form.roleEname" placeholder="请输入英文名称" :disabled="isDisabled"></el-input>
				</el-form-item>-->
				<el-form-item label="用户身份" prop="userType" v-if="userType == 2">
					<el-radio-group v-model="form.userType" size="small" :disabled="isDisabled">
						<el-radio v-for="item in userTypeList" :label="item.value" :key="item.value">{{item.dictName}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="排序" prop="order">
					<el-input-number v-model.trim="form.order" :min="0" :disabled="isDisabled"></el-input-number>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" v-model.trim="form.remark" placeholder="请输入备注" :disabled="isDisabled"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button v-if="dialogStatus=='create'" type="primary" @click="saveData(0)" :loading="addLoading">确定</el-button>
				<el-button v-else-if="dialogStatus=='update'" type="primary" @click="saveData(1)" :loading="addLoading">确定</el-button>
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
		</el-dialog>
	</div>
</template>
<style>
	.el-table__expand-column .cell {
	  display: none;
	}
	.el-tag{
		margin-right: 10px;
	}
</style>
<script>
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	import AddOrUpdate from './config-add-or-update'
	export default {
		data() {
			return {
				userType: this.GLOBAL.getUserType(),
				keywords: '',
				userTypeList: [],
				deptTypeList: [],
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				dataListSelections: [],
				form: {
					roleId: undefined,
					roleName: '',
//					roleEname: '',
					userType: '',
					order: '',
					remark: ''
				},
				sectionOptions: null,
				sTypeOptions: null,
				showReviewer: false,
				dialogFormVisible: false,
				dialogStatus: '',
				textMap: {
					update: '角色编辑',
					create: '添加角色',
					look: '角色查看'
				},
				dialogPvVisible: false,
				pvData: [],
				addLoading: false,
				rules: {
					roleName: [{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					}, {
						min: 1,
						max: 20,
						message: '角色名称的长度不能大于20 个字符'
					}],
//					roleEname: [{
//						required: true,
//						message: '不能为空',
//						trigger: 'blur'
//					}, {
//						min: 1,
//						max: 20,
//						message: '英文名称的长度不能大于20 个字符'
//					}],
					userType: [{
						required: true,
						message: '不能为空',
						trigger: 'change'
					}],
					remark: [{
						max: 100,
						message: '备注的长度不能大于100 个字符'
					}],
					order: [{
						validator: this.checkInterNum,
						trigger: 'blur'
					}],
				},
        deptNameSelect:'',
        deptIdSelect:'',
				isDisabled: false,
        isShowSelect:false,
        defaultProps: {
        	children: 'children',
        	label: 'name',
        },
        selfDeptList:[],
        treeSearchValue : '',
        inputIcon : 'el-icon-arrow-down'
			}
		},
		watch: {
      treeSearchValue(val) {
      	this.$refs.selectTree.filter(val);
      },
      deptIdSelect(){
      	this.getDataList()
      },
			keywords(val) {
				this.getDataList()
			}
		},
		mounted() {
			//getCommonDictByType(this, 'user_type', 'userTypeList')
			var that = this
			getCommHttpData({
				url: 'uc/user/getUserType',
				method: 'get',
				contentType: 1,
				data: {}
			}, function(data) {
				that.userTypeList = data.list
			})
      this.getDeptList()
			this.getDataList()
		},
		methods: {
			handleCheck(row) {
		        const $table = this.$refs.table
		        
		        $table.toggleRowExpansion(row)
		        $table.toggleRowSelection(row)
		   },
			getRowClassName({row, rowIndex}){
			
			   if (row.menus == null) {
			       return 'row-expand-cover';
			   }
			},
			// 获取数据列表
			getDataList() {
				this.addLoading = false
				this.dataListLoading = true
				var that = this
				let keywords = this.keywords.length == 0 ? undefined : this.keywords
        let deptIdSelect = this.deptIdSelect.length == 0 ? undefined : this.deptIdSelect
				getCommHttpData({
					url: 'uc/role/list',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						keywords: keywords,
            deptIds: deptIdSelect
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length==0 && that.pageIndex !=1){
							that.pageIndex = 1
							that.getDataList()
						}
						
						
						for(let i in data.page.list){
							let tempArr = []
							if(data.page.list[i].menus){
								if(data.page.list[i].menus.indexOf(',')>-1){
									tempArr = data.page.list[i].menus.split(',')
								}else{
									tempArr = [data.page.list[i].menus]
								}
							}
							data.page.list[i]['menuNameList'] = tempArr
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
			// 多选
			selectionChangeHandle(val) {
				this.dataListSelections = val
			},
			checkInterNum(rule, value, callback) {
				if(value&&value.toString().length > 9) {
					return callback(new Error('请输入1-9位数字'))
				} else {
					callback()
				}
			},
			resetTemp() {
				this.form = {
					roleId: undefined,
					roleName: '',
//					roleEname: '',
					userType: '',
					order: '',
					remark: ''
				}
			},
			handleCreate() {
				this.dialogStatus = 'create'
				this.dialogFormVisible = true
				this.form.userType=''
				this.$nextTick(() => {
					
					this.resetTemp()
					this.isDisabled = false
					this.$refs['dataForm'].clearValidate()
				})

			},
			handleLook(row) {
				this.form = Object.assign({}, row) // copy obj
				this.dialogStatus = 'look'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.isDisabled = true
				})
			},
			handleUpdate(row) {
				this.form = Object.assign({}, row) // copy obj
				this.dialogStatus = 'update'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.isDisabled = false
					this.$refs['dataForm'].clearValidate()
				})
			},
			saveData(optype) {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						var that = this
						that.addLoading = true
						if(optype == 0){
								if(this.userType != 2) {
									this.form.userType = this.userType
								}
						}
						getCommHttpData({
							url: `uc/role/${optype == 0 ?'save':'update'}`,
							method: 'post',
							serverType: 2,
							contentType: 2,
							operateType: 3,
							that: this,
							data: this.form
						}, function(data) {
							that.addLoading = false
							if(data.code == 0){
									that.dialogFormVisible = false
									that.getDataList();
							}
						})
					}
				})
			},
			//修改状态
			changeSatus(id, status) {
				var that = this
				if(status != 0){
					getCommHttpData({
						url: 'uc/role/deleteInfo',
						method: 'get',
						contentType: 1,
						data: {roleId:id}
					}, function(data) {
						if(data.code == 0) {
							if(data.count > 0) {
								data.msg = '已有' + data.count + '个用户使用此角色，禁用后所有数据不可用！您确定禁用吗？'
							} else {
								data.msg = '您确定禁用吗？'
							}
							deleteData(that, {
								msg: data.msg,
								delJson: {
									url:`uc/role/${status == 0 ?'enable':'disable'}`,
									method: 'get',
									contentType: 1,
									operateType: 2,
									data: {
										roleId: id
									}
								}
							}, function(data) {
								that.dialogFormVisible = false
								that.getDataList()
							})
							that.getDataList()
						}
					})
					
				}else{
					getCommHttpData({
						url: `uc/role/${status == 0 ?'enable':'disable'}`,
						method: 'get',
						contentType: 1,
						data: {
							roleId: id
						}
					}, function(data) {
						that.getDataList()
						that.getDataList()
					})
					
					
					
					
				}
	
			},
			// 删除
			deleteData(delJson) {
				var that = this
				var that = this
				getCommHttpData({
					url: 'uc/role/deleteInfo',
					method: 'get',
					contentType: 1,
					data: delJson
				}, function(data) {
					if(data.code == 0) {
						if(data.count > 0) {
							data.msg = '已有' + data.count + '个用户使用此角色，删除后所有数据不可找回！您确定删除吗？'
						} else {
							data.msg = '您确定删除吗？'
						}
						deleteData(that, {
							msg: data.msg,
							delJson: {
								url: 'uc/role/delete',
								method: 'post',
								contentType: 2,
								operateType: 1,
								data: delJson
							}
						}, function(data) {
							that.dialogFormVisible = false
							that.getDataList()
						})
					}
				})
			},
      openTree() {
      	if (this.isShowSelect) {
      		this.closeTree()
      	}else {
      		this.isShowSelect = true
      		this.inputIcon = 'el-icon-arrow-up'
      	}
      },
      closeTree() {
      	this.isShowSelect = false
      	this.inputIcon = 'el-icon-arrow-down'
      },
      getDeptList(){
      	var that = this
      	getCommHttpData({
      		url: 'uc/dept/select',
      		method: 'get',
      		contentType: 1,
      		data: {userType : this.userType}
      	}, function(data) {
      		that.selfDeptList = data.deptList
      	})
      },
      selectClassfy(data, node) {
      	let deptTemp = this.$refs.selectTree.getCheckedNodes(), depName = [], depIds = []
      	if(deptTemp.length == 0){
      		this.deptIdSelect=''
      		this.deptNameSelect = ''
      		return
      	}
      	if (deptTemp.length) {
      		deptTemp.forEach(item => {
      			depName.push(item.name)
      			depIds.push(item.deptId)
      		})
      	}
      	this.deptNameSelect = depName.join(',')
      	this.deptIdSelect = depIds.join(',')
      },

      nodeClick(data, node, self){
      	this.deptIdSelect = data.deptId;
      },

      changeSelectTree() {
      	this.isShowSelect = true;
      	this.treeSearchValue = ''
      	this.inputIcon = 'el-icon-arrow-up'
      },

      // 选择器的树节点
      filterNode(value, data) {
      	if(!value) return true;
      	return data.name.indexOf(value) !== -1;
      },

		}
	}
</script>
<style lang="scss" scoped>
.search-tree{
	min-width: 380px;
	z-index: 9999;
	background-color: #fff;
	position: absolute;
	overflow: auto;
	border: 1px solid #ddd;
	line-height: normal;
	max-height: 300px;
	top: 40px;
}
.search-tree .el-input__suffix{
		right: 10px;
	}
.dep-chose-input{
	width: 220px;
	/deep/ input{
		border-right: 0;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	&:hover +.arrow-iconmy{
		border-color: #c0c4cc;
	}
}
.arrow-iconmy{
	line-height: 34px;
	border: 1px solid #DCDFE6;
	background-color: #fff;
	margin-left: -5px;
	border-left: 0;
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px;
	cursor: pointer;
	color: #C0C4CC;
	padding-right: 5px;
}
.show-border-color{
	border-color: #17B3A3;
}
.show-border-color-input{
	/deep/ input{
		border-color: #17B3A3;
	}
}
</style>
