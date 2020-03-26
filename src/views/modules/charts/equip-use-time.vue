<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="mod-demo-echarts">
    <el-row :gutter="12">
      <el-col :span="24">
        <el-card shadow="hover">
          <div class="table-title margin-bottom-20">
            设备使用年份
            <el-tooltip class="item" effect="dark" content="请您添加正确的采购时间以保证使用年份的准确性。注：未录入采购时间时，平台将自动获取入库时间。" placement="bottom-start">
              <i class="el-icon-info i-index-question"></i>
            </el-tooltip>
            <div class="right">
              <el-select v-model="dataType" size="mini" v-if="dataTypeList.length>1" placeholder="请选择设备类型" multiple :multiple-limit="3" style="width: 300px;"
                @change="getUseTimeDeviceTypeList">
                <el-option v-for="item in dataTypeList" :label="item.name" :key="item.name" :value="item.name">
                </el-option>
              </el-select>
              <span class="title-tips1">单位：台</span>
            </div>
          </div>
          <el-col :span="4">
            <template v-for="(item,index) in equipUseYearsList">
              <div style="height: 26px;line-height: 26px;margin: 0px 0px 10px 0px;">
                <span :style="'display: inline-block;width: 10px;height: 10px;border-radius: 10px;background-color: '+colorArr[index]+';'"></span>
                {{item.dictName}}
              </div>
            </template>
          </el-col>
          <div>

            <template v-for="(item,index) in timeTypeList" v-if="(timeTypeList.length >2 && index<4) || (timeTypeList.length == 2 && index==1)">
              <el-col :span="4" :offset="1" style="cursor: pointer;">
                <template v-for="(citem,index) in item.list" >
                  <div @click="useTimeTypeChange(item.name,citem)" class="margin-bottom-10" :style="'height:26px;line-height:26px;text-align:right;padding:0px 10px 0px 2px;color:#ffffff;background-color:'+(citem.num==0?'#cccccc':colorArr[index])+';width:'+citem.rate+'% ;'">{{citem.num}}</div>
                  <!-- el-progress class="margin-bottom-10" v-if="citem.num>0" :total="123" :text-inside="true" :stroke-width="26" :percentage="citem" :format="format" :color="colorArr[index]"></el-progress>
                  <el-progress class="margin-bottom-10" v-else :text-inside="true" :stroke-width="26" :percentage="10" :format="format1" color="#cccccc"></el-progress> -->
                  <!-- {{citem.num}} -->
                </template>
                {{item.name}}
              </el-col>
            </template>

          </div>
          <el-col :span="24">
            <div class="right margin-bottom-10 title-tips">注：可点击图中区域查看详情</div>
          </el-col>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card shadow="hover">
          <div class="table-title margin-bottom-20">
            设备使用年份详情
            <el-tag v-for="item in typeAndTypeList" closable :disable-transitions="false" @close="handleClose(item)">
              {{item.name}}
            </el-tag>
            <!-- <div class="right">
              <el-button type="primary" size="mini">导出</el-button>
            </div> -->
          </div>
          <el-table :data="dataList" v-loading="listLoading" border fit :span-method="arraySpanMethod">
            <el-table-column align="center" label='序号' width="95">
              <template slot-scope="scope">
                {{scope.row.timeIndex+1+pageSize*(pageIndex-1)}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="设备类型">
              <template slot-scope="scope">
                {{scope.row.name}}
              </template>
            </el-table-column>

            <!-- <template v-for="item in scope.row.list"> -->
            <el-table-column align="center" label="使用年份">
              <template slot-scope="scope">
                {{scope.row.timeName}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="设备数量">
              <template slot-scope="scope">
                {{scope.row.num}}台
              </template>
            </el-table-column>
            <el-table-column align="center" label="">
              <template slot="header" slot-scope="scope">
                占比&nbsp;<el-tooltip class='item' effect='dark' content='占同一设备类型的百分比' placement='bottom-start'>
                  <i class='el-icon-info i-index-question'></i>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                {{scope.row.rate}}%
              </template>
            </el-table-column>
            <el-table-column align="center" label="设备所在位置">
              <template slot-scope="scope">
                <template v-for="item in scope.row.list">
                  <div>{{item.typeName}}:
                    <template v-for="(citem,index) in item.list">{{citem.name}}<template v-if="index<item.list.length-1">、</template></template>
                  </div>
                </template>
              </template>
            </el-table-column>
            <!-- </template> -->
          </el-table>
          <div class="pagination-container fr">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
              :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="this.totalPage" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
          </div>
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
</style>
<script>
  import Grade from '../common/grade'
  import Class from '../common/class'
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
        dataList: null,
        listLoading: true,
        pageSize: 10,
        pageIndex: 1,
        totalPage: 0,
        activeTab: '1',
        colorArr: [ '#e15846' ,'#f7a115', '#f9d346', '#a9d96c','#41cac0'],
        dataTypeList: [],
        dataType: [],
        timeTypeList: [],
        equipUseYearsList: [],
        typeAndTypeList: [],
        options: [{
          value: '选项1',
          label: '1'
        }, {
          value: '选项2',
          label: '2',
          disabled: true
        }, {
          value: '选项3',
          label: '3'
        }, {
          value: '选项4',
          label: '4'
        }, {
          value: '选项5',
          label: '5'
        }]

      }
    },

    mounted() {
      let that = this
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
          name: typeName +'-'+ params.dictName,
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
            let tempArr = []
            that.dataTypeList.forEach((item,index)=>{
              if(index <3){
                tempArr.push(item.name)
              }
            })
            that.dataType = tempArr

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
