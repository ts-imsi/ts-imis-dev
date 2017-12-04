(function() {
    angular
        .module('WEBAPP.IMITATIONLOGIN.CONTROLLER', ['ui.bootstrap'])
        .controller('imitationCtrl', ['$http','$scope','utils','$filter',function($http,$scope,utils,$filter) {
            var selt = this;
            var code =  utils.getUrlVar('code');
            console.log("====="+code);
            if(!code){
                var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
                    'appid=wx5788f1ce93ff3255' +
                    '&redirect_uri=' + encodeURIComponent(window.location.href) +
                    '&response_type=code&scope=snsapi_base&state=TS-IMIS' +
                    '#wechat_redirect';
                window.location.href = url;
            }else {
                //todo openId设置
                //var openId="o8qZCwdhpNkRkSwlNLC1WOwB37bE";
                $http.get("/authorize/oauth2?code=" + code, null).success(function (result) {
                    if (result.status == 1) {
                        selt.openid = result.openid;
                        $http.post("/ts-project/mobileImitation/imitationLogin/"+selt.openid).success(function (result) {
                            if ( !result.success ) {
                                alert(result.message);
                                console.log($scope.authError);
                            }else{
                                sessionStorage.setItem("X-TOKEN", result.object.xtoken);
                                window.location.href="/src/mobile/index.html#/user";
                            }
                        });
                    }else{
                        alert(result.message);
                    }
                })



            }

        }]);
})();