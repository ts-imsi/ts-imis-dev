app.controller('planDetailCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;

    //制定计划划出层样式
    this.panelClass = "contact panel panel-default";

    this.openPanel = function () {
        selt.panelClass = "contact panel panel-default active";
    };
    this.closePanel = function () {
        selt.panelClass = "contact panel panel-default";
    }
}]);
