<template>
	<div>
		<aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
			<div class="site-sidebar__inner site-sidebar__inner-first">
				<el-menu :default-active="menuActiveName || 'home'" index="1" :collapse="sidebarFold" :collapseTransition="false" class="site-sidebar__menu">

					<el-popover popper-class="aside-popover" @show="productShow=false,popperWidth=200" placement="right" width="popperWidth" v-model="visible2" transition="fade-in-linear" trigger="hover">
						<div slot="reference">
							<el-button type="text" class="home-menu-icon">
								<img src="~@/assets/img/icons/icon.png" class="site-sidebar__menu-icon icon-white" width="20px" height="20px"  @mouseover="showProductList"/>
							</el-button>

							<template v-for="(menu,index) in collectMenuList">
								<el-button type="text" class="home-menu-icon">
									<img v-real-img="imgUrl+menu.iconPath" :src="defaultImg" width="20px" height="20px" />
								</el-button>
							</template>
						</div>
						<!--收藏菜单-->
						<div  :style=" 'height: '+sideHeight+'px;margin-left: 0px;padding: -12px;overflow: hidden;'" >
							<div :style="'width:200px;height:100%;float: left;font-size:14px;overflow: auto; background-color: '+backColor+';color: #FFFFFF;'">
								<div class="aside-left-menu" style="height:100%">
									<div class="left-popover active" style="position: relative; color: #FFFFFF;" @mouseover="keywords='',isInput=false,productShow=true,popperWidth=1100,sideWidth=1100">
										<span class="left-popover-icon" style="position: absolute; top: 14px;left: 22px;">
											<img src="~@/assets/img/icons/icon.png" class="site-sidebar__menu-icon icon-white" width="20px" height="20px" />
				    				    </span>
										<span style="position: absolute; left: 65px; top: 15px;">产品与服务</span>
										<i class="el-icon-arrow-right right" style="margin-top: 18px; margin-right: 10px;"></i>
									</div>
									<template v-for="(menu,index) in collectMenuList">
										<div class="left-popover" style="position: relative;"  @click="productChange(menu.productId,'','',menu.menuId)">

											<span class="left-popover-icon" style="position: absolute; top: 15px;left: 22px;">
						    				      <img v-real-img="imgUrl+menu.iconPath" :src="defaultImg" width="20px" height="20px"/>
						    				    </span>
											<span style="position: absolute; left: 65px; top: 15px;">{{menu.menuName.length > 6 ? menu.menuName.substr(0,6)+'...': menu.menuName}}</span>
											<i class="el-collect_icon el-icon el-icon-close" @click.stop="cancelCollect(menu.productId,menu.menuId,index)"></i>
										</div>
									</template>
								</div>
							</div>
							<!--菜单列表-->
							<div class="product-list" v-show="productShow" :style="'height:100%;min-height: '+sideHeight+'px;overflow: auto; width:'+sideWidthLeft+'px;position: relative;'">
								<div :style="'position: fixed;height: 60px;width:'+sideWidthLeft+'px; background-color: #FFFFFF;z-index:8888;'">
									<el-radio-group v-model="applicationSort"  style="padding: 10px 0px 0px 25px;" @change="applicationSortChange">
										<el-radio-button key="0" label="0" value="0" v-if="appSortList.length>0">全部服务</el-radio-button>
										<el-radio-button v-for="item in appSortList" :key="item.value" :label="item.value" :value="item.value">{{item.dictName}}</el-radio-button>
									</el-radio-group>
									<span style="float:right;right:190px;top:50px;padding-top:15px;font-size: 18px;padding-left: 30px; padding-right: 20px;cursor: pointer;" @click="showBig"><i class="el-dialog__close el-icon el-icon-close"></i></span>
									<i class="el-icon-search" v-if="isInput==false" style="float:right;right:240px;margin-top:20px;cursor: pointer;" @mouseover="isInput=true"></i>
									<el-input v-if="isInput == true" @mouseout.native="showSearch()" v-model.trim="keywords" prefix-icon="el-icon-search" clearable placeholder="请输入名称搜索应用" class="keywords"></el-input>
								</div>

								<div v-if="productList.length == 0" style="width:100%; text-align: center;">
									<div style="width:160px;height:200px;margin: 35% 0px 0px 400px;font-size: 16px;color:#CCCCCC;">
										<div class="margin-bottom-20"><img src="~@/assets/img/datano.png"/></div>
										<div>暂无数据</div>
									</div>
								</div>
								<div v-else style="display: inline-block; margin-top: 60px;">
								<div v-loading="dataListLoading" class="product-cont-waterfall" :style="'width: '+(sideWidthLeft-50)+'px;column-count: '+columnCount+';'">
									<template v-for="(productItem,pindex) in productList" >
										<div class="product-item" v-if="applicationSort==0  || ( applicationSort == productItem.applicationSort)">
										<div class="product-content"  >
											
											<div :id="productItem.productId+'productId'" class="header-panel app-header">
												{{productItem.applicationName}}
												<span v-if="productItem.menuList.length == 0 && productItem.url.indexOf('http') == -1" style="color: #CCCCCC;font-weight: 100;">(尚未接入)</span>
											</div>
											<template v-if="productItem.url.indexOf('http') != -1">
												<div>
													<div class="header-menu icon-menu-item" >
														<label class="label-item2" @click="routerThirdLink(productItem.url,productItem.productId,productItem.isThirdSys)">{{productItem.applicationName}}</label>
													</div>
												</div>
											</template>
											<div v-for="(item1,index1) in productItem.menuList">
												<div class="header-menu icon-menu-item" v-if="item1.type != 'directory'" >
													<!--<label @click="productChange(productItem.productId,pindex,index1,item1.menuId)">{{item1.menuName}}</label>-->
													<label class="label-item2" @click="productChange(productItem.productId,pindex,index1,item1.menuId)">{{item1.menuName}}</label>
													<el-rate v-if="parseInt(item1.isCollect) == 0" class="rate-star" value.number="item1.isCollect" :max="1" void-color="#17B3A3" :colors="['#17B3A3']" @change="saveOrCancelStar(productItem.productId,item1.menuId,item1.isCollect)"></el-rate>
													<el-rate v-else :value.number="1" :max="1" void-color="#17B3A3" :colors="['#17B3A3']" @change="saveOrCancelStar(productItem.productId,item1.menuId,item1.isCollect)"></el-rate>

												</div>
												<div v-if="item1.children.length>0" v-for="(item2,index2) in item1.children">
													<div class="header-menu icon-menu-item">
														<label class="label-item2"  @click="productChange(productItem.productId,pindex,index1,item2.menuId)">{{item2.menuName}}</label>
														<el-rate v-if="parseInt(item2.isCollect) == 0" class="rate-star" value.number="item2.isCollect" :max="1" void-color="#17B3A3" :colors="['#17B3A3']" @change="saveOrCancelStar(productItem.productId,item2.menuId,item2.isCollect,pindex,index1,index2)"></el-rate>
														<el-rate v-else :value.number="1" :max="1" void-color="#17B3A3" :colors="['#17B3A3']" @change="saveOrCancelStar(productItem.productId,item2.menuId,item2.isCollect,pindex,index1,index2)"></el-rate>
													</div>
													<div v-if="item2.children.length>0" v-for="(item3,index3) in item2.children">
														<div class="header-menu icon-menu-item">
															<label @click="productChange(productItem.productId,pindex,index1,item2.menuId,item3.menuId)">{{item3.menuName}}</label>
															<el-rate v-if="parseInt(item3.isCollect) == 0" class="rate-star" value.number="item3.isCollect" :max="1" void-color="#17B3A3" :colors="['#17B3A3']" @change="saveOrCancelStar(productItem.productId,item3.menuId,item3.isCollect,pindex,index1,index2,index3)"></el-rate>
															<el-rate v-else class="rate-star" :value.number="1" :max="1" void-color="#17B3A3" :colors="['#17B3A3']" @change="saveOrCancelStar(productItem.productId,item3.menuId,item3.isCollect,pindex,index1,index2,index3)"></el-rate>
														</div>
													</div>
												</div>
											</div>
										</div>
										</div>
									</template>
								</div>
								</div>
								<!--<div class="product-right" v-if="thirdLen>0 || myAppLen>7" v-loading="dataListLoading" style="margin-right: 20px;display: inline-block">
									<div v-for="(productItem,pindex) in productList">
										<a  @click="routerMenuLink(productItem.productId)">{{productItem.applicationName}}</a>-->
										<!--<a v-if="productItem.url.indexOf('http') == -1" @click="routerMenuLink(productItem.productId)">{{productItem.applicationName}}</a>
										<a v-else  style="border-bottom: 1px solid #DDDDDD;"  @click="routerThirdLink(productItem.url)">{{productItem.applicationName}}</a>-->
									<!--</div>
								</div>-->
							</div>
						</div>
					</el-popover>
				</el-menu>
			</div>

		</aside>

		<!--<el-dialog title="" :close-on-click-modal="true" :visible.sync="visible" class="product-list">

					<el-input v-model.trim="keywords" prefix-icon="el-icon-search" clearable placeholder="请输入名称搜索产品" class="keywords"></el-input>
					<div v-loading="dataListLoading" class="product-cont-waterfall">
						<div v-if="productList.length == 0">暂无数据</div>
						<div v-else v-for="(productItem,pindex) in productList" class="product-item">
							<div class="product-content">
								<div class="header-panel app-header">{{productItem.applicationName}}</div>
								<div v-for="(item1,index1) in productItem.menuList">
									<div class="header-menu icon-menu-item">
										<label v-if="item1.type != 'directory'" @click="productChange(productItem.productId,pindex,index1,item1.menuId)">{{item1.menuName}}</label>

									</div>
									<div v-if="item1.children.length>0" v-for="(item2,index2) in item1.children">
										<div class="header-menu icon-menu-item">
											<label class="label-item2" @click="productChange(productItem.productId,pindex,index1,item2.menuId)">{{item2.menuName}}</label>
											<el-rate v-if="parseInt(item2.isCollect) == 0" class="rate-star" value.number="item2.isCollect" :max="1" void-color="#17B3A3"  :colors="['#17B3A3']" @change="saveOrCancelStar(productItem.productId,item2.menuId,item2.isCollect)"></el-rate>
											<el-rate v-else :value.number="1" :max="1" void-color="#17B3A3"  :colors="['#17B3A3']" @change="saveOrCancelStar(productItem.productId,item2.menuId,item2.isCollect)"></el-rate>
										</div>
										<div v-if="item2.children.length>0" v-for="(item3,index3) in item2.children">
											<div class="header-menu icon-menu-item">
												<label @click="productChange(productItem.productId,pindex,index1,item2.menuId,item3.menuId)">{{item3.menuName}}</label>
												<el-rate v-if="parseInt(item3.isCollect) == 0"  class="rate-star" value.number="item3.isCollect" :max="1" void-color="#17B3A3" :colors="['#17B3A3']" @change="saveOrCancelStar(productItem.productId,item3.menuId,item3.isCollect)"></el-rate>
												<el-rate v-else class="rate-star" :value.number="1" :max="1" void-color="#17B3A3" :colors="['#17B3A3']" @change="saveOrCancelStar(productItem.productId,item3.menuId,item3.isCollect)"></el-rate>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

					</div>
				</el-col>
				<el-col :span="4">
					<div class="product-right">
							<div v-for="(productItem,pindex) in productList" >{{productItem.applicationName}}</div>
					</div>
				</el-col>
			</el-row>

		</el-dialog>-->

		<!--<product-list v-if="productListVisible" ref="productList" @refreshDataList="getDataList"></product-list>-->
	</div>

