<template>
	<div class="mod-config">
	<el-card class="blue-shadow">
	<el-tabs v-model="activeName"  style="background: white;padding-left: 20px;padding-right: 20px;padding-bottom: 20px;" @tab-click="handleClick(-1)">
    	<el-tab-pane label="机构管理" name="first">
		
			<el-form :inline="true" @keyup.enter.native="getDataList()">
				<el-form-item>
					<el-select class="filter-item" multiple v-model="deptType" placeholder="请选择机构类型" clearable @change="getDataList">
						<el-option v-for="item in deptTypeListSearch" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select class="filter-item" v-model="enableType" placeholder="请选择是否启用" clearable @change="getDataList">
						<el-option v-for="item in enableTypeList" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="keywords" placeholder="请输入名称搜索" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleCreate()" :loading="false">添加机构</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="dataList" style="width: 100%;" row-key="deptId" border :expand-row-keys="expandRowKey" v-loading="dataListLoading"
			 :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
				<el-table-column min-width="200" prop="name" label="名称" header-align="center">
					<template slot-scope='scope'>
						<span>
							<span v-if="scope.row.deptType == 1" class="iconfont iconjigou"></span>
							<span v-else-if="scope.row.deptType == 2" class="iconfont iconjiaoyuju"></span>
							<span v-else-if="scope.row.deptType == 3" class="iconfont iconxuexiao"></span>
							<span v-else-if="scope.row.deptType == 4" class="iconfont iconbumen"></span>
							<span v-else-if="scope.row.deptType == 5" class="iconfont iconfuwu"></span>
							<span v-else class="iconfont iconbumen-moren"></span>
							<span>{{scope.row.name}}</span>
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="deptTypeName" width="200" header-align="center" align="center" label="机构类型">
					<template slot-scope="scope">
						<span v-if="domainType==4">
							{{scope.row.name == '北京惠众教育研究院' ? '研究院' : scope.row.deptTypeName}}
						</span>
						<span v-else>
							{{scope.row.deptTypeName}}
						</span>
					</template>
				</el-table-column>
				<el-table-column width="180" prop="childDeptNum" header-align="center" align="center" label="内设部门">
            <template slot-scope="scope">
              <el-button type="text"  size="small" @click="activeName='second',handleClick(scope.row.deptId)">{{scope.row.childDeptNum}}个</el-button>
            </template>
          </el-table-column>
        	<!-- <el-table-column width="180" prop="deptCode" header-align="center" align="center" label="机构编码"></el-table-column> -->
	
				
				<el-table-column width="150" prop="pic" header-align="center" align="center" label="负责人"></el-table-column>
				<el-table-column width="200" prop="phone" header-align="center" align="center" label="联系电话"></el-table-column>
				<el-table-column width="100" prop="orderNum" header-align="center" align="center" label="排序"></el-table-column>
				<el-table-column fixed="right" width="100" prop="enabled" header-align="center" align="center" label="是否启用">
					<template slot-scope="scope">
						<el-switch active-text="是" :width="50" inactive-text="否" v-model="scope.row.enabled" active-color="#13ce66"
						 :active-value="0" :inactive-value="1" @change="changeSatus(scope.row.deptId,scope.row.enabled)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
					<template slot-scope="scope">
						<el-button type="text" v-if="!scope.row.enabled" size="small" @click="handleCreate(scope.row.deptId,3,scope.row.name,scope.row.deptType)">添加下级</el-button>
						<el-button type="text" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
						<el-button type="text" size="small" class="btn-text-color-red" @click="deleteData({deptId:scope.row.deptId})">删除</el-button>
