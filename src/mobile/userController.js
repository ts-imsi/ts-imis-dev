(function() {
    angular
        .module('MOBILEAPP.USER.CONTROLLER', ['ui.bootstrap','ngCookies'])
        .controller('userCtrl', ['$http','$uibModal','$log','$document','utils','$cookies','$cookieStore',function($http,$uibModal, $log, $document,utils,$cookies, $cookieStore) {
            var openId=utils.getUrlVar("openId");
            console.log("======"+openId);
            var selt = this;
            $cookies.put("userSign",sessionStorage.getItem("X-TOKEN"),{'path':'/'});
            $http.post("/ts-project/mobileUser/selectTbPersonnel").success(function (result) {
                if(result.success){
                    selt.person=result.object;
                }else{
                    alert(result.message);
                }
            });
            selt.outputValueM=false;
            selt.confirValueM=false;
            selt.transactM=false;
            selt.handoverM=false;
            selt.projectMentM=false;
            selt.munuList=[];
            $http.get("/ts-authorize/ts-mobile/menus").success(function(result){
                if(result.success){
                    selt.munuList=result.object[0].childrens;
                    angular.forEach(selt.munuList,function(item){
                        if(item.translate=='outputValue'){
                            selt.outputValueM=true;
                        }else if(item.translate=='confirValue'){
                            selt.confirValueM=true;
                        }else if(item.translate=='transact'){
                            selt.transactM=true;
                        }else if(item.translate=='handover'){
                            selt.handoverM=true;
                        }else if(item.translate=='projectMent'){
                            selt.projectMentM=true;
                        }
                    });

                }
            });
        }]);
})();
