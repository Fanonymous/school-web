<template>
	<div class="mod-config">
		<el-card>
			<el-form :inline="false" :model="dataForm" ref="dataForm">
				<el-form-item label="角色名称">
					{{roleName}}
				</el-form-item>
				<el-form-item label="分配权限">
					<el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
				</el-form-item>
				<!--<el-card>-->

				<el-form-item label="">
					<el-input placeholder="输入关键字进行过滤" v-model="filterText">
					</el-input>
				</el-form-item>
				<el-tree :data="dataList" v-model="dataForm.menuList" empty-text="暂无数据" ref="tree" show-checkbox node-key="menuId" highlight-current :props="defaultProps" :filter-node-method="filterNode"></el-tree>

				<el-collapse v-model="activeNames">
					<!--<template v-for="(ditem,index) in dataList">
						<el-collapse-item :name="index"  @change="handleChange">
							<template slot="title">
								<el-checkbox v-model="checked">{{ditem.name}}</el-checkbox>
							</template>
							<template v-for="menuItem in ditem.list">
								<el-checkbox-group v-model="menuItem.menuId">
									<el-checkbox :label="menuItem.name" :key="menuItem.menuId">{{menuItem.name}}</el-checkbox>
								</el-checkbox-group>
								<el-checkbox-group v-model="menuItem.list" v-if="menuItem.list.length > 0" >
									<template v-for="(sitem,index) in menuItem.list">
										<el-checkbox  :label="sitem.name" :key="sitem.menuId">{{sitem.name}}</el-checkbox>								
									</template>	
								</el-checkbox-group>
							</template>
						</el-collapse-item>
					</template>-->
				</el-collapse>
				<!--</el-card>-->
				<el-form-item style="margin-top:20px">
					<el-button type="primary" @click="dataFormSubmit">保存</el-button>
					<el-button @click="$router.push({name:'user-role'})">取消</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, deleteData, getExportFile } from '@/utils/common'
	import AddOrUpdate from './config-add-or-update'
	export default {
		data() {
			return {
				filterText: '',
				defaultProps: {
					children: 'children',
					label: 'menuName'
				},
				roleId:'',
				roleName:'',
				dataForm:{
					roleId:'',
					productList:[],
				},
				activeNames: [0],
				checked: true,
				checkAll: false,
				isIndeterminate: true,
				menuList: ['成绩管理', '添加', '编辑', '删除'],
				checkedMenu: ['成绩管理', '添加'],
				type: undefined,
				use: undefined,
				sTypeOptions: [],
				sUseOptions: [],
				typeRadios: [{
					dictName: '教育局',
					value: 1
				}, {
					dictName: '学校',
					value: 2
				}],
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				dataListSelections: [],

				sectionOptions: null,
				sTypeOptions: null,
				showReviewer: false,
				dialogFormVisible: false,
				dialogStatus: '',
				textMap: {
					update: '编辑',
					create: '添加',
					look: '查看'
				},
				dialogPvVisible: false,
				pvData: [],
				addLoading: false,
				rules: {
					//      classList: [{ required: true, message: '不能为空', trigger: 'blur' }],
					//      gradeId: [{ required: true, message: '不能为空', trigger: 'change' }]
				}
			}
		},
		mounted() {
			this.getRoleInfoById()
			this.getDataList()
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},
		methods: {
			filterNode(value, data) {
		        if (!value) return true;
		        return data.menuName.indexOf(value) !== -1;
		    },
			handleCheckAllChange(val) {
				//this.checkedMenu = val ? menuList : [];
				//this.isIndeterminate = false;
				//全选
				if(val){
					this.$refs.tree.setCheckedNodes(this.dataList)
				}else{
					this.$refs.tree.setCheckedKeys([]);
				}
				
			},
			// 根据角色ID查询详情
			getRoleInfoById() {
				var that = this
				getCommHttpData({
					url: 'uc/role/info',
					method: 'get',
					contentType: 1,
					data: {
						roleId: this.$route.query.id
					}
				}, function(data) {
					console.log(data,'datatattatatat')
					let list = data.list
					let tempArr = new Array()
					if(list.length > 0) {
						for(let i in data.list) {
							if(list[i].menuIds != undefined){
//								if(data.list[i].menuIds != ''){
									let tArr = list[i].menuIds.split(',')
									if(tArr.length > 1){
										tArr.forEach(item=>{
											tempArr.push(parseInt(item))
										})
									}else{
										tempArr.push(parseInt(tArr))
									}
//								}else{
//									tempArr.push(parseInt(tArr[j]))
//								}
								
								
							}else{
								tempArr.push(parseInt(list[i].productId))
							}
					}
						that.$refs.tree.setCheckedKeys(tempArr)
					}
				})
			},
			// 获取数据列表
			getDataList() {
				this.roleName = this.$route.query.roleName
				this.dataForm.roleId = this.$route.query.id
				var that = this
				getCommHttpData({
					url: 'uc/menu/nav',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					if(data && data.code === 0) {
						let tempArr = Array()
						let menuTemp = Array()
						for(let i in data.productMenuList) {
							menuTemp = []
							for(let j in data.productMenuList[i].menuList){
								let childArr = []
								if(data.productMenuList[i].menuList[j].parentId == 1){
									for(let m in data.productMenuList[i].menuList){
										if(data.productMenuList[i].menuList[m].parentId == data.productMenuList[i].menuList[j].menuId){
											childArr.push(data.productMenuList[i].menuList[m])
										}
										
									}
									menuTemp.push({
										parentId: data.productMenuList[i].menuList[j].parentId,
										menuId: data.productMenuList[i].menuList[j].menuId,
										productType: 1,
										productId: data.productMenuList[i].menuList[j].productId,
										menuName: data.productMenuList[i].menuList[j].menuName,
										children: childArr})
									
								}
								
							}
							let appTypeName = '' 
							if(data.productMenuList[i].appType == 2){
								appTypeName = ' —【客户端】'
							}else if(data.productMenuList[i].appType == 3){
								appTypeName = ' —【移动端】'
							}
							tempArr[i] = {
								menuId: data.productMenuList[i].productId,
								productType: 1,
								menuName: data.productMenuList[i].applicationName+appTypeName,
								children: menuTemp
							}
						}
						that.dataList = tempArr
					} else {
						that.dataList = []
						that.totalPage = 0
					}
				})
			},
			dataFormSubmit() {
				//半选择
				let menuHalfChecked = this.$refs.tree.getHalfCheckedNodes()
				let menuChecked = this.$refs.tree.getCheckedNodes()
				
//				let tempMenu = new Array()
//				for(let i in menuChecked) {
//					tempMenu.push(menuChecked[i].menuId)
//				}
//				for(let j in menuHalfChecked) {
//					tempMenu.push(menuHalfChecked[j].menuId)
//				}
				let menuArr = new Array()
				if( menuHalfChecked.length >0){
					for(let i in menuHalfChecked) {
						if(menuHalfChecked[i].productType == 1) {
							let menuArrTemp = new Array()
							for(let j in menuChecked) {
								if(menuHalfChecked[i].menuId == menuChecked[j].productId) {
									menuArrTemp.push(menuChecked[j].menuId)
								}
							}
							menuArr.push({
								productId: menuHalfChecked[i].menuId,
								list: menuArrTemp
							})
						}
					}
				}
				let productList = this.$refs.tree.getCheckedNodes()
				for(let i in productList) {
					if(productList[i].productType == 1) {
						let menuArrTemp = new Array()
						for(let j in productList) {
							if(productList[i].menuId == productList[j].productId) {
								menuArrTemp.push(productList[j].menuId)
							}
						}
						menuArr.push({
							productId: productList[i].menuId,
							list: menuArrTemp
						})
					}
				}
				this.dataForm.productList = menuArr
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						var that = this
						that.addLoading = true
						getCommHttpData({
							url: 'uc/role/warrant',
							method: 'post',
							serverType: 2,
							contentType: 2,
							operateType: 2,
							that: this,
							data: this.dataForm
						}, function(data) {
							that.$router.push({
								name: 'user-role'
							})
						})
					}
				})
			}
		}
	}
</script>