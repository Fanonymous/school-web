<template>
	<div style="display: inline-block;margin-bottom: 10px;">
		<el-select class="filter-item" v-model="gradeIds" @change="getClassList" v-if="gradeShow && classShow" placeholder="请选择年级">
			<el-option v-for="item in gradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
			</el-option>
		</el-select>
		<el-select class="filter-item" clearable v-model="gradeIds" @change="iniChartsData" v-if="gradeShow && !classShow" placeholder="请选择年级">
			<el-option v-for="item in gradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
			</el-option>
		</el-select>
		
		<el-select class="filter-item" v-model="classIds" @change="iniChartsData" v-if="classShow" placeholder="请选择班级">
			<el-option v-for="item in classList" :key="item.classId" :label="item.className" :value="item.classId">
			</el-option>
		</el-select>
		<el-select class="filter-item" :multiple-limit="1" v-model="subjectIds" clearable @change="iniChartsData" v-if="subjectShow" placeholder="请选择科目">
			<el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id">
			</el-option>
		</el-select>
	</div>
</template>

<script>
	import { getCommHttpData } from '@/utils/common'
	export default {
		props: {
			gradeShow: {
				type: Boolean,
				default: false
			},
			gradeRequire: {
				type: Boolean,
				default: false
			},
			classShow: {
				type: Boolean,
				default: false
			},
			classRequire: {
				type: Boolean,
				default: false
			},
			subjectShow: {
				type: Boolean,
				default: false
			},
			subjectRequire: {
				type: Boolean,
				default: false
			},
			startDate: {
				type: String,
				default: ''
			},
			endDate: {
				type: String,
				default: ''
			}
		},
		
		data() {
			return {
				orgId: this.GLOBAL.getOrgId(),
				gradeIds: '',
				classIds: '',
				subjectIds: '',
				
				gradeIdsType: 5,
				classIdsType: 12,
				subjectIdsType: 8,
				
				gradeList: [],
				classList: [],
				subjectList: [],
				startDate:'',
				endDate:''
			}
		},
		watch: {
		    startDate (val) {
		    	this.startDate = val
		    },
		    endDate (val) {
		    	this.endDate = val
		    }
		},
		mounted() {
			var filterParams = {
				commType: 2
			};
			if(this.$cookie.get('userType') == 2) {
				filterParams['schoolId'] = this.orgId
			} else {
				filterParams['unitId'] = this.orgId
			}

			if(this.gradeShow) {

				filterParams['commType'] = 5;
				let that = this
				getCommHttpData({
					url: 'common/queryGradeList',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					that.gradeList = data.list
					
					if(that.classShow){
						that.gradeIds = data.list[0].gradeId
						that.getSubjectList()
						that.getClassList()
					}
				})
			}
			
		},
		methods: {
			//5查年级，
			//6查科目，
			//12查班级
			getSubjectList(){
				var filterParams = {schoolId:this.orgId};
				if(this.subjectShow) {
					filterParams['commType'] = 6;
					filterParams['gradeId'] = this.gradeIds;
					let that = this
					getCommHttpData({
						url: 'multimemediaEquip/commFilter',
						method: 'post',
						contentType: 2,
						data: filterParams
					}, function(data) {
						that.subjectList = data.list
					})
				}
			},
			getClassList(){
				var filterParams = {schoolId:this.orgId,startDate:this.startDate,endDate:this.endDate};
				if(this.classShow) {
					filterParams['commType'] = 12;
					filterParams['gradeId'] = this.gradeIds;
					let that = this
					getCommHttpData({
						url: 'common/queryClassByDateList',
						method: 'get',
						contentType: 1,
						data: filterParams
					}, function(data) {
						that.classList = data.list
						that.classIds = data.list[0].classId
						that.iniChartsData()
					})
				}
			
			},
			
			iniChartsData() {
				let jsonTemp = {};

				if(this.gradeShow) {
					if(this.gradeIds.length != 0) {
						jsonTemp['gradeIds'] = this.gradeIds
					} else {
						jsonTemp['gradeIds'] = []
					}
				} else {
					jsonTemp['gradeIds'] = []
				}
				if(this.subjectShow) {
					if(this.subjectIds.length != 0) {
						jsonTemp['subjectIds'] = this.subjectIds
					} else {
						jsonTemp['subjectIds'] = []
					}
				} else {
					jsonTemp['subjectIds'] = []
				}
				
				jsonTemp['classIds'] = this.classShow ? [this.classIds] : null;
				this.$emit('refreshChartsData', jsonTemp)
			}
		}
	}
</script>