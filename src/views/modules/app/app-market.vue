<template>
	<div class="app-market">
		<el-tabs v-model="activeName" @tab-click="handleClick" style="padding: 15px;background: white;">
			<el-tab-pane label="首页" name="first">
				<el-row>
					<el-col :span="24">
						<el-carousel>
							<el-carousel-item v-for="item in imgShow" :key="item.id">
								<img :src="item.url" style="width: 100%;height:100%;" />
							</el-carousel-item>
						</el-carousel>
					</el-col>
				</el-row>
				<el-row :gutter="40" class="thebig">
					<el-col :span="18" >
						<div class="youLike">
							<h3>猜您喜欢</h3>
							<el-row :gutter="20" style="margin: 0 15px">
								<el-col :lg="8" v-for="(item, index) in appList.likeList" :key="index" class="theLit" style="padding-top: 10px;padding-bottom: 10px;">
									<div class="left" >
										<img v-real-img="imgUrl+item.icon" :src="allPic" class="icImg" />
									</div>
									<div class="theRight">
										<header>{{item.applicationName}}</header>
										<el-rate v-model="item.score" class="theStar" disabled></el-rate>
										<div class="useNum"><span>{{item.useNum || 0}}</span>人使用</div>
									</div>
								</el-col>
							</el-row>
						</div>
						<div class="theNow">
							<h3>最新上线</h3>
							<el-row :gutter="20" style="margin: 0 15px">
								<el-col :lg="8" v-for="item in appList.newList" class="theLit" style="padding-top: 10px;padding-bottom: 10px;">
									<div class="left">
										<img v-real-img="imgUrl+item.icon" :src="allPic" class="icImg" />
									</div>
									<div class="theRight">
										<header>{{item.applicationName}}</header>
										<el-rate v-model="item.score" class="theStar" disabled></el-rate>
										<div class="useNum"><span>{{item.useNum || 0}}</span>人使用</div>
									</div>
								</el-col>
							</el-row>
						</div>
					</el-col>
					<el-col :span="6" class="theHot">
						<h4>热门应用</h4>
						<div class="theone" v-for="(item,index) in appList.hotList">
							<div class="oneleft" >
								<span :class="{'current-span' : index>2}" style="display: inline-block;">{{index+1}}</span>
								<img  v-if="index==0" v-real-img="imgUrl+item.icon" :src="allPic" class="oneicImg"/>
							</div>
							<div class="oneRight">
								<header class="theApp" >{{item.applicationName}}</header>
								<div v-if="index==0" class="theOnly" style="font-size: 12px;color:#a5a5a5">{{item.introduction}}</div>
							</div>
							<div class="useNum" style="float: right;padding-top: 20px;padding-right: 10px;"><span>{{item.useNum || 0}}</span>人使用</div>
						</div>
						
					</el-col>	
				</el-row>
				<el-row >
					<el-col :span="24">
							<h3>教学应用</h3>
							<el-row :gutter="20" style="margin: 0 15px">
								<el-col :lg="6" v-for="item in appList.teachList" class="theLit" style="padding-top: 10px;padding-bottom: 10px;">
									<div class="left" >
										<img v-real-img="imgUrl+item.icon" :src="allPic" class="icImg" />
									</div>
									<div class="theRight">
										<header>{{item.applicationName}}</header>
										<el-rate v-model="item.score" class="theStar" disabled></el-rate>
										<div class="useNum"><span>{{item.useNum || 0}}</span>人使用</div>
										
									</div>
								</el-col>
						</el-row>
					</el-col>	
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="全部应用" name="second">
				<el-row >
					<el-col :span="24">
						<el-select placeholder="全部应用" clearable @change="getAllapp" v-model="appId" class="sele">
							<el-option v-for="item in appName" :key="item.value" autofocus="thefocus" :label="item.dictName" :value="item.value">
							</el-option>
						</el-select>
						<el-input v-model="keywords" placeholder="请输入名称搜索"  @input="getAllapp" clearable class="inp"></el-input>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<template v-if="appData.length > 0">
						<el-col  :lg="12"  v-for="item in appData" >
							<el-row class="allApp">
								<el-col class="left"  :span="2">
									<img v-lazy="imgUrl+item.icon" :key="imgUrl+item.icon" class="icImg">
								        <!--<img v-real-img="imgUrl+item.icon" :src="allPic" class="icImg" />-->
								</el-col>
								<el-col class="theRight" :span="19">
									<header>{{item.applicationName}}</header>
									<el-rate v-model="item.score" class="theStar" disabled></el-rate>
									<span class="useNum"><span>{{item.useNum || 0}}</span>人使用</span>
									<div  class="theIntrod" style="font-size: 12px;color:#a5a5a5;">{{item.introduction}}</div>
								</el-col>
							</el-row>
						</el-col>	
					</template>
					<template v-else>
						<el-col :lg="24">
							<div class="app-nodata">
								<div><img src="~@/assets/img/nodata2.png" alt="" width="280px" style="margin-bottom: 20px;" /></div>
								暂无应用
							</div>
						</el-col>
					</template>
					
				</el-row>
				<el-pagination @size-change="sizeChangeHandle" background @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, deleteData, getExportFile } from '@/utils/common'
	import allPic from '@/assets/img/all.png'   
	export default {
		data() {
			return {
				imgUrl:window.SITE_CONFIG.imgIP,
				allPic:allPic,
				activeName: 'first',
				appList:[],
				keywords:'',
				appName:[],
				appId:'',
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				appData:[],
				thefocus:false,
				imgShow: [{
					id: 1,
					url:require('../../../assets/img/appb.png')
				}, {
					id: 2,
					url:require('../../../assets/img/app2.png')
				}],
			}
		},
		mounted() {
			this.getAppName();
			this.getApp();
			this.getAllapp()
		},
		methods: {
			handleClick(tab, event) {
				console.log(tab, event);
			},
			getApp(){
				let that=this;
		    		getCommHttpData({
					url: 'applicationStore/recommendList',
					method: 'get',
					contentType:1,
//					data:{
//					},
				}, function(data) {
					if(data.code==0){
						that.appList=data
					}
					
				})
		},
			getAppName(){
					getCommonDictByType(this, 'app_type', 'appName');
			},
			getAllapp(){
				this.keywords = this.keywords == '' ? undefined : this.keywords;
				this.appId = this.appId == '' ? undefined : this.appId;
				let that=this;
				getCommHttpData({
					url: 'applicationStore/allList',
					method: 'get',
					contentType: 1,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						keywords: this.keywords,
						type:this.appId
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndex != 1) {
							that.pageIndex = 1
							that.getAllapp()
						}
						that.appData = data.page.list
						that.totalPage = data.page.totalCount
					} else {
						that.appData = []
						that.totalPage = 0
					}
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getAllapp()
			},
			// 当前页
			currentChangeHandle(val) {

				this.pageIndex = val
				this.getAllapp()
			},
		}
	}
