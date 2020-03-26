<template>

	<div class="analysis-echarts">
		<el-row :gutter="12" type="flex">
			<el-col :lg="6" class="msg-left-list-box">
				<el-card shadow="hover" class="message-card">
					<div class="margin-bottom-10" style="text-align: center;">
						
						<el-radio-group v-model="messageStatus" size="medium" @change="getMessageList(1)">
					      <el-radio-button label="2">未读消息<span v-if="noReadCount  > 0">（{{noReadCount}}条）</span></el-radio-button>
					      <el-radio-button label="0">全部消息</el-radio-button>
					    </el-radio-group>
						<!--<el-button @click="getMessageList(2)">未读消息<span v-if="noReadCount  > 0">（{{noReadCount}}条）</span></el-button>
						<el-button @click="getMessageList()">全部消息</el-button>-->
						<el-select v-model="messageType" clearable  placeholder="全部类型" style="width: 120px;margin-left: 10px;" @change="changeMsgType(-1)">
							<el-option v-for="item in messageTypeOptions" :key="item.type" :label="item.typeName" :value="item.type">
							</el-option>
						</el-select>
					</div>
					<!--<el-input v-model="keywords" class="margin-bottom-10" clearable placeholder="请输入姓名搜索"><i slot="suffix" class="el-input__icon el-icon-search"></i></el-input>-->
					<div class="message-list-box margin-bottom-10" v-loading="listLoading" id="message-list-box">
						<div v-for="(mitem,index) in messageList" :class="msgId == mitem.msgId?'message-item-active':'message-item'" >
							<el-checkbox v-model="mitem.ischeck" @change="getCheckMsgIds(mitem.msgId,mitem.ischeck)"></el-checkbox>
							<div class="message-item-info" @click="getMsgDetail(mitem.msgId,mitem.isRead,mitem.id,mitem.type)">
								<div class="send-name" :style="'background-color:'+colorArr[index%4]">
							    	{{mitem.sendUserName !=undefined? mitem.sendUserName.substr(0,1):''}}
							    	<div v-if="mitem.isRead == 0" class="circle"></div>
							    </div>
							    <div class="item-title">
							    	<div class="margin-bottom-10 receive-name mseeage-bold"><label>{{mitem.sendUserName}}</label></div>
							    	<div >{{mitem.title | titleFilter}}</div>
							    </div>
							    <div class="item-right">
							    	<div class="margin-bottom-10">
							    		<span>{{mitem.createTime | dateFilter }}</span>
							    	</div>
							    	<div class="mseeage-bold">
							   			<span>{{mitem.typeName || '通知公告'}}</span>
							    	</div>
							    </div>
								
							</div>
						</div>
						<template v-if="messageList.length == 0">
							<div class="message-nodata">
								<img src="~@/assets/img/icons/nodata-msg.png" width="150px" class="margin-bottom-10" />
								<div>暂无消息</div>
							</div>
						</template>
					</div>
					<div style="text-align: center;">
						<template v-if="msgCheckList.length ==0" >
							<el-button type="primary" disabled>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
							<el-button type="primary" disabled>标记为已读</el-button>
						</template>
						<template v-else>
							<el-button type="primary" @click="deleteData">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
							<el-button type="primary" @click="setReadMessageList(0)">标记为已读</el-button>
						</template>
						<el-button type="primary" @click="setReadMessageList(1)">&nbsp;全部已读&nbsp;</el-button>
					</div>
				</el-card>
			</el-col>
			<el-col :lg="18">

				<message-detail v-if="detailVisible" ref="messageDetail" @refreshCloseDetail="detailVisible=false,msgId='',getMessageList"></message-detail>
				<template v-else>
					<el-card shadow="hover" class="margin-bottom-10">
						<img src="~@/assets/img/qr.png" width="80px" />&nbsp;&nbsp;关注纳智助手，手机接收个人消息更方便！
						<el-button size="small" type="primary" @click="qrcodeVisible=true">扫码关注</el-button>
					</el-card>
					<el-card shadow="hover" class="msg-all-types-box">
						<el-row :gutter="20" >
						<template v-if="typeStatusList.length > 0">
							<template v-for="(item,index) in typeStatusList">
								<el-col :lg="6" class="message-types-box" :class="messageType==item.type?'message-types-imgbg-active':''" >
									<div class="message-types"  @click="changeMsgTypeRight(item.type,2,item.msgCount)" >
										<div class="message-types-imgbg"  :style="'background-color: '+colorTypes[item.type%3]+';'">
											<img :src="msg5" v-if="item.type ==1"/>
											<img :src="msg1" v-else-if="item.type ==2"/>
											<img :src="msg4" v-else-if="item.type ==3"/>
											<img :src="msg3" v-else-if="item.type ==4"/>
											<img :src="msg6" v-else-if="item.type ==5"/>
											<img :src="msg2" v-else-if="item.type ==6"/>
											<img :src="msg7" v-else-if="item.type ==7"/>
											<img :src="msg8" v-else="item.type ==8"/>
											<div v-if="item.msgCount > 0" class="message-hot">{{item.msgCount}}</div>
											<div class="message-types-name">{{item.typeName}}</div>
										</div>
										
									</div>
								</el-col>
							</template>
						</template>
						<template v-else>
							<el-col :lg="24">
								<div class="message-nodata-right">
									<img src="~@/assets/img/icons/nodata-msg.png" width="150px" class="margin-bottom-10" />
									<div>暂无消息</div>
								</div>
							</el-col>
						</template>
						</el-row>
					</el-card>
				</template>
			</el-col>
		</el-row>
		
		<el-dialog title="" :visible.sync="qrcodeVisible" width="290px">
			<div class="qrcode-box">
				<div class="qrcode-title margin-bottom-10">纳智助手</div>
				<img v-if="domainType !=4" src="~@/assets/img/gh.jpg" width="170px" />
				<img v-else src="~@/assets/img/gh-qy.jpg" width="170px" />
				<div class="qrcode-remark">请使用微信扫描二维码访问</div>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import { getCommHttpData, getCommonDictByType, deleteData,getDomainType } from '@/utils/common'
	import errorImgUrl from '@/assets/img/pic_avatar.jpg'
	import msg1 from '@/assets/img/icons/msg1.png'
	import msg2 from '@/assets/img/icons/msg2.png'
	import msg3 from '@/assets/img/icons/msg3.png'
	import msg4 from '@/assets/img/icons/msg4.png'
	import msg5 from '@/assets/img/icons/msg5.png'
	import msg6 from '@/assets/img/icons/msg6.png'
	import msg7 from '@/assets/img/icons/msg7.png'
	import msg8 from '@/assets/img/icons/msg15.png'
	import MessageDetail from './detail'

	export default {
		components: {
			MessageDetail
		},
		data() {
			return {
				userId: this.GLOBAL.getUserId(),
				schoolId: this.GLOBAL.getOrgId(),
				imgUrl: window.SITE_CONFIG.imgIP,
				domainType:getDomainType(),
				messageStatus:0,
				checkMsgIds:[],
				colorArr:['#f5c95f','#a2caa5','#89c1f4','#c7bbd5'],
				colorTypes: ['#57c8f2', '#2ebbad', '#a9d96c'],
				keywords: '',
				messageTypeOptions: [],
				messageList: [],
				msgId: '',
				messageType: undefined,
				typeStatusList: [],
				defaultPic: errorImgUrl,
				dataListLoading: false,
				listLoading:false,
				qrcodeVisible:false,
				msg1: msg1,
				msg2: msg2,
				msg3: msg3,
				msg4: msg4,
				msg5: msg5,
				msg6: msg6,
				msg7: msg7,
				msg8: msg8,
				detailVisible: false,
				noReadCount:0,
				msgCheckList:[],
				currPage:1,
				totalPage:1,
				totalCount:1,

			}
		},
		filters:{
			titleFilter(item){
				if(item.length >12){
					item = item.substr(0,12)+'...'
				}
				return item
			},
			dateFilter(item){
				let temp = item.substr(0,4)
				let str = item
				const today = new Date();
				if(parseInt(temp) == today.getFullYear() ){
					str = item.substr(5,5)
				}else{
					str = item.substr(0,10)
				}
				return str
			}
		},
		computed: {
			sideSubFold: {
		        get () { return this.$store.state.common.sideSubFold },
		        set (val) { this.$store.commit('common/updateSideSubFold', val) }
		    },
		    sideMenuApp:{
		      	get () { return this.$store.state.common.sideMenuApp },
		        set (val) { this.$store.commit('common/updateSideMenuApp', val) }
		      }
	    },
		watch: {
			keywords(val) {
				this.getMessageList()
			},
			$route(to,from){
				if(this.$route.name == 'message-receive'){
					this.sideMenuApp = true
					this.sideSubFold = false
				}else{
					this.messageType = ''
					this.sideMenuApp = false
					this.sideSubFold = false
				}
				
				if(this.$route.query.msgId != undefined){
					
					this.messageStatus = 0
					//this.messageType = parseInt(this.$route.query.msgType)
					this.typeStatusList.forEach((item,index) => {
						if(item.type == this.messageType){
							this.noReadCount= item.msgCount
						}
					})
					
					this.getMsgDetail(this.$route.query.msgId,this.$route.query.isRead,this.$route.query.id,this.$route.query.msgType)
					this.getMessageList(1)
					this.getTypeStatusList()
				}else{
					
					if(this.$route.query.mType != undefined){
						this.messageType = this.$route.query.mType
					}else{
						
						this.messageType = ''
						
					}
					this.messageStatus = 0
					this.detailVisible = false
					this.getTypeStatusList()
					this.getMessageList(1)
					
				}
    			
  			}
 
		},
		mounted() {
			this.getMessageList(1)
			this.getTypeStatusList()
			if(this.$route.name == 'message-receive-my'){
				this.sideMenuApp = false
				this.sideSubFold = false
			}
			
			if(this.$route.query.msgId != undefined){
				this.sideMenuApp = false
				this.sideSubFold = false
				this.messageStatus = 0
				this.messageType = ''
				//this.messageType = parseInt(this.$route.query.msgType)
				this.typeStatusList.forEach((item,index) => {
					if(item.type == this.messageType){
						this.noReadCount= item.msgCount
					}
				})
				
				this.getMsgDetail(this.$route.query.msgId,this.$route.query.isRead,this.$route.query.id,this.$route.query.msgType)
				this.getMessageList(1)
			}
			//getCommonDictByType(this, 'message_type', 'messageTypeOptions')
			
			var box = document.getElementById("message-list-box"); 
			let that = this
			box.onscroll = function(){
		   		//变量scrollTop是滚动条滚动时，距离顶部的距离
		   		var scrollTop = box.scrollTop;
		   		//变量windowHeight是可视区的高度
		   		var windowHeight = box.clientHeight;
		   		//变量scrollHeight是滚动条的总高度
		   		var scrollHeight = box.scrollHeight;
                //滚动条到底部的条件
               if(scrollTop+windowHeight==scrollHeight){
                	//写后台加载数据的函数
					if(that.currPage < that.totalPage){
						that.currPage++
						that.getMessageList()
					}
         			//console.log("距顶部"+scrollTop+"可视区高度"+windowHeight+"滚动条总高度"+scrollHeight);
              	}   
       		 }
			
				
		},

		methods: {
			changeMsgTypeRight(type,messageStatus,msgCount){
				if(this.messageType != '' && this.messageType == type){
					this.messageType = ''
				}else{
					this.messageType = type
				}
				this.messageStatus = msgCount == 0?0:2
				this.noReadCount = msgCount
				this.getMessageList(1)
			},
			changeMsgType(type){
				
				if(this.$route.name == 'message-receive-my' && this.$route.query.msgId != undefined){
					this.$router.push({ name: 'message-receive-my' ,query:{mType:this.messageType}})
				
				}else{
					this.typeStatusList.forEach((item,index) => {
						if(item.type == this.messageType){
							this.noReadCount= item.msgCount
						}
					})
					if(this.messageType == ''){
						this.getTypeStatusList()
					}
					this.getMessageList(1)
				}
			
				
				
			},
			getCheckMsgIds(msgId,isCheck){
				//获得所有选中的Id
				let tempCheckList = []
				this.messageList.forEach(item=>{
					if(item.ischeck){
						tempCheckList.push(item.id)
					}
				})
				this.msgCheckList = tempCheckList
			},
			//获得消息列表
			getMessageList(changeType) {
				let that = this;
				that.listLoading = true
				let readType = this.messageStatus
				if(changeType == 1){
					that.currPage == 1
					that.messageList = []
					that.totalCount = 0
					that.totalPage = 0
				}
				getCommHttpData({
					url: 'message/mylist',
					method: 'post',
					contentType: 2,
					data: {
						userId: this.userId,
						type: this.messageType == ''?undefined:this.messageType,
						readType:readType == undefined ? 0:readType,
						page:this.currPage,
						limit:20
					}
				}, function(data) {
					that.listLoading = false
					data.page.list.forEach(item=>{
						item['ischeck'] = false
					})
					
					if(changeType != 1 ){
						let tempArr=[...that.messageList, ...data.page.list]
						that.messageList = tempArr
					}else{
						that.messageList = data.page.list
					}
					
					if(that.$route.query.id != undefined){
						that.messageList.forEach(item =>{
							if(item.id == that.$route.query.id){
								item['isRead'] = 1
							}
						})
					}
					that.totalCount = data.page.totalCount
					that.totalPage =  data.page.totalPage
					that.$forceUpdate();
				})
			},
			//获得已读未读信息
			getTypeStatusList() {
				let that = this;
				getCommHttpData({
					url: 'message/getNotReadCount',
					method: 'post',
					contentType: 2,
					data: {}
				}, function(data) {
					that.typeStatusList = data.list
					that.messageTypeOptions = data.list
					let noReadCount = 0 
					for(let i in data.list){
						noReadCount +=data.list[i].msgCount
						if(that.messageType != '' && that.messageType==data.list[i].type){
							that.noReadCount = data.list[i].msgCount
						}
					}
					if(that.messageType == '' || that.messageType == undefined ){
						that.noReadCount = noReadCount
					}
					
				})
			},
			//查看消息详情
			getMsgDetail(msgId,isRead,id,msgType) {
				this.msgId = msgId
				if(isRead == 0){
					this.setReadMessageList(2,msgId,id)
				}
				this.detailVisible = true
				this.$nextTick(() => {
					if(this.$route.name == 'message-receive-my'){
					
						this.$router.push({ name: 'message-receive-my' ,query:{msgId:this.msgId,page:1,id:id,isRead:isRead,msgType:msgType}})
					}
		      this.$refs.messageDetail.getInitList(msgId,0,id)
		    })
			},
			//标记已读
			setReadMessageList(type,msgId,id) {
				let that = this;
				let ids = type == 0?this.msgCheckList:[id]
				
				if(type == 0 && this.msgCheckList.length ==0){
					this.$message({
			            message: '请选择消息',
			            type: 'error'
			        })
					return
				}
				getCommHttpData({
					url: 'message/setRead',
					method: 'post',
					contentType: 2,
					operateType: id== undefined?2:0,
					data: {
						ids: type==1?undefined:ids,
						type:this.messageType==''?undefined:this.messageType
					}
				}, function(data) {
					if(type != 2){
						that.getMessageList(1)
						that.getTypeStatusList()
					}else{
						//直接改变list的值
						that.messageList.forEach(item =>{
							if(item.id == id){
								item['isRead'] = 1
							}
						})
						that.getTypeStatusList(1)
						that.$forceUpdate();
					}
				})
			},
			//删除消息
			deleteData() {
				var that = this
				let ids = this.msgCheckList
				if(this.msgCheckList.length ==0){
					this.$message({
			            message: '请选择消息',
			            type: 'error'
			        })
					return
				}
				deleteData(this, {
					msg: '您确定删除所选消息吗?',
					delJson: {
						url: 'message/deleteMyMsg',
						method: 'post',
						contentType: 2,
						operateType: 1,
						data: {
							ids: ids
						}
					}
				}, function(data) {
					that.msgCheckList= []
					that.detailVisible = false
					that.getMessageList(1)
					that.getTypeStatusList(1)
				})
			}
		}
	}
</script>