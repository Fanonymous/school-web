<template>
	<el-dialog :title="!dataForm.id ? '选择收件人' : '修改'" :close-on-click-modal="false" :visible.sync="visible" @close="treeLoading = false">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="60px">
			<el-form-item label="" prop="">
				注：收件人为所选机构的全体用户<span class="right"> 已选：{{totalCount}}人</span>
				<div style="border-bottom: 1px #e5e5e5 solid;text-align: right;">
					<!--<el-radio v-model="radio" label="1">本级</el-radio>
		  			<el-radio v-model="radio" label="2">本级和下级</el-radio>-->
					<!--<el-tooltip class="item" effect="dark" content="所选机构的本身用户。本级和下级：所选机构的本身和所有下级用户" placement="top-end">
					      <i class="el-icon-question" style="font-size: 16px;color: #17B3A3;cursor: pointer;"></i>
					   </el-tooltip>-->
				</div>
			</el-form-item>

			<el-form-item label="" style="height: 300px;overflow: auto;" v-loading="treeLoading">
				<el-checkbox class="margin-bottom-10" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
				<!--<el-input placeholder="请选择机构" dataTree = "tree" clearable auto-complete="off" v-model="deptNameSelect" @click.native="changeSelectTree()">
			</el-input>-->
				<el-tree v-if="radio == 1" :default-expanded-keys="expandKeys" node-key="deptId" @node-click="nodeClick" show-checkbox :default-expand-all=false check-strictly empty-text="暂无数据" :props="defaultProps" :highlight-current=true :expand-on-click-node="true" :data="deptList" :filter-node-method="filterNode" @check-change="selectClassfy" ref="selectTree">
				</el-tree>
				<el-tree v-else node-key="deptId" @node-click="nodeClick" show-checkbox :default-expand-all=false empty-text="暂无数据" :props="defaultProps" :highlight-current=true :expand-on-click-node="true" :data="deptList" :filter-node-method="filterNode" @check-change="selectClassfy" ref="selectTree">
				</el-tree>
			</el-form-item>
			<el-form-item label="用户" prop="userTypes" v-if="userTypeOptions.length > 1">
				<el-checkbox-group v-model="dataForm.userTypes" @change="userTypeChange">
					<el-checkbox v-for="item in userTypeOptions" :key="item.userType" :label="item.userType" :value="item.userType">{{item.userTypeName}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
		</el-form>

		<span slot="footer" class="dialog-footer">
      <el-button @click="visible = false,treeLoading=false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
	</el-dialog>
</template>

<script>
	import { getCommHttpData, getCommonDictByType } from '@/utils/common'
	export default {
		data() {
			return {
				checkAll: false,
				visible: false,
				userTypeOptions: [],
				dataForm: {
					userTypes: [],
				},
				userTypesAll:[],
				dataRule: {
					userTypes: [{
						required: true,
						message: '请选择用户',
						trigger: 'change'
					}]
				},
				radio: '1',
				totalCount: 0,
				deptCheckList: [],
				defaultProps: [],
				deptList: [],
				defaultProps: {
					children: 'childrenDept',
					label: 'deptName',
				},
				treeLoading: false,
				userType: '',
				getNodeList:[],
				expandKeys:[]
			}
		},
		watch: {
			deptNameSelect(val) {
				this.$refs.selectTree.filter(val);
			}
		},
		mounted() {
			//getCommonDictByType(this, 'user_type', 'userTypeOptions')

		},
		methods: {

			//获得机构
			getDeptList() {
				var that = this
				that.treeLoading = true
				getCommHttpData({
					url: 'message/getDeptChildList',
					method: 'post',
					contentType: 2,
					data: {
						userType: this.userType
					}
				}, function(data) {
					that.deptList = data.list
					that.getDeptIdNodeList(data.list)
					that.treeLoading = false
					that.expandKeys=[data.list[0].deptId]
					
				})
			},
//			getDeptIdNodeList({deptId , childrenDept }, array = []){
//				var that = this
//				console.log(deptId)
//				array.push(deptId)
//			    if (childrenDept && childrenDept.length > 0) {
//			        for (let child of childrenDept) {
//			            that.getDeptIdNodeList(child, array)
//			        }
//			    }
//			    return array;
//				
//			},
			
			getDeptIdNodeList(items) {
				  items.forEach(item => {
				    this.getNodeList.push(item.deptId)
				    if (item.childrenDept) {
				      this.getDeptIdNodeList(item.childrenDept)
				    }
				  })
			},
			init(id, userType,isSend,deptIds) {
				//this.dataForm.id = id || 0
				this.visible = true
				this.$nextTick(() => {
					this.userType = userType
					this.getDeptList()
					if(!isSend){
						this.checkAll = false
						this.deptCheckList = []
					    this.dataForm.userTypes = []
					    this.$refs.selectTree.setCheckedKeys([]);
					}else{
						console.log(deptIds)
						this.$refs.selectTree.setCheckedKeys(deptIds)
					}
					this.$refs.dataForm.clearValidate()
				})
			},
			nodeClick() {

			},
			filterNode() {

			},
			//全选
			handleCheckAllChange() {
				this.treeLoading = false
				this.dataForm.userTypes = []
				if(this.checkAll){
					this.$refs.selectTree.setCheckedKeys(this.getNodeList);
				}else{
					this.$refs.selectTree.setCheckedKeys([]);
				}
			},
			selectClassfy(index, node) {
				let deptTemp = this.$refs.selectTree.getCheckedNodes()
				this.deptCheckList = deptTemp
				//				let totalCount = 0
				//				this.deptCheckList.forEach(item=>{
				//					totalCount += item.userCount
				//				})
				//				this.totalCount = totalCount
				this.getUserTypeByDeptType()
			},
			//根据机构类型获得机构
			getUserTypeByDeptType() {
				let that = this;
				let deptIds = []
				that.treeLoading = true
				this.deptCheckList.forEach(item => {
					deptIds.push(item.deptId)
				})
				if(deptIds.length == 0) {
					that.totalCount = 0
					that.userTypeOptions = []
					that.treeLoading = false
					return
				}
				getCommHttpData({
					url: 'message/getUserTypeByDeptType',
					method: 'post',
					contentType: 2,
					data: {
						deptIds: deptIds
					}
				}, function(data) {
					that.userTypeOptions = data.list
					let tempType = []
					data.list.forEach(item => {
						tempType.push(item.userType)
					})
					that.userTypesAll = tempType
					that.dataForm.userTypes =tempType
					that.userTypeChange()
					that.treeLoading = false
					that.totalCount = 0
				})
			},
			//用户类型 切换，查询所有的用户总数
			userTypeChange() {
				let that = this;
				let deptIds = []
				this.deptCheckList.forEach(item => {
					deptIds.push(item.deptId)
				})
				if(deptIds.length ==0){
					return
				}
				if(this.dataForm.userTypes.length == 0) {
					that.totalCount = 0
					return
				}
				getCommHttpData({
					url: 'message/getDeptUserNum',
					method: 'post',
					contentType: 2,
					data: {
						deptIds: deptIds,
						sendUserTypes: this.dataForm.userTypes
					}
				}, function(data) {
					that.treeLoading = false
					that.totalCount = data.userNum
				})
			},
			// 表单提交
			dataFormSubmit() {

				if(this.deptCheckList.length == 0) {
					this.$message({
						message: '请选择机构',
						type: 'error'
					})
					return
				}
				if(this.dataForm.userTypes.length == 0) {
					this.$message({
						message: '请选择用户',
						type: 'error'
					})
					return
				}

				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						this.visible = false
						this.$emit('refreshDataList', {
							sendUserType: this.dataForm.userTypes,
							deptCheckList: this.deptCheckList,
							totalCount: this.totalCount
						})
					}
				})

			}
		}
	}
</script>