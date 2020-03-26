<template>
    <div class="edit-wrapper">
        <el-form :model="equipData" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="装备名称">
                <span>{{equipData.equipName}}</span>
            </el-form-item>
            <el-form-item label="MAC地址">
                <span>{{equipData.equipmentMAC}}</span>
            </el-form-item>
            <el-form-item label="教室" prop="classroomId">
                <el-select v-model="equipData.classroomId" placeholder="请选择教室">
                    <el-option v-for="(item,index) in classroomArr" :key="index" :label="item.classroomName" :value="item.classroomId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="班级">
                <span>{{equipData.gradeName + equipData.className}}</span>
            </el-form-item>
            <el-form-item label="装备类型" prop="deviceId">
                <el-select v-model="equipData.deviceId" placeholder="请选择装备类型">
                    <el-option v-for="(item,index) in deviceArr" :key="index" :label="item.deviceName" :value="item.deviceId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="装备用途" prop="equipUse">
                <el-select v-model="equipData.equipUse" placeholder="请选择装备用途">
                    <el-option v-for="(item,index) in equipUse" :key="index" :label="item.tagValue" :value="item.tagId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="品牌" prop="brandId">
                <el-select v-model="equipData.brandId" placeholder="请选择装备品牌">
                    <el-option v-for="(item,index) in brandArr" :key="index" :label="item.tagValue" :value="item.tagId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="$router.push({ name : 'media-equip' })">取消</el-button>
                <el-button type="primary" @click="submitForm">确认</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            equipData : {
                equipName : '',
                equipmentMAC : '',
                classroomId : '',
                gradeName : '',
                className : '',
                deviceId : '',
                equipUse : '',
                brandId : ''
            },
            rules : {},
            classroomArr : [],
            classroomObj : {},
            deviceArr : [],
            equipUse : [],
            brandArr : [],
            isCover : 0,
            classRooomReference : '',
        }
    },
    watch : {
        'equipData.classroomId'(n, o) {
            if (this.classroomObj[n] && this.classroomObj[n].isBind && this.classRooomReference != n) {
                this.classRooomReference = o
                this.isCover = 1
                const h = this.$createElement
                let self = this
                this.$msgbox({
                    title: '温馨提示',
                    message: h('div', null, [
                        h('span', { style: 'color: #409EFF' }, this.classroomObj[n].classroomName),
                        h('span', `已有绑定${this.equipData.deviceName == '电子班牌' ? '电子班牌' : '客户端'}，是否继续绑定？`)
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(action => {
                }).catch(cancel => {
                    self.equipData.classroomId = o
                })
            }else {
                this.isCover = 0 
            }
        }
    },

    mounted() {
        this.equipData = JSON.parse(this.$route.query.equip)
        this.equipData.classroomId ? this.equipData.classroomId = this.equipData.classroomId + '' : ''
        this.getClassRoom()
        this.getType()
        this.getUse()
        this.getBrand()
    },

    methods : {
        getClassRoom() {
            let self = this
            this.getCommHttpData({
                url : 'authorization/getClassroomList',
                method : 'post',
                contentType : 2,
                data : {
                    deptId : this.equipData.deptId,
                    equipMac : this.equipData.mac
                }
            }, res => {
                if (res.code == 0) {
                    self.classroomArr = res.list
                    self.classroomArr.forEach(item => {
                        self.classroomObj[item.classroomId] = item
                    })
                }
            })
        },
        getType() {
            this.getCommHttpData({
                url : 'authorization/getDevice',
                method : 'post',
                contentType : 2,
                data : {
                    deptId : this.GLOBAL.getOrgId(),
                    userType : this.GLOBAL.getUserType(),
                    userId : this.GLOBAL.getUserId()
                }
            }, res => {
                if (res.code == 0) {
                    this.deviceArr = res.list || []
                    this.deviceArr.forEach(item => {
                        item.deviceId = item.deviceId + ''
                    })
                }
            })
        },
        getUse() {
            this.getCommHttpData({
                url : 'authorization/getUseAndBrand',
                method : 'post',
                contentType : 2,
                data : {
                    deptId : this.GLOBAL.getOrgId(),
                    userType : this.GLOBAL.getUserType(),
                    type : 1
                }
            }, res => {
                if (res.code == 0) {
                    this.equipUse = res.list
                }
            })
        },
        getBrand() {
            this.getCommHttpData({
                url : 'authorization/getUseAndBrand',
                method : 'post',
                contentType : 2,
                data : {
                    deptId : this.GLOBAL.getOrgId(),
                    userType : this.GLOBAL.getUserType(),
                    type : 2
                }
            }, res => {
                if (res.code == 0) {
                    this.brandArr = res.list
                }
            })
        },
        submitForm() {
            this.getCommHttpData({
                url : 'equip/updateEquipBatch',
                method : 'post',
                contentType : 2,
                data : {
                    equipIdList : [this.equipData.equipId],
                    equipMacList : [this.equipData.mac],
                    deviceId : this.equipData.deviceId,
                    equipUse : this.equipData.equipUse,
                    tagId : this.equipData.brandId,
                    deptId : this.equipData.deptId,
                    classroomId : this.equipData.classroomId,
                    isCover : this.isCover
                }
            }, res => {
                if (res.code == 0) {
                    this.$router.push({ name : 'media-equip' })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.edit-wrapper{
    background-color: #fff;
    padding: 10px 0;
}
</style>


