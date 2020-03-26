<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="mod-demo-echarts">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card shadow="hover">
          <chart-radar ref="radarChart" :id="'radarChart'" :title="'使用分析'"  :series="radarSeries"></chart-radar>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <div class="table-title margin-bottom-20">使用时长对比</div>
          <div class="table-box">
            <el-table :data="dataList" fit>
              <el-table-column prop="name" align="left" label="" width="100">
                <img src="~@/assets/img/icons/4.png" width="35px"/>
              </el-table-column>
              <el-table-column prop="name" align="left" label="软件类型" width="150">
              </el-table-column>
              <el-table-column prop="name" align="right" label="月均使用天数">
              </el-table-column>
              <el-table-column prop="rate" align="left" label="每天使用时长">
                <template slot-scope="scope">
                  <div class="percentage-text" :style="'width:'+scope.row.rate+'%'">{{scope.row.rate}}%</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card shadow="hover">
          <chart-line ref="auLineChart" :id="'auLineChart'" :title="'使用时长趋势分析'"  :series="lineSeries"></chart-line>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card shadow="hover">
          <div class="table-title margin-bottom-20">使用详情</div>
          <el-col :lg="8" >
            <div class="top-title"><img src="~@/assets/img/icons/14.png"/>word/excel/ppt</div>
            <div class="table-box">
              <el-table :data="dataList" fit>
                <el-table-column prop="name" align="left" label="软件（在用设备数）" width="150">
                </el-table-column>
                <el-table-column prop="name" align="right" label="月均使用天数">
                </el-table-column>
                <el-table-column prop="rate" align="left" label="每天使用时长">
                  <template slot-scope="scope">
                  	<div class="percentage-text" :style="'width:'+scope.row.rate+'%'">{{scope.row.rate}}%</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :lg="8">
            <div class="top-title"><img src="~@/assets/img/icons/15.png"/>word/excel/ppt</div>
            <div class="table-box">
              <el-table :data="dataList" fit>
                <el-table-column prop="name" align="left" label="软件（在用设备数）" width="150">
                </el-table-column>
                <el-table-column prop="name" align="right" label="月均使用天数">
                </el-table-column>
                <el-table-column prop="rate" align="left" label="每天使用时长">
                  <template slot-scope="scope">
                  	<div class="percentage-text" :style="'width:'+scope.row.rate+'%'">{{scope.row.rate}}%</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :lg="8">
            <div class="top-title"><img src="~@/assets/img/icons/16.png"/>word/excel/ppt</div>
            <div class="table-box">
              <el-table :data="dataList" fit>
                <el-table-column prop="name" align="left" label="软件（在用设备数）" width="150">
                </el-table-column>
                <el-table-column prop="name" align="right" label="月均使用天数">
                </el-table-column>
                <el-table-column prop="rate" align="left" label="每天使用时长">
                  <template slot-scope="scope">
                  	<div class="percentage-text" :style="'width:'+scope.row.rate+'%'">{{scope.row.rate}}%</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :lg="8">
            <div class="top-title"><img src="~@/assets/img/icons/17.png"/>word/excel/ppt</div>
            <div class="table-box">
              <el-table :data="dataList" fit>
                <el-table-column prop="name" align="left" label="软件（在用设备数）" width="150">
                </el-table-column>
                <el-table-column prop="name" align="right" label="月均使用天数">
                </el-table-column>
                <el-table-column prop="rate" align="left" label="每天使用时长">
                  <template slot-scope="scope">
                  	<div class="percentage-text" :style="'width:'+scope.row.rate+'%'">{{scope.row.rate}}%</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :lg="8">
            <div class="top-title"><img src="~@/assets/img/icons/18.png"/>word/excel/ppt</div>
            <div class="table-box">
              <el-table :data="dataList" fit>
                <el-table-column prop="name" align="left" label="软件（在用设备数）" width="150">
                </el-table-column>
                <el-table-column prop="name" align="right" label="月均使用天数">
                </el-table-column>
                <el-table-column prop="rate" align="left" label="每天使用时长">
                  <template slot-scope="scope">
                  	<div class="percentage-text" :style="'width:'+scope.row.rate+'%'">{{scope.row.rate}}%</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :lg="8">
            <div class="top-title"><img src="~@/assets/img/icons/19.png"/>word/excel/ppt</div>
            <div class="table-box">
              <el-table :data="dataList" fit>
                <el-table-column prop="name" align="left" label="软件（在用设备数）" width="150">
                </el-table-column>
                <el-table-column prop="name" align="right" label="月均使用天数">
                </el-table-column>
                <el-table-column prop="rate" align="left" label="每天使用时长">
                  <template slot-scope="scope">
                  	<div class="percentage-text" :style="'width:'+scope.row.rate+'%'">{{scope.row.rate}}%</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-card>
      </el-col>

    </el-row>
  </div>

