<template>
	<div class="mod-demo-echarts card-index-cont">
		<router-link :replace=true :to="{name:routerName}">
			<el-row :gutter="12">
				<el-col :span="6">
					<el-card shadow="hover" class="card-index-box">
						<div class="card-index-body">
							<div class="kpi-icon margin-bottom-10"><img src="~@/assets/img/icons/icon35.png" class="card-index-icon"/></div>
							<div class="body-text analysis-home">
								<div class="kpi-text margin-bottom-10">课堂回答率</div>
								<div><span class="kpi-num">{{kpiData.responseRate || 0}}</span>%</div>
							</div>
						</div>
					</el-card>
				</el-col>
				<el-col :span="6">
					<el-card shadow="hover" class="card-index-box">
						<div class="card-index-body">
							<div class="kpi-icon margin-bottom-10"><img src="~@/assets/img/icons/icon28.png" class="card-index-icon"/></div>
							<div class="body-text analysis-home">
								<div class="kpi-text margin-bottom-10">回答被奖率</div>
								<div><span class="kpi-num">{{kpiData.praiseRate || 0}}</span>%</div>
							</div>
						</div>
					</el-card>
				</el-col>
				<el-col :span="6">
					<el-card shadow="hover" class="card-index-box">
						<div class="card-index-body">
							<div class="kpi-icon margin-bottom-10"><img src="~@/assets/img/icons/icon29.png" class="card-index-icon"/></div>
							<div class="body-text analysis-home">
								<div class="kpi-text margin-bottom-10">回答正确率</div>
								<div><span class="kpi-num">{{kpiData.correctRate || 0}}</span>%</div>
							</div>
						</div>
					</el-card>
				</el-col>
				<el-col :span="6">
					<el-card shadow="hover" class="card-index-box card-index-nopadding">
						<div class="card-index-body">
							<div class="kpi-icon margin-bottom-10"><img src="~@/assets/img/icons/icon27.png" class="card-index-icon"/></div>
							<div class="body-text analysis-home">
								<div class="kpi-text margin-bottom-10">互动均衡度</div>
								<el-rate v-model="kpiData.interactRate || 0" disabled text-color="#ff9900">
								</el-rate>
							</div>
						</div>
					</el-card>
					<div style="float: right; position: absolute;top:155px;right: 10px;">
						{{gradeClassName}}
						<router-link :replace=true :to="{name:routerName}" v-if="isMore">
							<span type="text" style="color:#17B3A3">&nbsp;&nbsp;>></span>
						</router-link>
					</div>
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
	import { getCommHttpData, getAnalysisChartData, getDateStr,getDayOfWeek } from '@/utils/common'
	export default {
		components: {
			ChartBarLineZoom,
			ChartColumn
		},
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				kpiData: {
					correctRate:0,
					interactRate: 0,
					num: null,
					praiseRate: 0,
					rank: 1,
					rate: 1,
					responseRate: 0
				},
				gradeClassName:'',
				isMore:false,
				routerName: 'charts-class-stu-tea',
				
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
					url: 'uc/micro/classroomInteract',
					method: 'get',
					contentType: 1,
					data: commParams
				}, function(data) {
					that.routerName = data.list.length == 0 ? 'charts-class-stu-school' : 'charts-class-stu-tea'
					if(data.list.length > 0) {
						that.kpiData = data.list[0].study
						that.kpiData.interactRate = data.list[0].study.interactRate/2
						that.gradeClassName = data.list[0].gradeName+''+data.list[0].className
						that.isMore = data.list.length >1?true:false						
					}else if(data.page != ''){
						that.kpiData = data.page
						that.kpiData.interactRate = data.page.interactRate/2
					} else {
						that.kpiData = {
							correctRate:0,
							interactRate: 0,
							num: null,
							praiseRate: 0,
							rank: 1,
							rate: 1,
							responseRate: 0
						}
					}
				})
			}
		}
	}
</script>