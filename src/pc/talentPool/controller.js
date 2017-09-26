app.controller('talentPool', ['$scope','$http','$log','$modal','$filter','FileUploader', function($scope,$http,$log,$modal,$filter,FileUploader) {
    var selt = this;

    //---页面按钮权限控制--start--
    this.opCodes = [];
    $http.get("/ts-authorize/ts-imis/operList/app-talentPool").success(function (result) {
        if (result.success) {
            selt.opCodes = result.object;
        } else {
            alert(result.message);
        }
    });
    this.isShowOpe = function(value){
        for(var i = 0; i < selt.opCodes.length; i++){
            if(value === selt.opCodes[i]){
                return true;
            }
        }
        return false;
    };
    //-------------------end---

    selt.phoneReg="^1(3[0-9]|4[57]|5[0-35-9]|7[013678]|8[0-9])\\d{8}$";
    selt.nameReg="^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,40}$";
    this.myShaix = false;
    selt.submitted=false;
    selt.sex=1;
    selt.isCome=0;


    $http.get("/twfDict/getTwfDictForType/?type=" + "5").success(function (result) {
        if (result.success) {
            selt.twfDictmsList = result.object;
        } else {
            alert(result.message);
        }

    });

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

    //筛选
    this.nameStrs = [];
    this.willJobStrs = [];
    this.beGoodStrs = [];

    this.submitSeach = function () {
        selt.setPage(1);
        this.myShaix = false;
        if(selt.name!=undefined){
            selt.nameStrs.push(selt.name);
        };
        if(selt.willJob!=undefined){
            selt.willJobStrs.push(selt.willJob);
        };
        if(selt.beGood!=undefined){
            selt.beGoodStrs.push(selt.beGood);
        };


    };




    this.cancel = function () {
        selt.name = "";
        selt.willJob = "";
        selt.beGood = "";
        selt.isComeCx="";
        selt.twfDictms="";
    };


    this.setPage = function (pageNo) {

        var result;
        if(selt.twfDictms!="" && selt.twfDictms!=null){
            result=selt.twfDictms.code;
        }

        var paramsTalent = {
            "willJob":selt.willJob,
            "name":selt.name,
            "beGood":selt.beGood,
            "isCome":selt.isComeCx,
            "result":result,
            "pageNo":pageNo,
            "pageSize":10
        };
        this.excelTalentExprot="/excel/excelTalentExprot?willJob="+selt.willJob+"&name="+selt.name+"&beGood="+selt.beGood+"&isCome="+selt.isComeCx+"&result="+result;
        $http.post("/talent/searchTalent",angular.toJson(paramsTalent)).success(function (result) {
            if(result.code==1){
                selt.talentList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;;
                selt.pageNo = result.pageNo;
            }else{
                selt.talentList = [];
            }

        });
    };

    this.pageChanged = function() {
        $log.log('Page changed to: ' + this.pageNo);

        var result;
        if(selt.twfDictms!="" && selt.twfDictms!=null){
            result=selt.twfDictms.code;
        }
        var paramsTalent = {
            "willJob":selt.willJob,
            "name":selt.name,
            "beGood":selt.beGood,
            "isCome":selt.isComeCx,
            "result":result,
            "pageNo":this.pageNo,
            "pageSize":10
        };
        $http.post("/talent/searchTalent",angular.toJson(paramsTalent)).success(function (result) {
            if(result.code==1){
                selt.talentList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;;
                selt.pageNo = result.pageNo;
            }else{
                selt.talentList = [];
            }

        });
    };

    this.setPageWH = function (pageNo,pkid) {
        var paramsTalent = {
            "perId":pkid,
            "type":2,//人才库
            "pageNo":pageNo,
            "pageSize":5
        };
        $http.post("/talent/queryWorkHistory",angular.toJson(paramsTalent)).success(function (result) {
            if(result.code==1){
                selt.whList = result.list;
                selt.totalCountWH = result.totalCount;
                selt.pageSizeWH = result.pageSize;;
                selt.pageNoWH = result.pageNo;
            }else{
                selt.whList = [];
            }

        });
    };

    this.pageChangedWH = function(pkid) {
        $log.log('Page changed to: ' + this.pageNoWH);
        $log.log('pkid:' + pkid);

        var paramsTalent = {
            "perId":pkid,
            "type":2,//人才库
            "pageNo":this.pageNoWH,
            "pageSize":5
        };
        $http.post("/talent/queryWorkHistory",angular.toJson(paramsTalent)).success(function (result) {
            if(result.code==1){
                selt.whList = result.list;
                selt.totalCountWH = result.totalCount;
                selt.pageSizeWH = result.pageSize;;
                selt.pageNoWH = result.pageNo;
            }else{
                selt.whList = [];
            }

        });
    };

    this.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };

    /*this.disabled = function(date, mode) {
     return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
     };*/
    this.format = 'yyyy-MM-dd';

    this.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        selt.opened = true;
    };

    this.maxSize = 3;
    this.setPage(1);

    this.updateTalentView = function (pool) {
        this.talent=pool;
        selt.sex=pool.sex;
        selt.isCome=pool.isCome;
        selt.showbutton=false;
        $http.get("/twfDict/getTwfDictForType/?type=" + "5").success(function (result) {
            if (result.success) {
                selt.twfDictList = result.object;
                for(var i=0;i<selt.twfDictList.length;i++){
                    if(pool.result==selt.twfDictList[i].code)
                        selt.twfDict=selt.twfDictList[i];
                }
            } else {
                alert(result.message);
            }

        });
        selt.setPageWH(1,pool.pkid);
    };

    this.talentSave=function(valid,invalid,talent){
        if(valid) {
            if (!invalid) {
                talent.workDate = $filter("date")(talent.workDate, "yyyy-MM-dd");
                if (this.twfDict != "" && this.twfDict != null) {
                    talent.result = this.twfDict.code;
                }
                talent.sex=selt.sex;
                talent.isCome=selt.isCome;
                $http.post("/talent/talentSave", talent).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                        selt.talent=result.object;
                        selt.showbutton=false;
                        selt.setPage(1);
                    } else {
                        alert(result.message);
                    }

                });
            }
        }else{
            selt.submitted=true;
        }
    };

    this.deleteTalent = function (perId) {
        var r=confirm("是否删除信息");
        if(r==true) {
            if (perId == null) {
                window.alert("请选择表格数据");
            } else {
                $http.post("/talent/deleteTalent/?pkid=" + perId).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                        selt.setPage(1);
                    }


                });
            }
        }
    };


    this.createTalent=function(){
        selt.showbutton=true;
        selt.submitted=false;
        selt.talent = "";
        selt.twfDict="";
        $http.get("/twfDict/getTwfDictForType/?type=" + "5").success(function (result) {
            if (result.success) {
                selt.twfDictList = result.object;
            } else {
                alert(result.message);
            }

        });
    };

    //--tag切换
    this.tagclass01 = "RuActive";
    this.tagclass02 = "";
    this.tag = 1;
    this.selectTag = function (tag) {
        selt.tag = tag;
        if(tag==1){
            selt.tagclass01="RuActive";
            selt.tagclass02="";
        }else if(tag==2){
            selt.tagclass01="";
            selt.tagclass02="RuActive";
        };

    };



    this.workHistory = {
        "perId":""
    };

    this.addWorkHistory = function (work,perId,size) {
        if(perId==undefined){
            alert("请先保存个人信息!");
            return;
        }
        work.perId = perId;
        this.myShaix = false;
        var LeaveSingleInstance = $modal.open({
            templateUrl: 'workHistory.html',
            controller: 'workHistoryCtrl as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return work;
                }
            }
        });

        LeaveSingleInstance.result.then(function (pkid) {
            selt.setPageWH(1,pkid);
            selt.workHistory = {
                "perId":""
            };
        });

    };

    this.deletework = function (pkid,perId) {
        $http.post("/talent/deleteWorkHistory/?pkid=" + pkid).success(function (result) {
            if (result.success) {
                alert(result.message);
                selt.setPageWH(1,perId);
            }
        });
    };

    var uploader = $scope.uploader = new FileUploader({
        url: '/fileUpload/file?type=talent',
        headers:undefined
    });

    this.fileItem = "";
    uploader.onAfterAddingFile = function(fileItem) {
        console.log(uploader.queue.length);
        console.log(uploader.queue[uploader.queue.length-1].file.name);
        console.log(fileItem.file.name);
        selt.fileItem = fileItem;



    };

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        if(response.success){
            selt.talent.resumeFile = response.object;
        }
    };
    this.panelClass = "contact panel panel-default";

    this.openPanel = function () {
        selt.panelClass = "contact panel panel-default active";
    };
    this.closePanel = function () {
        selt.panelClass = "contact panel panel-default";
    };

}])



app.controller('workHistoryCtrl', ['$scope', '$modalInstance','$http', 'data','$filter', function($scope,$modalInstance,$http,data,$filter) {
    var seltSin=this;
    this.workHistory = data;

    this.workSave=function(work){
        work.startDate = $filter("date")(work.startDate, "yyyy-MM-dd");
        work.endDate = $filter("date")(work.endDate, "yyyy-MM-dd");
        $http.post("/talent/workHistorySave", work).success(function (result) {
            if (result.success) {
                alert(result.message);
                console.log(result.object.perId);
                $modalInstance.close(result.object.perId);
            } else {
                alert(result.message);
            }

        });
    };

    this.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };

    /*this.disabled = function(date, mode) {
     return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
     };*/
    this.format = 'yyyy-MM-dd';

    this.openStart = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        seltSin.startOpened = true;
    };

    this.openEnd = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        seltSin.endOpened = true;
    };






    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])