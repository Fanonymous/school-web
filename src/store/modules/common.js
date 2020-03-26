export default {
  namespaced: true,
  state: {
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0,
    // 导航条, 布局风格, defalut(默认) / inverse(反向)
    navbarLayoutType: 'default',
    // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
    sidebarLayoutSkin: 'dark',
    // 侧边栏, 折叠状态
    sidebarFold: true,
    sideSubFold: false,
    sideMenuApp: false,
    // 侧边栏, 菜单
    menuList: [],
    menuActiveName: '',
    // 主入口标签页
    mainTabs: [],
    mainTabsActiveName: '',
	//离开页面是否提示弹框
	isShowLeave: false
  },
  mutations: {
    updateDocumentClientHeight (state, height) {
      state.documentClientHeight = height
    },
    updateNavbarLayoutType (state, type) {
      state.navbarLayoutType = type
    },
    updateSidebarLayoutSkin (state, skin) {
      state.sidebarLayoutSkin = skin
    },
    updateSideMenuApp (state, fold) {
      state.sideMenuApp = fold
    },
    updateSidebarFold (state, fold) {
      state.sidebarFold = fold
    },
    updateSideSubFold (state, fold) {
      state.sideSubFold = fold
    },
    updateMenuList (state, list) {
      state.menuList = list
    },
    updateMenuActiveName (state, name) {
      state.menuActiveName = name
    },
    updateMainTabs (state, tabs) {
      state.mainTabs = tabs
    },
    updateMainTabsActiveName (state, name) {
      state.mainTabsActiveName = name
    },
	updateIsShowLeave(state,name) {
		state.isShowLeave = name
	}
  }
}
