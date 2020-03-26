<template>
	<div style="display: inline-block;margin-bottom: 10px;">
		<el-select class="filter-item" v-model="schoolSideType" clearable @change="iniChartsData" v-if="schoolSideTypeShow" placeholder="请选择城乡类型">
			<el-option v-for="item in schoolSideTypeList" :key="item.name" :label="item.name" :value="item.name">
			</el-option>
		</el-select>
		<el-select class="filter-item" v-model="schoolType" clearable @change="getGradeList" v-if="schoolTypeShow" placeholder="请选择学段">
			<el-option v-for="item in schoolTypeList" :key="item.name" :label="item.name" :value="item.name">
			</el-option>
		</el-select>
		<el-select class="filter-item" v-model="schoolIds" clearable @change="iniChartsData" v-if="schoolShow" placeholder="请选择学校">
			<el-option v-for="item in schoolList" :key="item.id" :label="item.name" :value="item.id">
			</el-option>
		</el-select>
		<el-select class="filter-item" v-model="gradeIds" clearable @change="iniChartsData" v-if="gradeShow" placeholder="请选择年级">
			<el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
			</el-option>
		</el-select>
		<el-select class="filter-item" v-model="classIds" clearable @change="iniChartsData" v-if="classShow" placeholder="请选择班级">
			<el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
			</el-option>
		</el-select>
		<el-select class="filter-item" multiple multiple-limit="1" v-model="classroomIds" clearable @change="iniChartsData" v-if="classroomShow" placeholder="请选择教室">
			<el-option v-for="item in classroomList" :key="item.id" :label="item.name" :value="item.id">
			</el-option>
		</el-select>
		<el-select class="filter-item" multiple multiple-limit="1" v-model="subjectIds" clearable @change="iniChartsData" v-if="subjectShow" placeholder="请选择科目">
			<el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id">
			</el-option>
		</el-select>
		<el-select class="filter-item" v-model="sex" clearable @change="iniChartsData" v-if="sexShow" placeholder="请选择性别">
			<el-option v-for="item in sexList" :key="item.name" :label="item.name" :value="item.name">
			</el-option>
		</el-select>
		<el-select class="filter-item" v-model="ageRange" clearable @change="iniChartsData" v-if="ageShow" placeholder="请选择性别">
			<el-option v-for="item in ageList" :key="item.name" :label="item.name" :value="item.name">
			</el-option>
		</el-select>
		<el-select class="filter-item" v-model="education" clearable @change="iniChartsData" v-if="eduShow" placeholder="请选择学历">
			<el-option v-for="item in educationList" :key="item.name" :label="item.name" :value="item.name">
			</el-option>
		</el-select>
		<el-select class="filter-item" v-model="title" clearable @change="iniChartsData" v-if="titleShow" placeholder="请选择职称">
			<el-option v-for="item in titleList" :key="item.name" :label="item.name" :value="item.name">
			</el-option>
		</el-select>
	</div>
</template>

