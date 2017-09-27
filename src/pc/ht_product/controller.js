app.controller('htProductCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;

    this.selectContract=function(){

        this.setPage(1);
    }
    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            selectName:selt.selectName
        };
        console.log(parm);
        $http.post("/ts-project/con_product/getcontractTransenList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.htProductList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.htProductList=[];
            }

        });
    };


    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        var parm={
            page:this.pageNo,
            rows:10,
            selectName:selt.selectName
        };
        $http.post("/ts-project/con_product/getcontractTransenList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.htProductList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.htProductList=[];
            }
        });

    };

    this.maxSize = 5;
    this.setPage(1);




    //划出层样式
    this.panelClass = "contact panel panel-default";

    this.openPanel = function () {
        selt.panelClass = "contact panel panel-default active";
    };
    this.closePanel = function () {
        selt.panelClass = "contact panel panel-default";
        selt.selectTag('1');
    };
    //--tag切换
    this.tagclass01 = "RuActive";
    this.tagclass02 = "";
    this.tagclass03 = "";
    this.tag = 1;
    this.selectTag = function (tag) {
        selt.tag = tag;
        if(tag==1){
            selt.tagclass01="RuActive";
            selt.tagclass02="";
            selt.tagclass03="";
            url = "/personnel/personnelSave";
        }else if(tag==2){
            selt.tagclass01="";
            selt.tagclass02="RuActive";
            selt.tagclass03="";
            url = "/personnel/personnelBasicSave";
        }else if(tag==3){
            selt.tagclass01="";
            selt.tagclass02="";
            selt.tagclass03="RuActive";
            url = "/personnel/personnelFileSave";
        };

    };

    this.handoverView = function (htProduct) {

        selt.showbutton=false;
        selt.submitted=false;




    };

}]);
