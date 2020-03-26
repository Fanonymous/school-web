<template>
	<div class="mod-demo-echarts card-index-cont">
		<router-link :replace=true :to="{name:routerName}">
		<el-row :gutter="12" style="text-align: center;">
			<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="process-con padding-add">
				<!--<el-card shadow="hover" class="card-index-box" style="position: relative;text-align: center;">
					<div class="process-title margin-bottom-10">多媒体装备配备数</div>
					<el-progress type="circle" color="#41cac0" :percentage="kpiData.banCard" :width="110" :stroke-width="10">
					</el-progress>
				</el-card>-->
				<el-card shadow="hover" class="card-index-box  card-index-nopadding">
					<div class="card-index-body">
						<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon51.png" /></div>
						<div class="body-text2">
							<div class="kpi-text">多媒体装备配备数</div>
							<div class="kpi-value"><span class="kpi-num">{{kpiData.touch || 0}}</span>台</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="process-con padding-add">
				<el-card shadow="hover" class="card-index-box  card-index-nopadding">
					<div class="card-index-body">
						<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon50.png" /></div>
						<div class="body-text2">
							<div class="kpi-text">电子班牌配备数</div>
							<div class="kpi-value"><span class="kpi-num">{{kpiData.banCard || 0}}</span>台</div>
						</div>
					</div>
				</el-card>
				<!--<el-card shadow="hover" class="card-index-box">
					<div class="process-title margin-bottom-10">电子班牌配备数</div>
					<el-progress type="circle" color="#00b1f3" :percentage="kpiData.banCard" :width="110" :stroke-width="10">
					</el-progress>
				</el-card>-->
			</el-col>
			<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="process-con">
				<el-card shadow="hover" class="card-index-box">
					<div class="process-title margin-bottom-10 card-index-process-title">
						班均出口带宽
						<div class="card-index-process-value"><span class="kpi-num">{{kpiData.net}}</span>MB/s</div>
					</div>
					<el-progress type="dashboard" color="#41cac0" :percentage="kpiData.net" :format="format" :width="110" :stroke-width="10" :show-text=false></el-progress>
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
					banCard: 2,
					net: 0,
					touch: 5
				},
				routerName:this.GLOBAL.getUserType() == 4 ? 'a-media-infor-edu' : 'a-media-infor-school'
			}
		},
		mounted() {
			this.iniChartsData();
		},

		methods: {
			format(percentage) {
				let result = Math.round(percentage * 10) / 10;
		        return `${result}MB/s`;
		   },
			iniChartsData() {
				let that = this;
				getCommHttpData({
					url: 'uc/micro/informationizeBuild',
					method: 'get',
					contentType: 1,
					data: {date:getDateStr(0)}
				}, function(data) {
					that.kpiData = data.page

				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	@media screen and (max-width: 1200px) {
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
	}
.padding-add{
    /deep/ .el-card__body{
        padding: 30px 0 !important;
    }
}
</style>