app.controller('messageCtrl', ['$scope', '$modal', '$http', '$log', function ($scope, $modal, $http, $log) {
    var selt = this;
    this.folds = [
        {name: '全部', type:'all',status:'all'},
        {name: '待办', type:'todo',status:'0'},
        {name: '已办', type:'todo',status:'1'},
        {name: '待阅', type:'read',status:'0'},
        {name: '已阅',  type:'read',status:'1'}
    ];
}])

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
        $http.post("/ts-project/tb_message/submitFlow",angular.toJson(seltmsgDetail.msg)).success(function (result) {
            if(result.success){
                alert(result.message);
            }else{
                alert(result.message);
            }
        });
    };
    this.returnFlow=function(){
        $http.post("/ts-project/tb_message/returnFlow",angular.toJson(seltmsgDetail.msg)).success(function (result) {
            if(result.success){
                alert(result.message);
            }else{
                alert(result.message);
            }
        });
    }

    this.pdConfirm=function(){
        $http.post("/ts-project/tb_message/pdConfirm",angular.toJson(seltmsgDetail.msg)).success(function (result) {
            if(result.success){
                alert(result.message);
            }else{
                alert(result.message);
            }
        });
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

}])
