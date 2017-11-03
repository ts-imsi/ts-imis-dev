app.controller('PersonnelFile', ['$scope','$http','$log','$modal','$filter','FileUploader', function($scope,$http,$log,$modal,$filter,FileUploader) {
    var selt = this;

    //---页面按钮权限控制--start--
    this.opCodes = [];
    $http.get("/ts-authorize/ts-imis/operList/app-personnelFile").success(function (result) {
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
    selt.idCardReg="^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$";
    selt.nameReg="^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,40}$";
    selt.xzReg="^[0-9]*[1-9][0-9]*$";

    selt.sex=1;
    selt.birthdayType=2;
    selt.reEntry=0;
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

    //筛选
    this.nameStrs = [];
    this.tagNameStrs = [];

    this.submitSeach = function () {
        selt.setPage(1);
        this.myShaix = false;
        if(selt.name!=""){
            selt.nameStrs.push(selt.name);
        };
        if(selt.depName!=""){
            selt.tagNameStrs.push(selt.depName);
        };


    };


    this.cancel = function () {
        selt.name = "";
        selt.depName = "";
        selt.sexcx="";
        selt.workNum="";
        selt.twfDictPo="";
        selt.birthdayTypecx="";
        selt.SocialStart="";
        selt.SocialEnd="";
        selt.AccumulationStart="";
        selt.AccumulationEnd="";
        selt.BirthdayStart="";
        selt.BirthdayEnd="";
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
            "birthdayType":selt.birthdayTypecx,
            "SocialStart":$filter("date")(selt.SocialStart, "yyyy-MM-dd"),
            "SocialEnd":$filter("date")(selt.SocialEnd, "yyyy-MM-dd"),
            "AccumulationStart":$filter("date")(selt.AccumulationStart, "yyyy-MM-dd"),
            "AccumulationEnd":$filter("date")(selt.AccumulationEnd, "yyyy-MM-dd"),
            "BirthdayStart":$filter("date")(selt.BirthdayStart, "yyyy-MM-dd"),
            "BirthdayEnd":$filter("date")(selt.BirthdayEnd, "yyyy-MM-dd"),
            "pageNo":pageNo,
            "pageSize":10
        };
        this.excelPersonExprot="/excel/excelPersonExprot?depName="+selt.depName+"&name="+selt.name+"&position="+selt.position+"&sex="+selt.sexcx+"&workNum="
            +selt.workNum+"&birthdayType="+selt.birthdayTypecx+"&SocialStart="+$filter("date")(selt.SocialStart, "yyyy-MM-dd")+"&SocialEnd="+$filter("date")(selt.SocialEnd, "yyyy-MM-dd")+
            "&AccumulationStart="+$filter("date")(selt.AccumulationStart, "yyyy-MM-dd")+
            "&AccumulationEnd="+$filter("date")(selt.AccumulationEnd, "yyyy-MM-dd")+
            "&BirthdayStart="+$filter("date")(selt.BirthdayStart, "yyyy-MM-dd")+
            "&BirthdayEnd="+$filter("date")(selt.BirthdayEnd, "yyyy-MM-dd");

        $http.post("/personnel/searchPersonnel",angular.toJson(paramsAtt)).success(function (result) {
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
            "birthdayType":selt.birthdayTypecx,
            "SocialStart":$filter("date")(selt.SocialStart, "yyyy-MM-dd"),
            "SocialEnd":$filter("date")(selt.SocialEnd, "yyyy-MM-dd"),
            "AccumulationStart":$filter("date")(selt.AccumulationStart, "yyyy-MM-dd"),
            "AccumulationEnd":$filter("date")(selt.AccumulationEnd, "yyyy-MM-dd"),
            "BirthdayStart":$filter("date")(selt.BirthdayStart, "yyyy-MM-dd"),
            "BirthdayEnd":$filter("date")(selt.BirthdayEnd, "yyyy-MM-dd"),
            "pageNo":this.pageNo,
            "pageSize":10
        };
        $http.post("/personnel/searchPersonnel",angular.toJson(paramsAtt)).success(function (result) {
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

    this.setPageLog = function (pageNo,perId) {
        var paramsAtt = {
            "perId":perId,
            "pageNo":pageNo,
            "pageSize":5
        };
        $http.post("/personnel/queryDeptLog",angular.toJson(paramsAtt)).success(function (result) {
            if(result.code==1){
                selt.deptLogList = result.list;
                selt.totalCountLog = result.totalCount;
                selt.pageSizeLog = result.pageSize;;
                selt.pageNoLog = result.pageNo;
            }else{
                selt.deptLogList = [];
            }

        });
    };

    this.pageChangedLog = function(perId) {
        $log.log('Page changed to: ' + this.pageNoLog);
        var paramsAtt = {
            "perId":perId,
            "pageNo":this.pageNoLog,
            "pageSize":5
        };
        $http.post("/personnel/queryDeptLog",angular.toJson(paramsAtt)).success(function (result) {
            if(result.code==1){
                selt.deptLogList = result.list;
                selt.totalCountLog = result.totalCount;
                selt.pageSizeLog = result.pageSize;;
                selt.pageNoLog = result.pageNo;
            }else{
                selt.deptLogList = [];
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

    this.openSocialStart=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.strarSocialOpened = true;
    };

    this.openSocialEnd=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.endSocialOpen = true;
    };
    this.openAccumulationStart=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.strarAccumulationOpened = true;
    };
    this.openAccumulationEnd=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.endAccumulationOpen = true;
    };

    this.openBirthdayStart=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.strarBirthdayOpened = true;
    };
    this.openBirthdayEnd=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.endBirthdayOpen = true;
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

        $http.get("/twfDict/getTwfDictForType/?type=" + "3").success(function (result) {
            if (result.success) {
                selt.twfDictList = result.object;
                if(person.rank==null){
                    for (var i = 0; i < selt.twfDictList.length; i++) {
                        if(selt.twfDictList[i].code=="初未转"){
                            selt.twfDict = selt.twfDictList[i];
                        }
                    }
                }else{
                    for (var i = 0; i < selt.twfDictList.length; i++) {
                        if (person.rank == selt.twfDictList[i].code)
                            selt.twfDict = selt.twfDictList[i];
                    }
                }

            } else {
                alert(result.message);
            }

        });

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

        $http.get("/organization/getTaTagPersonnelList?workNum="+person.workNum).success(function (result) {
            if(result.success){
                selt.tagList=result.object;
            }else{
                alert(result.message);
            }

        });

        selt.setPageLog(1,person.perId);
    };

    this.findWorkNumRepeat=function(){
        var param={workNum:selt.person.workNum};
        $http.post("/personnel/findWorkNumRepeat", angular.toJson(param)).success(function (result) {
            if(!result.success){
                selt.findworkNum=true;
                selt.message=result.message;
            }else{
                selt.findworkNum=false;
            }

        });
    }

    //附件信息
    var uploader = $scope.uploader = new FileUploader({
        url: '/fileUpload/file?type=idCard',
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
            alert(response.message);
            selt.person.idCardFile = response.object;
        }else{
            alert(response.message);
        }
    };

    var uploaderSeparation = $scope.uploaderSeparation = new FileUploader({
        url: '/fileUpload/file?type=Separation',
        headers:undefined
    });

    this.fileSeparationItem = "";
    uploaderSeparation.onAfterAddingFile = function(fileItem) {
        console.log(uploaderSeparation.queue.length);
        console.log(uploaderSeparation.queue[uploaderSeparation.queue.length-1].file.name);
        console.log(fileItem.file.name);
        selt.fileSeparationItem = fileItem;
    };

    uploaderSeparation.onSuccessItem = function(fileItem, response, status, headers) {
        if(response.success){
            alert(response.message);
            selt.person.separationFile = response.object;
        }else{
            alert(response.message);
        }
    };

    var uploaderSchool = $scope.uploaderSchool = new FileUploader({
        url: '/fileUpload/file?type=School',
        headers:undefined
    });

    this.fileSchoolItem = "";
    uploaderSchool.onAfterAddingFile = function(fileItem) {
        console.log(uploaderSchool.queue.length);
        console.log(uploaderSchool.queue[uploaderSchool.queue.length-1].file.name);
        console.log(fileItem.file.name);
        selt.fileSchoolItem = fileItem;
    };

    uploaderSchool.onSuccessItem = function(fileItem, response, status, headers) {
        if(response.success){
            alert(response.message);
            selt.person.schoolFile = response.object;
        }else{
            alert(response.message);
        }
    };

    var url = "/personnel/personnelSave";
    this.personSave=function(valid,invalid,person){
        if(selt.tag!=1&&person.perId==undefined){
            alert("请先保存基本信息!");
            return;
        }


        if(valid) {
            if (!invalid) {
                person.rank = selt.twfDict.code;
                person.sex=selt.sex;
                person.birthdayType=selt.birthdayType;
                person.reEntry=selt.reEntry;
                if (selt.twfDictgw != "" && selt.twfDictgw != null) {
                    person.position = selt.twfDictgw.code;
                }
                if (selt.twfDictxl != "" && selt.twfDictxl != null) {
                    person.education = selt.twfDictxl.code;
                }

                person.gjjDate = $filter("date")(person.gjjDate, "yyyy-MM-dd");
                person.shbDate = $filter("date")(person.shbDate, "yyyy-MM-dd");
                person.quitDate = $filter("date")(person.quitDate, "yyyy-MM-dd");
                person.regularDate = $filter("date")(person.regularDate, "yyyy-MM-dd");
                person.graduateDate = $filter("date")(person.graduateDate, "yyyy-MM-dd");
                person.birthday = $filter("date")(person.birthday, "yyyy-MM-dd");
                person.entryDate = $filter("date")(person.entryDate, "yyyy-MM-dd");
                $http.post(url, person).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                        if(url=='/personnel/personnelSave'){
                            selt.person = result.object;
                            selt.showbutton=false;
                        }
                        selt.setPage(1);
                        if (person.perId != undefined) {
                            console.log("====perId:" + person.perId);
                            selt.setPageLog(1, person.perId);
                        }
                    } else {
                        alert(result.message);
                    }

                });
            }
        }else{
            selt.submitted=true;
        }
    };

    this.deletePerson = function (perId,workNum) {
        var r=confirm("是否删除人员信息");
        if(r==true){
            if (perId == null||workNum==null) {
                window.alert("请选择表格数据");
            } else {
                var param={
                    perId:perId,
                    workNum:workNum
                }
                $http.post("/personnel/deletePerson",angular.toJson(param)).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                        selt.setPage(1);
                    }


                });
            }
        }
    };


    this.createPerson=function(){
        selt.showbutton=true;
        this.person = "";
        selt.twfDictgw="";
        selt.twfDictxl="";
        selt.findworkNum=false;
        selt.submitted=false;
        selt.deptLogList = [];
        selt.tagList = [];
        selt.sex=1;
        selt.birthdayType=2;
        selt.reEntry=0;
        $http.get("/twfDict/getTwfDictForType/?type="+"3").success(function (result) {
            if(result.success){
                selt.twfDictList=result.object;
                for (var i = 0; i < selt.twfDictList.length; i++) {
                    if(selt.twfDictList[i].code=="初未转"){
                        selt.twfDict = selt.twfDictList[i];
                    }
                }
            }else{
                alert(result.message);
            }

        });

        $http.get("/twfDict/getTwfDictForType/?type="+"6").success(function (result) {
            if(result.success){
                selt.twfDictgwList=result.object;
            }else{
                alert(result.message);
            }

        });

        $http.get("/twfDict/getTwfDictForType/?type="+"7").success(function (result) {
            if(result.success){
                selt.twfDictxlList=result.object;
            }else{
                alert(result.message);
            }

        });


    };

    //--tag切换
    this.tagclass01 = "RuActive";
    this.tagclass02 = "";
    this.tagclass03 = "";
    this.tagclass04 = "";
    this.tag = 1;
    this.selectTag = function (tag) {
        selt.tag = tag;
        if(tag==1){
            selt.tagclass01="RuActive";
            selt.tagclass02="";
            selt.tagclass03="";
            selt.tagclass04="";
            url = "/personnel/personnelSave";
        }else if(tag==2){
            selt.tagclass01="";
            selt.tagclass02="RuActive";
            selt.tagclass03="";
            selt.tagclass04="";
            url = "/personnel/personnelBasicSave";
        }else if(tag==3){
            selt.tagclass01="";
            selt.tagclass02="";
            selt.tagclass03="RuActive";
            selt.tagclass04="";
            url = "/personnel/personnelFileSave";
        }else if(tag==4){
            selt.tagclass01="";
            selt.tagclass02="";
            selt.tagclass03="";
            selt.tagclass04="RuActive";
        };

    };

    //获取部门
    this.findDeptperson = function (size) {
        var selectdeptInstance = $modal.open({
            templateUrl: 'selectdept.html',
            controller: 'selectdeptController as selectdeptctrl',
            size: size
        });

        selectdeptInstance.result.then(function (deptname) {
            selt.person.depId=deptname.id;
            selt.person.depName=deptname.label;
        });

    }

    //获取Tag
    this.addTagName = function (size) {
        var workNum=selt.person.workNum;
        if(typeof(workNum)=="undefined"){
            alert("请填写工号");
            return;
        }
        var selectdeptInstance = $modal.open({
            templateUrl: 'selectTagName.html',
            controller: 'tagController as tagctrl',
            size: size,
            resolve: {
                workNum: function () {
                    return workNum;
                }
            }
        });

        selectdeptInstance.result.then(function (tagList) {
            selt.tagList=tagList;
        });

    };

    //获取导出字段
    this.addAddressName = function (size) {
        var selectAddressInstance = $modal.open({
            templateUrl: 'selectAddressName.html',
            controller: 'AddressController as Addressctrl',
            size: size
        });

        /*selectAddressInstance.result.then(function (tagName) {
         var tagNamelist="";
         if(tagName.length>0){
         for(var i=0;i<tagName.length;i++){
         if(i+1==tagName.length){
         tagNamelist=tagNamelist+tagName[i];
         }else{
         tagNamelist=tagNamelist+tagName[i]+",";
         }

         }
         }
         this.excelPersonAddressExprot="/excel/excelPersonAddressExprot?tagName="+tagNamelist;
         });*/

    };

    //添加头像
    this.addImage = function (size) {
        var workNum=selt.person.workNum;
        if(typeof(workNum)=="undefined"){
            alert("请填写工号");
            return;
        }
        var selectdeptInstance = $modal.open({
            templateUrl: 'src/pc/personnelFile/addImage.html',
            controller: 'imageController as imageCtrl',
            size: size,
            resolve: {
                workNum: function () {
                    return workNum;
                }
            }
        });

        selectdeptInstance.result.then(function (url) {
            selt.person.picture = url;
        });

    };
    //划出层样式
    this.panelClass = "contact panel panel-default";

    this.openPanel = function () {
        selt.panelClass = "contact panel panel-default active";
    }
    this.closePanel = function () {
        selt.panelClass = "contact panel panel-default";
        selt.selectTag('1');
    }

}]);

