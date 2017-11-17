app.controller('createPlanTempCtrl', ['$scope', '$http','utils','$modal', function($scope, $http,utils,$modal) {
    var selt = this;
    var pkid =  utils.getUrlVar('pkid');

    $http.post("/ts-project/product/queryTbProductList").success(function (result) {
        if(result.success){
            selt.productList = result.object;
        }else{
            selt.productList = [];
        }

    });

    $http.post("/ts-project/planTemplate/selectTwfStageTag").success(function (result) {
        if(result.success){
            selt.twfStageList = result.twfStageList;
            selt.twfCheckTagList = result.twfCheckTagList;
        }else{
            selt.twfStageList = [];
            selt.twfCheckTagList=[];
        }

    });

    selt.stageModuleList=[];
    selt.docModuleList=[];
    selt.tagModuleList=[];
    selt.stageSaveList=[];
    selt.tagSaveList=[];
    var stageDocPkid;
    var stagePkid;

    //阶段选择
    this.updateStageSelection = function ($event, item) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');

        if (action == 'add' && selt.stageModuleList.indexOf(item.pkid) == -1) {
            selt.stageModuleList.push(item.pkid);
            stagePkid=item.pkid;
        }
        if (action == 'remove' && selt.stageModuleList.indexOf(item.pkid) != -1) {
            var idx = selt.stageModuleList.indexOf(item.pkid);
            selt.stageModuleList.splice(idx, 1);
            stagePkid='';
        }

        $http.post("/ts-project/planTemplate/getTwfStageDocList/"+item.pkid).success(function (result) {
            if(result.success){
                selt.stageDocList = result.object;
            }else{
                selt.stageDocList = [];
            }

        });

        selt.docModuleList=[];
        selt.tagModuleList=[];
    }

    this.isStageSelected = function (item) {
        return selt.stageModuleList.indexOf(item.pkid) != -1;
    }


    //文档选择
    this.isDocSelected = function (item) {
        return selt.docModuleList.indexOf(item.pkid) != -1;
    }

    this.updateDocSelection = function ($event, item) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');

        if (action == 'add' && selt.docModuleList.indexOf(item.pkid) == -1) {
            selt.docModuleList.push(item.pkid);
            stageDocPkid=item.pkid;
            if(stagePkid!=''&&stagePkid!=undefined){
                var name=stagePkid+":"+item.pkid;
                if(selt.stageSaveList.indexOf(name) == -1){
                    selt.stageSaveList.push(name);
                }
            }
        }
        if (action == 'remove' && selt.docModuleList.indexOf(item.pkid) != -1) {
            var idx = selt.docModuleList.indexOf(item.pkid);
            selt.docModuleList.splice(idx, 1);
            stageDocPkid='';
            if(stagePkid!=''&&stagePkid!=undefined){
                var name=stagePkid+":"+item.pkid;
                if(selt.stageSaveList.indexOf(name) != -1){
                    var idxx = selt.stageSaveList.indexOf(item.pkid);
                    selt.stageSaveList.splice(idxx, 1);
                }
            }
        }


        selt.tagModuleList=[];
    }

    //人员选择
    this.isTagSelected = function (item) {
        return selt.tagModuleList.indexOf(item.pkid) != -1;
    }

    this.updateTagSelection = function ($event, item) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');

        if (action == 'add' && selt.tagModuleList.indexOf(item.pkid) == -1) {
            selt.tagModuleList.push(item.pkid);
            if(stageDocPkid!=''&&stageDocPkid!=undefined){
                var name=stageDocPkid+":"+item.pkid;
                if(selt.tagSaveList.indexOf(name) == -1){
                    selt.tagSaveList.push(name);
                }
            }
        }
        if (action == 'remove' && selt.tagModuleList.indexOf(item.pkid) != -1) {
            var idx = selt.tagModuleList.indexOf(item.pkid);
            selt.tagModuleList.splice(idx, 1);
            if(stageDocPkid!=''&&stageDocPkid!=undefined){
                var name=stageDocPkid+":"+item.pkid;
                if(selt.tagSaveList.indexOf(name) != -1){
                    var idl = selt.tagSaveList.indexOf(item.pkid);
                    selt.tagSaveList.splice(idl, 1);
                }
            }
        }


    }
    this.savePlanTemp=function(){
        tbPlanTemp={
            pkid:pkid,
            type:selt.type,
            proCode:selt.twfpro.proCode,
            proName:selt.twfpro.proName,
            tempName:selt.twfpro.proName+"实施计划模板"
        }
        var param={
            tagSaveList:selt.tagSaveList,
            stageSaveList:selt.stageSaveList,
            tbPlanTemplate:tbPlanTemp
        }
        $http.post("/ts-project/planTemplate/savePlanTemp",angular.toJson(param)).success(function (result) {
            if(result.success){
                alert(result.message);
            }else{
                alert(result.message);
            }

        });
    }

    this.stageTemp=function(size){
        var stageTempInstance = $modal.open({
            templateUrl: 'stageTemp.html',
            controller: 'stageTempCtrl as ctrl',
            size: size
        });
        stageTempInstance.result.then(function () {
            $http.post("/ts-project/planTemplate/selectTwfStageTag").success(function (result) {
                if(result.success){
                    selt.twfStageList = result.twfStageList;
                }else{
                    selt.twfStageList = [];
                }

            });
        });
    }

    this.stageDocTemp=function(size){
        var stageTempInstance = $modal.open({
            templateUrl: 'stageDocTemp.html',
            controller: 'stageDocTempCtrl as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return selt.twfStageList;
                }
            }
        });
        stageTempInstance.result.then(function () {
            $http.post("/ts-project/planTemplate/selectTwfStageTag").success(function (result) {
                if(result.success){
                    selt.twfStageList = result.twfStageList;
                }else{
                    selt.twfStageList = [];
                }

            });
        });
    }

    this.deleteStageTemp=function(pkid){
        $http.post("/ts-project/planTemplate/deleteStageTemp/"+pkid).success(function (result) {
            if(result.success){
                alert(result.message);
                $http.post("/ts-project/planTemplate/selectTwfStageTag").success(function (result) {
                    if(result.success){
                        selt.twfStageList = result.twfStageList;
                    }else{
                        selt.twfStageList = [];
                    }
                });
            }else{
                alert(result.message);
            }

        });
    }
    this.deleteDocByPkid=function(pkid){
        $http.post("/ts-project/planTemplate/deleteDocByPkid/"+pkid).success(function (result) {
            if(result.success){
                alert(result.message);
            }else{
                alert(result.message);
            }

        });
    }


}]);

