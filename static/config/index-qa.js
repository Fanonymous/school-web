/**
 * 测试环境
 */
;(function () {
  window.SITE_CONFIG = {};


  //api接口请求地址
  //window.SITE_CONFIG['baseUrl'] = 'http://demo.renren.io/renren-fast';
  window.SITE_CONFIG['webIp'] = 'http://192.168.1.205/';
  window.SITE_CONFIG['media'] = 'http://192.168.1.205:8081/';
  window.SITE_CONFIG['imgIP'] = 'http://192.168.1.205/iConductor-media/file/common/getFile?fileName=';
  window.SITE_CONFIG['imgFixedIP'] = 'http://192.168.1.205/iConductor-media/equipAnalysis/getFile?';
  window.SITE_CONFIG['baseUrlMedia'] = window.SITE_CONFIG.media+'iConductor-media/';
  //window.SITE_CONFIG['baseUrl'] = 'http://192.168.1.34/ischool';
  //window.SITE_CONFIG['baseUrl'] = 'http://192.168.1.46:8080/ischool';
  window.SITE_CONFIG['baseIp'] = 'http://192.168.1.205:8000/';
  window.SITE_CONFIG['analysisIp'] = window.SITE_CONFIG.media+'/iConductor-media/';
  window.SITE_CONFIG['license'] = window.SITE_CONFIG.webIp+'/iConductor-license/';
  window.SITE_CONFIG['diamaOauth'] = window.SITE_CONFIG.webIp+'iConductor-oauth/'
  window.SITE_CONFIG['baseUrl'] = window.SITE_CONFIG['baseIp'];
  window.SITE_CONFIG['grafanaIp'] = 'http://192.168.1.206:3000';
  window.SITE_CONFIG['webSocketIp'] = '192.168.1.205';
  window.SITE_CONFIG['webSocketPort'] = '8889';
  window.SITE_CONFIG['mqttIP'] = '192.168.1.205';
  window.SITE_CONFIG['mqttPort'] = 6280;
  window.SITE_CONFIG['zoreCode'] = 1  //saas 1  榆林三中 2 江西新鸿教育 3  清涧中学 4  清涧二小 5  米脂电教馆 6
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
  window.SITE_CONFIG['sysVersion'] = '1.3.2.0'
  window.SITE_CONFIG['packageName'] = 'diama'
  window.SITE_CONFIG['systemName'] = '205智慧校园公共服务平台'
  window.SITE_CONFIG['cmsIp'] = 'http://192.168.1.205:8888'
})();
