<template>
	<div class="publishing_information">
		<el-card>
			<el-form ref="form" :model="form" label-width="120px" :rules="rules">
				<el-form-item label="所属栏目：" prop="gradeClassId" v-if="form.theType==2002">
                    <el-select v-model="form.gradeClassId" clearable placeholder="请选择年级班级" style="margin-right: 10px;width:300px;" @change="gradeClass">
                        <el-option v-for="(item,index) in theGcoption" :key="index" :label="item.gradeName+item.className" :value="index"></el-option>
                    </el-select>
                    <el-select v-model="form.classType" placeholder="请选择班级资讯类型" clearable style="width:200px;">
                        <el-option v-for="item in classTypelist" :key="item.value" :label="item.dictName" :value="item.value"></el-option>
                    </el-select>
				</el-form-item>

				<el-form-item label="资讯标题：" prop="tittle">
					<el-input v-model="form.tittle" type="text" placeholder="请输入资讯标题" style="width:300px;"></el-input>
				</el-form-item>
				<el-form-item label="资讯内容：" prop="ueContent" :rules="[{ required: true, message: '请输入资讯内容', trigger: 'blur' }]" v-if="newsType == 1">
					<script :id="ueId" class="ueditor-box" type="text/plain" style="width: 100%; height: 260px;">
						<div v-model="form.ueContent"></div>
					</script>
				</el-form-item>

                <div v-if="newsType == 2">
                    <el-form-item label="资讯链接：" prop="url" >
                        <el-input v-model="form.url" placeholder="请输入链接地址" style="width:80%;"></el-input>
                        <el-button type="primary" @click="handPreview" :disabled="!form.url">预览</el-button>
                    </el-form-item>
                    <el-form-item label="资讯内容：" v-if="isShowView">
                        <iframe id="newsFrame" :src="frameSrc" frameborder="0" width="100%" style="border:1px solid #DCDFE6;height:300px;"></iframe>
                    </el-form-item>
                </div>

				<uploadpic ref="uploadpic" label="上传封面：" @refreshDataList="getPicSrc" v-model="form.picSrc"></uploadpic>
                <el-form-item label="资讯关键字：" prop="keyword">
					<el-input v-model="form.keyword" placeholder="请输入关键字"></el-input>
				</el-form-item>
				<el-form-item label="是否置顶：">
					<el-radio v-model="radio" label="1">是</el-radio>
					<el-radio v-model="radio" label="2">否</el-radio>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="addCeefax">提交</el-button>
					<el-button @click="cancel">取消</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
import ueditor from 'ueditor'
import Uploadpic from '../common/uploadpic'
export default {
    data() {
        return {
            form: {
                theType: 2001,
                classType: '',
                gradeClassId: undefined,
                tittle: '',
                keyword: '',
                picSrc: '',
                ueContent: '',
                url : '',
            },
            typeList: [],
            classTypelist: [],
            theGcoption: [],
            ue: null,
            ueId: `J_ueditorBox_${new Date().getTime()}`,
            newsType : 0,
            frameSrc : '',
            isShowView : false,

            radio: "2",
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
                }]
            }

        }
    },
    
    components: { Uploadpic },

    mounted() {
        if (this.newsType == 1) {
            this.ue = ueditor.getEditor(this.ueId, {
                toolbars: [
                    ['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset',
                        'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', 'link', 'inserttable', 'justifyleft', 'justifyright','justifycenter','justifyjustify','insertimage'
                    ]
                ],
                elementPathEnabled : false
            });
        }
        this.$nextTick(() => {
            this.$refs.uploadpic.picList = []
        })
    },

    created() {
        this.form.theType = this.$route.query.theType;
        this.newsType = this.$route.query.mark
        this.getType();
        this.getclassType();
        this.gradeClass()
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
                this.$router.push({ name : 'class-card-ceefax' })
            }else {
                this.$router.push({ name : 'class-card-ceefax-class' })
            }
        },

        getPicSrc(picSrc) {
            this.form.picSrc = picSrc;
        },

        getType() {
            this.getCommonDictByType(this, 'information_type', 'typeList');
        },

        getclassType() {
            this.getCommonDictByType(this, '2002', 'classTypelist');
        },

        gradeClass() {
            let that = this;
            this.getCommHttpData({
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
                    let that = this, gradeId = undefined, classId = undefined
                    if(this.form.theType == 2002) {
                        gradeId = this.theGcoption[this.form.gradeClassId].gradeId
                        classId = this.theGcoption[this.form.gradeClassId].classId
                    }

                    this.getCommHttpData({
                        url: 'cms/information/save',
                        method: 'post',
                        contentType: 2,
                        data: {
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
                    }, res => {
                        if(res.code == 0) {
                            that.$message.success('操作成功')
                            if (that.form.theType == 2002) {
                                that.$router.push({ name: 'class-card-ceefax-class' })
                            }else {
                                that.$router.push({ name: 'class-card-ceefax' })
                            }
                        }
                    })
                }
            })
        }
    }
}
</script>