app.controller('stageTempCtrl', ['$scope', '$modalInstance','$http', function($scope,$modalInstance,$http) {
    var seltTemp = this;
    seltTemp.submitted=false;
    this.saveStageTemp=function(valid,invalid,twfStage){
        if(valid) {
            if (!invalid) {
                $http.post("/ts-project/planTemplate/saveStageTemp", angular.toJson(twfStage)).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                        $modalInstance.close();
                    } else {
                        alert(result.message);
                    }
                });
            }
        }else{
            seltTemp.submitted=true;
        }
    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);

app.controller('stageDocTempCtrl', ['$scope', '$modalInstance','$http','data', function($scope,$modalInstance,$http,data) {
    var seltDoc = this;
    seltDoc.submitted=false;
    seltDoc.twfStageList=data;
    seltDoc.isOutputShow=false;
    this.OutputShow=function(value){
        if(value==1){
            seltDoc.isOutputShow=true;
        }else{
            seltDoc.isOutputShow=false;
        }
    }

    this.saveStageDocTemp=function(valid,invalid,twfStageDoc){
        if(valid) {
            if (!invalid) {
                if(twfStageDoc.isOutput==0){
                    twfStageDoc.output='';
                }
                $http.post("/ts-project/planTemplate/saveTwfStageDoc", angular.toJson(twfStageDoc)).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                        $modalInstance.close();
                    } else {
                        alert(result.message);
                    }
                });
            }
        }else{
            seltDoc.submitted=true;
        }
    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);