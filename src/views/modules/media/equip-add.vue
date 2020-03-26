<template>
  <div class="mod-config">
    <el-form ref="form" :model="form" label-width="100px">
		  <el-form-item label="班级">
		    <el-select v-model="form.region" placeholder="请选择班级">
		      <el-option label="区域一" value="shanghai"></el-option>
		      <el-option label="区域二" value="beijing"></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="教室">
		    <el-select v-model="form.region" placeholder="请选择教室">
		      <el-option label="区域一" value="shanghai"></el-option>
		      <el-option label="区域二" value="beijing"></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="装备类型">
		    <el-select v-model="form.region" placeholder="请选择装备类型">
		      <el-option label="区域一" value="shanghai"></el-option>
		      <el-option label="区域二" value="beijing"></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="MAC">
		  	<el-input v-model="form.name"></el-input>
		  </el-form-item>
		  <el-form-item label="用途">
		    <el-select v-model="form.region" placeholder="请选择用途">
		      <el-option label="区域一" value="shanghai"></el-option>
		      <el-option label="区域二" value="beijing"></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="品牌">
		    <el-select v-model="form.region" multiple filterable placeholder="请选择品牌">
		      <el-option label="区域一" value="shanghai"></el-option>
		      <el-option label="区域二" value="beijing"></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="负责人">
		    <el-input v-model="form.desc"></el-input>
		  </el-form-item>
		  <el-form-item label="入库时间">
		    <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" ></el-date-picker>
		  </el-form-item>
		  <el-form-item label="备注">
		    <el-input type="textarea" v-model="form.desc"></el-input>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="onSubmit">提交</el-button>
		    <el-button onclick="history.go(-1)">取消</el-button>
		  </el-form-item>
		</el-form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      	form: {
      		id:0,
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
        
      }
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
//        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrlMedia('/sys/config/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize
          })
        }).then(({data}) => {
//        if (data && data.code === 0) {
//          this.dataList = data.page.list
//          this.totalPage = data.page.totalCount
//        } else {
//          this.dataList = []
//          this.totalPage = 0
//        }
          //this.dataListLoading = false
        })
      },
      onSubmit (){
      	//提交
      }
    }
  }
</script>
