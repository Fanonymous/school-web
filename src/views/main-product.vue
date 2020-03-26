<template>
  <el-dialog
    title="修改标签"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div v-for="item in productList">
    	{{item.menuName}}
    	<!--<div v-for="item in productList">
    		{{item.menuName}}
    		<div v-for="item in productList">
    			{{item.menuName}}
    			<div v-for="item in productList">
    				{{item.menuName}}
    			</div>
    		</div>
    	</div>-->
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  
</style>
<script>
  export default {
    data () {
      return {
      	productList:[],
        visible: false,
        addVisible:true,
        dataForm: {
          tagId: 0,
          tagName: '',
          tagValue: '',
        },
        dataRule: {
          tagName: [
            { required: true, message: '标签名称不能为空', trigger: 'blur' }
          ],
          tagValue: [
            { required: true, message: '标签值不能为空', trigger: 'blur' }
          ]
        },
        dynamicTags: [],
      }
    },
    methods: {
      init () {
      	this.productList = sessionStorage.getItem('productList')
      	
       
      },
      // 表单提交
      dataFormSubmit () {
      	
      },
      handleClose(tag) {
        
      },
      addLabel(){
      	
      	
      }
    }
    
  }
</script>
