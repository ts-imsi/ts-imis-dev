app.controller('planTempCtrl', ['$scope','$http','$log','$modal','$filter', function($scope,$http,$log,$modal,$filter) {
    var selt = this;


    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10
        };
        $http.post("/planTemplate/queryPlanTemp",angular.toJson(parm)).success(function (result) {
            if(result.code==1){
                selt.planTempList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;;
                selt.pageNo = result.pageNo;
            }else{
                selt.planTempList = [];
            }

        });
    };



    this.pageChanged = function() {
        $log.log('Page changed to: ' + this.pageNo);
        var parm={
            page:this.pageNo,
            rows:10
        };
        $http.post("/planTemplate/queryPlanTemp",angular.toJson(parm)).success(function (result) {
            if(result.code==1){
                selt.planTempList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;;
                selt.pageNo = result.pageNo;
            }else{
                selt.planTempList = [];
            }

        });
    };

}]);
