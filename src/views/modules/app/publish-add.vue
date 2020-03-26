<template>
	<div class="mod-config">
		<el-card>
			<el-steps :active="active" align-center  class="margin-bottom-20">
				<el-step title="第一步" description="填写基本信息"></el-step>
				<el-step title="第二步" description="应用授权"></el-step>
			</el-steps>
			<el-row :gutter="0">
				<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
					<div v-show="firstStep">
						<el-form-item label="应用" prop="applicationId">
							<el-select v-model="dataForm.applicationId" placeholder="请选择应用" :disabled=disabled @change="appChange">
								<el-option v-for="item in applicationList" :key="item.applicationId" :label="item.applicationName" :value="item.applicationId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="终端" prop="type">
							<el-radio-group v-model="dataForm.type" size="small" @change="appTypeChange" :disabled=disabled>
								<template v-for="item in appTypeList">
									<el-radio v-if="item.disabled" :title="'此应用已经发布，不可重新发布'" :key="item.value" :label="item.value" :value="item.value" border :disabled="item.disabled">
										{{item.dictName}}
									</el-radio>
									<el-radio v-else :key="item.value" :label="item.value" :value="item.value" border :disabled="item.disabled">
										{{item.dictName}}
									</el-radio>
								</template>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="简称" prop="forShort">
							<el-col :span="8">
								<el-input v-model="dataForm.forShort" placeholder="请输入简称" :disabled="disabled"></el-input>
							</el-col>
						</el-form-item>
						<el-form-item label="应用分类" prop="applicationSort">
							<el-radio-group v-model="dataForm.applicationSort" size="small" :disabled="disabled">
								<el-radio v-for="item in appSortList" :key="item.value" :label="item.value" :value="item.value" border>{{item.dictName}}</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item v-if="dataForm.type == 1" label="链接" prop="url">
							<el-col :span="8">
								<el-input v-model="dataForm.url" placeholder="请输入链接"></el-input>
								<div style="color: #606266;" class="el-upload__tip">注： 输入链接后，点击应用直接打开链接页面。</div>
							</el-col>
						</el-form-item>
						
						<el-form-item class="upload-app" v-show="dataForm.type == 3" label=""  prop="wechatUrl" :rules="[{ validator: checkWechatUrl, trigger: 'change' }]">
							<upload-file ref="uploadWechat" :uploadPng=true :limit=1 :fileExt="fileExtWechat" uploadUrl="picUpload" @refreshDataList="getPicWechat"></upload-file>
						</el-form-item>

						<el-form-item v-if="dataForm.type == 3" label="appid" prop="appid">
							<el-col :span="8">
								<el-input v-model="dataForm.appid" placeholder="请输入appid"></el-input>
							</el-col>
						</el-form-item>
						<el-form-item v-if="dataForm.type == 3" label="appsecret" prop="appsecret">
							<el-col :span="8">
								<el-input v-model="dataForm.appsecret" placeholder="请输入appsecret"></el-input>
							</el-col>
						</el-form-item>


						<el-form-item v-show="dataForm.type == 2"  label="安装包" prop="url" :rules="[{ validator: checkApkUrl, trigger: 'change' }]">
                            
							<!-- <upload-file label="" ref="uploadClient" :limit=1 :fileSize=500 :fileExt="fileExtApp" @refreshDataList="getAppFile"></upload-file> -->
                            <div class="all-upload">
                                <label class="upload-label-flex">全部更新</label>
                                <el-upload class="all-upload-flex-input" :action="apiUrl+'sys/oss/upload'" :before-upload="deforeUpload" :on-remove="handleRemoveAll" :multiple="false" :limit="2"
                                    :on-success="handleFileSuccessAll" :file-list="fileListAll" accept="application/vnd.android.package-archive,application/octet-stream,application/x-zip-compressed">
                                    <el-button size="small" type="primary">点击上传</el-button>
                                </el-upload>
                            </div>
                            <div class="increment-upload">
                                <label class="upload-label-flex">增量更新</label>
                                <el-upload class="increment-upload-flex-input" :action="apiUrl+'sys/oss/upload'" :before-upload="deforeUpload" :on-remove="handleRemove" :multiple="false" :limit="2"
                                    :on-success="handleFileSuccess" :file-list="fileListIncrem" accept="application/vnd.android.package-archive,application/octet-stream,application/x-zip-compressed">
                                    <el-button size="small" type="primary">点击上传</el-button>
                                </el-upload>
                            </div>
                            <div class="upload-tip-byone">温馨提示：支持.exe,.zip,.apk格式</div>
						</el-form-item>


						<el-form-item v-if="dataForm.type == 2" label="版本号" prop="vision">
							<el-col :span="8">
								<el-input v-model="dataForm.version" placeholder="请输入版本号"></el-input>
							</el-col>
						</el-form-item>
						<!--<el-form-item v-if="dataForm.type == 2" label="发布时间" prop="publishDate">
						<el-date-picker v-model="dataForm.publishDate" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
						</el-date-picker>
					</el-form-item>-->
						<!--<el-form-item v-if="dataForm.type == 2" label="版本号" prop="vision">-->
						<!--<el-form-item>-->
						<div style="position: relative;">
							<el-button type="success" size="small" @click="exportFile" style="position: absolute;left:200px;top:2px;z-index: 999;">下载模板</el-button>
							<!--</el-form-item>-->
							<upload-file label="菜单文件" ref="uploadMenuFile" :fileRequired=false :limit=1 :fileExt="fileExtMenu" @refreshDataList="getMenuFile"></upload-file>
							<div style="position: absolute;left:100px;top:68px;z-index: 999;color: #606266;" class="el-upload__tip">注： 上传菜单后，点击菜单可打开对应页面。</div>
							</br>
						</div>
						
						<upload-file label="菜单图标" ref="uploadMenuPics" :fileRequired=false :limit=100 :fileExt="fileExtIcon" uploadUrl="picUpload" @refreshDataList="getMenuIcon"></upload-file>
						<upload-file label="应用截图" ref="uploadScreenPics" :fileRequired=false :limit=5 :fileExt="fileExtPics" uploadUrl="picUpload" @refreshDataList="getAppPics"></upload-file>
							
					</div>
					<div v-show="secondStep">
						<el-form-item label="角色" prop="roleIdList" v-if="isMenuListShow" style="border-bottom: 1px solid #EBEEF5;">
							<!--<el-checkbox-group v-model="roleIdList" size="small">
							<el-checkbox v-for="item in roleTypeList" :key="item.roleId" :label="item.roleId" :value="item.roleId" border>{{item.roleName}}</el-checkbox>
						</el-checkbox-group>-->

						<el-radio-group v-model="roleId" size="small" @change="roleChange">
							<el-radio v-for="(item,index) in roleTypeList" :key="item.roleId" class="margin-bottom-10" :label="index" :value="item.roleId" border>
								<!--{{item.roleName}}-->
								<el-badge :value="item.menuListLen" class="item" >{{item.roleName}}&nbsp;&nbsp;&nbsp;</el-badge>
							</el-radio>
						</el-radio-group>
					</el-form-item>
					
					
					<el-form-item label="功能" prop="targetUser" v-if="isMenuListShow">
						<el-tree style="margin-top: 5px;" check-strictly :data="dataMenuList" :default-checked-keys="defaultKeys" v-model="dataForm.menuList" @check-change="selectClassfy" ref="tree" 
							show-checkbox node-key="menuId" highlight-current :props="defaultProps" :filter-node-method="filterNode"></el-tree>
					</el-form-item>
					
					<el-form-item label="角色" prop="roleIdsList" v-if="!isMenuListShow">
						<el-checkbox-group v-model="roleIdsList" size="small">
							<el-checkbox v-for="item in roleTypeList" :key="item.roleId" :label="item.roleId" :value="item.roleId" border>{{item.roleName}}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item>
						<!--<el-button type="primary" @click="dataFormSubmit">提交</el-button>-->
						<!--<el-button @click="$router.push({name:'app-manage'})">取消</el-button>-->
					</el-form-item>
				</div>

			</el-form>

				<el-button style="margin-top: 12px;" @click="back" v-if="active != 1">上一步</el-button>
				<el-button class="right" style="margin: 15px 0px;" @click="next" v-if="active == 1">下一步</el-button>
				<el-button type="primary" class="right" style="margin: 15px 0px;" @click="dataFormSubmit" v-if="active == 2">发布</el-button>
			</el-row>
		</el-card>
	</div>
