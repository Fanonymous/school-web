<template>
	<!--查看详情-->
	
	<el-card shadow="hover" class="margin-bottom-10">
		<div class="message-title">
			<template v-if="msgType == 1 && messageInfo.enable == 0">
				<div  class="" style="border-bottom:1px #e6e6e6 solid;margin: 0px 0px 10px 0px;">
					<el-button type="primary"  size="small" @click="recallHandle" class="margin-bottom-10">撤回</el-button>
					<i class="el-icon-close" @click="closeDetail" style="float: right;cursor: pointer;"></i>
				</div>
				{{messageInfo.title || '/'}}
			</template>
			<template v-else>
				{{messageInfo.title || '/'}}
				<i class="el-icon-close" @click="closeDetail" style="float: right;cursor: pointer;"></i>
			</template>
		</div>
		<div class="message-subtitle">
			发送时间：{{messageInfo.sendTime || '/'}} &nbsp;&nbsp;
			<template v-if="msgType == 0">发送者：{{messageInfo.sendUserName || '/'}}</template>
			<template v-else>收件人：{{messageInfo.receiveName || '/'}}&nbsp;&nbsp;
				<template v-if="messageInfo.enable == -1">已撤回</template>
				<template v-else>已读率：{{messageInfo.readRate || '/'}}%</template>
				&nbsp;&nbsp;<el-button type="text" @click="showMoreInfo">详情&nbsp;<i class="el-icon-arrow-down" v-if="isDetail"></i><i class="el-icon-arrow-up" v-else></i></el-button></template>
			<template v-if="isDetail">
				<div  v-if="messageInfo.notReadReceiveName.length >0">
					未读：<el-tag v-for="(item,index) in messageInfo.notReadReceiveName" type="danger" v-if="index < notReadPage*30" >{{item}}</el-tag> <el-button type="text"  v-if="notReadPage < totalNotPage" @click="notReadPage<notReadTotal? notReadPage++:notReadTotal">更多</el-button>
				</div>
				<div v-if="messageInfo.readReceiveName.length >0">
					 已读：<el-tag v-for="(item,index) in messageInfo.readReceiveName" v-if="index <= readPage*30" type="success">{{item}}</el-tag><el-button type="text" v-if="readPage < totalReadPage" @click="readPage<readTotal?readPage++:readTotal">更多</el-button>
				</div>
			</template>
		</div>
		<template v-if="msgType == 1" >
			<div v-if="messageInfo.enable == -1" class="message-content2" v-html='messageInfo.content'></div>
			<template v-else>
				<div v-if="messageInfo.attachmentFile == null ||( messageInfo.attachmentFile !=null && messageInfo.attachmentFile.length ==0)" class="message-content" v-html='messageInfo.content'></div>
				<div v-else class="message-content-1" v-html='messageInfo.content'></div>
			</template>
		</template>
		<template v-else>
			<div v-if="messageInfo.attachmentFile == null ||(messageInfo.attachmentFile !=null && messageInfo.attachmentFile.length ==0)" class="message-content1" v-html='messageInfo.content'></div>
			<div v-else class="message-content1-1" v-html='messageInfo.content'></div>
		</template>
		<div v-if="messageInfo.attachmentFile !=null && messageInfo.attachmentFile.length > 0" style="border-top: 1px #e6e6e6 solid;padding-top:10px ;">
			
			<el-col :lg="24">
				<i class="el-icon-link"></i>&nbsp;&nbsp;附件{{messageInfo.attachmentFile.length}} 个（{{attachmentFileSize  | dateFilter}}）
				<!--<el-button type="text">打包下载</el-button>-->
			</el-col>	
		
			<el-col v-for="item in messageInfo.attachmentFile" :lg="8" >
				<div class="message-file" :title="item.fileName">
				<img src="~@/assets/img/file/doc.png" v-if="item.fileType == 'doc'" class="file-img" />
				<img src="~@/assets/img/file/docm.png"  v-else-if="item.fileType == 'docm'" class="file-img"/>
				<img src="~@/assets/img/file/docx.png"  v-else-if="item.fileType == 'docx'" class="file-img"/>
				<img src="~@/assets/img/file/dos.png"  v-else-if="item.fileType == 'dos'" class="file-img"/>
				<img src="~@/assets/img/file/dot1.png"  v-else-if="item.fileType == 'dot'" class="file-img"/>
				<img src="~@/assets/img/file/exe.png"  v-else-if="item.fileType == 'exe'" class="file-img"/>
				<img src="~@/assets/img/file/flash.png"  v-else-if="item.fileType == 'flash'" class="file-img"/>
				<img src="~@/assets/img/file/flv.png"  v-else-if="item.fileType == 'flv'"  class="file-img"/>
				<img src="~@/assets/img/file/folder.png"  v-else-if="item.fileType == 'folder'" class="file-img"/>
				<img src="~@/assets/img/file/gif.png"  v-else-if="item.fileType == 'gif'" class="file-img"/>
				<img src="~@/assets/img/file/gsp.png"  v-else-if="item.fileType == 'gsp'" class="file-img"/>
				<img src="~@/assets/img/file/jpg.png"  v-else-if="item.fileType == 'jpg'" class="file-img"/>
				<img src="~@/assets/img/file/mav.png"  v-else-if="item.fileType == 'mav'" class="file-img"/>
				<img src="~@/assets/img/file/mkv.png"  v-else-if="item.fileType == 'mkv'" class="file-img"/>
				<img src="~@/assets/img/file/mp3.png"  v-else-if="item.fileType == 'mp3'" class="file-img"/>

				<img src="~@/assets/img/file/mp4.png"  v-else-if="item.fileType == 'mp4'" class="file-img"/>
				<img src="~@/assets/img/file/mpg.png"  v-else-if="item.fileType == 'mpg'" class="file-img"/>
				<img src="~@/assets/img/file/pdf.png"  v-else-if="item.fileType == 'pdf'" class="file-img"/>
				<img src="~@/assets/img/file/png.png"  v-else-if="item.fileType == 'png'" class="file-img"/>
				<img src="~@/assets/img/file/pot.png"  v-else-if="item.fileType == 'pot'" class="file-img"/>
				<img src="~@/assets/img/file/potm.png" v-else-if="item.fileType == 'potm'" class="file-img"/>
				<img src="~@/assets/img/file/ppt.png"  v-else-if="item.fileType == 'ppt'" class="file-img"/>
				<img src="~@/assets/img/file/pptm.png" v-else-if="item.fileType == 'pptm'" class="file-img"/>
				<img src="~@/assets/img/file/pptx.png" v-else-if="item.fileType == 'pptx'" class="file-img"/>
				<img src="~@/assets/img/file/rar.png"  v-else-if="item.fileType == 'rar'" class="file-img"/>
				<img src="~@/assets/img/file/rmvb.png" v-else-if="item.fileType == 'rmvb'" class="file-img"/>
				<img src="~@/assets/img/file/swf.png"  v-else-if="item.fileType == 'swf'" class="file-img"/>
				<img src="~@/assets/img/file/wav.png"  v-else-if="item.fileType == 'wav'" class="file-img"/>
				<img src="~@/assets/img/file/wma.png"  v-else-if="item.fileType == 'wma'" class="file-img"/>
				<img src="~@/assets/img/file/xls.png"  v-else-if="item.fileType == 'xls'" class="file-img"/>
				<img src="~@/assets/img/file/xlsm.png" v-else-if="item.fileType == 'xlsm'" class="file-img"/>
				<img src="~@/assets/img/file/zip.png"  v-else-if="item.fileType == 'zip'" class="file-img"/>
				<img src="~@/assets/img/file/other.png"  v-else class="file-img"/>
				{{item.fileName | fileNameFilter}}（{{item.fileSize | dateFilter}}）
				<img src="~@/assets/img/down.png" style="cursor: pointer;font-weight: bolder;width: 18px;"  @click="downloadFile(item.filePath,item.fileName)" />
				<!--<i @click="downloadFile(item.filePath,item.fileName)" class="el-icon-download" style="cursor: pointer;font-weight: bolder;"></i>-->
				</div>
			</el-col>
		</div>
	</el-card>
		
