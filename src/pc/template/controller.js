app.controller('TemplateCtrl', ['$http','utils', function($http,utils) {
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





}]);