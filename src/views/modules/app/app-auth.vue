<template>
	<div class="app-auth">
		<el-row :gutter="12" style="margin-top: 10px;">
			<el-col :span="6">
				<el-card shadow="hover">
					<div class="analysis-body">
						<div class="body-icon primary"><img src="~@/assets/img/app-auth.png" /></div>
						<div class="body-text">
							<div class="kpi-text"><span class="kpi-value">{{commonData.total =='' ? 0 : commonData.total}}</span>个</div>
							<div class="kpi-text" style="margin : 0">可管理的应用</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card shadow="hover">
					<div class="analysis-body">
						<div class="body-icon red"><img src="~@/assets/img/disbale.png" /></div>
						<div class="body-text">
							<div class="kpi-text"><span class="kpi-value">{{commonData.disabledNum == '' ? 0 : commonData.disabledNum}}</span>项</div>
							<div class="kpi-text" style="margin : 0">不可用权限</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card shadow="hover">
					<div class="analysis-body">
						<div class="body-icon blue"><img src="~@/assets/img/read.png" /></div>
						<div class="body-text">
							<div class="kpi-text"><span class="kpi-value">{{commonData.readNum == '' ? 0 : commonData.readNum}}</span>项</div>
							<div class="kpi-text" style="margin : 0">可读权限</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card shadow="hover">
					<div class="analysis-body">
						<div class="body-icon green"><img src="~@/assets/img/wr-read.png" /></div>
						<div class="body-text">
							<div class="kpi-text"><span class="kpi-value">{{commonData.readWriteNum == '' ? 0 : commonData.readWriteNum}}</span>项</div>
							<div class="kpi-text" style="margin : 0">可读写权限</div>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<el-card style="margin-top: 10px;">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="应用视图" name="first">
					<el-row :gutter="20">
						<el-col :span="12" :lg="12" v-for="(item, index) in appViewList" :key="index">
							<span v-popover:popoverfile></span>
							<el-row class="allApp">
								<img v-real-img="imgUrl+item.icon" :src="allPic" class="icImg" />
							
								<div class="theRight">
									<header>{{item.applicationName}}</header>
									<div class="theIntrod">
										共<span class="font-primary">{{item.authorizeNum}}</span>个权限，不可用
										<span class="font-primary">{{item.disabledNum}}</span>个， 可读
										<span class="font-primary">{{item.readNum}}</span>个， 可读写
										<span class="font-primary">{{item.readWriteNum}}</span>个
									</div>
								</div>
								<el-button class="btn-primary" type="primary" @click="editFilename($event,item.authorizeAppliationDataEntityList,item.applicationId,item.applicationName)">设置权限</el-button>
							</el-row>
						</el-col>
						<el-popover ref="popoverfile" popper-class="aside-popover" placement="right" width="350" v-model="dialogFormVisible" transition="fade-in-linear" trigger="click">
							<div v-loading="isLoading" class="app-popper__right app-poper_auth" :style="'height: '+appHeight+'px'">
								<div class="app-popover-title">设置权限/{{popoverName}}</div>
								<el-form ref="dataForm" label-position="left" label-width="180px">
									<el-form-item :label="activeName == 'first' ? '数据类型' : '应用名称'" class="app-popover-form-title">
										权限
									</el-form-item>
									<div :style="'height: '+(appHeight-225)+'px;overflow: auto'">
										<el-form-item :label="activeName == 'first' ? item.dataName : item.applicationName" class="app-popover-form-item" v-for="(item, index) in popoverList">
											<el-radio-group v-model="popoverList[index].status">
												<el-radio label="1">不可用</el-radio>
												<el-radio label="2">可读</el-radio>
												<el-radio label="3">可读写</el-radio>
											</el-radio-group>
										</el-form-item>
									</div>
								</el-form> 
								<div slot="footer" class="popper-footer">
									<el-button type="primary" @click="saveCardData" :loading="addLoading">保存</el-button>
									<el-button @click="dialogFormVisible = false">取消</el-button>
								</div>
							</div>
						</el-popover>
					</el-row>
				</el-tab-pane>
				<el-tab-pane label="数据视图" name="second">
					<el-row :gutter="20">
						<el-col :span="12" :lg="12" v-for="item in dataViewList">
							<el-row class="allApp">
								<div class="icImg img-radius bg-img">
									{{item.dataName == '' ? '-' : item.dataName.substr(0,1)}}
								</div>
								<div class="theRight">
									<header>{{item.dataName}}</header>
									<div class="theIntrod">
										共<span class="font-primary">{{item.authorizeNum}}</span>个权限，不可用
										<span class="font-primary">{{item.disabledNum}}</span>个， 可读
										<span class="font-primary">{{item.readNum}}</span>个， 可读写
										<span class="font-primary">{{item.readWriteNum}}</span>个
									</div>
								</div>
								<el-button class="btn-primary" type="primary" @click="editFilename($event,item.authorizeAppliationDataEntityList,item.dataId,item.dataName)">设置权限</el-button>
							</el-row>
						</el-col>
					</el-row>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
	import mediacss from '@/assets/scss/media.scss'
	import { getCommHttpData, getCommonDictByType } from '@/utils/common'
	import allPic from '@/assets/img/all.png'
	export default {
		data() {
			return {
				imgUrl: window.SITE_CONFIG.imgIP,
				defaultImg: 'this.src="' + require('../../../assets/img/all.png') + '";this.onerror = null',
				activeName: 'first',
				allPic:allPic,
				appViewList: [],
				dataViewList:[],
				popoverList :[],
				dialogFormVisible: false,
				appHeight: 800,
				addLoading: false,
				commonData:{
					total:0,
					disabledNum:0,
					readNum:0,
					readWriteNum:0
				},
				checkedList:[],
				isLoading:false,
				popoverName:''
			}
		},
		mounted() {
			window.addEventListener('resize', () => {
				this.appHeight = window.innerHeight - 50
			})
			this.appHeight = window.innerHeight - 50
			this.getAppViewList();
			this.getDataViewList();
		},
		methods: {
			editFilename($event,list,applicationId,name) {
				let popoverList = this.popoverList;
				this.popoverName = name
				let that = this
				that.checkedList = list
				if(that.activeName == 'first'){
					that.popoverList = popoverList.map(item=>{
						item.applicationId = applicationId;
						item.status = null;
						if(list){
							list.forEach(item2=>{
								if(item.dataId == item2.dataId){
									item.status = item2.status.toString();
								}
							})	
						}
						return item
					})	
				}else{
					that.popoverList = popoverList.map(item=>{
						item.dataId = applicationId;
						item.status = null;
						if(list){
							list.forEach(item2=>{
								if(item.applicationId == item2.applicationId){
									item.status = item2.status.toString();
								}
							})	
						}
						return item
					})
				}
				setTimeout(()=>{
					that.dialogFormVisible = true;
					that.$nextTick(() => {
						let pop = this.$refs['popoverfile'];
						pop.popperJS._reference = $event.target;
						pop.popperJS.state.position = pop.popperJS._getPosition(pop.popperJS._popper, pop.popperJS._reference);
						pop.popperJS.update()
					})
				},500)
			},
			saveCardData() {
				this.cardLoading = true
				let that = this
				that.addLoading = true
				that.isLoading = true 
				let list = []
				this.popoverList.forEach(item=>{
					list.push({
						applicationId: item.applicationId,
						dataId: item.dataId,
						status: item.status
					})
				})

				getCommHttpData({
					url: 'sys/authorizeapplication/saveRel',
					method: 'post',
					contentType: 2,
					operateType: 2,
					that: this,
					data: {
						list:list
					},
				}, function(data) {
					that.dialogFormVisible = false
					that.addLoading = false
					that.isLoading = false
					if(that.activeName == 'first'){
						that.getAppViewList()	
					}else{
						that.getDataViewList()
					}
				})
			},
			handleClick(tab, event) {
				this.popoverList = this.activeName == 'first' ? this.dataViewList : this.appViewList
			},
			getAppViewList() {
				let that = this;
				getCommHttpData({
					url: 'sys/authorizeapplication/appViewList',
					method: 'GET',
					contentType: 1,
				}, function(data) {
					if(data.code == 0) {
						that.appViewList = data.list;
						if(data.page){
							that.commonData = data.page;	
						}
						if(that.activeName == 'second'){
							that.popoverList = data.list	
						}
					}

				})
			},
			getDataViewList() {
				let that = this;
				getCommHttpData({
					url: 'sys/authorizeapplication/dataViewList',
					method: 'GET',
					contentType: 1,
				}, function(data) {
					if(data.code == 0) {
						let list = data.list;
						that.dataViewList = list;
						if(that.activeName == 'first'){
							that.popoverList = list	
						}
					}

				})
			},
		}
	}
