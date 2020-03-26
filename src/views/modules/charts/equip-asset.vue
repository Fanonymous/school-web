<template>
  <div class="mod-demo-echarts">
    <!-- <media-radio-analysis :schoolTypeShow="true" @refreshChartsData="getFilterMediaData" ></media-radio-analysis> -->
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card shadow="hover">
          <chart-pie-ring-line :id="'equipClassificationAnalysis'" ref="equipClassificationAnalysis" :title="'设备分类占比'" :series="pieSeries"></chart-pie-ring-line>
          <!-- <chart-pie ref="equipClassificationAnalysis" :id="'equipClassificationAnalysis'" :title="'设备分类占比'"  :series="pieSeries"></chart-pie> -->
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <chart-line ref="equipTrendAnalysis" :id="'equipTrendAnalysis'" :title="'近一年设备量趋势分析'"  :series="lineSeries"></chart-line>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card shadow="hover">
          <div class="table-title margin-bottom-20">设备资产明细
            <div class="right">
              <i class="el-icon-s-data" @click="detailType =1,detailList()"></i>
              <i class="el-icon-s-grid" @click="detailType =2"></i>
            </div>
          </div>
          <chart-bar-line-zoom  v-if="detailType == 1" ref="equipAssetAnalysis" :id="'equipAssetAnalysis'" :title="''"  :series="columnSeries"></chart-bar-line-zoom>
          <template v-else>
            <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row>
              <el-table-column align="center" label='序号' width="100">
                <template slot-scope="scope">
                   {{scope.$index+1+pageSize*(pageIndex-1)}}
                </template>
              </el-table-column>
              <el-table-column prop="xval" align="center" label='学校'>
              </el-table-column>
              <el-table-column align="center" label='多媒体设备数'>
                <template slot-scope="scope">
                   {{scope.row.yval1}}
                </template>
              </el-table-column>
              <el-table-column align="center" label='多媒体配备率'>
                <template slot-scope="scope">
                   {{scope.row.yval}}%
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-container fr">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex"
                :page-sizes="[10,20,50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
              </el-pagination>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped>
  i{
    cursor: pointer;
  }
</style>
<script>
  import ChartPie from '@/components/charts/pie'
  import ChartLine from '@/components/charts/line'
  import ChartColumn from '@/components/charts/column'
  import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
  import ChartPieRingLine from '@/components/charts/pie-ring-line'
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
        startDate:'',
        endDate:'',
        schoolType:'',
        pieSeries:{
          xValue: [],
          yValue: [],
        },
        lineSeries:{
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
        dataList: null,
        listLoading: true,
        pageIndex: 1,
        pageSize: 10,
        totalCount: null,
        detailType:1
      }
    },
    components: {
      ChartPie,
      ChartLine,
      ChartBarLineZoom,
      ChartPieRingLine
    },
    mounted() {
      this.iniChartsData()
    },
    methods: {
      handleSizeChange(size) {
        this.pageSize = size;
        this.iniTableData();
      },
      handleCurrentChange(currPage) {
        this.pageIndex = currPage;
        this.iniTableData();
      },
      iniTableData(){
        //设备资产明细
        let that = this
        that.listLoading = true
        getCommHttpData({url:'equipAnalysis/equipMeidaRateDetail',method:'get',contentType:1,data:{limit:that.pageSize,page:that.pageIndex}},function(data){
          if(data && data.code === 0) {
           	if(data.page.list.length==0 && that.pageIndex !=1){
          		that.pageIndex = 1
          		that.iniTableData()
          	}
          	that.dataList = data.page.list
          	that.totalCount = data.page.totalCount
          } else {
          	that.dataList = []
          	that.totalCount = 0
          }
          that.listLoading = false
        })
      },
      detailList(){
        let that = this
        //设备资产明细
        getCommHttpData({url:'equipAnalysis/equipMeidaRateDetail',method:'get',contentType:1,data:{}},function(data){
          setTimeout(() => {
            that.columnSeries = {
                xValue: data.list.xValue,
                yValue: [data.list.yValue1,data.list.yValue],
                seriaName: ['设备数','设备配备率'],
                seriaType:['bar','line'],
                yAxis: [{
                  name: '台',
                  min: 0,
                  max: null,
                  interval: null,
                  axisLabel: '',
                  tipLabel:'台'
                },{
                  name: '%',
                  min: 0,
                  max: 100,
                  interval: null,
                  axisLabel: '',
                  tipLabel:'%'
                }]
              }
            }, 500)
        })
      },
      iniChartsData(){
        let that = this
        let commParams ={}
        // if(this.userType == 4){
        //   if(this.schoolType != '全部' && this.schoolType != '' ){
        //     commParams = {schoolType:this.schoolType}
        //   }
        // }
        //设备分类
        getCommHttpData({url:'equipAnalysis/equipTypeRate',method:'get',contentType:1,data:commParams},function(data){
          let titleCenterValue = 0
          data.list.yValue.forEach(item=>{
            titleCenterValue +=parseInt(item)
          })
          setTimeout(() => {
            that.pieSeries = {
              xValue: data.list.xValue,
              yValue: data.list.yValue,
              seriaName: data.list.xValue,
              yAxis: [{
                name: '等级占比',
                min: 0,
                max: null,
                interval: 0,
                axisLabel: ''
              }],
              titleCenter:'设备总数',
              titleCenterValue:titleCenterValue
            }
          }, 500)
          // that.pieSeries = {
          //   xValue: data.list.xValue,
          //   yValue: data.list.yValue,
          //   seriaName: ['互动趋势'],
          //   yAxis: [{
          //     name: '%',
          //     min: 0,
          //     max: 100,
          //     interval: null,
          //     axisLabel: '',
          //     tipLabel:'%'
          //   }]
          // }
        })
        that.detailList()
        that.iniTableData()
        //趋势分析
        getCommHttpData({url:'equipAnalysis/equipTrendYear',method:'get',contentType:1,data:commParams},function(data){
          setTimeout(() => {
            that.lineSeries = {
              xValue: data.list.xValue,
              yValue: [data.list.yValue1,data.list.yValue],
              seriaName: ['新增','累计'],
              yAxis: [{
                name: '台',
                min: 0,
                max: 100,
                interval: null,
                axisLabel: '',
                tipLabel:'台'
              }]
            }
          }, 500)
        })
      }
    }
  }
</script>
