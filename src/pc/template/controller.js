app.controller('TemplateCtrl', ['$http', function($http) {
    var selt = this;

    this.items = [];
    this.content = [];

    $http.get("/ts-project/template/queryItem/handover").success(function (result) {
        console.log(result);
        if(result.statusCode==1){
            selt.items = result.object;
        }else{
            this.items = [];
        }

    });

    this.colors = ['primary', 'info', 'success', 'warning', 'danger', 'dark'];

}]);