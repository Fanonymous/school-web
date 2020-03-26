<template>
	<div class="attendance">
		<el-tabs v-model="activeName" @tab-click="handleClick">
		    <el-tab-pane label="访客记录" name="first">
		    	<date-analy @refreshChartsData="getDateData"></date-analy>
				<el-input v-model="keywords" @input="getList" placeholder="请输入姓名查询" style="width:300px"></el-input>
				<el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row>
					<el-table-column align="center" type="index" label='序号' width="95">
						 <template slot-scope="scope">
				          {{scope.$index+1+pageSize*(pageIndex-1)}}
				        </template>
					</el-table-column>
					<el-table-column align="center" label="照片">
						<template slot-scope="scope">
						      <img :src="baseIp+scope.row.imagePath" @click="largeImgMessage(baseIp+scope.row.imagePath,scope.row.imagePath)" :onerror="defaultImg" width="26px" height="26px"/>
					    </template>
					</el-table-column>
					<el-table-column align="center" prop="name" label="姓名">
					</el-table-column>
					<el-table-column align="center" prop="createDate" label="时间">
					</el-table-column>
					<el-table-column align="center" prop="" label="到访次数">
						<template slot-scope="scope">
							第 {{scope.row.visitorCount}} 次到访
						</template>
					</el-table-column>
					<el-table-column align="center" prop="reason" label="到访原因">
					</el-table-column>
				</el-table>
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
		    </el-tab-pane>
		    <el-tab-pane label="访客名单" name="second">
		    	<el-input v-model="viswords" @input="getVisList" placeholder="请输入姓名查询" style="width:300px;margin-bottom: 10px;"></el-input>
			    <el-table :data="vislist" v-loading="visLoading" border fit highlight-current-row>
					<el-table-column align="center" type="index" label='序号' width="80">
						 <template slot-scope="scope">
				          {{scope.$index+1+pageSizeVis*(pageIndexVis-1)}}
				        </template>
					</el-table-column>
					<el-table-column align="center" label="照片">
						<template slot-scope="scope">
						      <img :src="baseIp+scope.row.imagePath" @click="largeImgMessage(baseIp+scope.row.imagePath,scope.row.imagePath)" :onerror="defaultImg" width="26px" height="26px"/>
					    </template>
					</el-table-column>
					<el-table-column align="center" prop="visitorName" label="姓名">
					</el-table-column>
					<el-table-column align="center" prop="visitorCode" label="身份证号">
					</el-table-column>
					<el-table-column align="center" prop="visitorPerson" label="联系人">
					</el-table-column>
					<el-table-column align="center" prop="visitorPersonPhone" label="联系人电话">
					</el-table-column>
					<el-table-column align="center" prop="createDate" label="注册时间">
					</el-table-column>
					<el-table-column align="center" prop="remarks" label="备注">
					</el-table-column>
				</el-table>
				<el-pagination @size-change="sizeChangeHandleVis" @current-change="currentChangeHandleVis" :current-page="pageIndexVis" :page-sizes="[10, 20, 50, 100]" :page-size="pageSizeVis" :total="totalPageVis" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
		    </el-tab-pane>
		    </el-tab-pane>
		</el-tabs>
		
	</div>
</template>

<script>
	import DateAnaly from '../common/date-analy'
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	export default {
		data() {
			return {
				keywords:"",
				baseIp :window.SITE_CONFIG.imgIP,
		        defaultImg: 'this.src="' + require('../../../assets/img/nodata.png') + '";this.onerror = null',
				activeName: 'first',
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				pageIndexVis: 1,
				pageSizeVis: 10,
				totalPageVis: 0,
				startDate:'',
      			endDate:'',
      			dataList:[],
      			vislist:[],
      			viswords:'',
      			visLoading:false,
      			listLoading:false
			}
		},
		components: {
			DateAnaly
		},
		methods: {
			//日期
			getDateData(startDate, endDate) {
				this.startDate = startDate
				this.endDate = endDate;
				this.getList()
			},
			//切换
			handleClick(){
				if(this.activeName=='first'){
					this.getList();
				}else if(this.activeName=='second'){
					this.getVisList();
				}
			},
			//访客记录
			getList() {
				//	this.listLoading = true
				let that = this
				let keywords = this.keywords.length == 0 ? undefined : this.keywords;
				let startDate = this.startDate.length == 0 ? undefined : this.startDate;
				let endDate = this.endDate.length == 0 ? undefined : this.endDate;
				getCommHttpData({
					url: 'visitor/getList',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						startDate: startDate,
						endDate:endDate,
						keywords: keywords
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndex != 1) {
							that.pageIndex = 1
							that.getList()
						}
						that.dataList = data.page.list
						that.totalPage = data.page.totalCount
					} else {
						that.dataList = []
						that.totalPage = 0
					}
					that.listLoading = false
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getList()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getList()
			},
			//图片预览
			largeImgMessage(imgSrc,num) {
				if(num&&num!=""){
					this.$alert('<img src="'+imgSrc+'" width="390px" height="auto" onerror="this.src=\"' + require('../../../assets/img/nothing.png') + '\";this.onerror = null" >', '预览', {
			          dangerouslyUseHTMLString: true,
			          showConfirmButton:false,
			          closeOnClickModal:true
			        });
				}
			},
		    //访客名单
			getVisList() {
				this.visLoading = true
				let that = this
				let viswords = this.viswords.length == 0 ? undefined : this.viswords
				getCommHttpData({
					url: 'visitor/getVisitorList',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						keywords: viswords
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndexVis != 1) {
							that.pageIndexVis = 1
							that.getVisList()
						}
						that.vislist = data.page.list
						that.totalPageVis = data.page.totalCount
					} else {
						that.vislist = []
						that.totalPage = 0
					}
					that.visLoading = false
				})
			},
			// 每页数
			sizeChangeHandleVis(val) {
				this.pageSizeVis = val
				this.pageIndexVis = 1
				this.getVisList()
			},
			// 当前页
			currentChangeHandleVis(val) {
				this.pageIndexVis = val
				this.getVisList()
			},
		}
	}
</script>

<style>
</style>