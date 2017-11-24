(function() {
    angular
        .module('MOBILEAPP.UNTREATEDDET.CONTROLLER', ['ui.bootstrap'])
        .controller('untreatedDetCtrl', ['$http','$uibModal','$log','$document','utils',function($http,$uibModal, $log, $document,utils) {
            var selt = this;
            var pkid=utils.getUrlVar("pkid");
            $http.post("/ts-project/mobileTransact/queryMobileTreatedByPkid/"+pkid).success(function (result) {
                if (result.success) {
                    if(result.type=="addChange"){
                        selt.type="合同变更";
                        selt.htNo=result.change.htNo;
                        selt.customerName=result.change.customerName;
                        selt.htName=result.change.htName;
                        selt.applicationDept=result.change.applicationDept;
                        selt.createUser=result.change.createUser;
                        selt.created=result.change.created;
                        selt.sendName=result.msg.sendName;
                        selt.nowStep=result.change.nowStep;
                    }
                    if(result.type=="handover"){
                        selt.type="表接单审批";
                        selt.htNo=result.handover.htNo;
                        selt.customerName=result.handover.customerName;
                        selt.htName=result.handover.htName;
                        selt.createUser=result.handover.createUser;
                        selt.created=result.handover.created;
                        selt.sendName=result.msg.sendName;
                        selt.nowStep=result.handover.nowStep;
                    }
                    selt.msg=result.msg;
                } else {
                    alert(result.message);
                }
            });

            this.backApp=function(){
                $document[0].getElementById("backApp").style.display="block";
            }
            this.RetAppDisplayNone=function() {
                $document[0].getElementById("backApp").style.display="none";
            }

            this.apply=function(){
                $http.post("/ts-project/tb_message/submitFlow",angular.toJson(selt.msg)).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                    } else {
                        alert(result.message);
                    }
                });
            };

            this.noApply=function(){
                $http.post("/ts-project/tb_message/returnFlow",angular.toJson(selt.msg)).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                    } else {
                        alert(result.message);
                    }
                });
            };
        }]);
})();
