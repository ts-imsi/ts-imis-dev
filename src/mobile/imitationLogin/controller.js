
var app = angular.module('myMobileApp', ['mobile.utils']);
app.controller('imitation', ['$scope', '$http','utils',function ($scope, $http,utils) {
    var selt = this;
    var code =  utils.getUrlVar('code');
        console.log("=====" + code);
        if (!code) {
            var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
                'appid=wx5788f1ce93ff3255' +
                '&redirect_uri=' + encodeURIComponent(window.location.href) +
                '&response_type=code&scope=snsapi_base&state=TS-IMIS' +
                '#wechat_redirect';
            window.location.href = url;
        } else {
            //todo openId设置
            //var openId = "o8qZCwdhpNkRkSwlNLC1WOwB37bE";
            $http.get("/ts-project/mobileImitation/oauth2/"+code).success(function(result){
                if(result.success){
                    var openId=result.openId;

                    $http.post("/ts-project/mobileImitation/imitationLogin/" + openId).success(function (result) {
                        if (!result.success) {
                            alert(result.message);
                            console.log($scope.authError);
                        } else {
                            sessionStorage.setItem("X-TOKEN", result.object.xtoken);
                            window.location.href = "/src/mobile/index.html#/user";
                        }
                    });
                }else{
                    alert(result.message);
                }
            })

        }
    }]);
