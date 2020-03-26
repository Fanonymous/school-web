<template>
	<div class="mod-config">
		<el-card>
			<el-row :gutter="0">
				<el-col :span="20">
					<el-form inline :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="330px">
						<el-col :span="24">
							<div class="header-body-manage">设施与资源</div>
						</el-col>

						<el-form-item label="学生总数" prop="stuTotal">
							<el-input type="text" v-model.trim="dataForm.stuTotal" placeholder="请输入数字"></el-input>
						</el-form-item>
						<el-form-item label="教师总数" prop="terTotal">
							<el-input type="text" v-model.trim="dataForm.terTotal" placeholder="请输入数字"></el-input>
						</el-form-item>
						<el-form-item label="普通教室数" prop="classroomTotal">
							<el-input  type="text" v-model.trim="dataForm.classroomTotal" placeholder="请输入数字"></el-input>
						</el-form-item>
						<el-form-item label="功能部室数" prop="functionroomTotal">
							<el-input  type="text" v-model.trim="dataForm.functionroomTotal" placeholder="请输入数字"></el-input>
						</el-form-item>
						<el-form-item label="智慧教室PAD数" prop="wisdomClassroomTotal">
							<el-input  type="text" v-model.trim="dataForm.wisdomClassroomTotal" placeholder="请输入数字"></el-input>
						</el-form-item>
						<el-form-item label="电脑数" prop="computerTotal">
							<el-input  type="text" v-model.trim="dataForm.computerTotal" placeholder="请输入数字"></el-input>
						</el-form-item>
						<el-form-item label="笔记本数" prop="notebookTotal">
							<el-input  type="text" v-model.trim="dataForm.notebookTotal" placeholder="请输入数字"></el-input>
						</el-form-item>
						<el-form-item label="教学和办公是否接入无线网" prop="teachUseWifi">
							<el-radio-group v-model="dataForm.teachUseWifi">
								<el-radio :label="1">是</el-radio>
								<el-radio :label="0">否</el-radio>
							</el-radio-group>
						</el-form-item>

						<el-col :span="24">
							<div class="header-body-manage">数字资源</div>
						</el-col>

						<el-form-item label="是否有教育管理和公共服务平台" prop="servicePlatform">

							<el-radio-group v-model="dataForm.servicePlatform">
								<el-radio :label="1">是</el-radio>
								<el-radio :label="0">否</el-radio>
							</el-radio-group>

						</el-form-item>
						<el-form-item label="认证合格的数字化课程资源总量" prop="digitalCourseResourcesTotal">
							<el-col :span="18">
								<el-input type="text" v-model.trim="dataForm.digitalCourseResourcesTotal" placeholder="请输入数字"></el-input>
							</el-col>
							<el-col :span="6">
								<el-select v-model="dataForm.digitalCourseResourcesSize" placeholder="请选择">
							      <el-option label="条数" :value="1" key="1"></el-option>
							      <el-option label="GB" :value="2" key="2"></el-option>
							    </el-select>
						    </el-col>
						</el-form-item>
						<el-col :span="24">
							<div class="header-body-manage">保障机制</div>
						</el-col>
						<el-form-item label="(近三年平均)教育信息化经费硬设施投入" prop="hardwareInput">
							<el-input type="text" v-model.trim="dataForm.hardwareInput" placeholder="请输入数字"><template slot="append">万元</template></el-input>
						</el-form-item>
						<el-form-item label="(近三年平均)教育信息化经费软设施投入" prop="softFacilityInput">
							<el-input type="text"  v-model.trim="dataForm.softFacilityInput" placeholder="请输入数字"><template slot="append">万元</template></el-input>
						</el-form-item>
						
						<el-form-item label="(近三年平均)学校信息化年投入经费总额占学校年建设经费比例" prop="fundingRatio">
							<el-input type="text"  v-model.trim="dataForm.fundingRatio" placeholder="请输入数字"><template slot="append">%（不含县区财政下拔的信息化专项经费）</template><</el-input>
						</el-form-item>

						<el-form-item label="(近三年平均)上级部门对学校的信息化建设投入的专项经费" prop="specialFunds">
							<el-input type="text"  v-model.trim="dataForm.specialFunds" placeholder="请输入数字"><template slot="append">万元（自申请和财政拨付）</template><</el-input>
						</el-form-item>
						<el-col :span="24">
							<div class="header-body-manage">应用服务</div>
						</el-col>
						<br />
						<el-form-item label="是否建立校园网" prop="campusNetwork">

							<el-radio-group v-model="dataForm.campusNetwork">
								<el-radio :label="1">是</el-radio>
								<el-radio :label="0">否</el-radio>
							</el-radio-group>

						</el-form-item>

						<el-form-item label="是否建有校园文化宣传系统" prop="propagandaSystem">

							<el-radio-group v-model="dataForm.propagandaSystem">
								<el-radio :label="1">是</el-radio>
								<el-radio :label="0">否</el-radio>
							</el-radio-group>

						</el-form-item>

						<el-form-item label="校园文化宣传系统日均访问量" prop="propagandaSystemVisits">

							<el-input  type="text" v-model.trim="dataForm.propagandaSystemVisits" placeholder="请输入数字"></el-input>

						</el-form-item>
						<el-form-item label="资源平台日均访问量" prop="resourcesVisits">

							<el-input  type="text" v-model.trim="dataForm.resourcesVisits" placeholder="请输入数字"></el-input>

						</el-form-item>

						<el-form-item label="各应用平台日均访问量" prop="applicationPlatformVisits">

							<el-input  type="text" v-model.trim="dataForm.applicationPlatformVisits" placeholder="请输入数字"></el-input>

						</el-form-item>
						<div style="margin-left: 250px;">
							<el-form-item>
								<el-col :span="24">
									<el-button @click="resetForm('dataForm')">重置</el-button>
									<el-button type="primary" @click="dataFormSubmit"  :loading="addLoading">确定</el-button>
								</el-col>
							</el-form-item>
						</div>
					</el-form>
				</el-col>
			</el-row>
		</el-card>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	import Uploadpic from '../common/uploadpic'
	export default {
		data() {
			return {
				addLoading:false,
				dataRule: {
					applicationPlatformVisits: [
						{pattern: /^[+]{0,1}(\d+)$/,message: '数字必须是正整数'},
						{pattern: /^[0-9]{1,6}$/,message: '长度为0-6位数字'}],
					classroomTotal: [{pattern: /^[+]{0,1}(\d+)$/,message: '数字必须是正整数'},
						{pattern: /^[0-9]{1,6}$/,message: '长度为0-6位数字'}],
					computerTotal: [{pattern: /^[+]{0,1}(\d+)$/,message: '数字必须是正整数'},
						{pattern: /^[0-9]{1,6}$/,message: '长度为0-6位数字'}],
					digitalCourseResourcesTotal: [{pattern: /^[+]{0,1}(\d+)$/,message: '数字必须是正整数'},
						{pattern: /^[0-9]{1,15}$/,message: '长度为0-15位数字'}],
					functionroomTotal: [{pattern: /^[+]{0,1}(\d+)$/,message: '数字必须是正整数'},
						{pattern: /^[0-9]{1,6}$/,message: '长度为0-6位数字'}],
					fundingRatio: [{pattern: /^([0-9]|[0-9]\.\d+|[1-9][0-9]|[1-9][0-9]\.\d+|100)$/,message: '数字不能大于100'}],
					hardwareInput: [{pattern: /(^[0-9]{1,10}$)|(^[0-9]{1,10}[\.]{1}[0-9]{1,4}$)/,message: '长度为0-10位数字,小数位为0-4位小数'}],
					notebookTotal: [{pattern: /^[+]{0,1}(\d+)$/,message: '数字必须是正整数'},
						{pattern: /^[0-9]{1,6}$/,message: '长度为0-6位数字'}],
					
					propagandaSystemVisits: [{pattern: /^[+]{0,1}(\d+)$/,message: '数字必须是正整数'},
						{pattern: /^[0-9]{1,6}$/,message: '长度为0-6位数字'}],
					resourcesVisits: [{pattern: /^[+]{0,1}(\d+)$/,message: '数字必须是正整数'},
						{pattern: /^[0-9]{1,6}$/,message: '长度为0-6位数字'}],
					
					softFacilityInput: [{pattern: /(^[0-9]{1,10}$)|(^[0-9]{1,10}[\.]{1}[0-9]{1,4}$)/,message: '长度为0-10位数字,小数位为0-4位小数'}],
					specialFunds: [{pattern: /(^[0-9]{1,10}$)|(^[0-9]{1,10}[\.]{1}[0-9]{1,4}$)/,message: '长度为0-10位数字,小数位为0-4位小数'}],
					stuTotal:[{pattern: /^[+]{0,1}(\d+)$/,message: '数字必须是正整数'},
						{pattern: /^[0-9]{1,6}$/,message: '长度为0-6位数字'}],
					
					terTotal: [
					{pattern: /^[+]{0,1}(\d+)$/,message: '数字必须是正整数'},
						{pattern: /^[0-9]{1,6}$/,message: '长度为0-6位数字'}],
					wisdomClassroomTotal: [
					{pattern: /^[+]{0,1}(\d+)$/,message: '数字必须是正整数'},
						{pattern: /^[0-9]{1,6}$/,message: '长度为0-6位数字'}],
				},
				dataForm: {
					applicationPlatformVisits: null,
					campusNetwork: null,
					classroomTotal: null,
					computerTotal:  null,
					createBy:  null,
					createDate:  null,
					deptId:  null,
					digitalCourseResourcesTotal: null,
					functionroomTotal: null,
					fundingRatio: null,
					hardwareInput: null,
					id: null,
					notebookTotal: null,
					propagandaSystem: null,
					propagandaSystemVisits: null,
					resourcesVisits: null,
					servicePlatform:  null,
					softFacilityInput: null,
					specialFunds:  null,
					stuTotal:  null,
					teachUseWifi: null,
					terTotal:  null,
					updateBy: null,
					updateDate:  null,
					wisdomClassroomTotal: null,
					select: null,
					digitalCourseResourcesSize:null
				}
			}
		},
		created(){
　　　　　　　　　　　　
            //this.dataForm.digitalCourseResourcesSize = 1;
        },
		mounted() {
			this.getDataIniInfo()
		},
		methods: {

			getDataIniInfo() {
				let that = this
				getCommHttpData({
					url: 'assess/cmsdatareporting/info',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					if(data.cmsDataReporting.id != null && data.cmsDataReporting.id != '' ){
						that.dataForm = data.cmsDataReporting
					}else{
						that.resetForm('dataForm')
					}
					
				})
			},
			resetForm(formName) {
				console.log(34)
		        this.$refs[formName].resetFields();
		    },
			dataFormSubmit() {
				//提交
				
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						this.addLoading = true
						var that = this
						getCommHttpData({
							url: `assess/cmsdatareporting/${this.dataForm.id== null ? 'save' : 'update'}`,
							method: 'post',
							serverType: 2,
							contentType: 2,
							operateType: 2,
							that: this,
							data: this.dataForm
						}, function(data) {
							that.addLoading = false
							//that.getDataIniInfo()
							//返回上一页
							that.$router.push({name: 'evaluate-report'})
							
						})
					}
				})
			}
		}
	}
</script>