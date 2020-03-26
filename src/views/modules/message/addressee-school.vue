<template>
	<el-dialog :title="!dataForm.id ? '选择收件人' : '修改'" :close-on-click-modal="false" :visible.sync="visible" width="800px">
		<el-row :gutter="12">
			<el-col :span="6" style="border-right: 1px #e5e5e5 solid;">
				<div style="text-align: left;">
					<el-radio-group v-model="radioType" size="medium" @change="changeType">
						<el-radio-button label="1">教职工</el-radio-button>
						<el-radio-button label="2">&nbsp;学生&nbsp;</el-radio-button>
					</el-radio-group>
				</div>
				<div class="msg-dialog-box" v-loading="leftLoading">

					<div v-if="radioType == 1" v-for="item in roleList">
						<div v-if="roleId==item.roleId" class="msg-dialog-item msg-dialog-item-active" @click="roleId=item.roleId,getUserList()">{{item.roleName}}（<span style="color:#3C85EE">{{item.roleCount}}</span>）</div>
						<div v-else class="msg-dialog-item " @click="roleId=item.roleId,getUserList()">{{item.roleName}}（<span style="color:#3C85EE">{{item.roleCount}}</span>）</div>
					</div>
					<div v-if="radioType == 2" v-for="citem in classList">
						<div v-if="gradeId==citem.gradeId && classId==citem.classId" class="msg-dialog-item msg-dialog-item-active" @click="getStuList(citem.gradeId,citem.classId)">{{citem.gradeAndClassName}}
							<template v-if="citem.classId != undefined">
								（<span style="color:#3C85EE">{{citem.stuCount}}</span>）
							</template>
						</div>
						<div v-else class="msg-dialog-item " @click="getStuList(citem.gradeId,citem.classId)">{{citem.gradeAndClassName}}
							<template v-if="citem.classId  != undefined">
								（<span style="color:#3C85EE">{{citem.stuCount}}</span>）
							</template>
						</div>
					</div>
				</div>
			</el-col>
			<el-col :span="18">
				<!--<template v-if="userList.length >0">-->
					<el-checkbox style="margin-left: 6px;" class="margin-bottom-10" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
					<span v-if="radioType == 2 && gradeId == undefined" class="right margin-bottom-10"> 注：收件人为选择班级的全体学生</span>
					<span v-if="radioType == 2 && gradeId != undefined" class="right margin-bottom-10"> 注：选择学生后，会清空全部班级选择哦~</span>
					<el-col class="msg-dialog-user-box" style="" v-loading="rightLoading">
						<template v-if="radioType == 2">
							<div v-if="classList.length == 1" style="margin-top: 10px;">暂无数据</div>
						</template>
						<template v-if="gradeId == undefined && radioType == 2">
							<!-- 年级班级 -->
							<el-checkbox-group v-if="classList.length > 0" v-model="checkedClass" @change="handleCheckedClassChange">
								<el-checkbox v-for="(uitem,index) in classList" v-if="index >0" :label="index" :key="index">
									<span class="msg-dialog-user-item margin-10" :title="uitem.gradeAndClassName">{{uitem.gradeAndClassName | username }}</span>
								</el-checkbox>
							</el-checkbox-group>
							<template v-else><div style="margin-top: 10px;">暂无数据</div></template>
						</template>
						<!-- 老师 -->
						<template v-else-if="radioType == 1">
							<el-checkbox-group  v-if="userList.length > 0"  v-model="checkedUsers" @change="handleCheckedUserChange">
								<el-checkbox v-for="uitem in userList" :label="uitem.userId" :key="uitem.userId">
									<img :src="allPic" v-real-img="imgUrl+uitem.imageUrl" />
									<span v-if="radioType == 1" class="msg-dialog-user-item" :title="uitem.username">{{ uitem.username | username}}</span>
									<span v-else class="msg-dialog-user-item" :title="uitem.username">{{uitem.username | username }}</span>
								</el-checkbox>
							</el-checkbox-group>
							<template v-else><div style="margin-top: 10px;">暂无数据</div></template>
						</template>
						<!-- 学生 -->
						<template v-else>
							<el-checkbox-group  v-if="stuList.length > 0"  v-model="checkedStus" @change="handleCheckedUserChange">
								<el-checkbox v-for="uitem in stuList" :label="uitem.userId" :key="uitem.userId">
									<img :src="allPic" v-real-img="imgUrl+uitem.imageUrl" />
									<span v-if="radioType == 1" class="msg-dialog-user-item" :title="uitem.username">{{ uitem.username | username}}</span>
									<span v-else class="msg-dialog-user-item" :title="uitem.username">{{uitem.username | username }}</span>
								</el-checkbox>
							</el-checkbox-group>
							<template v-else><div style="margin-top: 10px;">暂无数据</div></template>
						</template>
					</el-col>
				<!--</template>-->
				<!--<template v-else>暂无数据</template>-->
			</el-col>

			<el-col :span="24" v-if="checkedUsers.length >0 || checkedStus.length >0 || checkedClass.length > 0 ">
				<div style="width: 100%;margin-top: 10px;">
					已选收件人（{{checkedUsers.length+checkedStus.length+checkedClassUserCount}}人）
					
					
					<span style="display: inline-block;float: right;color: #3C85EE;cursor: pointer;" @click="checkedUsers=[],checkedStus=[],checkedClass=[],checkedClassUserCount=0,checkAll=false,isIndeterminate=false">清空</span></div>
				<div style="width: 100%;max-height:100px;overflow: auto;margin-top: 10px;">
					<el-tag v-if="checkedUsers.length > 0 " class="message-tag" :key="tag" v-for="tag in checkedUsers" closable :disable-transitions="false" @close="handleClose(tag,0)">
						<template v-for="item in userAllList">
							<template v-if="item.userId == tag">{{item.username}}</template>
						</template>
					</el-tag>
					<el-tag v-if="checkedStus.length > 0 " class="message-tag" :key="tag" v-for="tag in checkedStus" closable :disable-transitions="false" @close="handleClose(tag,1)">
						<template v-for="item in studentAllList">
							<template v-if="item.userId == tag">{{item.username}}</template>
						</template>
					</el-tag>
					<el-tag v-if="checkedClass.length > 0" class="message-tag" :key="tag" v-for="tag in checkedClass" closable :disable-transitions="false" @close="handleClose(tag,2)">
						<template v-for="(item,index) in classList">
							<template v-if="index == tag">{{item.gradeAndClassName}}</template>
						</template>
					</el-tag>
				</div>
			</el-col>
		</el-row>
		<span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
	</el-dialog>
