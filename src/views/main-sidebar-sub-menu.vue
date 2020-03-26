<template>
  <el-submenu 
    v-if="menu.children && menu.children.length >= 1"
    :index="menu.menuId + ''"
    :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'">
    <template slot="title">
			<span class="icon-pro">
				<img class="icon_blue" v-real-img="imgUrl+menu.icon" width="16px" :src="defaultIcon" />
			</span>
      <!--<icon-svg v-if="menu.iconPath==null" name="job" class="site-sidebar__menu-icon"></icon-svg>
      <img v-else :src="imgUrl+menu.iconPath" width="20px" height="20px"/>-->
      <span> {{ menu.menuName }}</span>
    </template>
    <sub-menu
      v-for="item in menu.children" 
      :key="item.menuId"
      :menu="item"
      :dynamicMenuRoutes="dynamicMenuRoutes">
    </sub-menu>
  </el-submenu>
  <el-menu-item v-else :index="menu.menuId + ''" @click="gotoRouteHandle(menu)">
    <!-- <div class="icon-pro">
    	<img class="icon_blue" v-real-img="imgUrl+menu.icon" width="16px" :src="defaultIcon" />
    </div> -->
	<!-- <icon-svg name="shoucang" class="site-sidebar__menu-icon"></icon-svg> -->
    <span class="menu-content-span"> {{ menu.menuName }}</span>
    <!--<el-tooltip v-else class="" effect="dark" :content="menu.menuName" placement="right-start">
      <span class="menu-content-span">{{ menu.menuName }}</span>
    </el-tooltip>-->
    
  </el-menu-item>
</template>

<script>
  import SubMenu from './main-sidebar-sub-menu'
  import defaultIcon from '@/assets/img/default-pro.png'
  export default {
    name: 'sub-menu',
    data() {
			return {
				imgUrl: window.SITE_CONFIG.imgIP,
				defaultImg: 'this.src="' + require('../assets/img/nodata.png') + '";this.onerror = null',
				defaultIcon:defaultIcon
			}
		},
    props: {
      menu: {
        type: Object,
        required: true
      },
      dynamicMenuRoutes: {
        type: Array,
        required: true
      }
    },
    components: {
      SubMenu
    },
    computed: {
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin }
      }
    },
    mounted () {

    },
    methods: {
      // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
      gotoRouteHandle (menu) {	
		  console.log(menu,'menuuuuuu')
        var route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === menu.menuId && item.meta.productId===menu.productId)
        if (route.length >= 1) {
          this.$router.push({ name: route[0].name })
        }
      }
    }
  }
</script>
<style>
	.el-submenu-sub__title .el-menu{
		width: 203px;
	}
	.el-menu-item .icon-pro{
		display: inline-block;
		width: 16px;
		margin-right: 10px;
		overflow: hidden;
	}
	.el-menu-item:hover{
		color: #3C85EE;
	}
	.el-menu-item:hover .icon-pro .icon_blue{
		position: relative;
		left: -16px;
		/* border-right: 30px solid transparent; */
		-webkit-filter: drop-shadow(16px 0 0 #3C85EE);
		filter: drop-shadow(16px 0 0 #3C85EE);
	}
</style>
