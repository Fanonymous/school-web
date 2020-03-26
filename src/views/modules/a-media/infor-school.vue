<template>
	<div class="mod-demo-echarts">
		<el-form label-width="80px">
			<el-form-item label="截止日期">
				<end-date-analysis @refreshChartsData="getDateData"></end-date-analysis>
			</el-form-item>
		</el-form>

		<el-row :gutter="10">
			<el-col :span="8">
				<el-card>
					<el-col :span="24" style="margin-top: 15px;">
				    <el-card shadow="hover">
				    	<div class="analysis-body">
				    		<div class="body-icon primary"><img src="~@/assets/img/bandwidth.png"/></div>
				    		<div class="body-text" ><div class="kpi-text">班均出口带宽</div><div class="kpi-value">{{net}}M</div></div> 
				    	</div>
				    </el-card>
				  </el-col>
				  <el-col :span="24" style="margin-top:15px;">
				    <el-card shadow="hover">
				      <div class="analysis-body" >
				    		<div class="body-icon red" ><img src="~@/assets/img/net.png"/></div>
				    		<div class="body-text" ><div class="kpi-text">日均流量</div><div class="kpi-value">{{bytesTotal}}GB</div></div>
				    		
				    	</div>
				    </el-card>
				  </el-col>
				  <el-col :span="24"  style="margin: 13px 0px 40px 0px;">
				    <el-card shadow="hover">
				      <div class="analysis-body">
				    		<!--<div class="body-icon blue" ><img src="~@/assets/img/net.png"/></div>-->
				    		<el-col :span="12">
				    			<div class="body-icon blue" ><img src="~@/assets/img/arrow-up.png"/></div>
				    			<div class="body-text" >
					    			<div class="kpi-text">上行</div>
					    			<div class="kpi-value">{{bytesSent}}GB</div>
					    		</div>
				    		</el-col>
				    		<el-col :span="12">
				    			<div class="body-icon blue" ><img src="~@/assets/img/arrow-down.png"/></div>
				    			<div class="body-text" >
				    			
					    			<div class="kpi-text">下行</div>
					    			<div class="kpi-value">{{bytesReceived}}GB</div>
					    		</div>
				    		</el-col>
				    		
				    		<!--<div class="body-icon blue" ><img src="~@/assets/img/net.png"/></div>-->
				    		<!--<div class="body-text" >
				    			<div class="kpi-text"><img src="~@/assets/img/arrow-up.png"/>上行   <img src="~@/assets/img/arrow-down.png"/>下行</div>
				    			<div class="kpi-value">{{bytesSent}}GB {{bytesReceived}}GB</div>
				    		</div>-->
				    	</div>
				    </el-card>
				  </el-col>
					<!--网络分析-->
						<!--<chart-liquid-fill ref="isliquidFillChart1" :id="'isliquidFillChart1'" :title="'装备情况'" :series="pieSeries1"></chart-liquid-fill>-->
				</el-card>
			</el-col>
			
			<el-col :span="8">
				<el-card>
					<chart-pie ref="ispieChart1" :id="'ispieChart1'" :title="'装备情况'" :series="pieSeries1"></chart-pie>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card>
					<chart-pie ref="ispieChart2" :id="'ispieChart2'" :title="'装备品牌分布'" :series="pieSeries2"></chart-pie>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card>
					<chart-pie-ring-one ref="ispieRingChart1" :id="'ispieRingChart1'" :title="'班级教室配备率'" :series="pieRingSeries1"></chart-pie-ring-one>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card>
					<chart-pie-ring-one ref="ispieRingChart2" :id="'ispieRingChart2'" :title="'功能部室配备率'" :series="pieRingSeries2"></chart-pie-ring-one>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card>
					<chart-bar ref="iscolumnChart1" :id="'iscolumnChart1'" :title="'班级装备利用率TOP5'" :series="barSeries1"></chart-bar>
				</el-card>
			</el-col>

			<el-col :span="24">
				<el-card>
					<chart-line ref="iscolumnChart2" :id="'iscolumnChart2'" :title="'装备运行时长分析'" :series="columnSeries2"></chart-line>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import mediacss from '@/assets/scss/media.scss'
	import ChartBar from '@/components/charts/bar'
	import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
	import ChartBarLine from '@/components/charts/bar-line'
	import ChartColumn from '@/components/charts/column'
	import ChartPie from '@/components/charts/pie'
	import ChartLiquidFill from '@/components/charts/liquidfill'
	import ChartPieRingOne from '@/components/charts/pie-ring-text'
	import ChartLine from '@/components/charts/line'
	import EndDateAnalysis from '../common/end-date-analysis'
	
	import { getCommHttpData, getAnalysisChartData } from '@/utils/common'
	export default {
		components: {
			ChartBar,
			ChartBarLineZoom,
			ChartColumn,
			EndDateAnalysis,
			ChartPie,
			ChartPieRingOne,
			ChartLiquidFill,
			ChartLine
		},
		data() {
			return {
				orgId: this.GLOBAL.getOrgId(),
				userType: this.GLOBAL.getUserType(),
				net:0,
				bytesTotal:0,
				bytesSent:0,
				bytesReceived:0,
				startDate: '',
				pieRingSeries1: {
					xValue: [],
					yValue: []
				},
				pieRingSeries2: {
					xValue: [],
					yValue: []
				},
				pieSeries1: {
					xValue: [],
					yValue: []
				},
				pieSeries2: {
					xValue: [],
					yValue: []
				},
				barSeries1: {
					xValue: [],
					yValue: []
				},
				columnSeries2: {
					xValue: [],
					yValue: []
				}
				
			}
		},
		mounted() {
			this.resizeListener()
			window.addEventListener('resize', () => {
				this.resizeListener()
			})
		},
//		activated() {
//			this.resizeListener()
//		},
		methods: {
			getDateData(startDate) {
				console.log(startDate)
				this.startDate = startDate
				this.iniChartsData()
			},

			resizeListener() {
				if(this.$refs.ispieChart1.chart) {
					this.$refs.ispieChart1.chart.resize()
				}
				if(this.$refs.ispieChart2.chart) {
					this.$refs.ispieChart2.chart.resize()
				}
				if(this.$refs.ispieRingChart1.chart) {
					this.$refs.ispieRingChart1.chart.resize()
				}
				if(this.$refs.ispieRingChart2.chart) {
					this.$refs.ispieRingChart2.chart.resize()
				}
				if(this.$refs.iscolumnChart1.chart) {
					this.$refs.iscolumnChart1.chart.resize()
				}
				if(this.$refs.iscolumnChart2.chart) {
					this.$refs.iscolumnChart2.chart.resize()
				}

			},
			iniChartsData() {
				let that = this
				let commParams = {
					date: this.startDate,
					schoolId:this.orgId
				}
				
				getCommHttpData({url:'multimemediaEquip/equipFlow',method:'get',contentType:1,data:commParams},function(data){
		    	that.net=data.list.net
					that.bytesTotal=data.list.bytesTotal
					that.bytesSent=data.list.bytesSent
					that.bytesReceived=data.list.bytesReceived
		    })
				getCommHttpData({url:'multimemediaEquip/classEquipment',method:'get',contentType:1,data:commParams},function(data){
		    	that.pieRingSeries1 ={
		    		xValue:[data.list.xValue[0],''],
		    		yValue:[data.list.yValue[0],100-data.list.yValue[0]],
		    		yAxis:[{
							name1: '班级教室',
							name2: '总班级教室',
							classNum: data.list.yValue2[0],
							classTotal: data.list.yValue1[0] 
						}]
		    	}
		    	
		    	that.pieRingSeries2 ={
		    		xValue:[data.list.xValue[1],''],
		    		yValue:[data.list.yValue[1],100-data.list.yValue[1]],
		    		yAxis:[{
							name1: '功能部室',
							name2: '总功能部室',
							classNum: data.list.yValue2[1],
							classTotal: data.list.yValue1[1] 
						}]
		    	}
		    })
				
				//装备状态
				getAnalysisChartData({
					url: 'multimemediaEquip/equipTag',
					data: commParams
				}, function(data) {
					that.pieSeries2 ={xValue:data.list.xValue,yValue:data.list.yValue}
					that.resizeListener()
					
				})
				
				//装备情况
				commParams['coomType'] = 1
				getAnalysisChartData({
					url: 'multimemediaEquip/equipDevice',
					data: commParams
				}, function(data) {
					that.pieSeries1 ={xValue:data.list.xValue,yValue:data.list.yValue}
					that.resizeListener()
				})
				delete commParams['coomType']

				//班级装备利用率TOP5
				getAnalysisChartData({
					url: 'multimemediaEquip/classEquipRate',
					data: commParams
				}, function(data) {
					that.barSeries1={
						xValue: data.list.xValue.reverse(),
						yValue: [data.list.yValue.reverse()],
						seriaName:['利用率'],
			    		yAxis:[{name: '(%)',min: 0,max: null,axisLabel:'',tipLabel:'%'}]
			    }
					that.resizeListener()
				})
				//开机时长
				getAnalysisChartData({
					url: 'multimemediaEquip/equipBootLength',
					data: commParams
				}, function(data) {
					let yAxisName = data.list.xValue.length == 0?'':'小时'
					that.columnSeries2 = {
						xValue: data.list.xValue,
						yValue: [data.list.yValue],
						seriaName: ['运行时长'],
						yAxis: [{
							name: yAxisName,
							min: 0,
							max: null,
							interval: null,
							axisLabel: '',
              tipLabel:'小时'
						}]
					}
					that.resizeListener()
				})
			}
		}
	}
</script>