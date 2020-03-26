<template>
  <div class="mod-demo-echarts">
    <media-radio-analysis :schoolTypeShow="true" @refreshChartsData="getFilterMediaData" ></media-radio-analysis>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card shadow="hover">
          <chart-pie ref="equipAnalysisPie1" :id="'equipConfigPie1'" :title="'网络运营商占比'"  :series="pieSeries1"></chart-pie>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <chart-pie ref="equipAnalysisPie2" :id="'equipAnalysisPie2'" :title="'班均带宽达标占比'"  :series="pieSeries2"></chart-pie>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card shadow="hover">
          <chart-column ref="equipAnalysisColumn" :id="'equipAnalysisColumn'" :standardLine="true" :title="'学校网络带宽分析'"  :series="columnSeries"></chart-column>
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
        userType: this.GLOBAL.getUserType(),
        addLoading: false,
        dataList: [{name:'33',rate:30.1},{name:'33',rate:50.2},{name:'33',rate:50.2},{name:'33',rate:50.2},{name:'33',rate:50.2}],
        listLoading: true,
        startDate:'',
        endDate:'',
        schoolType:'',
        pieSeries1:{
          xValue: [],
          yValue: [],
        },
        pieSeries2:{
          xValue: [],
          yValue: [],
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
      ChartColumn,
      MediaRadioAnalysis
    },
    mounted() {

      // that.enLineChartLoading = true
      // setTimeout(() => {

      //   that.pieSeries1 = {
      //     xValue: ['已安装','未安装'],
      //     yValue: [0,0],
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
      //   that.pieSeries2 = {
      //     xValue: ['已安装','未安装'],
      //     yValue: [0,0],
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

      //   that.columnSeries = {
      //     xValue: ['已安装','未安装'],
      //     yValue: [[100,200]],
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
      // getCommonDictByType(this, 'equip_use_years', 'equipUseYearsList',function(res){
      //   that.equipUseYearsList = res.list.reverse()
      // })
      this.iniChartsData()
      // this.getUseTimeDeviceTypeList()
      // this.getDataList();
    },
    methods: {
      getFilterMediaData(jsonParams){
        this.schoolType = jsonParams.schoolType
        this.iniChartsData()
      },
      iniChartsData(){
        let that = this
        let commParams ={}
        if(this.userType == 4){
          if(this.schoolType != '全部' && this.schoolType != '' ){
            commParams = {schoolType:this.schoolType}
          }
        }
        getCommHttpData({url:'equipAnalysis/areaOperatorRate',method:'get',contentType:1,data:commParams},function(data){
          that.pieSeries1 = {
            xValue: data.list.xValue,
            yValue: data.list.yValue,
            seriaName: ['互动趋势'],
            yAxis: [{
              name: '%',
              min: 0,
              max: 100,
              interval: null,
              axisLabel: '',
              tipLabel:'所'
            }]
          }
        })
        getCommHttpData({url:'equipAnalysis/areaSchoolBandDetail',method:'get',contentType:1,data:commParams},function(data){
          let max = Math.max.apply(Math,data.list.yValue)
          that.columnSeries = {
              xValue: data.list.xValue,
              yValue: [data.list.yValue],
              seriaName: ['班均带宽'],
              yAxis: [{
                name: '班均带宽(MB)',
                min: 0,
                max: max<10?10:max,
                interval: null,
                axisLabel: '',
                tipLabel:'MB'
              }]
            }
        })
        getCommHttpData({url:'equipAnalysis/areaBandwidth',method:'get',contentType:1,data:commParams},function(data){
          that.pieSeries2 = {
            xValue: ['已达标学校','未达标学校'],
            yValue: [data.list.reachStandard,data.list.notReachStandard],
            seriaName: ['已达标','未达标'],
            yAxis: [{
              name: '%',
              min: 0,
              max: 100,
              interval: null,
              axisLabel: '',
              tipLabel:'所'
            }]
          }
        })
      }
    }
  }
</script>
