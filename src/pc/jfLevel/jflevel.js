/**
 * Created by yyw on 2016/10/9.
 */
app.controller('JfLevelCtrl', ['$scope','HttpService','$filter','CommonService','$modal','ModalService','$timeout',
    function($scope,HttpService,$filter,CommonService,$modal,ModalService,$timeout) {

        /********
         * 属性开始
         * ********/
        $scope.employeeItems = {};
        $scope.employeeItem = {
            em_id:"",
        };
        $scope.employeeSearchItem = {
            em_c_id:"",
            em_d_id:"",
            em_name:""
        };

        $scope.jfItems = {};
        $scope.jfInputItem = {};
        $scope.jfSearchItem = {
            start:"",
            end:""
        };

        $scope.companyList = {};//公司列表
        $scope.deptList={};//部门列表
        $scope.levelList={};//级别列表

        GetCompany();
        GetDept();
        GetLevel();
        $scope.showPLAddJF = function(){
            var isHasCheceks = false;
            angular.forEach($scope.employeeItems, function(item) {
                if(item.check == true){
                    isHasCheceks = true;
                }
            });
            if(isHasCheceks){
                $modal.open({
                    templateUrl: '../bul/jflevel/jflevel-info.html',
                    controller:'PLAddJFInfoCtrl',
                    resolve: {
                        jfModel: function () {
                            return {
                                employeeItems:$scope.employeeItems,
                                getJF:GetJF,
                                getDataList:GetDataList
                            };
                        }
                    }
                });
            }
        }

        $scope.selectAll = function(){
            angular.forEach($scope.employeeItems, function(item) {
                item.check = $scope.checkAll;
            });
        }

        $scope.showInfo = function(type,item){
            if($scope.employeeItem.em_id==null||$scope.employeeItem.em_id==""||$scope.employeeItem.em_id==undefined){
                return;
            }
            if(type=="edit"||type=="info"){
                $scope.jfInputItem =item;
            }
            else if(type=="add"){
                $scope.jfInputItem.jfr_em_id = $scope.employeeItem.em_id;
            }

            $modal.open({
                templateUrl: '../bul/jflevel/jflevel-info.html',
                controller:'AddJFInfoCtrl',
                resolve: {
                    jfModel: function () {
                        return {
                            jfInputItem:$scope.jfInputItem,
                            getJF:GetJF,
                            getDataList:GetDataList,
                            type:type
                        };
                    }
                }
            });
        }

        $scope.showLevelSelect = function(){
            if($scope.employeeItem.em_id==null||$scope.employeeItem.em_id==""||$scope.employeeItem.em_id==undefined){
                return;
            }
            $modal.open({
                templateUrl: '../bul/jflevel/level-select.html',
                controller:'LevelSelectCtrl',
                size:'sm',
                resolve: {
                    jfModel: function () {
                        return {
                            getDataList:GetDataList,
                            levelList:$scope.levelList,
                            em_id:$scope.employeeItem.em_id
                        };
                    }
                }
            });
        }

        $scope.search = function(){
            GetDataList();
        }

        $scope.selectEmployee = function(item){
            angular.forEach($scope.employeeItems, function(item) {
                item.selected = false;
                item.selectedStyle = {};
            });
            $scope.employeeItem = item;
            $scope.employeeItem.selected = true;
            $scope.employeeItem.selectedStyle = {
                'background-color':'#edf1f2'
            };
            GetJF();
        }

        $scope.searchJF = function(){
            GetJF();
        }

        $scope.open = function($event,id) {
            $event.preventDefault();
            $event.stopPropagation();
            if(id == "sInput"){
                $scope.sInputOpend = true;
            }
            else if (id == "eInput"){
                $scope.eInputOpend = true;
            }
        };

        $scope.deleteJF = function(item){
            var options = {
                msg:"确认是否删除？",
                title:"删除提示",
                btnOkTxt:"删除",
                btnOkColor:"btn-danger",
                submitOK:function(){
                    DeleteJF(item)
                },
                submitCancel:function(){

                }
            }
            ModalService.Confirm(options);
        }

        /************
         * 私有方法
         * *************/
        function GetCompany(){
            HttpService.Http("Company/getCompany",
                {})
                .success(function(data){
                    var data = angular.fromJson(data);
                    if(data.Code=="Success"){
                        $scope.companyList = data.List;
                    }
                    else{
                        var options = {
                            msg:data.Msg,
                            title:"提示"
                        }
                        ModalService.Alert(options);
                    }
                })
                .error(function(data) {
                } );
        }

        function GetDept(){
            HttpService.Http("Dept/getDepartment",
                {})
                .success(function(data){
                    var data = angular.fromJson(data);
                    if(data.Code=="Success"){
                        $scope.deptList = data.List;
                    }
                    else{
                        var options = {
                            msg:data.Msg,
                            title:"提示"
                        }
                        ModalService.Alert(options);
                    }
                })
                .error(function(data) {
                } );
        }

        function GetDataList(){
            HttpService.Http("Employee/GetEmployee",
                {
                    company:$scope.employeeSearchItem.em_c_id,
                    dept:$scope.employeeSearchItem.em_d_id,
                    name:$scope.employeeSearchItem.em_name,
                    status:'',
                    jjstatus:''
                })
                .success(function(data){
                    var data = angular.fromJson(data);
                    if(data.Code=="Success"){
                        $scope.employeeItems = data.List;
                        if($scope.employeeItem != undefined){
                            var temllist = $filter('filter')($scope.employeeItems, {em_id:$scope.employeeItem.em_id},true);
                            if(temllist!=null&&temllist!=undefined&&temllist!=""){
                                $scope.employeeItem = temllist[0];
                            }
                            else{
                                $scope.employeeItem = $scope.employeeItems[0];
                            }
                        }
                        else{
                            $scope.employeeItem = $scope.employeeItems[0];
                        }

                        if($scope.employeeItem!=undefined){
                            $scope.employeeItem.selected = true;
                            $scope.employeeItem.selectedStyle = {
                                'background-color':'#edf1f2'
                            };
                        }
                        GetJF();
                    }
                    else{
                        var options = {
                            msg:data.Msg,
                            title:"提示"
                        }
                        ModalService.Alert(options);
                    }
                })
                .error(function(data) {
                } );
        }

        function GetLevel(){
            HttpService.Http("Level/getLevel",
                {
                    levelID:""
                })
                .success(function(data){
                    var data = angular.fromJson(data);
                    if(data.Code=="Success"){
                        $scope.levelList = data.List;
                    }
                    else{
                        var options = {
                            msg:data.Msg,
                            title:"提示"
                        }
                        ModalService.Alert(options);
                    }
                })
                .error(function(data) {
                } );
        }

        function GetJF(){
            HttpService.Http("JFRecord/GetJFRecord",
                {
                    start:$scope.jfSearchItem.start,
                    end:$scope.jfSearchItem.end,
                    emid:$scope.employeeItem==undefined?"":$scope.employeeItem.em_id,
                })
                .success(function(data){
                    var data = angular.fromJson(data);
                    if(data.Code=="Success"){
                        $scope.jfItems = data.List;
                        $timeout(function(){
                            $('.table').trigger('footable_redraw');
                        }, 100);
                    }
                    else{
                        var options = {
                            msg:data.Msg,
                            title:"提示"
                        }
                        ModalService.Alert(options);
                    }
                })
                .error(function(data) {
                } );
        }

        function DeleteJF(item){
            HttpService.Http("JFRecord/DeleteJFRecord",
                {
                    id:item.jfr_id,
                    emid:item.jfr_em_id,
                })
                .success(function(data){
                    var data = angular.fromJson(data);
                    var options = {
                        msg:data.Msg,
                        title:"提示"
                    }
                    ModalService.Alert(options);
                    GetDataList();
                })
                .error(function(data) {

                } );
        }
    }]);

