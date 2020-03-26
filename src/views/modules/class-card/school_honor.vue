<template>
	<div class="school_honors">
		<el-card>
			<el-row>
				<el-col :span="24">
					<el-input placeholder="请输入名称" clearable :inline="true" style="width:250px;" v-model="msg" @input="getHoner"></el-input>
					<el-button type="primary" style="float:right" @click="showAdd">添加荣誉</el-button>
				</el-col>
			</el-row>
			<el-row :gutter="20" style="margin-top: 10px;">
				<el-col :span="24" v-if = "theHonerlist.length ==0" style="height: 280px;">
				  <!-- <el-card style="width:100%;height: 100%;"> -->
				  	<img src="~@/assets/img/nodata.png" class="image" style="width:180px;display:block;margin: 40px auto;">
				  <!-- </el-card> -->
			  	</el-col>
				<el-col v-else :span="6" class="the_imgs" v-for='(item,index) in theHonerlist' :key="index">
					<div class="the_contain" style="height: 200px;margin-bottom: 20px;">
						<img :src="baseIp+item.honerCover" :onerror="defaultImg" width="100%" height="80%" />
						<div class="word">{{item.honerName}}</div>
						<div class="the_top">
							<el-button type="primary" style="text-align: center;" @click="getEdit(item)">编辑</el-button>
							<el-button type="primary" style="text-align: center;" @click="getDel(item)">删除</el-button>
						</div>
					</div>
				</el-col>
			</el-row>
			<div style="margin-top: 20px">
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</div>
		</el-card>

		<el-dialog title="添加荣誉" :visible.sync="dialogFormVisible" width="30%">
			<el-form :model="form" :rules="rules" ref="honerForm" :label-width="formLabelWidth">
				<el-form-item label="荣誉名称"  prop="name">
					<el-input v-model="form.name" autocomplete="off" placeholder="请输入荣誉名称"></el-input>	
				</el-form-item>
				<uploadpic ref="uploadpic" :key="index" label="上传封面" v-model="form.picSrc"></uploadpic>
				<el-form-item label="备注">
					<el-input type="textarea" :autosize="{ minRows:2, maxRows: 4}" v-model="form.remark"></el-input>
				</el-form-item>
			</el-form>
				<div style="text-align: center;">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="addHoner">提交</el-button>
				</div>
		</el-dialog>

		<el-dialog title="编辑荣誉" :visible.sync="editShow" width="30%">
			<el-form :model="forms" :rules="rules" ref="honerForm" :label-width="formLabelWidth">
				<el-form-item label="荣誉名称" prop="name">
					<el-input v-model="forms.name" autocomplete="off" placeholder="请输入荣誉名称"></el-input>	
				</el-form-item>
				<uploadpic ref="uploadpic" label="上传封面" v-model="forms.picSrc "></uploadpic>
				<el-form-item label="备注" >
					<el-input type="textarea" :autosize="{ minRows:2, maxRows: 4}" v-model="forms.remark">
					</el-input>
				</el-form-item>
			</el-form>
				<div style="text-align: center;">
					<el-button @click="editShow = false">取 消</el-button>
					<el-button type="primary" @click="editHoner">提交</el-button>
				</div>
		</el-dialog>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	import Uploadpic from '../common/uploadpic'
	export default {
		data() {
			return {
				baseIp :window.SITE_CONFIG.imgIP,
				schoolId:this.GLOBAL.getOrgId(),
				formLabelWidth:"100px",
				dialogFormVisible:false,
				msg:'',
				defaultImg: 'this.src="' + require('../../../assets/img/nothing.png') + '";this.onerror = null',
				theHonerlist:[],
				editShow:false,
				form:{
					name:"",
					picSrc:'',
					remark:'',
				},
				forms:{
					name:"",
					picSrc:'',
					remark:'',
				},
				homePagePrcList:[],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				row:[],
				rules: {
					name: [{
						required: true,
						message: '请输入荣誉名称',
						trigger: 'change'
					}],
					picSrc: [{
						required: true,
						message: '请选择图片',
						trigger: 'change'
					}],
                },
                index : 1,
			}
		},
		components: {
		      Uploadpic
		    },
		created() {
			this.getHoner()
		},
		methods: {
			getPicSrc (picSrc) {
				this.form.picSrc=picSrc;
				this.forms.picSrc=picSrc;
		    },
		    getPicSrcs(picSrc){
		    	this.forms.picSrc=picSrc;
		    },
		    showAdd(){
                this.dialogFormVisible = true;
                this.index ++ 
		    	this.form.name="";
		    	this.form.remark="";
		    	this.form.picSrc=''
		    	this.$nextTick(() => {
		    		this.$refs['honerForm'].clearValidate()
		    	})
		    },
		    getHoner() {
				let that = this;
				getCommHttpData({
					url: 'cms/honer/list',
					method: 'get',
					contentType: 1,
					data: {
						honerType: 3,
						schoolKeyWord: this.msg,
						page: this.pageIndex,
						size: this.pageSize,
					},
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndex != 1) {
							that.pageIndex = 1
							that.getHoner()
						}
						that.theHonerlist = data.page.list
						that.totalPage = data.page.totalCount
					} else {
						that.theHonerlist = []
						that.totalPage = 0
					}
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getstuImg()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getstuImg()
			},
			getDel(row){
				let honerId=row.honerId;
				let that = this;
				deleteData(this,{
					url:'cms/honer/delete',
					method:'get',
					contentType:1,
					operateType:1,
					data:{
			        	honerId:honerId
			      	}
				},function(data){
		      	   that.getHoner()
			      })
			},
			getEdit(row){
				this.editShow = true;
				this.forms.name = row.honerName;
		    	this.forms.remark = row.remark;
		    	this.forms.picSrc = row.honerCover;
		    	this.row = row;
		    	this.$nextTick(() => {
					this.$refs.uploadpic.picList = [{
						name: this.row.honerCover,
						url: this.baseIp + this.row.honerCover
					}]
				})
			},
			editHoner(){
				let honerId=this.row.honerId;
				let that = this;
				getCommHttpData({
					url: 'cms/honer/updateHoner',
					method: 'post',
					contentType: 2,
					data:{
						honerId:honerId,
						honerType:3,
						honerName:this.forms.name,
						honerCover:this.forms.picSrc,
						remark:this.forms.remark,
						schoolId:this.schoolId,
					},
				}, function(data) {
					if(data.code==0){
						 that.$message({
				          message: '修改成功',
				          type: 'success'
				        });
					}
					that.editShow=false;
					that.getHoner()
				})
			},
		    addHoner(){
		    	this.$refs['honerForm'].validate((valid) => {
					if(valid) {
						let that = this;
						getCommHttpData({
							url: 'cms/honer/add/school',
							method: 'post',
							contentType: 2,
							data: {
								honerName:this.form.name,
								honerCover:this.form.picSrc,
								remark:this.form.remark,
							},
						}, function(data) {
							if(data.code==0){
								 that.$message({
						          message: '更新成功',
						          type: 'success'
						        });
							}
							that.dialogFormVisible = false;
							 that.getHoner()
						})
						that.$nextTick(() => {
							that.$refs.uploadpic.picList = []
						})
					}})
		    	
		    	
		    }
		}
	}
</script>

<style scoped lang="scss">
	.the_imgs {
	  position: relative;
	  cursor: pointer;  
	}
	.the_top {
	  position: absolute;
    left: 0;
    right: 0;
    top: 80px;
    bottom: 0;
    height: 30px;
    text-align: center;
	}
	.the_imgs{
		.word{
			width:"100%";
			text-align: center;
			padding-top: 10px;
			padding-bottom: 10px;
			background: #3C85EE;
			color:white;
			font-size: 18px;
		}
	}
	.the_imgs .the_top{
	  display:none;
	}
	.the_imgs:hover .the_top{
	  display:block; 
	}
</style>