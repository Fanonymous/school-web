import Vue from 'vue'
import App from '@/App'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
import '@/element-ui'                         // api: https://github.com/ElemeFE/element
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import '@/assets/iconfont/iconfont.css'
import 'font-awesome/css/font-awesome.min.css'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import { isAuth } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
import i18n from '@/lang' // Internationalization
import VueAreaLinkage from 'vue-area-linkage'
import global_ from '@/api/global'
import FullCalendar from 'vue-fullcalendar'
import fullscreen from 'vue-fullscreen'
import VueLazyload from 'vue-lazyload'
import heatmapjsVue from 'heatmapjs-vue'

import allPic from '@/assets/img/on.png'


//原型链注册接口调用方法
import {getCommHttpData, getAnalysisChartData, deleteData, getCommonDictByType, getAxios} from '@/utils/common'
//import Print from 'vue-print-nb'

import htmlToPdf from '@/utils/htmlToPdf'
import Print from '@/api/print'

import clickoutside from 'element-ui/lib/utils/clickoutside'
import clickoutsideByClass from '@/utils/clickoutsideByClass'

import '@/utils/tool'   //引入工具类

//日历
import FullCalendars from 'vue-full-calendar'

Vue.prototype.GLOBAL = global_

Vue.use(VueAreaLinkage)
Vue.use(VueCookie)
Vue.use(FullCalendar)
Vue.use(fullscreen)
Vue.use(Print)  //注册
Vue.use(htmlToPdf)
Vue.use(heatmapjsVue)
Vue.config.productionTip = false

Vue.use(FullCalendars)
//接口调用方法
Vue.prototype.getCommHttpData = getCommHttpData
Vue.prototype.getAnalysisChartData = getAnalysisChartData
Vue.prototype.deleteData = deleteData
Vue.prototype.getCommonDictByType = getCommonDictByType
Vue.prototype.$api = getAxios

// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock
if (process.env.NODE_ENV !== 'production') {
  require('@/mock')
}

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

Vue.directive('real-img', async function (el, binding) {//指令名称为：real-img
    let imgURL = binding.value;//获取图片地址
    if (imgURL) {
        let exist = await imageIsExist(imgURL);
        if (exist) {
            el.setAttribute('src', imgURL);
        } 
    }
})

//解决动态加载图片缓冲问题
Vue.directive('buffer-img', {
    bind(el, bind, vnode) {
        if (bind.arg == '1') {
            el.src = allPic
        }
    },
    async inserted(el1, bind1) {
        let exist = await imageIsExist(bind1.value)
        if (exist) {
            el1.src = bind1.value
        }
    },
    update(el,binding) {
        if (binding.arg == '1') {
            el.src = allPic
        }
    },
    componentUpdated(el, binding) {
        el.src = binding.value
    }
})
Vue.directive('clickoutside', clickoutside)
Vue.directive('clickoutsides', clickoutsideByClass)
/**
 * 检测图片是否存在
 * @param url
 */
let imageIsExist = function(url) {
    return new Promise((resolve) => {
        var img = new Image();
        img.onload = function () {
            if (this.complete == true){
                resolve(true);
                img = null;
            }
        }
        img.onerror = function () {
            resolve(false);
            img = null;
        }
        img.src = url;
    })
}
Vue.use(VueLazyload, {
  preLoad: 1.3,
//require('./assets/123.gif'),
//error: '/static/img/error.png',
//loading: '/static/img/loading.gif',
  error:require('./assets/img/all.png'),  //加载失败的显示
　loading: require('./assets/img/all.png'),       //加载中的显示
//	error:'https://main.qcloudimg.com/raw/a388e84dcdd61fb1268e8b0c1c1b8f5e.svg',
//　loading: 'https://main.qcloudimg.com/raw/a388e84dcdd61fb1268e8b0c1c1b8f5e.svg',
  attempt: 1
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
