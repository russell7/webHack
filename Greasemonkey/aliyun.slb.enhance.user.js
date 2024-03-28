// ==UserScript==
// @name         aliyun-slb-enhance
// @namespace    http://gm.russell.nowhere/
// @version      0.2
// @description  easier slb operate
// @author       Russell
// @match        https://slb.console.aliyun.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// ==/UserScript==

function main() {
    var _try_count = 0;
    window.submitPower = function (e) {
        let _submitBtn = $("div.next-overlay-wrapper.opened button.next-btn.next-small.next-btn-primary > span");
        _submitBtn.focus();
        _submitBtn.trigger("click");
    };

    window.setValueTo = function (e) {
        console.log("GM func setValueTo ");
        let _t = $(e);
        if (!_t) {
            console.log("GM not normal click " + _t.text());
            return;
        }
        let _p = _t.text();
        console.log("GM click " + _p);

        //let _input = $("div.next-overlay-wrapper.opened .next-form-item .next-form-item-control .next-input>input");
        let _input = $("#item");
        let _lastValue = _input.val();
        _input.val(_p);

        let _inputRaw = _input[0];
        let event = document.createEvent("Event");
        event.initEvent("input", true, false);
        event.simulated = true;
        event.eventType = "message";
        let tracker = _inputRaw._valueTracker;
        if (tracker) {
            console.log("GM has tracker");
            tracker.setValue(_lastValue);
        }
        _inputRaw.dispatchEvent(event);

        console.log("GM click " + _p + " done");

        setTimeout(submitPower, 321);
    };

    window._createButton = function (value) {
        let _b = $(`${value==0?`<br/>`:``}<button type="button"  class="next-btn next-btn-normal fixed-btn">${value}</button>`);

        _b.on("click", function (event) {
            const editElement = findEditElement(this);
            editElement.click();

            setTimeout(() => {
                setValueTo(this);
            }, 100);
            event.stopPropagation();
        });

        return _b;
    };

    window.findEditElement = function (element) {
        let jqElement = $(element);
        let editElement;
        let _page_config = {
            slb_mode: {
                alb: "alb",
                clb: "clb"
            }
        };
        let _slb_mode = location.pathname.includes("/slbs") ? _page_config.slb_mode.clb : _page_config.slb_mode.alb;

        if (_slb_mode === _page_config.slb_mode.alb) {
            console.log("GM inject mode " + _slb_mode + "_alb");
            editElement = jqElement.parent().parent().parent().parent().next('[role="button"]');
        } else if (_slb_mode === _page_config.slb_mode.clb) {
            console.log("GM inject mode " + _slb_mode + "_clb");
            editElement = jqElement.parent().parent().parent().next().find("i.simple-editor-pen");
        }

        return editElement;
    };

    window.injectFillBtn = function (className) {
        console.log("GM injectFillBtn ", new Date());
        let editBtn = $(className).parent();

        let $btnGroup = $('<span style="margin: 0 5px"></span>');

        $btnGroup.append(_createButton(0));
        $btnGroup.append(_createButton(1));
        $btnGroup.append(_createButton(100));

        editBtn.append($btnGroup);
    };

    window.injectUI = function () {
        if ($("span._inject_marker").length > 0) {
            console.log("GM inject done, wait for next look up ", new Date());
            setTimeout("injectUI()", 5 * 1000, _try_count++);
            return;
        }

        console.log("GM inject " + new Date());
        let _page_config = {
            slb_mode: {
                alb: "alb",
                clb: "clb"
            }
        };

        let _slb_mode = _page_config.slb_mode.alb;
        if (location.pathname.includes("/slbs")) {
            _slb_mode = _page_config.slb_mode.clb;
        }

        let power_text_selector = {
            alb: "div.art-table > div.art-table-body.art-horizontal-scroll-container > table > tbody td:nth-child(8) > div > div > div span > span > span.wind-rc-truncate__truncated",
            clb: "#slbContent div:nth-child(2) > div > div.wind-rc-table div > table > tbody > tr.next-table-row  > td:nth-child(7) div.nameEditor span > span > span"
        };
        let current_power_text_selector = power_text_selector[_slb_mode];
        console.log("power_text_selector " + current_power_text_selector);

        let _ec = $(current_power_text_selector).length;

        console.log("GM check 'element power text' " + _ec + " , expression " + (_ec <= 1) + ", try count is " + _try_count + " and expression " + (_try_count < 10));
        if ((_ec <= 1) & (_try_count < 10)) {
            setTimeout("injectUI()", 500, _try_count++);
            console.log("GM wait for inject base of ", _slb_mode);
        } else {
            setTimeout("injectUI()", 10 * 1000, _try_count++);
            console.log("GM keep watch in case of refresh");
        }

        $(current_power_text_selector).parent().after('<span class="_inject_marker"/>');
        $(current_power_text_selector).css("color", "#dd3da6");
        $(current_power_text_selector).each(function () {
            let _t = $(this);
            let editBtn;
            if (_slb_mode === _page_config.slb_mode.alb) {
                console.log("GM inject mode " + _slb_mode);
                editBtn = _t.parent().parent().parent().next('[role="button"]');
            } else if (_slb_mode === _page_config.slb_mode.clb) {
                console.log("GM inject mode " + _slb_mode);
                editBtn = _t.parent().parent().next().find("i.simple-editor-pen");
            }

            console.log("GM btn" + editBtn + " check " + !editBtn);
            if (editBtn.length < 1) {
                console.log("GM not btn " + editBtn);
                return true;
            }

        });
        setTimeout(injectFillBtn(current_power_text_selector), 200);
    };

}

var style = document.createElement("style");
style.type = "text/css";
style.innerHTML="div.art-table > div.art-table-body.art-horizontal-scroll-container > table > tbody td:nth-child(8) > div > div > div span > span > span.wind-rc-truncate{display:block}";
(document.getElementsByTagName("HEAD").item(0).appendChild(style))

var script = document.createElement("script");
script.appendChild(document.createTextNode("(" + main + ")();"));
(document.body || document.head || document.documentElement).appendChild(script);

(function () {
    "use strict";

    console.log("GM hey " + new Date());
    setTimeout("injectUI()", 1000);
})();

