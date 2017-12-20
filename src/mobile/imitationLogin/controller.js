
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
            $http.get("/authorize/oauth2?code="+code).success(function(result){
                if(result.status==1){
                    var openId=result.openid;

                    $http.post("/ts-project/mobileImitation/imitationLogin/" + openId).success(function (result) {
                        if (result.success) {
                            sessionStorage.setItem("X-TOKEN", result.object.xtoken);
                            window.location.href = "/src/mobile/index.html#/user";
                        }else{
                            window.location.href = "/src/mobile/index.html#/user?openId="+openId;
                        }
                    });
                }else{
                    alert("微信授权失败,请联系管理员!");
                }
            })

        }
    }]);
