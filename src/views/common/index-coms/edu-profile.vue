<template>
	<div class="mod-demo-echarts card-index-cont">
		<el-row :gutter="12">
			<el-col :span="12" >
				<router-link :replace=true :to="{name:'user-organization',query:{deptType:4,enableType:0}}">
					<el-card shadow="hover" class="card-index-box">
						<div class="card-index-body">
							<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon22.png" /></div>
							<div class="body-text2">
								<div class="kpi-text">教育局部门</div>
								<div class="kpi-value"><span class="kpi-num">{{kpiData.department || 0}}</span>个</div>
							</div>
						</div>
					</el-card>
				</router-link>
			</el-col>
			<el-col :span="12">
				<router-link :replace=true :to="{name:'user-user',query:{userType:4,enableType:0}}">
					<el-card shadow="hover" class="card-index-box">
						<div class="card-index-body"> 
							<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon32.png" /></div>
							<div class="body-text2">
								<div class="kpi-text">教育局工作人员</div>
								<div class="kpi-value"><span class="kpi-num">{{kpiData.staff || 0}}</span>人</div>
							</div>
						</div>
					</el-card>
				</router-link>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import mediacss from '@/assets/scss/media.scss'
	import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
	import ChartColumn from '@/components/charts/column'
	import { getCommHttpData, getAnalysisChartData,getDateStr } from '@/utils/common'
	export default {
		components: {
			ChartBarLineZoom,
			ChartColumn
		},
		data() {
			return {
				kpiData: {
					department: 0,
					school: 0,
					staff: 0,
					student: 0,
					teacher: 0
				}
			}
		},
		mounted() {
			this.iniChartsData();
		},

		methods: {
			iniChartsData() {
				let that = this;
				getCommHttpData({
					url: 'uc/micro/uSurvey',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					if(data.page != null) {
						that.kpiData = data.page
					} else {
						that.kpiData = {
							department: 0,
							school: 0,
							staff: 0,
							student: 0,
							teacher: 0
						}
					}
				})
			}
		}
	}
</script>