<script>
	import { getCommHttpData } from '@/utils/common'
	export default {
		props: {
			schoolTypeShow: {
				type: Boolean,
				default: false
			},
			schoolSideTypeShow: {
				type: Boolean,
				default: false
			},
			schoolShow: {
				type: Boolean,
				default: false
			},
			gradeShow: {
				type: Boolean,
				default: false
			},
			classShow: {
				type: Boolean,
				default: false
			},
			classroomShow: {
				type: Boolean,
				default: false
			},
			subjectShow: {
				type: Boolean,
				default: false
			},
			sexShow: {
				type: Boolean,
				default: false
			},
			ageShow: {
				type: Boolean,
				default: false
			},
			eduShow: {
				type: Boolean,
				default: false
			},
			titleShow: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				orgId: this.GLOBAL.getOrgId(),
				schoolType: '',
				schoolSideType: '',
				schoolIds: '',
				gradeIds: '',
				classIds: '',
				classroomIds: '',
				subjectIds: '',
				sex: '',
				ageRange: '',
				education: '',
				title: '',

				schoolTypeType: 2,
				schoolSideTypeType: 3,
				schoolIdsType: 4,
				gradeIdsType: 5,
				classIdsType: 12,
				classroomIdsType: 7,
				subjectIdsType: 8,
				sexType: 8,
				ageRangeType: 10,
				educationType: 11,
				titleType: 12,

				schoolTypeList: [],
				schoolSideTypeList: [],
				schoolList: [],
				gradeList: [],
				classList: [],
				classroomList: [],
				subjectList: [],
				sexList: [],
				ageList: [],
				educationList: [],
				titleList: []
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

			if(this.schoolTypeShow) {
				filterParams['commType'] = 2;
				let that = this
				getCommHttpData({
					url: 'multimemediaEquip/commFilter',
					method: 'post',
					contentType: 2,
					data: filterParams
				}, function(data) {
					that.schoolTypeList = data.list
				})
			}
			if(this.schoolSideTypeShow) {
				filterParams['commType'] = 3;
				let that = this
				getCommHttpData({
					url: 'multimemediaEquip/commFilter',
					method: 'post',
					contentType: 2,
					data: filterParams
				}, function(data) {
					that.schoolSideTypeList = data.list
				})
			}
			if(this.schoolShow) {
				filterParams['commType'] = 4;
				let that = this
				getCommHttpData({
					url: 'multimemediaEquip/commFilter',
					method: 'post',
					contentType: 2,
					data: filterParams
				}, function(data) {
					that.schoolList = data.list
				})
			}
			if(this.gradeShow) {

				filterParams['commType'] = 5;
				filterParams['schoolType'] = this.schoolType;
				let that = this
				getCommHttpData({
					url: 'multimemediaEquip/commFilter',
					method: 'post',
					contentType: 2,
					data: filterParams
				}, function(data) {
					that.gradeList = data.list
				})
			}
			if(this.subjectShow) {
				filterParams['commType'] = 6;
				//alert(filterParams['commType'])
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
			if(this.classroomShow) {
				filterParams['commType'] = 7;
				let that = this
				getCommHttpData({
					url: 'multimemediaEquip/commFilter',
					method: 'post',
					contentType: 2,
					data: filterParams
				}, function(data) {
					that.classroomList = data.list
				})
			}
			if(this.ageShow) {
				filterParams['commType'] = 8;
				let that = this
				getCommHttpData({
					url: 'multimemediaEquip/commFilter',
					method: 'post',
					contentType: 2,
					data: filterParams
				}, function(data) {
					that.ageList = data.list
				})
			}
			if(this.eduShow) {
				filterParams['commType'] = 9;
				let that = this
				getCommHttpData({
					url: 'multimemediaEquip/commFilter',
					method: 'post',
					contentType: 2,
					data: filterParams
				}, function(data) {
					that.educationList = data.list
				})
			}
			if(this.titleShow) {
				filterParams['commType'] = 10;
				let that = this
				getCommHttpData({
					url: 'multimemediaEquip/commFilter',
					method: 'post',
					contentType: 2,
					data: filterParams
				}, function(data) {
					that.titleList = data.list
				})
			}
			if(this.sexShow) {
				filterParams['commType'] = 11;
				let that = this
				getCommHttpData({
					url: 'multimemediaEquip/commFilter',
					method: 'post',
					contentType: 2,
					data: filterParams
				}, function(data) {
					that.sexList = data.list
				})
			}
			if(this.classShow) {
				filterParams['commType'] = 12;
				let that = this
				getCommHttpData({
					url: 'multimemediaEquip/commFilter',
					method: 'post',
					contentType: 2,
					data: filterParams
				}, function(data) {
					that.classList = data.list
				})
			}
		},
		methods: {
			getGradeList() {
				let gradeParams = {}
				gradeParams['commType'] = 5;
				if(this.schoolType) {
					gradeParams['schoolType'] = this.schoolType;
				}
				let that = this
				getCommHttpData({
					url: 'multimemediaEquip/commFilter',
					method: 'post',
					contentType: 2,
					data: gradeParams
				}, function(data) {
					that.gradeIds = ''
					that.gradeList = data.list
					that.iniChartsData()
				})
			},
			//1查本学期日期，
			//2查学段，
			//3查学校地区类别，
			//4查教育局下的学校，
			//5查年级，
			//6查科目，
			//7查教室，
			//8查年龄区间，
			//9查学历，
			//10查职称，
			//11查性别，
			//12查班级
			getCommFilterMedia(params) {
				var that = this
				getCommHttpData({
					url: 'multimemediaEquip/commFilter',
					method: 'post',
					contentType: 2,
					data: params
				}, function(data) {
					if(params.commType == 2) {
						that.schoolTypeList = data.list
					} else if(params.commType == 3) {
						that.schoolSideTypeList = data.list
					} else if(params.commType == 4) {
						that.schoolList = data.list
					} else if(params.commType == 5) {
						that.gradeList = data.list
					} else if(params.commType == 6) {
						that.subjectList = data.list
					} else if(params.commType == 7) {
						that.classroomList = data.list
					} else if(params.commType == 8) {
						that.ageList = data.list
					} else if(params.commType == 9) {
						that.educationList = data.list
					} else if(params.commType == 10) {
						that.titleList = data.list
					} else if(params.commType == 11) {
						that.sexList = data.list
					} else if(params.commType == 12) {
						that.classList = data.list
					}
				})
			},
			//		setFilterData(){
			//			getCommHttpData({url:'multimemediaEquip/commFilter',method:'post',contentType:2,data:params},function(data){
			//		    	if(params.commType == 2){
			//		    		that.schoolTypeList =  data.list
			//		    	}else if(params.commType == 3){
			//		    		that.schoolSideTypeList = data.list
			//		    	}else if(params.commType == 4){
			//		    		that.schoolList = data.list
			//		    	}else if(params.commType == 5){
			//		    		that.gradeList = data.list
			//		    	}else if(params.commType == 6){
			//		    		that.subjectList = data.list
			//		    	}else if(params.commType == 7){
			//		    		that.classroomList = data.list
			//		    	}else if(params.commType == 8){
			//		    		that.ageList = data.list
			//		    	}else if(params.commType == 9){
			//		    		that.educationList = data.list
			//		    	}else if(params.commType == 10){
			//		    		that.titleList = data.list
			//		    	}else if(params.commType == 11){
			//		    		that.sexList = data.list
			//		    	}else if(params.commType == 12){
			//		    		that.classList = data.list
			//		    	}
			//		    })
			//		},
			iniChartsData() {
				let jsonTemp = {};

				if(this.schoolTypeShow) {
					if(this.schoolType.length != 0) {
						jsonTemp['schoolType'] = this.schoolType
					} else {
						jsonTemp['schoolType'] = ''
					}
				} else {
					jsonTemp['schoolType'] = ''
				}

				if(this.schoolSideTypeShow) {
					if(this.schoolSideType.length != 0) {
						jsonTemp['schoolSideType'] = this.schoolSideType
					} else {
						jsonTemp['schoolSideType'] = ''
					}
				} else {
					jsonTemp['schoolSideType'] = ''
				}

				if(this.schoolShow) {
					if(this.schoolIds.length != 0) {
						jsonTemp['schoolIds'] = this.schoolIds
					} else {
						jsonTemp['schoolIds'] = ''
					}
				} else {
					jsonTemp['schoolIds'] = ''
				}
				//jsonTemp['schoolIds'] = this.schoolShow?[this.schoolIds]:null;

				if(this.gradeShow) {
					if(this.gradeIds.length != 0) {
						jsonTemp['gradeIds'] = [this.gradeIds]
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
				if(this.classroomShow) {
					if(this.classroomIds.length != 0) {
						jsonTemp['classroomIds'] = this.classroomIds
					} else {
						jsonTemp['classroomIds'] = []
					}
				} else {
					jsonTemp['classroomIds'] = []
				}

				jsonTemp['ageRange'] = this.ageShow ? [this.ageRange] : null;
				jsonTemp['education'] = this.eduShow ? [this.education] : null;
				jsonTemp['title'] = this.titleShow ? [this.title] : null;
				jsonTemp['sex'] = this.sexShow ? [this.sex] : null;
				jsonTemp['classIds'] = this.classShow ? [this.classIds] : null;
				this.$emit('refreshChartsData', jsonTemp)
			}
		}
	}
</script>