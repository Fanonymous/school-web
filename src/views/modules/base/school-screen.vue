<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
    <el-form :inline="true">
        <el-select class="filter-item" v-model="schoolId" clearable @change="fetchData" placeholder="请选择学校">
          <el-option v-for="item in schoolList" :key="item.depart_id" :label="item.depart_name" :value="item.depart_id">    </el-option>
        </el-select>
    </el-form>
  </div>
</template>
<script>
  import {getCommHttpData} from '@/utils/common'
  export default {
    name: 'exportExcel',
    data() {
      return {
        schoolId: "",
        listLoading: true,
        schoolList:[]
      }
    },
    mounted() {
      this.$emit('schoolId',this.schoolId);
      this.getAllSchools();
    },
    methods: {
      getAllSchools(){
        this.listLoading = true
        var that = this
        getCommHttpData({url:'basedatacenter/depart/getSchools',method:'post',contentType:2,data:{}},function(data){
          if(data.code == 0){
              that.schoolList = data.schools
          }else{
              that.schoolList = []
          }
	        that.listLoading = false
	      })
      },
      fetchData:function(){
        this.$emit('schoolId',this.schoolId)
      }
    }
  }
</script>
