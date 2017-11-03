app.controller('projectActualizeArrangeCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;
    selt.showLetter=false;

    selt.isArrange=1;
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
        $http.post("/ts-project/plan/selectProjecActualizetList",angular.toJson(parm)).success(function (result) {
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
        $http.post("/ts-project/plan/selectProjecActualizetList",angular.toJson(parm)).success(function (result) {
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

    //制定计划划出层样式
    this.panelClass = "projectPlan panel panel-default";

    this.openPanel = function () {
        selt.panelClass = "projectPlan panel panel-default active";
    };
    this.closePanel = function () {
        selt.panelClass = "projectPlan panel panel-default";
    };

    this.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };
    this.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    this.format = this.formats[0];
    // this.entryDate = $filter("date")(new Date(), "yyyy-MM-dd");
    this.openTime = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        selt.isOpen = true;
    };

    this.showDate=function(projectPlan,sz){
            selt.isShow=projectPlan.planId;
            if(sz==0){
                selt.name="surveyTime";
            }
            if(sz==1){
                selt.name="approachTime";
            }
            if(sz==2){
                selt.name="onlineTime";
            }
            if(sz==3){
                selt.name="checkTime";
            }

    }

    this.createActualizePlan=function(handOver){
        selt.showButton=true;
        $http.post("/ts-project/plan/queryProjectPlanList/"+handOver.pkid).success(function (result) {
            if(result.success){
                selt.projectPlanList=result.object;
            }else{
                selt.projectPlanList=[];
                alert(result.message);
            }
        });

        $http.post("/ts-project/arrange/getManageByType/"+"2").success(function (result) {
            if(result.success){
                selt.xmjlList=result.object;
            }else{
                selt.xmjlList=[];
                alert(result.message);
            }

        });
    }

    this.sentProjectPlan=function(){

        angular.forEach(selt.projectPlanList,function(item){
            selt.manage=item.actualizeManager;
            item.actualizeManager=selt.manage.name;
            item.workNum=selt.manage.workNum;
        });
        $http.post("/ts-project/plan/saveProjectActualizePlan",angular.toJson(selt.projectPlanList)).success(function (result) {
            if(result.success){
                alert(result.message);
                selt.showButton=false;
                selt.panelClass = "projectPlan panel panel-default";
                this.setPage(1);
            }else{
                alert(result.message);
            }
        });
    }


}]);
