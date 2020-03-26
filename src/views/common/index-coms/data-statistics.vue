<template>
	<div class="mod-demo-echarts card-index-cont">
		<el-row :gutter="12" style="text-align: center;">
			<!--<router-link :replace=true to="base-grade" >-->
				<el-col :span="8" class="clear-padding">
					<el-card shadow="hover" class="card-index-box">
						<div class="card-index-body">
							<div class="kpi-icon margin-bottom-10"><img src="~@/assets/img/icons/icon36.png" class="card-index-icon"/></div>
							<div class="kpi-text">
								<div class="kpi-text margin-bottom-10">累计数据量</div>
								<div class="kpi-value"><span class="kpi-num">{{kpiData.total || 0}}</span>MB</div>
							</div>
						</div>
					</el-card>
				</el-col>
				<el-col :span="16" class="clear-padding">
					<chart-line ref="iscolumnChart2" :id="'iscolumnChart2'" :height="'180px'" :title="'装备运行时长分析'" :series="columnSeries2"></chart-line>
				</el-col>
			<!--</router-link>-->
		</el-row>

	</div>
</template>

<script>
	import echarts from 'echarts'
	import mediacss from '@/assets/scss/media.scss'
//	import ChartPieDc from '@/components/charts/pie'
	import { getCommHttpData } from '@/utils/common'
	import ChartLine from '@/components/charts/line-card'
	export default {
		components: {
//			ChartPieDc
			ChartLine
		},
		data() {
			return {
				pieSeries1dc: {
					xValue: [],
					yValue: []
				},
				kpiData: {
					total:0
				},
				columnSeries2: {
					xValue: [],
					yValue: []
				},
			}
		},
		mounted() {
			this.iniChartsData();
			this.columnSeries2 = {
				xValue: ['sd','ww'],
				yValue: [[1,66]],
				seriaName: ['运行时长'],
				yAxis: [{
					name: '6767',
					min: 0,
					max: null,
					interval: null,
					axisLabel: ''
				}]
			}
		},

		methods: {
			
			iniChartsData() {
				let that = this;
				getCommHttpData({
					url: 'uc/micro/resourceSize',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					that.kpiData.total = data.page.total
					that.columnSeries2 = {
						xValue: data.page.xValue,
						yValue: [data.page.yValue],
						seriaName: ['数量'],
						yAxis: [{
							name: 'MB',
							min: 0,
							max: null,
							interval: null,
							axisLabel: ''
						}]
					}
				})
			}
		}
	}
</script>