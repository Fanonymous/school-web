<template>
	<div >
  <aside class="site-sidebar-sub" :class="'site-sidebar-sub--' + sidebarLayoutSkin" v-if="sideMenuApp">
    <div class="site-sidebar__inner"  >
    	<div class="title" :title="applicationObj.applicationName" style="">{{applicationObj.applicationName}}</div>
      <el-menu
      	unique-opened
        :default-active="menuActiveName || 'home'"
        :collapse="false"
        :collapseTransition="false"
        class="site-sidebar__menu">
        <el-menu-item class="el-submenu-sub__title" index="home" style="display:none" @click="$router.push({ name: 'home' })">
          <icon-svg name="shouye" class="site-sidebar__menu-icon"></icon-svg>
          <span slot="title">首页</span>
        </el-menu-item>
        	<!-- <label @click="sideSubFold = !sideSubFold" v-if="!sideSubFold"><img src="~@/assets/img/icons/menu-c.png" width="" class="menu-btn"/></label> -->
        	<!-- <label @click="sideSubFold = !sideSubFold" v-if="sideSubFold"><img src="~@/assets/img/icons/menu-o.png" width="" class="menu-btn-o"/></label> -->
        <sub-menu class="el-submenu-sub__title"
          v-for="menu in menuList"
          :key="menu.menuId"
          :menu="menu"
          :dynamicMenuRoutes="dynamicMenuRoutes">
        </sub-menu>
        
      </el-menu>
    </div>
    <!--<label @click="sideSubFold = !sideSubFold">展开</label> -->
  </aside>
  </div>
</template>
<style>
	.menu-btn{
		position: absolute;
		top: 300px;
		left: 150px;
		z-index:999;
		cursor: pointer;
	}
	.menu-btn-o{
		position: absolute;
		top: 300px;
		left: 0px;
		z-index:999;
		cursor: pointer;
	}
	.site-sidebar__inner .title{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap; 
		padding:15px;
		text-align: center;
		font-size: 16px;
		font-weight: bold;
		/* width:160px; */
		border-bottom: 1px solid #CCCCCC;
	}
	.el-submenu-sub__title{
		/* height: 46px !important; */
		line-height: 46px !important;
		width: 203px;
	}
	.el-submenu__title{
		height: 46px !important;
		line-height: 46px !important;
	}
</style>
<script>
  import SubMenu from './main-sidebar-sub-menu'
  import { isURL } from '@/utils/validate'
  export default {
    data () {
      return {
      	//sideSubFold:true,
      	display:'block',
        dynamicMenuRoutes: [],
				productList: [],
				applicationObj: ''
      }
    },
    components: {
      SubMenu
    },
    computed: {
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      sideMenuApp:{
      	get () { return this.$store.state.common.sideMenuApp },
        set (val) { this.$store.commit('common/updateSideMenuApp', val) }
      },
      sideSubFold: {
        get () { return this.$store.state.common.sideSubFold },
        set (val) { this.$store.commit('common/updateSideSubFold', val) }
      },
      menuList: {
        get () { return this.$store.state.common.menuList },
        set (val) { this.$store.commit('common/updateMenuList', val) }
      },
      menuActiveName: {
        get () { return this.$store.state.common.menuActiveName },
        set (val) { 
			this.$store.commit('common/updateMenuActiveName', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      mainTabsActiveName: {
        get () { return this.$store.state.common.mainTabsActiveName },
        set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
      }
    },
    watch: {
      $route: 'routeHandle'
    },
    mounted () {
    	
      this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')

      this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
		this.productList = JSON.parse(sessionStorage.getItem('productList') || '[]')
			this.applicationObj = this.productList.filter(item => item.productId === this.menuList[0].productId)[0]	
      this.routeHandle(this.$route)
		
    },
    methods: {
    	foldSubHandle(){
    		
    		if(this.sideMenuApp = true){
    			this.sideMenuApp = false
    			//this.sideSubFold= false
    		}else{
    			this.sideMenuApp = true
    			//this.sideSubFold= true
    		}
    		
    	},
      // 路由操作
      routeHandle (route) {
      	this.sideMenuApp = true
      		//console.log(this.menuList[0].productId)
      			this.applicationObj = this.productList.filter(item => item.productId === this.menuList[0].productId)[0]
        if (route.meta.isTab) {
          // tab选中, 不存在先添加
          var tab = this.mainTabs.filter(item => item.name === route.name)[0]
          if (!tab) {
            if (route.meta.isDynamic) {
              route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
              if (!route) {
                return console.error('未能找到可用标签页!')
              }
            }
            tab = {
              menuId: route.meta.menuId || route.name,
              name: route.name,
              title: route.meta.title,
              type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
              iframeUrl: route.meta.iframeUrl || '',
              productId: route.meta.productId
            }
            this.mainTabs = this.mainTabs.concat(tab)
          }
          this.menuActiveName = tab.menuId + ''
		  console.log(this.menuActiveName,'this.menuActiveNamethis.menuActiveName')
          this.mainTabsActiveName = tab.name
        }
      }
    }
  }
</script>
