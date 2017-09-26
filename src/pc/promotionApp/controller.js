/**
 * Created by sakfi on 2017/9/1.
 */
app.controller('promotionAppCtrl', ['$scope','$http','$log','$modal','$filter', function($scope,$http,$log,$modal,$filter) {
    var selt = this;
    //---页面按钮权限控制--start--


    $http.post("/promotionApp/getCompanyList").success(function (result) {
        if (result.success) {
            selt.companyList = result.object;
        } else {
            alert(result.message);
        }
    });
    this.getDeptList=function(){
        if(selt.companyPkid==undefined) {
            alert("请选择公司");
            return;

        }
        if(selt.companyPkid==""){
            selt.deptList=[];
            return;
        }
        var url="/promotionApp/"+selt.companyPkid+"/getDeptList";
        $http.post(url).success(function (result) {
            if (result.success) {
                selt.deptList = result.object;
            } else {
                alert(result.message);
            }
        });
    }
    this.search=function(){
        this.setPage(1);
    }

    this.setPage = function (pageNo) {

        var comPkid;
        var depPkid;
        if(selt.companyPkid!=undefined&&selt.companyPkid!="") comPkid="|"+selt.companyPkid+"|";
        if(selt.deptPkid!=undefined&&selt.deptPkid!="") depPkid="|"+selt.deptPkid+"|";

        var param={
            "tagCode_c":comPkid,
            "tagCode_d":depPkid,
            "name":selt.perName,
            "pageNo":pageNo,
            "pageSize":10
        };
        $http.post("/promotionApp/getRankCheckList",angular.toJson(param)).success(function (result) {
            if(result.code==1){
                selt.rankCheckList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.rankCheckList = [];
            }

        });
    };

    this.maxSize = 3;
    this.setPage(1);

    this.pageChanged=function(){

        var comPkid;
        var depPkid;
        if(selt.companyPkid!=undefined&&selt.companyPkid!="") comPkid="|"+selt.companyPkid+"|";
        if(selt.deptPkid!=undefined&&selt.deptPkid!="") depPkid="|"+selt.deptPkid+"|";

        var param={
            "tagCode_c":comPkid,
            "tagCode_d":depPkid,
            "name":selt.perName,
            "pageNo":this.pageNo,
            "pageSize":10
        };
        $http.post("/promotionApp/getRankCheckList",angular.toJson(param)).success(function (result) {
            if(result.code==1){
                selt.rankCheckList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.rankCheckList = [];
            }

        });
    }

    //复选框操作
    selt.selected=[];
    this.updateSelection = function ($event, rankCheck) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        selectedCheck(action, rankCheck);
    }
    var selectedCheck=function(action,rankCheck){
        if(action=='add' && selt.selected.indexOf(rankCheck) == -1){
            selt.selected.push(rankCheck);
            selt.sel=rankCheck;
            selt.sel.check=true;
        }
        if (action == 'remove' && selt.selected.indexOf(rankCheck) != -1) {
            var idx = selt.selected.indexOf(rankCheck);
            selt.selected.splice(idx, 1);
            selt.sel=rankCheck;
            selt.sel.check=false;
        }
    }

    this.selectAll=function($event){
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        if(action=='add'){
            selt.selected=[];
        }
        angular.forEach(selt.rankCheckList, function(item) {
            selectedCheck(action,item);
        });
    };

    this.Approval=function(rankCheck,size){
        selt.selectPro=[];
        selt.selectPro.push(rankCheck);
        var promotionInstance = $modal.open({
            templateUrl: 'promotion.html',
            controller: 'promotionApprovalCtrl as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return selt.selectPro;
                }
            }
        });

        promotionInstance.result.then(function () {
            selt.setPage(1);
        });
    }

    this.batchApproval=function(size){
        if(selt.selected.length==0){
            alert("请选择行数");
            return;
        }
        var promotionInstance = $modal.open({
            templateUrl: 'promotion.html',
            controller: 'promotionApprovalCtrl as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return selt.selected;
                }
            }
        });

        promotionInstance.result.then(function () {
            selt.setPage(1);
        });


    }

}]);

app.controller('promotionApprovalCtrl', ['$scope', '$modalInstance','$http', 'data', function($scope,$modalInstance,$http,data) {
    var seltPro=this;

    seltPro.name="";
    this.submitted=false;
    angular.forEach(data, function(item) {
        seltPro.name=seltPro.name+item.name+",";
    });

    this.agreePromotion=function(){
        if(seltPro.remark==undefined||seltPro.remark==""){
            this.submitted=true;
            return;
        }
        angular.forEach(data, function(item) {
            item.remark=seltPro.remark;
        });

        $http.post("/promotionApp/agreeUpdateRank",angular.toJson(data)).success(function (result) {
            alert(result.message);
            $modalInstance.close();
        });
    };

    this.notAgreePromotion=function(){

        if(seltPro.remark==undefined||seltPro.remark==""){
            this.submitted=true;
            return;
        }
        angular.forEach(data, function(item) {
            item.remark=seltPro.remark;
        });

        $http.post("/promotionApp/disagreeUpdateRank",angular.toJson(data)).success(function (result) {
            alert(result.message);
            $modalInstance.close();
        });
    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])