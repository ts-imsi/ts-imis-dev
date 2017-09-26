app.controller('Organization', ['$scope', '$modal', '$http','$state', function ($scope, $modal, $http,$state) {
    var selt=this;
    this.my_tree = {};
    selt.success=false;
    $http.post("/organization/getOrganization").success(function(data){
        selt.success=data.success;

        selt.my_data =data.object;
        selt.inittree="内控";
    });
    this.my_tree_handler = function(branch) {


        if(branch.data!=null){
            if(branch.data.type=="dept"&&branch.data.level==0){
                $state.go('app.organization.dept',{level:branch.data.level,type:branch.data.type,id:branch.data.pkid,label:branch.label});
            }else if(branch.data.type=="dept"&&branch.data.level!=0){
                $state.go('app.organization.person',{level:branch.data.level,type:branch.data.type,id:branch.data.pkid,label:branch.label});
            }else if(branch.data.type=="person"&&branch.data.level!=0){
                $state.go('app.organization.person',{level:branch.data.level,type:branch.data.type,id:branch.data.parent,label:branch.label});
            }
        }


    };

    $scope.$on('success', function(e, mesg) {
        if(mesg.success){
            $http.post("/organization/getOrganization").success(function(data){

                selt.my_data =data.object;
                selt.inittree=mesg.name;

            });
        }
    });

}]);

app.controller('DeptControllser', ['$scope', '$modal', '$http','$state','$stateParams', function ($scope, $modal, $http,$state,$stateParams) {
    var seltdept=this;
    seltdept.showbutton=true;
    var level=$stateParams.level;
    var type=$stateParams.type;
    var id=$stateParams.id;
    var label=$stateParams.label;
    seltdept.submitted=false;
    this.setPage = function (pageNo) {
        var param={
            pageNo: pageNo,
            pageSize:5,
            id:id
        }

        $http.post("/organization/getOrganizationDept", angular.toJson(param)).success(function (result) {
            if (result.code == "1") {
                seltdept.deptlist = result.list;
                seltdept.totalCount = result.totalCount;
                seltdept.pageSize = result.pageSize;
                seltdept.pageNo = result.pageNo;
            } else {
                seltdept.deptlist = [];
            }
        });
    };

    this.pageChanged = function () {
        var param={
            pageNo: this.pageNo,
            pageSize: 5,
            id:id
        }
        $http.post("/organization/getOrganizationDept", angular.toJson(param)).success(function (result) {
            if (result.code == "1") {
                seltdept.deptlist = result.list;
                seltdept.totalCount = result.totalCount;
                seltdept.pageSize = result.pageSize;
                seltdept.pageNo = result.pageNo;
            } else {
                seltdept.deptlist = [];
            }
        });

    };
    this.maxSize=5;
    this.setPage(1);

    this.findDeptidRepeat=function(){
        var param={deptid:seltdept.pkid};
        $http.post("/organization/findDeptidRepeat", angular.toJson(param)).success(function (result) {
            if(!result.success){
                seltdept.findpkid=true;
                seltdept.message=result.message;
            }else{
                seltdept.findpkid=false;
            }
        });
    }

    this.updateDeptView=function(dept){
        seltdept.showbutton=false;
        seltdept.findpkid=false;
        seltdept.pkid=dept.depId;
        seltdept.deptname=dept.depName;
        seltdept.per_deptid=dept.parentDepId;
        seltdept.per_deptname=dept.parentDepName;
        seltdept.remark=dept.remark;
    }

    this.saveDept=function(valid){
        if (valid) {
            var param = {
                pkid: seltdept.pkid,
                deptname: seltdept.deptname,
                per_deptid: seltdept.per_deptid,
                per_deptname: seltdept.per_deptname,
                per_level: level,
                level: level + 1,
                type: type,
                remark: seltdept.remark
            }
            $http.post("/organization/saveDept", angular.toJson(param)).success(function (result) {
                if (result.success) {
                    alert(result.message);
                    var names = {
                        success: true,
                        name: seltdept.deptname
                    }
                    $scope.$emit("success", names);
                    seltdept.setPage(1);
                } else {
                    alert(result.message);
                }

            });
        }else{
            seltdept.submitted=true;
        }
    };

    seltdept.showcontroll=function(){
        seltdept.showbutton=true;
        seltdept.pkid="";
        seltdept.deptname="";
        seltdept.per_deptid=id;
        seltdept.per_deptname=label;
        seltdept.remark="";
    };



    seltdept.findDept = function (size) {
        var selectdeptInstance = $modal.open({
            templateUrl: 'selectdept.html',
            controller: 'selectdeptController as selectdeptctrl',
            size: size
        });

        selectdeptInstance.result.then(function (deptname) {
            seltdept.per_deptname=deptname.label;
            seltdept.per_deptid=deptname.id;
            level = deptname.level;
        });

    };

    this.panelClass = "contact panel panel-default";

    this.openPanel = function () {
        seltdept.panelClass = "contact panel panel-default active";
    };
    this.closePanel = function () {
        seltdept.panelClass = "contact panel panel-default";
    };

}]);


