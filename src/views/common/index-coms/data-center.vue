<template>
	<div class="mod-demo-echarts card-index-cont">
		<el-row :gutter="12" style="text-align: center;">
			<el-col :span="12">
				<el-card shadow="hover" class="card-index-box">
					<div class="process-title margin-bottom-10 card-index-process-title">
						数据采集进度
						<div class="card-index-process-value"><span class="kpi-num">{{kpiData.collectProgress}}</span>%</div>
					</div>
					<el-progress type="circle" color="#41cac0" :percentage="kpiData.collectProgress" :width="110" :stroke-width="10" :show-text=false>
					</el-progress>
				</el-card>
			</el-col>
			<el-col :span="12" class="clear-padding">
				<el-card shadow="hover" class="card-index-box">
					<div class="card-index-body">
						<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon44.png" /></div>
						<div class="body-text2">
							<div class="kpi-text">累计采集数据</div>
							<div class="kpi-value"><span class="kpi-num">{{kpiData.totalCollect}}</span>{{unit}}</div>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>

	</div>
</template>

<script>
	import echarts from 'echarts'
	import mediacss from '@/assets/scss/media.scss'
	import ChartPieDc from '@/components/charts/pie'
	import { getCommHttpData } from '@/utils/common'
	export default {
		components: {
			ChartPieDc
		},
		data() {
			return {
				pieSeries1dc: {
					xValue: [],
					yValue: []
				},
				kpiData: {
					collectProgress: 0,
					collectSchool: 0,
					totalCollect: 0,
					total:0
				},
				unit:''
			}
		},
		filters:{
			numberFilter(val){
				
			}
        },

		mounted() {
			this.iniChartsData();
		},

		methods: {
			iniChartsData() {
				let that = this;
				getCommHttpData({
					url: 'uc/micro/assess',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					let temp=0
					let num = parseInt(data.list.totalCollect)
					if(num>=10000 && num<100000000){
			            temp=parseFloat(num/10000).toFixed(2)
			            that.unit = "万"
			        }
			        if(num>=100000000 && num<1000000000000){
			            temp=parseFloat(num/100000000).toFixed(2)
			            that.unit = "亿"
			        }
					that.kpiData.totalCollect =  temp
					that.kpiData.collectProgress = Math.round(data.list.collectProgress * 10) / 10
				})
			}
		}
	}
</script>