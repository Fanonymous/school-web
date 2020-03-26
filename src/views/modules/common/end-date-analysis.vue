<template>
	<div style="display: inline-block;">
      <el-date-picker
      v-model="datapicker"
      type="date"
      placeholder="截止日期"
      @change="iniChartsData"
      :picker-options="pickerOptions"
      value-format="yyyy-MM-dd">
    </el-date-picker>
   </div>
</template>
<style>
	.el-date-editor .el-range-separator{
		width: 10%;
	}
</style>
<script>
	import {getDateStr} from '@/utils/common'
	export default {
	data() {
	    return {
	      	datapicker:'',
	      	pickerOptions: {
	      		disabledDate(time) {
		            return time.getTime() > Date.now();
		        }
	      	}

	    }
	},
	mounted() {
		this.datapicker = getDateStr(-1)
		this.iniChartsData()
	},
	created() {
	    
	},
	methods: {
		iniChartsData() {
			console.log(this.datapicker)
			this.$emit('refreshChartsData',this.datapicker)
		}
	}
}
</script>



