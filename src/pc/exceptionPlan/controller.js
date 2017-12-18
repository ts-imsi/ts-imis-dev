app.controller('ExceptionPlanCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;
    selt.selected=[];
    selt.selectedW=[];
    //--时间控件


    this.myShaix = false;

    this.toggShaix= function() {
        selt.myShaix = !selt.myShaix;
    };


    $(document).on("click",function(e){//js
        var $target = $(e.target);
        if(!($target.parents().andSelf().is("#myShaix"))){
            $scope.$apply(function(){
                selt.myShaix=false;
            });
        }
    });

    this.openStart = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        selt.openedStart = true;
    };

    this.openEnd = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        selt.openedEnd = true;
    };

    this.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };

    this.format = 'yyyy-MM-dd';
    selt.status=1;
    this.selectByStatus=function(status){
        selt.status=status;
        selt.setPage(1);
    }
    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            status:selt.status,
            dtStart:$filter("date")(selt.dtStart, "yyyy-MM-dd"),
            dtEnd:$filter("date")(selt.dtEnd, "yyyy-MM-dd"),
            checkTag:selt.selected,
            noCheckTag:selt.selectedW,
            htNo:selt.htNo,
            customerName:selt.customerName,
            proName:selt.proName
        };
        console.log(parm);
        $http.post("/ts-project/exceptionPlan/selectExceptionPlan",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.excePlanList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.excePlanList=[];
            }

        });
    };


    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        var parm={
            page:this.pageNo,
            rows:10,
            status:selt.status,
            dtStart:$filter("date")(selt.dtStart, "yyyy-MM-dd"),
            dtEnd:$filter("date")(selt.dtEnd, "yyyy-MM-dd"),
            checkTag:selt.selected,
            noCheckTag:selt.selectedW,
            htNo:selt.htNo,
            customerName:selt.customerName,
            proName:selt.proName
        };
        $http.post("/ts-project/exceptionPlan/selectExceptionPlan",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.excePlanList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.excePlanList=[];
            }
        });

    };

    this.maxSize = 5;
    this.setPage(1);


    $http.post("/ts-project/planTemplate/querytwfCheckTagList").success(function (result) {
        if(result.success){
            selt.twfCheckTagList = result.object;
        }else{
            selt.twfCheckTagList=[];
        }

    });

    this.isSelected=function(Tag){
        return selt.selected.indexOf(Tag.tagId) != -1;
    }

    this.updateSelection=function($event, Tag){
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');

        if (action == 'add' && selt.selected.indexOf(Tag.tagId) == -1) {
            selt.selected.push(Tag.tagId);
        }
        if (action == 'remove' && selt.selected.indexOf(Tag.tagId) != -1) {
            var idx = selt.selected.indexOf(Tag.tagId);
            selt.selected.splice(idx, 1);
        }
    }
    this.isWSelected=function(Tag){
        return selt.selectedW.indexOf(Tag.tagId) != -1;
    }

    this.updateWSelection=function($event, Tag){
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');

        if (action == 'add' && selt.selectedW.indexOf(Tag.tagId) == -1) {
            selt.selectedW.push(Tag.tagId);
        }
        if (action == 'remove' && selt.selectedW.indexOf(Tag.tagId) != -1) {
            var idx = selt.selectedW.indexOf(Tag.tagId);
            selt.selectedW.splice(idx, 1);
        }
    }
    this.cancel=function(){
        selt.dtStart='';
        selt.dtEnd='';
        selt.proName='';
        selt.customerName='';
        selt.htNo='';
        selt.selected=[];
        selt.selectedW=[];
    }
    this.submitSeach=function(){
        selt.setPage(1);
    }
    this.show=function(Tag){
        return selt.selectedW.indexOf(Tag.tagId) != -1;
    }
    this.showW=function(Tag){
        return selt.selected.indexOf(Tag.tagId) != -1;
    }
}]);