</template>
        	</el-table-column>
        </el-table>

      </el-tab-pane>
      <el-tab-pane label="部门管理" name="second">
        <el-form :inline="true" @keyup.enter.native="getDataList()">
        	<el-form-item v-clickoutsides:exactAreaClassName="closeTree">
        		<div>
        			<el-input placeholder="请选择机构" readonly class="dep-chose-input" :class="{'show-border-color-input' : isShowSelectSearch}"  auto-complete="off" v-model="deptNameSelect" @click.native="changeSelectTreeSearch()"></el-input>
        			<span :class="[{'show-border-color' : isShowSelectSearch}, inputIcon]" class="exactAreaClassName arrow-iconmy" @click="openTree"></span>
        		</div>
        		<div v-show="isShowSelectSearch" class="search-tree exactAreaClassName">
        			<el-input v-model="treeSearchValue" placeholder="请选择机构名称查询" clearable auto-complete="off" style="padding: 5px 10px;"></el-input>
        			<el-tree style="min-width: 200px;" :check-strictly="true" node-key="deptId" @node-click="nodeClickSearch" show-checkbox default-expand-all empty-text="暂无数据" :props="defaultProps" :highlight-current=true
        				:expand-on-click-node="true" :data="selfDeptListSearch" :filter-node-method="filterNode" @check-change="selectClassfySearch" class="width-tree selectTree-input" ref="selectTreeSearch">
        			</el-tree>
        		</div>
        	</el-form-item>
        	<el-form-item>
        		<el-select class="filter-item" v-model="enableType" placeholder="请选择是否启用" clearable @change="getDataList">
        			<el-option v-for="item in enableTypeList" :key="item.value" :label="item.dictName" :value="item.value">
        			</el-option>
        		</el-select>
        	</el-form-item>
        	<el-form-item>
        		<el-input v-model="keywords" placeholder="请输入名称搜索" clearable></el-input>
        	</el-form-item>
        	<el-form-item>
        		<el-button class="right" type="primary" @click="handleCreate(0,5,0)" :loading="false">添加部门</el-button>
        	</el-form-item>
        </el-form>
        <el-table :data="dataList" style="width: 100%;" row-key="deptId" border :expand-row-keys="expandRowKey" v-loading="dataListLoading"
         :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        	<el-table-column min-width="200" prop="name" label="名称" header-align="center">
        		<template slot-scope='scope'>
        			<span>
        				<span v-if="scope.row.deptType == 1" class="iconfont iconjigou"></span>
        				<span v-else-if="scope.row.deptType == 2" class="iconfont iconjiaoyuju"></span>
        				<span v-else-if="scope.row.deptType == 3" class="iconfont iconxuexiao"></span>
        				<span v-else-if="scope.row.deptType == 4" class="iconfont iconbumen"></span>
        				<span v-else-if="scope.row.deptType == 5" class="iconfont iconfuwu"></span>
        				<span v-else class="iconfont iconbumen-moren"></span>
        				<span>{{scope.row.name}}</span>
        			</span>
        		</template>
        	</el-table-column>
        	<!-- <el-table-column prop="deptTypeName" width="200" header-align="center" align="center" label="机构类型">
        		<template slot-scope="scope">
        			<span v-if="domainType==4">
        				{{scope.row.name == '北京惠众教育研究院' ? '研究院' : scope.row.deptTypeName}}
        			</span>
        			<span v-else>
        				{{scope.row.deptTypeName}}
        			</span>
        		</template>
        	</el-table-column> -->
        	<!-- <el-table-column width="180" prop="deptCode" header-align="center" align="center" label="机构编码"></el-table-column> -->
        	<el-table-column width="150" prop="pic" header-align="center" align="center" label="负责人"></el-table-column>
        	<el-table-column width="200" prop="phone" header-align="center" align="center" label="联系电话"></el-table-column>
        	<!-- <el-table-column width="100" prop="orderNum" header-align="center" align="center" label="排序"></el-table-column> -->
        	<el-table-column fixed="right" width="100" prop="enabled" header-align="center" align="center" label="是否启用">
        		<template slot-scope="scope">
        			<el-switch active-text="是" :width="50" inactive-text="否" v-model="scope.row.enabled" active-color="#13ce66"
        			 :active-value="0" :inactive-value="1" @change="changeSatus(scope.row.deptId,scope.row.enabled)">
        			</el-switch>
        		</template>
        	</el-table-column>
        	<el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
        		<template slot-scope="scope">
        			<el-button type="text" v-if="!scope.row.enabled" size="small" @click="handleCreate(scope.row.deptId,3,scope.row.name,scope.row.deptType)">添加下级</el-button>
        			<el-button type="text" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
        			<el-button type="text" size="small" class="btn-text-color-red" @click="deleteData({deptId:scope.row.deptId})">删除</el-button>
        		</template>
        	</el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
			<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
			 :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
		</el-card>
		<!-- 弹窗, 新增 / 修改 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="handClose">
			<el-form :rules="rules" ref="dataForm" :model="form" label-position="right" label-width="100px">
				<el-form-item label="上级机构" v-show="isParentDeptShow">
					<el-input v-model="form.parentName" placeholder="默认" disabled></el-input>
				</el-form-item>
				<el-form-item label="上级机构" v-show="isMoreDeptShow">
					<el-input placeholder="上级机构" class="width-tree selectTree-input" auto-complete="off" v-model="deptInput"
					 @click.native="changeSelectTree()">
					</el-input>
					<el-tree v-show="isShowSelect" style="min-width:200px" node-key="deptId" show-checkbox default-expand-all
					 check-strictly empty-text="暂无数据" :props="defaultProps" :highlight-current=true :expand-on-click-node="true" :data="selfDeptList"
					 :filter-node-method="filterNode" @check-change="selectClassfy" class="width-tree selectTree-input object-tree-select"
					 ref="selectTree">
					</el-tree>
				</el-form-item>
        <template v-if="activeName == 'first'" >
          <!--机构管理 -->
          <el-form-item label="名称" prop="name">
          	<el-input @click.native="closeSelectTree" v-model.trim="form.name" placeholder="请输入名称"></el-input>
          </el-form-item>

          <el-form-item label="机构类型" prop="deptType">
          	<el-radio-group v-model="form.deptType" size="small" @click.native="closeSelectTree">
          		<el-radio v-for="item in deptTypeList" :label="item.value" :key="item.value" :disabled="disabledUpdate">{{item.dictName}}</el-radio>
          	</el-radio-group>
          </el-form-item>
          <el-form-item label="地址" required :class="{'is-error':hasAddress}">
          	<area-cascader class="el-area-select" v-if="cityshow" type='text' :level='1' style="padding:0;margin-bottom: 10px;"
          	 :data="pcaa" v-model="form.province" placeholder="请选择地址"></area-cascader>
          	<mapDrag v-if="cityshow" ref="mapDrag" @changval="changeAddress" @change="handleChangeAddress" />
          	<div class="el-form-item__error" v-if="hasAddress">
          	  不能为空
          	</div>
          </el-form-item>
        </template>
				<template v-else >
          <!--部门管理 -->
          <el-form-item label="部门名称" prop="name">
          	<el-input @click.native="closeSelectTree" v-model.trim="form.name" placeholder="请输入部门名称"></el-input>
          </el-form-item>
        </template>
				<el-form-item label="负责人" prop="pic">
					<el-input v-model.trim="form.pic" placeholder="请输入负责人" @click.native="closeSelectTree"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="phone">
					<el-input v-model.trim="form.phone" placeholder="请输入联系电话" @click.native="closeSelectTree"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="orderNum">
					<el-input-number v-model="form.orderNum" :min="0" @click.native="closeSelectTree"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handClose">取消</el-button>
				<el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="addLoading">确定</el-button>
				<el-button v-else-if="dialogStatus=='update'" type="primary" @click="updateData" :loading="addLoading">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
			<el-table :data="pvData" border fit highlight-current-row style="width: 100%">
				<el-table-column prop="key" label="Channel">取消</el-table-column>
				<el-table-column prop="pv" label="Pv">确定</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogPvVisible = false"></el-button>
			</span>
		</el-dialog>
	</div>
