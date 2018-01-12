app.controller('handOverCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;
    this.maxSize = 5;

    this.selectContract=function(){

        this.setPage(1);
    };

    this.selectChange=function(){
        this.setPage(1);
    };

    this.selectNowStepChange=function(){
        this.setPage(1);
    };

    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            selectName:selt.selectName,
            showAll:selt.showAll,
            selectType:selt.selectType,
            nowStep:selt.nowStep
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
            showAll:selt.showAll,
            selectType:selt.selectType,
            nowStep:selt.nowStep
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




    this.panelClass = "contact panel panel-default";

    this.openPanel = function () {
        selt.panelClass = "contact panel panel-default active";
    };
    this.closePanel = function () {
        selt.panelClass = "contact panel panel-default";
    };

    this.openTimeLine = function (processId) {
        $http.get("ts-project/handover/timeLine/"+processId).success(function (result) {
            if (result.success) {
                selt.timeLineList = result.object;
            } else {
                selt.timeLineList = [];
            }
        });
    };


    this.pdConfirm=function(handOver){
        var pdInstance = $modal.open({
            templateUrl: 'PdConfirm.html',
            controller: 'PdConfirmCtrl as pdCtrl',
            size: 'lg',
            resolve: {
                data: function () {
                    return handOver;
                }
            }
        });

        pdInstance.result.then(function () {

        });
    };



    //---页面按钮权限控制--start--
    this.opCodes = [];
    this.isShowOpe = function(value){
        for(var i = 0; i < selt.opCodes.length; i++){
            if(value === selt.opCodes[i]){
                return true;
            }
        }
        return false;
    };
    $http.get("/ts-authorize/ts-imis/operList/app-handOverList").success(function (result) {
        if (result.success) {
            selt.opCodes = result.object;
            if(selt.isShowOpe("all")){
                selt.showAll = "all";
            }
            selt.setPage(1);
        } else {
            alert(result.message);
        }
    });

    //-------------------end---

}]);

app.controller('PdConfirmCtrl', ['$scope', '$modalInstance','$http', '$filter','data', function($scope,$modalInstance,$http,$filter,data) {
    var selt=this;
    console.log(data);
    $http.get("/ts-project/handover/getPDConfirm/"+data.pkid).success(function (result) {
        if(result.success){
            selt.pdList=result.object;
        }else{
            selt.pdList=[];
        }
    });
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