app.controller('AddJFInfoCtrl', ['$scope', '$modalInstance','jfModel','CommonService','HttpService','ModalService',
    function($scope, $modalInstance,jfModel,CommonService,HttpService,ModalService) {
        $scope.jfInputItem = {
            jfr_id:"",
            jfr_em_id:"",
            jfr_score:"",
            jfr_remark:""
        }

        $scope.type = jfModel.type;
        angular.extend($scope.jfInputItem,jfModel.jfInputItem);


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.addInfo = function(){
            if($scope.jfInputItem.jfr_score==""){
                return;
            }
            if($scope.type=="edit"){
                UpdateJF();
            }
            else if($scope.type=="add"){
                AddJF();
            }
        }

        function AddJF(){
            HttpService.Http("JFRecord/AddJFRecord",
                {
                    jfr_em_id:$scope.jfInputItem.jfr_em_id,
                    jfr_score:$scope.jfInputItem.jfr_score,
                    jfr_remark:$scope.jfInputItem.jfr_remark,
                })
                .success(function(data){
                    var data = angular.fromJson(data);
                    var options = {
                        msg:data.Msg,
                        title:"提示"
                    }
                    ModalService.Alert(options);
                    if(data.Code=="Success"){
                        //jfModel.getJF();
                        jfModel.getDataList();
                        $modalInstance.dismiss('cancel');
                    }
                })
                .error(function(data) {

                } );
        }

        function UpdateJF(){
            HttpService.Http("JFRecord/UpdateJFRecord",
                {
                    jfr_em_id:$scope.jfInputItem.jfr_em_id,
                    jfr_score:$scope.jfInputItem.jfr_score,
                    jfr_remark:$scope.jfInputItem.jfr_remark,
                    jfr_id:$scope.jfInputItem.jfr_id,
                })
                .success(function(data){
                    var data = angular.fromJson(data);
                    var options = {
                        msg:data.Msg,
                        title:"提示"
                    }
                    ModalService.Alert(options);
                    if(data.Code=="Success"){
                        //jfModel.getJF();
                        jfModel.getDataList();
                        $modalInstance.dismiss('cancel');
                    }
                })
                .error(function(data) {

                } );
        }
    }]);

