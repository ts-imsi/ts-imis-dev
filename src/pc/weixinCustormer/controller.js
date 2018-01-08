app.controller('weixinCustormerCtrl',['$scope', '$modal', '$http', '$log','$stateParams', function ($scope, $modal, $http, $log,$stateParams){
    var selt=this;

    selt.updateweixinCus=false;
    selt.submitweixinCus=false;

    this.selectWeixinCus=function(){
        selt.setPage(1);
    }

    this.setPage = function (pageNo) {
        var param={
            page:pageNo,
            rows:10,
            selectName:selt.selectName
        }
        $http.post("/ts-project/weixinCus/selectWeixinCustomerList",angular.toJson(param)).success(function (result) {
            if(result.success){
                selt.wxCusList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.wxCusList=[];
                alert(result.message);
            }
        });
    };

    this.pageChanged = function () {
        var param={
            page:this.pageNo,
            rows:10,
            selectName:selt.selectName
        }
        $http.post("/ts-project/weixinCus/selectWeixinCustomerList",angular.toJson(param)).success(function (result) {
            if(result.success){
                selt.wxCusList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.wxCusList=[];
                alert(result.message);
            }
        });
    }

    this.maxSize = 5;
    this.setPage(1);

    this.deleteWxCus=function(pkid){
        $http.post("/ts-project/weixinCus/deleteWxCus/"+pkid).success(function (result) {
            if(result.success){
                alert(result.message);
                selt.setPage(1);
            }else{
                alert(result.message);
            }
        });
    }


    this.showWeixinCus=function(weixinCus){
        if(weixinCus==""){
            selt.weixinCus='';
            selt.submitweixinCus=true;
            selt.updateweixinCus=false;
        }else{
            selt.weixinCus=weixinCus;
            selt.updateweixinCus=true;
            selt.submitweixinCus=false;
        }
    }
    this.weixinCusSubmit=function(valid,invalid,wxCus){
        if (valid) {
            if (!invalid) {
                if(selt.submitweixinCus){
                    selt.saveWxCus(wxCus);
                }else{
                    selt.updateWxCus(wxCus);
                }
            }
        }else{
            selt.submitted=true;
        }
    }

    this.updateWxCus=function(wxCus){
        $http.post("/ts-project/weixinCus/updateWxCus",angular.toJson(wxCus)).success(function (result) {
            if(result.success){
                alert(result.message);
                selt.closePanel();
                selt.setPage(1);
            }else{
                alert(result.message);
            }
        });
    }

    this.saveWxCus=function(wxCus){
        $http.post("/ts-project/weixinCus/saveWxCus",angular.toJson(wxCus)).success(function (result) {
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