<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="mod-demo-echarts">
    <date-week-analysis @refreshChartsData="getDateData"></date-week-analysis>
    <media-radio-analysis v-if="userType == 4" :schoolTypeShow="true" @refreshChartsData="getFilterMediaData" ></media-radio-analysis>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card shadow="hover">
          <chart-pie ref="radarChart" :id="'radarChart'" :title="'应用类型分布(使用次数)'"  :series="radarSeries"></chart-pie>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <chart-line ref="auLineChart" :id="'auLineChart'" :title="'软件类型使用趋势分析(使用次数)'"  :series="lineSeries"></chart-line>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card shadow="hover">
          <div class="table-title margin-bottom-20">应用详情(使用次数)</div>
          <el-col :lg="24" style="text-align:center;margin:50px 0px;" v-if="detailList.length == 0">
            <img src="~@/assets/img/nodata.png" class="nodata">
          </el-col>
          <template v-for="(item,index) in detailList" v-else>
            <el-col :lg="8" >
              <!-- <img src="~@/assets/img/icons/14.png"/> -->
              <div class="top-title">{{item.name}}</div>
              <div class="table-box">
                <el-table :data="item.appList" fit :show-header="false">
                  <el-table-column prop="softwareName" align="left" label="">
                  </el-table-column>
                  <el-table-column prop="rate" align="left" label="" width="280">
                    <template slot-scope="scope">
                    	<div class="percentage-text" :style="'width:'+scope.row.countRate*2+'px'"></div>
                      <div class="percentage-value">{{scope.row.countRate}}%</div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
          </template>
        </el-card>
      </el-col>

    </el-row>
  </div>

</template>
<style scoped>
  .el-progress-bar__inner,
  .el-progress-bar__outer {
    border-radius: 0px;
    cursor: pointer;
  }

  .el-progress-bar__outer {
    background-color: #FFFFFF;
  }
  .table-box{
    height: 292px;
    overflow: auto;
    border-right: 1px #EEEEEE solid;
    border-left: 1px #EEEEEE solid;
    border-bottom: 1px #EEEEEE solid;
    margin-bottom: 20px;
  }
  .top-title{
    background-color: #eaeff9;
    height: 48px;
    line-height: 48px;
    text-align: center;
  }
  .top-title img{
    margin-right: 20px;
  }
  .percentage-text{
    display: inline-block;
    float:left;
    height: 30px;
    line-height: 30px;
    background-color: #9dc2f6;
    border-radius: 8px;
    padding-left: 5px;
  }
  .percentage-value{
    display: inline-block;
    height: 30px;
    line-height: 30px;
    margin-left:10px;
  }
</style>
<script>
  import Grade from '../common/grade'
  import Class from '../common/class'
  import ChartRadar from '@/components/charts/radar'
  import ChartLine from '@/components/charts/line'
  import ChartPie from '@/components/charts/pie'
  import DateWeekAnalysis from '../common/date-week-analysis'
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
        startDate:'',
        endDate:'',
        schoolType:'',
        dataList: [{name:'33',rate:30.1},{name:'33',rate:50.2},{name:'33',rate:50.2},{name:'33',rate:50.2},{name:'33',rate:50.2}],
        listLoading: true,
        radarSeries:{
          xValue: [],
          yValue: [],
        },
        lineSeries:{
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
        detailList:[],
        enLineChartLoading:false
      }
    },
    components: {
      ChartRadar,
      ChartLine,
      ChartPie,
      DateWeekAnalysis,
      MediaRadioAnalysis
    },
    mounted() {
      let that = this
      that.enLineChartLoading = true
      this.iniChartsData()
      // setTimeout(() => {

      //   that.radarSeries = {
      //     xValue: ['45','4545'],
      //     yValue: [1,2],
      //     seriaName: ['45','4545'],
      //     yAxis: [{
      //       name: '%',
      //       min: 0,
      //       max: 100,
      //       interval: null,
      //       axisLabel: ''
      //     }]
      //   }
      //   that.lineSeries = {
      //     xValue: ['45','4545'],
      //     yValue: [[1,2],[10,20],[31,32],[81,82]],
      //     seriaName: ['互动趋势','互动趋势2','互动趋势3','互动趋势4'],
      //     yAxis: [{
      //       name: '%',
      //       min: 0,
      //       max: 100,
      //       interval: null,
      //       axisLabel: ''
      //     }]
      //   }
      //   that.enLineChartLoading = false
      // }, 1000)
      // getCommonDictByType(this, 'equip_use_years', 'equipUseYearsList',function(res){
      //   that.equipUseYearsList = res.list.reverse()
      // })
      // this.getDeviceTypeList()
      // this.getUseTimeDeviceTypeList()
      // this.getDataList();
    },
    methods: {
      getDateData(startDate,endDate){
      	this.startDate = startDate
      	this.endDate = endDate
      	this.iniChartsData()
      },
      getFilterMediaData(jsonParams){
        this.schoolType = jsonParams.schoolType
        this.iniChartsData()
      },
      iniChartsData(){
        let that = this
        that.enLineChartLoading = true
        let commParams ={startDate:this.startDate,endDate:this.endDate}
        if(this.userType == 4 && this.schoolType != '' && this.schoolType != '全部'){
          commParams ={startDate:this.startDate,endDate:this.endDate,schoolType:this.schoolType}
        }
        console.log(commParams)
        //应用类型分布
        getCommHttpData({
          url: 'equipAnalysis/appTypeDistri',
          method: 'get',
          contentType: 1,
          data: commParams
        }, function(data) {
          that.radarSeries = {
            xValue: data.xValue,
            yValue: data.yValue,
            seriaName: data.xValue,
            yAxis: [{
              name: '%',
              min: 0,
              max: 100,
              interval: null,
              axisLabel: '',
              tipLabel:'次'
            }]
          }
          that.enLineChartLoading = false
        })

        //软件类型使用趋势
        getCommHttpData({
          url: 'equipAnalysis/appTypeTrend',
          method: 'get',
          contentType: 1,
          data: commParams
        }, function(data) {
          that.lineSeries = {
            xValue: data.xValue,
            yValue: data.yValue2,
            seriaName: data.yValue,
            yAxis: [{
              name: '次数',
              min: 0,
              max: null,
              interval: null,
              axisLabel: '',
              tipLabel:'次数'
            }]
          }
          that.enLineChartLoading = false
        })
        //应用详情
        getCommHttpData({
          url: 'equipAnalysis/appTypeDetails',
          method: 'get',
          contentType: 1,
          data: commParams
        }, function(data) {
          that.detailList = data.list
          that.enLineChartLoading = false
        })


        // setTimeout(() => {

        //   that.radarSeries = {
        //     xValue: ['45','4545'],
        //     yValue: [1,2],
        //     seriaName: ['45','4545'],
        //     yAxis: [{
        //       name: '%',
        //       min: 0,
        //       max: 100,
        //       interval: null,
        //       axisLabel: ''
        //     }]
        //   }
        //   that.lineSeries = {
        //     xValue: ['45','4545'],
        //     yValue: [[1,2],[10,20],[31,32],[81,82]],
        //     seriaName: ['互动趋势','互动趋势2','互动趋势3','互动趋势4'],
        //     yAxis: [{
        //       name: '%',
        //       min: 0,
        //       max: 100,
        //       interval: null,
        //       axisLabel: ''
        //     }]
        //   }
        //   that.enLineChartLoading = false
        // }, 1000)
      }
    }
  }
</script>
