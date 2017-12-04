(function () {
    angular
        .module('WEBAPP', [
            'ui.router',
            'WEBAPP.INDEX.CONTROLLER',
            'WEBAPP.LACATION.CONTROLLER',
            'WEBAPP.MOBILE.CONTROLLER',
            'WEBAPP.BAIDUMAP.CONTROLLER',
            'WEBAPP.ATTLIST.CONTROLLER',
            'WEBAPP.SEARCHATTLIST.CONTROLLER',
            'WEBAPP.PERSON.CONTROLLER',
            'WEBAPP.SUBATT.CONTROLLER',
            'WEBAPP.PROMOTION.CONTROLLER',
            'WEBAPP.JFRECORD.CONTROLLER',
            'mobile.utils'
        ])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$compileProvider', '$locationProvider','$httpProvider'];
    function config($stateProvider, $urlRouterProvider, $compileProvider, $locationProvider,$httpProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        /**
         * 定义路由
         */
        $stateProvider
            .state('Index', {
                url: '/index',
                templateUrl: window.rootSrc + 'app/index/index.tpl.html',

                // 在controller 定义的时候用 this.xxx 的方式定义属性或者方法，模版中使用的时候 使用 $ctrl 来代替 this，详情请看index.tpl.html内容
                controller: 'IndexCtrl as $ctrl'
            })
            .state('Location', {
                url: '/location',
                templateUrl: window.rootSrc + 'app/location/location.tpl.html',
                controller: 'LocationCtrl as $ctrl'
            })
            .state('Mobile', {
                url: '/mobile',
                templateUrl: window.rootSrc + 'app/mobile/index.tpl.html',

                // 在controller 定义的时候用 this.xxx 的方式定义属性或者方法，模版中使用的时候 使用 $ctrl 来代替 this，详情请看index.tpl.html内容
                controller: 'MobileCtrl as $ctrl'
            })
            .state('BaiduMap', {
                url: '/baidumap',
                templateUrl: window.rootSrc + 'app/baidumap/baidumap.tpl.html',
                controller: 'BaiduMapCtrl as $ctrl'
            })
            .state('AttList', {
                url: '/attList',
                templateUrl: window.rootSrc + 'app/attlist/index.tpl.html',
                controller: 'AttListCtrl as $ctrl'
            })
            .state('SearchAttList', {
                url: '/searchAttList',
                templateUrl: window.rootSrc + 'app/searchAttList/index.tpl.html',
                controller: 'SearchAttListCtrl as $ctrl'
            })
            .state('AttenceLog', {
                url: '/attenceLog',
                templateUrl: window.rootSrc + 'app/attenceLog/attenceLog.tpl.html',
                controller: 'AttenceLogCtrl as $ctrl'
            })
            .state('Person', {
                url: '/person',
                templateUrl: window.rootSrc + 'app/person/index.tpl.html',
                controller: 'PersonCtrl as $ctrl'
            })
            .state('SubAtt', {
                url: '/subatt',
                templateUrl: window.rootSrc + 'app/subatt/sublist.html',
                controller: 'SubAttCtrl as $ctrl'
            })
            .state('Promotion', {
                url: '/promotion',
                templateUrl: window.rootSrc + 'app/promotion/index.tpl.html',
                controller: 'PromotionCtrl as $ctrl'
            })
            .state('JfRecord', {
                url: '/jfRecord',
                templateUrl: window.rootSrc + 'app/jfrecord/index.tpl.html',
                controller: 'JfRecordCtrl as $ctrl'
            })
            /*.state('imitation', {
            url: '/imitation',
            templateUrl: window.rootSrc + 'app/imitationLogin/index.tpl.html',
            controller: 'imitationCtrl as $ctrl'
            })*/;


        /**
         * 什么都匹配不到的时候就跳转到首页
         */
        $urlRouterProvider.otherwise('/index');
    }
})();
