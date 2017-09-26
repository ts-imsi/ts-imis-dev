/**
 * Created by kui.liu on 2014/06/09 19:37.
 * @author kui.liu
 *
 */
(function (angular, navigator) {
    "use strict";

    var
        getUrlVars = function () {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },

        getShortUrl = function (repStr) {
            var url = window.location.href;

            if (repStr) {
                url = url.replace(repStr, "");
            }

            var false_param = url.split("/").pop();
            if (false_param && false_param.indexOf("?") > 0) {
                var param = false_param.substr(0, false_param.indexOf("?"));
                return param;
            }
            return false_param;
        },

        getUrlVar = function (name) {
            return getUrlVars()[name];
        },

        checkIfMobileTerminal = function () {
            return !!navigator.userAgent.match(/(AppleWebKit.*Mobile.*)|(Phone)/i);
        };

    /**
     * 工具集
     */
    angular.module("mobile.utils", [])

        .constant("utils", {
            getUrlVars           : getUrlVars,
            getShortUrl          : getShortUrl,
            getUrlVar            : getUrlVar,
            checkIfMobileTerminal: checkIfMobileTerminal
        });

})(window.angular, window.navigator);