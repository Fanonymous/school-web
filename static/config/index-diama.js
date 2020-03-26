/**
 * 验收环境
 */
;(function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  // window.SITE_CONFIG['baseUrl'] = 'http://demo.renren.io/renren-fast';
  window.SITE_CONFIG['webIp'] = 'http://192.168.1.238/'
  window.SITE_CONFIG['media'] = 'http://192.168.1.238:8088/'
  window.SITE_CONFIG['imgIP'] = 'http://192.168.1.238/diama-media/file/common/getFile?fileName='
  window.SITE_CONFIG['imgFixedIP'] = 'http://192.168.1.238/diama-media/equipAnalysis/getFile?'
  window.SITE_CONFIG['fileIP'] = 'http://192.168.1.238:8090/file/'
  window.SITE_CONFIG['baseUrlMedia'] = window.SITE_CONFIG.media + 'diama-media/'
  // window.SITE_CONFIG['baseUrl']  = 'http://192.168.1.34/ischool';
  // window.SITE_CONFIG['baseUrl'] = 'http://192.168.1.46:8080/ischool';
  window.SITE_CONFIG['baseIp'] = 'http://192.168.1.238:8000/'
  window.SITE_CONFIG['analysisIp'] = window.SITE_CONFIG.media + 'diama-media/'
  window.SITE_CONFIG['license'] = window.SITE_CONFIG.webIp + '/diama-license/'
  window.SITE_CONFIG['baseUrl'] = window.SITE_CONFIG['baseIp'] + 'ischool/'
  window.SITE_CONFIG['grafanaIp'] = 'http://192.168.1.239:3000'
  window.SITE_CONFIG['webSocketIp'] = '192.168.1.238'
  window.SITE_CONFIG['webSocketPort'] = '8889'
  window.SITE_CONFIG['mqttIP'] = '192.168.1.205'
  window.SITE_CONFIG['mqttPort'] = 6280

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
  var domainName = document.domain
  var domTitle = '238智慧校园公共服务平台'
  if (domainName.indexOf('banpai') > -1) {
    //	window.SITE_CONFIG['webIp'] = 'http://banpai.nuggeticloud.com/';
  	domTitle = '238数字化班级管理'
  } else if (domainName.indexOf('ketang') > -1) {
  	// window.SITE_CONFIG['webIp'] = 'http://ketang.nuggeticloud.com/';
  	domTitle = '238智慧课堂'
  } else if (domainName.indexOf('nazhi') > -1) {
  	// window.SITE_CONFIG['webIp'] = 'http://nazhi.nuggeticloud.com/';
  	domTitle = '238多媒体教学装备集控系统'
  } else if (domainName.indexOf('keti') > -1) {
  	// window.SITE_CONFIG['webIp'] = 'http://keti.nuggeticloud.com/';
  	domTitle = '238区域基础教育信息化水平评价数据采集系统'
  } else {
  	// window.SITE_CONFIG['webIp'] = 'http://ischool.nuggeticloud.com/';
  	domTitle = '238智慧校园公共服务平台'
  }
})()
