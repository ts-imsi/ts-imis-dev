app.controller('QuitPersonnelFile', ['$scope','$http','$log','$modal','$filter', function($scope,$http,$log,$modal,$filter) {
    var selt = this;

    //---页面按钮权限控制--start--
    this.opCodes = [];
    $http.get("/ts-authorize/ts-imis/operList/app-quit").success(function (result) {
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

    selt.findworkNum=false;
    this.myShaix = false;
    this.submitted=false;

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

    this.submitSeach = function () {
        selt.setPage(1);
        this.myShaix = false;
    };

    this.cancel = function () {
        selt.name = "";
        selt.depName = "";
        selt.sexcx="";
        selt.workNum="";
        selt.twfDictPo="";
    };

    this.setPage = function (pageNo) {
        var position;
        if(selt.twfDictPo!="" && selt.twfDictPo!=null){
            position=selt.twfDictPo.code;
        }
        var paramsAtt = {
            "depName":selt.depName,
            "name":selt.name,
            "sex":selt.sexcx,
            "workNum":selt.workNum,
            "position":position,
            "pageNo":pageNo,
            "pageSize":10
        };
        this.excelQuitPersonExprot="/excel/excelQuitPersonExprot?depName="+selt.depName+"&name="+selt.name+"&position="+selt.position+"&sex="+selt.sexcx+"&workNum="
            +selt.workNum;

        $http.post("/personnel/searchQuitPersonnel",angular.toJson(paramsAtt)).success(function (result) {
            if(result.code==1){
                selt.personList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;;
                selt.pageNo = result.pageNo;
            }else{
                selt.personList = [];
            }

        });
    };



    this.pageChanged = function() {
        $log.log('Page changed to: ' + this.pageNo);
        var position;
        if(selt.twfDictPo!="" && selt.twfDictPo!=null){
            position=selt.twfDictPo.code;
        }
        var paramsAtt = {
            "depName":selt.depName,
            "name":selt.name,
            "sex":selt.sexcx,
            "workNum":selt.workNum,
            "position":position,
            "pageNo":this.pageNo,
            "pageSize":10
        };
        $http.post("/personnel/searchQuitPersonnel",angular.toJson(paramsAtt)).success(function (result) {
            if(result.code==1){
                selt.personList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;;
                selt.pageNo = result.pageNo;
            }else{
                selt.personList = [];
            }

        });
    };


    this.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };

    this.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    this.format = this.formats[0];
    // this.entryDate = $filter("date")(new Date(), "yyyy-MM-dd");
    this.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        selt.opened = true;
    };
    var time;
    this.openbir=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.biropen = true;

    };

    this.opengra=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.graopen = true;
    };

    this.openregu=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.reguopen = true;
    };

    this.openregu=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.reguopen = true;
    };

    this.openqui=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.quiopen = true;
    };

    this.openshb=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.shbopen = true;
    };
    this.opengjj=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.gjjopen = true;
    };

    $http.get("/twfDict/getTwfDictForType/?type="+"6").success(function (result) {
        if(result.success){
            selt.twfDictpoList=result.object;
        }else{
            alert(result.message);
        }

    });

    this.maxSize = 3;
    this.setPage(1);

    this.updatePersonnelView = function (person) {
        this.person=person;
        selt.sex=person.sex;
        if(person.reEntry!=null){
            selt.reEntry=person.reEntry;
        }
        if(person.birthdayType!=null){
            selt.birthdayType=person.birthdayType;
        }
        selt.showbutton=false;
        selt.submitted=false;

        $http.get("/twfDict/getTwfDictForType/?type="+"6").success(function (result) {
            if(result.success){
                selt.twfDictgwList=result.object;
                for (var i = 0; i < selt.twfDictgwList.length; i++) {
                    if (person.position == selt.twfDictgwList[i].code)
                        selt.twfDictgw = selt.twfDictgwList[i];
                }
            }else{
                alert(result.message);
            }

        });

        $http.get("/twfDict/getTwfDictForType/?type="+"7").success(function (result) {
            if(result.success){
                selt.twfDictxlList=result.object;
                for (var i = 0; i < selt.twfDictxlList.length; i++) {
                    if (person.education == selt.twfDictxlList[i].code)
                        selt.twfDictxl = selt.twfDictxlList[i];
                }
            }else{
                alert(result.message);
            }

        });
    };
    //--tag切换
    this.tagclass01 = "RuActive";

    this.tag = 1;
    this.selectTag = function (tag) {
        selt.tag = tag;
        if(tag==1){
            selt.tagclass01="RuActive";
        }
    };

    //划出层样式
    this.panelClass = "contact panel panel-default";

    this.openQuitPanel = function () {
        selt.panelClass = "contact panel panel-default active";
    }
    this.closeQuitPanel = function () {
        selt.panelClass = "contact panel panel-default";
        selt.selectTag('1');
    }

}]);