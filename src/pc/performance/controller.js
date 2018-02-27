app.controller('PerformanceCtrl', ['$scope','$http','$log','$modal','$filter', function($scope,$http,$log,$modal,$filter) {
    var selt = this;
    this.performanceList = [];
    this.year = $filter("date")(new Date(), "yyyy");
    this.month = $filter("date")(new Date(), "MM");


    $http.post("/performance/getJF").success(function (result) {
        if (result.success) {
            selt.performanceJF = result.object;
        }
    });

    $http.post("/performance/queryPerformance?date="+this.year+this.month).success(function (result) {
        if (result.success) {
            selt.performanceList = result.object;
        }
    });

    this.seachPerformance = function (date) {
        $http.post("/performance/queryPerformance?date="+date).success(function (result) {
            if (result.success) {
                selt.performanceList = result.object;
            }
        });
    };



    this.updateJF = function () {
        $http.post("/performance/updateJf",angular.toJson(selt.performanceJF)).success(function (result) {
            alert(result.message);
        });
    };



    this.importExcel=function(){
        var ImportExcelInstance = $modal.open({
            templateUrl: 'importExcel.html',
            controller: 'ImportExcelCtrl as fileCtrl',
            resolve: {
                data: function () {
                    return selt.year+selt.month;
                }
            }
        });

        ImportExcelInstance.result.then(function (object) {
            selt.performanceList = object;

        });
    };


    this.autoUpdateJF=function(){
        var UpdateJFInstance = $modal.open({
            templateUrl: 'updateJF.html',
            controller: 'UpdateJFCtrl as fileCtrl',
            resolve: {
                data: function () {
                    return "";
                }
            }
        });

        UpdateJFInstance.result.then(function (date) {
            selt.seachPerformance(date);
        });
    };
}]);

app.controller('ImportExcelCtrl', ['$scope', '$modalInstance','$http', '$filter','data','FileUploader', function($scope,$modalInstance,$http,$filter,data,FileUploader) {
    var selt=this;
    this.fileDate = data;


    var uploader = $scope.uploader = new FileUploader({
        url: '/performance/importExcel?date='+data,
        headers:undefined
    });



    this.fileItem = "";
    uploader.onAfterAddingFile = function(fileItem) {
        console.log(uploader.queue.length);
        console.log(uploader.queue[uploader.queue.length-1].file.name);
        console.log(fileItem.file.name);
        selt.fileItem = fileItem;
    };

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        alert(response.message);
        $modalInstance.close(response.object);
    };


    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);


app.controller('UpdateJFCtrl', ['$scope', '$modalInstance','$http', '$filter', function($scope,$modalInstance,$http,$filter) {
    var selt=this;

    this.year = $filter("date")(new Date(), "yyyy");
    this.month = $filter("date")(new Date(), "MM");

    this.autoAddJf = function () {
        $http.post("/performance/autoAddJf?date="+this.year+this.month).success(function (result) {
            alert(result.message);
            $modalInstance.close(selt.year+selt.month);
        });
    };


    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);