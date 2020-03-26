<template>
	<div class="mod-demo-echarts card-index-cont">
		<router-link :replace=true :to="{name:routerName}">
		<el-row :gutter="12" style="text-align: center;">
			<el-col :span="12" class="clear-padding">
				<el-card shadow="hover" class="card-index-box">
					<div class="card-index-body">
						<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon37.png" /></div>
						<div class="body-text2">
							<div class="kpi-text">设备在线数</div>
							<div class="kpi-value"><span class="kpi-num">{{kpiData.onLineNum || 0}}</span>台</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="12" class="process-con">
				<el-card shadow="hover" class="card-index-box">
					<div class="process-title margin-bottom-10 card-index-process-title">
						设备在线率
						<div class="card-index-process-value"><span class="kpi-num">{{rate}}</span>%</div>
					</div>
					<el-progress style="margin-top: 0px;" type="circle" color="#41cac0" :percentage="rate" :width="110" :stroke-width="10" :show-text=false>
					</el-progress>
				</el-card>
			</el-col>
		</el-row>
		</router-link>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import mediacss from '@/assets/scss/media.scss'
	import ChartPieDc from '@/components/charts/pie'
	import { getCommHttpData,getDateStr } from '@/utils/common'
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
					equipeNum: 0,
					onLineNum: 0,
					anomalyNum: 0,
					turnOnMac:0
				},
				rate:0,
				routerName:this.GLOBAL.getUserType() == 4 ? 'a-media-area-monitor' : 'media-monitor'
			}
		},
		mounted() {
			this.iniChartsData();
		},

		methods: {
			iniChartsData() {
				let that = this;
				getCommHttpData({
					url: 'uc/micro/monitoring',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					that.kpiData = data.map
					if(data.map.equipeNum > 0){
						that.rate = Math.round(data.map.onLineNum/data.map.equipeNum*100 * 10) / 10;
					}else{
						that.rate = 0
					}
				})
			}
		}
	}
</script>