app.controller('TemplateCtrl', ['$http','utils', function($http,utils) {
    var selt = this;
    this.colors = ['primary', 'info', 'success', 'warning', 'danger', 'dark'];

    var tid =  utils.getUrlVar('tid');

    this.items = [];

    this.template = {
        "contentJson" : []
    };

    if(tid){
        $http.get("/ts-project/template/getTemplate/"+tid).success(function (result) {
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
    }





}]);