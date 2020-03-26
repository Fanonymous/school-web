<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
	  <el-card class="blue-shadow">
		  <el-form :inline="true">
		      <el-form-item>
		          <el-select class="filter-item" placeholder="请选择机构类型" v-model="departType" clearable  @change="fetchData"> 
		              <el-option v-for="item in sTypeOptions" :key="item.dictName" :label="item.dictName" :value="item.dictName">
		              </el-option>
		          </el-select>
		      </el-form-item>
		  </el-form>
		  <el-table :data="list" v-loading="listLoading" border fit highlight-current-row>
		    <el-table-column align="center" label='序号' width="95">
		      <template slot-scope="scope">
		        {{scope.$index+1+pagesize*(currentPage-1)}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="组织机构代码">
		     <template slot-scope="scope">
		        {{scope.row.departId}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="组织机构名称">
		      <template slot-scope="scope">
		        {{scope.row.departName}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="机构类型">
		      <template slot-scope="scope">
		        {{scope.row.departType}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="负责人">
		      <template slot-scope="scope">
		        {{scope.row.manager}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="联系电话">
		      <template slot-scope="scope">
		        {{scope.row.telephone}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="创建人">
		      <template slot-scope="scope">
		        {{scope.row.createNameBy}}
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="创建时间">
		      <template slot-scope="scope">
		        <div v-if="scope.row.createDate == null"></div>
		        <div v-else>{{scope.row.createDate.slice(0,10)}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="更新时间">
		      <template slot-scope="scope">
		        <div v-if="scope.row.updateDate == null"></div>
		        <div v-else>{{scope.row.updateDate.slice(0,10)}}</div>
		      </template>
		    </el-table-column>
		    <el-table-column align="center" label="更新人">
		      <template slot-scope="scope">
		        {{scope.row.updateNameBy}}
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
        departType:undefined
      }
    },
    components:{//注册组件
      
    },
    mounted() {
      this.fetchData();
      this.getIndexByDict();
    },
    methods: {
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
        let qtem = {limit:this.pagesize,order:"",page:this.currentPage,sidx:"",departType:this.departType};
        if(this.schoolId !=0){
          qtem['schoolId']=this.schoolId;
        }
        var that = this
        getCommHttpData({url:'basedatacenter/depart/queryByCondition',method:'post',contentType:2,data:qtem},function(data){
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
		    getCommonDictByType(this,'unit_type','sTypeOptions')
	    }
    }
  }
</script>
