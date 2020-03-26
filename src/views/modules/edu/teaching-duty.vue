<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">
    <div class="content-box">
      <div class="left-box">
        <!-- <div class="left-title"></div> -->
        <!-- <el-card class="equip-cont" shadow="hover"> -->
        <div class="list-title"><span class="list-text">教学职位</span><span class="list-value">人数（人）</span></div>
        <template v-for="item in rTypeOptions">
          <div class="list-div" :class="{'list-active':rangeType==item.rangeType}" @click="rangeChange(item.rangeType)"><span
              class="list-text">{{item.rangeTypeName}}</span><span class="list-value">{{item.rangeNum}}</span></div>
        </template>
        <!-- </el-card> -->
      </div>
      <el-row v-loading="dataListLoading" :gutter="12" style="margin-bottom: 20px;" class="right-box">
        <el-col :span="24" style="margin-bottom: 10px;">
          <template v-if="rangeType == 103">
            <grade ref="grade" @refreshDataList="getGradeId"></grade>
          </template>
          <template v-else-if="rangeType == 102">
            <grade ref="grade" @refreshDataList="getGradeId"></grade>
            <class ref="class" :gradeId="gradeId" @refreshClassList="getClassId"></class>
          </template>
          <template v-else-if="rangeType == 105">
            <el-select v-model="subjectId" clearable @change="getList" placeholder="请选择科目">
              <el-option v-for="item in subjectList" :key="item.subjectId" :label="item.subjectName" :value="item.subjectId">
              </el-option>
            </el-select>
          </template>
          <template v-else-if="rangeType == 106">
            <grade ref="grade" @refreshDataList="getGradeId"></grade>
            <el-select v-model="subjectId" clearable @change="getList" placeholder="请选择科目">
              <el-option v-for="item in subjectList" :key="item.subjectId" :label="item.subjectName" :value="item.subjectId">
              </el-option>
            </el-select>
          </template>
          <template v-else>
            <grade ref="grade" @refreshDataList="getGradeId"></grade>
            <class ref="class" :gradeId="gradeId" @refreshClassList="getClassId"></class>
            <el-select v-model="subjectId" clearable @change="getList" placeholder="请选择科目">
              <el-option v-for="item in subjectList" :key="item.subjectId" :label="item.subjectName" :value="item.subjectId">
              </el-option>
            </el-select>
          </template>
          <el-button type="primary" @click="handleCreate(0,1)">添加</el-button>
          <div class="right ">
            职位权限：
            <template v-if="roleIdList.length == 0">
              <font color="red">暂未设置</font>
            </template>
            <template v-else>
              <template v-for="item in roleListChecks">
                <template v-for="itemid in roleIdList">
                  <template v-if="itemid == item.roleId">
                    {{item.roleName}}
                  </template>
                </template>
              </template>
            </template>
            <el-button type="text" icon="el-icon-edit" circle @click="handleCreateSetting" :addLoading="false"></el-button>
          </div>
        </el-col>
        <el-col :lg="4" :md="8" :sm="8" :xs="4" v-for="(item, index) in dataList" :key="index" style="margin-bottom: 10px;">
          <el-card :body-style="{ padding: '0px' }" class="equip-cont">
            <img v-if="item.teacherName == null" src="~@/assets/img/pic_default-no.jpg" />
            <template v-else>
              <template v-if="item.icon==''||item.icon == null">
                <img src="~@/assets/img/pic_default.jpg" />
              </template>
              <template v-else>
                <img v-if="isHasImg(imgIp+item.icon)" :src="imgIp+item.icon" />
                <img v-else src="~@/assets/img/pic_default.jpg" />
              </template>
            </template>
            <!-- <img v-if='isHasImg(imgIp+item.icon)'/>
            <img v-else v-buffer-img:3="item.icon==''||item.icon == null ? picDefault : imgIp+item.icon" src="~@/assets/img/pic_default.jpg" />
 -->            <!-- <el-image
                  style="width: 90%; height: 200px"
                  :src="item.icon==''? picDefault : imgIp+item.icon"
                  fit="cover"></el-image> -->
            <div class="margin-bottom-10">
              <template v-if="rangeType != 105">
                {{item.gradeName}}
              </template>
              <template v-if="rangeType == 101 || rangeType == 102">
                {{item.className | numberFormat}}
              </template>
              <template v-if="rangeType == 101 || rangeType == 105 || rangeType == 106">
                {{item.subjectName | numberFormat}}
              </template>
             <!-- <template v-if="rangeType == 103">
                {{item.gradeName}}
              </template>
              <template v-else-if="rangeType == 102">
                {{item.gradeName}}{{item.className | numberFormat}}
              </template>
              <template v-else-if="rangeType == 105">
                {{item.subjectName | numberFormat}}
              </template>
              <template v-else-if="rangeType == 106">
                {{item.gradeName}}{{item.subjectName | numberFormat}}
              </template>
              <template v-else>
                {{item.gradeName}}{{item.className | numberFormat}}{{item.subjectName | numberFormat}}
              </template> -->
              <template v-if="item.teacherName != null">- {{item.teacherName | numberFormat}}</template>
            </div>
            <div class="equip-btn-group1" v-if="item.teacherName == null">
              <el-button type="primary" class="btn-tip" size="mini" @click="handleCreate(item,2)" style="width: 100px;margin-bottom: 15px;">设置任职</el-button>
            </div>
            <div class="equip-btn-group" v-else>
              <el-button type="text" class="setting" size="mini" @click="submitDelete(item.rangeId,item.teacherName)"
                style="width: 100px;margin-bottom: 15px;">取消任职</el-button>
              <el-button type="primary" class="btn-tip" size="mini" @click="handleUpdate(item)" style="width: 100px;margin-bottom: 15px;">变更任职</el-button>
              <el-button type="success" class="btn-tip" size="mini" @click="handleLook(item)" style="width: 100px;margin-bottom: 15px;">详情</el-button>
            </div>
          </el-card>
        </el-col>
        <!-- <el-col :lg="4" :md="8" :sm="8" :xs="12" style="margin-bottom: 10px;" >
          <el-card class="equip-cont" shadow="hover" >
            <div @click="handleCreate" style="text-align: center;" >
              <img src="~@/assets/img/add.png" />
            </div>
          </el-card>
        </el-col> -->
        <el-col :span="24" v-if="dataList.length ==0" style="height: 280px;">
          <el-card style="width:100%;height: 100%;" shadow="hover">
            <img src="~@/assets/img/nodata.png" class="image" style="width:180px;display:block;margin: 40px auto;">
          </el-card>
        </el-col>
        <el-col :span="24">
          <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[12, 24, 60, 120]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <!--添加编辑-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <template v-if="dialogStatus == 'look'">
        <div style="position: absolute; right: 10px; top: 50px;">
          <el-button type="primary" @click="handleUpdate(dataFormInfo)">变更任职</el-button>
          <el-button type="danger" @click="submitDelete(dataFormInfo.rangeId,dataFormInfo.teacherName)" style="margin-left:10px;">取消任职</el-button>
        </div>
      </template>
      <el-form :inline="true" :rules="rules" ref="dataForm" :model="dataForm" label-position="right" label-width="100px">
        <!-- <el-form-item label="" prop="userId" > -->

        <div style="text-align:center;">
          <template v-if="dialogStatus == 'look'">
            <div class="margin-bottom-10">
              <img v-real-img="dataFormInfo.icon==''? picDefault : imgIp+dataFormInfo.icon" src="~@/assets/img/pic_default.jpg"
                width="180px" height="auto" />

            </div>
            <div class="margin-bottom-10">
              <template v-if="rangeType != 105">
                {{dataFormInfo.gradeName}}
              </template>
              <template v-if="rangeType == 101 || rangeType == 102">
                {{dataFormInfo.className}}
              </template>
              <template v-if="rangeType == 105 || rangeType == 106 || rangeType == 101 ">
                {{dataFormInfo.subjectName || '暂无'}}
              </template>
              <template v-if="dataFormInfo.teacherName != null">- {{dataFormInfo.teacherName}}</template>
            </div>
          </template>
          <template v-else>
            <div class="margin-bottom-10">
              <img v-real-img="dataForm.icon==''? picDefault : imgIp+dataForm.icon" src="~@/assets/img/pic_default.jpg"
                width="180px" height="auto" />
            </div>
            <el-select class="margin-bottom-10" v-model="dataForm.userId" @change="getTeacherIcon" remote
              reserve-keyword :remote-method="getTeacherList" filterable :loading="techerLoading" clearable placeholder="请选择教师">
              <el-option v-for="(item,index) in teacherList" :key="item.userId" :label="item.teacherName" :value="item.userId">
              </el-option>
            </el-select>
            <div class="margin-bottom-20">注：头像为教职工档案中的头像。</div>
          </template>
        </div>
        <template v-if="dialogStatus == 'look'">
          <el-col :span="8" :offset="4" class="margin-bottom-10">电话：{{dataFormInfo.telPhone || '/'}}</el-col>
          <el-col :span="8" class="margin-bottom-10">已任职：{{dataFormInfo.appointment || '/'}}</el-col>
          <el-col :span="8" :offset="4" class="">职位：{{dataFormInfo.rangeTypeName}}/
            <template v-if="rangeType != 105">
              {{dataFormInfo.gradeName}}
            </template>
            <template v-if="rangeType == 101 || rangeType == 102">
              {{dataFormInfo.className}}
            </template>
            <template v-if="rangeType == 105 || rangeType == 106 || rangeType == 101 ">
              {{dataFormInfo.subjectName || '暂无'}}
            </template>
          </el-col>
          <el-col :span="8" class="">聘任日期：
            <template v-if="dataFormInfo.appointmentDate == null || dataFormInfo.appointmentDate == ''">
              /
            </template>
            <template v-else>
              {{dataFormInfo.appointmentDate}}起
            </template>
          </el-col>
        </template>
        <template v-else>
          <el-form-item class="form-inline" label="职位" prop="rangeType" :rules="[{ required: true, message: '不能为空', trigger: 'change' }]">
            <el-select v-model="dataForm.rangeType" placeholder="请选择职位">
              <el-option v-for="item in rTypeOptions" :key="item.rangeType" :label="item.rangeTypeName" :value="item.rangeType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="form-inline" v-if="dataForm.rangeType != 105" label="" prop="gradeId" :rules="[{ required: true, message: '不能为空', trigger: 'change' }]">
            <grade ref="gradeForm" @refreshDataList="getGradeIdForm" :require="false"></grade>
          </el-form-item>
          <el-form-item class="form-inline" v-if="dataForm.rangeType == 101 || dataForm.rangeType == 102" label="" prop="classId"
            :rules="[{ required: true, message: '不能为空', trigger: 'change' }]">
            <class ref="classForm" :gradeId="dataForm.gradeId" @refreshClassList="getClassIdForm"></class>
          </el-form-item>
          <el-form-item class="form-inline" v-if="dataForm.rangeType == 105 || dataForm.rangeType == 106 || dataForm.rangeType == 101 "
            label="科目" prop="subjectId" :rules="[{ required: true, message: '不能为空', trigger: 'change' }]">
            <el-select v-model="dataForm.subjectId" placeholder="请选择科目">
              <el-option v-for="item in subjectList" :key="item.subjectId" :label="item.subjectName" :value="item.subjectId">
              </el-option>
            </el-select>
          </el-form-item>
          <br />
          <el-form-item label="聘任日期" prop="appointmentDate">
            <el-date-picker v-model="dataForm.appointmentDate" style="width:200px" :picker-options="pickerOptions"
              value-format='yyyy-MM-dd' type="date" placeholder="请选择日期" class="el-input-width">
            </el-date-picker>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus !='look'" @click="handleCloseDiaLog">取消</el-button>
        <el-button type="primary" v-if="dialogStatus=='create'" @click="createData(0)" :loading="addLoading">保存</el-button>
        <el-button type="primary" v-if="dialogStatus=='create'" @click="createData(1)" :loading="addLoading">保存并继续添加</el-button>
        <el-button type="primary" v-else-if="dialogStatus=='update'" @click="updateData" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>
    <!--添加编辑-->
    <el-dialog title="设置职位权限" :visible.sync="dialogSettingVisible">
      <div class="margin-bottom-20">请设置职位的默认角色，设置后职位成员默认拥有此角色权限。</div>
      <el-form :inline="true" :rules="rulesSetting" ref="dataFormSetting" :model="dataFormSetting" label-position="right"
        label-width="100px">
        <el-form-item label="" prop="roleIds">
          <el-checkbox-group v-model="dataFormSetting.roleIds" size="small">
            <el-col style="margin-top: 5px;" :lg="6" v-for="(role, i) in roleListChecks" :key="role.roleId">
              <el-checkbox style="margin-left: 10px;" :label="role.roleId" border>{{role.roleName}}</el-checkbox>
            </el-col>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSettingVisible=false">取消</el-button>
        <el-button type="primary" v-if="dialogStatusSetting=='create'" @click="createDataSetting" :loading="addLoading">确定</el-button>
        <el-button type="primary" v-else-if="dialogStatusSetting=='update'" @click="createDataSetting" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {
    getCommHttpData,
    getCommonDictByType,
    getExportFile,
    deleteData
  } from '@/utils/common'
  import Grade from '../common/grade'
  import Class from '../common/class'
  import LabelDialog from './label-dialog'
  import picDefault from '@/assets/img/pic_default.jpg'
  export default {
    data() {
      return {
        isChecked: false,
        dialogDelete: false,
        deleteId: '',
        userType: this.GLOBAL.userType,
        schoolId: this.GLOBAL.getOrgId(),
        imgIp: window.SITE_CONFIG.imgIP,
        picDefault: picDefault,
        rangeType: 103,
        list: null,
        row: [],
        gradeId: '',
        classId: '',
        subjectId: '',
        dataList: [],
        dataListLoading: false,
        listLoading: false,
        techerLoading: false,
        schoolType: 0,
        rTypeOptions: [],
        gradeIsOptions: null,
        inputVisible: false,
        inputValue: [],
        applicationTags: [],
        isDisabled: false,
        pageIndex: 1,
        pageSize: 12,
        totalPage: 0,
        addOrUpdateVisible: false,
        subjectList: [],
        teacherList: [],
        roleListChecks: [],
        roleIdList: [],
        dataFormInfo: {
          teacherName: '',
          gradeName: '',
          className: '',
          subjectName: '',
          phone: ''
        },
        dataForm: {
          rangeId: undefined,
          schoolId: this.GLOBAL.getOrgId(),
          userId: '',
          teacherName: '',
          index: '',
          icon: '',
          rangeType: this.rangeType,
          gradeId: '',
          classId: undefined,
          subjectId: undefined,
          appointmentDate: undefined
        },
        dataFormSetting: {
          schoolId: this.GLOBAL.getOrgId(),
          rangeType: this.rangeType,
          roleIds: []
        },
        rulesSetting: {
          roleIds: [{
            required: false,
            message: '不能为空',
            trigger: 'change'
          }]
        },
        addLoading: false,
        keywords: '',
        value6: true,
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
        tagTemp: [],
        tagName: [],
        mainDisabled: false,
        rules: {
          subName: [{
              required: true,
              message: '不能为空',
              trigger: 'blur'
            },
            {
              max: 10,
              message: '科目名称不能超过10个字！',
              trigger: 'blur'
            }
          ],
          appointmentDate: [{
            required: false,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        dialogSettingVisible: false,
        dialogStatusSetting: '',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        }
      }
    },
    filters:{
    	numberFormat(value){
    		let result = (value && value.length>3)?`${value.substr(0,3)}...`:value;
    		  return result;
    	},
    },
    created() {
      this.getList();
      this.getSubjectList()
      this.getTeacherList()
      this.getRoleList()
      this.getRoleListLeft()
      //getCommonDictByType(this, 'range_type', 'rTypeOptions')
    },
    components: {
      LabelDialog,
      Grade,
      Class
    },
    methods: {
      rangeChange(rangeType) {
        this.rangeType = rangeType

        this.$nextTick(() => {
          if (rangeType != 105) {
            this.$refs.grade.gradeId = ''
          }
          if (rangeType == 101 || rangeType == 102) {
            this.$refs.class.classId = ''
          }
          if (rangeType == 105 || rangeType == 106 || rangeType == 101) {

          }
          this.subjectId = ''
          this.gradeId = ''
          this.classId = ''
          this.getList()
        })

      },
      getRoleListLeft() {
        let that = this
        getCommHttpData({
          url: 'eduManageRange/queryRangeNum',
          method: 'get',
          contentType: 1,
          data: {}
        }, function(data) {
          that.rTypeOptions = data.list
        })
      },
      getSubjectList() {
        let that = this
        getCommHttpData({
          url: 'common/querySubjectList',
          method: 'get',
          contentType: 1,
          data: {
            schoolId: this.schoolId
          }
        }, function(data) {
          that.subjectList = data.list
        })
      },
      getTeacherList(query) {
        let that = this
        getCommHttpData({
          url: 'common/queryTeacherList',
          method: 'get',
          contentType: 1,
          data: {
            schoolId: this.schoolId,
            keywords: query
          }
        }, function(data) {
          that.teacherList = data.list
        })
      },
      getRoleList() {
        let that = this
        getCommHttpData({
          url: 'uc/role/select',
          method: 'get',
          contentType: 1,
          data: {
            userType: 2
          }
        }, function(data) {
          if (data && data.code === 0) {
            that.roleListChecks = data.list

          } else {
            that.roleListChecks = []
          }
        })
      },
      getGradeId(val) {
        this.gradeId = val
        this.getList()
      },
      getClassId(val) {
        this.classId = val
        this.getList()
      },
      getGradeIdForm(val) {
        this.dataForm.gradeId = val
      },
      getClassIdForm(val) {
        this.dataForm.classId = val
      },
      getTeacherIcon() {
        if (this.dataForm.index == undefined || this.dataForm.index == '') {
          this.dataForm.icon = ''
        } else {
          this.dataForm.icon = this.teacherList[this.dataForm.index].icon
        }
      },
      labelList(val) {
        this.applicationTags = val;
      },
      handleClose(tag) {
        this.applicationTags.splice(this.applicationTags.indexOf(tag), 1);
      },
      showInput() {

      },
      // 新增 / 修改
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.labelDialog.init(this.applicationTags)
        })
      },
      changeSatus(row) {
        let that = this
        getCommHttpData({
          url: 'eduManageSubject/updateStatus',
          method: 'post',
          contentType: 2,
          data: {
            schoolId: row.schoolId,
            subjectId: row.subjectId,
            status: row.status
          }
        }, function(data) {
          that.$message({
            type: 'success',
            message: '操作成功!'
          });
          that.getList()
        })
      },
      getList() {
        //	this.listLoading = true
        let that = this
        let keywords = this.keywords.length == 0 ? undefined : this.keywords
        let gradeId = this.gradeId.length == 0 ? undefined : this.gradeId
        let classId = this.classId.length == 0 ? undefined : this.classId
        let subjectId = this.subjectId.length == 0 ? undefined : this.subjectId
        getCommHttpData({
          url: 'eduManageRange/list',
          method: 'post',
          contentType: 2,
          data: {
            page: this.pageIndex,
            limit: this.pageSize,
            schoolId: this.schoolId,
            rangeType: this.rangeType,
            keywords: keywords,
            gradeId: gradeId,
            classId: classId,
            subjectId: subjectId

          }
        }, function(data) {
          if (data && data.code === 0) {
            if (data.page.list.length == 0 && that.pageIndex != 1) {
              that.pageIndex = 1
              that.getList()
            }
            let temArr = []
            if (data.roleList.length > 0) {
              data.roleList.forEach(item => {
                temArr.push(item.roleId.toString())
              })
            }
            that.roleIdList = temArr
            that.dataList = data.page.list
            that.totalPage = data.page.totalCount
          } else {
            that.dataList = []
            that.totalPage = 0
          }
          that.listLoading = false
        })
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val
        this.getList()
      },
      resetTemp() {
        this.addLoading = false
        this.dataForm = {
          rangeId: undefined,
          schoolId: this.GLOBAL.getOrgId(),
          userId: '',
          teacherName: '',
          icon: '',
          index: '',
          rangeType: this.rangeType,
          gradeId: undefined,
          classId: undefined,
          subjectId: undefined,
          appointmentDate: undefined
        }
      },
      //添加教师
      handleCreate(row, type) {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        if (type == 1) {
          this.$nextTick(() => {
            if (this.rangeType != 105) {
              this.$refs.gradeForm.gradeId = ''
            }
            if (this.rangeType == 101 || this.rangeType == 102) {
              this.$refs.classForm.classId = ''
            }
            this.dataForm.gradeId = undefined
            this.dataForm.classId = undefined
            this.dataForm.subjectId = undefined
            this.$refs['dataForm'].clearValidate()
            this.$refs['dataForm'].resetFields()
            this.getTeacherList()
          })
        } else {
          let tempRow = Object.assign({}, row)
          this.$nextTick(() => {
            this.dataForm.icon = ''
            if (this.rangeType == 103) {
              this.$refs.gradeForm.gradeId = tempRow.gradeId
              this.dataForm.gradeId = tempRow.gradeId
            } else if (this.rangeType == 102) {
              this.$refs.gradeForm.gradeId = tempRow.gradeId
              this.$refs.classForm.classId = tempRow.classId
              this.dataForm.gradeId = tempRow.gradeId
              this.dataForm.classId = tempRow.classId
            } else if (this.rangeType == 105) {
              this.dataForm.subjectId = tempRow.subjectId
            } else if (this.rangeType == 106) {
              this.$refs.gradeForm.gradeId = ''
              this.dataForm.gradeId = ''
              this.dataForm.classId = ''
              this.dataForm.subjectId = ''
            }
            this.$refs['dataForm'].clearValidate()
            this.getTeacherList()
          })
        }

        // this.dialogStatus = 'create'
        // this.dialogFormVisible = true
        //     let tempRow = Object.assign({}, row)
        // this.$nextTick(() => {
        //       this.dataForm.icon = ''
        //       if(this.rangeType == 103){
        //         this.$refs.gradeForm.gradeId = tempRow.gradeId
        //         this.dataForm.gradeId = tempRow.gradeId
        //       }else if(this.rangeType == 102){
        //         this.$refs.gradeForm.gradeId = tempRow.gradeId
        //         this.$refs.classForm.classId = tempRow.classId
        //         this.dataForm.gradeId = tempRow.gradeId
        //         this.dataForm.classId = tempRow.classId
        //       }else if(this.rangeType == 105){
        //         this.dataForm.subjectId = tempRow.subjectId
        //       }else if(this.rangeType == 106){
        //         this.$refs.classForm.classId = ''
        //         this.$refs.gradeForm.gradeId = ''
        //         this.dataForm.gradeId = ''
        //         this.dataForm.classId = ''
        //         this.dataForm.subjectId = ''
        //       }
        //       this.$refs['dataForm'].clearValidate()
        //       this.getTeacherList()
        // if(this.rangeType != 105){
        //   this.$refs.gradeForm.gradeId = ''
        // }
        // if(this.rangeType == 102 || this.rangeType == 101 ){
        //   this.$refs.classForm.classId = ''
        // }
        //	})
      },
      //添加角色
      handleCreateSetting() {

        this.dataFormSetting = {
            schoolId: this.GLOBAL.getOrgId(),
            rangeType: this.rangeType,
            roleIds: this.roleIdList
          },
          this.addLoading = false
        this.dialogStatusSetting = 'create'
        this.dialogSettingVisible = true
        this.$nextTick(() => {
          this.$refs['dataFormSetting'].clearValidate()

        })
      },
      /*查看*/
      handleLook(row) {
        this.dataFormInfo = Object.assign({}, row) // copy obj
        this.dialogStatus = 'look'
        this.dialogFormVisible = true
      },
      /*编辑弹框*/
      handleUpdate(row) {
        let tempRow = Object.assign({}, row) // copy obj
        let gradeId = undefined,
          classId = undefined,
          subjectId = undefined
        if (this.rangeType == 103) {
          gradeId = tempRow.gradeId
          classId = ''
          subjectId = ''
        } else if (this.rangeType == 102) {
          gradeId = tempRow.gradeId
          classId = tempRow.classId
          subjectId = ''
        } else if (this.rangeType == 105) {
          subjectId = tempRow.subjectId
          gradeId = ''
          classId = ''
        } else if (this.rangeType == 106) {
          gradeId = tempRow.gradeId
          subjectId = tempRow.subjectId
          classId = ''
        } else {
          gradeId = tempRow.gradeId
          classId = tempRow.classId
          subjectId = tempRow.subjectId
        }
        this.getTeacherList()
        //this.teacherList = [{userId:tempRow.userId,teacherId:tempRow.teacherId,teacherName:tempRow.teacherName,icon:tempRow.icon}]
        this.dataForm = {
          index: 0,
          icon: tempRow.icon,
          rangeId: tempRow.rangeId,
          schoolId: this.GLOBAL.getOrgId(),
          userId: tempRow.userId,
          rangeType: this.rangeType,
          gradeId: gradeId,
          classId: classId,
          subjectId: subjectId,
          appointmentDate: tempRow.appointmentDate
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
          this.dataForm.index = 0

          if (this.rangeType != 105) {
            this.$refs.gradeForm.gradeId = gradeId
          }
          if (this.rangeType == 102 || this.rangeType == 101) {
            this.$refs.classForm.classId = classId
          }
        })
      },
      /*添加*/
      createData(type) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let that = this;
            that.addLoading = true
            if (this.dataForm.userId == undefined || this.dataForm.userId.toString().length == 0) {
              that.$message({
                type: 'error',
                message: '教师不能为空!'
              });
              that.addLoading = false
              return
            }
            that.dataForm.userId = that.dataForm.userId
            let tempArr = that.teacherList.filter(item => item.userId === that.dataForm.userId)
            that.dataForm.teacherName = tempArr[0].teacherName
            that.dataForm.teacherId = tempArr[0].teacherId

            if (this.dataForm.rangeType == 105) {
              this.dataForm.gradeId = undefined
            }
            if (this.dataForm.rangeType  == 103 || this.dataForm.rangeType == 105 || this.dataForm.rangeType == 106) {
              this.dataForm.classId = undefined
            }
            if (this.dataForm.rangeType == 102 || this.dataForm.rangeType == 103) {
              this.dataForm.subjectId = undefined
            }
            getCommHttpData({
              url: 'eduManageRange/save',
              method: 'post',
              contentType: 2,
              data: this.dataForm,
              operateType: 3
            }, function(data) {
              that.addLoading = false
              if (data.code == 0) {
                that.resetTemp()

                if (that.rangeType != 105) {
                  that.$refs.gradeForm.gradeId = ''
                }
                if (that.rangeType == 102 || that.rangeType == 101) {
                  that.$refs.classForm.classId = ''
                }
                // if(rangeType == 105 || rangeType == 106 || rangeType == 101 ){
                //   that.dataForm.subjectId = ''
                // }
                if (type == 0) {
                  that.$refs['dataForm'].clearValidate()
                  that.dialogFormVisible = false

                }
                that.$message({
                  type: 'success',
                  message: '操作成功!'
                });
                that.getList()
                that.getRoleListLeft()
              }
            })
          }
        })
      },
      /*编辑*/
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let that = this;
            if (this.dataForm.userId == undefined || this.dataForm.userId.toString().length == 0) {
              that.$message({
                type: 'error',
                message: '教师不能为空!'
              });
              that.addLoading = false
              return
            }
            that.dataForm.userId = that.dataForm.userId
            let tempArr = that.teacherList.filter(item => item.userId === that.dataForm.userId)
            that.dataForm.teacherName = tempArr[0].teacherName
            that.dataForm.teacherId = tempArr[0].teacherId

            if (this.dataForm.rangeType == 105) {
              this.dataForm.gradeId = undefined
            }
            if (this.dataForm.rangeType  == 103 || this.dataForm.rangeType == 105 || this.dataForm.rangeType == 106) {
              this.dataForm.classId = undefined
            }
            if (this.dataForm.rangeType == 102 || this.dataForm.rangeType == 103) {
              this.dataForm.subjectId = undefined
            }
            that.addLoading = true
            getCommHttpData({
              url: 'eduManageRange/update',
              method: 'post',
              contentType: 2,
              data: this.dataForm,
              operateType: 3
            }, function(data) {
              that.addLoading = false
              if (data.code == 0) {
                that.resetTemp()
                that.$refs['dataForm'].clearValidate()
                that.dialogFormVisible = false
                that.$message({
                  type: 'success',
                  message: '操作成功!'
                });
                that.getList()
                that.getRoleListLeft()
              }
            })
          }
        })
      },
      createDataSetting() {
        this.$refs['dataFormSetting'].validate((valid) => {
          if (valid) {
            let that = this;
            this.dataFormSetting.rangeType = this.rangeType
            that.addLoading = true
            getCommHttpData({
              url: 'eduManageRange/install',
              method: 'post',
              contentType: 2,
              data: this.dataFormSetting,
              operateType: 3
            }, function(data) {
              that.dialogSettingVisible = false
              that.addLoading = false
              that.$message({
                type: 'success',
                message: '操作成功!'
              });
              that.getList()
            })
          }
        })
      },
      updateDataSetting() {

      },
      submitDelete(rangeId, teacherName) {

        let that = this;
        deleteData(that, {
          delJson: {
            url: 'eduManageRange/delete',
            method: 'get',
            contentType: 1,
            operateType: 3,
            data: {
              rangeId: rangeId,
            }
          },
          msg: '取消任职后，' + teacherName + '老师将没有此职位权限。 您确定吗？'
        }, function(data) {
          if (data.code == 0) {
            that.dialogDelete = false;
            that.$message({
              message: '删除成功',
              type: 'success'
            })
            that.getRoleListLeft()
            that.getList()
          } else {
            that.dialogDelete = false;
          }
        })
      },
      deleteData(rangeId, teacherName) {
        let that = this;
        deleteData(that, {
          url: 'eduManageRange/delete',
          method: 'get',
          contentType: 2,
          operateType: 3,
          data: {
            rangeId: rangeId,
            msg: '取消任职后，' + teacherName + '老师将没有此职位权限。 您确定吗？'
          }
        }, function(data) {
          if (data.code == 0) {
            that.dialogDelete = false;
            that.$message({
              message: '删除成功',
              type: 'success'
            })
            that.getList()
          } else {
            that.dialogDelete = false;
          }
        })
      },
      handleCloseDiaLog() {

        this.dialogFormVisible = false
        this.resetTemp()
      },
      isHasImg(pathImg) {
        var ImgObj = new Image();
        ImgObj.src = pathImg;
        if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .form-inline {}

  .el-button+.el-button {
    margin-left: 0px;
  }

  .left-title {
    height: 44px;
    line-height: 44px;
  }

  .content-box {
    position: relative;
  }

  .left-box {
    background-color: #ffffff;
    width: 300px;
    margin-right: 10px;
  }

  .right-box {
    position: absolute;
    left: 310px;
    top: 0;
    right: 0;
  }

  .equip-cont {
    text-align: center;
  }

  // .content-box img{
  //   width:200px;
  //   height:200px;
  //   margin:10px 0px;
  // }
  .list-title {
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    border-bottom: 1px #CCCCCC solid;
    font-weight: bolder;
  }

  .list-div {
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    border-bottom: 1px #EEEEEE solid;
    border-right: 3px #ffffff solid;
  }

  .list-div:hover,
  .list-active {
    color: #3C85EE;
    border-right: 3px #3C85EE solid;
  }

  .list-text {
    display: inline-block;
    text-align: left;
    width: 160px;
    margin-left: 15px;
  }

  .list-value {
    display: inline-block;
    text-align: right;
    width: 100px;
  }

  .equip-cont {
    position: relative;
    cursor: pointer;
    height: 220px;
    text-align: center;

    .health-mess {
      position: absolute;
      top: 10px;
      right: 10px;

      & div {
        display: inline-block;
      }

      .close-computer {
        vertical-align: top;
        font-size: 12px;
      }
    }

    img {
      // width: 90%;
      height: auto;
      min-height: 170px;
      max-height: 170px;
      margin: 10px 0px;
    }
  }

  .equip-btn-group,
  .equip-btn-group1 {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .6);
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .setting {
      color: #fff;
      position: absolute;
      right: 5px;
      top: 7px;
      padding: 5px;
      border-radius: 4px;
    }
  }

  .equip-btn-group1 {
    background-color: rgba(0, 0, 0, .0);
  }

  .equip-cont .equip-btn-group {
    display: none;
  }

  .equip-cont .equip-btn-group1 {
    display: block;
  }

  .equip-cont:hover .equip-btn-group,
  .equip-cont .equip-btn-group1 {
    display: flex;
  }

  .add-btn-teacher {
    position: absolute;
    margin: auto auto;
    left: 50px;
    top: 100px;
  }
</style>
