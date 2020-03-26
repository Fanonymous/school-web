<template>
  <div class="mod-demo-echarts">
    <media-radio-analysis  v-if="userType == 4" :schoolTypeShow="true" @refreshChartsData="getFilterMediaData" ></media-radio-analysis>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card shadow="hover">
          <chart-pie ref="equipConfigPie" :id="'equipConfigPie'" :title="'品牌分布'"  :series="pieSeries"></chart-pie>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <chart-column ref="equipConfigColumn" :id="'equipConfigColumn'" :title="'使用年限分析'"  :series="columnSeries"></chart-column>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card shadow="hover">
          <div class="table-title margin-bottom-20">设备配置分析</div>
          <el-col :lg="8" >
            <chart-pie-radius ref="equipConfigPie1" :id="'equipConfigPie1'" :title="'操作系统'"  :series="pieRingSeries1"></chart-pie-radius>
          </el-col>
          <el-col :lg="8">
            <chart-pie-radius ref="equipConfigPie2" :id="'equipConfigPie2'" :title="'CPU'"  :series="pieRingSeries2"></chart-pie-radius>
          </el-col>
          <el-col :lg="8">
            <chart-pie-radius ref="equipConfigPie3" :id="'equipConfigPie3'" :title="'内存'"  :series="pieRingSeries3"></chart-pie-radius>
          </el-col>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style>

</style>
<script>
  import Grade from '../common/grade'
  import Class from '../common/class'
  import ChartPie from '@/components/charts/pie'
  import ChartPieRadius from '@/components/charts/pie-radius'
  import ChartColumn from '@/components/charts/column'
  import MediaRadioAnalysis from '../common/media-radio-analysis'
  import {
    getCommHttpData,
    getCommonDictByType,
    getExportFile,
    deleteData
  } from '@/utils/common'
  export default {
    data() {
      return {
        schoolId: this.GLOBAL.getOrgId(),
        userType:this.GLOBAL.getUserType(),
        addLoading: false,
        startDate:'',
        endDate:'',
        schoolType:'',
        dataList: [{name:'33',rate:30.1},{name:'33',rate:50.2},{name:'33',rate:50.2},{name:'33',rate:50.2},{name:'33',rate:50.2}],
        listLoading: true,
        pieSeries:{
          xValue: [],
          yValue: [],
        },
        pieRingSeries1:{
          xValue: [],
          yValue: []
        },
        pieRingSeries2:{
          xValue: [],
          yValue: []
        },
        pieRingSeries3:{
          xValue: [],
          yValue: []
        },
        columnSeries:{
          xValue: [],
          yValue: [],
          yAxis: [{
            name: '%',
            min: 0,
            max: 100,
            interval: null,
            axisLabel: ''
          }]
        },
        enLineChartLoading:false

      }
    },
    components: {
      ChartPie,
      ChartPieRadius,
      ChartColumn,
      MediaRadioAnalysis
    },
    mounted() {
      let that = this
      this.iniChartsData()
      // that.enLineChartLoading = true
      // setTimeout(() => {
      //   that.columnSeries = {
      //     xValue: ['45','4545'],
      //     yValue: [[1,2],[10,20],[31,32],[81,82]],
      //     seriaName: ['互动趋势'],
      //     yAxis: [{
      //       name: '%',
      //       min: 0,
      //       max: 100,
      //       interval: null,
      //       axisLabel: '',
      //       tipLabel:'%'
      //     }]
      //   }
      //   that.enLineChartLoading = false
      // }, 1000)

    },
    methods: {
      // getDateData(startDate,endDate){
      // 	this.startDate = startDate
      // 	this.endDate = endDate
      // 	this.iniChartsData()
      // },
      getFilterMediaData(jsonParams){
        this.schoolType = jsonParams.schoolType
        this.iniChartsData()
      },
      iniChartsData(){
        let that = this
        that.enLineChartLoading = true
        let commParams ={}
        if(this.userType == 4){
          if(this.schoolType != '全部' && this.schoolType != '' ){
            commParams = {schoolType:this.schoolType}
          }
        }
        getCommHttpData({
          url: 'equipAnalysis/brandRate',
          method: 'get',
          contentType: 1,
          data: commParams
        }, function(data) {
          that.pieSeries = {
            xValue: data.list.xValue,
            yValue: data.list.yValue,
            seriaName: data.list.xValue,
            yAxis: [{
              name: '台',
              min: 0,
              max: 100,
              interval: null,
              axisLabel: '',
              tipLabel:'台'
            }]
          }
          that.enLineChartLoading = false
        })

        getCommHttpData({
          url: 'equipAnalysis/useTimeLength',
          method: 'get',
          contentType: 1,
          data: commParams
        }, function(data) {
          that.columnSeries = {
            xValue: data.list.xValue,
            yValue: [data.list.yValue],
            seriaName: ['数量'],
            yAxis: [{
              name: '装备量(台)',
              min: 0,
              max: null,
              interval: null,
              axisLabel: '',
              tipLabel:'台'
            }]
          }
          that.enLineChartLoading = false
        })

        getCommHttpData({
          url: 'equipAnalysis/equipSysConfig',
          method: 'get',
          contentType: 1,
          data: commParams
        }, function(data) {
          that.pieRingSeries1 = {
            xValue: data.list.xValue,
            yValue: data.list.yValue,
            seriaName: data.list.xValue,
            yAxis: [{
              name: '台',
              min: 0,
              max: 100,
              interval: null,
              axisLabel: '',
              tipLabel:'台'
            }]
          }
          that.enLineChartLoading = false
        })

        getCommHttpData({
          url: 'equipAnalysis/equipCpuConfig',
          method: 'get',
          contentType: 1,
          data: commParams
        }, function(data) {
          that.pieRingSeries2 = {
            xValue: data.list.xValue,
            yValue: data.list.yValue,
            seriaName: data.list.xValue,
            yAxis: [{
              name: '台',
              min: 0,
              max: 100,
              interval: null,
              axisLabel: '',
              tipLabel:'台'
            }]
          }
          that.enLineChartLoading = false
        })

        getCommHttpData({
          url: 'equipAnalysis/equipRamConfig',
          method: 'get',
          contentType: 1,
          data: commParams
        }, function(data) {
          that.pieRingSeries3 = {
            xValue: data.list.xValue,
            yValue: data.list.yValue,
            seriaName: data.list.xValue,
            yAxis: [{
              name: '台',
              min: 0,
              max: 100,
              interval: null,
              axisLabel: '',
              tipLabel:'台'
            }]
          }
          that.enLineChartLoading = false
        })
      }
    }
  }
</script>
