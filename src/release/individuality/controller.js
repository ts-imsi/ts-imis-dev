app.controller('ReIndividualityCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;

    selt.my_tree = {};
    selt.success=false;
    $http.post("/ts-release/jiarHos/selectHospitalTreeList").success(function(data){
        selt.success=data.success;
        selt.my_data =data.object;
    });
    var hospitalName;
    this.my_tree_handler = function(branch) {
        hospitalName=branch.data.customValue;
        this.setPage(1);
    };

    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            hospitalName:hospitalName
        };
        $http.post("/ts-release/individuality/getIndividualityList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.individualityList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.individualityList=[];
            }

        });
    };


    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        var parm={
            page:this.pageNo,
            rows:10,
            hospitalName:hospitalName
        };
        $http.post("/ts-release/individuality/getIndividualityList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.individualityList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.individualityList=[];
            }
        });

    };

    this.maxSize = 5;



}]);




