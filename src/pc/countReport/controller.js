app.controller('CountReport', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;
    selt.selected=[];
    selt.selectedW=[];

    selt.status=1;
    this.selectByStatus = function(status){
        selt.status=status;
        selt.setPage(1);
    }
    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            status:selt.status,
            dtStart:$filter("date")(selt.dtStart, "yyyy-MM-dd"),
            dtEnd:$filter("date")(selt.dtEnd, "yyyy-MM-dd"),
            checkTag:selt.selected,
            noCheckTag:selt.selectedW,
            htNo:selt.htNo,
            customerName:selt.customerName,
            proName:selt.proName
        };
        console.log(parm);
        $http.post("/ts-project/exceptionPlan/selectExceptionPlan",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.excePlanList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.excePlanList=[];
            }

        });
    };


    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        var parm={
            page:this.pageNo,
            rows:10,
            status:selt.status,
            dtStart:$filter("date")(selt.dtStart, "yyyy-MM-dd"),
            dtEnd:$filter("date")(selt.dtEnd, "yyyy-MM-dd"),
            checkTag:selt.selected,
            noCheckTag:selt.selectedW,
            htNo:selt.htNo,
            customerName:selt.customerName,
            proName:selt.proName
        };
        $http.post("/ts-project/exceptionPlan/selectExceptionPlan",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.excePlanList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.excePlanList=[];
            }
        });

    };

    this.maxSize = 5;
    this.setPage(1);
}]);