</template>
<style>
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
    background-color: #f0f6f7;
    height: 48px;
    line-height: 48px;
    text-align: center;
  }
  .top-title img{
    margin-right: 20px;
  }
  .percentage-text{
    height: 34px;
    line-height: 34px;
    background-color: #9cdfd8;
    border-radius: 8px;
    padding-left: 5px;
  }
</style>
<script>
  import Grade from '../common/grade'
  import Class from '../common/class'
  import ChartRadar from '@/components/charts/radar'
  import ChartLine from '@/components/charts/line'
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
        addLoading: false,
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
        enLineChartLoading:false

      }
    },
    components: {
      ChartRadar,
      ChartLine
    },
    mounted() {
      let that = this
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
      getCommonDictByType(this, 'equip_use_years', 'equipUseYearsList',function(res){
        that.equipUseYearsList = res.list.reverse()
      })
      this.getDeviceTypeList()
      this.getUseTimeDeviceTypeList()
      this.getDataList();
    },
    methods: {
      useTimeTypeChange( typeName, params) {
        this.typeAndTypeList = [{
          name: typeName + params.dictName,
          value: params.value,
          deviceId: typeName
        }]
        this.getDataList()
      },
      handleClose(item) {
        this.typeAndTypeList.splice(this.typeAndTypeList.indexOf(item), 1);
        this.getDataList()
      },
      deviceTypeChange() {

      },
      arraySpanMethod({
        row,
        column,
        rowIndex,
        columnIndex
      }) {

        let rowspan = this.typeAndTypeList.length > 0 ? 1:5
        if (columnIndex === 0 || columnIndex === 1) {
          if (rowIndex % rowspan === 0) {
            return {
              rowspan: rowspan,
              colspan: 1
            };
          } else {
            return {
              rowspan: rowspan,
              colspan: 0
            };
          }
        }

      },
      getDeviceTypeList() {
        let that = this
        getCommHttpData({
          url: 'equipAnalysis/equipType',
          method: 'get',
          contentType: 1,
          data: {coomType:1}
        }, function(data) {
          if (data && data.code === 0) {
            that.dataTypeList = data.list

          }
        })
      },
      //设备类型
      getUseTimeDeviceTypeList() {
        let that = this
        getCommHttpData({
          url: 'equipAnalysis/groupByUseYear',
          method: 'get',
          contentType: 1,
          data: {
            names: this.dataType.toString()
          }
        }, function(data) {
          if (data && data.code === 0) {
            that.timeTypeList = data.list
          }
        })
      },
      format(percentage, total, color) {
        // alert(percentage)
        console.log(percentage, total, color)
        //=== 100 ? '满' : `${percentage}%`;
        return percentage.num
      },
      format1(percentage) {
        //=== 100 ? '满' : `${percentage}%`;
        return '0'
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val
        this.getDataList()
      },
      //列表
      getDataList() {
        let that = this
        //this.typeAndTypeList
        let deviceId = undefined
        let useYear = undefined
        if (this.typeAndTypeList.length > 0) {
          deviceId = this.typeAndTypeList[0].deviceId
          useYear = this.typeAndTypeList[0].value
        }
        deviceId = deviceId=='全部设备'?undefined:deviceId
        getCommHttpData({
          url: 'equipAnalysis/groupByUseYearInfo',
          method: 'get',
          contentType: 1,
          data: {
            page: this.pageIndex,
            limit: this.pageSize,
            sidx: "",
            order: '',
            name: deviceId,
            useYear: useYear
          }
        }, function(data) {
          if (data && data.code == 0) {
            if (data.page.list.length == 0 && that.pageIndex != 1) {
              that.pageIndex = 1
              that.getDataList()
            }

            that.listLoading = false
            let tempList = []
            data.page.list.forEach((item, index) => {
              item.list.forEach(citem => {
                tempList.push({
                  timeIndex: index,
                  name: item.name,
                  timeName: citem.dictName,
                  num: citem.num,
                  rate: citem.rate,
                  list: citem.list
                })
              })
            })
            console.log(tempList)
            that.dataList = tempList
            that.totalPage = data.page.totalCount
          } else {
            that.dataList = []
            that.totalPage = 0
          }
        })

      }
    }
  }
</script>
