/**
 * Created by sakfi on 2017/8/31.
 */
app.controller('recordLevelCtrl', ['$scope','$http','$log','$modal','$filter', function($scope,$http,$log,$modal,$filter) {
    var selt = this;

    this.checkAll=false;
    selt.selected=[];

    //---页面按钮权限控制--start--


    $http.post("/record/getRecordRankList").success(function (result) {
        if(result.success){
            selt.recordRankList = result.object;
        }else{
            selt.recordRankList = [];
        }
    });

    this.selectLevel=function(recordRank){

        angular.forEach(selt.recordRankList, function(item) {
            item.selected = false;
            item.check = false;
            item.editing = false;
            item.selectedStyle = {};
            $scope.checkAll = false;
            selt.selected=[];

        });
        selt.recordLevel=recordRank;
        selt.recordLevel.selectedStyle={'background-color':'#edf1f2'};
        selt.levelAdd=false;
        selt.recordLevel.check=true;
        selt.selected.push(selt.recordLevel.pkid);

    }

    this.editLevel=function(recordRank){
        if(recordRank==""||recordRank==undefined){
            alert("请选择一行数据");
            return;
        }
        selt.levelAdd=true;
        selt.recordLevel.editing=true;
    }
    this.doneEditingLevel=function(recordRank){
        selt.levelAdd=false;
        selt.recordLevel.editing=false;
    }
    this.deleteSignLevel=function(recordRank){
        if(recordRank==""||recordRank==undefined){
            alert("请选择一行数据");
            return;
        }
        var r=confirm("是否删除积分等级");
        if(r==true){
            $http.post("/record/deleteRecordRank", angular.toJson(recordRank)).success(function (result) {
                if (result.success) {
                    alert(result.message);
                    $http.post("/record/getRecordRankList").success(function (result) {
                        if (result.success) {
                            selt.recordRankList = result.object;
                        } else {
                            selt.recordRankList = [];
                        }
                    });
                    selt.recordLevel="";
                } else {
                    alert(result.message);
                }
            });
        }
    }

    this.doLevel=function(){
        $http.post("/record/saveRecordLevel", angular.toJson(selt.recordLevel)).success(function (result) {
            if (result.success) {
                alert(result.message);
                selt.levelAdd=false;
                selt.recordLevel.editing=false;
                if(result.message=="新增数据成功"){
                    selt.recordLevel.pkid=result.object;
                }
                $http.post("/record/getRecordRankList").success(function (result) {
                    if (result.success) {
                        selt.recordRankList = result.object;
                    } else {
                        selt.recordRankList = [];
                    }
                });
            } else {
                alert(result.message);
            }
        });
    }

    this.createLevel=function(){
        angular.forEach(selt.recordRankList, function(item) {
            item.selected = false;
            item.check = false;
            item.editing = false;
            item.selectedStyle = {};
            $scope.checkAll = false;
            this.selected=[];

        });
        selt.recordLevel="";
        selt.levelAdd=true;
        selt.recordLevel.editing=true;
    }

    this.updateSelection = function ($event, record) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        selectedCheck(action, record);
    }
    var selectedCheck=function(action,record){
        if(action=='add' && selt.selected.indexOf(record.pkid) == -1){
            selt.selected.push(record.pkid);
            selt.sel=record;
            selt.sel.check=true;
        }
        if (action == 'remove' && selt.selected.indexOf(record.pkid) != -1) {
            var idx = selt.selected.indexOf(record.pkid);
            selt.selected.splice(idx, 1);
            selt.sel=record;
            selt.sel.check=false;
        }
    }

    this.selectAll=function($event){
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        if(action=='add'){
            selt.selected=[];
        }
        angular.forEach(selt.recordRankList, function(item) {
                selectedCheck(action,item);
            });
    };

    this.deleteLevel=function(){
        if(selt.selected.length==0){
            alert("请选择数据");
            return;
        }
        var r=confirm("是否批量删除积分等级");
        if(r==true){
            $http.post("/record/deleteMoreRecordRank", angular.toJson(selt.selected)).success(function (result) {
                if (result.success) {
                    alert(result.message);
                    $http.post("/record/getRecordRankList").success(function (result) {
                        if (result.success) {
                            selt.recordRankList = result.object;
                        } else {
                            selt.recordRankList = [];
                        }
                    });
                    selt.recordLevel="";
                } else {
                    alert(result.message);
                }
            });
        }
    }
}]);