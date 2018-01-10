(function() {
    angular
        .module('attenceApp', ['ui.bootstrap','mobile.utils'])
        .controller('MobileCtrl', ['$http','$scope','$uibModal','$filter','utils','$log',function($http,$scope,$uibModal,$filter,utils,$log) {
            var selt = this;
            //----用户授权,需要跳两次页面-----
            var code =  utils.getUrlVar('code');
            this.attType =  utils.getUrlVar('attType');
            console.log("====="+code);
            if(!code){
                var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
                    'appid=wx883815fb0da06f3d' +
                    '&redirect_uri=' + encodeURIComponent(window.location.href) +
                    '&response_type=code&scope=snsapi_base&state=TS-IMIS' +
                    '#wechat_redirect';
                window.location.href = url;
            }else{
                this.title = 'Mobile';
                this.GPSStr = "";

                //获取当前时间
                var now1=new Date();
                var myday=now1.getDay()//注:0-6对应为星期日到星期六
                switch(myday)
                {
                    case 0:this.pageWeek="周日";break;
                    case 1:this.pageWeek="周一";break;
                    case 2:this.pageWeek="周二";break;
                    case 3:this.pageWeek="周三";break;
                    case 4:this.pageWeek="周四";break;
                    case 5:this.pageWeek="周五";break;
                    case 6:this.pageWeek="周六";break;
                    default:this.pageWeek="系统错误！"
                };
                switch(myday)
                {
                    case 0:this.pageWeekT="星期日";break;
                    case 1:this.pageWeekT="星期一";break;
                    case 2:this.pageWeekT="星期二";break;
                    case 3:this.pageWeekT="星期三";break;
                    case 4:this.pageWeekT="星期四";break;
                    case 5:this.pageWeekT="星期五";break;
                    case 6:this.pageWeekT="星期六";break;
                    default:this.pageWeekT="系统错误！"
                };
                //让时间在页面显示
                this.pageDate = $filter("date")(now1, "yyyy-MM-dd");
                this.pageDateT = $filter("date")(now1, "yyyy年MM月dd日");
                this.Now=$filter("date")(now1, "HH:mm:ss");

                //写一个方法获取当前时间
                this.SetTimer=function(){
                    //angularJs的特性，需要手动把变化映射到html元素上面
                    $scope.$apply(function(){
                        var now=new Date();
                        selt.Now = $filter("date")(now, "HH:mm:ss");
                    });
                };
                //每隔1秒刷新一次时间
                this.SetTimerInterval=window.setInterval(this.SetTimer,1000);

                //JS-SDK授权---------------
                var params = {};
                $http.post("/authorize/fetchJsApiTicket?url="+encodeURIComponent(window.location.href),angular.toJson(params)).success(function (result) {
                    selt.appId=result.appId;
                    selt.timestamp=result.timestamp;
                    selt.nonceStr=result.nonceStr;
                    selt.signature=result.signature;

                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: selt.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
                        timestamp: selt.timestamp, // 必填，生成签名的时间戳
                        nonceStr: selt.nonceStr, // 必填，生成签名的随机串
                        signature: selt.signature,// 必填，签名，见附录1
                        jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                    wx.ready(function(){
                        selt.submitOrderInfoClick();
                    });

                    wx.error(function(res){
                    });
                    //页面业务代码
                });
                //获取用户信息授权
                $http.get("/authorize/oauth2?code="+code,null).success(function (result) {
                    if(result.status==1){
                        selt.openid=result.openid;
                        console.log("===="+selt.openid);
                        var paramsAtt = {
                            "openId":selt.openid
                        };
                        $http.post("/mobileAttence/getAttenceToday",angular.toJson(paramsAtt)).success(function (result) {
                            if(result.status==1){
                                selt.attence = result.attenceVo;
                                if(selt.attence.signinTime){
                                    selt.attence.signinTime = $filter("date")(selt.attence.signinTime, "HH:mm:ss");
                                }
                                if(selt.attence.signoutTime){
                                    selt.attence.signoutTime = $filter("date")(selt.attence.signoutTime, "HH:mm:ss");
                                }

                                console.log("====="+selt.attence.name);
                                console.log("====="+selt.attence.workNum);
                                console.log("====="+selt.attence.tagName);
                                console.log("====="+selt.attence.position);
                                console.log("====="+selt.attence.signinTime);
                                console.log("====="+selt.attence.signoutTime);
                            }

                        });
                    }else{
                        alert("授权失败!");
                    }

                });




                //获取GPS经纬度----
                this.submitOrderInfoClick = function (){
                    wx.getLocation({
                        success: function (res) {
                            //alert("获取地理位置成功，经纬度为：（" + res.latitude + "，" + res.longitude + "）" );
                            selt.latitude = res.latitude;
                            selt.longitude = res.longitude;
                            selt.accuracy = res.accuracy;
                            selt.GPSStr = res.longitude+","+res.latitude;
                            selt.baidumapurl="/baidumap/getCoordinateBaiduMapView/?coordinate="+selt.GPSStr;
                            selt.getaddress(selt.GPSStr);

                        },
                        fail: function(error) {
                            //AlertUtil.error("获取地理位置失败，请确保开启GPS且允许微信获取您的地理位置！");
                        }
                    });
                };

                //签到签退-------
                this.signInOrOutClick = function (type) {
                    if(type=='sign'&&selt.attenceRemark==undefined){
                        alert("请填写外出事由");
                    }else{
                        var signParam = {
                            "openId":selt.openid,
                            "longitude":selt.longitude,
                            "latitude":selt.latitude,
                            "accuracy":selt.accuracy,
                            "attenceDate":selt.pageDate,
                            "attenceWeek":selt.pageWeek,
                            "type":type,
                            "name":selt.attence.name,
                            "workNum":selt.attence.workNum,
                            "remark":selt.attenceRemark,
                            "address":selt.address,
                            "tagId":selt.attence.tagId
                        };
                        if(type=='signOut'||type=='sign'){
                            var confrimInstance = $uibModal.open({
                                templateUrl: 'signConfirm.html',
                                controller: 'signConfirmController',
                                controllerAs: '$confirmctrl',
                                size: 'sm'
                            });
                            confrimInstance.result.then(function (conf) {
                                $http.post("/mobileAttence/signInOrOut",angular.toJson(signParam)).success(function (result) {
                                    if(result.status==1){
                                        selt.attence = result.attenceVo;
                                        if(selt.attence.signinTime){
                                            selt.attence.signinTime = $filter("date")(selt.attence.signinTime, "HH:mm:ss");
                                        }
                                        if(selt.attence.signoutTime){
                                            selt.attence.signoutTime = $filter("date")(selt.attence.signoutTime, "HH:mm:ss");
                                        }
                                        if(type=='signIn'){
                                            alert("签到成功");
                                        }else if(type=='signOut'){
                                            alert("签退成功");
                                        }else if(type=='sign'){
                                            alert("考勤成功");
                                        }
                                        console.log("===签到=="+selt.attence.signinTime);
                                        console.log("===签退=="+selt.attence.signoutTime);
                                    }else if(result.status==0){
                                        alert(result.msg);
                                    }

                                });
                            });
                        }else{
                            $http.post("/mobileAttence/signInOrOut",angular.toJson(signParam)).success(function (result) {
                                if(result.status==1){
                                    selt.attence = result.attenceVo;
                                    if(selt.attence.signinTime){
                                        selt.attence.signinTime = $filter("date")(selt.attence.signinTime, "HH:mm:ss");
                                    }
                                    if(selt.attence.signoutTime){
                                        selt.attence.signoutTime = $filter("date")(selt.attence.signoutTime, "HH:mm:ss");
                                    }
                                    if(type=='signIn'){
                                        alert("签到成功");
                                    }else if(type=='signOut'){
                                        alert("签退成功");
                                    }else if(type=='sign'){
                                        alert("考勤成功");
                                    }
                                    console.log("===签到=="+selt.attence.signinTime);
                                    console.log("===签退=="+selt.attence.signoutTime);
                                }else if(result.status==0){
                                    alert(result.msg);
                                }

                            });
                        }
                    }



                };
                //获取地址信息--------
                this.getaddress=function(GPSStr) {
                    $http.get("/baidumap/getAddressForCoordinateList/?coordinate=" + GPSStr).success(function (result) {
                        selt.addressList = result;

                        selt.address = result[0].address;
                    });
                };


                this.open = function (size, parentSelector) {
                    var parentElem = parentSelector ?
                        angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                    var modalInstance = $uibModal.open({
                        animation: selt.animationsEnabled,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'myModalContent.html',
                        controller: 'ModalInstanceCtrl',
                        controllerAs: '$ctrl',
                        size: size,
                        appendTo: parentElem,
                        resolve: {
                            items: function () {
                                return selt.addressList;
                            }
                        }
                    });

                    modalInstance.result.then(function (selectedItem) {
                        selt.address = selectedItem.address;
                        selt.baidumapurl="/baidumap/addressFineTune/?coordinate="+selectedItem.GPSStr;
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };

                //测试用
                /*this.baidumapurl="/baidumap/getCoordinateBaiduMapView/?coordinate=112.87425,28.21533";
                this.getaddress('112.85190,26.42187');
                this.longitude = 112.87425;
                this.latitude = 28.21533;*/
            }
        }])
        .filter('attenceAddress',function(){
        return function(address){
            if(address!=undefined&&address.indexOf("梦洁家纺(谷苑路店)") >= 0){
                var str = address.split("[");
                return str[0]+"[湖南创星科技股份有限公司]"
            }
            if(address!=undefined&&address.indexOf("麓谷国际工业园") >= 0){
                var str = address.split("[");
                return str[0]+"[湖南创星科技股份有限公司]"
            }
            if(address!=undefined&&address.indexOf("湖南远越农业信息化科技有限公司") >= 0){
                var str = address.split("[");
                return str[0]+"[湖南创星科技股份有限公司]"
            }
            return address;
        }
    });
})();


angular.module('attenceApp').controller('signConfirmController', function ($uibModalInstance,$http) {
    var conf=this;
    conf.ok=function(){
        var success=true;
        $uibModalInstance.close(success);

    }
    conf.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

angular.module('attenceApp').controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
    var $ctrl = this;
    $ctrl.items = items;
    $ctrl.selected = {
        item: $ctrl.items[0]
    };
    $ctrl.ok = function () {
        $uibModalInstance.close($ctrl.selected.item);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});