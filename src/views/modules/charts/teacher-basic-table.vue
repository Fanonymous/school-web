<template>
  <div class="mod-demo-echarts">
    <basic-analysis :schoolTypeShow="true" :schoolShow="true" :schoolSideTypeShow="false"
      :gradeShow="false" :subjectShow="false" @refreshChartsData="getFilterBasicData"></basic-analysis>
    <el-button class="right" type="primary" @click="exportList" :loading="exportLoading">导出</el-button>
    <el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row>
      <el-table-column align="center" label='序号' width="100">
        <template slot-scope="scope">
           {{scope.$index+1+pageSize*(pageIndex-1)}}
        </template>
      </el-table-column>
      <template v-for="item in headerList">
        <el-table-column align="center" :label="item.name">
          <template slot-scope="scope">
            {{dataList[scope.$index][item.valueName]}}
          </template>
            <template v-if="item.child.length > 0" v-for="citem in item.child">
              <el-table-column align="center" :label="citem.name">
                <template slot-scope="scope">
                  {{dataList[scope.$index][citem.valueName]}}
                </template>
              </el-table-column>
            </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="pagination-container fr">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex"
        :page-sizes="[10,20,50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import BasicAnalysis from '../common/basic-analysis'

  import {
    getCommHttpData,
    getAnalysisChartData,getExportFile
  } from '@/utils/common'
  export default {
    components: {
      BasicAnalysis,
    },
    data() {
      return {
        // schoolId: this.GLOBAL.getOrgId(),
        schoolId:'',
        userType: this.GLOBAL.getUserType(),
        schoolTypeShow:true,
        gradeShow: false,
        subjectShow: false,
        classroomShow: false,
        gradeIds: [],
        subjectIds: [],
        classroomIds: [],
        schoolSideType: '',
        schoolType: '',
        dataList: null,
        listLoading: true,
        headerList:null,
        exportLoading:false,
        pageIndex: 1,
        pageSize: 10,
        totalCount: null,
        keyworks:''
      }
    },
    mounted() {
      this.iniTableData()

    },
    //  activated () {
    //			this.resizeListener()
    //  },
    methods: {
      getFilterBasicData(jsonParams) {
        this.schoolSection = jsonParams.schoolSection
        this.schoolId = jsonParams.schoolIds
        this.keywords = jsonParams.keywords
        this.iniTableData()
      },

      iniTableData() {
        let that = this
        that.listLoading = true
        //查询tablelist
        that.schoolSection = that.schoolSection==''?null:that.schoolSection
        that.schoolId = that.schoolId==''?null:that.schoolId
        that.keywords = that.keywords==''?null:that.keywords
        getCommHttpData({
          url: 'edu/teacher/statistical/report',
          method: 'post',
          contentType: 2,
          data: {
            page: this.pageIndex,
            limit: this.pageSize,
            schoolSection:that.schoolSection,
            schoolId: that.schoolId,
            keywords: that.keywords
          }
        }, function(data) {
          that.headerList = data.tableList
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
      handleSizeChange(size) {
        this.pageSize = size;
        this.iniTableData();
      },
      handleCurrentChange(currPage) {
        this.pageIndex = currPage;
        this.iniTableData();
      },
      //导出Excel
      exportList(){
        let that = this
        //that.exportLoading = true
        let dataParams = {deptId:this.GLOBAL.getOrgId()}
        if(that.schoolSection && that.schoolSection!='' ){
           dataParams['schoolSection'] = that.schoolSection
        }
        if(that.schoolId && that.schoolId!=''){
          dataParams['schoolId'] = that.schoolId
        }
        if(that.keywords && that.keywords!=''){
          dataParams['keywords'] = that.keywords
        }
        getExportFile(this, 'edu/teacher/statistical/exportReport', dataParams)
      }
    }
  }
</script>
