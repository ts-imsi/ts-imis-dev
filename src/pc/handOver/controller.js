app.controller('handOverCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;

    this.selectContract=function(){

        this.setPage(1);
    }

    this.selectChange=function(){
        this.setPage(1);
    };

    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            selectName:selt.selectName,
            selectType:selt.selectType
        };
        console.log(parm);
        $http.post("/ts-project/handover/getHtHandoverList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.htHandOverList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.htHandOverList=[];
                alert(result.message);
            }

        });
    };


    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        var parm={
            page:this.pageNo,
            rows:10,
            selectName:selt.selectName,
            selectType:selt.selectType
        };
        $http.post("/ts-project/handover/getHtHandoverList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.htHandOverList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.htHandOverList=[];
                alert(result.message);
            }
        });

    };

    this.maxSize = 5;
    this.setPage(1);

}]);
