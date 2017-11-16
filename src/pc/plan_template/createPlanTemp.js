app.controller('createPlanTempCtrl', ['$scope', '$http','utils', function($scope, $http,utils) {
    var selt = this;
    var id =  utils.getUrlVar('id');

    $http.post("/ts-project/product/queryTbProductList").success(function (result) {
        if(result.code==1){
            selt.productList = result.object;
        }else{
            selt.productList = [];
        }

    });

    $http.post("/ts-project/planTemplate/selectTwfStageList").success(function (result) {
        if(result.code==1){
            selt.twfStageList = result.object;
        }else{
            selt.twfStageList = [];
        }

    });


    selt.stageModuleList=[];
    selt.docModuleList=[];
    selt.tagModuleList=[];

    //阶段选择
    this.updateStageSelection = function ($event, item) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');

        if (action == 'add' && selt.stageModuleList.indexOf(item.pkid) == -1) {
            selt.stageModuleList.push(item.pkid);
        }
        if (action == 'remove' && selt.stageModuleList.indexOf(item.pkid) != -1) {
            var idx = selt.stageModuleList.indexOf(item.pkid);
            selt.stageModuleList.splice(idx, 1);
        }
        $http.post("/ts-project/product/getTwfStageDocList",angular.toJson(selt.stageModuleList)).success(function (result) {
            if(result.success){
                selt.stageDocList = result.object;
            }else{
                selt.stageDocList=[];
                alert(result.message);
            }
        });
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
        }
        if (action == 'remove' && selt.docModuleList.indexOf(item.pkid) != -1) {
            var idx = selt.docModuleList.indexOf(item.pkid);
            selt.docModuleList.splice(idx, 1);
        }
    }

    //人员选择
    this.isTagSelected = function (item) {
        return selt.docModuleList.indexOf(item.pkid) != -1;
    }

    this.updateTagSelection = function ($event, item) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');

        if (action == 'add' && selt.docModuleList.indexOf(item.pkid) == -1) {
            selt.docModuleList.push(item.pkid);
        }
        if (action == 'remove' && selt.docModuleList.indexOf(item.pkid) != -1) {
            var idx = selt.docModuleList.indexOf(item.pkid);
            selt.docModuleList.splice(idx, 1);
        }
    }

}]);