app.controller('PLAddJFInfoCtrl', ['$scope', '$modalInstance','jfModel','CommonService','HttpService','ModalService',
    function($scope, $modalInstance,jfModel,CommonService,HttpService,ModalService) {
        $scope.type = "add";
        $scope.jfInputItem={};
        var emIds = [];
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.addInfo = function(){
            if($scope.jfInputItem.jfr_score==""){
                return;
            }
            angular.forEach(jfModel.employeeItems, function(item) {
                if(item.check == true){
                    emIds.push(item.em_id);
                }
            });

            AddJF();
        }

        function AddJF(){
            HttpService.Http("JFRecord/AddJFRecordList",
                {
                    ids:emIds,
                    jfr_score:$scope.jfInputItem.jfr_score,
                    jfr_remark:$scope.jfInputItem.jfr_remark,
                })
                .success(function(data){
                    var data = angular.fromJson(data);
                    var options = {
                        msg:data.Msg,
                        title:"提示"
                    }
                    ModalService.Alert(options);
                    if(data.Code=="Success"){
                        //jfModel.getJF();
                        jfModel.getDataList();
                        $modalInstance.dismiss('cancel');
                    }
                })
                .error(function(data) {

                } );
        }
    }]);

app.controller('LevelSelectCtrl', ['$scope', '$modalInstance','jfModel','CommonService','HttpService','ModalService',
    function($scope, $modalInstance,jfModel,CommonService,HttpService,ModalService) {
        $scope.levelList = jfModel.levelList;
        $scope.selectID = "";
        $scope.select = function(item){
            $scope.selectID = item.ID;
        }

        $scope.submitOK = function(){
            UpdateLevel();
        }

        function UpdateLevel(){
            HttpService.Http("Employee/UpdateEmployeeLevel",
                {
                    id:jfModel.em_id,
                    levelID:$scope.selectID
                })
                .success(function(data){
                    var data = angular.fromJson(data);
                    var options = {
                        msg:data.Msg,
                        title:"提示"
                    }
                    ModalService.Alert(options);
                    if(data.Code=="Success"){
                        //jfModel.getJF();
                        jfModel.getDataList();
                        $modalInstance.dismiss('cancel');
                    }
                })
                .error(function(data) {

                } );
        }
    }]);