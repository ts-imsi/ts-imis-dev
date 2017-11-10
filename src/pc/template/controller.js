app.controller('TemplateCtrl', ['$http','utils','$modal', function($http,utils,$modal) {
    var selt = this;
    this.colors = ['primary', 'info', 'success', 'warning', 'danger', 'dark'];

    var type =  utils.getUrlVar('type');

    this.items = [];

    this.template = {
        "contentJson" : []
    };

    if(type){
        $http.get("/ts-project/template/getTemplate/"+type).success(function (result) {
            console.log(result);
            if(result.statusCode==1){
                selt.template = result.object;
                if(!selt.template.contentJson){
                    selt.template.contentJson = [];
                }
                console.log(selt.template.contentJson);
                //handover
                $http.get("/ts-project/template/queryItem/"+selt.template.type).success(function (result) {
                    console.log(result);
                    if(result.statusCode==1){
                        selt.items = result.object;
                        angular.forEach(selt.template.contentJson, function(note) {
                            angular.forEach(selt.items, function(item) {
                                if(item.name==note.name){
                                    selt.items.splice(selt.items.indexOf(item),1);
                                }
                            });
                        });
                    }else{
                        selt.items = [];
                    }

                });
            }else{
                selt.template = "";
            }

        });
    }

    this.saveTemplate = function () {
        console.log(this.template);
        $http.post("/ts-project/template/saveTemplate",angular.toJson(this.template)).success(function (result) {
            if(result.success){
                alert("模板保存成功!");
            }else{
                alert("模板保存失败!");
            }
        });
    }


    this.updateElement=function(element,size){
        if(element.level==0){
            alert("改数据不允许修改");
            return;
        }

        var ElementInstance = $modal.open({
            templateUrl: 'element.html',
            controller: 'elementCtrl as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return element;
                }
            }
        });
        ElementInstance.result.then(function () {

        });
    }
    this.addElement=function(size){
        var ElementInstance = $modal.open({
            templateUrl: 'element.html',
            controller: 'elementCtrl as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return null;
                }
            }
        });
        ElementInstance.result.then(function (template) {
            $http.get("/ts-project/template/queryItem/"+template.type).success(function (result) {
                console.log(result);
                if(result.statusCode==1){
                    selt.items = result.object;
                    angular.forEach(selt.template.contentJson, function(note) {
                        angular.forEach(selt.items, function(item) {
                            if(item.name==note.name){
                                selt.items.splice(selt.items.indexOf(item),1);
                            }
                        });
                    });
                }else{
                    selt.items = [];
                }

            });
        });
    }


}]);

app.controller('elementCtrl', ['$scope', '$modalInstance','$http', 'data', function($scope,$modalInstance,$http,data) {
    var seltEle = this;
    seltEle.submitted=false;
    if(data!=null){
        seltEle.templateItem=data;
        seltEle.level=data.level;
        seltEle.isRequired=data.isRequired;

    }
    this.saveTemplateItem=function(valid,invalid,templateItem){
        if(valid) {
            if (!invalid) {
                if (templateItem.input == 'text') {
                    templateItem.length = 50;
                }
                if (templateItem.input == 'date') {
                    templateItem.length = 29;
                }
                if (templateItem.input == 'textarea') {
                    templateItem.length = 60;
                }
                if(templateItem.px==null||templateItem.px==undefined){
                    templateItem.px=1
                }
                templateItem.level = seltEle.level;
                templateItem.isRequired = seltEle.isRequired;
                $http.post("/ts-project/template/saveTemplateItem", angular.toJson(templateItem)).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                        $modalInstance.close(templateItem);
                    } else {
                        alert(result.message);
                    }
                });
            }
        }else{
            seltEle.submitted=true;
        }
    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);