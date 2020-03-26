<!--
	时间：2019-03-01
	描述：省市区级联
-->
<template>
	<div>
   <el-form-item label="地区" prop="gradeName">
   	<area-cascader type='text' :level='1' v-model="address" placeholder="请选择地址"></area-cascader>
        <!--<area-cascader type='text' v-model="temp.address" :level='1' :data="pcaa"></area-cascader>-->
    </el-form-item>
    </div>
</template>

<script>
//	import { pca, pcaa } from "area-data"
export default {
	data() {
	    return {
	      address:''
//	      pca:pca,
//      pcaa:pcaa
	    }
	},
	created() {
		this.$emit('refreshDataList',this.schoolYearId,this.schoolTermId)
	    this.getIndexByDict();
	},
	methods: {
		getIndexByDict(){
			this.$http({
		      url: this.$http.adornUrl('/cms/termList/list'),
		      method: 'post',
		      data: this.$http.adornData({schoolYearId: 0,termId: 0}),
		    }).then(({data}) => {
			    this.yearList = data.list.yearList;
			    this.termList = data.list.termList;
			    this.schoolYearId = data.list.nowYear.schoolYearId;
			    this.schoolTermId = data.list.nowTerm.termId;
		    })
		},
		getList() {
			this.$emit('refreshDataList',this.schoolYearId,this.schoolTermId)
		}
	}
}
</script>