</template>
<style>
	.el-radio.is-bordered+.el-radio.is-bordered{
		margin-left: 0px !important;
	}
	.upload-app .el-form-item__content{
		margin-left: 0px !important;
	}
	.upload-app .el-form-item__error{
		margin-left: 100px !important;
	}
	.el-upload-list__item:hover .el-icon-close {
	    display: none !important;
	}
	.el-upload-list__item:hover .el-upload-list__item-status-label{
		display: inline-block !important;
	}
</style>
<script>
	import { getCommHttpData, getCommonDictByType, deleteData, getExportFile } from '@/utils/common'
	import UploadFile from '../common/upload-file'
	export default {
		data() {
			return {
				appSortList:[],
                apiUrl: window.SITE_CONFIG.baseUrlMedia,
				fileExtWechat: ['.PNG', '.JPG', '.JPEG'],
				fileExtApp: ['.EXE', '.ZIP', '.APK'],
				fileExtMenu: ['.XML'],
				fileExtIcon: ['.PNG', '.JPG', '.GIF', '.JPEG', '.BMP'],
				fileExtPics: ['.PNG', '.JPG', '.GIF', '.JPEG', '.BMP'],
				active: 1,
				firstStep: true,
				secondStep: false,
				deviceId: undefined,
				disabled:false,
				picList: [],
				appTypeList: [],
				applicationList: [],
				canTryList: [],
				roleTypeList: [],
				roleIdsList:[],
				dataForm: {
					applicationId: '',
					forShort: '',
					type: '',
                    url: '',
                    urlSingle : '',
					version: '',
					menuFile: '',
					menuIcon: [],
					screenshot: '',
					publishDate: '',
					list: '',
					menuJson: '',
					appid:'',
					appsecret:'',
					applicationSort:''
				},
				//	roleIdList:[],
				roleIdAllList: [],
				roleId: '',
				menuRoleList:[],
				imgType: {
					type: '.png'
				},
				dataRule: {
					applicationId: [{
						required: true,
						message: '名称不能为空',
						trigger: 'change'
					}],
					icon: [{
						required: true,
						message: '图标不能为空',
						trigger: 'blur'
					}],
					forShort: [{
						required: true,
						message: '简称不能为空',
						trigger: 'blur'
					}, {
						max: 10,
						message: '名称不能大于10个字符'
					}],
					type: [{
						required: true,
						message: '呈现方式不能为空',
						trigger: 'change'
					}],
					wechatUrl: [{
						required: true,
						message: '小程序码不能为空',
						trigger: 'change'
					}],
					apkUrl: [{
						required: true,
						message: '安装包不能为空',
						trigger: 'change'
					}],
					version: [{
						max: 20,
						message: '应用简介不能大于20个字符'
					}],
					url: [{
						required: false,
						message: '链接不能为空',
						trigger: 'blur'
					}, {
						max: 500,
						message: '链接不能大于500个字符'
					}],
					publishDate: [{
						required: true,
						message: '发布时间不能为空',
						trigger: 'change'
					}],
					appid:[{
						required: true,
						message: 'appid不能为空',
						trigger: 'blur'
					}, {
						max: 32,
						message: '链接不能大于32个字符'
					}],
					appsecret:[{
						required: true,
						message: 'appsecret不能为空',
						trigger: 'blur'
					}, {
						max: 32,
						message: '链接不能大于32个字符'
					}],
					applicationSort:[{
						required: true,
						message: '应用分类不能为空',
						trigger: 'change'
					}],
//					roleIdsList: [{
//						required: true,
//						message: '角色不能为空',
//						trigger: 'change'
//					}]
				},
				durableYearsList: [],
				brandIdList: [],
                fileListAll: [],
                fileListIncrem : [],
				applicationTags: [],
				inputVisible: false,
				inputValue: '',
				dataMenuList: [],
				defaultProps: {
					children: 'children',
					label: 'menuName',
				},
				isMenuListShow:false,
				defaultKeys:[]
			}
		},
		components: {
			UploadFile
		},
		mounted() {
			var that = this
			getCommonDictByType(this, 'app_type', 'appTypeList')
			getCommonDictByType(this, 'application_sort', 'appSortList')
			this.$nextTick(()=>{
				this.$refs['dataForm'].clearValidate()
			})
			getCommHttpData({
				url: 'uc/role/selectMrole',
				method: 'get',
				contentType: 1,
				data: {}
			}, function(data) {
				if(data && data.code === 0) {
					that.roleTypeList = data.list
					for(let i in that.roleTypeList) {
						that.roleIdAllList.push({
							roleId: that.roleTypeList[i].roleId,
							menuList: []
						})
					}
				} else {
					that.roleTypeList = []
				}
			})
			//this.dataForm.type=1
			//getCommonDictByType(this, 'application_type ', 'applicationList')

			let keywords = this.keywords == '' ? undefined : this.keywords
			getCommHttpData({
				url: 'application/list',
				method: 'post',
				contentType: 2,
				data: {}
			}, function(data) {
				if(data && data.code === 0) {
					that.applicationList = data.list
					//发布应用快捷方式
					if(that.$route.query.applicationId  != undefined){
						that.dataForm.applicationId = that.$route.query.applicationId
						that.appChange()
					}
					
					
				} else {
					that.applicationList = []
				}
				that.dataListLoading = false
			})
			getCommonDictByType(this, 'trial_time', 'canTryList')

			this.init()

		},
		methods: {
            deforeUpload(file) {
                const fileExtStr = file.name.substring(file.name.lastIndexOf("."), file.name.length).toUpperCase();
                let arr = ['.EXE', '.APK', '.ZIP'], flag = true
                let _set = new Set(arr)
                if (!_set.has(fileExtStr)) {
                    flag = false
                    this.$message.error('上传文件格式不对！')
                }
                return flag
            },
            handleFileSuccessAll(response, file, fileList) {
                if (response.code == 0) {
                    this.dataForm.url = response.url
                    this.fileListAll = [file]
                }
            },
            handleFileSuccess(response, file, fileList) {
                if (response.code == 0) {
                    this.dataForm.urlSingle = response.url
                    this.fileListIncrem = [file]
                }
            },
            handleRemoveAll() {
                this.fileListAll = []
                this.dataForm.url = ''
            },
            handleRemove() {
                this.fileListIncrem = []
                this.dataForm.urlSingle = ''
            },
			checkWechatUrl(rule, value, callback){
				var that = this
				if (this.dataForm.type == 3 && this.dataForm.url == '') {
		          callback(new Error('小程序码不能为空'))
		        } else {
		          callback()
		        }
			},
			checkApkUrl(rule, value, callback){
				var that = this
				if (this.dataForm.type == 2 &&  this.dataForm.url == '') {
		          callback(new Error('安装包不能为空'))
		        } else {
		          callback()
		        }
			},
			appChange(val){
				let tempApp = this.applicationList.find(item=>{
					return item.applicationId == val
				})
				this.dataForm.forShort = tempApp.applicationName
				this.$refs['dataForm'].clearValidate()
				
				
			},
			init() {
				if(this.$route.query.id != undefined) {
					this.dataForm = this.$route.params
					this.opType = this.$route.query.type
					let that = this
					this.disabled = true
					getCommHttpData({
						url: 'application/product/info',
						method: 'post',
						contentType: 1,
						data: {
							productId: this.$route.query.id,
						}
					}, function(data) {
                        that.dataForm = data.product
                        
                        data.product.url && (that.fileListAll = [{ name : data.product.url }])
                        data.product.urlSingle && (that.fileListIncrem = [ { name : data.product.urlSingle } ])
						
						that.roleIdsList =  data.product.roleIdList == null?[]:data.product.roleIdList
						
						//that.$refs.uploadpic.picList = []
						if(data.product.type == 1) {
							//B/S

						} else if(data.product.type == 2) {
							//C/S
							// that.$nextTick(()=>{
							// 	that.$refs.uploadClient.picList = [{
							// 		name: data.product.url,
							// 		url: window.SITE_CONFIG.baseUrlMedia + data.product.url
							// 	}]
							// })
						} else {
							//小程序
							that.$refs.uploadWechat.imageUrl = data.product.url
						}
						if(data.product.menuFile != ''){
							that.$refs.uploadMenuFile.picList = [{
								name: data.product.menuFile,
								url: window.SITE_CONFIG.baseUrlMedia + data.product.menuFile
							}]
						}
						if(data.product.menuIcon != '' && data.product.menuIcon != null){
//							that.$refs.uploadMenuPics.picList = [{
//								name: data.product.menuIcon,
//								url: window.SITE_CONFIG.imgIP + data.product.menuIcon
//							}]
							let menuIconArr = new Array()
							let menuIconStr=''
							if(data.product.menuIcon.toString().indexOf(',') >-1){
								menuIconStr = data.product.menuIcon.split(',')
							}else{
								menuIconStr = [data.product.menuIcon]
							}
							for(let i in menuIconStr){
								menuIconArr.push({
									name: menuIconStr[i],
									url: window.SITE_CONFIG.imgIP + menuIconStr[i]
								})
							}
							that.dataForm.menuIcon = menuIconArr
							that.$refs.uploadMenuPics.picList = menuIconArr
						}
						if(data.product.screenshot != ''){
							let screenArr = new Array()
							let screenshot=''
							if(data.product.screenshot.toString().indexOf(',') >-1){
								screenshot = data.product.screenshot.split(',')
							}else{
								screenshot = [data.product.screenshot]
							}
							for(let i in screenshot){
								screenArr.push({
									name: screenshot[i],
									url: window.SITE_CONFIG.imgIP + screenshot[i]
								})
							}
							that.$refs.uploadScreenPics.picList = screenArr
//							that.$refs.uploadScreenPics.picList = [{
//								name: data.product.screenshot,
//								url: window.SITE_CONFIG.imgIP + data.product.screenshot
//							}]
						}
						
						
					})
				} else {
					this.disabled = false
					this.dataForm = {
						applicationId: '',
						forShort: '',
						type: '',
						url: '',
						version: '',
						menuFile: '',
						menuIcon: [],
						screenshot: '',
						publishDate: '',
						list: '',
						menuJson: '',
						appid:'',
						appsecret:''
					}
				}
			},
			back() {
				this.active = 1
				this.firstStep = true
				this.secondStep = false
			},
			next() {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
//						if(this.dataForm.menuFile == '') {
//							this.$message.error('请上传菜单文件')
//							return
//						}
						this.firstStep = false
						this.secondStep = true
						this.active = 2
						
						if(this.dataForm.menuFile != '') {
							this.getMenuByFile()
							//显示菜单
							this.isMenuListShow = true
						}else{
							//不显示菜单
							this.isMenuListShow = false
						}

					}
				})

			},

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
			getPicWechat(fileUrl) {
				this.dataForm.url = fileUrl
			},
			getAppFile(fileUrl) {
				this.dataForm.url = fileUrl
			},
			getMenuFile(fileUrl) {
				
				this.dataForm.menuFile = fileUrl
			},
			getMenuIcon(fileUrl) {
				this.dataForm.menuIcon = fileUrl
			},
			getAppPics(fileUrl) {
				let list = []
				for(let i in fileUrl){
					list.push(fileUrl[i].url)
				}
				this.dataForm.screenshot = list.toString()
			},

			getMenuByFile() {
				var that = this
				let operation = this.dataForm.productId== undefined ? 'add':'update'
				getCommHttpData({
					url: 'application/parseMenuFile',
					method: 'post',
					contentType: 1,
					data: {
						productId:this.dataForm.productId,
						menuFileUrl: this.dataForm.menuFile,
						operation:operation
					}
				}, function(data) {
					if(data && data.code === 0) {
						that.dataMenuList = JSON.parse(data.productMenuList)

						that.dataMenuList.menu.splice(that.dataMenuList.menu.findIndex(v => v.index === that.dataMenuList.menu.length - 1), 1);
						that.dataMenuList = that.dataMenuList.menu

						that.menuRoleList = data.menuRoleList
						if(data.menuRoleList != undefined){
							if(that.menuRoleList.length > 0) {
								for(let i in that.roleIdAllList) {
									for(let j = 0; j <= that.menuRoleList.length-1; j++) {
										if(parseInt(that.roleIdAllList[i].roleId) == that.menuRoleList[j].roleId) {
											that.roleIdAllList[i]['menuList'] = that.menuRoleList[j].menuList
											that.roleTypeList[i]['menuListLen'] = that.menuRoleList[j].menuList.length
										}
									}
								}
							}
						}
					} else {
						that.dataMenuList = []
					}
					that.dataListLoading = false
				})
			},
			dataFormSubmit() {
				//提交
				//				let isFree = this.dataForm.isFree
				//				isFree = isFree ? 1 : 0
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						var that = this
						let roleIdList = []
						let menuJson = ''
						if(!this.isMenuListShow){
							roleIdList = this.roleIdsList
							menuJson = ''
						}else{
							roleIdList = undefined
							menuJson = JSON.stringify(this.dataMenuList)
						}
						let publishDate =  this.dataForm.publishDate==''?undefined:this.dataForm.publishDate
						getCommHttpData({
							url: `application/product/${this.$route.query.id== undefined ? 'save' : 'update'}`,
							method: 'post',
							contentType: 2,
							operateType: 2,
							that: this,
							data: {
								productId: this.$route.query.id,
								applicationId: this.dataForm.applicationId,
								forShort: this.dataForm.forShort,
								applicationSort:this.dataForm.applicationSort,
								type: this.dataForm.type,
                                url: this.dataForm.url,
                                urlSingle : this.dataForm.urlSingle,
								version: this.dataForm.version,
								menuFile: this.dataForm.menuFile,
								menuIcon: this.dataForm.menuIcon,
								screenshot: this.dataForm.screenshot,
								publishDate: publishDate,
								menuJson: menuJson,
								list: this.roleIdAllList,
								roleIdList: roleIdList,
								appid:this.dataForm.appid,
								appsecret:this.dataForm.appsecret
							}
						}, function(data) {
							that.$router.push({
								name: 'app-publish'
							})
						})
					}
				})
			},
			selectClassfy(data, node) {
				let deptTemp = this.$refs.tree.getCheckedNodes()
				let deptTempHalf = this.$refs.tree.getHalfCheckedNodes()
				let tempMenu = new Array()
				for(let i in deptTemp) {
					tempMenu.push(deptTemp[i].menuId)
				}
				for(let j in deptTempHalf) {
					tempMenu.push(deptTempHalf[j].menuId)
				}
				this.roleTypeList[this.roleId]['menuListLen'] = tempMenu.length
				this.roleIdAllList[this.roleId]['menuList'] = tempMenu
			},
			changeSelectTree() {
				this.isShowSelect = true;
			},
			// 选择器的树节点
			filterNode(value, data) {
				if(!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			appTypeChange(val) {
                this.dataForm.url = ''
                this.dataForm.urlSingle = ''
                this.fileListAll = []
                this.fileListIncrem = []
				this.$refs['uploadWechat'].imageUrl = ''
				this.$refs['uploadClient'].picList = []
				this.$refs['dataForm'].clearValidate()
			},
			//下载文件
			exportFile() {
				var that = this
				
				let getstr='?filePath=menuDemo.XML&fileName=菜单文件模板'
				window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia+'sys/oss/downloadFile'+getstr));
			},
			roleChange(){
				//切换角色显示不同的功能
				this.$refs.tree.setCheckedKeys([])
				for(let i in this.roleIdAllList) {
					let menuList = [];
					if(this.roleIdAllList[i].roleId == this.roleTypeList[this.roleId].roleId) {
						menuList = this.roleIdAllList[i].menuList
						this.$refs.tree.setCheckedKeys(menuList)
					}
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.increment-upload,.all-upload{
    display: flex;
    line-height: 40px;
}
.upload-label-flex{
    margin-right: 10px;
}
.upload-tip-byone{
    font-size: 12px;
    color: #606266;
}
.all-upload-flex-input,.increment-upload-flex-input{
    display: flex;
    /deep/ .el-upload-list.el-upload-list--text{
        margin-left: 10px;
    }
}
</style>
