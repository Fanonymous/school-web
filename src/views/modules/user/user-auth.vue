<template>
	<el-dialog :title="!dataForm.id ? '分配角色' : '修改角色'" :close-on-click-modal="false" :visible.sync="visible">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
			<el-form-item label="用户名">
				<el-tag v-for="(user, index) in userNames" :key="index" class="el-margin-right-10">{{user}}</el-tag>
			</el-form-item>
			<el-form-item label="角色" prop="roleList">
				<el-checkbox-group v-model="dataForm.roleList" size="small">
					<el-col style="margin-top: 5px;" :lg="6" v-for="(role, i) in roleListChecks" :key="i">
						<el-checkbox style="margin-left: 10px;" :label="role.roleId" border>{{role.roleName}}</el-checkbox>
					</el-col>
					<!--<el-checkbox v-for="role in roleListChecks" style="margin-left: 10px;" :label="role.roleId" border>{{role.roleName}}</el-checkbox>-->
				</el-checkbox-group>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" v-if="dataForm.userList.length == 1" @click="dataFormSubmit(1)" :loading="saveLoading">确定</el-button>
      <template v-else>
        <el-button type="primary" @click="dataFormSubmit(1)" :loading="saveLoading">使用新角色</el-button>
        <el-button type="primary" @click="dataFormSubmit(2)" :loading="saveLoading">新增角色</el-button>
      </template>
    </span>
	</el-dialog>
</template>
<style>
	.el-tag:first-child{
		margin-left: 10px!important;
	}
</style>

<script>
	import { getCommHttpData, getCommonDictByType } from '@/utils/common'
	export default {
		data() {
			return {
				userNames: [],
				roleListChecks: [],
				visible: false,
				saveLoading: false,
				userType:'',
				dataForm: {
					userList: [],
					roleList: []
				},
				dataRule: {
					roleList: [{
						required: false,
						message: '角色不能为空',
						trigger: 'change'
					}]
				}
			}
		},
		methods: {
			init(userList) {
				let userIdArr = new Array()
				let userNames = new Array()
				let userType = userList[0].userType
        let deptIds = new Array()
				this.userType = userType
				for(let i in userList) {
					userIdArr.push(userList[i].userId)
					userNames.push(userList[i].username)
          deptIds.push(userList[i].deptIds)
				}
				this.dataForm.userList = userIdArr
				this.userNames = userNames
				let that = this
				getCommHttpData({
					url: 'uc/role/select',
					method: 'get',
					contentType: 1,
					data: {userType:userType,deptId:deptIds.toString()}
				}, function(data) {
					if(data && data.code === 0) {
						that.roleListChecks = data.list
						if(userList.length == 1){
							let roleIdsT = userList[0].roleIds
							if(roleIdsT.indexOf(',') >-1){
								roleIdsT = roleIdsT.split(',')
							}else{
								roleIdsT =[roleIdsT]
							}
							that.dataForm.roleList= roleIdsT
						}
						
					} else {
						that.roleListChecks = []
					}
				})

				this.visible = true
				this.saveLoading = false
				this.$nextTick(() => {
					this.$refs['dataForm'].resetFields()
				})
			},
			// 表单提交
			dataFormSubmit(type) {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						let that = this
						that.saveLoading = true
						getCommHttpData({
							url: 'uc/user/userWarrant',
							method: 'post',
							serverType: 2,
							contentType: 2,
							operateType: 2,
							that: this,
							data: {
								userIds: this.dataForm.userList,
								roleIds: this.dataForm.roleList,
								userType: this.userType,
                type:type
							}
						}, function(data) {
							that.saveLoading = false
							that.visible = false
							that.$emit('refreshDataList')
						})

					}
				})
			}
		}
	}
</script>