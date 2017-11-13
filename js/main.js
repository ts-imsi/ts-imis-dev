'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window', '$http','ChatSocket',
    function(              $scope,   $translate,   $localStorage,   $window ,$http,ChatSocket) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        name: 'TS-IMIS',
        version: '1.0.40',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      }

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = { isopen: false };
      //国际化暂使用中英文
      //$scope.langs = {en:'English', de_DE:'German', it_IT:'Italian', zh_ZH:'简体中文'};
      $scope.langs = {en:'English',  zh_ZH:'简体中文'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };
      //默认国际化中文
      $translate.use('zh_ZH');

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      };

      //业务代码测试
      $http.get("/ts-authorize/ts-imis/menus").success(function (result) {
        if (result.success) {
          $scope.menus = result.object;
        } else {
          alert(result.message);
        }
      });


      //-----webSocket代码-------------------
      var initStompClient = function(userId) {

        ChatSocket.init('/ts-project/tsWebSocket');
        ChatSocket.connect(userId,function(frame) {

          // 注册推送时间回调
          ChatSocket.subscribe("/user/topic/message", function(r) {
            var message = angular.fromJson(r.body)

            $scope.msgCount = message.msgCount;
            if(message.msgList){
              $scope.msgList = message.msgList;
            }else{
              $scope.msgList = [];
            }

          });

        }, function(error) {
        });
      };

      $http.get("/ts-project/tb_message/getMsgCount").success(function (result) {
        if (result.success) {
          $scope.msgCount = result.object.msgCount;
          if(result.object.msgList){
            $scope.msgList = result.object.msgList;
          }else{
            $scope.msgList = [];
          }
          if(result.object.userId){
            initStompClient(result.object.userId);
          }
        }
      });
      //----webSocket--end----------


  }]);