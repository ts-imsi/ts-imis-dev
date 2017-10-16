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
    $http.get("/ts-project/tb_message/getTbMsgById/"+seltmsgDetail.pkid).success(function (result) {
        if(result.success){
            seltmsgDetail.msg = result.object;
        }else{
            seltmsgDetail.msg='';
            alert(result.message);
        }
    });
}])
