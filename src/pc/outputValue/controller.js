app.controller('OutputValueCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;

    this.type = 'dept';


    this.selectByStatus = function (status) {
        selt.status = status;
        selt.type='dept';
        this.setPage(1);

    }

    this.selectByType=function(type){
        selt.type=type;
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
            type:selt.type,
            status:selt.status
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
            type:selt.type,
            status:selt.status
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
    selt.status = 0;
    selt.type='dept';
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




    this.htRadio = 1;
    this.line = {
        proLine:undefined
    };

    this.proLineT = {
        proLine:undefined
    };

    this.selectByHt = function (num) {
        selt.htRadio = num;
    };

    $http.post("/ts-project/outputValue/queryProLine").success(function (result) {
        if(result.success){
            selt.proLineList = result.object;
        }
    });

    this.saveNoHtOutput = function (line) {
        if(line.proLine == undefined){
            alert("请选择产品线!");
            return;
        }
        if(line.total == undefined){
            alert("请填写金额!");
            return;
        }
        $http.post("/ts-project/outputValue/saveNoHtOutput",angular.toJson(line)).success(function (result) {
            alert(result.message);
            if(result.success){
                 selt.line = {
                    proLine:undefined
                }
            }
        });

    };

    this.saveProductOutput = function (line) {
        if(line.proLine == undefined){
            alert("请选择产品线!");
            return;
        }
        if(line.total == undefined){
            alert("请填写金额!");
            return;
        }
        $http.post("/ts-project/outputValue/saveProductOutput",angular.toJson(line)).success(function (result) {
            alert(result.message);
            if(result.success){
                selt.line = {
                    proLine:undefined
                }
            }
        });

    };

    this.htOutput = {
        htNo : undefined
    };

    this.findHt = function () {
        var param={htNo:selt.htOutput.htNo};
        $http.post("/ts-project/outputValue/queryHtProduct",angular.toJson(param)).success(function (result) {
            if(result.success){
                selt.htOutputList = result.object;
                selt.htOutput = selt.htOutputList[0];
            }else{
                alert("该合同未分解合同额或无效合同!");
            }
        });

    };

    this.saveHtOutput = function (remark) {
        angular.forEach(selt.htOutputList, function(output) {
            output.remark = remark;
        });
        $http.post("/ts-project/outputValue/saveHtOutput",angular.toJson(selt.htOutputList)).success(function (result) {
            alert(result.message);
        });

    }









}])