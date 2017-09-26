/**
 * Created by sakfi on 2017/6/16.
 */
(function() {
    angular
        .module('WEBAPP.LACATION.CONTROLLER', ['ui.bootstrap','ngMessages'])
        .controller('LocationCtrl', ['$http','$uibModal','$log','$document','$compile',function($http,$uibModal, $log, $document,$compile) {
            var selt = this;
            var paramsPage = {
                pageNo:1,
                pageSize:15
            };

            this.setPage = function (pageNo) {
                $http.get("/location/getLocationList/?pageNo="+pageNo+"&pageSize=3",angular.toJson(paramsPage)).success(function (result) {
                    selt.locationList = result.list;
                    selt.totalCount = result.totalCount;
                    selt.pageSize = result.pageSize;
                    selt.pageNo = result.pageNo;
                });
            };

            this.pageChanged = function() {
                $log.log('Page changed to: ' + this.pageNo);
                $http.get("/location/getLocationList/?pageNo="+this.pageNo+"&pageSize=3",angular.toJson(paramsPage)).success(function (result) {
                    selt.locationList = result.list;
                    selt.totalCount = result.totalCount;
                    selt.pageSize = result.pageSize;
                    selt.pageNo = result.pageNo;
                });

            };

            this.maxSize = 5;
            this.setPage(1);
            this.updateClickLocation=function(ls){
                ls.readonly=false;
            }


            this.updateLocation=function(index,location){
               // window.alert(index);
                window.alert(location.pkid);


                $http.post("/location/locationUpdateForid",{"pkid":location.pkid,"range":location.range}).success(function (result) {
                    if (result.success) {
                        window.alert(result.message);
                    } else {
                        window.alert(result.message);
                    }
                    index.edit=false;
                    //window.location.reload();
                });

            }

            this.animationsEnabled = true;

            this.updateLocationView = function (location,size, parentSelector) {
                var parentElem = parentSelector ?
                    angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                var updateLoctionViewlInstance = $uibModal.open({
                    animation: selt.animationsEnabled,
                    ariaLabelledBy: 'update-title',
                    ariaDescribedBy: 'update-body',
                    templateUrl: 'updateLocationView.html',
                    controller: 'updateLoctionViewlInstanceCtrl',
                    controllerAs: '$ctrl',
                    size: size,
                    appendTo: parentElem,
                    resolve: {
                        location: function () {
                            return location;
                        }
                    }
                });

            };

            this.showLocationView = function (size, parentSelector) {
                var parentElem = parentSelector ?
                    angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                var LoctionViewlInstance = $uibModal.open({
                    animation: selt.animationsEnabled,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'ShowLocationView.html',
                    controller: 'LoctionViewlInstanceCtrl',
                    controllerAs: '$ctrl',
                    size: size,
                    appendTo: parentElem
                });

            };



            this.deleteLocation=function(pkid){
                if(pkid==null){
                    window.alert("请选择表格数据");
                }else{
                    $http.post("/location/locationDeleteForid/?pkid="+pkid).success(function (result) {
                        if (result.success) {
                            window.alert(result.message);
                        } else {
                            window.alert(result.message);
                        }

                        window.location.reload();
                    });
                }
            }


            this.toggleAnimation = function () {
                this.animationsEnabled = !this.animationsEnabled;
            };


        }]);

    angular.module('WEBAPP.LACATION.CONTROLLER').controller('LoctionViewlInstanceCtrl', function ($uibModalInstance,$http) {
        var $ctrl = this;
        var address="长沙市高新区麓云路100号兴工国际产业园5栋6楼";
        $ctrl.weekList=['一','二','三','四','五','六','七'];
        $ctrl.selected=[];
        var updateSelected = function(action,id){
            if(action == 'add' && $ctrl.selected.indexOf(id) == -1){
                $ctrl.selected.push(id);
            }
            if(action == 'remove' && $ctrl.selected.indexOf(id)!=-1){
                var idx = $ctrl.selected.indexOf(id);
                $ctrl.selected.splice(idx,1);
            }
        }

        $ctrl.updateSelection = function($event, id){
            var checkbox = $event.target;
            var action = (checkbox.checked?'add':'remove');
            updateSelected(action,id);
        }

        $ctrl.isSelected = function(id){
            return $ctrl.selected.indexOf(id)>=0;
        }

        $ctrl.baidumapurl="/baidumap/getAddressBaiduMapView/?address="+address;

        $http.get("/twfDict/getTwfDictForType/?type="+"1").success(function (result) {
            if(result.success){
                $ctrl.twfDictList=result.object;
            }else{
                alert(result.message);
            }

        });

        $ctrl.LocationSave = function (isValid,tbAttenceLocation) {
            var b = $ctrl.selected.join(",");
            if(isValid){
                tbAttenceLocation.tagName=$ctrl.twfDict.name;
                tbAttenceLocation.tagId=$ctrl.twfDict.code;
                tbAttenceLocation.workingDay=b;
                $http.post("/location/locationSave", tbAttenceLocation).success(function (result) {
                    if (result.success) {
                        window.alert(result.message);
                    } else {
                        window.alert(result.message);
                    }
                    $uibModalInstance.close();
                    window.location.reload();
                });


            }
        };

        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');


        };

        //新建考勤地点，收缩按钮
        $ctrl.showBaiduMapAddress=function(){
            $ctrl.baidumapurl="/baidumap/getAddressBaiduMapView/?address="+this.tbAttenceLocation.address;
        }



    });

    angular.module('WEBAPP.LACATION.CONTROLLER').controller('updateLoctionViewlInstanceCtrl', function ($uibModalInstance,$http,location) {
        var $ctrl = this;

        $ctrl.weekList=['一','二','三','四','五','六','七'];
        $ctrl.location=location;
        var address=location.address;
        $ctrl.selected=[];
        var updateSelected = function(action,id){
            if(action == 'add' && $ctrl.selected.indexOf(id) == -1){
                $ctrl.selected.push(id);
            }
            if(action == 'remove' && $ctrl.selected.indexOf(id)!=-1){
                var idx = $ctrl.selected.indexOf(id);
                $ctrl.selected.splice(idx,1);
            }
        }

        $ctrl.updateSelection = function($event, id){
            var checkbox = $event.target;
            var action = (checkbox.checked?'add':'remove');
            updateSelected(action,id);
        }
        if($ctrl.selected.length==0){
            if(location.workingDay!=null) {
                $ctrl.selected = location.workingDay.split(",");
            }
        }

        $ctrl.isSelected = function(id){
            return $ctrl.selected.indexOf(id)!=-1;

        }

        $ctrl.baidumapurl="/baidumap/getAddressBaiduMapView/?address="+address;

        $http.get("/twfDict/getTwfDictForType/?type="+"1").success(function (result) {
            if(result.success){
                $ctrl.twfDictList=result.object;
                for(var i=0;i<$ctrl.twfDictList.length;i++){
                    if(location.tagId==$ctrl.twfDictList[i].code)
                        $ctrl.twfDict=$ctrl.twfDictList[i];
                }

            }else{
                alert(result.message);
            }

        });

        $ctrl.updateLocation = function (isValid,location) {
            var b = $ctrl.selected.join(",");
            if(isValid){
                location.tagName=$ctrl.twfDict.name;
                location.tagId=$ctrl.twfDict.code;
                location.workingDay=b;
                $http.post("/location/locationUpdateForid", location).success(function (result) {
                    if (result.success) {
                        window.alert(result.message);
                    } else {
                        window.alert(result.message);
                    }
                    $uibModalInstance.close();
                    window.location.reload();
                });


            }
        };

        $ctrl.cancel = function () {
            $uibModalInstance.dismiss('cancel');


        };

        //新建考勤地点，收缩按钮
        $ctrl.showBaiduMapAddress=function(){
            $ctrl.baidumapurl="/baidumap/getAddressBaiduMapView/?address="+this.tbAttenceLocation.address;
        }



    });

})();
