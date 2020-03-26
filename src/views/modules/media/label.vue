<template>
  <div class="mod-config">
    <el-form :inline="true" @keyup.enter.native="getDataList()">
      <el-form-item class="item-right" style="float: right;">
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item class="item-right" style="float: right;">
        <el-input v-model="keywords" placeholder="请输入关键字" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">添加分类</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="序号">
        <template slot-scope="scope">
          {{scope.$index+1+pageSize*(pageIndex-1)}}
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
	width="300"
        :show-overflow-tooltip="true"	
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
      <!--<el-table-column
        prop="updateNameBy"
        header-align="center"
        align="center"
        label="更新人">
      </el-table-column>-->
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.tagId,scope.row.tagName,scope.row.tagValue)">修改</el-button>
          <el-button type="text" size="small" class="btn-text-color-red" @click="deleteHandle(scope.row.tagId,scope.row.tagName)">删除</el-button>
        </template>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
	import {getCommHttpData,deleteData} from '@/utils/common'
  import AddOrUpdate from './config-add-or-update'
  export default {
    data () {
      return {
        keywords:undefined,
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
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.keywords = this.keywords==''?undefined:this.keywords;
        var that =this
        getCommHttpData({url:'device/findAllOfTag',method:'post',contentType:2,data:{
	        page: this.pageIndex,
	        limit: this.pageSize,
	        tagMsg: this.keywords
	      }},function(data){
      	  if (data && data.code === 0) {
      	  	if(data.page.list.length==0 && that.pageIndex !=1){
							that.pageIndex =1
							that.getDataList()
						}
            that.dataList = data.page.list
            that.totalPage = data.page.totalCount
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
      // 新增 / 修改
      addOrUpdateHandle (id,tagName,tagValue) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,tagName,tagValue)
        })
      },
      // 删除
      deleteHandle (id,tagName) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        var that =this
        deleteData(this,{url:'device/delTag',method:'post',contentType:2,operateType:1,data:{
	        id:id,tagName:tagName
	      }},function(data){
      	   that.getDataList()
	      })
      }
    }
  }
</script>
