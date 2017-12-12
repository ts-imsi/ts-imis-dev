(function () {
    angular
        .module('MOBILEAPP', [
            'ui.router',
            'MOBILEAPP.USER.CONTROLLER',
            'MOBILEAPP.TRANSACT.CONTROLLER',
            'MOBILEAPP.TREATEDDET.CONTROLLER',
            'MOBILEAPP.UNTREATEDDET.CONTROLLER',
            'MOBILEAPP.TRANSFER.CONTROLLER',
            'MOBILEAPP.TRACHEDULE.CONTROLLER',
            'MOBILEAPP.PROJECTMENT.CONTROLLER',
            'MOBILEAPP.PROJECTDETAILS.CONTROLLER',
            'MOBILEAPP.OUTPUTVALUE.CONTROLLER',
            'MOBILEAPP.CONFIRVALUE.CONTROLLER',
            'MOBILEAPP.INFO.CONTROLLER',
            'mobile.utils'
        ])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$compileProvider', '$locationProvider','$httpProvider'];
    function config($stateProvider, $urlRouterProvider, $compileProvider, $locationProvider,$httpProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        $httpProvider.defaults.headers.common = { 'X-TOKEN' : sessionStorage.getItem("X-TOKEN") };
        /**
         * 定义路由
         */
        $stateProvider
            .state('user', {
                url: '/user',
                templateUrl: window.rootSrc + 'mobile/user.html',
                controller: 'userCtrl as $ctrl'
            })
            .state('transact', {
                url: '/transact',
                templateUrl: window.rootSrc + 'mobile/transact/transact.html',
                controller: 'transactCtrl as $ctrl'
            })
            .state('treatedDet', {
                url: '/treatedDet',
                templateUrl: window.rootSrc + 'mobile/treatedDet/treatedDet.html',
                controller: 'treatedDetCtrl as $ctrl'
            })
            .state('untreatedDet', {
                url: '/untreatedDet',
                templateUrl: window.rootSrc + 'mobile/untreatedDet/untreatedDet.html',
                controller: 'untreatedDetCtrl as $ctrl'
            })
            .state('transfer', {
            url: '/transfer',
            templateUrl: window.rootSrc + 'mobile/transfer/transfer.html',
            controller: 'transferCtrl as $ctrl'
            })
            .state('traChedule', {
                url: '/traChedule',
                templateUrl: window.rootSrc + 'mobile/transfer/tra-chedule.html',
                controller: 'traCheduleCtrl as $ctrl'
            })
            .state('projectMent', {
            url: '/projectMent',
            templateUrl: window.rootSrc + 'mobile/project-mament/project-ment.html',
            controller: 'projectMentCtrl as $ctrl'
            })
            .state('projectDetails', {
                url: '/projectDetails',
                templateUrl: window.rootSrc + 'mobile/project-mament/project-details.html',
                controller: 'projectDetailsCtrl as $ctrl'
            })
            .state('outputValue', {
            url: '/outputValue',
            templateUrl: window.rootSrc + 'mobile/output-value/output-value.html',
            controller: 'outputValueCtrl as $ctrl'
            })
            .state('confirValue', {
                url: '/confirValue',
                templateUrl: window.rootSrc + 'mobile/output-value/confir-value.html',
                controller: 'confirValueCtrl as $ctrl'
            })
            .state('info', {
                url: '/info',
                templateUrl: window.rootSrc + 'mobile/info/info.html',
                controller: 'infoCtrl as $ctrl'
            });


        /**
         * 什么都匹配不到的时候就跳转到首页
         */
        $urlRouterProvider.otherwise('/user');
    }
})();
