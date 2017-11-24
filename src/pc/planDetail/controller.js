app.controller('planDetailCtrl', ['$scope', '$modal', '$http', '$filter','$log','utils', function ($scope, $modal, $http,$filter, $log,utils) {
    var selt = this;

    var planId =  utils.getUrlVar('planId');

    //制定计划划出层样式
    this.panelClass = "contact panel panel-default";

    this.openPanel = function () {
        selt.panelClass = "contact panel panel-default active";
    };
    this.closePanel = function () {
        selt.panelClass = "contact panel panel-default";
    };


    this.queryPlanItems = function () {
        $http.post("/ts-project/planDetail/queryPlanItems/"+planId).success(function (result) {
            if(result.success){
                selt.detail=result.object;
            }
        });
    };
    this.queryPlanItems();







    this.updatePlanDetail = function () {
        $http.post("/ts-project/planDetail/savePlanDetail",angular.toJson(selt.detail)).success(function (result) {
            if(result.success){
                alert(result.message);
            }
        });
    };

    this.openDiv = function (stageName) {
        angular.forEach(selt.detail.tbPlanStages, function(item) {
            if(item.stageName == stageName){
                item.ifOpen = true;
            }
        });
    };

    this.closeDiv = function (stageName) {
        angular.forEach(selt.detail.tbPlanStages, function(item) {
            if(item.stageName == stageName){
                item.ifOpen = false;
            }
        });
    };

    this.updateTimeBoo = false;

    this.updatePlanItem = function (detail) {
        var planItemList = [];
        var boo = true;
        angular.forEach(detail.tbPlanStages, function(item) {
            angular.forEach(item.tbPlanItems, function(i) {
                planItemList.push(i);
            });

        });
        angular.forEach(planItemList, function(item) {
            var planTime = $('#id'+item.pkid).val();
            if(planTime == undefined||planTime==''){
                alert(item.docName+"未填写计划时间");
                boo = false;
                return;
            }
            item.planTime = planTime;
        });
        if(boo){
            $http.post("/ts-project/planDetail/savePlanItemTime",angular.toJson(planItemList)).success(function (result) {
                alert(result.message);
                if(result.success){
                    selt.queryPlanItems();
                    selt.updateTimeBoo = false;
                }
            });
        }
    };

    this.updatePlanTime=function(planItem){
        var PlanItemInstance = $modal.open({
            templateUrl: 'planTime.html',
            controller: 'PlanItemCtrl as itemCtrl',
            resolve: {
                data: function () {
                    return planItem;
                }
            }
        });

        PlanItemInstance.result.then(function () {
            selt.queryPlanItems();
        });
    };

    this.fileUploader=function(planItem){
        var FileUploaderInstance = $modal.open({
            templateUrl: 'fileUploader.html',
            controller: 'FileUploaderCtrl as fileCtrl',
            resolve: {
                data: function () {
                    return planItem;
                }
            }
        });

        FileUploaderInstance.result.then(function () {
            selt.queryPlanItems();
        });
    };

    this.queryPlanUpdateLog = function () {
        $http.post("/ts-project/planDetail/doc/updateLog/"+selt.detail.planId).success(function (result) {
            if(result.success){
                selt.historyList=result.object;
            }else{
                selt.historyList=[];
            }
        });
    };


}]);

app.controller('PlanItemCtrl', ['$scope', '$modalInstance','$http', '$filter','data', function($scope,$modalInstance,$http,$filter,data) {
    var selt=this;
    selt.item = data;

    this.savePlanTime = function (planItem) {
        var planTime = $('#planTime').val();
        planItem.planTime = planTime;
        $http.post("/ts-project/planDetail/updatePlanTime",angular.toJson(planItem)).success(function (result) {
            if(result.success){
                alert("计划时间修改成功!");
                $modalInstance.close(result.object);
            }
        });
    };


    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

app.controller('FileUploaderCtrl', ['$scope', '$modalInstance','$http', '$filter','data','FileUploader', function($scope,$modalInstance,$http,$filter,data,FileUploader) {
    var selt=this;
    selt.item = data;

    var uploader = $scope.uploader = new FileUploader({
        url: '/ts-project/fileUpload/file?id='+selt.item.pkid+'&name='+selt.item.docName,
        headers:undefined
    });

    /*// 过滤器 只能上传注册格式的文件
    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /!*{File|FileLikeObject}*!/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|doc|xls|docx|xlsx|'.indexOf(type) !== -1;
        }
    });*/

    this.fileItem = "";
    uploader.onAfterAddingFile = function(fileItem) {
        console.log(uploader.queue.length);
        console.log(uploader.queue[uploader.queue.length-1].file.name);
        console.log(fileItem.file.name);
        selt.fileItem = fileItem;
    };

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        alert(response.message);
        $modalInstance.close();
    };


    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);