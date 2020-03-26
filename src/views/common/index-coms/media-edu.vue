<template>
	<div class="mod-demo-echarts card-index-cont">
		
		<router-link :replace=true :to="{name:routerName}">
		<el-row :gutter="12">
			<el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
				<el-card shadow="hover" class="card-index-box">
					<div class="card-index-body">
						<div class="kpi-icon margin-bottom-10"><img src="~@/assets/img/icons/icon25.png" class="card-index-icon"/></div>
						<div class="body-text analysis-home">
							<div class="kpi-text margin-bottom-10">多媒体教学率</div>
							<div class="kpi-value"><span class="kpi-num">{{kpiData.useRate || 0}}</span>%</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
				<el-card shadow="hover" class="card-index-box">
					<div class="card-index-body">
						<div class="kpi-icon margin-bottom-10"><img src="~@/assets/img/icons/icon26.png" class="card-index-icon"/></div>
						<div class="body-text analysis-home">
							<div class="kpi-text margin-bottom-10">多媒体教学时长</div>
							<div class="kpi-value"><span class="kpi-num">{{kpiData.useTime || 0}}</span>分钟</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
				<el-card shadow="hover" class="card-index-box card-index-nopadding">
					<div class="card-index-body">
						<div class="body-text analysis-home">
							<div class="kpi-icon margin-bottom-10"><img src="~@/assets/img/icons/icon24.png" class="card-index-icon"/></div>
							<div class="kpi-text margin-bottom-20">多媒体交互度</div>
							<el-rate v-model="kpiData.interactivityScore || 0" disabled text-color="#ff9900">
							</el-rate>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :xs="12" :sm="8" :md="8" :lg="6" :xl="6">
				<el-card shadow="hover" class="card-index-box card-index-nopadding">
					<div class="card-index-body">
						<div class="body-text analysis-home">
							<div class="kpi-icon margin-bottom-10"><img src="~@/assets/img/icons/icon23.png" class="card-index-icon"/></div>
							<div class="kpi-text margin-bottom-20">教学多样性</div>
							<el-col :span="24" class="analy-progress">
								<el-progress :stroke-width="15" :percentage="kpiData.diversity*10" :show-text="false"></el-progress>
							</el-col>
							
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
		</router-link>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import mediacss from '@/assets/scss/media.scss'
	import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
	import ChartColumn from '@/components/charts/column'
	import { getCommHttpData, getAnalysisChartData,getDateStr,getDayOfWeek } from '@/utils/common'
	export default {
		components: {
			ChartBarLineZoom,
			ChartColumn
		},
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				routerName:this.GLOBAL.getUserType() == 4 ? 'a-media-edu' : 'a-media-school',
				kpiData: {
					useRate: 0,
					useCount: 0,
					useTime: 0,
					useTimeRate: 0,
					diversity: 0,
					interactivity: 0,
				}
			}
		},
		mounted() {
			this.iniChartsData();
		},

		methods: {
			iniChartsData() {
				let that = this;
				let startEndDate = getDayOfWeek()
				let commParams = {
//					startDate: startEndDate.startDate,
//					endDate: startEndDate.endDate,
					startDate: getDateStr(-7),
					endDate: getDateStr(-1)
				}
				getCommHttpData({
					url: 'uc/micro/informationizeAcc',
					method: 'get',
					contentType: 1,
					data: commParams
				}, function(data) {
					if(data.page != null) {
						that.kpiData = data.page
						that.kpiData['interactivityScore'] = that.kpiData.interactivity / 10 * 5
					} else {
						that.kpiData = {
							useRate: 0,
							useCount: 0,
							useTime: 0,
							useTimeRate: 0,
							diversity: 0,
							interactivity: 0
						}
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
.card-index-cont{
    overflow-y: auto;
    overflow-x: hidden;
}
::-webkit-scrollbar{  
    width: 0px;  
    height: 5px;  
    background-color: #F5F5F5;  
}   
::-webkit-scrollbar-track{  
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  
    border-radius: 10px;  
    background-color: #F5F5F5;  
}    
::-webkit-scrollbar-thumb{  
    border-radius: 10px;  
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
    background-color: #bdbdbd;  
}  
::-webkit-scrollbar-thumb:hover{
    border-radius: 5px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.4);
}
</style>