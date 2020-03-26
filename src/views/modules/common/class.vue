<template>
	<div style="float: left; margin-right: 5px;">
		<el-select class="filter-item" v-model="classId" clearable @change="getList" clearable placeholder="请选择班级 ">
			<el-option v-for="item in classList" :key="item.classId" :label="item.className" :value="item.classId">
			</el-option>
		</el-select>
	</div>
</template>

<script>
	import { getCommHttpData } from '@/utils/common'
	export default {
		props: {
			gradeId: {
				type: String,
				default: ''
			},
			classIdp: {
				type: String,
				default: ''
			},
			classRequire: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				classId: '',
				classList: []
			}
		},
		watch: {
			gradeId(val) {
				this.gradeId = val
				this.getInitData()
			},
			classIdp (val) {
		    	this.classId = val
		    }
		},
		created() {
			this.getInitData();
		},
		methods: {
			getInitData() {
				
				if(this.gradeId == '' || this.gradeId == null) {
					return;
				}
				var that = this
				getCommHttpData({
					url: 'common/queryClassList',
					method: 'get',
					contentType: 1,
					data: {
						gradeId: this.gradeId
					}
				}, function(data) {
					that.classList = data.list;
					
					if(that.classIdp != ''){
						that.classId = that.classIdp
					}else{
						//that.classId = data.list[0].classId;
					}
				})
			},
			getList() {
				this.$emit('refreshClassList', this.classId)
			}
		}
	}
</script>