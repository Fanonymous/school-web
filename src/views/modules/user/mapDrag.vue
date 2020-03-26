<template>
	<!-- <div> -->
		<!-- <el-form-item :label="label" :rules="{ required: fileRequired, message: '地址不能为空', trigger: 'blur' }"> -->
		
			<div class="m-map">
				      <!-- <div id="r-result"> -->
							  <el-autocomplete
							  width="100%"
							    size="small"
							    popper-class="my-autocomplete"
							    v-model="shopaddress"
							    :fetch-suggestions="querySearch"
							    placeholder="输入名称搜索"
							    :trigger-on-focus="false"
							    @select="handleSelect" :maxlength="100">
							    <template slot-scope="{ item }">
							      <div class="name">{{ item.title}} <span style="margin-left: 10px;font-size: 10px;">{{ item.address }}</span></div>
							    </template>
							  </el-autocomplete>
				      <!-- </div> -->
				      <div id="l-map"></div>
			</div>
		<!-- </el-form-item> -->
	<!-- </div> -->
</template>

<script>

  import remoteLoad from './remoteLoad2';

  export default {
    name: "map-drag",
    data () {
      return {
            listLoading: true,
			  address: '',
			  longitude: '', // 经度
			  latitude: '', // 纬度
            map: null,
            local: null,
            localList: [], // 搜索地址列表
            shopaddress: '', // 详细地址
            loading: false,
            restaurants: []
          }
        },
        watch: {
          shopaddress(val) {
            this.local && this.local.search(val)
						this.$emit('changval', val);
          }
        },
        mounted() {
			let that = this
			remoteLoad.init().then(BMap=>{
				that.baiduMap(BMap)
			})
        },
        methods: {
          querySearch(queryString, cb) {
            var restaurants = this.restaurants
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
            // 调用 callback 返回建议列表的数据
            cb(results)
          },
          createFilter(queryString) {
            return (restaurant) => {
              return restaurant
            }
          },
          handleSelect(item) {
            this.map.clearOverlays() // 清除地图上所有覆盖物
            this.shopaddress = item.title
            this.longitude = item.point.lng
            this.latitude = item.point.lat
            this.address = item.title
			this.$emit('change', item);
            const pp = item.point // 获取第一个智能搜索的结果
            this.map.centerAndZoom(pp, 15)
            this.map.addOverlay(new BMap.Marker(pp)) // 添加标注
          },
          baiduMap(BMap) {
            // 百度地图API功能
            this.map = new BMap.Map('l-map')
            var _this = this
			// var point = new BMap.Point(116.331398,39.897445);
            // _this.map.centerAndZoom('西安') // 初始化地图,设置城市和地图级别。
            if (_this.longitude && _this.latitude) {
				let ePoint = new BMap.Point(_this.longitude,_this.latitude)
			  _this.map.centerAndZoom(ePoint, 15)
			  _this.map.addOverlay(new BMap.Marker(ePoint)) //添加标注
            } 
			else {
              var geolocation = new BMap.Geolocation()
			  geolocation.getCurrentPosition(function(r){
			  	if(this.getStatus() == BMAP_STATUS_SUCCESS){
					var mk = new BMap.Marker(r.point);
			  		_this.map.addOverlay(mk);
			  		// _this.map.panTo(r.point);
			  		_this.map.centerAndZoom(r.point,12);
			  	}
			  	else {
					 _this.map.centerAndZoom('西安')
			  		console.log('failed'+this.getStatus());
			  	}        
			  },{enableHighAccuracy: true})
            }
            _this.local = new BMap.LocalSearch(_this.map, {
              onSearchComplete: (res) => {
                if (_this.local.getStatus() === BMAP_STATUS_SUCCESS) {
                  _this.restaurants = []
                  for (let i = 0; i < res.getCurrentNumPois(); i++) {
                    _this.restaurants.push(res.getPoi(i))
                  }
                }
              }
            })
          }
        },
    }
  // }
</script>

<style>
  #l-map {
      height: 300px;
      width: 100%;
    }
   
    #r-result {
      width: 100%;
    }
	.el-autocomplete input{
		width: 350px !important;
	}
</style>
