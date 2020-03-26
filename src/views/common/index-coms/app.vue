<template>
	<div class="mod-demo-echarts card-index-cont">
		<router-link :replace=true :to="{name:routerName}">
		<el-row :gutter="12">
			<el-col :span="8">
				<el-card shadow="hover" class="card-index-box">
					<div class="card-index-body">
						<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon54.png" /></div>
						<div class="body-text2">
							<div class="kpi-value"><span class="kpi-num">{{kpiData.length || 0}}</span>个</div>
							<div class="kpi-text">我发布的应用</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="16">
				<div v-if="kpiData.length>0">
					<!--词云-->
                    <el-row :gutter="20">
                    	<template v-for="(item,index) in kpiData">
	                    	<!--<el-col :span="4" v-if="kpiData.length<8">-->
	                    	<el-col :span="6" v-if="index < 8">
                    			<div style="text-align: center; color: #303133;"> 
	                    			<div class="app-img" style="background-color: #2EBBAD;padding: 10px;margin-bottom: 5px; border-radius: 4px;">
	                    				<img v-if="item.iconPath==null" src="~@/assets/img/icons/app.png" :onerror="defaultImg"   width="20px" height="20px"/>
						    			<img v-else :src="imgUrl+item.iconPath"  :onerror="defaultImg"   width="20px" height="20px"/>
						    		</div>
	                    			<div>{{item.applicationName.length > 6 ? item.applicationName.substr(0,5)+'...' : item.applicationName}}</div>
	                    		</div>
	                    	</el-col>
                    	</template>
                    	<!--<el-col :span="4" v-if="kpiData.length > 7">
                    			<div style="text-align: center; color: #303133;line-height: 50px;"> 
	                    			<div>更多</div>
	                    		</div>
	                    	</el-col>-->
                    </el-row>
				</div>
				<el-card shadow="hover" class="card-index-box" v-else style="height: 130px;line-height: 130px;text-align: center;color: #cccccc;font-size: 12px;">
					<div>暂无应用,快去发布吧</div>
				</el-card>
			</el-col>
		</el-row>
		</router-link>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import mediacss from '@/assets/scss/media.scss'
	import ChartWordCloud from '@/components/charts/word-cloud'
	import { getCommHttpData, getAnalysisChartData,getDateStr } from '@/utils/common'
	export default {
		components: {
			ChartWordCloud
		},
		data() {
			return {
				routerName:'app-manage',
				schoolId: this.GLOBAL.getOrgId(),
				kpiData: [],
				list:[],
				wordCloudSeries:{xValue:[],yValue:[]},
				imgUrl: window.SITE_CONFIG.imgIP,
				defaultImg: 'this.src="' + require('../../../assets/img/nodata.png') + '";this.onerror = null',
			}
		},
		mounted() {

			this.iniChartsData();
		},

		methods: {
			iniChartsData() {
				let that = this;
				getCommHttpData({
					url: 'uc/micro/applicationCenter',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					if(data.list != null) {
						that.kpiData = data.list
					} else {
						that.kpiData = []
					}
				})
			}
		}
	}
</script>