app.controller('projectArrangeCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;


    selt.isArrange=0;
    this.selectByStatus=function(status){
        selt.isArrange=status;
        this.setPage(1);
    }
    this.selectArrange=function(){
        this.setPage(1);
    }

    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            selectName:selt.selectName,
            isArrange:selt.isArrange
        };
        console.log(parm);
        $http.post("/ts-project/arrange/selectProjectArrangeList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.handOverList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.handOverList=[];
            }

        });
    };


    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        var parm={
            page:this.pageNo,
            rows:10,
            selectName:selt.selectName,
            isArrange:selt.status
        };
        $http.post("/ts-project/arrange/selectProjectArrangeList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.handOverList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.handOverList=[];
            }
        });

    };

    this.maxSize = 5;
    this.setPage(1);

}]);