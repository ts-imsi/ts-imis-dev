app.controller('CountReport', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;

    this.year = $filter("date")(new Date(), "yyyy");
    selt.showAll=true;
    selt.showPro=false;
    selt.showProLine=false;
    this.selectByType=function(showType) {
        if (showType == 'all') {
            selt.showAll=true;
            selt.showPro=false;
            selt.setPage(1);
        } else {
            selt.showPro = true;
            selt.showAll = false;
            if(showType=='pro'){
                selt.showProLine=true;
            }else{
                selt.showProLine=false;
            }
            selt.totalCount = 0;
            selt.finishedCount = 0;
            selt.unfinishedCount = 0;
            selt.nextUnCount=0;
            selt.countReportByType(showType);
        }
    }

    this.countReportByType=function(showType){
        var param={
            year:selt.year,
            selectType:showType
        }

        $http.post("/ts-project/countReport/getCountReport",angular.toJson(param)).success(function (result) {
            if(result.success){
                selt.countRPro = result.object;
                angular.forEach(selt.countRPro,function(item){
                    selt.unfinishedCount=selt.unfinishedCount+item.unfinished;
                    selt.finishedCount=selt.finishedCount+item.finished;
                    selt.totalCount=selt.totalCount+item.total;
                    selt.nextUnCount=selt.nextUnCount+item.lastUnFinished;
                });
            }else{
                selt.countRPro=[];
            }

        });
    }

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