</script>
<style scoped lang="scss">
	.btn-primary {
		position: absolute;
		top: 51px;
		right: 51px;
		height: 34px;
	}
	
	header {
		font-size: 16px;
		color: #4d4d4d;
	}
	
	.font-primary {
		color: #30b8ac;
	}
	
	.theIntrod {
		margin-top: 27px;
		font-size: 14px;
		line-height: 23px;
		color: #808080;
	}
	
	.theRight {
		display: flex;
		flex-direction: column;
		margin-left: 110px;
		padding: 15px;
	}
	
	.icImg {
		width: 100px;
		height: 100px;
		border-radius: 5px;
		position: absolute;
	}
	
	.img-radius {
		border-radius: 50px;
	}
	
	.allApp {
		height: 147px;
		border: 1px solid #e6e6e6;
		padding: 25px;
		margin-bottom: 20px;
		margin-top: 20px;
		position: relative;
	}
	
	.allApp:hover {
		cursor: pointer;
		/*height: 137px;*/
		border: 2px solid #3C85EE;
		box-shadow: 3px 3px 3px 3px #d0d0d0;
	}
	
	.app-popper__right {
		position: fixed;
		right: 0px;
		width: 508px;
		background-color: #FFFFFF;
		padding: 20px;
		box-shadow: -4px 0px 4px #cccccc;
	}
	
	.app-popper__right .app-popover-title {
		font-size: 16px;
		margin: 0px 0px 10px 0px;
	}
	
	.popper-footer {
		width: 470px;
		padding-top: 27px;
		border-top: 1px solid #e6e6e6;
		position: absolute;
		bottom: 27px;
		overflow: hidden;
	}
	
	.el-form-item {
		margin-bottom: 0;
	}
	
	.app-popover-form-title {
		border-bottom: 1px solid #E6E6E6;
		/*border-top: 1px solid #E6E6E6;*/
		margin-bottom: 10px;
		margin-top: 10px;
		padding-top: 5px;
		padding-bottom: 5px;
	}
	.bg-img{
		background: url(~@/assets/img/circle.png);
		background-size: 100% 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ffffff;
		font-size: 24px;
	}
</style>