<template>
  <el-dialog
    :title="!dataForm.id ? '绑定分类' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :inline="true" @keyup.enter.native="getDataList()">
      <el-form-item class="item-right" style="float: right;">
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item class="item-right" style="float: right;">
        <el-input v-model="keywords" placeholder="请输入关键字" clearable></el-input>
      </el-form-item>
      <!--<el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">添加</el-button>
      </el-form-item>-->
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="序号">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="tagName"
        header-align="center" 
        align="center"
        label="分类名称">
      </el-table-column>
      <el-table-column
        prop="tagValue"
        header-align="center"
        align="center"
        label="分类值">
      </el-table-column>
      <el-table-column
        prop="bindNum"
        header-align="center"
        align="center"
        label="绑定数据源数">
      </el-table-column>
      <el-table-column
        prop="deptTypeName"
        header-align="center"
        align="center"
        label="用户类型">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </el-dialog>
</template>
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  
</style>
<script>
	import {getCommHttpData,deleteData} from '@/utils/common'
	import AddOrUpdate from './config-add-or-update'
  export default {
  	props: {
			labelType: {
				type: Number,
				default: 1
			},
		},
    data () {
      return {
      	keywords:undefined,
      	visible: false,
        dataForm: {
          paramKey: ''
        },
        equipList:[],
        labelList:[],
        dataList: [],
        pageIndex: 1, 
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    mounted () {
      
    },
    methods: {
    	init (equipList,labelList) {
    		this.visible = true
      	this.equipList = equipList
      	this.labelList = labelList
    		this.getDataList()
//      this.dataForm.id = id || 0
//      this.visible = true
//      this.$nextTick(() => {
//        this.$refs['dataForm'].resetFields()
//        if (this.dataForm.id) {
//          this.$http({
//            url: this.$http.adornUrlMedia(`/sys/config/info/${this.dataForm.id}`),
//            method: 'get',
//            params: this.$http.adornParams()
//          }).then(({data}) => {
//            if (data && data.code === 0) {
//              this.dataForm.paramKey = data.config.paramKey
//              this.dataForm.paramValue = data.config.paramValue
//              this.dataForm.remark = data.config.remark
//            }
//          })
//        }
//      })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        let that = this
        this.keywords = this.keywords==''?undefined:this.keywords;
        getCommHttpData({url:'device/findAllOfTag',method:'post',contentType:2,data:{
	        page: this.pageIndex,
	        limit: this.pageSize,
	        tagMsg: this.keywords
	      }},function(data){
      	  if (data && data.code === 0) {
            that.dataList = data.page.list
            that.totalPage = data.page.totalCount
            that.dataListSelections = that.labelList
          } else {
            that.dataList = []
            that.totalPage = 0
          }
	        that.dataListLoading = false
	      })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      dataFormSubmit (){
      	let tagList = this.dataListSelections
      	let tagTemp = new Array()
      	if(tagList.length==0){
        		this.$message({
	            message: '请选择分类',
	            type: 'error'
	          })
        		return;
        	}
      	for(let i in tagList){
      		tagTemp.push(tagList[i].tagId)
      	}
      	let equipList = this.equipList
      	let brandList = new Array()
      	for(let i in equipList){
      		brandList.push( {equipId:equipList[i],tagList:tagTemp})
      	}
      	let that= this
      	
      	if(this.labelType == 2){
      		let arr=[];
      		for(let i in equipList){
	      		arr.push(equipList[i].id)
	      	}
      		let assetIds,classifyIds;
      		assetIds=arr.toString();
      		classifyIds=tagTemp.toString();
      		getCommHttpData({url:'assetManage/addClassification',method:'post',contentType:1,data:{
		        assetIds: assetIds,
		        classifyIds:classifyIds
		      }},function(data){
		      	if(data.code == 0) {
								that.$message({
									type: 'success',
									message: '操作成功!'
								});
							}
		      	that.visible = false
		      	that.$emit('refreshDataList')
		      })
      	}else{
      		getCommHttpData({url:'equip/bindingTag',method:'post',contentType:2,data:{
		        list: brandList
		      }},function(data){
		      	that.visible = false
		      	that.$emit('refreshDataList')
		      })
      	}
      	
				
      }
    }
  }
</script>