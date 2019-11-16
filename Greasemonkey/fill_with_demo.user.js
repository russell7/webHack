// ==UserScript==
// @name         dev input
// @namespace    http://holer.org/
// @version      0.2
// @description  try to fill the form with values
// @author       Russell
// @require     https://cdn.bootcss.com/jquery/3.4.0/jquery.min.js
// @include     /^https?://192.168.1.\d{1,3}.*$/
// @include     /^https?://.{1,7}.poly:8019.*$/
// @include     /^https?://192.168.205.\d{1,3}.*$/
// @include     /^https?://.*.newstar.org.cn.*$/
// @include     /^https?://.*.geestu.group.*$/
// @include     /^https?://fw.pwtcexpo.com.*$/
// @include     /^https?://vlbjr.72crm.com.*$/
// @exclude     /^https?://.*pdf$/
// @grant        none
// ==/UserScript==

var script = document.createElement('script');
var sie = document.body || document.head || document.documentElement;
script.appendChild(document.createTextNode('('+ main +')();'));
sie.appendChild(script);

function main() {
    window.hideMenu = function(count) {
      for (var i = 0; i < count; i++) {
        $("li.has-sub:visible:first").hide();
      }
    }

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

    window.rawText = function (ele,show){
        var text = "";
        ele.children().each(function(){
            var _this = $(this);
            if(_this.children()){
                _this.children().each(function(){
                    rawText(_this,false);
                });
            }
            if(_this.text()){
                text += _this.text();
                text += " ";
            }
//            console.log("no text",_this);
        });
        if(show){
            console.log(text);
        }
    }

    window.decorateVal = function (oriVal){
        return oriVal + getRandomArbitrary(11, 999);
    };

    window.addStyle = function (selector,style){
        var e = $(selector);
        e.attr("style",e.attr("style")+";"+ style);
    };

    window.getLabel = function (inputEle){
        var labelEle;
        let type = "elementUI";
        switch (type) {
            case "elementUI":
                var fieldEle;
                var inputType = inputEle.attr("type");
                if(inputEle.is("textarea")){
                    fieldEle = inputEle.parent().parent();
                    labelEle = fieldEle.find("label");
                    if(labelEle){
                        fieldEle = fieldEle.parent();
                        labelEle = fieldEle.find("label");
                    }
                } else if(inputType=="file") {
                    // multi line
                    labelEle = fieldEle.parent().find("p span:last");
                        // inline
                    if(labelEle) {
                        labelEle = fieldEle.parent().find("p");
                    }
                } else {
                    fieldEle = inputEle.parent().parent().parent();
                    labelEle = fieldEle.find("label");
                }
                if(labelEle){
                    return labelEle;
                }
                console.warn("not found in elementUI for ", inputEle);
                break;
            case "mvvm":
                return $("label[for=" + inputEle.attr("id") + "]");
                break;
            case "poly":
                // poly style prev td as label
                labelEle = inputEle.parent().prev();
                if(!labelEle.is("td")){
                    if(inputEle.parentsUntil("td").parent().is("td")){
                        labelEle = inputEle.parentsUntil("td").parent().prev();
                    } else {
                        var lv1Label = inputEle.parent().find("label");
                        var lv2Label = inputEle.parent().parent().find("label");
                        if(lv1Label.length){
                            labelEle = lv1Label;
                        } else if(lv2Label.length){
                            labelEle = lv2Label;
                        }
                    }
                }
                return labelEle;
                break;
            default:
                console.warn("no match label type");
                return labelEle;
        }
    }

    /**
    * @deprecated better use extracLabelText
    */
    window.getLabelText = function (inputEle){
        return extracLabelText(getLabel(inputEle));
    }

    window.extracLabelText = function (labelEle){
        var label = labelEle.text().replace(/\s/g, "").replace("*", "").replace(":", "").replace("：", "").replace("：", "");
        var appendDemo = false;
        // TODO move demo surfix to other place
        if(appendDemo){
            label += "demo";
        }
        return label;
    }

    window.mvvmJSSetValue = function(elm, value) {
        elm.value = value;
        elm.defaultValue = value;
        elm.dispatchEvent(new Event("input", {bubbles: true, target: elm, data: value}));
    }

    window.fillDemo = function () {
        $("input").each(function () {
            var _this = $(this);
            if (!_this.is(":visible") || _this.val()) {
                return;
            }
            if (_this.is(":disabled")) {
                return;
            }
            if (_this.hasClass("select2-input")) {
                return;
            }

            var _type = _this.attr("type");
            if ("text" == _type) {
                // poly patch for select2
                if(_this.hasClass("select2-focusser")){
                    return;
                }
                mvvmJSSetValue(this, decorateVal(getLabelText(_this)));
//                _this.val(decorateVal(getLabelText(_this) + "demo"));
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
            if (_this.attr("name") && _this.attr("name").match(/.*mobile.*/i)) {
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
        _this.val(decorateVal(getLabelText(_this)));
        });
    };

    window.isValidValue = function(v) {
        if(!v){
            return false;
        }
        if(/^\s*$/.test(v)){
            return false;
        }
        if("请选择" == v){
            return false;
        }
        return true;
    }

    window.getOptions = function(labelEle,inputEle) {
        var values = "（";
        var possibleDefaultValue;
        if(inputEle.is("select")){
            inputEle.find("option").each(function(){
                var v = $(this).text();
                if(v && "请选择"!=v.trim()){
                    values += v + "、";
                    if(!possibleDefaultValue){
                        possibleDefaultValue = v;
                    }
                }
            });
        } else {
            // poly style by select2
            inputEle.parent().select2('open');
            $.each($("ul.select2-results li div"),function(i,val){
                var v = $(val).text();
                if("请选择"!=v){
                    values += v + "、";
                }
            });
            possibleDefaultValue = inputEle.prev().text().trim();
            inputEle.parent().select2('close');
        }
        values = values.slice(0, -1);
        if(isValidValue(possibleDefaultValue)){
            values += " 默认 "+possibleDefaultValue;
        }
        values += "）";
        return values;
    }

    window.isRequired = function(labelEle,inputEle) {
        if(labelEle.find("strong").length){
            console.info(labelEle);
            console.info("find strong");
            return true;
        }
        return false;
    }

    window.getLabelDesc = function(labelEle,inputEle) {
        var desc = getLabelText(inputEle);
        if(!desc){
            console.warn("no label? ");
            console.warn(inputEle);
        }
        if(isRequired(labelEle,inputEle)){
            desc += "*";
        }
        desc += ": ";
        if(inputEle.is("textarea")){
            desc += "多行输入";
            return desc;
        }
        switch(inputEle.attr("type")){
            case "text":
                if(inputEle.hasClass("select2-focusser")){
                    desc += "下拉";
                    desc += getOptions(labelEle,inputEle);
                } else {
                    desc += "文本输入";
                    var placeholder = inputEle.attr("placeholder")
                    if(placeholder){
                        placeholder = placeholder.trim();
                        if(labelEle.text().trim()!=placeholder){
                            desc += " ("+placeholder+")";
                        }
                    }
                    break;
                }
                break;
            case "select":
                desc += "下拉";
                desc += getOptions(labelEle,inputEle);
                break;
            case "file":
                desc += "文件选择";
                var accept = inputEle.attr("accept");
                if(accept){
                    desc += " 接受类型 " + accept;
                }
                break;
            case "textarea":
                desc += "多行输入";break;
            case "radio":
                desc += "单选 "+ inputEle.attr("title");break;
            case "checkbox":
                desc += "多选 "+ inputEle.attr("title");break;
            default:
                desc += "文本输入";break;
        }
        if(inputEle.attr("disabled")){
            desc += " 不可修改";
        }
        return desc;
    }

    window.getLabelDescForSelect = function(labelEle,inputEle) {
        if(!labelEle.text()){
            console.warn("no label? ");
            console.warn(inputEle);
        }
        var desc = extracLabelText(labelEle);
        if(isRequired(labelEle,inputEle)){
            desc += "*";
        }
        desc += ": 下拉";
        desc += getOptions(labelEle,inputEle);
        if(inputEle.attr("disabled")){
            desc += " 不可修改";
        }
        return desc;
    }

    window.getInputDesc = function(inputEle) {
        return getLabelDesc(getLabel(inputEle),inputEle);
    }

    window.getSelectDesc = function(inputEle) {
        return getLabelDescForSelect(getLabel(inputEle),inputEle);
    }

    window.getFormDesc = function () {
        var descs = [];
        descs.push("字段说明：");
        $("input").each(function () {
            var _this = $(this);
            if (!_this.is(":visible")) {
                return;
            }
            var _type = _this.attr("type");
            if ("text" == _type) {
                descs.push(getInputDesc(_this));
            } else if ("radio" == _type) {
                descs.push(getInputDesc(_this));
            } else if ("checkbox" == _type) {
                descs.push(getInputDesc(_this));
            } else if ("select" == _type) {
                console.log("select");
                console.log(_this);
                descs.push(getInputDesc(_this));
            } else if ("number" == _type) {
                descs.push(getInputDesc(_this));
            } else if ("email" == _type) {
                descs.push(getInputDesc(_this));
            } else if ("file" == _type) {
                descs.push(getInputDesc(_this));
            } else {
                descs.push(getInputDesc(_this));
            }
        });

        // element UI select
        $("div.select-box").each(function () {
            var _this = $(this).parent();
            descs.push("选择" + getLabelText(_this));
        });

        // element UI radio
        $("div.el-radio-group").each(function () {
            var _this = $(this).parent();
            descs.push(getInputDesc(_this));
        });

        // element UI pop select
        $("div.el-popover").each(function () {
            var _this = $(this);
            descs.push(getInputDesc(_this));
        });

        $("textarea").each(function () {
            var _this = $(this);
            if (!_this.is(":visible")) {
                return;
            }
            descs.push(getInputDesc(_this));
        });
        let text = descs.join("\n");
        console.log(text);

        copyTextToClipboard(text);
    };

    window.fallbackCopyTextToClipboard=function(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position="fixed";  //avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
    }

    window.copyTextToClipboard=function (text) {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

    window.showButtons = function(inputEle) {
        // poly style
        var values = "";
        $("input[type=button]").each(function(){
            var v = $(this).val();
            if("请选择"!=v){
                values += v + " ";
            }
        });
        $("input[type=submit]").each(function(){
            var v = $(this).val();
            if(v){
                values += v + " ";
            }
        });
        $("button").each(function(){
            var v = $(this).text();
            if("请选择"!=v){
                values += v + " ";
            }
        });
        $("a.btn").each(function(){
            var v = $(this).text();
            if(v){
                v = v.trim();
            }
            if("请选择"!=v){
                values += v + " ";
            }
        });
        console.log(values);
    }

}

$().ready(function () {
    // fillDemo();
    getFormDesc();
    $(document).bind('keydown', function(e) {
        // alt + z
        if(90 == e.which && e.altKey){
            fillDemo();
        }
        // alt + x
        if(88 == e.which && e.altKey){
            getFormDesc();
        }
        // alt + b
        if(66 == e.which && e.altKey){
           // "b" == e.key
            // sth wrong with alt combo, use deprecated which
            showButtons();
        }
    });
});
