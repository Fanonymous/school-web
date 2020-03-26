<template>
	<div class="mod-config">
		<el-card :loading="addLoading">
			<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="0px" style="min-height: 500px;">
				<div>
					<el-form-item class="first-input">
						<label class="user-input-label"> 序号</label>
					</el-form-item>
					<el-form-item class="user-input user-input-nolabel">
						<label class="user-input-label"><font color="#DD0000">*</font> 用户名
							<el-tooltip class="item" effect="dark" content="1-18位非纯数字组合" placement="top-end">
							<i class="el-icon-question" style="font-size: 16px;color: #CCCCCC;cursor: pointer;"></i>
						</el-tooltip>
						</label>
					</el-form-item>
					<el-form-item class="user-input user-input-nolabel">
						<label class="user-input-label"><font color="#DD0000">*</font> 姓名</label>
					</el-form-item>
					<el-form-item class="user-input user-input-nolabel">
						<label class="user-input-label">手机号</label>
					</el-form-item>
					<el-form-item class="user-input user-input-nolabel">
						<label class=""><font color="#DD0000">*</font> 机构（可多选）</label>
					</el-form-item>
				</div>
				<template :inline="true" v-for="(domain, index) in dataForm.userList">
					<el-form-item  class="first-input">
						{{index+1}}
					</el-form-item>
					<el-form-item  :prop="'userList.' + index+ '.' +'username'" :rules="[{ required: true, message: '用户名不能为空', trigger: 'blur' },{min:1,max:18,message: '用户名长度不能大于18个字符'},{ validator: checkUserDuplication, trigger: 'blur' }]" class="user-input">
						<el-input v-model.trim="domain.username" placeholder="请输入用户名" ></el-input> <!--@blur="checkUserDuplication(domain.username,index)"-->
					</el-form-item>
					<el-form-item :prop="'userList.' + index + '.' +'fullName'" :rules="[{ required: true, message: '姓名不能为空', trigger: 'blur' },{min:1,max:20,message: '姓名长度不能大于20个字符'}]" class="user-input user-input-nolabel">
						<el-input v-model.trim="domain.fullName" placeholder="请输入姓名"></el-input>
					</el-form-item>
					<!--{ required: true, message: '手机号不能为空', trigger: 'blur' },-->
					<el-form-item :prop="'userList.' + index+ '.' + 'mobile'" :rules="[{validator: checkPhone, trigger: 'blur' },{ validator: checkPhoneDuplication, trigger: 'blur' }]" class="user-input user-input-nolabel">
						<el-input v-model.trim="domain.mobile" placeholder="请输入手机号"></el-input>
					</el-form-item>

					<el-form-item class="user-input user-input-nolabel" :prop="'userList.' + index+ '.' + 'deptCheckList'" :rules="[{required: true, message: '机构不能为空', trigger: 'change' }]">

						<!-- <el-input :readonly="true" placeholder="机构" v-popover:popover  style="cursor: pointer;" v-model.trim="domain.deptCheckList"></el-input>
						<el-popover
							ref="popover" :visible-arrow="false"
							placement="bottom-start"
							width="200"
							height="300"
							trigger="click">
							<el-tree node-key="deptId" show-checkbox default-expand-all check-strictly empty-text="暂无数据" :props="defaultProps" :highlight-current=true :expand-on-click-node="true" 
								:data="selfDeptList" :default-checked-keys="defaultKeys" :filter-node-method="filterNode" @check-change="selectClassfy(index)" class="width-tree selectTree-input object-tree-select" style="min-width:200px"  ref="selectTree">
							</el-tree>
						</el-popover> -->

						<el-popover
						  placement="bottom-start"
						  width="200"
						  height="500"
						  trigger="click">
						  <el-tree node-key="deptId" show-checkbox default-expand-all check-strictly empty-text="暂无数据" :props="defaultProps" :highlight-current=true :expand-on-click-node="true" 
							:data="selfDeptList" :default-checked-keys="defaultKeys" :filter-node-method="filterNode" @check-change="selectClassfy(index)" class="width-tree selectTree-input object-tree-select" style="min-width:200px;height: 400px;"  ref="selectTree">
						  </el-tree>
						  <el-input style="cursor: pointer;" slot="reference"  :readonly="!!domain.deptCheckList" placeholder="机构" class="width-tree selectTree-input" v-model.trim="domain.deptCheckList" ></el-input>
						</el-popover>


					</el-form-item>
					<el-button @click.prevent="removeDomain(domain)" type="danger" size="mini" icon="el-icon-delete" circle v-if="dataForm.userList.length>1"></el-button>
					<el-button @click.prevent="removeDomain(domain)" type="info" size="mini" icon="el-icon-delete" circle v-else></el-button>
					<br />
				</template>
				<div class="button">
						<P style="padding-left: 41%;margin-top: 0;">
							<el-button type="primary" icon="el-icon-plus" circle @click="addDomain"></el-button>
						</P>
				</div>
				<el-form-item style="padding-left: 80px;">
					<el-button type="primary" @click="dataFormSubmit">确定</el-button>
					<el-button @click="$router.push({name:'user-user'})">取消</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>
