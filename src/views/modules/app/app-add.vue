<template>
	<div class="mod-config">
		
		<el-card >
			<el-row :gutter="0">

			<el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
				<el-form-item label="应用名称" prop="applicationName">
					<el-col :span="8">
					<el-input v-model="dataForm.applicationName" placeholder="请输入应用名称" :disabled="isDisabled" ></el-input>
					</el-col>
				</el-form-item>
				<template v-if="isDisabled">
					<el-form-item label="应用分类"  :label="'图标'">
						<template v-if="dataForm.icon == ''">暂无</template>
						<img v-else :src="imgIP+dataForm.icon" height="100px" />
					</el-form-item>
				</template>
				<template v-else>
					<uploadpic ref="uploadpic" :label="'图标'" :disabled="isDisabled" @input="getPicSrc"></uploadpic>
				</template>
				
				<!-- <el-form-item label="应用分类" prop="applicationSort">
					<el-radio-group v-model="dataForm.applicationSort" size="small" :disabled="isDisabled">
						<el-radio v-for="item in appSortList" :key="item.value" :label="item.value" :value="item.value" border>{{item.dictName}}</el-radio>
					</el-radio-group>
				</el-form-item> -->
				<el-form-item label="应用场景" prop="applicationType">
					<el-select v-model="dataForm.applicationType" placeholder="请选择应用场景"  :disabled="isDisabled">
						<el-option v-for="item in applicationTypeList" :key="item.value" :label="item.dictName" :value="item.value">{{item.dictName}}</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="目标用户" prop="targetUser">
					<el-checkbox-group v-model="dataForm.targetUser" size="small" :disabled="isDisabled">
						<el-checkbox v-for="item in userTypeList" :key="item.value" :label="item.value" :value="item.value" border>{{item.dictName}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="应用介绍" prop="introduction">
					<el-col :span="8">
					<el-input type="textarea" v-model="dataForm.introduction" placeholder="请输入应用简介" :disabled="isDisabled"></el-input>
					</el-col>
				</el-form-item>
        <el-form-item label="平台外接系统" prop="isThirdSys">
        	<el-radio-group v-model="dataForm.isThirdSys" size="small" :disabled="isDisabled">
        		<el-radio label="1" value="1" border>是</el-radio>
            <el-radio label="0" value="0" border>否</el-radio>
        	</el-radio-group>
        </el-form-item>
				<el-form-item label="是否免费">
					<el-switch v-model="dataForm.isFree" :disabled="isDisabled" :active-value="1" :inactive-value="0"></el-switch>
				</el-form-item>
				<el-form-item label="是否试用">
					<el-select v-model="dataForm.canTry" placeholder="请选择是否试用" :disabled="isDisabled">
						<el-option v-for="item in canTryList" :key="item.value" :label="item.dictName" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联系QQ"  prop="contactInfo">
					<el-col :span="8">
					<el-input v-model="dataForm.contactInfo" placeholder="请输入QQ号 " :disabled="isDisabled"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item label="排序">
					<el-input-number v-model="dataForm.order" controls-position="right" :min="1" :max="100000"></el-input-number>
				</el-form-item>
				<!--<el-form-item label="应用标签">
					<el-tag :key="tag" v-for="tag in applicationTags" :disabled="isDisabled" closable :disable-transitions="false" @close="handleClose(tag)">
						{{tag}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible"  :disabled="isDisabled" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
					</el-input>
					<el-button v-else class="button-new-tag" size="small"  :disabled="isDisabled" @click="showInput">+ 添加</el-button>
				</el-form-item>-->
				<el-form-item>
					<el-button v-show="opType < 2" type="primary" @click="dataFormSubmit(0)">保存并发布</el-button>
					<el-button v-show="opType < 2" type="primary" @click="dataFormSubmit(1)">保存</el-button>
					<el-button @click="$router.push({name:'app-manage'})">取消</el-button>
				</el-form-item>
			</el-form>
			
		</el-row>
		</el-card>
		
	</div>
</template>
<style>
	.el-tag+.el-tag {
		margin-left: 10px;
	}
	
	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}
	
	.input-new-tag {
		width: 100px;
		margin-left: 10px;
		vertical-align: bottom;
	}
</style>
<script>
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	import Uploadpic from '../common/uploadpic'
	export default {
		data() {
			return {
				imgIP:window.SITE_CONFIG.imgIP ,
				deviceId: undefined,
				picList: [],
				userTypeList: [],
				applicationTypeList: [],
				canTryList: [],
				dataForm: {
					applicationName: '',
					icon: '',
					applicationType: '',
					introduction: '',
					canTry: '',
					isFree: 1,
					contactInfo: '',
					targetUser: [],
					applicationSort:'',
					applyTag: '',
					order:0,
          isThirdSys:'0'
				},
				imgType: {
					type: '.png'
				},
				dataRule: {
					applicationName: [{
						required: true,
						message: '名称不能为空',
						trigger: 'blur'
					}, {
						min: 1,
						max: 30,
						message: '名称不能大于30个字符'
					}],
					icon: [{
						required: true,
						message: '图标不能为空',
						trigger: 'blur'
					}],
					applicationType: [{
						required: true,
						message: '应用分类不能为空',
						trigger: 'change'
					}],
					// applicationSort:[{
					// 	required: true,
					// 	message: '应用分类不能为空',
					// 	trigger: 'change'
					// }],
					targetUser: [{
						required: true,
						type: 'array',
						message: '目标用户不能为空',
						trigger: 'change'
					}],
					introduction: [{
						required: true,
						message: '应用介绍不能为空',
						trigger: 'blur'
					}, {
						min:1,
						max: 500,
						message: '应用简介不能大于500个字符'
					}],
					contactInfo:[{
						min:1,
						max: 15,
						message: 'QQ号不能大于15个字符'
					}],
          isThirdSys:[{
            required: true,
            message: '平台外接系统不能为空',
            trigger: 'change'
          }]
				},
				durableYearsList: [],
				brandIdList: [],
				fileList: [],
				applicationTags: [],
				appSortList:[],
				opType: 0,
				inputVisible: false,
				inputValue: '',
				isDisabled:false
			}
		},
		components: {
			Uploadpic
		},
		mounted() {
			
			getCommonDictByType(this, 'user_type', 'userTypeList')
			getCommonDictByType(this, 'application_type', 'applicationTypeList')
			getCommonDictByType(this, 'trial_time', 'canTryList')
			getCommonDictByType(this, 'application_sort', 'appSortList')
			if(this.$route.query.id != undefined) {
				if(this.$route.query.type == 2 ){
					this.isDisabled = true
				}else{
					this.isDisabled = false
				}
				
				//this.dataForm = this.$route.params
				this.opType = this.$route.query.type
				let that =this
				getCommHttpData({
					url: 'application/info',
					method: 'post', 
					contentType: 1,
					data: {
						applicationId: this.$route.query.id,
					}
				}, function(data) {
					let tempArr = [],
						tempStr = data.application.targetUser
					if(tempStr.length == 0){
						return
					}
					if(tempStr.toString().indexOf(',') >-1) {
						tempStr = tempStr.split(',')
						tempStr.forEach(item => {
							tempArr.push(parseInt(item));
						});
					} else {
						tempArr = [parseInt(data.application.targetUser)]
					}
					that.dataForm = data.application
					if(that.dataForm.canTry != '' &&  that.dataForm.canTry != null){
						that.dataForm.canTry = parseInt(data.application.canTry)
					}
					that.dataForm.isFree = parseInt(data.application.isFree)
					that.dataForm.targetUser = tempArr
					// that.dataForm.applicationSort = data.application.applicationSort
					that.dataForm.order = data.application.order==undefined?0:data.application.order
					that.dataForm.isThirdSys = data.application.isThirdSys.toString()
					if( data.application.icon != ''){
						that.dataForm.icon = data.application.icon
					}
					if(!that.isDisabled){
						if(data.application.icon != ''){
							that.$refs.uploadpic.imgUrl = that.imgIP+data.application.icon
							// that.$refs.uploadpic.picList = [{
							// 	name: '图标',
							// 	url: that.imgIP+data.application.icon
							// }]
						}
						
					}
					
				})
			}
		},
		methods: {
			handleClose(tag) {
				this.applicationTags.splice(this.applicationTags.indexOf(tag), 1);
			},

			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleInputConfirm() {
				let inputValue = this.inputValue;
				if(inputValue) {
					this.applicationTags.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
			},

			getPicSrc(picSrc) {
				console.log(picSrc,'picsedhdhdh')
				this.dataForm.icon = picSrc
			},
			dataFormSubmit(type) {
				//提交
				let isFree = this.dataForm.isFree
				isFree = isFree ? 1 : 0
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						var that = this
						let applicationId = this.$route.query.id
						getCommHttpData({
							url: `/application/${this.$route.query.id== undefined ? 'saveApp' : 'updateApp'}`,
							method: 'post',
							contentType: 2,
							operateType: 2,
							that: this,
							data: {
								applicationId: applicationId,
								applicationName: this.dataForm.applicationName,
								icon: this.dataForm.icon,
								applicationType: this.dataForm.applicationType,
								introduction: this.dataForm.introduction,
								canTry: this.dataForm.canTry,
								isFree: isFree,
								contactInfo: this.dataForm.contactInfo,
								targetUser: this.dataForm.targetUser.toString(),
								applyTag: this.applicationTags.toString(),
								// applicationSort:this.dataForm.applicationSort,
								order:this.dataForm.order,
                isThirdSys:this.dataForm.isThirdSys
							}
						}, function(data) {
							if(data && data.code==0){
								if(type == 1){
									that.$router.push({
										name: 'app-manage'
									})
								}else{
									that.$router.push({
										name: 'publish-add',
										query:{type:0,applicationId:data.appId}
									})
								}
							}
						})
					}
				})
			}
		}
	}
</script>