</template>
<style>
	.el-collect_icon{
		position: absolute;
		right: 15px;
		top: 17px;
		display: none;
	}
	.el-rate__icon{
		color:#17B3A3;
	}
	.home-menu-icon {
		width: 64px;
		height: 50px;
		/*line-height: 35px;*/
		text-align: center;
		margin-left: 0px !important;
	}

	.left-popover-icon {
		display: inline-block;
		width: 64px;
		height: 50px;
	}

	.left-popover-icon svg {
		font-size: 20px;
	}

	.icon-white {
		fill: #FFFFFF !important;
	}

	.home-menu-icon:hover {
		background-color: #2ebbad;
		color: #FFFFFF;
	}

	.aside-popover {
		top: 50px !important;
		left: -12px !important;
		border: none !important;
		box-shadow: 0 0 30px 0 rgba(0,0,0,0.9) !important;
	}

	.aside-popover .popper__arrow {
		display: none;
	}

	.aside-left-menu {
		margin-top: 0px;
	}

	.el-popover {
		padding: 0px;
		/*cursor: pointer;*/
	}

	.left-popover {
		padding: 0 0 0 12px;
		height: 50px;
		cursor: pointer;
		/*line-height: 50px;*/
	}

	.left-popover:active,.active {
		background-color: #2ebbad;
		color: #FFFFFF;
	}

	.left-popover:hover {
		color: #2ebbad;
	}
	.left-popover:hover .el-collect_icon {
	    display: inline-block;
	}

	.product-list {
		margin-left: 20px;
		overflow: auto;
		/*overflow: hidden;*/
	}

	.product-cont-waterfall {
		margin: 0px 0px 20px 0px;
		/*height: 800px;*/
		/*width: 750px;
		column-count: 3;*/
		column-gap: 0;
	}

	.product-list .el-dialog {
		position: absolute;
		left: 64px;
		margin-top: 50px !important;
		width: 900px;
		height: 90%;
		/*height: 90%;*/
	}

	.product-list .el-dialog__body {
		/*height: 500px;*/
		height: 90%;
		overflow-y: scroll;
	}

	.product-list .keywords {
		float: right;
		width: 200px;
		margin-top: 11px;
		margin-bottom: 10px;
		border-bottom: 1px solid #dcdfe6;
	}

	.product-list .keywords:hover {
		border-bottom: 1px solid #17B3A3;
	}

	.product-list .keywords .el-input__inner {
		border: 1px solid #FFFFFF;
	}

	.product-content {
		/*width: 200px;
		float: left;
		padding: 0px 0px 20px 0px;*/
		/*box-sizing: border-box;
	　　break-inside: avoid;
	　　padding: 10px;*/
		/*display: inline-block;*/
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 10px;
		height: auto;
		color:#303133;
		box-sizing: border-box;
		/*background-color: #eeeeee ;*/
		/*border-bottom: 1px #eeeeee solid;*/
		/*border: 1px solid #ccc;*/
	}

	.app-header {
		width: 200px;
		text-align: left;
		padding-left:5px ;
		margin-bottom: 5px;
	}

	.product-list .product-item {
		box-sizing: border-box;
		break-inside: avoid;
		padding: 10px;
	}

	.product-list .header-panel {
		font-size: 15px;
		font-weight: bold;
		display: block;
	}

	.product-list .header-menu label {
		display: inline-block;
		width: 160px;
		padding: 5px 0px 5px 5px;
	}

	.label-item2 {
		text-indent: 0em;
	}

	.icon-menu-item {
		width: 200px;
		padding: 2px 0px;
	}

	.icon-menu-item .icon-svg {
		font-size: 14px;
		/*padding-bottom: 10px;*/
	}

	.icon-menu-item label {
		cursor: pointer;
	}

	.icon-menu-item:hover,
	.icon-menu-item:active {
		background: #EEEEEE;
	}

	.icon-menu-item .rate-star {
		/*display: none;*/
    visibility: hidden;
	}

	.icon-menu-item:hover .rate-star {
		/*display: inline-block;*/
    visibility: visible;
	}
  .icon-menu-item:active .rate-star {
    /*display: inline-block;*/
    visibility: visible;
  }



  .el-rate {
		display: inline-block;
	}

	.product-right {
		display: inline-block;
		border-left: 2px #EEEEEE solid;
		width: 150px;
		position: absolute;
		top: 50px;
		right: 0px;
	}

	.product-right a {
		color: #686868;
	}

	.product-right div {
		cursor: pointer;
		padding: 10px 10px;
		border-left: 2px #EEEEEE solid;
	}

	.product-right div:focus,
	.product-right div:hover,
	.product-right div:active {
		border-left: 2px #17B3A3 solid;
	}

	.aside-linear {}
