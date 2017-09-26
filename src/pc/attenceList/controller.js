app.controller('AttenceList', ['$scope','$http','$log','$modal','$filter', function($scope,$http,$log,$modal,$filter) {
    var selt = this;



    //--时间控件

    this.dtStart = $filter("date")(new Date(), "yyyy-MM-dd");
    this.dtEnd = $filter("date")(new Date(), "yyyy-MM-dd");


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

    this.setPage = function (pageNo,content) {
        selt.content = content;
        selt.dtStart = $filter("date")(selt.dtStart, "yyyy-MM-dd");
        selt.dtEnd = $filter("date")(selt.dtEnd, "yyyy-MM-dd");
        if(content=='考勤列表'){
            var paramsAtt = {
                "tagName":selt.tagName,
                "name":selt.name,
                "attenceDate":selt.dt,
                "startDate":selt.dtStart,
                "endDate":selt.dtEnd,
                "pageNo":pageNo,
                "pageSize":10,
                "type":0,
                "signinType":selt.signinType
            };
            //导出
            this.excelExprot="/excel/excelExport?tagName="+selt.tagName+"&name="+selt.name+"&attenceDate="+selt.dt+"&export=考勤"+"&type="+selt.type+"&lackAtt=null&startDate="+selt.dtStart+"&endDate="+selt.dtEnd+"&signinType="+selt.signinType;

        }else if(content=='迟到列表'){
            var paramsAtt = {
                "tagName":selt.tagName,
                "name":selt.name,
                "attenceDate":selt.dt,
                "startDate":selt.dtStart,
                "endDate":selt.dtEnd,
                "pageNo":pageNo,
                "pageSize":10,
                "type":selt.type,
                "lateTime":1,
                "signinType":selt.signinType
            };
            //导出
            this.excelExprot="/excel/excelExport?tagName="+selt.tagName+"&name="+selt.name+"&attenceDate="+selt.dt+"&export=迟到"+"&type="+selt.type+"&lackAtt=null&lateTime=1&startDate="+selt.dtStart+"&endDate="+selt.dtEnd+"&signinType="+selt.signinType;

        }else if(content=='早退列表'){
            var paramsAtt = {
                "tagName":selt.tagName,
                "name":selt.name,
                "attenceDate":selt.dt,
                "startDate":selt.dtStart,
                "endDate":selt.dtEnd,
                "pageNo":pageNo,
                "pageSize":10,
                "type":selt.type,
                "backTime":1
            };
            //导出
            this.excelExprot="/excel/excelExport?tagName="+selt.tagName+"&startDate="+selt.dtStart+"&endDate="+selt.dtEnd+"&name="+selt.name+"&attenceDate="+selt.dt+"&export=早退"+"&type="+selt.type+"&lackAtt=null&backTime=1&startDate="+selt.dtStart+"&endDate="+selt.dtEnd;
        }else if(content=='缺勤列表'){
            var paramsAtt = {
                "tagName":selt.tagName,
                "name":selt.name,
                "attenceDate":selt.dt,
                "startDate":selt.dtStart,
                "endDate":selt.dtEnd,
                "pageNo":pageNo,
                "pageSize":10,
                "lackAtt":"lack"
            };
            //导出
            this.excelExprot="/excel/excelExport?tagName="+selt.tagName+"&startDate="+selt.dtStart+"&endDate="+selt.dtEnd+"&name="+selt.name+"&attenceDate="+selt.dt+"&export=缺勤"+"&type="+selt.type+"&lackAtt=lack&startDate="+selt.dtStart+"&endDate="+selt.dtEnd;
        }else if(content=='加班列表'){
            var paramsAtt = {
                "tagName":selt.tagName,
                "name":selt.name,
                "attenceDate":selt.dt,
                "startDate":selt.dtStart,
                "endDate":selt.dtEnd,
                "pageNo":pageNo,
                "pageSize":10,
                "type":1
            };
            //导出
            this.excelExprot="/excel/excelExport?tagName="+selt.tagName+"&startDate="+selt.dtStart+"&endDate="+selt.dtEnd+"&name="+selt.name+"&attenceDate="+selt.dt+"&export=加班"+"&type="+"1"+"&lackAtt=null&startDate="+selt.dtStart+"&endDate="+selt.dtEnd;

        }else if(content=='请假列表'){
            var paramsAtt = {
                "tagName":selt.tagName,
                "name":selt.name,
                "attenceDate":selt.dt,
                "startDate":selt.dtStart,
                "endDate":selt.dtEnd,
                "pageNo":pageNo,
                "pageSize":10,
                "lackAtt":"leave",
                "createUser":selt.createUser
            };
            //导出
            this.excelExprot="/excel/excelExport?tagName="+selt.tagName+"&startDate="+selt.dtStart+"&endDate="+selt.dtEnd+"&name="+selt.name+"&attenceDate="+selt.dt+"&export=请假"+"&type="+selt.type+"&lackAtt=leave&startDate="+selt.dtStart+"&endDate="+selt.dtEnd+"&createUser="+selt.createUser;
        }

        $http.post("/attence/searchAttList",angular.toJson(paramsAtt)).success(function (result) {
            if(result.code==1){
                selt.attList = result.list;
                selt.attCount = result.attCount;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;;
                selt.pageNo = result.pageNo;
            }else{
                selt.attList = [];
            }

        });
    };



    this.pageChanged = function(content) {
        $log.log('Page changed to: ' + this.pageNo);
        selt.dtStart = $filter("date")(selt.dtStart, "yyyy-MM-dd");
        selt.dtEnd = $filter("date")(selt.dtEnd, "yyyy-MM-dd");
        if(content=='考勤列表'){
            var paramsAtt = {
                "tagName":selt.tagName,
                "name":selt.name,
                "attenceDate":selt.dt,
                "startDate":selt.dtStart,
                "endDate":selt.dtEnd,
                "pageNo":this.pageNo,
                "pageSize":10,
                "type":0,
                "signinType":selt.signinType
            };
        }else if(content=='迟到列表'){
            var paramsAtt = {
                "tagName":selt.tagName,
                "name":selt.name,
                "attenceDate":selt.dt,
                "startDate":selt.dtStart,
                "endDate":selt.dtEnd,
                "pageNo":this.pageNo,
                "pageSize":10,
                "type":selt.type,
                "lateTime":1,
                "signinType":selt.signinType
            };
        }else if(content=='早退列表'){
            var paramsAtt = {
                "tagName":selt.tagName,
                "name":selt.name,
                "attenceDate":selt.dt,
                "startDate":selt.dtStart,
                "endDate":selt.dtEnd,
                "pageNo":this.pageNo,
                "pageSize":10,
                "type":selt.type,
                "backTime":1
            };
        }else if(content=='缺勤列表'){
            var paramsAtt = {
                "tagName":selt.tagName,
                "name":selt.name,
                "attenceDate":selt.dt,
                "startDate":selt.dtStart,
                "endDate":selt.dtEnd,
                "pageNo":this.pageNo,
                "pageSize":10,
                "lackAtt":"lack"
            };
        }else if(content=='加班列表'){
            var paramsAtt = {
                "tagName":selt.tagName,
                "name":selt.name,
                "attenceDate":selt.dt,
                "startDate":selt.dtStart,
                "endDate":selt.dtEnd,
                "pageNo":this.pageNo,
                "pageSize":10,
                "type":1
            };
        }else if(content=='请假列表'){
            var paramsAtt = {
                "tagName":selt.tagName,
                "name":selt.name,
                "attenceDate":selt.dt,
                "startDate":selt.dtStart,
                "endDate":selt.dtEnd,
                "pageNo":this.pageNo,
                "pageSize":10,
                "lackAtt":"leave",
                "createUser":selt.createUser
            };
        }

        $http.post("/attence/searchAttList",angular.toJson(paramsAtt)).success(function (result) {
            if(result.code==1){
                selt.attList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;;
                selt.pageNo = result.pageNo;
            }else{
                selt.attList = [];
            }

        });
    };

    this.maxSize = 3;

    this.alertMe = function(content) {
        selt.setPage(1,content);
    };
    //----时间控件------
    //单个操作
    this.attenceToLeaveSingle = function (att,content,size) {
        var LeaveSingleInstance = $modal.open({
            templateUrl: 'attenceToLeave.html',
            controller: 'attenceToLeaveSingle as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return att;
                }
            }
        });

        LeaveSingleInstance.result.then(function () {
            selt.setPage(1,content);
        });

    }

    //批量操作请假checkbox
    selt.selected = [];
    var updateSelected = function (action, att) {
        if (action == 'add' && selt.selected.indexOf(att) == -1) {
            selt.selected.push(att);
        }
        if (action == 'remove' && selt.selected.indexOf(att) != -1) {
            var idx = selt.selected.indexOf(att);
            selt.selected.splice(idx, 1);
        }
    }

    this.updateSelection = function ($event, att) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, att);
    }

    this.isSelected = function (att) {
        return this.selected.indexOf(att) != -1;

    }



    //批量操作
    this.attenceToLeaveMultiple = function (content,size) {
        if(selt.selected.length==0){
            alert("请选择一条数据");
            return;
        }

        var LeaveMultipleInstance = $modal.open({
            templateUrl: 'attenceToLeaveMultiple.html',
            controller: 'attenceToLeaveMultiple as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return selt.selected;
                }
            }
        });
        LeaveMultipleInstance.result.then(function () {
            selt.selected=[];
            selt.setPage(1,content);
        });

    };

    //筛选
    this.nameStrs = [];
    this.tagNameStrs = [];

    this.submitSeach = function (content) {
        selt.setPage(1,content);
        this.myShaix = false;
        if(selt.name!=undefined&&selt.name!=""){
            selt.nameStrs.push(selt.name);
        };
        if(selt.tagName!=undefined&&selt.tagName!=""){
            selt.tagNameStrs.push(selt.tagName);
        };


    };

    this.cancel = function () {
        selt.name = "";
        //selt.tagName = "";
    };




    //---页面按钮权限控制--start--
    this.opCodes = [];
    this.isShowOpe = function(value){
        for(var i = 0; i < selt.opCodes.length; i++){
            if(value === selt.opCodes[i]){
                return true;
            }
        }
        return false;
    };
    $http.get("/ts-authorize/ts-imis/operList/app-attenceList").success(function (result) {
        if (result.success) {
            selt.opCodes = result.object;
            if(!selt.isShowOpe("all")){
                selt.tagName = result.message;
            }
            selt.setPage(1,'考勤列表');
        } else {
            alert(result.message);
        }
    });

    //-------------------end---





}])
//单条数据修改
app.controller('attenceToLeaveSingle', ['$scope', '$modalInstance','$http', 'data', function($scope,$modalInstance,$http,data) {
    var seltSin=this;
    seltSin.xianshi=false;
    seltSin.submitted=false;
    seltSin.httptimeReg="^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$";
    $http.get("/twfDict/getTwfDictForType/?type=" + "2").success(function (result) {
        if (result.success) {
            seltSin.twfDictList = result.object;
        } else {
            alert(result.message);
        }

    });

    this.attenceToLeavesave=function(valid,invalid,attenceLeave){
        if(valid){
            if (!invalid) {
                if(!confirm("你确定操作请假吗？")){
                    return;
                };
                seltSin.attenceLeavearray = [];
                var riqidate;
                if (seltSin.riqi == 3 || seltSin.riqi == 4 || seltSin.riqi == 8) {
                    riqidate = seltSin.riqi;
                } else {
                    riqidate = 2;
                }
                var attenleave = {
                    name: data.name,
                    tagName: data.tagName,
                    tagId: data.tagId,
                    workNum: data.workNum,
                    week: data.week,
                    position: data.position,
                    attenceDate: data.attenceDate,
                    type: this.twfDict.code,
                    startTime: attenceLeave.startTime,
                    endTime: attenceLeave.endTime,
                    attId: data.pkid,
                    attType: data.attType,
                    remark: attenceLeave.remark,
                    leaveHours: riqidate,
                    created: new Date(),
                    createUser: 'xitong'
                };
                seltSin.attenceLeavearray.push(attenleave);

                $http.post("/attenceLeave/insertAttenceLeaveList", angular.toJson(seltSin.attenceLeavearray)).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                        $modalInstance.close();

                    } else {
                        alert(result.message);
                    }
                });
            }
        }else{
            seltSin.submitted=true;
        }



    }

    this.changeOptions=function(){
        // alert(this.twfDict.code);
        if(this.twfDict.code=="9"){
            seltSin.xianshi=true;
        }else{
            seltSin.xianshi=false;
        }
    }




    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])
