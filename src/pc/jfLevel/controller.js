app.controller('JfLevelCtrl', ['$scope','$http','$log','$modal','$filter', function($scope,$http,$log,$modal,$filter) {
    var selt = this;

    //---页面按钮权限控制--start--
    this.opCodes = [];
    this.depName = "";
    this.isShowOpe = function(value){
        for(var i = 0; i < selt.opCodes.length; i++){
            if(value === selt.opCodes[i]){
                return true;
            }
        }
        return false;
    };
    $http.get("/ts-authorize/ts-imis/operList/app-jfLevel").success(function (result) {
        if (result.success) {
            selt.opCodes = result.object;
            if(!selt.isShowOpe("all")){
                selt.depName = result.message;
            }
            selt.searchPersonnel();
        } else {
            alert(result.message);
        }
    });
    //-------------------end---


    //--时间控件

    //this.dtStart = $filter("date")(new Date(), "yyyy-MM-dd");
    //this.dtEnd = $filter("date")(new Date(), "yyyy-MM-dd");


    this.openStart = function($event) {
        this.myShaix = false;
        $event.preventDefault();
        $event.stopPropagation();

        selt.openedStart = true;
    };

    this.openEnd = function($event) {
        this.myShaix = false;
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

    //--时间控件--end

    $http.post("/promotionApp/getCompanyList").success(function (result) {
        if (result.success) {
            selt.companyList = result.object;
        } else {
            alert(result.message);
        }
    });
    this.getDeptList=function(){
        if(selt.companyPkid==undefined) {
            alert("请选择公司")
            return;
        }else{
            var url="/promotionApp/"+selt.companyPkid+"/getDeptList";
            $http.post(url).success(function (result) {
                if (result.success) {
                    selt.deptList = result.object;
                } else {
                    alert(result.message);
                }
            });
        }

    };


    this.searchPersonnel=function(){
        var param={
            "companyId":selt.companyPkid,
            "deptId":selt.deptPkid,
            "name":selt.perName,
            "depName":selt.depName
        };
        $http.post("/jfLevel/queryJfPersonnel",angular.toJson(param)).success(function (result) {
            if(result.success){
                selt.jfPersonList = result.object;
            }else{
                selt.jfPersonList = [];
            }

        });
    };

    this.selectPerson = function (person) {
        selt.person = person;
        selt.dtStart = selt.dtStart==""?"":$filter("date")(selt.dtStart, "yyyy-MM-dd");
        selt.dtEnd = selt.dtStart==""?"":$filter("date")(selt.dtEnd, "yyyy-MM-dd");

        var param={
            "workNum":person.workNum,
            "startDate":selt.dtStart,
            "endDate":selt.dtEnd,
            "pageNo":1,
            "pageSize":5
        };
        $http.post("/jfLevel/seachJfRecord",angular.toJson(param)).success(function (result) {
            if(result.code==1){
                selt.recordList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.recordList = [];
            }

        });
    };

    this.maxSize = 3;
    this.recordList = [];
    this.totalCount = 0;
    this.pageSize = 0;
    this.pageNo = 1;

    this.pageChanged=function(){
        selt.dtStart = selt.dtStart==""?"":$filter("date")(selt.dtStart, "yyyy-MM-dd");
        selt.dtEnd = selt.dtStart==""?"":$filter("date")(selt.dtEnd, "yyyy-MM-dd");
        var param={
            "workNum":selt.person.workNum,
            "startDate":selt.dtStart,
            "endDate":selt.dtEnd,
            "pageNo":this.pageNo,
            "pageSize":5
        };
        $http.post("/jfLevel/seachJfRecord",angular.toJson(param)).success(function (result) {
            if(result.code==1){
                selt.recordList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.recordList = [];
            }

        });
    };






    this.showLevelSelect = function (size) {
        if(selt.person==undefined){
            return;
        }
        var levelSelect = $modal.open({
            templateUrl: 'src/pc/jfLevel/level-select.html',
            controller: 'LevelSelectCtrl as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return selt.person;
                }
            }
        });

        levelSelect.result.then(function (rankName) {
            selt.person.rankName = rankName;
            selt.selectPerson(selt.person);
        });

    };

    this.jfInputItem = {};
    this.showInfo = function (type,item) {
        if(selt.person==undefined){
            return;
        }

        if(type=="edit"||type=="info"){
            selt.jfInputItem =item;
        }else if(type=="add"){
            selt.jfInputItem = {};
            selt.jfInputItem.workNum = selt.person.workNum;
            selt.jfInputItem.type = 1;
        }else if(type=='deptAdd'){
            selt.jfInputItem = {};
            selt.jfInputItem.workNum = selt.person.workNum;
            selt.jfInputItem.type = 2;
        }else{
            return;
        }
        selt.jfInputItem.showType = type;
        var jfLevelInfo = $modal.open({
            templateUrl: 'src/pc/jfLevel/jflevel-info.html',
            controller: 'JfLevelInfoCtrl as ctrl',
            resolve: {
                data: function () {
                    return selt.jfInputItem;
                }
            }
        });

        jfLevelInfo.result.then(function (score) {
            selt.person.score = score;
            selt.selectPerson(selt.person);
        });

    };

    this.cancelJfRecord = function (item) {
        if(!confirm("你确定冲账吗？")){
            return;
        };

        $http.post("/jfLevel/cancelJfRecord",angular.toJson(item)).success(function (result) {
            if(result.success){
                selt.person.score = result.object;
                selt.selectPerson(selt.person);
            }
        });

    };


    this.showPLAddJF = function(){
        var isHasCheceks = false;
        var workNums = [];
        angular.forEach(selt.jfPersonList, function(item) {
            if(item.check == true){
                workNums.push(item.workNum);
                isHasCheceks = true;
            }
        });

        if(!isHasCheceks){
            alert("您未选择人员!");
            return;
        }
        selt.jfInputItem.workNums = workNums;
        var jfLevelInfo = $modal.open({
            templateUrl: 'src/pc/jfLevel/jflevel-info.html',
            controller: 'JfLevelInfoCtrl as ctrl',
            resolve: {
                data: function () {
                    return selt.jfInputItem;
                }
            }
        });

        jfLevelInfo.result.then(function (score) {
            selt.searchPersonnel();
        });
    };

    this.selectAll = function(){
        angular.forEach(selt.jfPersonList, function(item) {
            item.check = selt.checkAll;
        });
    };






}]);

