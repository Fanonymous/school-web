<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
	  <el-card class="blue-shadow">
		  <div class="margin-bottom-20">
		  	<school_screen @schoolId="getschoolId"></school_screen>
		  </div>
		  <el-table :data="list" v-loading="listLoading" border fit highlight-current-row>
		    <el-table-column align="center" label='序号' width="95">
		      <template slot-scope="scope">
		        {{scope.$index+1+pagesize*(currentPage-1)}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" prop="schoolName" label="学校名称" >
		    </el-table-column>
		    <el-table-column align="center" prop="scheduleName" label="作息名称">
		    </el-table-column>
		    <el-table-column align="center" label="节次名称" prop="lessionCodeName">
		    </el-table-column>
		    <el-table-column align="center" label="开始时间" prop="startTime" >
		    </el-table-column>
		    <el-table-column align="center" label="结束时间" prop="endTime">
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
				gradeId:'',
				classId:'',
        schoolId:'',
        schoolList:[],
        gradeList:[],
        classList:[],
        pagesize:10,
        currentPage:1,
        totalCount:''
      }
    },
    mounted() {
      this.fetchData();
    },
    components:{//注册组件
      school_screen
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
        var that = this
        getCommHttpData({
        	url:'basedatacenter/timetable/queryByCondition',
        	method:'post',
        	contentType:2,
        	data:{
        		deptId:this.schoolId,
        		limit:this.pagesize,
        		page:this.currentPage
        	}},function(data){
	          if(data.code == 0){
//		            if(data.page.list.length==0 && that.page.currentPage !=1){
//									that.currentPage = 1
//									that.fetchData()
//								}
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
