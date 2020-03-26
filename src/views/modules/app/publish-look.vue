<template>
	<div class="mod-config">
		<el-card>
			<!--<el-steps :active="active" align-center>
				<el-step title="第一步" description="填写基本信息"></el-step>
				<el-step title="第二步" description="应用授权"></el-step>
			</el-steps>-->
			<el-row :gutter="0">
			<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
				<div v-show="firstStep">
					<el-form-item label="应用" prop="applicationId">
						<el-select v-model="dataForm.applicationId" placeholder="请选择应用" disabled>
							<el-option v-for="item in applicationList" :key="item.applicationId" :label="item.applicationName" :value="item.applicationId"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="简称" prop="forShort">
						<el-col :span="8">
						<el-input v-model="dataForm.forShort" placeholder="请输入简称" disabled></el-input>
						</el-col>
					</el-form-item>
					<el-form-item label="呈现方式" prop="type">
						<el-radio-group v-model="dataForm.type" size="small" disabled>
							<el-radio v-for="item in appTypeList" :key="item.value" :label="item.value" :value="item.value" border>{{item.dictName}}</el-radio>
						</el-radio-group>
					</el-form-item>

					<el-form-item v-if="dataForm.type == 1" label="链接" prop="url">
						<el-col :span="8">
						<el-input v-model="dataForm.url" placeholder="请输入链接" disabled></el-input>
						</el-col>
					</el-form-item>
					<upload-file v-show="dataForm.type == 3" label="小程序码" ref="uploadWechat" :uploadPng=true :limit=1 :fileExt="fileExtWechat" uploadUrl="picUpload"></upload-file>
					<el-form-item v-if="dataForm.type == 3" label="appid" prop="appid">
						<el-col :span="8">
						<el-input v-model="dataForm.appid" placeholder="请输入appid" disabled></el-input>
						</el-col>
					</el-form-item>
					<el-form-item v-if="dataForm.type == 3" label="appsecret" prop="appsecret">
						<el-col :span="8">
						<el-input v-model="dataForm.appsecret" placeholder="请输入appsecret" disabled></el-input>
						</el-col>
					</el-form-item>
					<!-- <upload-file v-show="dataForm.type == 2" label="安装包" ref="uploadClient" :limit=1 :fileExt="fileExtApp" @refreshDataList="getAppFile"></upload-file> -->
                    <el-form-item v-if="dataForm.type == 2" label="安装包">
                        <div class="installation-package">
                            <label>全部更新：</label>
                            <span>{{dataForm.url}}</span>
                        </div>
                        <div class="installation-package">
                            <label>增量更新：</label>
                            <span>{{urlSingle}}</span>
                        </div>
                    </el-form-item>
					<el-form-item v-if="dataForm.type == 2" label="版本号" prop="vision">
						<el-col :span="8">
						<el-input v-model="dataForm.version" placeholder="请输入版本号" disabled></el-input>
						</el-col>
					</el-form-item>
					<el-form-item v-if="dataForm.type == 2" label="发布时间" prop="publishDate">
						
						<el-date-picker v-model="dataForm.publishDate" type="datetime" placeholder="选择日期时间" disabled>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="角色" prop="roleIdsList" v-if="roleIdsList.length !=0">
						<el-checkbox-group v-model="roleIdsList" size="small" disabled>
							<el-checkbox v-for="item in roleTypeList" :key="item.roleId" :label="item.roleId" :value="item.roleId" border>{{item.roleName}}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="角色" prop="roleIdList"  v-if="roleIdsList.length ==0">
						<el-radio-group v-model="roleId" size="small" @change="roleChange">
							
  								<!--<el-button size="small">评论</el-button>-->
							<el-radio-button v-for="(item,index) in roleTypeList" :key="item.roleId" :label="index" :value="item.roleId" border>
								<el-badge :value="item.menuListLen" class="item">{{item.roleName}}&nbsp;&nbsp;&nbsp;</el-badge>
							</el-radio-button>
							
						</el-radio-group>
					</el-form-item>
					<el-form-item label=""  v-if="roleIdsList.length ==0">
						<el-button type="success" size="small" @click="exportFile" style="">下载菜单文件</el-button>
					</el-form-item>
					<el-form-item v-if="roleIdsList.length ==0">
						<el-tree :data="dataMenuList" :default-checked-keys="defaultKeys" disabled  v-model="dataForm.menuList" ref="tree" show-checkbox node-key="menuId" highlight-current :props="defaultProps"></el-tree>
					</el-form-item>
					<el-form-item label="应用截图" >
						<div v-if="screenshotList.length == 0">暂无应用截图</div>
						<img v-else v-for="item in screenshotList" :src="imgUrl+item" style="margin-right: 10px;max-width:200px;"  />
					</el-form-item>
					
				</div>
			</el-form>
			</el-row>
			<!--<el-button style="margin-top: 12px;" @click="back">返回</el-button>-->
			<!--<el-button class="right" style="margin: 15px 0px;" @click="next" v-if="active == 1">下一步</el-button>
			<el-button type="primary" class="right" style="margin: 15px 0px;" @click="dataFormSubmit" v-if="active == 2">发布</el-button>-->
		</el-card>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, deleteData, getExportFile } from '@/utils/common'
	import UploadFile from '../common/upload-file'
	export default {
		data() {
			return {
				imgUrl: window.SITE_CONFIG.imgIP,
				screenshotList:[],
				fileExtWechat: ['.PNG', '.JPG', '.JPEG', ],
				fileExtApp: ['.EXE', '.ZIP'],
				fileExtMenu: ['.XML'],
				fileExtIcon: ['.PNG', '.JPG', '.GIF', '.JPEG', '.BMP'],
				fileExtPics: ['.PNG', '.JPG', '.GIF', '.JPEG', '.BMP'],
				active: 1,
				firstStep: true,
				secondStep: false,
				deviceId: undefined,
				picList: [],
				appTypeList: [],
				applicationList: [],
				canTryList: [],
				roleTypeList: [],
				roleIdsList:[],
				menuRoleList:[],
				dataForm: {
					applicationId: '',
					forShort: '',
					type: '',
                    url: '',
                    urlSingle : '',
					version: '',
					menuFile: '',
					menuIcon: '',
					screenshot: '',
					publishDate: '',
					list: '',
					menuJson: '',
					appid:'',
					appsecret:''
				},
				//	roleIdList:[],
				roleIdAllList: [],
				roleId: '',
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
					version: [{
						max: 20,
						message: '应用简介不能大于20个字符'
					}],
					url: [{
						required: true,
						message: '链接不能为空',
						trigger: 'blur'
					}, {
						max: 100,
						message: '链接不能大于100个字符'
					}],
					publishDate: [{
						required: true,
						message: '发布时间不能为空',
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
				fileList: [],
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
			let keywords = this.keywords == '' ? undefined : this.keywords
			getCommHttpData({
				url: 'application/list',
				method: 'post',
				contentType: 2,
				data: {}
			}, function(data) {
				if(data && data.code === 0) {
					that.applicationList = data.list
				} else {
					that.applicationList = []
				}
				that.dataListLoading = false
			})
			getCommonDictByType(this, 'trial_time', 'canTryList')

			this.init()

		},
		methods: {
			init() {
				if(this.$route.query.id != undefined) {
					this.dataForm = this.$route.params
					this.opType = this.$route.query.type
					let that = this
					getCommHttpData({
						url: 'application/product/info',
						method: 'post',
						contentType: 1,
						data: {
							productId: this.$route.query.id,
						}
					}, function(data) {
						
						
						that.dataForm = data.product
						that.menuRoleList =  data.product.menuRoleList
						//that.$refs.uploadpic.picList = []
						if(data.product.type == 1) {
							//B/S

						} else if(data.product.type == 2) {
							//C/S
							that.$refs.uploadClient.picList = [{
								name: data.product.url,
								url: window.SITE_CONFIG.baseUrlMedia + data.product.url
							}]
						} else {
							//小程序
							that.$refs.uploadWechat.imageUrl = data.product.url
						}
						if(data.product.screenshot != ''){
							let screenshotList = data.product.screenshot
							if(screenshotList.indexOf(',') >-1){
								that.screenshotList = screenshotList.split(',')
							}else{
								that.screenshotList = [screenshotList]
							}
						}
						if(data.product.roleIdList.length ==0){
							that.getMenuByFile() 
						}else{
							that.roleIdsList = data.product.roleIdList
						}
						for(let j in that.roleTypeList){
							for(let i in that.menuRoleList){
								if(that.menuRoleList[i].roleId == that.roleTypeList[j].roleId){
									that.roleTypeList[j]['menuListLen'] = that.menuRoleList[i].menuList.length
								}
							}
						}
					})
				} else {
					this.dataForm = {
						applicationId: '',
						forShort: '',
						type: '',
						url: '',
						version: '',
						menuFile: '',
						menuIcon: '',
						screenshot: '',
						publishDate: '',
						list: '',
						menuJson: '',
						appid:'',
						appsecret:''
					}
				}
			},
			getMenuByFile() {
				var that = this
				getCommHttpData({
					url: 'application/parseMenuFile',
					method: 'post',
					contentType: 1,
					data: {
						productId:this.dataForm.productId,
						menuFileUrl: this.dataForm.menuFile,
						operation:'update'
					}
				}, function(data) {
					if(data && data.code === 0) {
						that.dataMenuList = JSON.parse(data.productMenuList)
						
						that.dataMenuList.menu.splice(that.dataMenuList.menu.findIndex(v => v.index=== that.dataMenuList.menu.length-1),1);
						that.dataMenuList = that.dataMenuList.menu
						console.log(that.dataMenuList)
					} else {
						that.dataMenuList = []
					}
					that.dataListLoading = false
				})
			},

			roleChange(){
				//切换角色显示不同的功能
				this.$refs.tree.setCheckedKeys([])
//				for(let i in this.menuRoleList){
//					if(this.menuRoleList[i].roleId == this.roleTypeList[this.roleId].roleId){
//						this.defaultKeys = this.menuRoleList[i].menuList
//						this.$refs.tree.setCheckedKeys(this.menuRoleList[i].menuList)
//					}
//				}
				
				for(let i in this.menuRoleList) {
					var menuList = [];

					if(this.menuRoleList[i].roleId == this.roleTypeList[this.roleId].roleId) {
						//menuList = this.roleIdAllList[i].menuList
						if(this.menuRoleList[i].menuList.length>1){
							menuList = (this.menuRoleList[i].menuList).slice(0, -1)
						}else{
							menuList = this.menuRoleList[i].menuList
						}
						this.$refs.tree.setCheckedKeys(menuList)
					}
				}
			},
			//下载文件
			exportFile() {
				var that = this
				let getstr='?filePath='+this.dataForm.menuFile+'&fileName=菜单文件'
				window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia+'file/common/getMenuFile'+getstr));

			},
			getAppFile(fileUrl) {
				this.dataForm.url = fileUrl
			}
		}
	}
</script>
<style lang="scss" scoped>
.installation-package{
    color: #C0C4CC;
}
</style>