</script>

<style scoped lang="scss">
	.app-nodata{
		text-align: center;
		margin-top: 20px;
		padding: 20px;
    }
    @media screen and (max-width: 1280px) {
        header{
            max-width: 135px;
        }
    }
	header{
		overflow:hidden; 
		white-space:nowrap; 
		text-overflow:ellipsis
	}
	.thebig{
		padding-top: 20px;
	}
	#tab-first {
		padding-left: 20px;
		padding-right: 50px;
	}
	#tab-second {
		padding-left: 30px;
		padding-right: 20px;
	}
	.theLit{
		// position: relative;
        height: 100px;
        display: flex;
	}
	.theOnly{
		padding-top: 5px;
		width: 100px;
		overflow:hidden; 
		white-space:nowrap; 
		text-overflow:ellipsis
	}
	.theApp{
		width: 110px;
		overflow:hidden; 
		white-space:nowrap; 
		text-overflow:ellipsis
	}
    @media screen and (max-width: 1400px){
        .oneicImg{
            display: none;
        }
        .theOnly{
            max-width: 90px;
        }
        .theApp{
            max-width: 80px !important;
        }
    }
	.theLit:hover{
		cursor: pointer;
		border: 1px solid #3C85EE;
		box-shadow:3px 3px 3px 3px #d0d0d0;
	}
	.inp {
		width: 200px;
		float: right;
		margin-right: 10px;
	}
	
	.sele {
		width: 150px;
		float: right;
	}
	/*.oneleft{
		width:100%
	}*/
	.current-span{
		background: #fff !important;
		color: #9f9f9f !important;
	}
	.oneleft span{
		/*vertical-align: middle;*/
		margin-right: 10px;
		margin-top: 15px;
		text-align: center;
		line-height: 26px;
		width: 25px;
		height: 25px;
		border-radius: 50%;
		background: #ffaf57;
		font-weight: 600;
		color: white;
	}
	.theIntrod{
		/*text-indent: 1em;*/
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp:2;
		overflow: hidden;
		 text-overflow: ellipsis;
		width:100%;
	}
	h3{
		padding: 5px 15px;
		border-bottom: 1px solid #f1f4f5;
		border-left: 5px solid #3C85EE;
	}
	h4{
		padding: 5px 15px;
		border-left: 5px solid #3C85EE;
		border-bottom: 1px solid #f1f4f5;
	}
	.left{
		width:80px;
		height: 80px;
		border-radius: 5px;
	}
	.theone{
		width:100%;
		padding-bottom:5px;
	}
	/*.el-carousel__container{
		height:400px;
	}*/
	.oneleft{
		float: left;
	}
	.oneRight{
		display: inline-block;
		padding-top: 20px;
		padding-left: 10px;
	}
	.theRight{
        padding: 5px 0 0 10px;
        flex-grow: 1;

	}
	.icImg{
		width:80px;
		height: 80px;
		border-radius: 5px;
	}
	.oneicImg{
		width:50px;
		height: 50px;
		border-radius: 5px;
	}
	.useNum{
		color:#a5a5a5
	}
	.useNum span{
		color:#59e26a;
		font-weight: 600;
	}
	.theStar{
		padding-top: 10px;
		padding-bottom: 30px;
	}
	h4{
		padding-left:30px ;
		padding-top: 5px;
	}
	.theHot{
		/*border:1px solid #f1f4f5;*/
		padding-right: 0;
	}
	.allApp{
		height: 136px;
		border:1px solid #f1f4f5;
		padding: 20px;
		padding-right: 0;
		padding-bottom: 40px;
		margin-bottom: 10px;
		margin-top: 10px;
	}
	.allApp:hover{
		cursor: pointer;
		/*height: 137px;*/
		border: 2px solid #3C85EE;
		box-shadow:3px 3px 3px 3px #d0d0d0;
	}
</style>