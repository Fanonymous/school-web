<template>
	<div class="mod-demo-echarts">
		<el-row :gutter="12">
			<el-col :span="12">
				<el-progress style="margin-top: 0px;" type="circle" color="#41cac0" :percentage="kpiData.mediaClassroomRat" :width="120" :stroke-width="10"></el-progress>
			</el-col>

			<el-col :span="12">
				<el-progress style="margin-top: 0px;" type="circle" color="#41cac0" :percentage="kpiData.netspaceRegistRat" :width="120" :stroke-width="10"></el-progress>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import mediacss from '@/assets/scss/media.scss'
	import ChartPie from '@/components/charts/pie'
	import { getCommHttpData, getAnalysisChartData,getDateStr } from '@/utils/common'
	export default {
		components: {
			ChartPie
		},
		data() {
			return {
				orgId: this.GLOBAL.getOrgId(),
				userType: this.GLOBAL.getUserType(),
				pieSeries1: {
					xValue: [],
					yValue: []
				},
				kpiData: {
					stuEquipRat:'',
					teacherEquipRat:'',
					netspaceRegistRat:0,
					mediaClassroomRat:0
				}
			}
		},
		mounted() {
			this.iniChartsData();
		},

		methods: {
			iniChartsData() {
				if(this.userType == 4){
					this.eduData()
				}else{
					this.schoolData()
				}
				
			},
			eduData(){
				let that = this;
				getCommHttpData({
					url: 'schoolScreen/getAreaByDept',
					method: 'post',
					contentType: 2,
					data: {}
				}, function(data) {
					getCommHttpData({
						url: 'unitscreen/info',
						method: 'get',
						contentType: 1,
						data: {
							areaid: data.daptInfo.areaid
						}
					}, function(data) {
						that.kpiData = data.schoolScreen
						that.pieSeries1={
							xValue:kpiInfo.fileTypeAcc.xValue,
							yValue:kpiInfo.fileTypeAcc.yValue
						}
					})
				})
			},
			schoolData(){
				let that = this;
				getCommHttpData({
					url: 'schoolScreen/info',
					method: 'post',
					contentType: 2,
					data: {deptId:this.orgId}
				}, function(data) {
					that.kpiData = data.schoolScreen
					that.pieSeries1={
						xValue:kpiInfo.fileTypeAcc.xValue,
						yValue:kpiInfo.fileTypeAcc.yValue
					}
				})
			}
		}
	}
</script>