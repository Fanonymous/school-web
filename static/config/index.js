/**
 * 开发环境
 */
;(function () {

  window.SITE_CONFIG = {};

  //api接口请求地址
  //window.SITE_CONFIG['baseUrl'] = 'http://demo.renren.io/renren-fast';
  
   
  window.SITE_CONFIG['webIp'] = 'http://192.168.1.238:8001/';
  window.SITE_CONFIG['media'] = 'http://192.168.1.250:8080/';  
  // window.SITE_CONFIG['media'] = 'http://219.145.118.23:88/';  
  window.SITE_CONFIG['imgIP'] = 'http://192.168.1.238:8081/iConductor-media/file/common/getFile?fileName=';
  window.SITE_CONFIG['imgFixedIP'] = 'http://192.168.1.238/iConductor-media/equipAnalysis/getFile?';

   window.SITE_CONFIG['fileIP'] = 'http://192.168.1.238:8090/file/';
  window.SITE_CONFIG['baseUrlMedia'] = window.SITE_CONFIG.media+'iConductor-media/';
  window.SITE_CONFIG['license'] = window.SITE_CONFIG.media + 'iConductor-license/'
  window.SITE_CONFIG['diamaOauth'] = 'http://192.168.1.39:9082/iConductor-oauth/'
  //window.SITE_CONFIG['baseUrl'] = 'http://192.168.1.34/ischool';
  //window.SITE_CONFIG['baseUrl'] = 'http://192.168.1.46:8080/ischool';
  window.SITE_CONFIG['baseIp'] = 'http://192.168.1.245:80/';
  window.SITE_CONFIG['analysisIp'] = window.SITE_CONFIG.media+'/iConductor-media/';
  // window.SITE_CONFIG['license'] = window.SITE_CONFIG.media+'/iConductor-license/';
  window.SITE_CONFIG['license'] = 'http://192.168.1.238:80/' + '/iConductor-license/';  //测试使用
  window.SITE_CONFIG['baseUrl'] = window.SITE_CONFIG['baseIp']+'ischool/';
  window.SITE_CONFIG['grafanaIp'] = 'http://192.168.1.215:3000';
  window.SITE_CONFIG['webSocketIp'] = '192.168.1.245';
  window.SITE_CONFIG['webSocketPort'] = '8889';
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
  window.SITE_CONFIG['sysVersion'] = '1.3.2.0'
  window.SITE_CONFIG['systemName'] = '彬州市教育公共服务平台'
  document.title = window.SITE_CONFIG['systemName']
  window.SITE_CONFIG['packageName'] = ''
  window.SITE_CONFIG['cmsIp'] = 1
})();