</template>

<script>
	import { getCommHttpData, getCommonDictByType } from '@/utils/common'
	import allPic from '@/assets/img/pic_avatar.jpg'
	export default {
		data() {
			return {
				imgUrl: window.SITE_CONFIG.imgIP,
				allPic: allPic,
				checkAll: false,
				radioType: 1,
				checkedUsers: [],
				checkedStus: [],
				checkedClass: [],
				isIndeterminate: false,
				visible: false,
				roleId: 0,
				roleList: [],
				userList: [],
				stuList: [],
				classList: [],
				userAllList: [],
				studentAllList: [],
				dataForm: {
					id: 0,
					paramKey: '',
					paramValue: '',
					remark: ''
				},
				dataRule: {
					paramKey: [{
						required: true,
						message: '参数名不能为空',
						trigger: 'blur'
					}],
					paramValue: [{
						required: true,
						message: '参数值不能为空',
						trigger: 'blur'
					}]
				},
				inputVisible: false,
				leftLoading: false,
				rightLoading: false,
				gradeId: undefined,
				classId: undefined,
				checkedClassUserCount:0
			}
		},
		filters: {
			username(item) {
				let temp = ''
				if(item != undefined) {
					temp = item.length > 3 ? item.substr(0, 3) + '...' : item
				} else {
					temp = ''
				}
				return temp
			}
		},

		mounted() {

		},
		methods: {
			changeType() {
				this.checkAll = false
				if(this.radioType == 1) {
					this.getRoleList()
				} else {
					this.getClassList()
				}
			},
			//获得班级信息
			getClassList() {
				var that = this
				that.leftLoading = true
				that.classList = []
				getCommHttpData({
					url: 'message/getSendClassList',
					method: 'post',
					contentType: 2,
					data: {}
				}, function(data) {
					that.leftLoading = false
					that.$nextTick(() => {
						that.classList = data.list
						that.gradeId = data.list[0].gradeId
						that.classId = data.list[0].classId
						that.isIndeterminate = that.checkedClass.length > 0 && that.checkedClass.length < (that.classList.length-1)
						that.checkAll = that.checkedClass.length > 0 && that.checkedClass.length == (that.classList.length-1)
						
					})

				})
			},
			//获得角色
			getRoleList() {
				var that = this
				that.leftLoading = true
				that.roleList = []
				getCommHttpData({
					url: 'message/getTaeRoleList',
					method: 'post',
					contentType: 2,
					data: {}
				}, function(data) {
					that.leftLoading = false
					that.roleList = data.list
					that.getUserList()
				})
			},
			//根据角色获取教师
			getUserList() {
				var that = this
				that.rightLoading = true
				getCommHttpData({
					url: 'message/getTeaListByRoleId',
					method: 'post',
					contentType: 2,
					data: {
						roleId: this.roleId
					}
				}, function(data) {
					if(that.roleId == 0) {
						that.userAllList = data.list
					}
					that.rightLoading = false
					that.userList = data.list
					that.isIndeterminate = that.checkedUsers.length > 0 && that.checkedUsers.length < that.userAllList.length;
					that.checkAll = that.checkedUsers.length > 0 && that.checkedUsers.length == that.userAllList.length;
				})
			},
			//根据年级班级获得学生信息
			getStuList(gradeId, classId, type) {
				var that = this
				that.gradeId = gradeId
				that.classId = classId
				that.rightLoading = true
				
				if(gradeId == undefined) {
					that.checkedStus = []
					that.rightLoading = false
					that.isIndeterminate = that.checkedClass.length > 0 && that.checkedClass.length < (that.classList.length-1)
					that.checkAll = that.checkedClass.length > 0 && that.checkedClass.length == (that.classList.length-1)
					return
				}else{
					that.checkedClass = []
					that.checkedClassUserCount = 0
				}
				//切换年级班级时，班级选中清空
				getCommHttpData({
					url: 'message/getSendStuList',
					method: 'post',
					contentType: 2,
					data: {
						gradeId: gradeId,
						classId: classId
					}
				}, function(data) {
					that.rightLoading = false
					if(type == 0) {
						//查询所有的学生
						that.studentAllList = data.list
					} else {
						that.stuList = data.list
						that.isIndeterminate = that.checkedStus.length > 0 && that.checkedStus.length < that.stuList.length;
						that.checkAll = that.checkedStus.length > 0 && that.checkedStus.length == that.stuList.length;
					}

				})
			},
			handleClose(tag, type) {
				if(type == 0) {
					this.checkedUsers.splice(this.checkedUsers.indexOf(tag), 1);
				} else if(type == 1) {
					this.checkedStus.splice(this.checkedStus.indexOf(tag), 1);
				} else {
					this.checkedClass.splice(this.checkedClass.indexOf(tag), 1);
					let checkedClassUserCount = 0
					this.checkedClass.forEach(item => {
						this.classList.forEach((citem,index) => {
							if(item == index){
								checkedClassUserCount +=citem.stuCount
							}
						})
					})
					this.checkedClassUserCount = checkedClassUserCount
				}
			},
			//全部选择
			handleCheckAllChange(val) {
				
				
				//教师全选
				if(this.radioType == 1){
					let uArr = []
					this.userList.forEach(item => {
						uArr.push(item.userId)
					})
					this.checkedUsers = val ? uArr : [];
				}else if(this.radioType == 2){
					//班级全选
					if(this.gradeId == undefined){
						let uArr = []
						let checkedClassUserCount = 0
						this.classList.forEach((item,index) => {
							if(index >0){
								uArr.push(index)
								checkedClassUserCount +=parseInt(item.stuCount)
							}
						})
						this.checkedClass = val ? uArr : [];
						this.checkedClassUserCount = checkedClassUserCount
					}else{
						let uArr = []
						this.stuList.forEach(item => {
							uArr.push(item.userId)
						})
						this.checkedStus = val ? uArr : [];
					}
				}
				
				this.isIndeterminate = false;
			},
			//check
			handleCheckedUserChange(value) {
				console.log(value)
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.userList.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.userList.length;
			},
			//班级
			handleCheckedClassChange(value) {
				
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.classList.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.classList.length;
				
				let checkedClassUserCount = 0
				this.checkedClass.forEach(item => {
					this.classList.forEach((citem,index) => {
						if(item == index){
							checkedClassUserCount +=parseInt(citem.stuCount)
						}
					})
				})
				this.checkedClassUserCount = checkedClassUserCount
				
			},
			init(id,isSend) {
				this.dataForm.id = id || 0
				this.visible = true
				this.$nextTick(() => {
					//this.$refs['dataForm'].resetFields()
					this.getStuList(0, 0, 0)
					this.getClassList()
					this.getRoleList()
					if(!isSend){
						this.checkedUsers = []
						this.checkedStus = []
						this.checkedClass = []
						this.checkAll=false
					}
				})
			},
			// 表单提交
			dataFormSubmit() {
				let tempArr = []
				//教师 ，学生 ，班级
				let tempStuArr = []
				let tempClassArr = []
				if(this.checkedUsers.length == 0 && this.checkedStus.length == 0 && this.checkedClass.length == 0) {
					this.$message({
						message: '请选择收件人',
						type: 'error'
					})
					return
				}
				this.visible = false
				this.userAllList.forEach(item => {
					this.checkedUsers.forEach(uitem => {
						if(item.userId == uitem) {
							tempArr.push(item)
						}
					})
				})
				this.studentAllList.forEach(item => {
					this.checkedStus.forEach(uitem => {
						if(item.userId == uitem) {
							tempStuArr.push(item)
						}
					})
				})
				this.classList.forEach((item, index) => {
					this.checkedClass.forEach(uitem => {
						if(index == uitem) {
							tempClassArr.push(item)
						}
					})
				})
				//    	if(tempStuArr.length >0){
				//    		tempStuArr.forEach(item=>{
				//							tempArr.push(item)
				//					})
				//    	}
				this.$emit('refreshDataList', {
					userList: tempArr,
					userIdList: this.checkedUsers,
					stuList: tempStuArr,
					stuIdList: this.checkedStus,
					gradeClassList: tempClassArr,
					gradeClassIdList: this.checkedClass
				})
			}
		}
	}
</script>