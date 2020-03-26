<template>
	<div class="mod-demo-echarts">
		
		<el-row :gutter="12" style="text-align: center;" v-if="userType ==4"> 
			<el-col :span="12" class="process-con">
				<el-progress style="margin-top: 0px;" type="circle" color="#41cac0" :percentage="kpiData.mediaClassroomRat" :width="99" :stroke-width="10">
				</el-progress>
				<div class="process-title">多媒体教室可用比例</div>
			</el-col>
			<el-col :span="12" class="process-con">
				<el-progress style="margin-top: 0px;" type="circle" color="#41cac0" :percentage="kpiData.netspaceRegistRat" :width="99" :stroke-width="10">
					
				</el-progress>
				<div class="process-title">网络空间注册率</div>
			</el-col>
			<el-col :span="12"  v-if="userType ==2">
				<el-card shadow="hover" class="analysis-card">
					<div class="analysis-body">
						<div class="body-icon icon-small grey"><img src="~@/assets/img/icons/1.png" /></div>
						<div class="body-text2 grey">
							<div class="kpi-value"><span class="kpi-num">{{kpiData.stuEquipRat || 0}}</span></div>
							<div class="kpi-text">生机比</div>
						</div>
					</div>
				</el-card>
				<el-card shadow="hover" class="analysis-card">
					<div class="analysis-body"> 
						<div class="body-icon icon-small grey"><img src="~@/assets/img/icons/2.png" /></div>
						<div class="body-text2 grey">
							<div class="kpi-value"><span class="kpi-num">{{kpiData.teacherEquipRat || 0}}</span></div>
							<div class="kpi-text">师机比</div>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
		
		<el-row :gutter="12" style="text-align: center;" v-if="userType ==2"> 
			<el-col :span="8" class="process-con">
				<el-progress style="margin-top: 0px;" type="circle" color="#41cac0" :percentage="kpiData.mediaClassroomRat" :width="99" :stroke-width="10">
				</el-progress>
				<div class="process-title">多媒体教室可用比例</div>
			</el-col>
			<el-col :span="8">
				<el-card shadow="hover" class="analysis-card">
					<div class="analysis-body">
						<div class="body-icon icon-small grey"><img src="~@/assets/img/icons/1.png" /></div>
						<div class="body-text2 grey">
							<div class="kpi-value"><span class="kpi-num">{{kpiData.stuEquipRat || 0}}</span></div>
							<div class="kpi-text">生机比</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card shadow="hover" class="analysis-card">
					<div class="analysis-body"> 
						<div class="body-icon icon-small grey"><img src="~@/assets/img/icons/2.png" /></div>
						<div class="body-text2 grey">
							<div class="kpi-value"><span class="kpi-num">{{kpiData.teacherEquipRat || 0}}</span></div>
							<div class="kpi-text">师机比</div>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
		
		<!--<el-row :gutter="12">
			<el-col :span="8">
				<el-progress style="margin-top: 0px;" type="circle" color="#41cac0" :percentage="kpiData.mediaClassroomRat" :width="120" :stroke-width="10"></el-progress>
			</el-col>
			<el-col :span="16">
				<el-col :span="12">
				<el-card shadow="hover" class="analysis-card">
					<div class="analysis-body">
						<div class="body-icon icon-small grey"><img src="~@/assets/img/icons/1.png" /></div>
						<div class="body-text2 grey">
							<div class="kpi-value"><span class="kpi-num">{{kpiData.stuEquipRat || 0}}</span></div>
							<div class="kpi-text">生机比</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover" class="analysis-card">
					<div class="analysis-body"> 
						<div class="body-icon icon-small grey"><img src="~@/assets/img/icons/2.png" /></div>
						<div class="body-text2 grey">
							<div class="kpi-value"><span class="kpi-num">{{kpiData.teacherEquipRat || 0}}</span></div>
							<div class="kpi-text">师机比</div>
						</div>
					</div>
				</el-card>
			</el-col>

			</el-col>
			<el-col :span="8">
				<el-progress style="margin-top: 0px;" type="circle" color="#41cac0" :percentage="kpiData.netspaceRegistRat" :width="120" :stroke-width="10"></el-progress>
			</el-col>
			<el-col :span="16">
				<el-card>
					<chart-pie ref="pispieChart1" :id="'pispieChart1'" :height="'350px'" :title="'数据来源'" :series="pieSeries1"></chart-pie>
				</el-card>
			</el-col>

		</el-row>-->

	</div>
</template>
<style>
	.process-con{
		position: relative;
	}
	.process-title{
		margin-top: 12px;
	}
	
</style>
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
				pieSeries1vs: {
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
						that.kpiData.mediaClassroomRat = data.info.mediaClassroomRat == null?0:data.info.mediaClassroomRat
//						that.kpiData.mediaClassroomRat = data.info.mediaClassroomRat
//						that.kpiData.mediaClassroomRat = data.info.mediaClassroomRat
//						that.kpiData.mediaClassroomRat = data.info.mediaClassroomRat
//						that.pieSeries1vs={
//							xValue:kpiInfo.fileTypeAcc.xValue,
//							yValue:kpiInfo.fileTypeAcc.yValue
//						}
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
					that.kpiData.mediaClassroomRat = data.schoolScreen.mediaClassroomRat == null?0:data.schoolScreen.mediaClassroomRat
//					that.pieSeries1vs={
//						xValue:kpiInfo.fileTypeAcc.xValue,
//						yValue:kpiInfo.fileTypeAcc.yValue
//					}
				})
			}
		}
	}
</script>