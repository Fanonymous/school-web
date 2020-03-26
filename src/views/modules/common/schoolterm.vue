<template>
	<div style="float: left; margin-right: 5px;">
        <el-select class="filter-item" v-model="yearTermId"  @change="getList"> 
	        <el-option v-for="item in yearList" :key="item.yearTermId" :label="item.yearName" :value="item.yearTermId">
	        </el-option>
	    </el-select>
   </div>
</template>

<script>
import { getCommHttpData, getCommonDictByType, getExportFile, deleteData } from '@/utils/common'
export default {
	data() {
	    return {
	      yearTermId: '',
	      yearList:[],
	    }
	},
	created() {
	    this.getIndexByDict();
	},
	methods: {
		getIndexByDict(){
			let that = this
			getCommHttpData({
				url: 'common/queryYearTerm',
				method: 'GET',
				contentType:1,
				that: this,
			}, function(data) {
				that.yearList = data.list;
			    that.yearTermId = data.list[0].yearTermId;
			    that.$emit('refreshDataList',that.yearTermId)
			})
		},
		getList() {
			this.$emit('refreshDataList',this.yearTermId)
		},
		getSchoolYearId(){
			return this.yearTermId
		}
	}
}
</script>
