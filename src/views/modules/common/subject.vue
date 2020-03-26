<template>
	<div style="float: left; margin-right: 5px;">
        <el-select class="filter-item" v-model="classId" clearable  @change="getList"> 
	        <el-option v-for="item in selectList" :key="item.subjectId" :label="item.subName" :value="item.subjectId">
	        </el-option>
	    </el-select>
   </div>
</template>

<script>
	import {getCommHttpData } from '@/utils/common'
export default {
	props: {
	    gradeId: {
	      type: String,
	      default: ''
	    },
    },
	data() {
	    return {
	        classId: '',
	        selectList:[]
	    }
	},
	watch: {
	    gradeId (val) {
	    	this.gradeId = val
	        this.getInitData()
	    }
    },
	created() {
	    this.getInitData();
	},
	methods: {
		getInitData(){
			if(this.gradeId == ''){
				return;
			}
			var that =this
			getCommHttpData({url:'cms/subInfo/byGrade',method:'post',serverType:1,contentType:0,data:{gradeId:this.gradeId}},function(data){
	  	    	that.selectList = data.list;
	        })
		},
		getList() {
			this.$emit('refreshSubjectList',this.classId)
		}
	}
}
</script>



