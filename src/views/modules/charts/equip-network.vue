<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="mod-demo-echarts">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-card shadow="hover">
          <div class="table-title margin-bottom-20">网络宽带分析</div>
          <el-col :span="6" class="network-chart">
            网络运营商
            <img src="~@/assets/img/brand/mobile.png" />
            <!-- <img src="~@/assets/img/brand/telecom.png" />
            <img src="~@/assets/img/brand/unicom.png" /> -->
          </el-col>
          <el-col :span="6" class="network-chart">
            班均上传
            <div class="kpi-text">上传速度：<span class="kpi-num">3.64</span> MB/s</div>
            <div>（上传带宽：29.09 Mbps)</div>
          </el-col>
          <el-col :span="6" class="network-chart">
            班均下载
           <div class="kpi-text">下载速度：<span class="kpi-num">3.64</span>MB/s</div>
            <div>（下载带宽：81.57 Mbps)</div>
          </el-col>
          <el-col :span="6" class="network-chart">
            班均出口带宽
            <div class="kpi-text"><span class="kpi-num">3.64</span> Mbps</div>
          </el-col>
          <el-col :span="24">
            <div class="right margin-bottom-10 title-tips">注：测试结果比实际速度略低</div>
          </el-col>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card shadow="hover">
          <div class="table-title margin-bottom-20">网络宽带分析</div>
          <el-col :span="8" class="network-chart">
            <div class="analysis-body analysis-body-onbg">
            	<div class="body-icon primary"><img src="~@/assets/img/icons/icon52.png"/></div>
            	<div class="body-text" ><div class="kpi-text">班均出口带宽</div><div><span class="kpi-value">52.5</span>Mbps</div></div>
            </div>
            <div class="analysis-body analysis-body-onbg">
            	<div class="body-icon primary"><img src="~@/assets/img/icons/icon53.png"/></div>
            	<div class="body-text" ><div class="kpi-text">班均出口带宽</div><div><span class="kpi-value">52.5</span>Mbps</div></div>
            </div>
          </el-col>
          <el-col :span="16" class="network-chart" v-loading="enLineChartLoading">
            <chart-line :id="'enLineChar'" ref="enLineChar" :title="'网络流量趋势分析'" :series="lineSeries"></chart-line>
          </el-col>
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

  import {
    getCommHttpData,
    getCommonDictByType,
    getExportFile,
  } from '@/utils/common'
  import ChartLine from '@/components/charts/line'
  export default {
    components: {
      ChartLine
    },
    data() {
      return {
        schoolId: this.GLOBAL.getOrgId(),
        addLoading: false,
        dataList: null,
        listLoading: true,
        enLineChartLoading:false,
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
      let that = this
      // getCommonDictByType(this, 'equip_use_years', 'equipUseYearsList',function(res){
      //   that.equipUseYearsList = res.list.reverse()
      // })
      that.enLineChartLoading = true
      setTimeout(() => {
        that.lineSeries = {
          xValue: ['45','4545'],
          yValue: [[1,2],[10,20],[31,32],[81,82]],
          seriaName: ['互动趋势'],
          yAxis: [{
            name: '%',
            min: 0,
            max: 100,
            interval: null,
            axisLabel: ''
          }]
        }
        that.enLineChartLoading = false
      }, 1000)
    },
    methods: {


    }
  }
</script>