</style>
<script>
	import { isURL } from '@/utils/validate'
	import { fnAddDynamicMenuRoutes1 } from '@/router'
	import router from '@/router'
	import { getCommHttpData,getCommonDictByType } from '@/utils/common'
	import { clearLoginInfo } from '@/utils'
	import http from '@/utils/httpRequest'
	import defaultImg from '@/assets/img/icons/ds.png'
	import md5 from 'js-md5'
	export default {
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				imgUrl: window.SITE_CONFIG.imgIP,
				defaultImg: defaultImg,
				userType: this.GLOBAL.getUserType(),
				dynamicMenuRoutes: [],
				productListVisible: true,
				visible: false,
				productList: [],
				value1: null,
				keywords: '',
				dataListLoading: false,
				collectMenuList: [],
				visible2: false,
				sideHeight: 800,
				sideWidth:200,
				sideWidthLeft:1000,
				backColor:'#2e3743',
				loading:false,
				collectShow:false,
				productShow:false,
				popperWidth:200,
				columnCount:3,
				thirdLen:0,
				myAppLen:0,
				applicationSort:0,
				appSortList:[],
				isInput:false
			}
		},
		components: {

		},
		computed: {
			sidebarLayoutSkin: {
				get() {
					return this.$store.state.common.sidebarLayoutSkin
				}
			},
			sidebarFold: {
				get() {
					return this.$store.state.common.sidebarFold
				}
			},
			menuList: {
				get() {
					return this.$store.state.common.menuList
				},
				set(val) {
					this.$store.commit('common/updateMenuList', val)
				}
			},
			menuActiveName: {
				get() {
					return this.$store.state.common.menuActiveName
				},
				set(val) {
					this.$store.commit('common/updateMenuActiveName', val)
				}
			},
			mainTabs: {
				get() {
					return this.$store.state.common.mainTabs
				},
				set(val) {
					this.$store.commit('common/updateMainTabs', val)
				}
			},
			mainTabsActiveName: {
				get() {
					return this.$store.state.common.mainTabsActiveName
				},
				set(val) {
					this.$store.commit('common/updateMainTabsActiveName', val)
				}
			}
		},
		watch: {
			$route: 'routeHandle',
			keywords(val) {
				this.applicationSort = 0
				this.getDataList()
			}
		},
		mounted() {
			//getCommonDictByType(this, 'application_sort', 'appSortList')
			window.addEventListener('resize', () => {
			    this.getResizeWidth()
 
		    })
			this.getResizeWidth()
			this.getCollectMenuList()
			this.getDataList()
			this.sideHeight = window.innerHeight - 50
			this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
			this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')

			this.routeHandle(this.$route)
		},
		methods: {
			showSearch(){
				if(!this.keywords){
					this.isInput=false
				}
			},
			getResizeWidth(){
				this.sideHeight = window.innerHeight - 50
			    let sideWidth=800
			    
			    if(window.innerWidth >=1200){
			    	sideWidth = 800
			    	this.sideWidthLeft = 1000
			    	this.columnCount = 3
			    }else if(window.innerWidth < 1200 && window.innerWidth > 900){
			    	sideWidth =  window.innerWidth/5*4
			    	this.sideWidthLeft = sideWidth-200
			    	this.columnCount = 2
			    }else{
			    	sideWidth = window.innerWidth/5*4
			    	this.sideWidthLeft = sideWidth-200
			    	this.columnCount = 1
			    }
			    if(!this.productShow ){
			    	this.sideWidth = 200
			    }else{
			    	this.sideWidth = sideWidth
			    }
				//this.sideWidth = sideWidth
			},
			applicationSortChange(){
//				if(this.applicationSort !=0){
//					this.keywords = ''
//				}
			},
			//跳转第三方路由
			routerThirdLink(url,productId,isThirdSys){
				console.log(url,'ururururuuru')
				let isOpen =　url && url.substr(0,4) == 'http' ? true : false
				let accesstoken = this.$cookie.get('accesstoken')
				if(isOpen){
					
				//产品Id
				//保存使用的应用
				let that = this;
				getCommHttpData({
					url: 'sys/sysuseapplication/save',
					method: 'post',
					contentType: 2,
					data: {
						userId: this.GLOBAL.getUserId(),
						productId: productId
					},
				}, function(data) {
					
				})		
					
					//token  信息
					//用户类型
		          this.isInput=false
		          this.productShow=false
					url = url.replace(/{token}/,accesstoken)
                          url = url.replace(/{productId}/,productId)
              url = url.replace(/{orgId}/,this.GLOBAL.getOrgId())
		          if(isThirdSys == 0){
		            this.$router.push({
		              name: 'system-second',
		              query:{url:url}
		            })
		          }else{
					  if(url.indexOf('openapi.shijieu') >-1){
					  	this.shijieLink(url);
					  }else{
						window.open( url);  
					  }
		          }

				}
			},
			//生涯规划系统
			async shijieLink(shijieLinkUrl){
				var userType = this.userType;
				var shijieUrl = 'third/party/getSjInfo';
				var shijieJson ;
				if(userType== 3){
					shijieJson = {schoolId:this.schoolId};
					var userId = this.GLOBAL.getUserId();
					shijieUrl = '/third/party/stuInfo';
					shijieJson={userId:userId};
				}else{
					shijieJson = {schoolId:this.schoolId};
				}
				let teaRes = null 
				let that = this
				await getCommHttpData({
					url: shijieUrl,
					method: 'post',
					contentType: 2,
					data: shijieJson,
				}, function(res) {
					teaRes = res
					var linkObj='',tsignature =  '',ishref ='';
					var teaResList = teaRes.list;
					if(userType== 3){
						if(!teaResList.schoolSharaCode){
							that.$message.error('该学校暂未开通生涯规划系统，敬请期待！')
							return;
						}
						teaResList.mobile = teaResList.mobile='' ||  teaResList.mobile==undefined?'18866666666':teaResList.mobile;
						linkObj={school_shara_code:teaResList.schoolSharaCode,
							mobile:teaResList.mobile,
							school_stu_num:teaResList.userName,
							grade_year:teaResList.gradeClassName,
							grade_id:teaResList.sjGradeId,
							class_id:parseInt(teaResList.classId),
							real_name:teaResList.name,
							gender:teaResList.sex,
							appkey:teaResList.appKey,
							signtype:"md5"};
						tsignature =  md5(that.objKeySort(linkObj)+teaRes.list.appSecret);
						ishref=shijieLinkUrl+'/openapi/students/login?school_shara_code='+teaResList.schoolSharaCode+'&mobile='+teaResList.mobile+'&school_stu_num='+teaResList.userName+'&grade_year='+teaResList.gradeClassName.substr(1,4)+'&grade_id='+teaResList.sjGradeId+'&class_id='+parseInt(teaResList.classId.substr(16,2))+'&real_name='+teaResList.name+'&gender='+teaResList.sex+'&appkey='+teaResList.appKey+'&signtype=md5&signature='+tsignature
								
					}else{
						linkObj={school_shara_code:teaResList.schoolSharaCode,
							mobile:teaResList.mobile,
							real_name:"管理员",
							job_title:"心理老师",
							appkey:teaResList.appKey,
							signtype:"md5"}
					    tsignature =  md5(that.objKeySort(linkObj)+teaRes.list.appSecret);
						ishref = shijieLinkUrl+'/openapi/teacher/login?school_shara_code='+teaRes.list.schoolSharaCode+'&mobile='+teaRes.list.mobile+'&real_name=管理员&job_title=心理老师&appkey='+teaRes.list.appKey+'&signtype=md5&signature='+tsignature;
					}
					
					
					window.open(ishref);
				})
				
			},
			objKeySort(obj) {
			    var newkey = Object.keys(obj).sort();
			    var newObj = {};
			    for (var i = 0; i < newkey.length; i++) {
			        newObj[newkey[i]] = obj[newkey[i]];
			    }
				var str=Object.values(newObj);
				var s='';
				for(var i=0;i<str.length;i++){
					s+=str[i]
				}
			    return s;
			},
			routerMenuLink(idproduct){
		
				document.getElementById(idproduct+'productId').scrollIntoView();
			},
			
			// 路由操作
			routeHandle(route) {

				if(route.meta.isTab) {
					// tab选中, 不存在先添加
					var tab = this.mainTabs.filter(item => item.name === route.name)[0]
					if(!tab) {
						if(route.meta.isDynamic) {
							route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
							if(!route) {
								return console.error('未能找到可用标签页!')
							}
						}
						tab = {
							menuId: route.meta.menuId || route.name,
							name: route.name,
							title: route.meta.title,
							type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
							iframeUrl: route.meta.iframeUrl || '',
							productId: route.meta.productId
						}
						this.mainTabs = this.mainTabs.concat(tab)
					}
					if(sessionStorage.getItem('productList') == undefined) {
            
						if(window.SITE_CONFIG.cmsIp == 1){
						  this.$router.replace({
						  	name: 'login'
						  })
						}else{
						  window.location.href = window.SITE_CONFIG.cmsIp
						}
					}
					let productList = JSON.parse(sessionStorage.getItem('productList') || '[]')
					for(let i in this.productList) {
						if(this.productList[i].productId == tab.productId) {
							this.menuList = this.productList[i].menuList
						}
					}

					sessionStorage.setItem('menuList', JSON.stringify(this.menuList || '[]'))
					this.menuActiveName = tab.menuId + ''
					this.mainTabsActiveName = tab.name
				}
			},
			showProductList() {
				this.visible = true
				this.isInput = false
				this.keywords = ''
			},
			showBig(){
				this.visible2 = false
			},
			getCollectMenuList() {
				let that = this

				let menuList =  JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
				let menuIds = new Array()
				for(let i in menuList) {
					menuIds.push(menuList[i].meta.menuId)
				}

				getCommHttpData({
					url: 'application/getCollectMenuList',
					method: 'post',
					contentType: 1,
					data: {
						menuIds: menuIds.toString()
					}
				}, function(data) {
					that.collectMenuList = data.list
				})

			},
			getDataList() {
				this.dataListLoading = true
				var that = this
				let keywords = this.keywords.length == 0 ? undefined : this.keywords
				getCommHttpData({
					url: 'application/getProductByRole',
					method: 'post',
					contentType: 1,
					data: {
						keywords: keywords
					}
				}, function(data) {
					if(data && data.code === 0) {
						that.appSortList = data.applicationSortList == undefined?[]:data.applicationSortList
						let menuListRemp = data.list
						let allMenuList = new Array()
						let tempMenuRoutes = new Array()
						for(let i in menuListRemp) {
							for(let j in menuListRemp[i].menuList) {
								tempMenuRoutes.push(menuListRemp[i].menuList[j])
							}
							allMenuList.push(menuListRemp[i].menuList)
						}
						let temArr = new Array()
						let temmmArr = new Array()
						let thirdLen = 0,myAppLen=0
						if(menuListRemp.length > 0) {
							for(let mm in menuListRemp) {
								let arr = menuListRemp[mm].menuList

								temArr = []
								let ii = 0
								for(let i in arr) {
									//判断目录
									if(arr[i].parentId == 1 && arr[i].type === 'menu') {
										temArr[ii] = arr[i]
										ii++
									}
									if(arr[i].type === 'directory') {

										temArr[ii] = arr[i]
										let tempArrMenu = new Array()
										for(let j in arr) {
											if(arr[j].type === 'menu') {
												//菜单
												if(arr[i].menuId == arr[j].parentId) {
													tempArrMenu.push(arr[j])
												}
											}
										}
										temArr[ii]['children'] = tempArrMenu
										ii++
									}
								}
								temmmArr.push({
									url:menuListRemp[mm].url,
									productId: menuListRemp[mm].productId,
									applicationName: menuListRemp[mm].applicationName,
									applicationSort: menuListRemp[mm].applicationSort,
									menuList: temArr,
									isThirdSys:menuListRemp[mm].isThirdSys,
								})
								if(menuListRemp[mm].url.indexOf('http') >-1){
									thirdLen++
								}else{
									myAppLen++
								}
							}
						}
						that.myAppLen = myAppLen
						that.thirdLen = thirdLen
						that.productList = temmmArr
					} else {
						that.productList = []
					}
					that.dataListLoading = false
				})
			},
			productChange(productId, pindex, mindex1, menuId2, menuId3) {
				//产品Id
				//保存使用的应用	
				if(this.$store.state.common.sideSubFold){
					this.$store.commit('common/updateSideMenuApp',false)
					this.$store.commit('common/updateSideSubFold', false)
				}
				let that = this;
				getCommHttpData({
					url: 'sys/sysuseapplication/save',
					method: 'post',
					contentType: 2,
					data: {
						userId: this.GLOBAL.getUserId(),
						productId: productId
					},
				}, function(data) {
					
				})
				this.visible2 = false
				if(sessionStorage.getItem('productList') == undefined) {

          if(window.SITE_CONFIG.cmsIp == 1){
            this.$router.replace({
            	name: 'login'
            })
          }else{
            window.location.href = window.SITE_CONFIG.cmsIp
          }
				}
				let productList = JSON.parse(sessionStorage.getItem('productList') || '[]')
				let productObj = this.productList.filter(item => item.productId === productId)[0]
				this.menuList = productObj.menuList

				sessionStorage.setItem('menuList', JSON.stringify(this.menuList || '[]'))
				//this.menuList = productList[pindex].menuList
				sessionStorage.setItem('curApp', JSON.stringify({
					id: productObj.productId,
					name: productObj.applicationName,
					curMenu: menuId2
				} || ''))
				this.visible = false
				this.routeHandle(this.$route)
				var route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === menuId2 && item.meta.productId === productId)
				if(route.length >= 1) {
					let that = this
					let menuId = menuId3 ? menuId3 : menuId2
					http({
					    url: http.adornAnyUrl('user/power/change?productId='+productId+'&menuId='+menuId),
					    method: 'get'
					}).then(({data}) => {
					    if (data && data.code === 500) {
					    	that.$confirm('您访问的页面消失啦，请刷新后查看~', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
					          type: 'warning'
					        }).then(() => {
					        	window.location.reload();
					        }).catch(() => {
					          that.$message({
					            type: 'info',
					            message: '已取消刷新'
					          });          
					        });
					    	
					    }else{
                let isOpen =　route[0].name && route[0].name.substr(0,4) == 'http' ? true : false
                if(isOpen){
                  that.$router.push({
                  	name: 'system-second',
                    query:{url:route[0].name}
                  })
                }else{
                  that.$router.push({
                  	name: route[0].name
                  })
                }

					    }
					})
				}else{

        }
			},
			saveOrCancelStar(productId, menuId, isCollect,pindex,index1,index2,index3) {
				let that = this;
				getCommHttpData({
					url: 'application/saveOrCancel',
					method: 'post',
					contentType: 1,
					data: {
						productId: productId,
						menuId: menuId,
						operation: parseInt(isCollect) == 0 ? 'save' : 'cancel'
					},
				}, function(data) {
					that.getCollectMenuList()
					that.getDataList()
			          if(!!index3){
			            that.productList[pindex].menuList[index1].children[index2].children[index3].isCollect = parseInt(isCollect) == 0? 1 : 0
			          }else {
			            that.productList[pindex].menuList[index1].children[index2].isCollect = parseInt(isCollect) == 0? 1 : 0
			          }
					// that.getDataList()
					//window.location.reload()
				})
			},
			cancelCollect(productId,menuId,index){
				let that = this;
				getCommHttpData({
					url: 'application/saveOrCancel',
					method: 'post',
					contentType: 1,
					data: {
						productId: productId,
						menuId: menuId,
						operation: 'cancel'
					},
				}, function(data) {
					that.getCollectMenuList()
					that.getDataList()
					that.collectMenuList = that.collectMenuList.slice(index,1)
				})
			}
		}
	}
</script>
