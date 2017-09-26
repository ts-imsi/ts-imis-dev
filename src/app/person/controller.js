(function() {
    angular
        .module('WEBAPP.PERSON.CONTROLLER', ['ui.bootstrap'])
        .controller('PersonCtrl', ['$http','$scope','utils','$filter',function($http,$scope,utils,$filter) {
            var selt = this;
            selt.showbutton=false;
            this.submitted=false;
            var phoneReg="^1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\\d{8}$";
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
                //获取用户信息授权
                $http.get("/authorize/oauth2?code=" + code, null).success(function (result) {
                    if (result.status == 1) {
                        selt.openid = result.openid;
                        console.log("====" + selt.openid);
                        $http.post("/weiXinPerson/getPersonByOpenId/?openId="+selt.openid).success(function (result) {
                            if (result.success) {
                                selt.winXinPerson = result.object;
                                selt.showbutton=true;
                            } else {
                                alert(result.message);
                            }
                        });

                        var param={
                            openId:selt.openid
                        }
                        $http.post("/promotion/getPersonByopenId",angular.toJson(param)).success(function (result) {
                            if (result.success) {
                                selt.tbJfPerson = result.object;
                            } else {
                                alert(result.message);
                            }
                        });

                    } else {
                        alert("授权失败!");
                    }

                });

                this.winXinPersonUpdate = function (valid,winXinPerson) {
                        if (valid) {
                            if(winXinPerson.phone.match(phoneReg)==null){
                                console.log("====" + "手机号码格式不合法");
                                alert("手机号码格式不合法");
                                return;
                            };
                            $http.post("/weiXinPerson/updatePersonAndBasic", winXinPerson).success(function (result) {
                                if (result.success) {
                                    alert(result.message);
                                } else {
                                    alert(result.message);
                                }
                            });
                        } else {
                            console.log("====" + "手机号码和家庭住址必填");
                             alert("手机号码和家庭住址必填");
                        }
                }

            }

        }]);
})();
