<template>
   <div v-clickoutsides:exactAreaClassName="closeTree" style="display:inline-block;position: relative;">
   	<div>
   		<el-input placeholder="请选择机构" readonly class="dep-chose-input" :class="{'show-border-color-input' : isShowSelect}"  auto-complete="off" v-model="deptNameSelect" @click.native="changeSelectTree()"></el-input>
   		<span :class="[{'show-border-color' : isShowSelect}, inputIcon]" class="exactAreaClassName arrow-iconmy" @click="openTree"></span>
   	</div>
   	<div v-show="isShowSelect" class="search-tree exactAreaClassName">
   		<el-input v-model="treeSearchValue" placeholder="请选择机构名称查询" auto-complete="off" style="padding: 5px 10px;"></el-input>
   		<el-tree style="min-width: 200px;" :default-checked-keys="defaultChecked" :check-strictly="true" node-key="id" @node-click="nodeClick" show-checkbox default-expand-all empty-text="暂无数据" :props="defaultProps" :highlight-current=true
   			:expand-on-click-node="true" :data="selfDeptList" :filter-node-method="filterNode" @check-change="selectClassfy" class="width-tree selectTree-input" ref="selectTree">
   		</el-tree>
   	</div>
   </div>
</template>

<script>
  import { getCommHttpData, getCommonDictByType, deleteData, getExportFile } from '@/utils/common'
export default {
	data() {
	    return {
	    	deptType: undefined,
	    	deptTypeList: [],
	    	enableTypeList: [],
        deptId: this.GLOBAL.getOrgId(),
	    	userType: this.GLOBAL.getUserType(),
	    	enableType: '',
	    	status:'',
	    	dataListLoading: false,
	    	dataListSelections: [],
	    	addOrUpdateVisible: false,
	    	deptNameSelect:'',
	    	deptIdSelect:'',
	    	isShowSelect:false,
	    	defaultProps: {
	    		children: 'children',
	    		label: 'name',
	    	},
	    	selfDeptList:[],
	    	treeSearchValue : '',
	    	inputIcon : 'el-icon-arrow-down',
        defaultChecked:[],
	    }
	},
  watch: {
  	treeSearchValue(val) {
  		this.$refs.selectTree.filter(val);
  	},
  },
	created() {
    this.getDeptList()
	},
	methods: {
    openTree() {
    	if (this.isShowSelect) {
    		this.closeTree()
    	}else {
    		this.isShowSelect = true
    		this.inputIcon = 'el-icon-arrow-up'
    	}
    },
    closeTree() {
    	this.isShowSelect = false
    	this.inputIcon = 'el-icon-arrow-down'
    },
    getDeptList(){
    	var that = this
    	getCommHttpData({
    		url: 'common/getDept',
    		method: 'get',
    		contentType: 1,
    		data: {userType : this.userType, deptIds: this.deptId}
    	}, function(data) {
        if(data.page ){
          that.selfDeptList = data.page
          that.deptIdSelect = data.page[0].children[0].id
          that.defaultChecked = [data.page[0].children[0].id]
          that.deptNameSelect = data.page[0].children[0].name
          that.$refs.selectTree.setCheckedKeys([data.page[0].children[0]])
          that.$emit('refreshDataList',that.deptIdSelect,that.deptNameSelect)
        }

    	})
    },
    selectClassfy(data,checked, node) {
      if(checked){
      		this.$refs.selectTree.setCheckedNodes([data]);
      }
    	let deptTemp = this.$refs.selectTree.getCheckedNodes(), depName = [], depIds = []
    	if(deptTemp.length == 0){
    		this.deptIdSelect=''
    		this.deptNameSelect = ''
    		return
    	}
    	if (deptTemp.length) {
    		deptTemp.forEach(item => {
    			depName.push(item.name)
    			depIds.push(item.id)
    		})
    	}
    	this.deptNameSelect = depName.join(',')
    	this.deptIdSelect = depIds.join(',')
      this.$emit('refreshDataList',this.deptIdSelect,this.deptNameSelect)
    },

    nodeClick(data, node, self){
    	this.deptIdSelect = data.id;
    },
    changeSelectTree() {
    	this.isShowSelect = true;
    	this.treeSearchValue = ''
    	this.inputIcon = 'el-icon-arrow-up'
    },

    // 选择器的树节点
    filterNode(value, data) {
    	if(!value) return true;
    	return data.name.indexOf(value) !== -1;
    }
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