</template>
<style>
	.message-title{
		font-size: 20px;
	}
	.message-subtitle{
		font-size: 14px;
		color: #808080;
	}
	.message-hr{
		background-color: #e6e6e6;
		color: #e6e6e6;
	}
	.el-tag{
		margin: 5px;
	}
</style>
<script>
	import { getCommHttpData} from '@/utils/common'
	
	export default {
		data() {
			return {
				userId: this.GLOBAL.getUserId(),
				schoolId: this.GLOBAL.getOrgId(),
				msgId:'',
				msgType:0,
				isDetail:false,
				notReadPage:1,
				notReadTotal:1,
				totalNotPage:1,
				readPage:1,
				readTotal:1,
				totalReadPage:1,
				messageInfo:{
					title:'',
					sendName:'',
					sendTime:'',
					content:''
				},
				attachmentFileSize:0
				
			}
		},
		filters:{
			fileNameFilter(name){
				let str = name.split('.')
				let strName = ''
				if(str[0].length > 10){
					strName = str[0].substr(0,6)+'...'+str[1]
				}else{
					strName = name.toString()
				}
				return strName
			},
			dateFilter(item){
				let temp = ''
				if(item < 1024){
					//字节
					temp = item+'B'
				}else if(item >= 1024 && item < 1024*1024){
					//kb
					temp = parseFloat(item/1024).toFixed(2)+'KB'
				}else if(item >= 1024*1024 && item < 1024*1024*1024){
					//mb
					temp = parseFloat(item/(1024*1024)).toFixed(2)+'MB'
				}else{
					//gb
					temp = parseFloat(item/(1024*1024*1024)).toFixed(2)+'GB'
				}
				return temp
			}
		},
		mounted() {
			//this.getInitList()
		},
		methods: {
			//初始化
			getInitList(id,type){
				let that = this;
				that.msgType = type
				that.msgId = id
				getCommHttpData({
					url: 'message/getMessageDetail',
					method: 'post',
					contentType: 2,
					data: {msgId:id}
				}, function(data) {
					that.isDetail = false
					//总条数
					that.notReadTotal = data.data.notReadReceiveName.length
					that.readTotal = data.data.readReceiveName.length
					
					that.messageInfo =  data.data

					let notReadReceiveLen =data.data.notReadReceiveName.length
					notReadReceiveLen = notReadReceiveLen==0?0:notReadReceiveLen/30
				
					let readReceiveLen =data.data.readReceiveName.length
					readReceiveLen = readReceiveLen==0?0:readReceiveLen/30
					
					let notTotal = parseInt(notReadReceiveLen)
					let total = parseInt(readReceiveLen)
					//总页数
					that.totalNotPage = notReadReceiveLen > notTotal ?notTotal+1:notTotal
					that.totalReadPage =  readReceiveLen > total ?total+1:total		
					let tempTotal = 0
					if(data.data.attachmentFile != null && data.data.attachmentFile.length >0){
						data.data.attachmentFile.forEach(item=>{
							tempTotal+=parseInt(item.fileSize)
						})
						that.attachmentFileSize = tempTotal
					}
					
					
				})
			},
			//关闭
			closeDetail(){
				this.$emit('refreshCloseDetail')
			},
			//撤回
			recallHandle(){
				let that = this;
				let msg = parseInt(this.messageInfo.readRate) == 0?'确定撤回此通知吗？':'此通知已被阅读，不可撤回！'
				this.$confirm(msg+'<div style="color:#808080;margin-top:15px;">仅支持撤回未阅读的通知</div>', '通知撤回', {
					dangerouslyUseHTMLString: true,
			        confirmButtonText: '确定',
			        cancelButtonText: '取消',
			        type: ''
			    }).then(() => {
			    	if(parseInt(this.messageInfo.readRate) == 0){
			    		getCommHttpData({
							url: 'message/recall',
							method: 'post',
							contentType: 2,
							that:this,
							operateType:2,
							data: {msgId:that.msgId}
						}, function(data) {
							that.getInitList(that.msgId,1)
							that.$emit('refreshCloseDetail',1)
						})
			    	}
			    	
			    }).catch(() => {
//			      this.$message({
//			        type: 'info',
//			        message: cancelMsg
//			      });
			    });
				
				
			},
			//显示更多信息  已读，未读
			showMoreInfo(){
				if(this.isDetail){
					this.isDetail = false
				}else{
					this.isDetail = true
					this.notReadPage = 1
					this.readPage = 1
				}
			},
			downloadFile(messageURL,messageName){
				messageName = messageName.split('.')
				window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia+'file/common/getMenuFile?filePath='+messageURL+'&fileName='+messageName[0]));
				
			}
		}
	}
</script>