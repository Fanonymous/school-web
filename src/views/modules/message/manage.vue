<template>

	<div class="analysis-echarts">
		<el-row :gutter="12" type="flex">
			<el-col :lg="6" class="msg-left-list-box">
				<el-card shadow="hover" class="message-card" >
					<div class="margin-bottom-10 msg-btn-box "  :class="detailVisible?'msg-btn-box-blue':'msg-btn-box-grey'"  @click="getInitSend">
						<div style="position: relative;padding: 0 auto;">
							<i class="el-icon-circle-plus-outline" style=""></i>&nbsp;&nbsp;
							<span style="">发通知</span>
						</div>
					</div>
					<!--<el-input v-model="keywords" class="margin-bottom-10" clearable placeholder="请输入姓名搜索"><i slot="suffix" class="el-input__icon el-icon-search"></i></el-input>-->
					<div class="message-list-box" id="message-list-box">
						<div v-for="(mitem,index) in messageList" :class="msgId == mitem.msgId?'message-item-active':'message-item'">
							<el-checkbox v-model="mitem.ischeck" @change="getCheckMsgIds(mitem.msgId,mitem.ischeck)"></el-checkbox>
							<div class="send-name" :style="'background-color:'+colorArr[index%4]" @click="getMsgDetail(mitem.msgId)">
								{{mitem.receiveName.substr(0,1)}}
							</div>
							<div class="item-title" @click="getMsgDetail(mitem.msgId)">
								<div class="margin-bottom-10 receive-name "><label>{{mitem.receiveName}}</label></div>
								<div class="mseeage-bold">{{mitem.title | titleFilter}}</div>
							</div>
							<div class="item-right" @click="getMsgDetail(mitem.msgId)">
								<div class="margin-bottom-10">
									<span>{{mitem.sendTime | dateFilter}}</span>
								</div>
								<div class="mseeage-bold">
									<span v-if="mitem.enable == 0">已读率：{{mitem.readRate}}%</span>
									<span v-else>已撤回</span>
								</div>
							</div>
						</div>
						<template v-if="messageList.length == 0">
							<div class="message-nodata">
								<img src="~@/assets/img/icons/nodata-msg.png" width="150px" class="margin-bottom-10" />
								<div>请发布第一条通知~</div>
							</div>
						</template>
					</div>
					<div style="text-align: center;height: 26px;margin-top: 10px;">
						<el-button type="primary" v-if="msgCheckList.length ==0" disabled>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
						<el-button type="primary" v-else @click="deleteData">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
					</div>
				</el-card>
			</el-col>
			<el-col :lg="18">

				<message-detail v-if="detailVisible" ref="messageDetail" @refreshCloseDetail="getInitSend"></message-detail>
				<template v-else>
					<el-card shadow="hover">
						<div slot="header" class="clearfix">
							<span>发通知</span>
						</div>
						<el-form :rules="rules" ref="dataForm" :model="dataForm" label-position="right" label-width="0px">
						    
					    	<el-form-item v-if="userTypeList.length >1" label="" style="display: inline-block;width:15%">
					    		<el-col :lg="24" style="padding-left: 0px !important;padding-right:0px;">
							    	<el-select v-model="userTypeSelect"  placeholder="请选择用户类型">
								      <el-option :label="item.dictName" :value="item.value" :key="item.value" v-for="item in userTypeList">{{item.dictName}}</el-option>
								    </el-select>
							    </el-col>
						    </el-form-item>
					    	<el-form-item label="" prop="userNameList" v-if="userTypeSelect == 2" :style="'display: inline-block;width:'+widthLen">
								<el-col :lg="24"  style="padding-left: 0px;padding-right:0px;">
									<el-input v-model.trim="dataForm.userNameList" class="msg-input-disabled" disabled placeholder="请点击选择收件人" @click.native="getShowDialog(1)">
										<template slot="append">共：{{totalUserCount}}人</template>
									</el-input>
								</el-col>
							</el-form-item>
							<el-form-item v-else label="" prop="deptNameList" :style="'display: inline-block;width:'+widthLen">
								<el-col :lg="24"  style="padding-left: 0px;padding-right:0px;">
									<el-input v-model.trim="dataForm.deptNameList" class="msg-input-disabled"  disabled placeholder="请点击选择收件人" @click.native="getShowDialog(0)">
										<template slot="append">共：{{totalUserCount}}人</template>
									</el-input>
								</el-col>
							</el-form-item>
							<el-form-item label="" prop="title">
								<el-input type="text" v-model.trim="dataForm.title" placeholder="请输入通知标题（30字以内）" maxlength="30" show-word-limit></el-input>
							</el-form-item>
							<el-form-item label="" prop="content" >
								<script :id="ueId" class="ueditor-box" type="text/plain" style="width: 100%; height: 390px;overflow: auto;">
									<div v-model="dataForm.content"></div>
								</script>
							</el-form-item>
							<el-form-item style="position: relative;">
								<el-select class="fr right" style="position: absolute;right:0px;width:110px;" size="mini" v-model="dataForm.type">
									<el-option v-for="item in messageTypeOptions" :key="item.value" :label="item.dictName" :value="item.value">
									</el-option>
								</el-select>
								<upload-file label="" ref="uploadFile" :uploadPng="false" :isLoading="addLoading" @refreshLoading="refreshLoading" :fileRequired=false :limit=10 :fileExt="fileExtMenu" :fileSize="1024" @refreshDataList="getFileList"></upload-file>
								<!--<div class="fr right" ><el-button type="text"/><i class="el-icon-time"></i>设置定时发送</el-button></div>-->

							</el-form-item>
						</el-form>
						<el-button type="primary" @click="dataFormSubmit()" :loading="addLoading">发送</el-button>
					</el-card>
				</template>
			</el-col>
		</el-row>
		<message-addressee v-if="eduDialogVisible" ref="messageAddressee" @refreshCloseDetail="eduDialogVisible=false" @refreshDataList="getDeptCheckedList"></message-addressee>
		<message-addressee-school v-if="schoolDialogVisible" ref="messageAddresseeSchool" @refreshCloseDetail="echoolDialogVisible=false" @refreshDataList="getUserCheckedList"></message-addressee-school>

	</div>