//组织结构添加修改
app.controller('selectdeptController', ['$scope', '$modalInstance','$http', function($scope,$modalInstance,$http) {
    var finddept=this;
    var deptname;
    finddept.my_tree = {};
    finddept.success=false;
    $http.post("/organization/getDeptOrganization").success(function(data){
        finddept.success=data.success;

        finddept.my_data =data.object;
    });
    finddept.my_tree_handler = function(branch) {
        deptname={level:branch.data.level,type:branch.data.type,id:branch.data.pkid,label:branch.label,parent:branch.data.parent};
    };
    finddept.selectdept=function(){
        $modalInstance.close(deptname);
    }
    finddept.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])


//导出通讯录
app.controller('AddressController', ['$scope', '$modalInstance','$http', function($scope,$modalInstance,$http) {
    var tagAddress=this;
    tagAddress.excelPersonAddressExprot="/excel/excelPersonAddressExprot?tagName="+"workNum,dpet,szz,name,sex,phone,position,remark";
    tagAddress.selectList = ["工号","部门","所在组","姓名","性别","手机号码","岗位","备注"];
    tagAddress.selected = ["工号","部门","所在组","姓名","性别","手机号码","岗位","备注"];
    var updateSelected = function (action, id) {
        if (action == 'add' && tagAddress.selected.indexOf(id) == -1) {
            tagAddress.selected.push(id);
        }
        if (action == 'remove' && tagAddress.selected.indexOf(id) != -1) {
            var idx = tagAddress.selected.indexOf(id);
            tagAddress.selected.splice(idx, 1);
        }
        var tagNamelist="";
        if(tagAddress.selected.length>0){
            for(var i=0;i<tagAddress.selected.length;i++){
                if(i+1==tagAddress.selected.length){
                    if(tagAddress.selected[i]=="工号")tagNamelist=tagNamelist+"workNum";
                    if(tagAddress.selected[i]=="部门")tagNamelist=tagNamelist+"dpet";
                    if(tagAddress.selected[i]=="所在组")tagNamelist=tagNamelist+"szz";
                    if(tagAddress.selected[i]=="姓名")tagNamelist=tagNamelist+"name";
                    if(tagAddress.selected[i]=="性别")tagNamelist=tagNamelist+"sex";
                    if(tagAddress.selected[i]=="手机号码")tagNamelist=tagNamelist+"phone";
                    if(tagAddress.selected[i]=="岗位")tagNamelist=tagNamelist+"position";
                    if(tagAddress.selected[i]=="备注")tagNamelist=tagNamelist+"remark";
                }else{
                    if(tagAddress.selected[i]=="工号")tagNamelist=tagNamelist+"workNum"+",";
                    if(tagAddress.selected[i]=="部门")tagNamelist=tagNamelist+"dpet"+",";
                    if(tagAddress.selected[i]=="所在组")tagNamelist=tagNamelist+"szz"+",";
                    if(tagAddress.selected[i]=="姓名")tagNamelist=tagNamelist+"name"+",";
                    if(tagAddress.selected[i]=="性别")tagNamelist=tagNamelist+"sex"+",";
                    if(tagAddress.selected[i]=="手机号码")tagNamelist=tagNamelist+"phone"+",";
                    if(tagAddress.selected[i]=="岗位")tagNamelist=tagNamelist+"position"+",";
                    if(tagAddress.selected[i]=="备注")tagNamelist=tagNamelist+"remark"+",";
                }

            }
        }

        tagAddress.excelPersonAddressExprot="/excel/excelPersonAddressExprot?tagName="+tagNamelist;
    }

    this.updateSelection = function ($event, id) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    }
    /*    if (this.selected.length == 0) {
     if (location.workingDay != null) {
     this.selected = location.workingDay.split(",");
     }
     }*/

    this.isSelected = function (id) {
        return this.selected.indexOf(id) != -1;

    }

    tagAddress.save=function(){
        $modalInstance.close();
    }
    tagAddress.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])


//标签添加和删除
app.controller('tagController', ['$scope', '$modalInstance','$http','workNum', function($scope,$modalInstance,$http,workNum) {
    var tag=this;

    $http.get("/twfDict/getTwfDictForType/?type="+"1").success(function (result) {
        if(result.success){
            var tagnameList1=[];
            for(var i=0;i<result.object.length;i++){
                var tagname1={tagName:result.object[i].name,tagId:result.object[i].code,workNum:workNum};
                tagnameList1.push(tagname1)
            }
            tag.tagNameList=tagnameList1;
        }else{
            alert(result.message);
        }

    });

    $http.get("/tag/getTaTagPersonnelList?workNum="+workNum).success(function (result) {
        if(result.success){
            if(tag.selected.length==0){
                if(result.object!=null) {
                    var tagnameList2=[];
                    for(var i=0;i<result.object.length;i++){
                        var tagname2={tagName:result.object[i].tagName,tagId:result.object[i].tagId,workNum:workNum};
                        tagnameList2.push(tagname2)
                    }
                    tag.selected = tagnameList2;
                }
            }
        }else{
            alert(result.message);
        }

    });

    tag.selected = [];
    var updateSelected = function (action, id) {
        var update=[];
        for(var i=0;i<tag.selected.length;i++){
            update.push(tag.selected[i].tagName)
        }
        if (action == 'add' && update.indexOf(id.tagName)==-1) {
            tag.selected.push(id);
        }
        if (action == 'remove' && update.indexOf(id.tagName) != -1) {
            var idx = update.indexOf(id.tagName);
            tag.selected.splice(idx, 1);
        }
    }

    tag.updateSelection = function ($event, id) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, id);
    }

    tag.isSelected = function (id) {
        for(var i=0;i<tag.selected.length;i++){
            if(tag.selected[i].tagName==id.tagName){
                return true;
            }
        }
    }




    tag.savetag=function(){
        if(tag.selected.length==0){
            var tagname3={workNum:workNum};
            tag.selected.push(tagname3);
        }
        $http.post("/tag/saveTaTagPersonnel",angular.toJson(tag.selected)).success(function (result) {
            if(result.success){
                tag.selecttag=tag.selected;
                tag.selected=[];
                $modalInstance.close(tag.selecttag);
            }else{
                alert(result.message);
            }
        });

    }
    tag.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])

//添加头像
app.controller('imageController', ['$scope', '$modalInstance','$http','FileUploader','workNum', function($scope,$modalInstance,$http,FileUploader,workNum) {

    var image = this;
    $scope.myImage='';
    $scope.myCroppedImage='';

    $scope.handleFileSelect=function(evt) {
        var file=evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function($scope){
                $scope.myImage=evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };

    function getBlobBydataURL(dataURI,type){
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type:type });
    }



    this.uploadImage = function () {
        var $Blob = getBlobBydataURL($scope.myCroppedImage,"image/png");
        var formData = new FormData();
        formData.append("file", $Blob);
        formData.append("workNum", "10022");

        $http.post('/fileUpload/image', formData, {
            transformRequest: function (data, headersGetterFunction) {
                return data;
            },
            headers: {'Content-Type': undefined}
        }).success(function (result) {
            if(result.success){
                alert(result.message);
                $modalInstance.close(result.object);
            }else{
                alert(result.message);
            }
        });


    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };






}])