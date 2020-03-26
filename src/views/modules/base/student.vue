<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
	  <el-card class="blue-shadow">
		  <el-form :inline="true">
		    <el-form-item>
		      <school_screen @schoolId="getschoolId"></school_screen>
		    </el-form-item>
		    <el-form-item class="item-right">
		      <el-input v-model="keywords" placeholder="请输入学生姓名查询" clearable @input="fetchData"></el-input>
		    </el-form-item>
		    <!--<el-form-item class="item-right">
		      <el-button @click="fetchData()">查询</el-button>
		    </el-form-item>-->
		  </el-form>
		  <el-table :data="list" v-loading="listLoading" border fit highlight-current-row>
		    <el-table-column align="center" label='序号' width="95">
		      <template slot-scope="scope">
		        {{scope.$index+1+pagesize*(currentPage-1)}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="姓名">
		      <template slot-scope="scope">
		        {{scope.row.stuName}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="学籍号" >
		     <template slot-scope="scope">
		        {{scope.row.stuCode}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="校内学号" >
		      <template slot-scope="scope">
		        {{scope.row.schoolCode}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="性别" >
		      <template slot-scope="scope">
		        {{scope.row.sex}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="出生日期" >
		      <template slot-scope="scope">
		        <div v-if="scope.row.birthday == null"></div>
		        <div v-else>{{scope.row.birthday.slice(0,10)}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="籍贯" >
		      <template slot-scope="scope">
		        {{scope.row.nativePlace}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="联系电话" >
		      <template slot-scope="scope">
		        {{scope.row.mobile}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="入学年份" >
		      <template slot-scope="scope">
		        {{scope.row.startYear}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="学校名称" >
		      <template slot-scope="scope">
		        {{scope.row.schoolName}}
		      </template>
		    </el-table-column>
		  </el-table>
		  <div class="pagination-container fr">
		    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
		                   :page-sizes="[10,20,50,100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
		    </el-pagination>
		  </div>
	  </el-card>
  </div>
</template>
<script>
  import {getCommHttpData} from '@/utils/common'
  import school_screen from '@/views/modules/base/school-screen'
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
        keywords: undefined
      }
    },
    components:{//注册组件
      school_screen
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      getschoolId(msg){
        this.schoolId = msg;
        this.fetchData();
      },
      handleSizeChange(size) {
        this.pagesize = size;
        this.fetchData();
      },
      handleCurrentChange(currPage) {
        this.currentPage = currPage;
        this.fetchData();
      },
      fetchData() {
        this.listLoading = true
        let qtem = {limit:this.pagesize,order:"",page:this.currentPage,sidx:"",stuName:this.keywords};
        if(this.schoolId !=0){
          qtem['schoolId']=this.schoolId;
        }
        var that = this
        getCommHttpData({url:'basedatacenter/student/queryByCondition',method:'post',contentType:2,data:qtem},function(data){
          if(data.code == 0){
          	if(data.page.list.length==0 && that.currentPage !=1){
							that.currentPage = 1
							that.fetchData()
						}
            that.list = data.page.list,
            that.currentPage = data.page.currPage,
            that.pagesize = data.page.currPageSize,
            that.totalCount = data.page.totalCount
          }else{
            that.list = []
            that.totalPage = 0
          }
	        that.listLoading = false
	      })
      }
    }
  }
</script>
