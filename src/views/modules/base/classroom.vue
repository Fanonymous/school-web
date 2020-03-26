<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
	  <el-card class="blue-shadow">
		  <el-form :inline="true">
		    <el-form-item>
		      <school_screen @schoolId="getschoolId"></school_screen>
		    </el-form-item>
		    <el-select class="filter-item" v-model="classroomType" clearable  @change="fetchData" placeholder="请选择教室类型"> 
		          <el-option v-for="item in sTypeOptions" :key="item.dictName" :label="item.dictName" :value="item.dictName">
		          </el-option>
		      </el-select>
		  </el-form>
		  <el-table :data="list" v-loading="listLoading" border fit highlight-current-row>
		    <el-table-column align="center" label='序号' width="95">
		      <template slot-scope="scope">
		        {{scope.$index+1+pagesize*(currentPage-1)}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="教室名称" >
		     <template slot-scope="scope">
		        {{scope.row.classroomName}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="教室类型">
		      <template slot-scope="scope">
		        {{scope.row.classroomType}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="教室编号">
		      <template slot-scope="scope">
		        {{scope.row.classroomNo}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="位置">
		      <template slot-scope="scope">
		        {{scope.row.position}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="负责人">
		      <template slot-scope="scope">
		        {{scope.row.teacherName}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="总容量">
		      <template slot-scope="scope">
		        {{scope.row.capacity}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="有效座位数">
		      <template slot-scope="scope">
		        {{scope.row.setCount}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="备注">
		      <template slot-scope="scope">
		        {{scope.row.remark}}
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
  import {getCommHttpData,getCommonDictByType} from '@/utils/common'
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
        sTypeOptions:null,
        classroomType:undefined
      }
    },
    components:{//注册组件
      school_screen
    },
    mounted() {
      this.fetchData();
      this.getIndexByDict();
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
        let qtem = {limit:this.pagesize,order:"",page:this.currentPage,sidx:"",classroomType:this.classroomType};
        if(this.schoolId !=0){
          qtem['schoolId']=this.schoolId;
        }
        var that = this
        getCommHttpData({url:'basedatacenter/classroom/queryByCondition',method:'post',contentType:2,data:qtem},function(data){
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
      },
        getIndexByDict(){
		    getCommonDictByType(this,'classroom_Type','sTypeOptions')
	    }
    }
  }
</script>
