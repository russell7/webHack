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

function main () {
    var _try_count = 0;
    window.submitPower = function(e) {
        let _submitBtn = $("div.next-overlay-wrapper.opened button.next-btn.next-small.next-btn-primary > span");
        _submitBtn.focus();
        _submitBtn.trigger("click");
    }

    window.setValueTo = function(e) {
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

        let _inputRaw =_input[0];
        let event = document.createEvent('Event');
        event.initEvent("input", true, false);
        event.simulated = true;
        event.eventType = 'message';
        let tracker = _inputRaw._valueTracker;
        if (tracker) {
            console.log("GM has tracker");
            tracker.setValue(_lastValue);
        }
        _inputRaw.dispatchEvent(event);

        console.log("GM click " + _p+" done");

        setTimeout(submitPower, 321);
    }

    window.injectInlineBtn = function() {
        // inject btn inline, less click
    }

    window.injectFillBtn = function() {
        console.log("GM injectFillBtn ", new Date());
        // inject on pop
        let _cancelBtn = $('div.next-overlay-wrapper button.next-btn.next-small.next-btn-normal');
        if (_cancelBtn.length<=1) {
            console.log("GM alb btn not found");
        }
        _cancelBtn = $('div.opened form button.next-btn.next-btn-normal').not('._inject_marker');

        let _node = '<button type="button" class="next-btn next-btn-normal _inject_marker">100</button>';
        let _b = $(_node);
        _b.on("click", function () {
            setValueTo(this);
        });
        _cancelBtn.after(_b);

        _node = '<button type="button" class="next-btn next-btn-normal _inject_marker">1</button>';
        _b = $(_node);
        _b.on("click", function () {
            setValueTo(this);
        });
        _cancelBtn.after(_b);

        _node = '<button type="button" class="next-btn next-btn-normal _inject_marker">0</button>';
        _b = $(_node);
        _b.on("click", function () {
            setValueTo(this);
        });
        _cancelBtn.after(_b);
    }

    window.injectUI = function() {
        if($("span._inject_marker").length>0) {
            console.log("GM inject done, wait for next look up ", new Date());
            setTimeout("injectUI()", 5*1000, _try_count++);
            return;
        }

        console.log("GM inject " + new Date());
        let _page_config = {
            slb_mode: {
                alb: 'alb',
                clb: 'clb'
            }
        };

        let _slb_mode = _page_config.slb_mode.alb;
        if (location.pathname.includes("/slbs")) {
                _slb_mode = _page_config.slb_mode.clb;
        }

        let power_text_selector = {
            'alb': 'td[data-next-table-col="7"].next-table-cell .next-table-cell-wrapper .wind-rc-truncate__wrapper .wind-rc-truncate .wind-rc-truncate__truncated',
            'clb': '#slbContent div:nth-child(2) > div > div.wind-rc-table div > table > tbody > tr.next-table-row  > td:nth-child(7) div.nameEditor span > span > span'
        };
        let current_power_text_selector = power_text_selector[_slb_mode];
        console.log(current_power_text_selector);

        let _ec = $(current_power_text_selector).length;

        console.log("GM check " + _ec +" " +(_ec<=1) +" "+ _try_count  +" and " + (_try_count<10));
        if ((_ec<=1) & (_try_count<10)) {
            setTimeout("injectUI()", 500, _try_count++);
            console.log("GM wait for inject base of ", _slb_mode);
        } else {
            setTimeout("injectUI()", 10*1000, _try_count++);
            console.log("GM keep watch incase of refresh");
        }

        $(current_power_text_selector).parent().after('<span class="_inject_marker"/>');
        $(current_power_text_selector).css("color", "#dd3da6");
        $(current_power_text_selector).each(function () {
            let _t = $(this);
            let editBtn;
            if (_slb_mode === _page_config.slb_mode.alb) {
                console.log("GM inject mode "+ _slb_mode);
                editBtn = _t.parent().parent().parent().next('[role="button"]');
            } else if (_slb_mode === _page_config.slb_mode.clb) {
                console.log("GM inject mode "+ _slb_mode);
                editBtn = _t.parent().parent().next().find('i.simple-editor-pen');
            }

            console.log("GM btn" + editBtn + " check " + (!editBtn));
            if (editBtn.length<1) {
                console.log("GM not btn " + editBtn);
                return true;
            }

            editBtn.on("click",function () {
                setTimeout(injectFillBtn, 200);
            });
        });

        if (_slb_mode === _page_config.slb_mode.clb) {
            // inject clb button inline
            injectInlineBtn();
        }

    };
}

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ main +')();'));
(document.body || document.head || document.documentElement).appendChild(script);

(function () {
    'use strict';

    console.log("GM hey " + new Date());
    setTimeout("injectUI()", 1000);
})();
