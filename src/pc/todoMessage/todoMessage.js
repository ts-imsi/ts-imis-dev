app.controller('todoMegContentCtrl', ['$scope', '$http','utils','$modal','$filter', function($scope, $http,utils,$modal,$filter) {
    var selt = this;
    var pkid =  utils.getUrlVar('pkid');

    var param;
    $http.get("/ts-project/tb_message/getTbMsgById/"+pkid).success(function (result) {
        if(result.success){
            selt.msg = result.object;
            if(selt.msg.tbHtChange!=null){
                selt.msg.tbHtChange.created=$filter("date")(selt.msg.tbHtChange.created, "yyyy-MM-dd")
            }
            //TODO 在流程中获取合同号和交接单号
            param={
                htNo:selt.msg.htNo,
                handOverId:selt.msg.handOverId,
                processId:selt.msg.processId
            }
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

        returnFlowInstance.result.then(function () {
        });



    }

    this.pdConfirm=function(){
        selt.msg.remark="已确认";
        $http.post("/ts-project/tb_message/pdConfirm",angular.toJson(selt.msg)).success(function (result) {
            if(result.success){
                alert(result.message);
            }else{
                alert(result.message);
            }
        });
    }



}]);