</template>
<script>
	import { getCommHttpData, getAnalysisChartData, getIntervalByArr, getDateStr, getCommonDictByType, deleteData } from '@/utils/common'
	import errorImgUrl from '@/assets/img/pic_default.jpg'
	import ueditor from 'ueditor'
	import MessageDetail from './detail'
	import MessageAddressee from './addressee'
	import MessageAddresseeSchool from './addressee-school'
	import UploadFile from '../common/upload-file-other'
	export default {
		components: {
			MessageDetail,
			MessageAddressee,
			MessageAddresseeSchool,
			UploadFile
		},
		data() {
			return {
				userId: this.GLOBAL.getUserId(),
				userType: this.GLOBAL.getUserType(),
				schoolId: this.GLOBAL.getOrgId(),
				imgUrl: window.SITE_CONFIG.imgIP,
				colorArr: ['#f5c95f', '#a2caa5', '#89c1f4', '#c7bbd5'],
				keywords: '',
				messageTypeOptions: [{
					dictName: '通知公告',
					value: 1
				}, {
					dictName: '日常事务',
					value: 4
				}],
				messageList: [],
				typeStatusList: [],
				defaultPic: errorImgUrl,
				dataListLoading: false,
				msgId: '',
				detailVisible: false,
				addVisible: false,
				addLoading: false,
				ue: null,
				ueId: `J_ueditorBox_${new Date().getTime()}`,
				eduDialogVisible: false,
				schoolDialogVisible: false,
				userNameList: '',
				msgCheckList: [],
				totalCount: 0,
				fileExtMenu: ['.PNG', '.JPG', '.GIF', '.JPEG', '.BMP', 'ZIP', ''],
				dataForm: {
					title: '',
					userNameList: '',
					deptNameList: '',
					receiveUsers: [],
					classAndGradeLists: [],
					attachmentFiles: [],
					deptIds: [],
					sendUserId: this.GLOBAL.getUserId(),
					sendUserTypes: [],
					type: 1,
					typeName: '通知公告',
					isTask: 0,
					sendTime: '',
					content: '',
				},
				userList: [],
				currPage: 1,
				totalPage: 1,
				rules: {
					deptNameList: [{
						required: true,
						message: '请选择收件人',
						trigger: 'blur'
					}],
					userNameList: [{
						required: true,
						message: '请选择收件人',
						trigger: 'blur'
					}],
					title: [{
						required: true,
						message: '请输入通知标题',
						trigger: 'blur'
					}],
					content: [{
						required: true,
						message: '请输入内容',
						trigger: 'blur'
					}]
				},
				totalUserCount:0,
				userIdList: [],
				stuIdList: [],
				gradeClassIdList:[],
				userTypeList:[],
				userTypeSelect:null,
				widthLen:'100%',
				isSend:false
			}
		},
		filters: {
			titleFilter(item){
				if(item.length >12){
					item = item.substr(0,12)+'...'
				}
				return item
			},
			dateFilter(item) {
				let temp = item.substr(0, 4)
				let str = item
				const today = new Date();
				if(parseInt(temp) == today.getFullYear()) {
					str = item.substr(5, 5)
				} else {
					str = item.substr(0, 10)
				}
				return str
			}
		},
		watch: {
			keywords(val) {
				this.getMessageList()
			}
		},
		mounted() {
			this.getUserInfo()
			this.getInitSend(0)

			//getCommonDictByType(this, 'message_type', 'messageTypeOptions')
			this.getMessageList()
		},
		created() {    },
		methods: {
			refreshLoading(val){
			
				this.addLoading=val
			},
			// 获取所有的用户类型
			getUserInfo() {
				this.loading = false
				let that = this
				getCommHttpData({
					url: 'message/getUserTypeForMessage',
					method: 'post',
					contentType: 2,
					data: {}
				}, function(data) {
					that.loading = false
					that.widthLen = data.list.length >1?'84%':'100%'
					that.userTypeList = data.list
					that.userTypeSelect = data.list[0].value
				})
			},
			getSendTypeList(){
				let that = this;
				getCommHttpData({
					url: 'message/getSendType',
					method: 'post',
					contentType: 2,
					data: {userType:this.userType}
				}, function(data) {
					that.messageTypeOptions = data.list
				})
			},
			getCheckMsgIds(msgId, isCheck) {
				//获得所有选中的Id
				let tempCheckList = []
				this.messageList.forEach(item => {
					if(item.ischeck) {
						tempCheckList.push(item.msgId)
					}
				})
				this.msgCheckList = tempCheckList
			},
			getInitSend(type) {
				if(this.addVisible) {
					return
				}
				if(type != 1) {
					this.addVisible = true
					this.detailVisible = false
				}
				//this.detailVisible = false
				
				let that = this
				this.$nextTick(() => {
					var box = document.getElementById("message-list-box");
					box.onscroll = function() {   //变量scrollTop是滚动条滚动时，距离顶部的距离
						  
						var scrollTop = box.scrollTop;   //变量windowHeight是可视区的高度
						  
						var windowHeight = box.clientHeight;   //变量scrollHeight是滚动条的总高度
						  
						var scrollHeight = box.scrollHeight;         //滚动条到底部的条件
						        
						if(scrollTop + windowHeight == scrollHeight) {         //写后台加载数据的函数
							if(that.currPage < that.totalPage) {
								that.currPage++
									that.getMessageList()
							}      //console.log("距顶部"+scrollTop+"可视区高度"+windowHeight+"滚动条总高度"+scrollHeight);
							       
						}      
					}
					
					if(type != 1) {
						that.$refs.uploadFile.picList = []
						this.$refs['dataForm'].clearValidate()
						that.addLoading = false
						that.totalUserCount = 0
						that.userIdList = []
						that.stuIdList = []
						that.gradeClassIdList = []
						this.getInitUe()
					}
					if(type == 1) {
						this.getMessageList(1)
					}
				})

			},
			//初始化富文本框
			getInitUe() {
				ueditor.delEditor(this.ueId);
				this.ue = ueditor.getEditor(this.ueId, {
					// serverUrl: '', // 服务器统一请求接口路径
					toolbars: [
						['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset',
							'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', 'link', 'inserttable', 'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', 'insertimage'
						]
					],
					wordCount:false,
					elementPathEnabled:false
				});
			},
			//查看消息详情
			getMsgDetail(id) {
				this.msgId = id
				this.detailVisible = true
				this.addVisible = false
				this.$nextTick(() => {
					this.$refs.messageDetail.getInitList(id, 1)
				})
			},
			//通知列表
			getMessageList(type) {
				let that = this;
				if(type == 1 ){
					that.currPage == 1
					that.messageList = []
					that.totalCount = 0
					that.totalPage = 0
				}
				getCommHttpData({
					url: 'message/getSendList',
					method: 'post',
					contentType: 2,
					data: {
						userId: this.userId,
						page: this.currPage,
						limit: 20
					}
				}, function(data) {
					data.page.list.forEach(item => {
						item['ischeck'] = false
					})
					if(type != 1 ){
						let tempArr=[...that.messageList, ...data.page.list]
						that.messageList = tempArr
					}else{
						that.messageList = data.page.list
					}
					that.totalCount = data.page.totalCount
					that.totalPage = data.page.totalPage
				})
			},
			//显示收件人
			getShowDialog(type, id) {
				if(type == 0) {
					this.eduDialogVisible = true
					this.$nextTick(() => {
						this.$refs.messageAddressee.init(id,this.userTypeSelect,this.isSend,this.dataForm.deptIds)
					})
				} else {
					this.schoolDialogVisible = true
					this.$nextTick(() => {
						this.$refs.messageAddresseeSchool.init(id,this.isSend)
						this.$refs.messageAddresseeSchool.checkedUsers = this.userIdList
						this.$refs.messageAddresseeSchool.checkedStus =  this.stuIdList
						this.$refs.messageAddresseeSchool.radioType =  1
						this.$refs.messageAddresseeSchool.checkedClass = this.gradeClassIdList
					})
				}
			},
			//获得所有的机构
			getDeptCheckedList(val) {
				this.isSend = true
				this.dataForm.sendUserTypes = val.sendUserType
				let tempDept = val.deptCheckList
				let tempArr = [],
					tempIdArr = []
				let len = tempDept.length
				len = len > 3 ? 3 : len
				let preStr = tempDept.length>3?'...':''
				for(let i = 0; i < len; i++) {
					tempArr.push(tempDept[i].deptName)

				}
				for(let j = 0; j < tempDept.length; j++) {
					tempIdArr.push(tempDept[j].deptId)
				}

				this.dataForm.deptNameList = tempArr.toString()+preStr
				this.dataForm.deptIds = tempIdArr
				this.totalUserCount = val.totalCount
				this.$refs['dataForm'].validateField('deptNameList')
			},
			//获得所有的教师或者学生或者班级
			getUserCheckedList(val) {
				this.isSend = true
				//反选所有的数据
				this.userIdList = val.userIdList
				this.stuIdList = val.stuIdList
				this.gradeClassIdList = val.gradeClassIdList
				//this.classAndGradeIdLists = val.gradeClassIdList
				
				let tempArr = [],
					tempIdArr = [],
					totalUser = this.userIdList.length+this.stuIdList.length+this.gradeClassIdList.length
				let len = val.userList.length
				len = len > 3 ? 3 : len
				let stuLen = val.stuList.length
				stuLen = stuLen > 3 ? 3 : stuLen

				let gcLen = val.gradeClassList.length
				gcLen = gcLen > 3 ? 3 : gcLen

				for(let i = 0; i < len; i++) {
					tempArr.push(val.userList[i].username)
				}
				if(tempArr<3){
					for(let i = 0; i < stuLen; i++) {
						tempArr.push(val.stuList[i].username)
					}
				}
				if(tempArr<3){
					for(let i = 0; i < gcLen; i++) {
						tempArr.push(val.gradeClassList[i].gradeAndClassName)
					}
				}
				if(len > 0) {
					for(let i = 0; i < val.userList.length; i++) {
						tempIdArr.push({
							receiveUserId: val.userList[i].userId,
							receiveUserName: val.userList[i].username
						})
					}
				}
				if(stuLen > 0) {
					val.stuList.forEach(item => {
						tempIdArr.push({
							receiveUserId: item.userId,
							receiveUserName: item.username
						})
					})
				}
				let classCount = 0
				val.gradeClassList.forEach(item => {
					if(item.stuCount >0){
						classCount += item.stuCount
					}
				})
				this.totalUserCount = tempIdArr.length+classCount
				this.dataForm.userNameList = '收件人：'+tempArr.toString() + (totalUser>3?'...':'')
				this.dataForm.receiveUsers = tempIdArr
				this.dataForm.classAndGradeLists = val.gradeClassList
				this.$refs['dataForm'].validateField('userNameList')

			},
			resetFormData() {
				this.dataForm = {
					title: '',
					userNameList: '',
					deptNameList: '',
					attachmentFiles: [],
					receiveUsers: [],
					sendUserId: this.GLOBAL.getUserId(),
					deptIds: [],
					sendUserTypes: [],
					type: 1,
					typeName: '通知公告',
					isTask: 0,
					sendTime: '',
					content: '',
				}
			},
			//发送消息
			dataFormSubmit() {
				let that = this;
				this.ue.ready(() => {
					this.dataForm.content = this.ue.getContent()
				})
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						that.addLoading = true
						let mTypes = this.messageTypeOptions.filter(item => item.value === this.dataForm.type)[0]
						this.dataForm.typeName = mTypes.dictName
						//this.dataForm.attachmentFiles = that.$refs.uploadFile.picList
						getCommHttpData({
							url: 'message/send',
							method: 'post',
							contentType: 2,
							operateType:3,
							that:this,
							data: this.dataForm
						}, function(data) {
							that.isSend = false
							that.addLoading = false
							if(data && data.code == 0){
								that.userNameList = ''
								that.resetFormData()
								that.ue.setContent('')
								that.totalUserCount = 0
								that.userIdList = []
								that.stuIdList = []
								that.gradeClassIdList = []
								that.$refs.uploadFile.picList = []
								that.$refs['dataForm'].resetFields()
								that.getMessageList(1)
							that.getMsgDetail(data.msgId)
							}
						})
					}
				})
			},
			//删除消息
			deleteData() {
				var that = this
				let ids = this.msgCheckList
				if(this.msgCheckList.length == 0) {
					this.$message({
						message: '请选择消息',
						type: 'error'
					})
					return
				}
				deleteData(this, {
					msg: '您确定删除所选通知吗?',
					delJson: {
						url: 'message/deleteMsg',
						method: 'post',
						contentType: 2,
						operateType: 1,
						data: {
							msgIds: ids
						}
					}
				}, function(data) {
					that.msgCheckList= []
					that.getInitSend(0)
					that.detailVisible = false
					that.getMessageList(1)
				})
			},
			//获得文件列表
			getFileList(list) {
				this.dataForm.attachmentFiles = list
			}
		}
	}
</script>