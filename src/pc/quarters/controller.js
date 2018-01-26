/**
 * Created by sakfi on 2018/1/26.
 */
app.controller('quartersCtrl',['$scope', '$modal', '$http', '$log','$stateParams', function ($scope, $modal, $http, $log,$stateParams){
    var selt=this;

    selt.submittwfDict=false;
    selt.updatetwfDict=false;

    selt.status=0;
    this.selectByName=function(){
        selt.setPage(1);
    }

    this.setPage = function (pageNo) {
        var param={
            page:pageNo,
            rows:10,
            type:6,
            selectName:selt.selectName
        }
        $http.post("/ts-project/twfDict/selectQuarters",angular.toJson(param)).success(function (result) {
            if(result.success){
                selt.twfDictList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.twfDictList=[];
                alert(result.message);
            }
        });
    };

    this.pageChanged = function () {
        var param={
            page:this.pageNo,
            rows:10,
            type:6,
            selectName:selt.selectName
        }
        $http.post("/ts-project/twfDict/selectQuarters",angular.toJson(param)).success(function (result) {
            if(result.success){
                selt.twfDictList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.twfDictList=[];
                alert(result.message);
            }
        });
    }

    this.maxSize = 5;
    this.setPage(1);



    this.deleteTwfDict=function(pkid){
        var msg = "请确认是否删除岗位！";
        if(confirm(msg)==true){
            $http.post("/ts-project/twfDict/deleteTwfDict/"+pkid).success(function (result) {
                if(result.success){
                    alert(result.message);
                    selt.setPage(1);
                }else{
                    alert(result.message);
                }
            });
        }

    }

    this.showTwfDict=function(twfDict){
        selt.submitted=false;
        if(twfDict==""){
            selt.twfDict={type:6,isVaild:1};
            selt.submittwfDict=true;
            selt.updatetwfDict=false;
        }else{
            selt.twfDict=twfDict;
            selt.updatetwfDict=true;
            selt.submittwfDict=false;
        }
    }

    this.twfDictSubmit=function(valid,invalid,twfDict){
        if (valid) {
            if (!invalid) {
                if(selt.submittwfDict){
                    selt.saveTwfDict(twfDict);
                }else{
                    selt.updateTwfDict(twfDict);
                }
            }
        }else{
            selt.submitted=true;
        }
    }

    this.updateTwfDict=function(twfDict){
        $http.post("/ts-project/twfDict/updateTwfDict",angular.toJson(twfDict)).success(function (result) {
            if(result.success){
                alert(result.message);
                selt.closePanel();
                selt.setPage(1);
            }else{
                alert(result.message);
            }
        });
    }

    this.saveTwfDict=function(twfDict){
        $http.post("/ts-project/twfDict/saveTwfDict",angular.toJson(twfDict)).success(function (result) {
            if(result.success){
                alert(result.message);
                selt.closePanel();
                selt.setPage(1);
            }else{
                alert(result.message);
            }
        });
    }

    //制定计划划出层样式
    this.panelClass = "person panel panel-default";

    this.openPanel = function () {
        selt.panelClass = "person panel panel-default active";
    };
    this.closePanel = function () {
        selt.panelClass = "person panel panel-default";
    }
}]);