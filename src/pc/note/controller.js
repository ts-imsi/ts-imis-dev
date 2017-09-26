app.controller('Note', ['$scope', '$modal', '$http', '$log', function ($scope, $modal, $http, $log) {
    var selt = this;
    selt.showbutton=true;
    selt.submitted=false;
    selt.httptimeReg="^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$";
    selt.nameReg="^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,40}$";
    selt.szReg="^[0-9]*$";
    var address = "长沙市高新区麓云路100号兴工国际产业园5栋6楼";
    this.baidumapurl = "/baidumap/getAddressBaiduMapView/?address=" + address;

    $http.get("/twfDict/getTwfDictForType/?type=" + "1").success(function (result) {
        if (result.success) {
            selt.twfDictList = result.object;
        } else {
            alert(result.message);
        }

    });
    this.createlocation=function(){
        selt.showbutton=true;
        selt.selected=['周一','周二','周三','周四','周五'];
        selt.signinTime="08:45:00";
        selt.signoutTime="17:45:00";
        this.location="";
        selt.twfDict="";
    }

    /*this.showdivxz=function(){
        // document.getElementById("activeid").click();
        document.querySelector('#activeid').click();
    }*/

    this.setPage = function (pageNo) {
        $http.get("/location/getLocationList/?pageNo=" + pageNo + "&pageSize=5").success(function (result) {
            selt.locationList = result.list;
            selt.totalCount = result.totalCount;
            selt.pageSize = result.pageSize;
            selt.pageNo = result.pageNo;
        });
    };

    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        $http.get("/location/getLocationList/?pageNo=" + this.pageNo + "&pageSize=5").success(function (result) {
            selt.locationList = result.list;
            selt.totalCount = result.totalCount;
            selt.pageSize = result.pageSize;
            selt.pageNo = result.pageNo;
        });

    };

    this.maxSize = 5;
    this.setPage(1);
    this.updateClickLocation = function (ls) {
        ls.readonly = false;
    }




    this.weekList = ['周一','周二','周三','周四','周五','周六','周日'];
    selt.selected = [];
    var updateSelected = function (action, id) {
        if (action == 'add' && selt.selected.indexOf(id) == -1) {
            selt.selected.push(id);
        }
        if (action == 'remove' && selt.selected.indexOf(id) != -1) {
            var idx = selt.selected.indexOf(id);
            selt.selected.splice(idx, 1);
        }
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

    this.deleteLocation = function (pkid) {
        var r=confirm("是否删除考勤设置");
        if(r==true) {
            if (pkid == null) {
                window.alert("请选择表格数据");
            } else {
                $http.post("/location/locationDeleteForid/?pkid=" + pkid).success(function (result) {
                    if (result.success) {
                        window.alert(result.message);
                    } else {
                        window.alert(result.message);
                    }

                    selt.setPage(1);
                });
            }
        }
    }


    this.LocationSave=function(invalid,valid,location){
        if (valid) {
            if (!invalid) {
                var b = this.selected.join(",");
                if (this.twfDict != "" && this.twfDict != null) {
                    location.tagName = this.twfDict.name;
                    location.tagId = this.twfDict.code;
                }
                location.workingDay = b;
                location.signinTime=selt.signinTime;
                location.signoutTime=selt.signoutTime;
                $http.post("/location/locationSave", location).success(function (result) {
                    if (result.success) {
                        selt.location=result.object;
                        selt.showbutton=false;
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

    //新建考勤地点，收缩按钮
    this.showBaiduMapAddress=function(){
        this.baidumapurl="/baidumap/getAddressBaiduMapView/?address="+this.location.address;
    }

    this.updateLocationView = function (location) {
        this.location=location;
        selt.signoutTime=location.signoutTime;
        selt.signinTime=location.signinTime;
        selt.showbutton=false;
        if(selt.selected.length==0){
            if(location.workingDay!=null) {
                selt.selected = location.workingDay.split(",");
            }
        }

        this.baidumapurl="/baidumap/getAddressBaiduMapView/?address="+address;

        $http.get("/twfDict/getTwfDictForType/?type="+"1").success(function (result) {
            if(result.success){
                selt.twfDictList=result.object;
                for(var i=0;i<selt.twfDictList.length;i++){
                    if(location.tagId==selt.twfDictList[i].code)
                        selt.twfDict=selt.twfDictList[i];
                }

            }else{
                alert(result.message);
            }

        });
    };

    //获取部门
    this.findDeptperson = function (size) {
        var selectdeptInstance = $modal.open({
            templateUrl: 'selectdept.html',
            controller: 'selectdeptController as selectdeptctrl',
            size: size
        });

        selectdeptInstance.result.then(function (deptname) {
            selt.location.depId=deptname.id;
            selt.location.depName=deptname.label;
        });

    };

    this.panelClass = "contact panel panel-default";

    this.openPanel = function () {
        selt.panelClass = "contact panel panel-default active";
    };
    this.closePanel = function () {
        selt.panelClass = "contact panel panel-default";
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
