/**
 * Created by sakfi on 2017/12/15.
 */
angular.module('app').factory('loadingInterceptor', function($q, $rootScope) {

    return {
        request: function(config) {
            $(".back-layer").show();
            return config || $q.when(config);
        },
        response: function(response) {
            $(".back-layer").hide();
            return response || $q.when(response);
        },
        responseError: function(rejection) {
            $(".back-layer").hide();
            return $q.reject(rejection);
        }
    };
});