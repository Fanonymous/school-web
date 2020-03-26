<template>
	<div style="float: left; margin-right: 5px;">
        <el-select class="filter-item" v-model="schoolYearId"  @change="getList"> 
	        <el-option v-for="item in yearList" :key="item.schoolYearId" :label="item.schoolYearName" :value="item.schoolYearId">
	        </el-option>
	    </el-select>
        <el-select class="filter-item" v-model="schoolTermId"  @change="getList"> 
	        <el-option v-for="item in termList" :key="item.termId" :label="item.termName" :value="item.termId">
	        </el-option>
	    </el-select>
   </div>
</template>

<script>
export default {
	data() {
	    return {
	      schoolYearId: '',
	      schoolTermId: '',
	      yearList:[],
	      termList:[]
	    }
	},
	created() {
	    this.getIndexByDict();
	},
	methods: {
		getIndexByDict(){
			this.$http({
		      url: this.$http.adornUrl('/cms/termList/list'),
		      method: 'post',
		      data: this.$http.adornData({schoolYearId: 0,termId: 0}),
		    }).then(({data}) => {
			    this.yearList = data.list.yearList.reverse();
			    this.termList = data.list.termList;
			    this.schoolYearId = data.list.nowYear.schoolYearId;
			    this.schoolTermId = data.list.nowTerm.termId;
			    this.$emit('refreshDataList',this.schoolYearId,this.schoolTermId)
		    })
		},
		getList() {
			this.$emit('refreshDataList',this.schoolYearId,this.schoolTermId)
		},
		getSchoolYearId(){
			return this.schoolYearId
		}
	}
}
</script>



