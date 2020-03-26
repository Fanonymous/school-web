<template>
	<div class="mod-config">
		<el-card class="blue-shadow">
			<el-form :inline="true" @keyup.enter.native="getDataList()">
				<el-form-item>
					<el-select  placeholder="请选择用户身份" class="filter-item" v-model="userType" clearable @change="getDataList">
						<el-option v-for="item in deptTypeList" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			
				<!--<el-form-item>
					<el-input v-model="keywords" placeholder="请选择机构" clearable></el-input>
				</el-form-item>-->
				<el-form-item v-clickoutsides:exactAreaClassName="closeTree">
					<div v-popover:popover>
						<el-input placeholder="请选择机构" readonly class="dep-chose-input" :class="{'show-border-color-input' : isShowSelect}"  auto-complete="off" v-model="deptNameSelect" @click.native="changeSelectTree()"></el-input>
						<span :class="[{'show-border-color' : isShowSelect}, inputIcon]" class="exactAreaClassName arrow-iconmy" @click="openTree"></span>
					</div>
					  <el-popover style="padding: 0;" ref="popover" placement="bottom-start" trigger="click">
						<div class="search-tree exactAreaClassName el-popper">
							<el-input v-model="treeSearchValue" placeholder="请选择机构名称查询" clearable auto-complete="off" style="padding: 5px 10px;"></el-input>
							<el-tree style="min-width: 200px;" :check-strictly="true" node-key="deptId" @node-click="nodeClick" show-checkbox default-expand-all empty-text="暂无数据" :props="defaultProps" :highlight-current=true
								:expand-on-click-node="true" :data="selfDeptList" :filter-node-method="filterNode" @check-change="selectClassfy" class="width-tree selectTree-input" ref="selectTree">
							</el-tree>
						</div>
					  </el-popover>
				</el-form-item>
				<!-- <el-form-item>
					<el-select  placeholder="请选择角色" class="filter-item" v-model="roleId" clearable @change="getDataList">
						<el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId">
						</el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item>
					<el-select class="filter-item" v-model="enableType" clearable @change="getDataList" placeholder="请选择启用状态">
						<el-option v-for="item in enableTypeList" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="keywords" placeholder="请输入用户名/姓名/身份证号查询" @input="getDataList" style="width:260px" clearable>
					</el-input>
				</el-form-item>
				<el-form-item>
      	<el-button type="primary" @click="$router.push({name:'user-add', params: {id: ''}})">添加用户</el-button>
      </el-form-item>
				<el-form-item>
					<el-button type="danger" @click="changeStatus(0,1)">禁用</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="changeStatus(0,0)">启用</el-button>
				</el-form-item>
				
				<!-- <el-form-item>
					<el-button type="primary" @click="addOrUpdateHandle()">分配角色</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="exportFile()">{{$t('table.downLoad')}}</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="dataList" border v-loading="dataListLoading" :span-method="objectSpanMethod" @selection-change="selectionChangeHandle" style="width: 100%;">
				<el-table-column type="selection" header-align="center" align="center" width="50">
				</el-table-column>
				<el-table-column
			        prop="id"
			        header-align="center"
			        align="center"
			        width="80"
			        label="序号">
			        <template slot-scope="scope">
			          {{scope.$index+1+pageSize*(pageIndex-1)}}
			        </template>
			      </el-table-column>
				<el-table-column header-align="center" align="center" width="80" label="用户名">
					<template slot-scope="scope">
			          <router-link :to="{name:'userinfo-user',query:{id:scope.row.userId}}">
						  <span style="font-size: 14px;color: #3C85EE;">
							  {{scope.row.username}}
						  </span>
					  </router-link>
			        </template>
				</el-table-column>
				<el-table-column prop="fullName" header-align="center" align="center" label="姓名">
				</el-table-column>
				<el-table-column prop="mobile" header-align="center" align="center" label="手机号">
				</el-table-column>
				<!-- <el-table-column prop="userNum" header-align="center" align="center" label="身份证号">
				</el-table-column> -->
				<el-table-column prop="userTypeName" header-align="center" align="center" label="用户身份">
				</el-table-column>
				<el-table-column prop="deptName" header-align="center" align="center" label="所属机构">
				</el-table-column>
				<el-table-column prop="roleName" header-align="center" align="center" label="角色">
				<template slot-scope="scope">
					<span v-if="scope.row.roleName != null"><router-link :to="{name:'user-org-authorize',query:{id:scope.row.userId,name:scope.row.username}}"><span style="color: #3C85EE;">{{scope.row.roleName}}</span></router-link></span>
					<span v-else style="color:red">暂无角色</span>
				</template>
			</el-table-column>
				<el-table-column prop="status" header-align="center" align="center" label="是否启用">
					<template slot-scope="scope">
						<!--禁用-->
						<el-switch  active-text="是" :width="50" inactive-text="否"  v-model="scope.row.status" active-color="#13ce66" :active-value="0" :inactive-value="1" @change="changeStatus(scope.row.userId,scope.row.status,scope.row.userType)">
							  <!--启用-->
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" max-width="150" label="操作">
					<template slot-scope="scope">
						<!--<el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.userId)">详情</el-button>-->
						<!-- <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">分配角色</el-button> -->
						<el-button type="text" size="small" class="btn-text-color-red"  @click="passwordHandle(scope.row.userId)">重置密码</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
		</el-card>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, deleteData, getExportFile } from '@/utils/common'
	import AddOrUpdate from './user-auth'