//批量请假修改
app.controller('attenceToLeaveMultiple', ['$scope', '$modalInstance','$http', 'data', function($scope,$modalInstance,$http,data) {
    var seltMul=this;
    seltMul.xianshi=false;
    seltMul.submitted=false;
    seltMul.httptimeReg="^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$";

    if(data.length>0){
        var selectedname="";
        for(var i=0;i<data.length;i++){
            selectedname=selectedname+data[i].name+",";
        }
        seltMul.attenceMul=selectedname;
    }

    $http.get("/twfDict/getTwfDictForType/?type=" + "2").success(function (result) {
        if (result.success) {
            seltMul.twfDictList = result.object;
        } else {
            alert(result.message);
        }

    });

    this.attenceToLeaveMulsave=function(valid,invalid,attenceLeave){
        if (valid) {
            if (!invalid) {
                if(!confirm("你确定操作请假吗？")){
                    return;
                };
                seltMul.attenceLeavearray = [];
                var riqidate;
                if (seltMul.riqi == 3 ||seltMul.riqi == 4 || seltMul.riqi == 8) {
                    riqidate = seltMul.riqi;
                } else {
                    riqidate = 2;
                }
                for (var i = 0; i < data.length; i++) {
                    var attenleave = {
                        name: data[i].name,
                        tagName: data[i].tagName,
                        tagId: data[i].tagId,
                        workNum: data[i].workNum,
                        week: data[i].week,
                        position: data[i].position,
                        attenceDate: data[i].attenceDate,
                        attId: data[i].pkid,
                        attType: data[i].attType,
                        type: this.twfDict.code,
                        startTime: attenceLeave.startTime,
                        endTime: attenceLeave.endTime,
                        remark: attenceLeave.remark,
                        leaveHours: riqidate,
                        created: new Date(),
                        createUser: 'xitong'
                    };
                    seltMul.attenceLeavearray.push(attenleave);
                }
                $http.post("/attenceLeave/insertAttenceLeaveList", angular.toJson(seltMul.attenceLeavearray)).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                        $modalInstance.close();
                    } else {
                        alert(result.message);
                    }
                });
            }
        } else {
            seltMul.submitted = true;
        }
    }

    this.changeOptions=function(){
        //alert(this.twfDict.code);
        if(this.twfDict.code=="9"){
            seltMul.xianshi=true;
        }else{
            seltMul.xianshi=false;
        }
    }


    this.ok = function () {
        $modalInstance.close();
    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])