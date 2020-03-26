<template>
	<div class="publishing_information" contenteditable="false">
		<el-card>
			<el-form ref="form" :model="form" label-width="120px" :rules="rules">
				<el-form-item label="所属栏目：" v-if="form.theType==2002" prop="theType">
                    <el-select v-model="form.theType" placeholder="请选择图文资讯类型" clearable style="width:230px;margin-right: 3px;" :disabled="isView">
                        <el-option v-for="item in typeList" :key="item.value" :label="item.dictName" :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="form.classType" placeholder="请选择图文资讯班级类型" clearable style="width:250px;margin-right: 3px;" :disabled="isView">
                        <el-option v-for="item in classTypelist" :key="item.value" :label="item.dictName" :value="item.value"></el-option>
                    </el-select>
				</el-form-item>
				<el-form-item label="所属班级：" v-if="form.theType==2002" prop="gradeClassId">
					<el-select v-model="form.gradeClassId" clearable placeholder="请选择年级班级" style="width:230px;margin-right: 10px;" :disabled="isView">
						<el-option v-for="(item,index) in theGcoption" :key="index" :label="item.gradeName+item.className" :value="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="资讯标题：" prop="tittle">
					<el-input v-model="form.tittle" type="text" :disabled="isView"></el-input>
				</el-form-item>
				<el-form-item label="资讯内容：" prop="ueContent" :rules="[{ required: true, message: '请输入资讯内容', trigger: 'blur' }]" v-if="newsType == 1">
					<script :id="ueId" ref="theUedior" class="ueditor-box" type="text/plain" style="width: 100%; height: 260px;">
						<div v-model="form.ueContent"></div>
					</script>
				</el-form-item>

                <div v-if="newsType == 2">
                    <el-form-item label="资讯链接：" prop="url" >
                        <el-input v-model="form.url" placeholder="请输入链接地址" style="width:80%;" :disabled="isView"></el-input>
                        <el-button type="primary" @click="handPreview" :disabled="!form.url">预览</el-button>
                    </el-form-item>
                    <el-form-item label="资讯内容：" v-if="isShowView">
                        <iframe id="newsFrame" :src="frameSrc" frameborder="0" width="100%" style="border:1px solid #DCDFE6;height:300px;"></iframe>
                    </el-form-item>
                </div>

				<uploadpic ref="uploadpic" label="上传封面：" @refreshDataList="getPicSrc" v-model="form.picSrc" :disabled="isView"></uploadpic>
                <el-form-item label="资讯关键字：" prop="keyword">
					<el-input v-model="form.keyword" :disabled="isView"></el-input>
				</el-form-item>
				<el-form-item label="是否置顶：">
					<template>
						<el-radio v-model="radio" label="1" :disabled="isView">是</el-radio>
						<el-radio v-model="radio" label="2" :disabled="isView">否</el-radio>
					</template>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="addCeefax" v-if="!isView">提交</el-button>
					<el-button @click="cancel">取消</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