import { deprecate } from 'util';
import { truncate } from 'fs';
	export default {
		data() {
			return {
				deptType: undefined,
				deptTypeList: [],
				enableTypeList: [],
				deptId:'',
				userType: '',
				enableType: '',
				status:'',
				keywords: '',
				roleId: '',
				roleList: [],
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				dataListSelections: [],
				addOrUpdateVisible: false,
				deptNameSelect:'',
				deptIdSelect:'',
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
			keywords(val) {
				//this.getDataList()
			},
			deptIdSelect(){
				//this.getRoleList()
				this.getDataList()
			},
		},
		components: {
			AddOrUpdate
		},
		mounted () {
			let that = this
			this.getDeptList()
			//this.getRoleList()
			//getCommonDictByType(this, 'dept_type', 'deptTypeList')
			getCommHttpData({
				url: 'uc/user/getUserType',
				method: 'get',
				contentType: 1,
				data: {}
			}, function(data) {
				that.deptTypeList = data.list
				getCommonDictByType(that, 'enable_type', 'enableTypeList',function(){
					
					let tempType = that.$route.query.userType
					that.userType = tempType != undefined?tempType:''
					if(tempType != undefined){
						that.enableType = parseInt(that.$route.query.enableType)
						that.getDataList()
					}
				})
			})
			
			if(this.$route.query.userType == undefined){
				this.getDataList()
			}
		},
		methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
          return {
                rowspan: row.count,
                colspan: 1
          }
        }
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

			getRoleList(){
				var that = this
				getCommHttpData({
					url: 'uc/role/select',
					method: 'get',
					contentType: 1,
					data: {userType:this.userType,deptId:this.deptIdSelect}
				}, function(data) {
					that.roleList = data.list
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

			// 获取数据列表
			getDataList() {
				this.dataListLoading = true
				var that = this
				let deptIdSelect = this.deptIdSelect.length == 0 ? undefined : this.deptIdSelect
				let userType = this.userType.length == 0 ? undefined : this.userType
				let enableType = this.enableType.length == 0 ? undefined : this.enableType
				let keywords = this.keywords.length == 0 ? undefined : this.keywords
				let roleId = this.roleId.length == 0 ? undefined : this.roleId
				
				getCommHttpData({
					url: 'uc/user/list',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						keywords: keywords,
						deptIds: deptIdSelect,
						status: enableType,
						userTypes: userType,
						roleId:roleId
					}
				}, function(data) {
					 if(data && data.code === 0) {
					 	if(data.page.list.length==0 && that.pageIndex !=1){
							that.pageIndex = 1
							that.getDataList()
						}
            let tempArr = []
            data.page.list.forEach((item,index)=>{
              let count = 0
              let countArr = data.page.list.filter(itemt=>item.userId == itemt.userId)
              count = countArr.length
              if(index >0 && item.userId == data.page.list[index-1].userId){
                count = 0
              }
              data.page.list[index].count = count
            })

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
			// 授权
			addOrUpdateHandle(userInfo) {
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					let userList = this.dataListSelections
					
		        	if(userList.length==0 && userInfo == undefined){
		        		this.$message({
				            message: '请选择用户',
				            type: 'error'
			            })
		        		return;
		        	}
		        	//不同身份不能一起授权
					if(userInfo != undefined){
						userList = [userInfo]
					}
					let isDis = false
					if(userList.length >0){
						let temUserType = userList[0].userType
						for(let i in userList){
							if(temUserType != userList[i].userType){
								isDis = true
								break
							}
						}
					}
					if(isDis){
						this.$message({
				            message: '请选择相同用户身份的用户',
				            type: 'error'
			            })
						return
					}
		        	this.$refs.addOrUpdate.init(userList)
		        })
			},
			// 删除
			deleteData(delJson) {
				var that = this
				deleteData(this, {
					url: 'sys/role/delete',
					method: 'post',
					serverType: 2,
					contentType: 2,
					operateType: 1,
					data: delJson
				}, function(data) {
					that.dialogFormVisible = false
					that.getDataList()
				})
			},
			//下载文件
			exportFile() {
				getExportFile(this, 'uc/user/exportFile', {
					userId:this.GLOBAL.getUserId(),
					curUserType:this.GLOBAL.getUserType(),
					deptIds: this.deptIdSelect.length == 0 ? '' : this.deptIdSelect,
					userType: this.userType.length == 0 ? '' : this.userType,
					status: this.enableType.length == 0 ? '' : this.enableType,
					keywords: this.keywords.length == 0 ? '' : this.keywords,
					roleId: this.roleId.length == 0 ? '' : this.roleId
				})
			},
			//修改状态
			changeStatus(id,status,userType) {
				var that = this
				
				let tempArr = new Array()
				let selArr = this.dataListSelections
				let dataStatus={}
				if(id ==0 && selArr.length == 0){
					this.$message({
		             	message: '请选择用户',
		            	type: 'error'
		            })
					return
				}
				if(id ==0){
					for(let i in selArr){
						tempArr.push({userId:selArr[i].userId,userType:selArr[i].userType})
					}
					dataStatus = {userIds:tempArr}
				}else{
					dataStatus = {userIds:[{userId:id,userType:userType}]}
				}
				getCommHttpData({
					url: `uc/user/${status==0 ?'enable':'disable'}`,
					method: 'post',
					contentType: 2,
					data: dataStatus
				}, function(data) {
					that.getDataList()
				})
			},
			//重置密码
			passwordHandle(id) {
				var that = this
				deleteData(that, {msg:'您确定重置密码吗？',delJson:{
					url: 'uc/user/resetpw',
					method: 'get',
					contentType: 1,
					operateType: 2,
					data: {userId:id}
				}}, function(data) {
					that.getDataList()
				})
			}

		}
	}
</script>
<style lang="scss" scoped>
.search-tree{
	min-width: 380px;
	// z-index: 9999;
	background-color: #fff;
	// position: absolute;
	overflow: auto;
	border: 1px solid #ddd;
	line-height: normal;
	max-height: 300px;
	// top: 40px;
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
	border-color: #3C85EE;
}
.show-border-color-input{
	/deep/ input{
		border-color: #3C85EE;
	}
}
a:focus, a:hover {
    color: #3C85EE;
    text-decoration: underline;
}
</style>
