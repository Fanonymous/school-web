<template>
  <el-dialog
    :title="!dataForm.tagId ? '添加分类' : '修改分类'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="分类名称" prop="tagName">
        <el-input v-model.trim="dataForm.tagName" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="分类值" prop="tagValue">
        <el-input placeholder="请输入分类值" v-model.trim="dataForm.tagValue" class="input-with-select">
			  <el-button v-if="addVisible" slot="append" icon="el-icon-plus" @click="addLabel">添加</el-button>
			  </el-input>
      </el-form-item>
      <el-form-item label="" prop="paramKey">
      	<el-tag
      		:key="tag.tagValue"
				  v-for="tag in dynamicTags"
				  closable
				  type=""
				  @close="handleClose(tag)">
				  {{tag.tagValue}}
				</el-tag>
      </el-form-item>
    </el-form>
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
        visible: false,
        addVisible:true,
        dataForm: {
          tagId: 0,
          tagName: '',
          tagValue: '',
        },
        dataRule: {
          tagName: [
            { required: true, message: '分类名称不能为空', trigger: 'blur' }
          ],
          tagValue: [
            { required: false, message: '分类值不能为空', trigger: 'blur' },
//          { validator: checkTagValue, trigger: 'blur' }
          ]
        },
        dynamicTags: [],
      }
    },
    methods: {
      init (id,tagName,tagValue) {
        this.dataForm.tagId = id || 0
        this.dataForm.tagName = tagName || ''
        this.dataForm.tagValue = tagValue || ''
        this.visible = true
        if(this.dataForm.tagId ==0){
        	this.addVisible = true
        }else{
        	this.addVisible = false
        }
        this.dynamicTags = []
      },
      // 表单提交
      dataFormSubmit () {
      	let params = {
            list:this.dynamicTags
          }
      	if(this.dataForm.tagId != 0){
      		params = {
      			tagId: this.dataForm.tagId,
            tagName:this.dataForm.tagName,
            tagValue:this.dataForm.tagValue
          }
      	}
      	if(this.dataForm.tagId == 0 && this.dynamicTags.length==0){
      		
      		if(this.dataForm.tagValue == ''){
	      		this.$message({
	              message: '分类值不能为空',
	              type: 'error',
	              duration: 2000
	            })
	      		return
	      	}
      		
      		params = {list:[{
            tagName:this.dataForm.tagName,
            tagValue:this.dataForm.tagValue
          }]}
      	}
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrlMedia(`/device/${!this.dataForm.tagId ? 'addTag' : 'updateTag'}`),
              method: 'post',
              data: this.$http.adornData(params)
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                //this.$message.error(data.msg)
              }
            })
          }
        })
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      addLabel(){
      	if(this.dataForm.tagValue == ''){
      		this.$message({
              message: '分类值不能为空',
              type: 'error',
              duration: 2000
            })
      		return
      	}
      	this.$refs['dataForm'].validate((valid) => {
          if (valid) {
          	let dynamicTags = this.dynamicTags.filter(item => item.tagValue == this.dataForm.tagValue)
          	if(dynamicTags.length ==0){
          		this.dynamicTags.push({tagName:this.dataForm.tagName,tagValue:this.dataForm.tagValue})
          		this.dataForm.tagValue = ''
          	}else{
          		this.$message({
                  message: this.dataForm.tagValue+'已添加，请勿重复添加',
                  type: 'error',
                  duration: 2000,
                  onClose: () => {
                    this.dataForm.tagValue = ''
                  }
                })
          	}
          }
        })
      	
      }
    }
    
  }
</script>
