/**
 * Created by sakfi on 2017/9/1.
 */
app.controller('recordApprovalCtrl', ['$scope','$http','$log','$modal','$filter', function($scope,$http,$log,$modal,$filter) {
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
            "company":comPkid,
            "depName":depPkid,
            "name":selt.perName,
            "pageNo":pageNo,
            "pageSize":10
        };
        $http.post("/recordApp/getRecordApprovalList",angular.toJson(param)).success(function (result) {
            if(result.code==1){
                selt.recordAppList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.recordAppList = [];
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
            "company":comPkid,
            "depName":depPkid,
            "name":selt.perName,
            "pageNo":this.pageNo,
            "pageSize":10
        };
        $http.post("/recordApp/getRecordApprovalList",angular.toJson(param)).success(function (result) {
            if(result.code==1){
                selt.recordAppList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.recordAppList = [];
            }

        });
    }

    //复选框操作
    selt.selected=[];
    this.updateSelection = function ($event, recordApp) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        selectedCheck(action, recordApp);
    }
    var selectedCheck=function(action,recordApp){
        if(action=='add' && selt.selected.indexOf(recordApp) == -1){
            selt.selected.push(recordApp);
            selt.sel=recordApp;
            selt.sel.check=true;
        }
        if (action == 'remove' && selt.selected.indexOf(recordApp) != -1) {
            var idx = selt.selected.indexOf(recordApp);
            selt.selected.splice(idx, 1);
            selt.sel=recordApp;
            selt.sel.check=false;
        }
    }

    this.selectAll=function($event){
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        if(action=='add'){
            selt.selected=[];
        }
        angular.forEach(selt.recordAppList, function(item) {
            selectedCheck(action,item);
        });
    };

    this.Approval=function(recordApp,size){
        selt.selectRec=[];
        selt.selectRec.push(recordApp);
        var recordApprovalInstance = $modal.open({
            templateUrl: 'RecordApp.html',
            controller: 'recordAppCtrl as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return selt.selectRec;
                }
            }
        });

        recordApprovalInstance.result.then(function () {
            selt.setPage(1);
        });
    }

    this.batchApproval=function(size){
        if(selt.selected.length==0){
            alert("请选择行数");
            return;
        }
        var recordApprovalInstance = $modal.open({
            templateUrl: 'RecordApp.html',
            controller: 'recordAppCtrl as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return selt.selected;
                }
            }
        });

        recordApprovalInstance.result.then(function () {
            selt.setPage(1);
        });


    }

}]);

app.controller('recordAppCtrl', ['$scope', '$modalInstance','$http', 'data', function($scope,$modalInstance,$http,data) {
    var seltPro=this;

    seltPro.name="";
    angular.forEach(data, function(item) {
        seltPro.name=seltPro.name+item.name+",";
    });
    this.submitted=false;
    this.agreeRecordApp=function(){
        if(seltPro.remark==undefined||seltPro.remark==""){
            this.submitted=true;
            return;
        }
        angular.forEach(data, function(item) {
            item.checkRemark=seltPro.remark;
        });
        $http.post("/recordApp/agreeUpdateJfRecrod",angular.toJson(data)).success(function (result) {
            alert(result.message);
            $modalInstance.close();
        });
    };

    this.notAgreeRecordApp=function(){
        if(seltPro.remark==undefined||seltPro.remark==""){
            this.submitted=true;
            return;
        }
        angular.forEach(data, function(item) {
            item.checkRemark=seltPro.remark;
        });
        $http.post("/recordApp/disareeUpdateJfRecord",angular.toJson(data)).success(function (result) {
            alert(result.message);
            $modalInstance.close();
        });
    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])