<template>
  <div class="mod-demo-echarts comlex-table">
    {{yearTermList.length > 0 ? yearTermList[0].yearName : ''}}
    <el-select v-if="yearTermList.length > 0" class="filter-item" v-model="currMonth" @change="getDataList(),getDataSchool()"  placeholder="请选择月份" style="margin-right:5px;margin-bottom:10px;">
    	<el-option v-for="(item,index) in yearTermList[0].monthList" :key="item" :label="item" :value="item">
    	</el-option>
    </el-select>
    <org-list-search v-if="userType == 4" @refreshDataList="getOrgId"></org-list-search>
    <el-button type="primary" @click="handleExport" :loading="btnLoading">导出</el-button>
    <el-col :span="24" class="margin-bottom-10">
      <el-card shadow="hover">
        <div class="table-title">1、学校总体情况</div>
        <el-table v-loading="dataListLoading" element-loading-text="拼命加载中" border ref="singleTable" :data="dataSchoolList"
          highlight-current-row>
          <el-table-column type="index" fixed label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column property="schoolName" fixed label="学校" align="center" width="200">
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
            <el-table-column property="resourceDownloadNum" label="下载" align="center">
            </el-table-column>
            <el-table-column property="resourceNum" label="资源总量" align="center" width="120">
            </el-table-column>
          </el-table-column>
          <!-- <el-table-column label="品德评价" align="center">
            <el-table-column property="moralEvaluateNum" label="评价次数" align="center">
            </el-table-column>
          </el-table-column> -->
          <el-table-column label="登录情况" align="center">
            <el-table-column property="loginNum" label="是否登录" align="center">
            </el-table-column>
          </el-table-column>
          <el-table-column label="成绩上传" align="center">
            <el-table-column property="examNum" label="录入考试次数" align="center" width="150">
            </el-table-column>
            <el-table-column property="examStuNum" label="录入成绩人数" align="center" width="150">
            </el-table-column>
          </el-table-column>
          <el-table-column label="基础数据录入情况" align="center">
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
      </el-card>
    </el-col>
    <br>
    <el-col :span="24" class="margin-bottom-10">
      <el-card shadow="hover">
        <div class="table-title">2、 各老师使用情况</div>
        <el-table v-loading="dataTeacherListLoading" element-loading-text="拼命加载中" border ref="singleTable" :height="dataList.length==0?160:dataList.length*30+240" :data="dataList"
          highlight-current-row>
          <el-table-column type="index" label="序号" fixed align="center" width="80">
            <template slot-scope="scope">
              {{scope.$index+1+pageSize*(pageIndex-1)}}
            </template>
          </el-table-column>
          <el-table-column property="teacherName" fixed label="老师" align="center" width="200">
          </el-table-column>
          <!-- <el-table-column :label="startDate+' - '+endDate" align="center" width="200"> -->
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
          </el-table-column>
          <el-table-column label="登录情况" align="center">
            <el-table-column property="loginNum" label="是否登录" align="center">
            </el-table-column>
          </el-table-column>
          <!-- <el-table-column label="品德评价" align="center">
          <el-table-column property="moralEvaluateNum" label="评价次数" align="center">
          </el-table-column>
        </el-table-column> -->
          <!-- </el-table-column> -->
        </el-table>
        <div style="margin-top: 20px">
          <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
  import YearTermAnalysis from '../common/year-term-analysis'
  import OrgListSearch from '../common/org-list-search'
  import {
    getCommHttpData,getExportFileDiama
  } from '@/utils/common'
  export default {
    components: {
      OrgListSearch,
      YearTermAnalysis
    },
    data() {
      return {
        schoolId: this.GLOBAL.getOrgId(),
        schoolName: this.GLOBAL.getOrgName(),
        userType: this.GLOBAL.getUserType(),
        startDate: '',
        endDate: '',
        dataListLoading: true,
        dataTeacherListLoading:true,
        dataSchoolList: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        keywords: '',
        btnLoading: false,
        yearTermList:[],
        currMonth:''
      }
    },
    mounted() {
      if(this.userType == 2){
        this.getYearTermList()
      }
    },
    methods: {
      //查询机构
      getOrgId(schoolId,schoolName) {
        this.schoolId = schoolId
        this.schoolName = schoolName
        if(this.yearTermId != undefined){
          this.getDataList()
          this.getDataSchool()
        }else{
          this.getYearTermList()
        }
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
            deptId: this.schoolId
          }
        }, function(data) {
          that.yearTermId = data.list[0].yearTermId
          data.list[0].monthList = data.list[0].monthList.reverse()
          that.yearTermList = data.list
          that.currMonth = data.list[0].monthList[0]
          that.getDataList()
          that.getDataSchool()
        })
      },
      handleExport() {
        //下载文件
        getExportFileDiama(this, 'complexEdu/exportSchoolTeacherFile', {
          deptId: this.schoolId,
          deptName:this.schoolName,
          yearTermId: this.yearTermId,
          yearMonthDate: this.currMonth
        })
      },
      // 获取数据列表
      getDataList() {
        this.dataTeacherListLoading = true
        this.keywords = this.keywords == '' ? undefined : this.keywords;
        var that = this
        getCommHttpData({
          url: 'complexEdu/queryTeacherStatisticalTable',
          method: 'post',
          contentType: 2,
          serverType: 1,
          data: {
            page: this.pageIndex,
            limit: this.pageSize,
            deptId: this.schoolId,
            yearTermId: this.yearTermId,
            yearMonthDate: this.currMonth
          }
        }, function(data) {
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
          that.dataTeacherListLoading = false
        })
      },
      getDataSchool() {
        var that = this
        this.dataListLoading = true
        getCommHttpData({
          url: 'complexEdu/querySchoolStatisticalTable',
          method: 'post',
          contentType: 2,
          serverType: 1,
          data: {
            page: this.pageIndex,
            limit: this.pageSize,
            deptId: this.schoolId,
            yearTermId: this.yearTermId,
            yearMonthDate: this.currMonth
          }
        }, function(data) {
          that.dataSchoolList = [data.data]
          that.dataListLoading = false
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

    }
  }
</script>
<style scoped="scoped">
  .table-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
</style>
