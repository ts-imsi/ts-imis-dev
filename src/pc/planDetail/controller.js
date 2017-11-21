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




    $http.post("/ts-project/planDetail/queryPlanItems/"+planId).success(function (result) {
        if(result.success){
            selt.detail=result.object;
        }
    });


    this.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };
    this.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    this.format = this.formats[0];
    this.openTime = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        selt.isOpen = true;
    };

    this.showDate=function(pkid){
        selt.isShow=pkid;

    };

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


}]);
