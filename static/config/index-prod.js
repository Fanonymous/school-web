/**
 * 生产环境
 */
;(function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  let serverIp = 'http://113.135.194.232:89/'
  window.SITE_CONFIG['webIp'] = 'http://113.135.194.232:88/'
  window.SITE_CONFIG['media'] = serverIp
  window.SITE_CONFIG['imgIP'] = serverIp + 'iConductor-media/file/common/getFile?fileName='
  window.SITE_CONFIG['baseUrlMedia'] = window.SITE_CONFIG.media + 'iConductor-media/'
  window.SITE_CONFIG['analysisIp'] = window.SITE_CONFIG.media + '/iConductor-media/'
  window.SITE_CONFIG['baseUrl'] = window.SITE_CONFIG['baseIp'] + 'ischool/'
  window.SITE_CONFIG['license'] = window.SITE_CONFIG.media + 'iConductor-license/'
  window.SITE_CONFIG['diamaOauth'] = serverIp + 'iConductor-oauth/'
  window.SITE_CONFIG['grafanaIp'] = 'http://113.135.194.232:3000'
  window.SITE_CONFIG['webSocketIp'] = '113.135.194.232'
  window.SITE_CONFIG['webSocketPort'] = '8889'
  window.SITE_CONFIG['mqttIP'] = '192.168.1.205'
  window.SITE_CONFIG['mqttPort'] = 6280
  window.SITE_CONFIG['zoreCode'] = 1  // saas 1  榆林三中 2 江西新鸿教育 3  清涧中学 4  清涧二小 5  米脂电教馆 6
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
  window.SITE_CONFIG['packageName'] = 'diama'
  window.SITE_CONFIG['sysVersion'] = '1.3.2.0'
  var domainName = document.domain
  var domTitle = '清涧县第二小学智慧校园公共服务平台'
  if (domainName.indexOf('banpai') > -1) {
    	window.SITE_CONFIG['webIp'] = 'http://banpai.nuggeticloud.com/'
    domTitle = '数字化班级管理'
  } else if (domainName.indexOf('ketang') > -1) {
    window.SITE_CONFIG['webIp'] = 'http://ketang.nuggeticloud.com/'
    domTitle = '智慧课堂'
  } else if (domainName.indexOf('nazhi') > -1) {
    window.SITE_CONFIG['webIp'] = 'http://nazhi.nuggeticloud.com/'
    domTitle = '多媒体教学装备集控系统'
  } else if (domainName.indexOf('keti') > -1) {
    window.SITE_CONFIG['webIp'] = 'http://keti.nuggeticloud.com/'
    domTitle = '区域基础教育信息化水平评价数据采集系统'
  } else {
    window.SITE_CONFIG['webIp'] = 'http://113.135.194.232:88/'
    domTitle = '清涧县第二小学智慧校园公共服务平台'
  }
  window.SITE_CONFIG['systemName'] = domTitle
  document.title = domTitle
  window.SITE_CONFIG['cmsIp'] = 'http://192.168.1.205:8888'
})()
