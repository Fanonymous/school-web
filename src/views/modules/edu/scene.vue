<template>
 <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
	<el-steps :active="active" align-center>
		<template v-for="item in configList">
			<el-step :title="item.name" description=""></el-step>
		</template>
	</el-steps>
	<el-button style="margin-top: 12px;" @click="back">上一步</el-button>
    <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
  </div>
  
</template>

<script>
export default {
	data() {
	    return {
	    	active:1,
	      configList: null,
	      listLoading: true,
	      schoolType:'',
	      temp:{
	      	gradeId:undefined,
	      	gradeName:'',
	      	gradeSystem:1,
	      	schoolSection:1,
	      	list:[],
	      	division:'0',
	      	orderBy:''
	      },
	      sectionOptions:null,
	      sTypeOptions:null,
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
	      rules: {
	        gradeName: [{ required: true, message: '不能为空', trigger: 'blur' }],
	        gradeSystem: [{ required: true, message: '不能为空', trigger: 'change' }],
	        schoolSection:[{required:true,trigger: 'change'}]
	      }
	    }
	},
	created() {
	    this.getList();
	    this.getIndexByDict();
	},
	methods: {
		back() {
			if(this.active > 1){
				this.active-- ;
			}
	    },
		next() {
			if(this.active > this.configList.length-1){
				this.active = this.configList.length
			}else{
				this.active++;
			}
	    },
		getIndexByDict(){
			
		},
	    getList() {
	      this.listLoading = true
	      let sttem = this.schoolType;
	      sttem = sttem==''?0:sttem;
	      this.$http({
		      url: this.$http.adornUrl('/uc/scene/getScene'),
		      method: 'post',
		      data: this.$http.adornData({authorityId: 704},true,'form'),
	        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		    }).then(({data}) => {
		    	this.listLoading = false
			    this.configList = data.list.configList;
		    })
	
	    }
	}
}
</script>



