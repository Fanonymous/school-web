<template>
  <div class="mod-demo-echarts comlex-table">
    <el-col :span="24" class="margin-bottom-10">
      <el-card shadow="hover">
        {{yearTermList.length > 0 ? yearTermList[0].yearName : ''}}
        <el-select v-if="yearTermList.length > 0" class="filter-item" v-model="currMonth" @change="getDataList" placeholder="请选择月份" style="margin-right:5px;margin-bottom:10px;">
        	<el-option v-for="(item,index) in yearTermList[0].monthList" :key="item" :label="item" :value="item">
        	</el-option>
        </el-select>
       <el-button type="primary" @click="handleExport(1)" :loading="btnLoading">导出</el-button>
        <el-table v-loading="dataListLoading" element-loading-text="拼命加载中" border ref="singleTable" :data="dataList"
          :height="dataList.length==0?160:dataList.length> 10?600:dataList.length*30+240" highlight-current-row>
          <el-table-column type="index" label="序号" fixed align="center" width="80">
            <template slot-scope="scope">
              {{scope.$index+1+pageSize*(pageIndex-1)}}
            </template>
          </el-table-column>
          <el-table-column property="schoolName" label="学校" fixed align="center" width="200">
          </el-table-column>
          <el-table-column property="isused" label="是否使用" align="center">
          </el-table-column>
          <el-table-column label="多媒体设备使用情况" align="center">
            <el-table-column property="useRate" label="设备使用率" align="center" width="120">
            </el-table-column>
            <el-table-column property="usetime" label="设备使用时长" align="center" width="120">
            </el-table-column>
            <el-table-column property="interactivity" label="交互度" align="center">
            </el-table-column>
            <el-table-column property="diversity" label="多样性" align="center">
            </el-table-column>
          </el-table-column>
          <el-table-column label="资源应用情况" align="center">
            <el-table-column property="resourceAddNum" label="新增量" align="center">
            </el-table-column>
            <el-table-column property="resourceTeachingNum" label="教案" align="center">
            </el-table-column>
            <el-table-column property="resourceCoursewareNum" label="课件" align="center">
            </el-table-column>
            <el-table-column property="resourceOtherNum" label="多媒体教学" align="center">
            </el-table-column>
            <el-table-column property="resourceDownloadNum" label="下载量" align="center">
            </el-table-column>
            <el-table-column property="resourceNum" label="资源总量" align="center" width="120">
            </el-table-column>
          </el-table-column>
          
          <!--        <el-table-column label="品德评价" align="center">
          <el-table-column property="moralEvaluateNum" label="评价次数" align="center">
          </el-table-column>
        </el-table-column> -->
          <el-table-column label="成绩上传" align="center">
            <el-table-column property="examNum" label="录入考试次数" align="center" width="150">
            </el-table-column>
            <el-table-column property="examStuNum" label="录入成绩人数" align="center" width="150">
            </el-table-column>
          </el-table-column>
          <el-table-column label="登录情况" align="center">
            <el-table-column property="loginNum" label="是否登录" align="center">
            </el-table-column>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </el-card>
    </el-col>
    <el-col :span="24" class="margin-bottom-10">
      <el-card shadow="hover">
        <el-select class="filter-item" v-model="yearTermIndex" @change="getDataBasicList"  placeholder="请选择学年学期" style="margin-right:5px;margin-bottom:10px;">
        	<el-option v-for="(item,index) in yearTermList" :key="index" :label="item.yearName" :value="index">
        	</el-option>
        </el-select>
        <el-button type="primary" @click="handleExport(2)" :loading="btnLoading">导出</el-button>

        <el-table v-loading="dataBasicListLoading" element-loading-text="拼命加载中" border ref="singleTable" :data="dataBasicList"
          :height="dataBasicList.length==0?160:dataBasicList.length> 10?600:dataBasicList.length*30+240" highlight-current-row>
          <el-table-column type="index" label="序号" fixed align="center" width="80">
            <template slot-scope="scope">
              {{scope.$index+1+pageSizeBasic*(pageIndexBasic-1)}}
            </template>
          </el-table-column>
          <el-table-column property="schoolName" label="学校" fixed align="center" width="200">
          </el-table-column>

          <el-table-column property="isSpecialTrain" label="基础数据录入情况" align="center">
            <el-table-column property="equipNum" label="设备接入数" align="center" width="120">
            </el-table-column>
            <el-table-column property="courseNum" label="课表录入" align="center">
            </el-table-column>
            <el-table-column property="teacherNum" label="教师数量" align="center">
            </el-table-column>
            <el-table-column property="studentNum" label="学生数量" align="center">
            </el-table-column>
            <el-table-column property="classroomNum" label="教室数量" align="center">
            </el-table-column>
            <el-table-column property="classNum" label="班级数量" align="center">
            </el-table-column>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-pagination @size-change="sizeChangeHandleBasic" @current-change="currentChangeHandleBasic" :current-page="pageIndexBasic"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSizeBasic" :total="totalPageBasic" layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>

  import {
    getCommHttpData,
    dateDiff,getExportFileDiama
  } from '@/utils/common'
  export default {
    components: {

    },
    data() {
      return {
        orgId: this.GLOBAL.getOrgId(),
        orgName : this.GLOBAL.getOrgName(),
        userType: this.GLOBAL.getUserType(),
        yearTermId: '',
        termStart: '',
        termEnd: '',
        startDate: '',
        endDate: '',
        dataListLoading: true,
        dataList: [],
        dataBasicListLoading: true,
        dataBasicList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        pageIndexBasic: 1,
        pageSizeBasic: 10,
        totalPageBasic: 0,
        keywords: '',
        btnLoading: false,
        yearTermList:[],
        currMonth:'',
        yearTermIndex:''
      }
    },
    mounted() {
      this.getYearTermList()
    },
    methods: {
      handleExport(type) {

        //下载文件
        getExportFileDiama(this, 'complexEdu/exportUnitFile', {
          deptId: this.orgId,
          deptName:this.orgName,
          yearTermId: this.yearTermList[this.yearTermIndex].yearTermId,
          yearMonthDate: this.currMonth,
          yearTermName: this.yearTermList[this.yearTermIndex].yearName,
          type: type,
          startDate: this.yearTermList[this.yearTermIndex].startDate,
          endDate: this.yearTermList[this.yearTermIndex].endDate
        })
      },
      // 获取数据列表
      getYearTermList() {
        var that = this
        getCommHttpData({
          url: 'complexEdu/queryYearTermByTime',
          method: 'get',
          contentType: 1,
          serverType: 1,
          data: {
            deptId: this.orgId
          }
        }, function(data) {
          that.yearTermId = data.list[0].yearTermId
          data.list[0].monthList = data.list[0].monthList.reverse()
          that.yearTermList = data.list
          that.currMonth = data.list[0].monthList[0]
          that.getDataList()
          that.yearTermIndex = 0
          that.getDataBasicList()
        })
      },
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        var that = this
        getCommHttpData({
          url: 'complexEdu/queryUnitStatisticalTableCurrent',
          method: 'post',
          contentType: 2,
          serverType: 1,
          data: {
            page: this.pageIndex,
            limit: this.pageSize,
            deptId: this.orgId,
            yearTermId: this.yearTermId,
            yearMonthDate: this.currMonth
          }
        }, function(data) {
          that.dataListLoading = false
          if (data && data.code === 0) {
            if (data.page.list.length == 0 && that.pageIndex != 1) {
              that.pageIndex = 1
              that.getDataList()
            }
            that.dataList = data.page.list
            that.totalPage = data.page.totalCount
          } else {
            that.dataList = []
            that.totalPage = 0
          }
        })
      },
      // 获取数据列表
      getDataBasicList() {
        this.dataBasicListLoading = true
        var that = this
        let yearTermId = this.yearTermList[this.yearTermIndex].yearTermId
        let startDate = this.yearTermList[this.yearTermIndex].startDate
        let endDate = this.yearTermList[this.yearTermIndex].endDate
        getCommHttpData({
          url: 'complexEdu/queryUnitStatisticalTableBase',
          method: 'post',
          contentType: 2,
          serverType: 1,
          data: {
            page: this.pageIndexBasic,
            limit: this.pageSizeBasic,
            startDate: startDate,
            endDate: endDate,
            deptId: this.orgId,
            yearTermId: yearTermId
          }
        }, function(data) {
          that.dataBasicListLoading = false
          if (data && data.code === 0) {
            if (data.page.list.length == 0 && that.pageIndex != 1) {
              that.pageIndexBasic = 1
              that.getDataBasicList()
            }
            that.dataBasicList = data.page.list
            that.totalPageBasic = data.page.totalCount
          } else {
            that.dataListBasic = []
            that.totalPageBasic = 0
          }
        })
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
      // 每页数
      sizeChangeHandleBasic(val) {
        this.pageSizeBasic = val
        this.pageIndexBasic = 1
        this.getDataBasicList()
      },
      // 当前页
      currentChangeHandleBasic(val) {
        this.pageIndexBasic = val
        this.getDataBasicList()
      },
    }
  }
</script>
