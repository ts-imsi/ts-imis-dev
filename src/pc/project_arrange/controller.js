app.controller('projectArrangeCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;
    selt.showLetter=false;

    selt.isArrange=0;
    this.selectByStatus=function(status){
        selt.isArrange=status;
        this.setPage(1);
    }
    this.selectArrange=function(){
        this.setPage(1);
    }

    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            selectName:selt.selectName,
            isArrange:selt.isArrange
        };
        console.log(parm);
        $http.post("/ts-project/arrange/selectProjectArrangeList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.handOverList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.handOverList=[];
            }

        });
    };


    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        var parm={
            page:this.pageNo,
            rows:10,
            selectName:selt.selectName,
            isArrange:selt.status
        };
        $http.post("/ts-project/arrange/selectProjectArrangeList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.handOverList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.handOverList=[];
            }
        });

    };

    this.maxSize = 5;
    this.setPage(1);

    $http.post("/ts-project/arrange/getManageByType/"+"1").success(function (result) {
        if(result.success){
            selt.xmjlList=result.object;
        }else{
            selt.xmjlList=[];
            alert(result.message);
        }

    });

    this.changeLetter=function(handOver){
        selt.pkid=handOver.pkid;
    }

    this.ctreadLetter=function(handOver){
        var letterInstance = $modal.open({
            templateUrl: 'Letter.html',
            controller: 'LetterCtrl as letterCtrl',
            size: 'lg',
            resolve: {
                data: function () {
                    return handOver;
                }
            }
        });

        letterInstance.result.then(function () {
        });
    }
}]);


app.controller('LetterCtrl', ['$scope', '$modalInstance','$http', 'data', function($scope,$modalInstance,$http,data) {
    var seltLetter=this;
    seltLetter.handOver=data;
    seltLetter.newDate=new Date();

    this.close=function () {
        $modalInstance.close();
    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    this.printLetter=function(){
        $("#letterPrint").printThis({
            debug: false,
            importCSS: false,
            importStyle: false,
            printContainer: true,
            removeInline: false,
            printDelay: 333,
            header: null,
            formValues: false
        });
    }
}])