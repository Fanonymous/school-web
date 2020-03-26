<template>
	<div class="mod-demo-echarts card-index-cont">
		<el-row :gutter="12">
			<router-link :replace=true :to="{name:'edu-class-schedule'}" >
			<el-col :span="24">
				<el-card shadow="hover" style="min-width: 300px;overflow-x: auto;">
					<div class="index-grey-nodata" v-if="list.length==0" >
						<img src="~@/assets/img/datano.png" width="100px" />
						<div>暂无课表</div>
					</div>
					<template v-else>
						<table width="100%" align="center" style="text-align: center;">
							<tr>
								<template v-for="(item,index) in list">
									<td :class="nowIndex == index?'timetable-text-active':'timetable-text'" :key="index">
										<div>{{item.lessionCodeName}}</div>
										<img v-if="nowIndex==index" src="~@/assets/img/arrow-now.png" style="margin: 10px 0px 0px 0px;"/>
										<img v-else src="~@/assets/img/arrow.png" style="margin: 10px 0px 0px 0px;"/>
									</td>
								</template>
							</tr>
							<tr>
								<template v-for="(item,index1) in list">
									<td style="text-align: -webkit-center;" :key="index1">
										<div v-if="item.courseList[weekDay].list.length > 0" style="height:80px;writing-mode: vertical-rl;-webkit-writing-mode: vertical-rl;display:inline-block;">
											<template v-for="(subjectItem, i) in item.courseList[weekDay].list" >
												<span :class="nowIndex==index1?'timetable-text-active':'timetable-text'" :key="i" v-if="i ==0">
													{{subjectItem.subjectName}}
												</span>
											</template>
										</div>
										<template v-else>--</template>
									</td>
								</template>
							</tr>
						</table>
						<div style="float: right; position: absolute;top:155px;right: 10px;">
							{{classList[0].gradeName}}{{classList[0].className}}
							<router-link :replace=true :to="{name:routerName}" v-if="isMore">
								<span type="text" style="color:#17B3A3">&nbsp;&nbsp;>></span>
							</router-link>
						</div>
					</template>
				</el-card>
			</el-col>
			</router-link>
		</el-row>

	</div>
</template>
<style>
	.card-index-cont .el-card{
		border: none;
	}
</style>
<script>
	import echarts from 'echarts'
	import mediacss from '@/assets/scss/media.scss'
	import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
	import ChartColumn from '@/components/charts/column'
	import { getCommHttpData, getAnalysisChartData,getDateStr,compareNowDate } from '@/utils/common'
	export default {
		components: {
			ChartBarLineZoom,
			ChartColumn
		},
		data() {
			return {
				list:[],
				classList:[],
				weekDay:0,
				toTime:'',
				nowIndex:-1
			}
		},
		mounted() {
			const today = new Date();
			this.weekDay = today.getDay()
			this.weekDay = this.weekDay==0?6:this.weekDay-1
			this.toTime = today.getHours()+':'+today.getMinutes()
			this.iniChartsData();
		},

		methods: {
			iniChartsData() {
				let that = this;
				getCommHttpData({
					url: 'uc/micro/classCourse',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					if(data.list) {
						that.list = data.list
						that.classList = data.teaList
						for(let i in data.list){
							if(compareNowDate(data.list[i].startTime,data.list[i].endTime)){
								that.nowIndex = i
							}
						}
					} 
				})
			}
		}
	}
</script>