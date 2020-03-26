<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
	  <el-card class="blue-shadow">
		  <el-form :inline="true">
		    <el-form-item>
		      <school_screen @schoolId="getschoolId"></school_screen>
		    </el-form-item>
		  </el-form>
		  <el-table :data="list" v-loading="listLoading" border fit highlight-current-row>
		    <el-table-column align="center" label='序号' width="95">
		      <template slot-scope="scope">
		        {{scope.$index+1+pagesize*(currentPage-1)}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="学校名称" >
		     <template slot-scope="scope">
		        {{scope.row.schoolName}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="学年名称">
		      <template slot-scope="scope">
		        {{scope.row.schoolYearName}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="学期名称" >
		      <template slot-scope="scope">
		        {{scope.row.termName}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="年级" >
		      <template slot-scope="scope">
		        {{scope.row.gradeName}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="班级" >
		      <template slot-scope="scope">
		        {{scope.row.className}}
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
        let qtem = {limit:this.pagesize,order:"",page:this.currentPage,sidx:"",};
        if(this.schoolId !=0){
          qtem['schoolId']=this.schoolId;
        }
        var that = this
        getCommHttpData({url:'basedatacenter/classinfo/queryByCondition',method:'post',contentType:2,data:qtem},function(data){
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
