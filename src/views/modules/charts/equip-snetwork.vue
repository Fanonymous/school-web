<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="mod-demo-echarts">
    <date-only @refreshChartsData="getDateData"></date-only>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-card shadow="hover">
          <div class="table-title margin-bottom-20">网络宽带分析</div>
          <el-col :span="6" class="network-chart">
            <div>网络运营商</div>
            <img src="~@/assets/img/brand/telecom.png" v-if="kpiData.xval == '中国电信'" />
            <img src="~@/assets/img/brand/mobile.png" v-else-if="kpiData.xval == '中国移动'" />
            <img src="~@/assets/img/brand/unicom.png" v-else-if="kpiData.xval == '中国联通'" />
            <img src="~@/assets/img/brand/nodata.png" v-else />
            <!-- <img src="~@/assets/img/brand/telecom.png" />
            <img src="~@/assets/img/brand/unicom.png" /> -->
          </el-col>
          <el-col :span="6" class="network-chart">
            班均上传
            <div class="kpi-text">上传速度：<span class="kpi-num">{{kpiData.uplink}}</span> MB/s</div>
            <!-- <div>（上传带宽：29.09 Mbps)</div> -->
          </el-col>
          <el-col :span="6" class="network-chart">
            班均下载
           <div class="kpi-text">下载速度：<span class="kpi-num">{{kpiData.dowlink}}</span>MB/s</div>
            <!-- <div>（下载带宽：81.57 Mbps)</div> -->
          </el-col>
          <el-col :span="6" class="network-chart">
            班均出口带宽
            <div class="kpi-text"><span class="kpi-num">{{kpiData.bandwidth}}</span> Mbps</div>
          </el-col>
          <el-col :span="24">
            <div class="right margin-bottom-10 title-tips"><!-- 注：测试结果比实际速度略低 --></div>
          </el-col>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card shadow="hover" v-loading="enLineChartLoading">
          <!-- <div class="table-title margin-bottom-20">网络宽带分析</div>
          <el-col :span="8" class="network-chart">
            <div class="analysis-body analysis-body-onbg">
            	<div class="body-icon primary"><img src="~@/assets/img/icons/icon52.png"/></div>
            	<div class="body-text" ><div class="kpi-text">班均出口带宽</div><div><span class="kpi-value">52.5</span>Mbps</div></div>
            </div>
            <div class="analysis-body analysis-body-onbg">
            	<div class="body-icon primary"><img src="~@/assets/img/icons/icon53.png"/></div>
            	<div class="body-text" ><div class="kpi-text">班均出口带宽</div><div><span class="kpi-value">52.5</span>Mbps</div></div>
            </div>
          </el-col> -->
         <!-- <el-col :span="16" class="network-chart" v-loading="enLineChartLoading"> -->
            <chart-line :id="'enLineChar'" ref="enLineChar" :title="'网络流量分析'" :series="lineSeries"></chart-line>
          <!-- </el-col> -->
        </el-card>
      </el-col>

    </el-row>
  </div>

</template>
<style>
  .network-chart{
    text-align: center;
  }
  .network-chart .kpi-num{
    font-size: 30px;

  }
  .network-chart .kpi-text{
     margin: 20px 0px;
  }
</style>
<script>
  import DateOnly from '../common/date-only'
  import {
    getCommHttpData,
    getCommonDictByType,
    getExportFile,
  } from '@/utils/common'
  import ChartLine from '@/components/charts/line'
  export default {
    components: {
      ChartLine,
      DateOnly
    },
    data() {
      return {
        schoolId: this.GLOBAL.getOrgId(),
        addLoading: false,
        dataList: null,
        listLoading: true,
        enLineChartLoading:false,
        startDate:'',
        endDate:'',
        kpiData:{
          bandwidth: 0,
          dowlink: 0,
          uplink: 0,
          xval:''
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

      }
    },

    mounted() {
      this.iniChartsData()
    },
    methods: {
      getDateData(startDate,endDate){
      	this.startDate = startDate
      	this.endDate = endDate
      	this.iniChartsData()
      },
      iniChartsData(){
        let that = this
        that.enLineChartLoading = true
        setTimeout(() => {
          //基础统计数量
          getCommHttpData({url:'equipAnalysis/equipTotalNet',method:'get',contentType:1,data:{startDate:this.startDate,endDate:this.endDate}},function(data){
            that.kpiData = data.list
          })
          getCommHttpData({url:'equipAnalysis/equipFolwNet',method:'get',contentType:1,data:{startDate:this.startDate,endDate:this.endDate}},function(data){
            that.lineSeries = {
              xValue: data.list.xValue,
              yValue: [data.list.yValue,data.list.yValue1],
              seriaName: ['上行','下行'],
              yAxis: [{
                name: 'MB',
                min: 0,
                max: 100,
                interval: null,
                axisLabel: '',
                tipLabel:'MB'
              }]
            }
          })

          that.enLineChartLoading = false
        }, 1000)
      }
    }
  }
</script>
