(function() {
    angular
        .module('MOBILEAPP.TREATEDDET.CONTROLLER', ['ui.bootstrap'])
        .controller('treatedDetCtrl', ['$http','$uibModal','$log','$document','utils',function($http,$uibModal, $log, $document,utils) {
            var selt = this;
            var pkid=utils.getUrlVar("pkid");
                //todo 测试openId
            var openId="o8qZCwdhpNkRkSwlNLC1WOwB37bE";
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
                            selt.type="交接单审批";
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


        }]);
})();