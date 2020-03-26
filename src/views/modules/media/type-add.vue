<template>
	<div class="mod-config">
		<el-card>
			<el-row :gutter="0">
			<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
				<el-form-item label="名称" prop="deviceName">
					<el-col :span="8">
					<el-input v-model="dataForm.deviceName" placeholder="请输入内容"></el-input>
					</el-col>
				</el-form-item>
				<!--<el-form-item label="图标"  prop="deviceTypeIcon">-->
				<uploadfile label="图标" ref="uploadpic" :fileRequired=false :uploadPng=true :limit=1 :fileExt="fileExtWechat" uploadUrl="picUpload" @refreshDataList="getPicSrc"></uploadfile>
				
				<!--<uploadpic ref="uploadpic" :label="'图片'" @refreshDataList="getPicSrc"></uploadpic>-->
				<el-form-item label="使用年限" prop="deviceYears">
					<el-select v-model="dataForm.deviceYears" placeholder="请选择年限">
						<el-option v-for="item in durableYearsList" :key="item.value" :label="item.dictName" :value="item.value" :disabled="item.disabled"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="可装客户端">
					<el-switch v-model="dataForm.isClient"></el-switch>
					<label v-if="dataForm.isClient == 1">是</label>
					<label v-else>否</label>
				</el-form-item>
				<el-form-item label="品牌" prop="brandList" ref="brandListTip">
					<el-select v-model="dataForm.brandList" multiple filterable @change="handForceUpdate" placeholder="请选择品牌" style="width:505px;">
						<el-option-group v-for="(group,index) in brandIdList" :key="index" :label="index">
							<el-option v-for="item in group" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-option-group>
					</el-select>
				</el-form-item>
				<!--<el-form-item label="故障类型">
		    <el-select v-model="form.faultTypeId" multiple filterable placeholder="请选择故障类型">
		      <el-option v-for="item in faultTypeList" :key="item.tagValue" :label="item.tagValue" :value="item.tagValue" :disabled="item.disabled"></el-option>
		    </el-select>
		  </el-form-item>-->
				<!--<el-form-item label="故障说明">
		    <el-input type="textarea" v-model="dataForm.faultDesc" placeholder="请输入故障说明"></el-input>
		  </el-form-item>-->
				<el-form-item label="排序">
					<el-input-number v-model="dataForm.order" controls-position="right" :min="1" :max="100000"></el-input-number>
				</el-form-item>
				<el-form-item label="备注">
					<el-col :span="8">
					<el-input type="textarea" v-model="dataForm.deviceRemark" placeholder="请输入备注"></el-input>
					</el-col>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="dataFormSubmit">提交</el-button>
					<el-button @click="$router.push({name:'media-type'})">取消</el-button>
				</el-form-item>
			</el-form>
			</el-row>
		</el-card>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	import Uploadpic from '../common/uploadpic'
	import Uploadfile from '../common/upload-file'
	export default {
		data() {
			return {
				deviceId: undefined,
				picList: [],
				fileExtWechat:['.PNG', '.JPG', '.GIF', '.JPEG', '.BMP'],
				dataForm: {
					deviceName: '',
					deviceTypeIcon: '',
					deviceYears: '',
					isClient: true,
					brandList: [],
					faultDesc: '',
					order: '',
					deviceRemark: ''
				},
				imgType: {
					type: '.png'
				},
				dataRule: {
					deviceName: [{
						required: true,
						message: '名称不能为空',
						trigger: 'blur'
					}],
					deviceTypeIcon: [{
						required: true,
						message: '图标不能为空',
						trigger: 'blur'
					}],
					deviceYears: [{
						required: true,
						message: '年限不能为空',
						trigger: 'blur'
					}],
					brandList: [{
						type: 'array',
						required: true,
						message: '品牌不能为空',
						trigger: 'change'
					}]
				},
				durableYearsList: [],
				brandIdList: [],
				fileList: []
			}
		},
		components: {
			Uploadpic,
			Uploadfile
        },
        watch : {
            'dataForm.brandList' : {
                handler(n) {
                    this.$refs.brandListTip.$emit('el.form.change')
                },
                deep : true
            }
        },
		mounted() {
			this.$refs.uploadpic.picList = []
			this.$http({
				url: this.$http.adornUrlMedia('/common/dict/typeChange'),
				method: 'post',
				params: this.$http.adornParams({
					type: 'durable_years'
				})
			}).then(({
				data
			}) => {
				if(data && data.code === 0) {
					this.durableYearsList = data.list
				}
			})
			this.$http({
				url: this.$http.adornUrlMedia('/device/findAllOfTag'),
				method: 'post',
				data: this.$http.adornParams({
					tagName: '品牌',
					action: '1'
				})
			}).then(({
				data
			}) => {
				if(data && data.code === 0) {
					this.brandIdList = data.tagList
					this.getDataInfo()
				}
			})

		},
		methods: {
            handForceUpdate() {
                this.$forceUpdate()
            },
			getPicSrc(picSrc) {
				this.dataForm.deviceTypeIcon = picSrc
			},
			getDataInfo() {

				if(this.$route.params.deviceId == undefined) {
					this.deviceId = undefined
					this.dataForm = {
						deviceName: '',
						deviceTypeIcon: '',
						deviceYears: '',
						isClient: true,
						brandList: [],
						faultDesc: '',
						order: '',
						deviceRemark: ''
					}
					this.fileList = []
					return;
				}
				this.deviceId = this.$route.params.deviceId
				this.$http({
					url: this.$http.adornUrlMedia('/device/findTypeList'),
					method: 'post',
					data: this.$http.adornParams({
						deviceId: this.$route.params.deviceId
					})
				}).then(({
					data
				}) => {
					this.dataForm = data.list[0]
					this.dataForm.isClient = data.list[0].isClient == 1 ? true : false;
					if(data.list[0].brandNames != null) {
						let brandNames = data.list[0].brandNames.split(',')
						let brandIds = data.list[0].brandIds.split(',')
						let temArr = new Array()
						for(var i in brandIds) {
							temArr.push(parseInt(brandIds[i]))
						}
						this.dataForm.brandList = temArr;
					} else {
						this.dataForm.brandList = []
					}

					if(data.list[0].deviceTypeIcon == '') {
						this.$refs.uploadpic.imageUrl = ''
					} else {
						this.$refs.uploadpic.imageUrl = data.list[0].deviceTypeIcon

					}

				})
			},

			dataFormSubmit() {
                //提交
                if (!this.dataForm.brandList.length) {
                    this.$message.closeAll()
                    this.$message.error('品牌不能为空!')
                    return
                }
				let isClient = this.dataForm.isClient
				isClient = isClient ? 1 : 0
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
                        
						var that = this
						getCommHttpData({
							url: `/device/${this.$route.params.deviceId== undefined ? 'save' : 'update'}`,
							method: 'post',
							serverType: 2,
							contentType: 2,
							operateType: 2,
							that: this,
							data: {
								deviceId: this.deviceId,
								deviceName: this.dataForm.deviceName,
								deviceTypeIcon: this.dataForm.deviceTypeIcon,
								deviceYears: this.dataForm.deviceYears,
								isClient: isClient,
								brandList: this.dataForm.brandList,
								faultDesc: '',
								order: this.dataForm.order,
								deviceRemark: this.dataForm.deviceRemark
							}
						}, function(data) {
							that.$router.push({
								name: 'media-type'
							})
						})
					}
				})
			}
		}
	}
</script>