app.controller('messageCtrl', ['$scope', '$modal', '$http', '$log', function ($scope, $modal, $http, $log) {
    var selt = this;
    $http.get("/ts-project/tb_message/getAllMsgCount").success(function (result) {
        if (result.success) {
            selt.folds = result.object;
        }
    });
}]);

app.controller('messageListCtrl',['$scope', '$modal', '$http', '$log','$stateParams', function ($scope, $modal, $http, $log,$stateParams){
    var seltmsgList=this;
    if($stateParams.type=='all'&&$stateParams.status=='all'){
        seltmsgList.type='';
        seltmsgList.status='';
    }else{
        seltmsgList.type = $stateParams.type;
        seltmsgList.status=$stateParams.status;
    }

    this.setPage = function (pageNo) {
        console.log("1");
        var param={
            page:pageNo,
            rows:10,
            type:seltmsgList.type,
            status:seltmsgList.status
        }
        $http.post("/ts-project/tb_message/selectTbMsg",angular.toJson(param)).success(function (result) {
            if(result.success){
                seltmsgList.megList = result.list;
                seltmsgList.totalCount = result.totalCount;
                seltmsgList.pageSize = result.pageSize;
                seltmsgList.pageNo = result.pageNo;
            }else{
                seltmsgList.megList=[];
                alert(result.message);
            }
        });
    };

    this.pageChanged = function () {
        var param={
            page:this.pageNo,
            rows:10,
            type:seltmsgList.type,
            status:seltmsgList.status
        }
        $http.post("/ts-project/tb_message/selectTbMsg",angular.toJson(param)).success(function (result) {
            if(result.success){
                seltmsgList.megList = result.list;
                seltmsgList.totalCount = result.totalCount;
                seltmsgList.pageSize = result.pageSize;
                seltmsgList.pageNo = result.pageNo;
            }else{
                seltmsgList.megList=[];
                alert(result.message);
            }
        });
    }

    this.maxSize = 5;
    this.setPage(1);


    this.labelClass = function(type,status) {
        return {
            'b-l-info': angular.lowercase(type) === 'read'&&status==0,
            'b-l-primary': angular.lowercase(type) === 'todo'&&status==0,
            'b-l-warning': angular.lowercase(type) === 'read'&&status==1,
            'b-l-success': angular.lowercase(type) === 'todo'&&status==1
        };
    };

}])

app.controller('messageDetailCtrl',['$scope', '$modal', '$http', '$log','$stateParams', function ($scope, $modal, $http, $log,$stateParams){
    var seltmsgDetail=this;
    seltmsgDetail.pkid = $stateParams.pkid;
    var param;
    $http.get("/ts-project/tb_message/getTbMsgById/"+seltmsgDetail.pkid).success(function (result) {
        if(result.success){
            seltmsgDetail.msg = result.object;
            //TODO 在流程中获取合同号和交接单号
            param={
                htNo:seltmsgDetail.msg.htNo,
                handOverId:seltmsgDetail.msg.handOverId,
                processId:seltmsgDetail.msg.processId
            }
        }else{
            seltmsgDetail.msg='';
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
        seltmsgDetail.msg.remark="审批通过";
        $http.post("/ts-project/tb_message/submitFlow",angular.toJson(seltmsgDetail.msg)).success(function (result) {
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
                    return seltmsgDetail.msg;
                }
            }
        });

        returnFlowInstance.result.then(function () {
        });



    }

    this.pdConfirm=function(){
        seltmsgDetail.msg.remark="已确认";
        $http.post("/ts-project/tb_message/pdConfirm",angular.toJson(seltmsgDetail.msg)).success(function (result) {
            if(result.success){
                alert(result.message);
            }else{
                alert(result.message);
            }
        });
    }

    this.openTodo=function(){
        window.location.href="#/app/todoMegContent?pkid="+seltmsgDetail.pkid;
    }


}])




app.controller('analyzeCtrl', ['$scope', '$modalInstance','$http', 'data', function($scope,$modalInstance,$http,data) {
    var seltAnaly=this;


    $http.get("/ts-project/ht_analyze/selectAnalyzeList/"+data.htNo).success(function (result) {
        if(result.success){
            seltAnaly.analyzeList = result.object;
        }else{
            seltAnaly.analyzeList='';
            alert(result.message);
        }
    });

    this.saveAnalyze=function(){
        console.log("=========");
        angular.forEach(seltAnaly.analyzeList,function(item){
            item.handoverId=data.handOverId;
            item.processId=data.processId;
        })
        $http.post("/ts-project/ht_analyze/saveAnaly",angular.toJson(seltAnaly.analyzeList)).success(function (result) {
            if(result.success){
                alert(result.message);
            }else{
                alert(result.message);
            }

        });
    }

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);
app.controller('ReturnFlowCtrl', ['$scope', '$modalInstance','$http', '$filter','data', function($scope,$modalInstance,$http,$filter,data) {
    var selt=this;
    selt.msg = data;

    this.saveMsg = function (msg) {
        $http.post("/ts-project/tb_message/returnFlow",angular.toJson(msg)).success(function (result) {
            if(result.success){
                alert(result.message);
            }else{
                alert(result.message);
            }
        });
        $modalInstance.dismiss('cancel');
    };


    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])
