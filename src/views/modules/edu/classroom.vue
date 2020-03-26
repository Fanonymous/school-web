<template>
 <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
	  <el-card class="blue-shadow">
		  <div class="filter-container">
		  		<!--<el-select class="filter-item" v-model="schoolType" clearable  @change="getList"> 
		            <el-option v-for="item in sTypeOptions" :key="item.value" :label="item.dictName" :value="item.value">
		            </el-option>
		          </el-select>-->
		  	    <el-button style='margin-bottom:20px' type="primary" icon="el-icon-plus" @click="handleCreate" :loading="addLoading">添加</el-button>
		  	</div>
		  <el-table :data="list" v-loading="listLoading" border fit highlight-current-row>
		      <el-table-column align="center" label='序号' width="95">
		        <template slot-scope="scope">
		          {{scope.$index+1}}
		        </template>
		      </el-table-column>
		      <el-table-column  align="center" label="教室名称">
		        <template slot-scope="scope">
		          {{scope.row.classroomName}}
		        </template>
		      </el-table-column>
		      <el-table-column align="center" label="教室编号" >
		        <template slot-scope="scope">
		          {{scope.row.classroomNo}}
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
		      <el-table-column align="center" label="备注" >
		        <template slot-scope="scope">
		          {{scope.row.remark}}
		        </template>
		      </el-table-column>
		      <el-table-column align="center" label="操作">
		      	<template slot-scope="scope">
		  	        <el-button type="text" size="small" @click="handleLook(scope.row.classroomId,scope.row.classroomName)">历史信息</el-button>
		  	        <el-button type="text" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
		  	        <!--<el-button type="text" size="small" @click="deleteData({gradeId:scope.row.gradeId,enabled:true})">删除</el-button>-->
		        </template>
		      </el-table-column>
		   </el-table>
		   <div class="pagination-container fr">
		      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
		        :page-sizes="[10,20,50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
		      </el-pagination>
		    </div>
	  </el-card>
   <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="form" label-position="right" label-width="100px">
        <el-form-item label="教室名称" prop="classroomId">
            <el-select class="filter-item" v-model="form.classroomId"> 
	            <el-option v-for="item in roomOptions" :key="item.classroomId" :label="item.classroomName" :value="item.classroomId">
	            </el-option>
	        </el-select>
        </el-form-item>
        <el-form-item label="适用年级" prop="gradeId">
            <grade ref="grade"  @refreshDataList="getGradeId"></grade>
        </el-form-item>
        <el-form-item label="班级" prop="classId">
        	<class ref="grade" :gradeId="form.gradeId"  @refreshClassList="getClassId"></class>
        </el-form-item>
        <el-form-item label="备注" prop="schoolSection">
            <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else-if ="dialogStatus=='update'" type="primary" @click="updateData" :loading="upLoading">{{$t('table.confirm')}}</el-button>
      </div>
   </el-dialog>
   <el-dialog :title="historyTitle" :visible.sync="dialogPvVisible">
      <el-table :data="historyData" border fit highlight-current-row style="width: 100%">
        <el-table-column label="序号">
        	<template slot-scope="scope">
            	{{scope.$index+1}}
            </template>
        </el-table-column>
        <el-table-column prop="gradeName" label="年级"> </el-table-column>
        <el-table-column prop="className" label="班级"> </el-table-column>
        <el-table-column prop="createDate" label="变更时间"> </el-table-column>
      </el-table>
      <!--<span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false"></el-button>
      </span>-->
    </el-dialog>
   
  </div>
  
</template>

