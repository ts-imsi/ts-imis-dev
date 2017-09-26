app.controller('Contract', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;


    //---页面按钮权限控制--start--
    this.opCodes = [];
    $http.get("/ts-authorize/ts-imis/operList/app-contract").success(function (result) {
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



    this.myShaix = false;
    selt.submitted=false;
    selt.status=0;
    this.toggShaix= function() {
        selt.myShaix = !selt.myShaix;
    };
    this.szReg="^(0|[1-9][0-9]*)$";
    $(document).on("click",function(e){//js
        var $target = $(e.target);
        if(!($target.parents().andSelf().is("#myShaix"))){
            $scope.$apply(function(){
                selt.myShaix=false;
            });
        }
    });

    this.cancel = function () {
        selt.name = "";
        selt.workNum = "";
        selt.dtStart="";
        selt.dtEnd="";
        selt.years="";
        selt.twfDictContractType="";
    };

    this.submitSeach=function(){
        this.setPage(1);
        this.myShaix = false;
    }
    var type;
    this.setPage = function (pageNo) {
        if(this.twfDictContractType!=""&&this.twfDictContractType!=null){
            type=this.twfDictContractType.code;
        }
        var parm={
            pageNo:pageNo,
            pageSize:5,
            name:selt.name,
            workNum:selt.workNum,
            depName:selt.depName,
            dtStart:selt.dtStart,
            dtEnd:selt.dtEnd,
            years:selt.years,
            type:type
        };
        this.excelContractExprot="/excel/excelContractExprot?name="+selt.name+"&workNum="+selt.workNum+"&depName="+selt.depName+"&dtStart="+selt.dtStart+"&dtEnd="+selt.dtEnd+"&years="+selt.years+"&type="+type;
        $http.post("/contract/getTbContractList",angular.toJson(parm)).success(function (result) {
            selt.contractList = result.list;
            selt.totalCount = result.totalCount;
            selt.pageSize = result.pageSize;
            selt.pageNo = result.pageNo;
        });
    };


    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        if(this.twfDictContractType!=""&&this.twfDictContractType!=null){
            type=this.twfDictContractType.code;
        }
        var parm={
            pageNo:this.pageNo,
            pageSize:5,
            name:selt.name,
            workNum:selt.workNum,
            depName:selt.depName,
            dtStart:selt.dtStart,
            dtEnd:selt.dtEnd,
            years:selt.years,
            type:type
        };
        $http.post("/contract/getTbContractList",angular.toJson(parm)).success(function (result) {
            selt.contractList = result.list;
            selt.totalCount = result.totalCount;
            selt.pageSize = result.pageSize;
            selt.pageNo = result.pageNo;
        });

    };

    this.maxSize = 5;
    this.setPage(1);

    this.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };

    /*this.disabled = function(date, mode) {
     return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
     };*/
    this.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    this.format = this.formats[0];

    this.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        selt.opened = true;
    };

    this.openstart=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.startopened = true;
    };

    this.openend=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.endopened = true;
    };

    this.openregu=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.reguopened = true;
    };

    this.opendtStart=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.strardtOpened = true;
    };

    this.opendtEnd=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.enddtOpen = true;
    };
    this.opensign=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.signopened = true;
    };

    this.findWorkNumRepeat=function(){
        var param={workNum:selt.contract.workNum};
        $http.post("/contract/findWorkNumForContrach", angular.toJson(param)).success(function (result) {
            if(!result.success){
                selt.findworkNum=true;
                selt.message=result.message;
            }else{
                selt.findworkNum=false;
                var tbPersonnel=result.object;
                selt.contract.name=tbPersonnel.name;
                selt.contract.entryDate=tbPersonnel.entryDate;
                selt.contract.regularDate=tbPersonnel.regularDate;
            }

        });
    }

    this.contractUpdate=function(valid,invalid,contract){
        if (valid) {
            if (!invalid) {
                if (this.twfDict != "" && this.twfDict != null) {
                    contract.type = this.twfDict.code;
                }
                contract.endDate = $filter("date")(contract.endDate, "yyyy-MM-dd");
                contract.startDate = $filter("date")(contract.startDate, "yyyy-MM-dd");
                contract.signDate = $filter("date")(contract.signDate, "yyyy-MM-dd");
                contract.regularDate = $filter("date")(contract.regularDate, "yyyy-MM-dd");
                contract.entryDate = $filter("date")(contract.entryDate, "yyyy-MM-dd");
                contract.status=selt.status;
                $http.post("/contract/updateContract", contract).success(function (result) {
                    if (result.success) {
                        selt.contract = result.object;
                        selt.showsubmit=false;
                        window.alert(result.message);
                        selt.setPage(1);
                    } else {
                        window.alert(result.message);
                    }
                });
            }
        }else{
            selt.submitted=true;
        }
    }

    selt.showsubmit=true;

    $http.get("/twfDict/getTwfDictForType/?type=" + "4").success(function (result) {
        if (result.success) {
            selt.twfDictList = result.object;
        } else {
            alert(result.message);
        }

    });

    this.createContract=function(){
        this.contract="";
        selt.twfDict="";
        selt.showsubmit=true;
        selt.submitted=false;
        $http.get("/twfDict/getTwfDictForType/?type=" + "4").success(function (result) {
            if (result.success) {
                selt.twfDictList = result.object;
            } else {
                alert(result.message);
            }

        });


    }
    this.updateContractView = function (contract) {
        this.contract=contract;
        selt.status=contract.status;
        selt.showsubmit=false;
        selt.submitted=false;
        $http.get("/twfDict/getTwfDictForType/?type=" + "4").success(function (result) {
            if (result.success) {
                selt.twfDictList = result.object;
                for(var i=0;i<selt.twfDictList.length;i++){
                    if(contract.type==selt.twfDictList[i].code)
                        selt.twfDict=selt.twfDictList[i];
                }
            } else {
                alert(result.message);
            }

        });

    };

    /*//获取部门
     this.findDeptperson = function (size) {
     var selectdeptInstance = $modal.open({
     templateUrl: 'selectdept.html',
     controller: 'selectdeptController as selectdeptctrl',
     size: size
     });

     selectdeptInstance.result.then(function (deptname) {
     selt.contract.name=deptname.label;
     });

     }*/


    this.panelClass = "contact panel panel-default";

    this.openPanel = function () {
        selt.panelClass = "contact panel panel-default active";
    }
    this.closePanel = function () {
        selt.panelClass = "contact panel panel-default";
    }

}]);

/*
 //组织结构添加修改
 app.controller('selectdeptController', ['$scope', '$modalInstance','$http', function($scope,$modalInstance,$http) {
 var finddept=this;
 var deptname;
 finddept.showbutton=false;
 finddept.my_tree = {};
 finddept.success=false;
 $http.post("/organization/getDeptOrganization").success(function(data){
 finddept.success=data.success;

 finddept.my_data =data.object;
 });
 finddept.my_tree_handler = function(branch) {
 if(branch.data.type!="person"){
 alert("请选择人员");
 }else{
 deptname={level:branch.data.level,type:branch.data.type,id:branch.data.pkid,label:branch.label,parent:branch.data.parent};
 finddept.showbutton=true;
 }

 };
 finddept.selectdept=function(){
 $modalInstance.close(deptname);
 }
 finddept.cancel = function () {
 $modalInstance.dismiss('cancel');
 };
 }])*/
