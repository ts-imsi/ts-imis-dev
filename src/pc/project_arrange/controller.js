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
            selt.setPage(1);
        });
    };


    this.updatePlanTime=function(projectPlan){
        var projectPlanInstance = $modal.open({
            templateUrl: 'projectPlan.html',
            controller: 'ProjectPlanCtrl as planCtrl',
            resolve: {
                data: function () {
                    return projectPlan;
                }
            }
        });

        projectPlanInstance.result.then(function () {
            //this.setPage(1);
        });
    }

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
                selt.xmssjlList=result.object;
            }else{
                selt.xmssjlList=[];
                alert(result.message);
            }

        });
    }

    this.showActualizePlan=function(handOver){
        selt.showButton=false;
        $http.post("/ts-project/plan/queryProjectPlanList/"+handOver.pkid).success(function (result) {
            if(result.success){
                selt.projectPlanList=result.object;
            }else{
                selt.projectPlanList=[];
                alert(result.message);
            }
        });
    }

    this.sentProjectPlan=function(){
        var actualiz=false;
        var surveyTime=false;
        var approachTime=false;
        var onlineTime=false;
        var checkTime=false;
        angular.forEach(selt.projectPlanList,function(item){
            if(item.manage==undefined||item.manage==''){
                actualiz=true;
            }
            if(item.surveyTime==undefined||item.surveyTime==''){
                surveyTime=true;
            }
            if(item.approachTime==undefined||item.approachTime==''){
                approachTime=true;
            }
            if(item.onlineTime==undefined||item.onlineTime==''){
                onlineTime=true;
            }
            if(item.checkTime==undefined||item.checkTime==''){
                checkTime=true;
            }
            if(!actualiz){
                item.actualizeManager=item.manage.name;
                item.workNum=item.manage.workNum;
            }
            item.surveyTime = $filter("date")(item.surveyTime, "yyyy-MM-dd");
            item.approachTime = $filter("date")(item.approachTime, "yyyy-MM-dd");
            item.onlineTime = $filter("date")(item.onlineTime, "yyyy-MM-dd");
            item.checkTime = $filter("date")(item.checkTime, "yyyy-MM-dd");
        });
        if(actualiz){
            alert("实施经理不能为空");
            return;
        }
        if(surveyTime){
            alert("调研时间不能为空");
            return;
        }
        if(approachTime){
            alert("计划进场时间不能为空");
            return;
        }
        if(onlineTime){
            alert("计划上线时间不能为空");
            return;
        }
        if(checkTime){
            alert("计划验收时间不能为空");
            return;
        }

        $http.post("/ts-project/plan/saveProjectActualizePlan",angular.toJson(selt.projectPlanList)).success(function (result) {
            if(result.success){
                alert(result.message);
                selt.showButton=false;
                selt.closePanel();
                selt.setPage(1);
            }else{
                alert(result.message);
            }
        });
    }

}]);


app.controller('LetterCtrl', ['$scope', '$modalInstance','$http','$filter', 'data', function($scope,$modalInstance,$http,$filter,data) {
    var seltLetter=this;
    seltLetter.handOver=data;
    seltLetter.manage=data.proManager;

    seltLetter.newDate=new Date();
    seltLetter.sendButton=true;
    this.sendLetter=function(){
        seltLetter.handOver.proManager=seltLetter.manage.name;
        seltLetter.handOver.proPhone=seltLetter.manage.phone;
        seltLetter.handOver.created=$filter("date")(seltLetter.handOver.created, "yyyy-MM-dd");
        seltLetter.handOver.updated=$filter("date")(seltLetter.handOver.updated, "yyyy-MM-dd");
        seltLetter.handOver.recountTime=$filter("date")(seltLetter.handOver.recountTime, "yyyy-MM-dd");
        seltLetter.handOver.confirmTime=$filter("date")(seltLetter.handOver.confirmTime, "yyyy-MM-dd");
        seltLetter.handOver.arrangeTime=$filter("date")(new Date(), "yyyy-MM-dd");

        seltLetter.manage.created=$filter("date")(seltLetter.manage.created, "yyyy-MM-dd");
        var param={
            handOver:seltLetter.handOver,
            projectManage:seltLetter.manage
        }
        $http.post("/ts-project/arrange/sendLetter",angular.toJson(param)).success(function (result) {
            if(result.success){
                seltLetter.sendButton=false;
                alert(result.message);
                $modalInstance.close();
            }else{
                alert(result.message);
            }

        });
    }

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    this.printLetter=function(){
        $("#letterPrint").printThis({
            debug: false,
            importCSS: true,
            importStyle: true,
            printContainer: true,
            removeInline: false,
            printDelay: 333,
            header: null,
            formValues: false
        });
    }
}]);

app.controller('ProjectPlanCtrl', ['$scope', '$modalInstance','$http', '$filter','data', function($scope,$modalInstance,$http,$filter,data) {
    var selt=this;
    console.log(data);
    selt.plan = data;


    this.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };
    this.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    this.format = this.formats[0];
    // this.entryDate = $filter("date")(new Date(), "yyyy-MM-dd");
    this.openSurveyTime = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        selt.surveyTimeOpen = true;
        selt.approachTimeOpen = false;
        selt.onlineTimeOpen = false;
        selt.checkTimeOpen = false;
    };

    this.openApproachTime = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        selt.surveyTimeOpen = false;
        selt.approachTimeOpen = true;
        selt.onlineTimeOpen = false;
        selt.checkTimeOpen = false;
    };

    this.openOnlineTime = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        selt.surveyTimeOpen = false;
        selt.approachTimeOpen = false;
        selt.onlineTimeOpen = true;
        selt.checkTimeOpen = false;;
    };

    this.openCheckTime = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        selt.surveyTimeOpen = false;
        selt.approachTimeOpen = false;
        selt.onlineTimeOpen = false;
        selt.checkTimeOpen = true;
    };








    $http.post("/ts-project/arrange/getManageByType/"+"2").success(function (result) {
        if(result.success){
            selt.xmssjlList=result.object;
            angular.forEach(selt.xmssjlList,function(item){
                if(selt.plan.workNum=item.workNum){
                    selt.manage = item;
                }
            });
        }else{
            selt.xmssjlList=[];
        }

    });

    this.savePlan = function (plan) {

        plan.surveyTime = $filter("date")(plan.surveyTime, "yyyy-MM-dd");
        plan.approachTime = $filter("date")(plan.approachTime, "yyyy-MM-dd");
        plan.onlineTime = $filter("date")(plan.onlineTime, "yyyy-MM-dd");
        plan.checkTime = $filter("date")(plan.checkTime, "yyyy-MM-dd");

        $http.post("/ts-project/plan/updatePlanTime",angular.toJson(plan)).success(function (result) {
            if(result.success){
                $modalInstance.close(result.object);
            }
        });
    };


    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])