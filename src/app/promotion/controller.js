/**
 * Created by sakfi on 2017/8/29.
 */
(function() {
    angular
        .module('WEBAPP.PROMOTION.CONTROLLER', ['ui.bootstrap'])
        .controller('PromotionCtrl', ['$http','$scope','utils','$filter',function($http,$scope,utils,$filter) {
            var selt = this;
            selt.showbutton=false;
            this.submitted=false;
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
                        var param={
                            openId:selt.openid
                        }
                        $http.post("/promotion/getJfPersonByopenId",angular.toJson(param)).success(function (result) {
                            if (result.success) {
                                selt.tbJfPerson = result.object;
                                selt.distanceScore=result.object.score-result.object.prmScore;
                                selt.distanceScore=selt.distanceScore+"("+result.object.px+")";
                                selt.showbutton=true;
                            } else {
                                alert(result.message);
                            }
                        });
                    } else {
                        alert("授权失败!");
                    }

                });

                this.promotionApply = function () {
                    var tbRankCheck={
                        workNum:selt.tbJfPerson.workNum,
                        status:1,
                        oldRank:selt.tbJfPerson.rank,
                        newRank:selt.tbJfPerson.nextRank,
                        created:new Date()
                    };
                    $http.post("/promotion/savaCheck",angular.toJson(tbRankCheck)).success(function (result) {
                        if (result.success) {
                            console.log("保存成功");
                            selt.tbJfPerson.status=1;
                            alert(result.message);
                        } else {
                            alert(result.message);
                        }
                    });
                }

            }

        }]);
})();
