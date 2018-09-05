// ==UserScript==
// @name         dev input
// @namespace    http://holer.org/
// @version      0.2
// @description  try to fill the form with values
// @author       Russell
// @include     /^https?://192.168.1.\d{1,3}.*$/
// @include     /^https?://.*.newstar.org.cn.*$/
// @include     /^https?://.*.geestu.group.*$/
// @grant        none
// ==/UserScript==

var script = document.createElement('script');
var sie = document.body || document.head || document.documentElement;
script.appendChild(document.createTextNode('('+ main +')();'));
sie.appendChild(script);

function main() {
    window.getRandomArbitrary = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    window.getRandomString = function (length){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };

    window.decorateVal = function (oriVal){
        return oriVal + getRandomArbitrary(11, 999);
    };

    window.fillDemo = function () {
        $("input").each(function () {
            var _this = $(this);
            if (!_this.is(":visible") || _this.val()) {
                return;
            }

            var _type = $(this).attr("type");
            if ("text" == _type) {
                _this.val(decorateVal($("label[for=" + $(this).attr("id") + "]").text().replace(" ", "") + "demo"));
            } else if ("number" == _type) {
                _this.val(getRandomArbitrary(123456, 999999));
                if (_this.attr("maxlength")) {
                    _this.val(_this.val() % Math.pow(10, _this.attr("maxlength")));
                }
            } else if ("email" == _type) {
                if(getRandomArbitrary(1,9)>5){
                    _this.val(getRandomString(7) + "@" + getRandomString(3) + ".dm" );
                } else{
                    _this.val("test@zzxes.com.cn");
                }
            }
            if (_this.attr("name") && _this.attr("name").match(/mobilePhone/i)) {
                _this.val(getRandomArbitrary(13300000000, 18999999999));
            }
            if (_this.attr("name") && _this.attr("name").match(/.*[Dd]ate.*/i)) {
                var dateValue = new Date();
                dateValue.setDate(dateValue.getDate() + getRandomArbitrary(-7,7));
                var year = dateValue.getFullYear();
                var month = dateValue.getMonth() + 1;
                month = month < 10 ? "0" + month : month;
                var day = dateValue.getDate();
                day = day < 10 ? "0" + day : day;
                var dateStr = year + "-" + month + "-" + day;
                _this.val(dateStr);
            }
        });
        $("textarea").each(function () {
            var _this = $(this);
            if (!_this.is(":visible") || _this.val()) {
                return;
            }
        _this.val(decorateVal($("label[for=" + $(this).attr("id") + "]").text().replace(" ", "") + "demo"));
        });
    };

}

$().ready(function () {
    fillDemo();
    $(document).bind('keydown', function(e) {
        // alt + z
        if(90 == e.which && e.altKey){
            fillDemo();
        }
    });
});
