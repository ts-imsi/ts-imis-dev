(function() {
    angular
        .module('MOBILEAPP.TRANSFER.CONTROLLER', ['ui.bootstrap'])
        .controller('transferCtrl', ['$http','$uibModal','$log','$document','utils',function($http,$uibModal, $log, $document,utils) {
            var selt = this;

            selt.outputValueM=false;
            selt.confirValueM=false;
            selt.transactM=false;
            selt.handoverM=false;
            selt.projectMentM=false;
            $http.get("/ts-authorize/ts-mobile/menus").success(function(result){
                if(result.success){
                    if(result.object[0].length!=0) {
                        selt.munuList = result.object[0].childrens;
                        angular.forEach(selt.munuList, function (item) {
                            if (item.translate == 'outputValue') {
                                selt.outputValueM = true;
                            } else if (item.translate == 'confirValue') {
                                selt.confirValueM = true;
                            } else if (item.translate == 'transact') {
                                selt.transactM = true;
                            } else if (item.translate == 'handover') {
                                selt.handoverM = true;
                            } else if (item.translate == 'projectMent') {
                                selt.projectMentM = true;
                            }

                        });
                    }else{
                        selt.munuList = [];
                    }

                }else{
                    selt.munuList = [];
                }
            });


            this.queryHandOver=function(){
                var param={
                    showAll:selt.showAll
                };
                $http.post("/ts-project/mobileTransfer/queryHandOverList",angular.toJson(param)).success(function (result) {
                    if (result.success) {
                        selt.handOverList=result.object;
                    } else {
                        selt.handOverList=[];
                        alert(result.message);
                    }
                });
            }
            //---页面按钮权限控制--start--
            this.opCodes = [];
            this.isShowOpe = function(value){
                for(var i = 0; i < selt.opCodes.length; i++){
                    if(value === selt.opCodes[i]){
                        return true;
                    }
                }
                return false;
            };
            $http.get("/ts-authorize/ts-mobile/operList/transfer").success(function (result) {
                if (result.success) {
                    selt.opCodes = result.object;
                    if(selt.isShowOpe("all")){
                        selt.showAll = "all";
                    }
                    selt.queryHandOver();
                } else {
                    alert(result.message);
                }
            });

            //-------------------end---

            this.test=function(){
                selt.showAll = "all";
                selt.queryHandOver();
            };
            //this.test();
        }]);

    angular
        .module('MOBILEAPP.TRACHEDULE.CONTROLLER', ['ui.bootstrap'])
        .controller('traCheduleCtrl', ['$http','$uibModal','$log','$document','utils',function($http,$uibModal, $log, $document,utils) {
            var selt = this;
            var processId=utils.getUrlVar("processId");
            $http.post("/ts-project/mobileTransfer/queryHandOverByProcessId/"+processId).success(function (result) {
                if (result.success) {
                    selt.handover=result.tbHtHandover;
                    angular.forEach(result.tempVo,function(item){
                        if(item.name=="合同分解信息"){
                            selt.tempVo=item;
                        }
                    });
                    selt.timeLineVos=result.timeLineVos;
                    selt.proModuleVos=result.proModuleVos;
                    selt.total=result.total;
                } else {
                    selt.handover='';
                    selt.timeLineVos=[];
                    alert(result.message);
                }
            });
        }]);
})();
