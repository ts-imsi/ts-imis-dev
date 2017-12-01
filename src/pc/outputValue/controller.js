app.controller('OutputValueCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;

    this.type = 'dept';

    this.selectByType=function(status){
        selt.type=status;
        this.setPage(1);
    };

    this.selectOutput = function () {
        this.setPage(1);
    };

    this.isSelectedAll = function (vo) {
        var voboo = vo.checked;
        vo.checked = !voboo;
        angular.forEach(vo.outputValueList, function(output) {
            var boo = output.checked;
            output.checked = !boo;
        });
    };

    this.isSelected = function (output) {
        var boo = output.checked;
        output.checked = !boo;
    };





    this.openDiv = function (id) {
        angular.forEach(selt.voList, function(item) {
            if(item.id == id){
                item.ifOpen = true;
            }
        });
    };

    this.closeDiv = function (id) {
        angular.forEach(selt.voList, function(item) {
            if(item.id == id){
                item.ifOpen = false;
            }
        });
    };


    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            name:selt.name,
            type:selt.type
        };
        console.log(parm);
        $http.post("/ts-project/outputValue/queryOutputValue",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.voList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.voList=[];
            }

        });
    };

    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        var parm={
            page:this.pageNo,
            rows:10,
            name:selt.name,
            type:selt.type
        };
        $http.post("/ts-project/outputValue/queryOutputValue",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.voList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.voList=[];
            }

        });

    };

    this.maxSize = 5;
    this.setPage(1);


    this.checkOutputValue = function (vo) {
        var outputList = [];
        angular.forEach(vo.outputValueList, function(output) {
            if(output.checked){
                outputList.push(output);
            }
        });
        $http.post("/ts-project/outputValue/checkOutput",angular.toJson(outputList)).success(function (result) {
            if(result.success){
                selt.setPage(1);
            }
            alert(result.message);
        });
    };







}])