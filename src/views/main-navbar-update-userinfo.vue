<template>
  <el-dialog
    title="个人中心"
    :visible.sync="visible"
    :append-to-body="true">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="账号" prop="loginName">
        <el-input type="text" v-model="dataForm.loginName" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input type="text" v-model="dataForm.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <!--<el-form-item label="头像" prop="icon">
        <el-input type="password" v-model="dataForm.icon"></el-input>
      </el-form-item>-->
      <uploadpic ref="uploadpic" @refreshDataList="getPicSrc"></uploadpic>
        </el-form-item>
      <el-form-item label="身份证" prop="iDCode">
        <el-input type="text" v-model="dataForm.iDCode" placeholder="请输入身份证"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="dataForm.sex" size="small">
		      <el-radio label="1" >男</el-radio>
    		  <el-radio label="0" >女</el-radio>
		  </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
      	<el-date-picker v-model="dataForm.birthday" type="date" placeholder="请选择出生日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="民族" prop="folk">
        <el-input type="text" v-model="dataForm.folk" placeholder="请输入民族"></el-input>
      </el-form-item>
      <el-form-item label="政治面貌" prop="politics">
        <el-input type="text" v-model="dataForm.politics" placeholder="请输入政治面貌"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="mobile">
        <el-input type="number" v-model="dataForm.mobile" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="email" v-model="dataForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="籍贯" prop="nativePlace">
      	<area-cascader type='text' :level='1' :data="pcaa" v-model="dataForm.nativePlace" placeholder="请选择地址"></area-cascader>
        <!--<el-input type="password" v-model="dataForm.nativePlace"></el-input>-->
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { clearLoginInfo } from '@/utils'
  import sha256 from 'js-sha256'
  import Uploadpic from './modules/common/uploadpic'
  import { pca, pcaa } from 'area-data'; // v5 or higher
	import 'vue-area-linkage/dist/index.css'; // v2 or higher
  export default {
    data () {
      var validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.newPassword !== value) {
          callback(new Error('确认密码与新密码不一致'))
        } else {
          callback()
        }
      }
      return {
      	apiUrl:process.env.BASE_API,
        visible: false,
        picList:[],
        pca:pca,
        pcaa:pcaa,
        dataForm: {
        	loginName:'',
        	name:'',
        	icon:'',
        	iDCode:'',
        	sex:'1',
        	birthday:'',
        	folk:'',
          politics: '',
          mobile: '',
          email: ''
        },
        uploadFile:{
	      	type:''
	      },
        dataRule: {
          loginName: [
            { required: true, message: '登录账号不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      Uploadpic
    },
    computed: {
      userName: {
        get () { return this.$store.state.user.name },
        set (val) { this.$store.commit('common/updateName', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      }
    },
    methods: {
      // 初始化
      init () {
      	
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.$http({
          url: this.$http.adornUrl('/uc/user/info'),
          method: 'post',
          data: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
          	console.log(data)
            this.dataForm = {
		        	loginName:data.user.loginName,
		        	name:data.user.name,
		        	icon:data.user.icon,
		        	iDCode:data.user.iDCode,
		        	sex:data.user.sex.toString(),
		        	birthday:data.user.birthday,
		        	folk:data.user.folk,
		          politics: data.user.politics,
		          mobile: data.user.mobile,
		          email: data.user.email
		        }
          }
        })
        
      },
      getPicSrc (picSrc) {
      	this.dataForm.icon = picSrc
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/cms/teacherMge/userUpdate'),
              method: 'post',
              data: this.$http.adornData(this.dataForm)
              
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$nextTick(() => {
                      this.$router.replace({ name: 'home' })
                    })
                  }
                })
              }
            })
          }
        })
      }
      
    }
  }
</script>

