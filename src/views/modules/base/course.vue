<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
    <el-form :inline="true">
        <el-form-item>
            <el-select class="filter-item" v-model="schoolId" clearable @change="getGradeData" placeholder="请选择学校">
              <el-option v-for="item in schoolList" :key="item.depart_id" :label="item.depart_name" :value="item.depart_id"></el-option>
            </el-select>
            <el-select placeholder="请选择年级" v-model="gradeId"  @change="getClassData">
              <el-option v-for="item in gradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId"></el-option>
            </el-select>
            <el-select placeholder="请选择班级" v-model="classId"  @change="fetchData">
              <el-option v-for="item in classList" :key="item.class_id" :label="item.class_name" :value="item.class_id"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
    <full-calendar :events="monthData" lang="zh" class="test-fc"
                     first-day='1' locale="fr"
                     @changeMonth="changeMonth"
                     @eventClick="eventClick"    
                     @dayClick="dayClick"         
                     @moreClick="moreClick" style="max-width: none;">
    </full-calendar>  
  </div>
</template>
<script>
  import {getCommHttpData,getCommonDictByType} from '@/utils/common'
  import { FullCalendar } from 'vue-fullcalendar'
  export default {
    name: 'exportExcel',
    data() {
      return {
        list: null,
        listLoading: true,
        currentPage:1,
        pagesize:10,
        totalCount:null,
        schoolId:null,
        schoolList:[],
        gradeId:null,
        gradeList:null,
        classId:null,
        classList:null,

        monthData: [{
          title : '语文',  // 事件内容
          start : '2019-04-02', // 事件开始时间
          end : '2019-04-02',   // 事件结束时间
          cssClass: 'red'       // 事件的样式   class名（由后台返回数据）  red为自己定义的class名
        },
        {
          title : 'sssss',
          start : '2018-12-25',
          end : '2018-12-30',
          cssClass: 'blue'  
        },
        {
          title : 'dddddddd',
          start : '2018-12-09',
          end : '2018-12-30',
          cssClass: 'blue'  
        },
        {
          title : 'cccccc',
          start : '2018-12-20',
          end : '2018-12-30',
          cssClass: 'red'  
        },
        {
          title : 'aaaaaa',
          start : '2018-12-01',
          end : '2018-12-30',
          cssClass: 'red'  
        },
        {
          title : 'bbbbbb',
          start : '2018-12-05',
          end : '2019-1-10',
          cssClass: 'blue'
        }]
      }
    },
    components:{//注册组件
      'full-calendar': require('vue-fullcalendar')
    },
    mounted() {
      this.getSchoolData();
    },
    methods: {
      //查询学校
      getSchoolData(){
       this.listLoading = true
        var that = this
        getCommHttpData({url:'basedatacenter/depart/getSchools',method:'post',contentType:2,data:{}},function(data){
          if(data.code == 0){
              that.schoolList = data.schools
              that.schoolId   = data.schools[0].depart_id
          }else{
              that.schoolList = []
          }
          that.listLoading = false
          that.getGradeData();
	      })
      },
      //查询年级
      getGradeData(){
        this.listLoading = true
        var that = this
        getCommHttpData({url:'basedatacenter/depart/getGrade',method:'post',contentType:2,data:{schoolId:this.schoolId}},function(data){
          if(data.code == 0){
            that.gradeList = data.gradeClassList
            that.gradeId = data.gradeClassList[0].gradeId
          }else{
            that.gradeList = []
          }
          that.listLoading = false
          that.getClassData();
	      })
      },
      //查询班级
      getClassData(){
        this.listLoading = true
        var that = this
        getCommHttpData({url:'basedatacenter/depart/getClass',method:'post',contentType:2,data:{schoolId:this.schoolId,gradeId:this.gradeId}},function(data){
          if(data.code == 0){
            that.classList = data.classList
            that.classId = data.classList[0].class_id
          }else{
            that.classList = []
          }
          that.listLoading = false
          that.fetchData();
	      })
      },
      //查询列表
      fetchData() {
        this.listLoading = true
        let qtem = {schoolId:this.schoolId,greadeId:this.gradeId,classId:this.classId,type:"week"};
        var that = this
        getCommHttpData({url:'basedatacenter/course/queryByCondition',method:'post',contentType:2,data:qtem},function(data){
          if(data.code == 0){
            // that.list = data.page.list
          }else{
            that.list = []
          }
	        that.listLoading = false
	      })
      },
      
      



       // 选择月份
      changeMonth (start, end, current) {
 
      },
      // 点击事件
      eventClick (event, jsEvent, pos) {
      },
      // 点击当天
      dayClick (day, jsEvent) {
      },
      // 查看更多
      moreClick (day, events, jsEvent) {
      },
    }
  }
</script>
<style>
.red {
      background-color: #39b2a9;
    border-color: #39b2a9;
    color: #FFFFFF;
}
.blue {
  background: blue;
}
</style>