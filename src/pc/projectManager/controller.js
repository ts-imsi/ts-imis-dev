app.controller('projectManagerCtrl', ['$scope','$http','$log','$modal','$filter', function($scope,$http,$log,$modal,$filter) {
    var selt = this;

    //---页面按钮权限控制--start--
/*    this.opCodes = [];
    $http.get("/ts-authorize/ts-imis/operList/app-quit").success(function (result) {
        if (result.success) {
            selt.opCodes = result.object;
        } else {
            alert(result.message);
        }
    });
    this.isShowOpe = function(value){
        for(var i = 0; i < selt.opCodes.length; i++){
            if(value === selt.opCodes[i]){
                return true;
            }
        }
        return false;
    };*/
    //-------------------end---

    this.setPage = function (pageNo) {
        var param = {
            "type":selt.type,
            "name":selt.name,
            "page":pageNo,
            "rows":10
        };
        $http.post("/ts-project/projectManager/selectProjectManagerList",angular.toJson(param)).success(function (result) {
            if(result.success){
                selt.managerList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.managerList = [];
            }

        });
    };

    this.managerCancel=function(){
        selt.name="";
        selt.type="";
    }
    this.submitSeach=function(){
        this.setPage(1);
    }

    this.pageChanged = function() {
        var param = {
            "type":selt.type,
            "name":selt.name,
            "page":this.pageNo,
            "rows":10
        };
        $http.post("/ts-project/projectManager/selectProjectManagerList",angular.toJson(param)).success(function (result) {
            if(result.success){
                selt.managerList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.managerList = [];
            }

        });
    };
    this.maxSize=5;
    this.setPage(1);
    this.showbutton=false;

    this.deleteManager=function(manager){
        $http.post("/ts-project/projectManager/deleteManager/"+manager.pkid).success(function (result) {
            if(result.success){
                alert(result.message);
                selt.setPage(1);
            }else{
                alert(result.message);
            }

        });
    };

    //划出层样式
    this.panelClass = "contact panel panel-default";

    this.openPanel = function () {
        selt.panelClass = "contact panel panel-default active";
    }
    this.closePanel = function () {
        selt.panelClass = "contact panel panel-default";
    }

    this.saveOrUpdateManager = function (manager,type) {
        if(type==1){
            selt.showbutton=false;
            selt.submitted=false;
            selt.projectManager=manager;
        }else{
            selt.projectManager={sex:1};
            selt.showbutton=true;
            selt.submitted=false;
        }

    };

    this.managerSave=function(valid,invalid,projectManager){
        if(valid){
            if (!invalid) {
                $http.post("/ts-project/projectManager/saveProjectManager", angular.toJson(projectManager)).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                        selt.closePanel();
                        selt.setPage(1);
                    } else {
                        alert(result.message);
                    }
                });
            }
        }else{
            selt.submitted=true;
        }
    }

    this.findPerson = function (size) {
        var selectInstance = $modal.open({
            templateUrl: 'selectTree.html',
            controller: 'selectController as selectCtrl',
            size: size
        });

        selectInstance.result.then(function (person) {
            $http.post("/ts-project/projectManager/queryPersonById/"+person.id).success(function (result) {
                if(result.success){
                    if(selt.projectManager!=null&&selt.projectManager!=undefined){
                        if(selt.projectManager.type!=null){
                            var type=selt.projectManager.type;
                            selt.projectManager={name:result.object.name,
                                type:type,
                                workNum:result.object.workNum,
                                preId:result.object.perId,
                                sex:result.object.sex,
                                phone:result.object.phone}
                        }else{
                            selt.projectManager={name:result.object.name,
                                workNum:result.object.workNum,
                                preId:result.object.perId,
                                sex:result.object.sex,
                                phone:result.object.phone}
                        }
                    }

                }else{
                    alert(result.messages);
                }

            });
        });

    }

}]);

app.controller('selectController', ['$scope', '$modalInstance','$http', function($scope,$modalInstance,$http) {
    var finddept=this;
    var person;
    finddept.my_tree = {};
    finddept.success=false;
    $http.post("/ts-project/projectManager/getTreeList").success(function(data){
        finddept.success=data.success;

        finddept.my_data =data.object;
    });
    finddept.my_tree_handler = function(branch) {
        person={level:branch.data.level,type:branch.data.type,id:branch.data.pkid,label:branch.label,parent:branch.data.parent};
    };
    finddept.selectdept=function(){
        $modalInstance.close(person);
    }
    finddept.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])