// ==UserScript==
// @name         aliyun-slb-enhance
// @namespace    http://holer.org/
// @version      0.1
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

    window.injectFillBtn = function() {
        // inject on pop
        let _cancelBtn = $("div.next-overlay-wrapper button.next-btn.next-small.next-btn-normal");
        let _node = '<button type="button" class="next-btn next-btn-normal _inject_marker">100</button>';
        let _b = $(_node);
        _b.on("click", function () {
            setValueTo(this);
        });
        _cancelBtn.after(_b);

        _node = '<button type="button" class="next-btn next-btn-normal">1</button>';
        _b = $(_node);
        _b.on("click", function () {
            setValueTo(this);
        });
        _cancelBtn.after(_b);

        _node = '<button type="button" class="next-btn next-btn-normal">0</button>';
        _b = $(_node);
        _b.on("click", function () {
            setValueTo(this);
        });
        _cancelBtn.after(_b);
    }
    window.injectUI = function() {
        console.log("GM inject " + new Date());
        let _ec = $('td[data-next-table-col="7"].next-table-cell .next-table-cell-wrapper .wind-rc-truncate__wrapper .wind-rc-truncate .wind-rc-truncate__truncated').length;

        console.log("GM check " + _ec +" " +(_ec<=1) +" "+ _try_count  +" and " + (_try_count<10));
        if ((_ec<=1) & (_try_count<10)){
            console.log("GM wait for inject base");
            setTimeout("injectUI()", 500, _try_count++);
            return;
        } else if($("#_inject_marker").length>0) {
            console.log("GM inject done, wait for next look up");
            setTimeout("injectUI()", 5*1000, _try_count++);
            return;
        } else {
            setTimeout("injectUI()", 10*1000, _try_count++);
            console.log("GM no more time out");
        }

        $('td[data-next-table-col="7"].next-table-cell .next-table-cell-wrapper .wind-rc-truncate__wrapper .wind-rc-truncate .wind-rc-truncate__truncated').after('<span id="_inject_marker"/>');
        console.log("GM size "+ _ec);
        $('td[data-next-table-col="7"].next-table-cell .next-table-cell-wrapper .wind-rc-truncate__wrapper .wind-rc-truncate .wind-rc-truncate__truncated').css("color", "#FF0000");
        $('td[data-next-table-col="7"].next-table-cell .next-table-cell-wrapper .wind-rc-truncate__wrapper .wind-rc-truncate .wind-rc-truncate__truncated').each(function () {
            let _t = $(this);
            let editBtn = _t.parent().parent().parent().next('[role="button"]');

            console.log("GM btn" + editBtn + " check " + (!editBtn));
            if (editBtn.length<1) {
                console.log("GM not btn " + editBtn);
                return true;
            }
            editBtn.css("color","#00F");
            editBtn.on("click",function () {
                setTimeout(injectFillBtn, 321);
            });

        });

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
