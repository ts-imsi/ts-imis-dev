(function() {
    angular
        .module('MOBILEAPP.TRANSFER.CONTROLLER', ['ui.bootstrap'])
        .controller('transferCtrl', ['$http','$uibModal','$log','$document','utils',function($http,$uibModal, $log, $document,utils) {
            var selt = this;
            var depName=utils.getUrlVar("depName");
            var param={
                depName:depName
            }
            $http.post("/ts-project/mobileTransfer/queryHandOverList",angular.toJson(param)).success(function (result) {
                if (result.success) {
                    selt.handOverList=result.object;
                } else {
                    selt.handOverList=[];
                    alert(result.message);
                }
            });
        }]);

    angular
        .module('MOBILEAPP.TRACHEDULE.CONTROLLER', ['ui.bootstrap'])
        .controller('traCheduleCtrl', ['$http','$uibModal','$log','$document','utils',function($http,$uibModal, $log, $document,utils) {
            var selt = this;
            var processId=utils.getUrlVar("processId");
            $http.post("/ts-project/mobileTransfer/queryHandOverByProcessId/"+processId).success(function (result) {
                if (result.success) {
                    selt.handover=result.tbHtHandover;
                    selt.timeLineVos=result.timeLineVos;
                } else {
                    selt.handover='';
                    selt.timeLineVos=[];
                    alert(result.message);
                }
            });
        }]);
})();
