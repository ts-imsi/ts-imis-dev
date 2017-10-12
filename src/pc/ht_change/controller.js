app.controller('htChangeCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;

    this.selectContract=function(){

        this.setPage(1);
    }
    this.selectByStatus=function(status){
        /*switch (status){
            case '0':
                selt.status=status;
                break;
            case '1':
                selt.status=status;
                break;
        }*/
        if(status==0){
            selt.status='';
        }else{
            selt.status=status;
        }
        this.setPage(1);
    }
    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            selectName:selt.selectName,
            status:selt.status
        };
        console.log(parm);
        $http.post("/ts-project/htChange/getHtChangeList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.htChangeList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.htChangeList=[];
            }

        });
    };


    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        var parm={
            page:this.pageNo,
            rows:10,
            selectName:selt.selectName,
            status:selt.status
        };
        $http.post("/ts-project/htChange/getHtChangeList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.htChangeList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.htChangeList=[];
            }
        });

    };

    this.maxSize = 5;
    this.setPage(1);




    //交接单划出层样式
    this.panelClass = "contact panel panel-default";

    this.openPanel = function () {
        selt.panelClass = "contact panel panel-default active";
    };
    this.closePanel = function () {
        selt.panelClass = "contact panel panel-default";
        selt.selectTag('1');
    };

    //产值分解划出层
    this.opvPanelClass = "person panel panel-default";

    this.openOPVPanel = function () {
        selt.opvPanelClass = "person panel panel-default active";
    };
    this.closeOPVPanel = function () {
        selt.opvPanelClass = "person panel panel-default";
    };
}]);
