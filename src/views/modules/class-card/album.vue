<template>
	<div class="album_management">
		<el-card>
			<el-row>
				<el-col :span="24">
					<!--<el-select v-model="theType" placeholder="相册类型" @change="getalbum" style="margin-right: 3px;">
						<el-option v-for="item in typeList" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>-->
					<el-select v-model="gradeClassId" v-if="theType==2" clearable placeholder="请选择年级班级" style="width:150px;margin-right: 10px;" @change="gradeClass" >
						<el-option v-for="(item,index) in theGcoption" :key="index" :label="item.gradeName+item.className" :value="index" @clear="getalbum">
						</el-option>
					</el-select>
					<el-input placeholder="请输入标题名称" clearable :inline="true" style="width: 200px;" v-model="msg" @input="getalbum"></el-input>
					<el-button type="primary" style="float:right" @click="addimg">创建相册</el-button>
				</el-col>
			</el-row>
			<el-row :gutter="12" style="margin-top: 10px;">
				<el-col :span="24" v-if = "albumList.length ==0" style="height: 280px;">
					  <!-- <el-card style="width:100%;height: 100%;"> -->
					  	<img src="~@/assets/img/nodata.png" class="image" style="width:180px;display:block;margin: 40px auto;">
					  <!-- </el-card> -->
				</el-col>
				<el-col v-else :span="6" class="the_imgs" v-for='(item,index) in albumList' :key="index" style="margin-top: 10px;">
					<div class="the_contain" style="height: 200px">
			        <div style="height: 160px;background: #fff;line-height: 160px">
			          <img :src="item.albumCover" :onerror="defaultImg" style="max-height: 100%;max-width:100%;"/>
			        </div>
					<div class="word only-one-par">{{item.albumName}}</div>
					<div class="the_class">
						<el-button type="primary" style="text-align: center;" @click="showAlbum(item.albumId,item.albumName)" v-if="item.albumCover!=''">查看</el-button>
						<el-button type="primary" style="text-align: center;" @click="theUpload(item.albumId)">上传</el-button>
						<el-button type="primary" style="text-align: center;" @click="delAlbum(item.albumId, index)">删除</el-button>
					</div>
					</div>
				</el-col>
			</el-row>
			<div style="margin-top: 20px">
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[12, 24, 60, 120]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</div>
		</el-card>
		<el-dialog title="创建相册" :visible.sync="dialogFormVisible">
			<el-form :model="form" ref="albumForm" :rules="rules">
				<el-form-item label="名称：" prop="name" :label-width="formLabelWidth">
					<el-input v-model="form.name" autocomplete="off" placeholder="请输入相册名称"></el-input>
				</el-form-item>
				<el-form-item label="是否置顶：" :label-width="formLabelWidth">
					<el-radio v-model="form.radio" label="1">是</el-radio>
					<el-radio v-model="form.radio" label="2">否</el-radio>
				</el-form-item>
				<!--<el-form-item label="所属栏目：" prop="region" :label-width="formLabelWidth">
					<el-select v-model="form.region" placeholder="请选择所属栏目">
						<el-option v-for="item in typeList" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>-->
				<el-form-item label="所属班级：" prop="gradeClassId" :label-width="formLabelWidth" v-if="form.region==2">
					<el-select v-model="form.gradeClassId" clearable placeholder="请选择年级班级" style="margin-right: 10px;" @change="gradeClass">
						<el-option v-for="(item,index) in theGcoption" :key="index" :label="item.gradeName+item.className" :value="index">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addAmblum">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog title="上传照片" :visible.sync="imgUpload">
			<el-upload style="height:400px;margin-left:50px;overflow-y:auto ;" ref="uploadpic" :data="uploadFile" :action="apiUrl+'/sys/oss/picUpload'" :multiple="thenum" list-type="picture-card" :on-remove="handleRemove" :before-upload="deforeUpload" :file-list="theAllpic" :before-remove="beforeFileRemove" :on-success="handleFileSuccess">
				<i class="el-icon-plus"></i>
			</el-upload>
			<div slot="footer" class="dialog-footer">
				<el-button @click="imgUpload = false">取 消</el-button>
				<el-button type="primary" @click="submit">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog :title="tittleName" :visible.sync="goPreview" width="35%">
			<div id="container">
				<el-carousel indicator-position="outside">
					<el-carousel-item v-for="item in imgShow" :key="item.relId">
						<img :src="baseIp+item.path" class="image" style="max-height: 100%">
						<!--	<h3>{{ item }}</h3>-->
					</el-carousel-item>
				</el-carousel>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	export default {
		data() {
			return {
				apiUrl: window.SITE_CONFIG.baseUrlMedia,
				baseIp: window.SITE_CONFIG.imgIP,
				goPreview: false,
				dialogFormVisible: false,
				imgUpload: false,
				formLabelWidth: "100px",
				homePagePrcList: [],
				theGcoption: [],
				gradeClassId:undefined,
				typeList: [],
				isFormat:true,
				albumList: [],
				theType: 1,
				msg: '',
				theAllpic: [],
				picList: [],
				uppicList: [],
				albumId: '',
				thosepic: [],
				imgShow: [],
				thenum: true,
				tittleName: '',
				form: {
					name: "",
					radio: "1",
					gradeClassId: '',
					region: 1
				},
				uploadFile: {
					type: ''
				},
				pageIndex: 1,
				pageSize: 12,
				totalPage: 0,
				defaultImg: 'this.src="' + require('../../../assets/img/album.jpg') + '";this.onerror = null',
				rules: {
					name: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}],
					gradeClassId: [{
						required: true,
						message: '请选择班级',
						trigger: 'change'
					}],
					region: [{
						required: true,
						message: '请选择栏目',
						trigger: 'change'
					}],
				}
			}
		},
		watch : {
			imgUpload(n) {
				if (!n) {
					this.theAllpic = []
				}
			}
		},
		created() {
			this.gradeClass();
			this.getType()
		},
		methods: {
			handleRemove(file, fileList) {
				let relId;
				let path
				if(file.relId) {
					relId = file.relId;
					path = file.name;
					let that = this;
					getCommHttpData({
						url: 'cms/album/deleteImg',
						method: 'get',
						contentType: 1,
						data: {
							relId: relId,
							path: path
						},
					}, function(data) {
						if(data.code == 0) {
							that.$message({
								message: '删除成功',
								type: 'success'
							});
						} else {
							that.$message({
								message: 'data.msg',
								type: 'error'
							});
						}
					})
					this.uppicList = []
				}else{
						this.uppicList = []
				}

			},
			addimg(){
				this.dialogFormVisible = true;
				this.form.name='';
				this.form.region=this.theType;
				this.form.gradeClassId='';
				this.form.radio="1"
				
			},
			handleFileSuccess(response, file, fileList) {

				var arr = [];
				var arr1 = [];
				for(var i = 0; i < fileList.length; i++) {
					if(fileList[i].response) {
						arr.push(fileList[i].response.url)
					}
				}　
				for(var j = 0; j < fileList.length; j++) {
					if(fileList[j].response) {
						arr1.push(fileList[j].response.url)
					}

				}
				this.picList = arr;
				this.uppicList = arr1
			},
			beforeFileRemove(file, fileList) {
				if(this.isFormat==true){
					return this.$confirm(`确定移除 ${ file.name }？`);
				}
				

			},
			// handleFileExceed(files, fileList) {
			// 	this.$message.warning(`当前限制只能上传 30 个文件`);

			// },
			deforeUpload(file) {
				const fileExt = file.name.substring(file.name.lastIndexOf("."), file.name.length).toUpperCase();
				const isLt2M = file.size / 1024 / 1024 < 2;
				let isFormat = true;
				this.uploadFile.type = fileExt;
				if(fileExt != ".PNG" && fileExt != ".GIF" && fileExt != ".JPG" && fileExt != ".JPEG" && fileExt != ".BMP") {
					this.$message.closeAll()
					this.$message.error('上传图片格式不对!');
					isFormat = false;
					this.isFormat=isFormat
				}
				if(!isLt2M) {
					this.$message.closeAll()
					this.$message.error('上传图片大小不能超过 2MB!');
					isFormat = false;
					this.isFormat=isFormat
				}
				return isFormat;
				
			},

			gradeClass() {
				let that = this;
				getCommHttpData({
					url: 'common/queryGradeAndClassByUser',
					method: 'get',
					contentType: 1,
					data:{
						yearTermId:'0'
					},
				}, function(data) {
					that.theGcoption = data.list;
					that.getalbum()
				})
			},
			getType() {
				getCommonDictByType(this, 'album_type', 'typeList');
			},
			getalbum() {
				let that = this;
				if(this.theType == 2) {
					if(this.theGcoption[parseInt(this.gradeClassId)] != undefined){
						var gradeId = this.theGcoption[this.gradeClassId].gradeId
					}else{
						var gradeId=undefined
					}	
				} else {
					var gradeId = undefined
				};
				if(this.theType == 2) {
					if(this.theGcoption[parseInt(this.gradeClassId)] != undefined){
						var classId = this.theGcoption[this.gradeClassId].classId
					}else{
						var classId = undefined
					}
					
				} else {
					var classId = undefined
				};
				getCommHttpData({
					url: 'cms/album/list',
					method: 'get',
					contentType: 1,
					data: {
						albumType: this.theType,
						gradeId: gradeId,
						classId: classId,
						keywords: this.msg,
						page: this.pageIndex,
						size: this.pageSize,
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.list.list.length == 0 && that.pageIndex != 1) {
								that.pageIndex = 1
								that.getalbum()
						}
						let list = data.list.list
						list = list.map(item=>{
							item.albumCover = !!item.albumCover ? that.baseIp+item.albumCover : require('../../../assets/img/album.jpg')
							return item
						})
						that.albumList = list						
						that.totalPage = data.list.totalCount					} else {
						that.albumList = []
						that.totalPage = 0
					}
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getalbum()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getalbum()
			},
			delAlbum(parme, index) {
				let self = this;
				this.$confirm('确定要删除该相册吗？', '系统提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(_ => {
					this.getCommHttpData({
						url: 'cms/album/delete?albumId=' + parme,
						method: 'get',
						contentType : 2
					}, res => {
						self.albumList.splice(index, 1)
						self.$message.success('删除成功！')
					})
				})
			},
			addAmblum() {
				this.$refs['albumForm'].validate((valid) => {
					if(valid) {
						let that = this;
						if(this.form.region == 2) {
							var gradeId = this.theGcoption[this.form.gradeClassId].gradeId
						} else {
							var gradeId = undefined
						};
						if(this.form.region == 2) {
							var classId = this.theGcoption[this.form.gradeClassId].classId
						} else {
							var classId = undefined
						};
						getCommHttpData({
							url: 'cms/album/save',
							method: 'post',
							contentType: 2,
							data: {
								gradeId: gradeId,
								classId: classId,
								albumType: this.form.region,
								albumName: this.form.name,
								isStick: this.form.radio,
							},
						}, function(data) {
							if(data.code == 0) {
								that.$message({
									message: '创建成功',
									type: 'success'
								});
								that.dialogFormVisible = false;
								that.getalbum()
							}
						})
					}
				})
			},
			theUpload(row) {
				this.uppicList = [];
				this.imgUpload = true;
				this.albumId = row;
				let that = this;
				getCommHttpData({
					url: 'cms/album/albumById',
					method: 'get',
					contentType: 1,
					data: {
						albumId: row,
					},
				}, function(data) {
					if(data.code == 0) {
						that.theAllpic = [];
						data.list.imgPathList.forEach((item, index) => {
							that.theAllpic.push({
								name: item.path,
								url: that.baseIp + item.path,
								relId: item.relId
							})
						})
					}
				})
			},
			showAlbum(row, name) {
				this.goPreview = true;
				this.tittleName = name;
				let that = this;
				getCommHttpData({
					url: 'cms/album/albumById',
					method: 'get',
					contentType: 1,
					data: {
						albumId: row,
					},
				}, function(data) {
					if(data.code == 0) {
						that.imgShow = data.list.imgPathList
					}
				})
			},
			submit() {
				let that = this;
				var obj = [];
				for(var i = 0; i < this.uppicList.length; i++) {
					obj.push({
						path: this.uppicList[i]
					})
				}
				getCommHttpData({
					url: 'cms/album/uploadImg',
					method: 'post',
					contentType: 2,
					data: {
						albumId: this.albumId,
						imgPathList: obj
					},
				}, function(data) {
					that.imgUpload = false;
					//					if(data.code == 0) {

					that.getalbum();
					//					}

				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.the_imgs {
		position: relative;
		cursor: pointer;
	}

	.the_class {
		position: absolute;
		left: 0;
		right: 0;
		top: 80px;
		bottom: 0;
		height: 30px;
		text-align: center;
	}

	.the_imgs {
		.word {
			width: "100%";
			text-align: center;
			padding-top: 10px;
			padding-bottom: 10px;
			background: #3C85EE;
			color: white;
			font-size: 18px;
		}
	}

	.the_imgs .the_class {
		display: none;
	}

	.the_imgs:hover .the_class {
		display: block;
	}
  .the_contain,.el-carousel__item{
    text-align: center;
  }
  .el-carousel__item{
     display: flex;
    justify-content: center;
    align-items: center;
  }
  .only-one-par{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