app.controller('LevelSelectCtrl', ['$scope', '$modalInstance','$http', 'data',function($scope,$modalInstance,$http,data) {
    var seltLevel=this;


    $http.post("/record/getRecordRankList").success(function (result) {
        if (result.success) {
            seltLevel.levelList = result.object;
        } else {
            seltLevel.levelList = [];
        }
    });

    this.selectID = "";
    this.select = function(item){
        seltLevel.selectID = item.pkid;
    };

    this.submitOK = function(){
        seltLevel.UpdateLevel();
    };
    
    this.UpdateLevel = function () {
        if(seltLevel.selectID==""){
            alert("请选择一个级别");
            return;
        }
        data.rank = seltLevel.selectID
        $http.post("/jfLevel/updateLevel",angular.toJson(data)).success(function (result) {
            alert(result.message);
            $modalInstance.close(result.object);
        });

    }
    
    


}]);


app.controller('JfLevelInfoCtrl', ['$scope', '$modalInstance','$http', 'data',function($scope,$modalInstance,$http,data) {
    var seltInfo=this;
    this.jfRecord = data;



    this.addInfo = function(){
        seltInfo.saveJfRecord();
    };

    this.saveJfRecord = function () {
        if(seltInfo.jfRecord.score==""||seltInfo.jfRecord.score==undefined){
            alert("请填写积分!");
            return;
        }
        if(seltInfo.jfRecord.remark==""||seltInfo.jfRecord.remark==undefined){
            alert("请填写原因!");
            return;
        }
        if(!confirm("你确认保存么？")){
            return;
        };

        $http.post("/jfLevel/addJfRecord",angular.toJson(seltInfo.jfRecord)).success(function (result) {
            alert(result.message);
            $modalInstance.close(result.object);
        });

    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };




}]);
