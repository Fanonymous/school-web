<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
	  <el-card class="blue-shadow">
		  <el-form :inline="true">
		    <el-form-item>
		      <school_screen @schoolId="getschoolId"></school_screen>
		    </el-form-item>
		    <el-form-item>
		    	<el-select v-model="gradeId" @change="changeGrade" clearable placeholder="请选择年级" style="margin-right: 5px;">
		  				<el-option v-for="item in gradeList " :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
		  				</el-option>
		  			</el-select>
		    </el-form-item>
		    <el-form-item>
		    	<el-select v-model="classId" @change="fetchData" clearable placeholder="请选择班级" style="margin-right: 5px;">
		  				<el-option v-for="item in classList " :key="item.classId" :label="item.className" :value="item.classId">
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
		    <el-table-column align="center" prop="schoolName" label="学校名称" >
		    </el-table-column>
		    <el-table-column align="center" prop="gradeName" label="年级">
		    </el-table-column>
		    <el-table-column align="center" label="班级" prop="className">
		    </el-table-column>
		    <el-table-column align="center" label="星期名" prop="weekDayName" >
		    </el-table-column>
		    <el-table-column align="center" label="节次" prop="lessionCodeName">
		    </el-table-column>
		    <el-table-column align="center" label="科目名称" prop="subjectName">
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
    components:{//注册组件
      school_screen
    },
    mounted() {
      this.fetchData();
    },
    methods: {
    	getschoolId(msg){
        this.schoolId = msg;
        if(this.schoolId){
        	this.getGradeData()
        }else{
        	this.gradeList = []
        	this.classList = []
        	this.gradeId=''
        	this.classId=''
        }
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
      //查询年级
			getGradeData() {
				var that = this
				getCommHttpData({
					url: 'basedatacenter/depart/getGrade',
					method: 'post',
					contentType: 2,
					data: {
						schoolId: this.schoolId
					}
				}, function(data) {
					if(data.code == 0) {
						if(data.gradeClassList.length > 0){
							that.gradeList = data.gradeClassList
						}else{
							that.gradeList = []
							that.classList = []
		        	that.gradeId=''
		        	that.classId=''
						}
						
					} else {
						that.gradeList = []
						that.classList = []
	        	that.gradeId=''
	        	that.classId=''
					}
				})
			},
			changeGrade(){
				if(this.gradeId){
					this.getClassData();
				}else{
					this.classList = []
					this.classId=''
				}
				this.fetchData()
			},
			//查询班级
			getClassData() {
				var that = this
				getCommHttpData({
					url: 'common/queryClassListAuthority',
					method: 'get',
					contentType: 1,
					data: {
						schoolId: this.schoolId,
						gradeId: this.gradeId
					}
				}, function(data) {
					if(data.code == 0) {
						if(data.list && data.list.length > 0){
								that.classList = data.list
						}else{
								that.classList = []
								that.classId =  ''
						}
					} 
				})
			},
      fetchData() {
        this.listLoading = true
        var that = this
        getCommHttpData({
        	url:'basedatacenter/coursetable/queryByCondition',
        	method:'post',
        	contentType:2,
        	data:{
        		deptId:this.schoolId,
        		gradeId:this.gradeId,
        		classId:this.classId,
        		limit:this.pagesize,
        		page:this.currentPage
        	}},function(data){
	          if(data.code == 0){
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
