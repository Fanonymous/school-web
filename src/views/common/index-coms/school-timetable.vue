<template>
	<div class="mod-demo-echarts card-index-cont">
		<el-row :gutter="12">
			<router-link :replace=true :to="{name:'edu-my-schedule'}" >
			<el-col :span="24">
				<el-card shadow="hover">
					<div class="index-grey-nodata" v-if="list.length==0" >
						<img src="~@/assets/img/datano.png" width="100px" />
						<div class="grey">暂无课表</div>
					</div>
					<table v-else width="100%" cellspacing="0" cellpadding="0" style="text-align: center;">
						<tr >
							<template v-for="(item,index) in list" v-if="item.courseList[weekDay].list.length>0">
								<td>
									<div :class="nowIndex==index?'timetable-text-active':'timetable-text'">
										<template v-if="item.startTime == ''">{{item.lessionCodeName}}</template>
										<template v-else>{{item.startTime}}-{{item.endTime}}</template>
									</div>
								<div style="border-top: 2px #e3e6e1 solid;text-align: center;margin:20px 0px 20px 0px;">
									<span :class="nowIndex==index?'default-timetable-active':'default-timetable'"></span>
								</div>
								</td>
							</template>
						</tr>
						<tr>
							<template v-for="(item,index) in list">
								<td v-if="item.courseList[weekDay].list.length>0" >
									<div class="margin-bottom-10" :class="nowIndex==index?'timetable-text-active':'timetable-text'">
										<!--<template v-for="subjectItem in item.courseList[weekDay].list" >
											<template>{{subjectItem.subjectName}}</template>
										</template>-->
										{{item.courseList[weekDay].list[0].gradeName}}{{item.courseList[weekDay].list[0].className}}
										<!--<template v-if="item.courseList[weekDay].list.length >1" >...</template>-->
									</div>
								</td>
							</template>
						</tr>
						<tr>
							<template v-for="(item,index) in list">
								<td v-if="item.courseList[weekDay].list.length>0">
									<span :class="nowIndex==index?'timetable-text-active':'timetable-text'">
										<!--<template v-for="subjectItem in item.courseList[weekDay].list" >
											<template>{{subjectItem.gradeName}}{{subjectItem.className}}</template>
										</template>-->
										{{item.courseList[weekDay].list[0].subjectName}}
										<div v-if="item.courseList[weekDay].list.length >1" style="font-weight: bold;">...</div>
									</span>
								</td>
							</template>
						</tr>
					</table>
					
				</el-card>
			</el-col>
			</router-link>
		</el-row>

	</div>
</template>

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
				weekDay:0,
				toTime:'',
				nowIndex:-1
			}
		},
		mounted() {
			const today = new Date();
			this.weekDay = today.getDay()
			this.weekDay = this.weekDay==0?6:this.weekDay-1
			//获得当前节次
			this.toTime = today.getHours()+':'+today.getMinutes()
			this.iniChartsData();
		},

		methods: {
			iniChartsData() {
				let that = this;
				getCommHttpData({
					url: 'uc/micro/myCourse',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					that.list = data.list
					for(let i in data.list){
						if(data.list[i].startTime != '' && compareNowDate(data.list[i].startTime,data.list[i].endTime)){
							that.nowIndex = i
						}
					}
					
					
				})
			}
		}
	}
</script>
<style>
	
</style>