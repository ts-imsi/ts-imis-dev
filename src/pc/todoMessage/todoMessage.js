app.controller('todoMegContentCtrl', ['$scope', '$http','utils','$modal','$filter', function($scope, $http,utils,$modal,$filter) {
    var selt = this;
    var pkid =  utils.getUrlVar('pkid');

    var param;
    $http.get("/ts-project/tb_message/getTodoMsg/"+pkid).success(function (result) {
        if(result.success){
            selt.msg = result.object;
            if(selt.msg.tbHtChange!=null){
                selt.msg.tbHtChange.created=$filter("date")(selt.msg.tbHtChange.created, "yyyy-MM-dd")
            }
            if(selt.msg.handover!=null){
                param={
                    changeNo:selt.msg.handover.changeNo,
                    handOverId:selt.msg.handover.pkid,
                    processId:selt.msg.handover.processId,
                    msg:selt.msg
                };
                angular.forEach(selt.msg.handoverData.tempDataVoList,function(item){
                    if(item.name=="合同信息"){
                        angular.forEach(item.voList,function(it){
                            if(it.name=="是否签订合同"){
                                if(it.value=="1"){
                                    it.value="是";
                                }else{
                                    it.value="否";
                                }
                            }
                        })
                    }
                })
            };

        }else{
            selt.msg='';
            alert(result.message);
        }
    });


    //操作信息
    this.analyze = function (size) {
        var analyzeInstance = $modal.open({
            templateUrl: 'analyze.html',
            controller: 'analyzeCtrl as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return param;
                }
            }
        });
        analyzeInstance.result.then(function () {
        });

    };

    this.submitFlow=function(){
        selt.msg.remark="审批通过";
        $http.post("/ts-project/tb_message/submitFlow",angular.toJson(selt.msg)).success(function (result) {
            if(result.success){
                alert(result.message);
                window.location.href="#/app/todoMessage";
            }else{
                alert(result.message);
            }
        });
    };
    this.returnFlow=function(){
        var returnFlowInstance = $modal.open({
            templateUrl: 'returnFlow.html',
            controller: 'ReturnFlowCtrl as returnCtrl',
            resolve: {
                data: function () {
                    return selt.msg;
                }
            }
        });

        returnFlowInstance.result.then(function (returnFlow) {
            if(returnFlow){
                window.location.href="#/app/todoMessage";
            }
        });
    }

    this.pdConfirm=function(){
        selt.msg.remark="已确认";
        $http.post("/ts-project/tb_message/pdConfirm",angular.toJson(selt.msg)).success(function (result) {
            if(result.success){
                alert(result.message);
                window.location.href="#/app/todoMessage";
            }else{
                alert(result.message);
            }
        });
    }



}]);

app.controller('analyzeCtrl', ['$scope', '$modalInstance','$http', 'data', function($scope,$modalInstance,$http,data) {
    var seltAnaly=this;


    $http.get("/ts-project/ht_analyze/selectAnalyzeList/"+data.changeNo).success(function (result) {
        if(result.success){
            seltAnaly.object = result.object;
            seltAnaly.analyzeList = result.object.list;
            seltAnaly.selectJson = result.object.selectJson;

        }else{
            seltAnaly.analyzeList='';
            alert(result.message);
        }
    });

    this.saveAnalyze=function(){
        console.log("=========");
        var selectJson = [];
        angular.forEach(seltAnaly.selectJson,function(item){
            item.handoverId=data.handOverId;
            item.processId=data.processId;
            item.htNo = data.changeNo;
            selectJson.push(item);
        });


        $http.post("/ts-project/ht_analyze/saveAnaly",angular.toJson(selectJson)).success(function (result) {
            if(result.success){
                seltAnaly.submitFlow();
            }else{
                alert(result.message);
            }

        });
    }

    this.submitFlow=function(){
        data.msg.remark="审批通过";
        $http.post("/ts-project/tb_message/submitFlow",angular.toJson(data.msg)).success(function (result) {
            if(result.success){
                alert(result.message);
                $modalInstance.dismiss('cancel');
                window.location.href="#/app/todoMessage";
            }else{
                alert(result.message);
            }
        });
    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);
app.controller('ReturnFlowCtrl', ['$scope', '$modalInstance','$http', '$filter','data', function($scope,$modalInstance,$http,$filter,data) {
    var selt=this;
    selt.msg = data;
    selt.returnFlow=false;

    this.saveMsg = function (msg) {
        $http.post("/ts-project/tb_message/returnFlow",angular.toJson(msg)).success(function (result) {
            if(result.success){
                alert(result.message);
                selt.returnFlow=true;
                $modalInstance.close(selt.returnFlow);
            }else{
                alert(result.message);
                selt.returnFlow=false;
                $modalInstance.close(selt.returnFlow);
            }
        });
    };


    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])