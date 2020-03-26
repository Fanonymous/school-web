<template>
	<div style="float: left; margin-right: 5px;">
		<el-select class="filter-item" v-model="gradeId" @change="getList" :disabled="disabled" clearable  placeholder="请选择年级">
			<el-option v-for="item in gradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
			</el-option>
		</el-select>
	</div>
</template>

<script>
	import { getCommHttpData } from '@/utils/common'
	export default {
		props: {
			gradeIdp: {
				type: String,
				default: ''
			},
			require:{
		    	type: Boolean,
		    	default: true
	    	},
	    },
		data() {
			return {
				gradeId: '',
				gradeList: [],
				disabled: false
			}
		},
		 watch: {
		    gradeIdp (val) {
		    	this.gradeId = val
		    }
		},
		mounted() {
			//this.$emit('refreshDataList', this.gradeId)
			this.getIndexByDict();
		},
		methods: {
			getIndexByDict() {
				var that = this
				getCommHttpData({
					url: 'common/queryGradeList',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					that.gradeList = data.list;

					if(that.gradeIdp != ''){
						that.gradeId = that.gradeIdp
					}else{
						//that.gradeId = data.list[0].gradeId;
					}

				})
			},
			getList() {
				this.$emit('refreshDataList', this.gradeId)
			}
		}
	}
</script>