app.controller('personController', ['$scope', '$modal', '$http','$state','$stateParams', function ($scope, $modal, $http,$state,$stateParams) {
    var seltperson=this;

    var id=$stateParams.id;
    var level=0; //初始值
    this.zt="启用";
    seltperson.myZhuant=false;
    this.toggZhuant=function(){
        seltperson.myZhuant=true;
    }

    this.changeYue = function (zt) {
        seltperson.zt = zt;
        seltperson.myZhuant = false;
    };

    //下面的值都没用
    /*var level=$stateParams.level-1; //在人员列表中添加部门,基本随人员上级部门
    var type='dept';   //人员列表中添加部门,类型可以写死
    var label=$stateParams.label; //这个是人员名字*/

    seltperson.findpkid=false;
    seltperson.submitted=false;
    seltperson.showcontrollPer=function(){
        seltperson.showSubmit=false;
        seltperson.showbutton=true;
        seltperson.pkid="";
        seltperson.deptname="";
        seltperson.per_deptid="";
        seltperson.per_deptname="";
        seltperson.remark="";
    }

    seltperson.udpateControllPer=function(){
        seltperson.showSubmit=true;
        seltperson.pkid=$stateParams.id;
        seltperson.deptname=$stateParams.label;

        $http.get("/organization/getSuperiorDepid?pkid="+$stateParams.id).success(function (result) {
            if(result.success){
                seltperson.per_deptid=result.object.parentDepId;
                seltperson.per_deptname=result.object.parentDepName;
                seltperson.remark = result.object.remark;
            }else{
                alert(result.message);
            }

        });


        seltperson.remark="";
    }

    this.setPage = function (pageNo) {
        var param={
            pageNo: pageNo,
            pageSize:5,
            id:id
        }

        $http.post("/organization/getOrganizationDeptPerson", angular.toJson(param)).success(function (result) {
            if (result.code == "1") {
                seltperson.deptpersonlist = result.list;
                seltperson.totalCount = result.totalCount;
                seltperson.pageSize = result.pageSize;
                seltperson.pageNo = result.pageNo;
            } else {
                seltperson.deptpersonlist = [];
            }
        });
    };


    seltperson.per_deptname="";
    seltperson.per_deptid="";
    this.findDeptidRepeat=function(){
        var param={deptid:seltperson.pkid};
        $http.post("/organization/findDeptidRepeat", angular.toJson(param)).success(function (result) {
            if(!result.success){
                seltperson.findpkid=true;
                seltperson.message=result.message;
            }else{
                seltperson.findpkid=false;
            }
        });
    }
    this.saveDept=function(valid){
        if (valid) {
            var param = {
                pkid: seltperson.pkid,
                deptname: seltperson.deptname,
                per_deptid: seltperson.per_deptid,
                per_deptname: seltperson.per_deptname,
                per_level: level,
                level: parseInt(level) + 1,
                type: "dept",
                remark: seltperson.remark
            }
            if(!seltperson.showSubmit){
                $http.post("/organization/saveDept", angular.toJson(param)).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                        var names = {
                            success: true,
                            name: seltperson.deptname
                        }
                        $scope.$emit("success", names);
                    } else {
                        alert(result.message);
                    }

                });
            }else{
                $http.post("/organization/updateDept", angular.toJson(param)).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                        var names = {
                            success: true,
                            name: seltperson.deptname
                        }
                        $scope.$emit("success", names);
                    } else {
                        alert(result.message);
                    }

                });
            }

        } else {
            seltperson.submitted = true;
        }

    }


    seltperson.deleteDept=function(size){

       /* $http.get("/organization/getSuperiorDepid?pkid="+$stateParams.id).success(function (result) {
            if(result.success){
                seltperson.per_deptid=result.object.pkid;
                seltperson.per_deptname=result.object.name;
            }else{
                alert(result.message);
            }

        });*/
        var param = {
            pkid:$stateParams.id,
            deptname:$stateParams.label,
            type: "dept"
        }
        var confrimInstance = $modal.open({
            templateUrl: 'deleteConfirm.html',
            controller: 'deleteConfirmController as confirmctrl',
            size: size
        });
        confrimInstance.result.then(function (conf) {
            $http.post("/organization/deleteDept", angular.toJson(param)).success(function (result) {
                if (result.success) {
                    alert(result.message);
                    var names = {
                        success: true,
                        name: seltperson.deptname
                    }
                    $scope.$emit("success", names);
                } else {
                    alert(result.message);
                }

            });
         });
    }

    this.pageChanged = function () {
        var param={
            pageNo: this.pageNo,
            pageSize: 5,
            id:id
        }
        $http.post("/organization/getOrganizationDeptPerson", angular.toJson(param)).success(function (result) {
            if (result.code == "1") {
                seltperson.deptpersonlist = result.list;
                seltperson.totalCount = result.totalCount;
                seltperson.pageSize = result.pageSize;
                seltperson.pageNo = result.pageNo;
            } else {
                seltperson.deptpersonlist = [];
            }
        });

    };
    this.maxSize=5;
    this.setPage(1);



    seltperson.findDept = function (size) {
        var selectdeptInstance = $modal.open({
            templateUrl: 'selectdept.html',
            controller: 'selectdeptController as selectdeptctrl',
            size: size
        });

        selectdeptInstance.result.then(function (deptname) {
            seltperson.per_deptname=deptname.label;
            seltperson.per_deptid=deptname.id;
            level = deptname.level;
        });

    }

    seltperson.class=['name','namels'];
    this.updateDeptPersonView=function(personnel){
        seltperson.tppersonnel=personnel;
        seltperson.tppersonnel.level=level;
        $http.get("/organization/getTaTagPersonnelList?workNum="+personnel.workNum).success(function (result) {
            if(result.success){
                seltperson.tppersonnel.tagList=result.object;
            }else{
                alert(result.message);
            }

        });
        var param={
            perId:personnel.perId,
            workNum:personnel.workNum
        }
        $http.post("/organization/selectByperId", angular.toJson(param)).success(function (result) {
            if(result.success){
                seltperson.Tname=result.object.name;
                seltperson.Tpassword=result.object.password;
                seltperson.Tpkid=result.object.pkid;
                if(result.object.status==1){
                    seltperson.zt="启用";
                }else{
                    seltperson.zt="禁用";
                }
            }else{
                seltperson.Tname="";
                seltperson.Tpassword="";
                seltperson.Tpkid="";
                seltperson.zt="启用";
                alert(result.message);
            }

        });
    }
    this.updateTuser=function(){
        var status;
        if(seltperson.zt=="启用"){
            status=1;
        }else{
            status=0;
        }
        var param={
            password:seltperson.Tpassword,
            name:seltperson.Tname,
            displayName:seltperson.tppersonnel.name,
            status:status,
            pkid:seltperson.Tpkid
        };
        $http.post("/organization/saveTuser", angular.toJson(param)).success(function (result) {
            if(result.success){
                alert(result.message);
            }else{
                alert(result.message);
            }

        });
    }
    //获取部门
    seltperson.findDeptperson = function (size) {
        var selectdeptInstance = $modal.open({
            templateUrl: 'selectdept.html',
            controller: 'selectdeptController as selectdeptctrl',
            size: size
        });

        selectdeptInstance.result.then(function (deptname) {
            seltperson.tppersonnel.depId=deptname.id;
            seltperson.tppersonnel.depName=deptname.label;
            seltperson.tppersonnel.deplevel=deptname.level;
            seltperson.tppersonnel.parent=deptname.parent;
        });

    };

    //选择岗位
    this.findposition=function(){

    };




    this.panelClass = "contact panel panel-default";

    this.openPanel = function () {
        seltperson.panelClass = "contact panel panel-default active";
    };
    this.closePanel = function () {
        seltperson.panelClass = "contact panel panel-default";
    };

    this.panelClass2 = "person panel panel-default";

    this.openPanel2 = function () {
        seltperson.panelClass2 = "person panel panel-default active";
    };
    this.closePanel2 = function () {
        seltperson.panelClass2 = "person panel panel-default";
    };

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


//标签添加和删除
app.controller('deleteConfirmController', ['$scope', '$modalInstance','$http', function($scope,$modalInstance,$http) {
    var conf=this;
    conf.ok=function(){
        var success=true;
       $modalInstance.close(success);

    }
    conf.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])