</template>
<style>
	

</style>
<script>
	import {getCommHttpData,getCommonDictByType,deleteData,getDomainType} from '@/utils/common'
	import TableTreeColumn from '@/components/table-tree-column'
	import {treeDataTranslate} from '@/utils'
	import AddOrUpdate from './config-add-or-update'
	import {pca,pcaa} from 'area-data'; // v5 or higher
	import mapDrag from './mapDrag.vue'

	export default {
		components: {
			mapDrag
		},
		data() {
			return {
        orgId:this.GLOBAL.getOrgId(),
				hasAddress: false,
				restaurants:[],
				pca: pca,
				pcaa: pcaa,
				cityshow: true,
				domainType: getDomainType(),
				expandRowKey: [],
				deptTypeListSearch: [],
				deptTypeList: [],
				enableTypeList: [],
				deptType: [],
				enableType: '',
				keywords: undefined,
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				dataListSelections: [],
				deptInput: '',
				form: {
					parentId: 1,
          parentDeptType: 0,
					name: '',
					deptType: '',
					pic: '',
					orderNum: '',
					phone: '',
					address: '',
					longitude: '',
					latitude: '',
					province: []
				},
				sectionOptions: null,
				sTypeOptions: null,
				showReviewer: false,
				dialogFormVisible: false,
				dialogStatus: '',
				disabledUpdate: false,
				textMap: {
					update: '编辑',
					create: '添加',
					look: '查看'
				},
				dialogPvVisible: false,
				pvData: [],
				addLoading: false,
				rules: {
					name: [{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					}, {
						min: 1,
						max: 50,
						message: '机构名称的长度不能大于50个字符'
					}],
					deptType: [{
						required: true,
						message: '不能为空',
						trigger: 'change'
					}],
					pic: [{
						min: 1,
						max: 20,
						message: '负责人的长度不能大于20 个字符'
					}],
					orderNum: [{
						validator: this.checkInterNum,
						trigger: 'blur'
					}],
					phone: [{
						pattern: /^1(3|4|5|7|8)\d{9}$/,
						message: '请输入正确的手机号'
					}]
				},
				isParentDeptShow: false,
				isMoreDeptShow: true,
				selectDept: [],
				selfDeptList: null,
				isShowSelect: false,
				defaultProps: {
					children: 'children',
					label: 'name',
				},
        activeName:'first',

        deptNameSelect:'',
        deptIdSelect:'',
        isShowSelectSearch:false,
        selfDeptListSearch:[],
        treeSearchValue : '',
        inputIcon : 'el-icon-arrow-down',
        parentActive:0
			}
		},
		mounted() {
			let that = this
      this.getDeptListSearch()
			this.getDeptList(0)
			if (this.$route.query.deptType == undefined) {
				this.getDataList()
			}
			//getCommonDictByType(this, 'dept_type', 'deptTypeListSearch')
			getCommonDictByType(this, 'enable_type', 'enableTypeList', function() {
				getCommHttpData({
					url: 'uc/dept/getUserType',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					that.deptTypeListSearch = data.list
					let tempType = that.$route.query.deptType

					if (tempType != undefined) {
						that.deptType = parseInt(tempType)
						that.enableType = parseInt(that.$route.query.enableType)
						that.getDataList()
					} else {
						that.deptType = ''
					}
				})
			})


			
		},
		watch: {
      treeSearchValue(val) {
      	this.$refs.selectTreeSearch.filter(val);
      },
			form: {
				handler(form) {
					if (this.isShowSelect) {
						this.$refs.selectTree.filter(form.input1);
					}
				},
				deep: true, //深度监听，重要
			},
			deptInput(val) {
				this.$refs.selectTree && this.$refs.selectTree.filter(val);
			},
			keywords(val) {
				this.getDataList()
			}
		},
		methods: {
      handleClick(deptId){
        if(this.activeName=='first'){
        	this.parentActive = undefined
        }else if(this.activeName=='second'){
        	this.parentActive = deptId != -1 ? deptId : this.orgId == -1?0:this.orgId
          this.$nextTick(() => {
            this.$refs.selectTreeSearch.setCheckedKeys([this.parentActive])
          })
        }
        this.getDataList()
      },
			//地图传值
			handleChangeAddress(positionResult) {
				this.form.address = positionResult.title;
				this.form.longitude = positionResult.point.lng;
				this.form.latitude = positionResult.point.lat;
				this.hasAddress = false
			},
			//地址修改
			changeAddress(val) {
				if (val) {
					this.hasAddress = false
				} else {
					this.hasAddress = true
					this.form.address = null
					this.form.longitude = null
					this.form.latitude = null
				}
			},
			//获得机构类型
			getDeptList(type) {
				let that = this
				getCommHttpData({
					url: 'uc/dept/select',
					method: 'post',
					contentType: 2,
					data: {}
				}, function(data) {
          that.selfDeptList = data.deptList
          if(type != 10){
            that.selectDept.deptId = data.deptList[0].deptId;
            that.selectDept.deptType = data.deptList[0].deptType;
            that.deptInput = data.deptList[0].name;
            that.getDeptProvince(data.deptList[0].deptId)
          }
				})
			},
			getDeptType(deptId) {
				let that = this
				deptId = deptId != undefined ? deptId : this.selectDept.deptId
				getCommHttpData({
					url: 'uc/dept/getUserType',
					method: 'get',
					contentType: 1,
					data: {
						deptId: deptId
					}
				}, function(data) {
					that.deptTypeList = data.list
				})
			},
			checkInterNum(rule, value, callback) {
				if (value && value.toString().length > 9) {
					return callback(new Error('请输入1-9位数字'))
				} else {
					callback()
				}
			},
			//获取机构地址
			getDeptProvince(deptId){
				let that = this
				getCommHttpData({
					url: 'uc/dept/info',
					method: 'get',
					contentType: 1,
					data: {
						deptId: deptId,
					}
				}, function(data) {
					if (data && data.code === 0) {
						let deptPro = data.dept.province
							that.form.province = !deptPro || deptPro == "" ? [] : deptPro.split(',')
					}
				})
			},
			selectClassfy(data, node) {
        // if(checked){
        // 	this.$refs.selectTree.setCheckedNodes([data]);
        // }
				let deptTemp = this.$refs.selectTree.getCheckedNodes()
				this.selectDept = {
					deptId: deptTemp[0].deptId,
					deptType: deptTemp[0].deptType
				}
				if (deptTemp.length == 0) {

				} else if (deptTemp.length > 1) {
					this.$message.error('只能选择一个机构')

				} else {
					this.getDeptType()
					this.isShowSelect = false;
				}
				this.deptInput = deptTemp[0].name;
        if(this.activeName == 'first'){
          this.getDeptProvince(deptTemp[0].deptId)
        }
			},
			changeSelectTree() {
				this.isShowSelect = true;
			},
			closeSelectTree() {
				this.isShowSelect = false;
			},


			// 获取数据列表
			getDataList() {

				this.dataListLoading = true
				var that = this
				let deptType = this.deptType.length == 0 ? undefined : this.deptType
				let enableType = this.enableType.length == 0 ? undefined : this.enableType
				let keywords = this.keywords == '' ? undefined : this.keywords

				getCommHttpData({
					url: 'uc/dept/deptList',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						sidx: "",
						order: "",
						enable: enableType,
						deptTypeList: deptType,
						name: keywords,
            queryDeptType: this.activeName=='first'?1:2,
            parentId: this.parentActive
					}
				}, function(data) {
					if (data && data.code === 0) {
						if (data.page.list.length == 0 && that.pageIndex != 1) {
							that.pageIndex = 1
							that.getDataList()
						}
						that.dataList = treeDataTranslate(data.page.list, 'deptId')
						if (data.page.list.length == 1) {
							that.expandRowKey = [data.page.list[0].deptId]
						}

						that.totalPage = data.page.totalCount
					} else {
						that.dataList = []
						that.totalPage = 0
					}
					that.dataListLoading = false
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getDataList()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getDataList()
			},
			// 多选
			selectionChangeHandle(val) {
				this.dataListSelections = val
			},
			resetTemp() {
				this.form = {
					parentId: 0,
          parentDeptType: 0,
					name: '',
					deptType: '',
					pic: '',
					orderNum: '',
					address: '',
					longitude: '',
					latitude: '',
					phone: '',
					province: []
				}
			},
			handleCreate(id, type, name,deptType) {
				this.addLoading = false
				this.dialogStatus = 'create'
				this.disabledUpdate = false
				this.dialogFormVisible = true
				this.isShowSelect = false
				this.form.deptType = ''

        if(this.activeName == 'second'){
          this.form.deptType = 4
        }
				this.cityshow = true
				this.$nextTick(() => {
					this.resetTemp()
          //机构添加默认当前机构
          if(id == undefined){
            this.$refs.selectTree.setCheckedKeys([this.orgId])
            let temArr = this.$refs.selectTree.getCheckedNodes()
            this.deptInput = temArr[0].name;
          }
          //部门添加
          if(type == 5){
            //设置当前选中的机构
            this.$refs.selectTree.setCheckedKeys([this.parentActive])
            let temArr = this.$refs.selectTree.getCheckedNodes()
            this.deptInput = temArr[0].name;
            this.getDeptList(10)
          }else{
            this.getDeptList(0)
          }
          //添加下层机构
					if (type == 3) {
						this.form.parentId = id
						this.form.parentName = name
            this.form.parentDeptType = deptType
						this.isParentDeptShow = true
						this.isMoreDeptShow = false
					} else {
						this.isParentDeptShow = false
						this.isMoreDeptShow = true
					}
					
					this.getDeptType(id)
					this.classTotal = 1
					this.$refs['dataForm'].clearValidate()
				})

			},
			handClose() {
				this.dialogFormVisible = false
				this.cityshow = false
				this.form = {
					parentId: 1,
					name: '',
					deptType: '',
					pic: '',
					orderNum: '',
					phone: '',
					address: '',
					longitude: '',
					latitude: '',
					province: []
				}
			},
			handleUpdate(row) {
				this.addLoading = false
				this.form = Object.assign({}, row) // copy obj
				this.dialogStatus = 'update'
				this.disabledUpdate = true
				this.dialogFormVisible = true
				this.form.province = []
				this.cityshow = true
				this.$nextTick(() => {
					this.isParentDeptShow = true
					this.isMoreDeptShow = false
					this.getDeptType(this.form.parentId)
					this.form.province = !row.province || row.province == "" ? [] : row.province.split(',')
						this.$refs['mapDrag'].latitude = row.latitude ? parseFloat(row.latitude) : null
					this.$refs['mapDrag'].longitude = row.longitude ? parseFloat(row.longitude) : null
					this.$refs['mapDrag'].shopaddress = row.address ? row.address : ''
					this.$refs['dataForm'].clearValidate()
				})
			},
			createData() {
				this.$refs['dataForm'].validate((valid) => {
          if(this.activeName == 'second'){
            this.form.deptType = 4
          }else{
            if(!this.form.province){
            	this.$message.error('请选择地区')
              return false;
            }
            if(!this.form.address){
            	this.hasAddress = true
            	return false;
            }
          }

					if (!this.form.orderNum) {
						this.form.orderNum = ""
					}
					this.form.province = this.form.province && this.form.province.length > 0 ? (this.form.province).toString() : ''
					if (valid) {
						var that = this
						that.addLoading = true
						if (this.isMoreDeptShow) {
							this.form.parentId = this.selectDept.deptId
              this.form.parentDeptType =  this.selectDept.deptType
						}
            this.form.parentDeptType = !this.form.parentDeptType ? 0 :this.form.parentDeptType
            //获得 选中的机构
            // let temNode = this.$refs.selectTree.getCheckedNodes()
            // this.form.parentDeptType = temNode[0].deptType == undefined ? 0:temNode[0].deptType

						getCommHttpData({
							url: 'uc/dept/save',
							method: 'post',
							serverType: 2,
							contentType: 2,
							operateType: 3,
							that: this,
							data: this.form
						}, function(data) {
							if (data.code == '0') {
								that.dialogFormVisible = false
								that.getDataList();
							}
							that.addLoading = false
						})
					}
				})
			},
			updateData() {

				this.$refs['dataForm'].validate((valid) => {
					if (!this.form.orderNum) {
						this.form.orderNum = ""
					}
					if(this.activeName == 'second'){
					  this.form.deptType = 4
					}else{
					  if(!this.form.province){
					  	this.$message.error('请选择地区')
					    return false;
					  }
					  if(!this.form.address){
					  	this.hasAddress = true
					  	return false;
					  }
					}
					if (valid) {
						var that = this
						that.addLoading = true
						this.form.province = this.form.province.length > 0 ? (this.form.province).toString() : ''
						getCommHttpData({
							url: 'uc/dept/update',
							method: 'post',
							serverType: 2,
							contentType: 2,
							operateType: 2,
							that: this,
							data: this.form
						}, function(data) {
							that.dialogFormVisible = false
							that.getDataList();
						})
					}
				})
			},
			changeSatus(id, status) {
				var that = this
				getCommHttpData({
					url: `uc/dept/${status==0?'enable':'disable'}`,
					method: 'get',
					contentType: 1,
					data: {
						deptId: id
					}
				}, function(data) {
					that.getDeptList(0)
					that.getDataList()
				})

			},
			// 删除
			deleteData(delJson) {
				var that = this
				console.log(delJson)
				getCommHttpData({
					url: 'uc/dept/deleteInfo',
					method: 'get',
					contentType: 1,
					data: delJson
				}, function(data) {
					if (data.code == 0) {

						deleteData(that, {
							msg: data.msg,
							delJson: {
								url: 'uc/dept/delete',
								method: 'get',
								contentType: 1,
								operateType: 1,
								data: delJson
							}
						}, function(deldata) {
							that.dialogFormVisible = false
							that.getDataList()
						})
					}

				})

			},
      //查询条件  搜索机构
      getDeptListSearch(){
      	var that = this
      	getCommHttpData({
      		url: 'uc/dept/select',
      		method: 'get',
      		contentType: 1,
      		data: {}
      	}, function(data) {
      		that.selfDeptListSearch = data.deptList
      	})
      },
      selectClassfySearch(data,checked,  node) {
        //console.log(checked)
        // if(checked){
        // 	this.$refs.selectTreeSearch.setCheckedNodes([data]);
        // }
      	let deptTemp = this.$refs.selectTreeSearch.getCheckedNodes(), depName = [], depIds = []
      	if(deptTemp.length == 0){
      		this.deptIdSelect=''
      		this.deptNameSelect = ''
      		return
      	}
      	if (deptTemp.length) {
      		deptTemp.forEach(item => {
      			depName.push(item.name)
      			depIds.push(item.deptId)
      		})
      	}
      	this.deptNameSelect = depName.join(',')
      	this.deptIdSelect = depIds.join(',')
        this.parentActive = this.deptIdSelect
        this.getDataList()
      },
      // 选择器的树节点
      filterNode(value, data) {
      	if (!value) return true;
      	return data.name.indexOf(value) !== -1;
      },
      openTree() {
      	if (this.isShowSelectSearch) {
      		this.closeTree()
      	}else {
      		this.isShowSelectSearch = true
      		this.inputIcon = 'el-icon-arrow-up'
      	}
      },
      closeTree() {
      	this.isShowSelectSearch = false
      	this.inputIcon = 'el-icon-arrow-down'
      },
			nodeClickSearch(data, node, self){
				this.deptIdSelect = data.deptId;
        this.getDataList()
			},
      changeSelectTreeSearch() {
      	this.isShowSelectSearch = true;
      	this.treeSearchValue = ''
      	this.inputIcon = 'el-icon-arrow-up'
      },
		}
	}
</script>
<style lang="scss" scoped>
.search-tree{
	min-width: 380px;
	z-index: 9999;
	background-color: #fff;
	position: absolute;
	overflow: auto;
	border: 1px solid #ddd;
	line-height: normal;
	max-height: 300px;
	top: 40px;
}
.dep-chose-input{
	width: 220px;
	/deep/ input{
		border-right: 0;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	&:hover +.arrow-iconmy{
		border-color: #c0c4cc;
	}
}
.arrow-iconmy{
	line-height: 34px;
	border: 1px solid #DCDFE6;
	background-color: #fff;
	margin-left: -5px;
	border-left: 0;
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px;
	cursor: pointer;
	color: #C0C4CC;
	padding-right: 5px;
}
.show-border-color{
	border-color: #17B3A3;
}
.show-border-color-input{
	/deep/ input{
		border-color: #17B3A3;
	}
}
</style>