<script>
import {getCommHttpData,getCommonDictByType,getExportFile,deleteData } from '@/utils/common'
import Grade from '../common/grade'
import Class from '../common/class'
export default {
data() {
    return {
      schoolId:this.GLOBAL.getOrgId(),
      termId:this.GLOBAL.getTermId(),
      yearTermId:this.GLOBAL.getYearTermId(),
      addLoading:false,
      upLoading:false,
      list: null,
      listLoading: true,
      currentPage:1,
      pagesize:10,
      totalCount:null,
      schoolType:'',
      form:{
      	classroomInfoId:undefined,
      	gradeId:'',
      	classId:'',
      	classroomId:'',
      	remark:'',
		schoolId: this.GLOBAL.getOrgId(),
		yearTermId: this.GLOBAL.getYearTermId()
      },
      roomOptions:null,
      gradeOptions:null,
      classOptions:null,
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加',
        look: '查看'
      },
      historyTitle:'历史信息',
      dialogPvVisible: false,
      historyData: [],
      rules: {
        classroomId: [{ required: true, message: '不能为空', trigger: 'change' }],
        gradeId: [{ required: true, message: '不能为空', trigger: 'change' }],
        classId: [{ required: true, message: '不能为空', trigger: 'change' }],
      }
    }
},
components: {
  Grade,Class
},
created() {
    this.getList();
    this.getInitData();
},
methods: {
	getInitData(){
		var that =this
        getCommHttpData({url:'cms/classroom/listByKey',method:'post',serverType:1,contentType:2,data:{classroomType: 1,schoolId: this.schoolId}},function(data){
  	    	that.roomOptions = data.list;
        })
        
	},
	getGradeId(gradeId){
    	this.form.gradeId = gradeId;
    },
    getClassId(classId){
    	this.form.classId = classId;
    },
	handleSizeChange(size) {
  	 	this.pagesize = size; 
  	 	this.getList();
      },
      handleCurrentChange(currPage) {
      	this.currentPage = currPage; 
      	this.getList();
      },
    getList() {
      this.listLoading = true
      let sttem = this.schoolType;
      sttem = sttem==''?0:sttem;
      this.$http({
	      url: this.$http.adornUrl('/cms/classroomInfo/getClassroomInfoList'),
	      method: 'post',
	      data: this.$http.adornData({
	      	"page":this.currentPage,
	        "limit":this.pagesize,
	        "sidx":"",
	        "order":"",
	        "schoolId":this.schoolId,
	        termId: this.termId,
	        yearTermId: this.yearTermId})
	    }).then(({data}) => {
	    	this.listLoading = false
		    this.list = data.page.list;
		    this.currentPage=data.page.currPage
	        this.pagesize=data.page.pageSize
	        this.totalCount=data.page.totalCount
	    })
    },
    resetTemp() {
      this.form = {
      	classroomInfoId:undefined,
      	gradeId:'',
      	classId:'',
      	classroomId:'',
      	remark:'',
		schoolId: this.GLOBAL.getOrgId(),
		yearTermId: this.GLOBAL.getYearTermId()
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleLook(id,name) {
      this.historyTitle=`历史信息（${name}）`
      var that =this
      this.dialogPvVisible = true
      getCommHttpData({url:'cms/classroomInfo/getChangeInfo',method:'post',serverType:1,contentType:2,data:{classroomId: id}},function(data){
    	that.historyData = data.list;
      })
      
    },
    handleUpdate(row) {
      let tempRow = Object.assign({}, row) // copy obj
      this.form = {
      	classroomInfoId:tempRow.classroomInfoId,
      	gradeId:tempRow.gradeId,
      	classId:tempRow.classId,
      	classroomId:tempRow.classroomId,
      	remark:tempRow.remark,
		schoolId: this.GLOBAL.getOrgId(),
		yearTermId: this.GLOBAL.getYearTermId()
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData()  {
    	
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
        	
			var that =this
			that.addLoading = true
            getCommHttpData({url:'cms/classroomInfo/saveOrUpdate',method:'post',serverType:1,contentType:2,operateType:2,that:this,data:this.form},function(data){
      	    	that.dialogFormVisible = false
      	    	that.getList();
	        })
        }
      })
    },
    updateData()  {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
        	var that =this
        	that.upLoading = true
            getCommHttpData({url:'cms/classroomInfo/saveOrUpdate',method:'post',serverType:1,contentType:2,operateType:2,that:this,data:this.form},function(data){
      	    	that.upLoading = false
      	    	that.dialogFormVisible = false
      	    	that.getList();
	        })
        }
      })
    },
    deleteData(delJson) {
    	var that =this
        deleteData(this,{url:'cms/classroom/saveOrUpdate',method:'post',serverType:1,contentType:2,operateType:1,data:delJson},function(data){
      	   that.getList()
	    })
     }
	}
}
</script>



