app.controller('CountReport', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;

    this.year = $filter("date")(new Date(), "yyyy");

    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            year:selt.year
        };
        $http.post("/ts-project/countReport/getcountReportList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.countRList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.countRList=[];
            }

        });
    };


    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        var parm={
            page:this.pageNo,
            rows:10,
            year:selt.year
        };
        $http.post("/ts-project/countReport/getcountReportList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.countRList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.countRList=[];
            }
        });

    };

    this.maxSize = 5;
    this.setPage(1);
    this.selectYear=function(){
        selt.setPage(1);
    }
}]);

