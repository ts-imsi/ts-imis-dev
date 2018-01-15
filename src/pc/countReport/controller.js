app.controller('CountReport', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;


    this.sync=function(){
        $http.get("/ts-project/countReport/countOutputValue").success(function (result) {
            if(result.success){
                alert("数据同步成功");
            }else{
                alert("数据同步失败");
            }
        });

    }

    this.year = $filter("date")(new Date(), "yyyy");
    selt.showAll=true;
    selt.showPro=false;
    selt.showProLine=false;
    selt.dbClickCountParam="";
    this.selectByType=function(showType) {
        if (showType == 'all') {
            selt.showAll=true;
            selt.showPro=false;
            selt.excelExprot="/ts-project/countReport/excelCountReportExport?year="+selt.year;
            selt.setPage(1);
        } else {
            selt.dbClickCountParam={
                year:selt.year,
                selectType:showType,
                selectName:''
            }
            selt.excelExprot="/ts-project/countReport/excelCountReportByTypeExport?year="+selt.year+"&selectType="+showType;
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

    this.dblclickCountReport = function (outputCount) {
        selt.dbClickCountParam.selectName=outputCount.name;
        var countRDeilInstance = $modal.open({
            templateUrl: 'countRDeil.html',
            controller: 'countRDeilCtrl as ctrl',
            size: 'lg',
            resolve: {
                data: function () {
                    return selt.dbClickCountParam;
                }
            }
        });
        countRDeilInstance.result.then(function () {
        });

    };

    this.printLetter=function(){
        $("#countReport").printThis({
            debug: false,
            importCSS: true,
            importStyle: true,
            printContainer: true,
            removeInline: false,
            printDelay: 333,
            header: null,
            formValues: false
        });
    }

}]);

app.controller('countRDeilCtrl', ['$scope', '$modalInstance','$http', 'data', function($scope,$modalInstance,$http,data) {
    var seltC=this;
        this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            year:data.year,
            selectType:data.selectType,
            selectName:data.selectName
        };
        $http.post("/ts-project/countReport/getOutputDetailed",angular.toJson(parm)).success(function (result) {
            if(result.success){
                seltC.outputList = result.list;
                seltC.totalCount = result.totalCount;
                seltC.pageSize = result.pageSize;
                seltC.pageNo = result.pageNo;
            }else{
                seltC.outputList=[];
            }

        });
    };


    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        var parm={
            page:this.pageNo,
            rows:10,
            year:data.year,
            selectType:data.selectType,
            selectName:data.selectName
        };
        $http.post("/ts-project/countReport/getOutputDetailed",angular.toJson(parm)).success(function (result) {
            if(result.success){
                seltC.outputList = result.list;
                seltC.totalCount = result.totalCount;
                seltC.pageSize = result.pageSize;
                seltC.pageNo = result.pageNo;
            }else{
                seltC.outputList=[];
            }
        });

    };
    seltC.setPage(1);
    this.excelOutputExprot="/ts-project/countReport/getOutputDetailedExport?year="+data.year+"&selectType="+data.selectType+"&selectName="+data.selectName;
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])
