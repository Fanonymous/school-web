<template>
	<div class="chart-select">
		<el-select :id="id" v-model="mediaKpiType" size="mini" value-key="id" placeholder="请选择" @change="getMediaType" >
		    <el-option v-for="item in list" :label="item.name" :key="item.id" :value="item"></el-option>
		</el-select>
   </div>
</template>

<script>
export default {
	props: {
		id:{
	    	type: String,
	    	default: 'kpiType'
    	},
    },
	data() {
	    return {
	    	list:[{name:'教学率',id:1},
	    	{name:'教学时长',id:2},
	    	{name:'交互性',id:3},
	    	{name:'多样性',id:4}],
	    	mediaKpiType:'1'
	    }
	},
	mounted() {
		this.mediaKpiType = this.list[0]
		this.$emit('refreshChartsOne',this.mediaKpiType.id,this.mediaKpiType.name)
	},
	methods: {
		getMediaType (typeVal){
			this.$emit('refreshChartsOne',typeVal.id,typeVal.name)
		}
	}
}
</script>