import Uploadpic from '../common/uploadpic'
import { setTimeout } from 'timers';
export default {
    data() {
        return {
            baseIp: window.SITE_CONFIG.imgIP,
            informationId: '',
            form: {
                theType: '',
                classType:undefined,
                gradeClassId: '',
                tittle: '',
                keyword: '',
                picSrc: '',
                ueContent: '',
                url : '',
            },
            newsType : 1,
            frameSrc : '',
            isShowView : false,

            typeList: [],

            classTypelist: [],

            theGcoption: [],
            ue: null,
            ueId: `J_ueditorBox_${new Date().getTime()}`,
            radio: '2',
            rules: {
                theType: [{
                    required: true,
                    message: '请选择图文资讯类型',
                    trigger: 'change'
                }],
                classType: [{
                    required: true,
                    message: '请选择图文资讯班级类型',
                    trigger: 'change'
                }],
                gradeClassId: [{
                    required: true,
                    message: '请选择年级班级',
                    trigger: 'change'
                }],
                tittle: [{
                    required: true,
                    message: '请输入资讯标题',
                    trigger: 'blur'
                }],
                url: [{
                    required: true,
                    message: '请输入链接地址',
                    trigger: 'blur'
                }],

                picSrc: [{
                    required: true,
                    message: '请选择图片',
                    trigger: 'change'
                }],
            },
            isView : false
        }
    },
    components: {
        Uploadpic
    },
    mounted() {
        if (this.newsType == 1) {
            this.ue = UE.getEditor(this.ueId, {
                autoHeightEnabled: true,
                autoFloatEnabled: true,
                elementPathEnabled : false,
                toolbars: [
                    ['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset',
                        'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', 'link', 'inserttable', 'justifyleft', 'justifyright','justifycenter','justifyjustify','insertimage'
                    ]
                ]

            })
        }
        if (this.$route.query.isView == '1') {
            this.isView = true
        }
    },

    created() {
        this.informationId = this.$route.query.informationId;
        this.getType();
        this.getclassType();
        this.getEdit();
    },
    methods: {
        handPreview() {
            let reg = /^(http:\/\/|https:\/\/)/g
            if (reg.test(this.form.url)) {
                this.frameSrc = this.form.url
                this.isShowView = true
            }else {
                this.isShowView = false
                this.$message.closeAll()
                this.$message.error('请输入正确的url地址！')
            }
        },
        cancel() {
            if (this.form.theType == 2001) {
                this.$router.push({
                    name : 'class-card-ceefax'
                })
            }else {
                this.$router.push({
                    name : 'class-card-ceefax-class'
                })
            }
            
        },
        getPicSrc(picSrc) {
            this.form.picSrc = picSrc;
        },
        getType() {
            getCommonDictByType(this, 'information_type', 'typeList');
        },
        getclassType() {
            getCommonDictByType(this, '2002', 'classTypelist');
        },
        getEdit() {
            let that = this;
            getCommHttpData({
                url: 'cms/information/informationById',
                method: 'get',
                contentType: 1,
                data: {
                    informationId: this.informationId
                },
            }, function(data) {
                that.form.theType = data.list.informationType;
                that.$nextTick(_ => { that.newsType = data.list.contentType})
                that.form.url = that.frameSrc = data.list.url
                that.form.classType = data.list.informationClassType?data.list.informationClassType:'';
                that.form.tittle = data.list.informationTitle;
                that.form.keyword = data.list.informationKeyword;
                that.radio = (data.list.isStick).toString();
                if(data.list.informationCover != "") {
                    that.$refs.uploadpic.picList = [{
                        name: data.list.informationCover,
                        url: that.baseIp + data.list.informationCover
                    }]
                }
                that.form.picSrc = data.list.informationCover

                if (data.list.contentType == 1) {
                    that.ue.ready(() => {
                        that.ue.setContent(data.list.informationContent)
                        that.$route.query.isView == '1' && (that.ue.setDisabled())
                    })
                }

                getCommHttpData({
                    url: 'common/queryGradeAndClassByUser',
                    method: 'get',
                    contentType: 1,
                }, res => {
                    that.theGcoption = res.list;
                    for(let i = 0; i < that.theGcoption.length; i++) {
                        if(that.theGcoption[i].gradeId == data.list.gradeId && that.theGcoption[i].classId == data.list.classId) {
                            that.form.gradeClassId = i
                        }
                    }
                })

            })
        },
        gradeClass() {
            let that = this;
            getCommHttpData({
                url: 'common/queryGradeAndClassByUser',
                method: 'get',
                contentType: 1,
            }, function(data) {
                that.theGcoption = data.list;
            })
        },
        addCeefax() {
            if (this.newsType == 1) {
                this.ue.ready(() => {
                    this.form.ueContent = this.ue.getContent()
                    if(this.ue.getContent().length > 10000){
                        this.$message.error('资讯内容文字长度不能大于10000')
                        return
                    }	
                })
            }

            this.$refs['form'].validate((valid) => {
                if(valid) {
                    let that = this;

                    if(this.form.theType == 2002) {
                        var gradeId = this.theGcoption[this.form.gradeClassId].gradeId;
                    } else {
                        var gradeId = undefined
                    };

                    if(this.form.theType == 2002) {
                        var classId = this.theGcoption[this.form.gradeClassId].classId;
                    } else {
                        var classId = undefined
                    };
                    getCommHttpData({
                        url: 'cms/information/update',
                        method: 'post',
                        contentType: 2,
                        data: {
                            informationId: this.informationId,
                            informationType: this.form.theType,
                            informationClassType: this.form.classType,
                            informationTitle: this.form.tittle,
                            informationKeyword: this.form.keyword,
                            informationContent: this.form.ueContent,
                            isStick: this.radio,
                            application: 1,
                            gradeId: gradeId,
                            classId: classId,
                            informationCover: this.form.picSrc,
                            contentType : this.newsType,
                            url : this.form.url
                        },
                    }, function(data) {
                        if(data.code == 0) {
                            that.$message({
                                type: 'success',
                                message: '操作成功!'
                            })
                            if (that.form.theType == 2002) {
                                that.$router.push({
                                    name: 'class-card-ceefax-class'
                                });
                            }else {
                                that.$router.push({
                                    name: 'class-card-ceefax'
                                });
                            }
                            
                        };
                    })
                }
            })

        }
    }
}
</script>
