<template>
	<div>
   <el-form-item label="年级" prop="gradeName" >
        <el-select class="filter-item" v-model="schoolYearId" :disabled="yearTermDis" @change="getList"> 
	        <el-option v-for="item in yearList" :key="item.schoolYearId" :label="item.schoolYearName" :value="item.schoolYearId">
	        </el-option>
	    </el-select>
    </el-form-item>
    <el-form-item label="学期" prop="gradeSystem">
        <el-select class="filter-item" v-model="schoolTermId" :disabled="yearTermDis"  @change="getList"> 
	        <el-option v-for="item in termList" :key="item.termId" :label="item.termName" :value="item.termId">
	        </el-option>
	    </el-select>
    </el-form-item>
    </div>
</template>

<script>
export default {
	data() {
	    return {
	    	yearTermDis : false,
	      schoolYearId: '',
	      schoolTermId: '',
	      yearList:[],
	      termList:[]
	    }
	},
	created() {
	    this.getInitData();
	},
	methods: {
		getInitData(){
			this.$http({
		      url: this.$http.adornUrl('/cms/termList/list'),
		      method: 'post',
		      data: this.$http.adornData({schoolYearId: 0,termId: 0}),
		    }).then(({data}) => {
			    this.yearList = data.list.yearList.reverse();
			    this.termList = data.list.termList;
			    this.schoolYearId = data.list.nowYear.schoolYearId;
			    this.schoolTermId = data.list.nowTerm.termId;
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