<style>
	.selectTree-input input{
		cursor: pointer !important;
	}
	.user-input-label {
		display: inline-block;
		/*width: 20%;*/
		text-align: center;
		color: #606266;
	}
	.user-input-label1 {
		display: inline-block;
		width: 20%;
		text-align: center;
		color: #606266;
	}
	.user-input {
		display: inline-block;
		width: 18%;
	}
	.first-input {
		display: inline-block;
		width: 80px;
	}
	.el-popover{
		padding: 0px !important;
	}
	.user-input-nolabel .el-form-item__content {
		margin-left: 0px !important;
	}
	.user-input .el-popper{
		background: transparent !important;
		border: none !important;
		box-shadow: none;
		-webkit-box-shadow:none;
	}
	.user-input .object-tree-select {
		left: 0px;
		top: -10px;
	}
</style>
<script>
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	import { isEmail, isMobile } from '@/utils/validate'
	export default {
		data() {
			var validateUserName = (rule, value, callback) => {
				callback(new Error('确认密码与新密码不一致'))
//		        if (this.dataForm.validateUserName !== value) {
//		          callback(new Error('确认密码与新密码不一致'))
//		        } else {
//		          callback()
//		        }
		      }
			return {
				addLoading:false,
				filterText: '',
				deptIdList: [],
				orgData: [],
				defaultProps: {
					children: 'children',
					label: 'name',
				},
				dataForm: {
					userList: [{
						username: '',
						fullName: '',
						mobile: '',
						isShowSelect:false,
						deptCheckList:''
					}]
				},
				dataRule: {},
				durableYearsList: [],
				brandIdList: [],
				fileList: [],
				keywords: '',
				selfDeptList: [],
				selectDept: [],
				isShowSelect: false,
				defaultKeys:[]
			}
		},
		mounted() {
			getCommonDictByType(this, 'user_type', 'userTypeList')
			this.getDeptList()
			this.getDataInfo()
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},
		methods: {
			//获得机构类型
			getDeptList() {
				let that = this
				getCommHttpData({
					url: 'uc/dept/select',
					method: 'post',
					contentType: 2,
					data: {}
				}, function(data) {
					that.selfDeptList = data.deptList
					that.dataForm.userList[0].deptCheckList = that.selfDeptList[0].name;
				    that.dataForm.userList[0].deptIdList = that.selfDeptList[0].deptId;
				    that.defaultKeys = [that.selfDeptList[0].deptId]
				})
			},
			selectClassfy(index, node) {
				let deptTemp = this.$refs.selectTree[index].getCheckedNodes()
				let tempList = []
				let tempIdList = []
				for(let i in deptTemp){
					tempList.push(deptTemp[i].name)
					tempIdList.push(deptTemp[i].deptId)
				}
				this.selectDept.push({
					deptId: deptTemp[0].deptId,
					deptType: deptTemp[0].deptType
				})
				//this.dataForm.userList[index].isShowSelect = false;
				this.dataForm.userList[index].deptCheckList = tempList.toString();
				this.dataForm.userList[index].deptIdList = tempIdList;
				
			},
			changeSelectTree(index,optype) {
				
				if(optype == 1){
					this.dataForm.userList[index].isShowSelect = true;
				}else{
					this.dataForm.userList[index].isShowSelect = false;
				}
			},
			// 选择器的树节点
			filterNode(value, data) {
				if(!value) return true;
				return data.label.indexOf(value) !== -1;
			},

			//			filterNode(value, data) {
			//				if(!value) return true;
			//				return data.name.indexOf(value) !== -1;
			//			},
			handleNodeClick(index) {
				//console.log(this.$refs.tree.getCheckedKeys())
				//this.deptIdList = this.$refs.tree.getCheckedKeys()
				//this.dataForm.userList[index]['deptIdList'] = this.$refs.tree.getCheckedKeys()
				//this.dataForm.userList[index]['deptIdList'] = ['1']
			},
			removeDomain(item) {
				var index = this.dataForm.userList.indexOf(item)
				
				if(this.dataForm.userList.length>1) {
					this.dataForm.userList.splice(index, 1)
				}else{
				}
			},
			addDomain() {
				this.dataForm.userList.push({
					username: '',
					fullName: '',
					mobile: '',
                    deptCheckList:this.selfDeptList[0].name,
                    deptIdList : this.selfDeptList[0].deptId
				});
				// this.defaultKeys = [this.selfDeptList[0].deptId]
				// this.dataForm.userList[this.dataForm.userList.length-1].deptIdList = this.selfDeptList[0].deptId;
			},
			getDataInfo() {
				var that = this
				getCommHttpData({
					url: 'uc/dept/deptList',
					method: 'post',
					contentType: 2,
					data: {
						name: ''
					}
				}, function(data) {
					if(data && data.code === 0) {
						that.orgData = data.deptList
					} else {
						that.dataList = []
						that.totalPage = 0
					}
				})
			},

			dataFormSubmit() {
				//提交
				for(let i in this.dataForm.userList) {

				}
				//this.dataForm.deptIdList = this.$refs.tree.getCheckedKeys()
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						var that = this
						that.addLoading = true
						getCommHttpData({
							url: 'uc/user/save',
							method: 'post',
							contentType: 2,
							data: {
								userType: this.dataForm.userType,
								deptIdList: this.dataForm.deptIdList,
								users: this.dataForm.userList
							}
						}, function(data) {
							that.addLoading = false
							that.$alert(`共${data.total}条，成功${data.success}条，失败${data.faild}条。默认密码是123456。`, '系统提示', {
					          confirmButtonText: '确定',
					          callback: action => {
					            that.$router.push({name: 'user-user'})
					          }
					       });
						})
					}
				})
			},
			//验证重名
			checkUserDuplication(rule, value, callback){
				var that = this
        if(value.indexOf('@') >-1){
          callback(new Error('1-18位非纯数字组合，不包含@字符'))
        }
        //验证是否是纯数字
        var reg = new RegExp("^[0-9]*$");
        if(reg.test(value)){
          callback(new Error('1-18位非纯数字组合'))
        }

				getCommHttpData({
					url: 'uc/user/checkUnique',
					method: 'post',
					contentType: 2,
					data: { 
						username: value
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.msg != 'success'){
							callback(new Error(data.msg))
						}else{
							callback()
						}
					}
				})
			},
			checkPhone(rule, value, callback){
				if (!!value && !isMobile(value)) {
						callback(new Error('请输入正确的手机号'))
					  } else {
						callback()
					  }
			},
			checkPhoneDuplication(rule, value, callback){
				var that = this
				// if(value == ''){
				// 	callback()
				// }
		
				getCommHttpData({
					url: 'uc/user/checkUnique',
					method: 'post',
					contentType: 2,
					data: { 
						mobile: value
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.msg != 'success'){
							callback(new Error(data.msg))
						}else{
							callback()
						}
					}
				})
			}
		}
	}
</script>
