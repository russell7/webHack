// ==UserScript==
// @name         easier aliyun text extract
// @namespace    http://aliyun.holer.org/
// @version      0.1
// @description  make inspection easier
// @author       Russell Hong
// @match        https://cloudmonitor.console.aliyun.com/dashboard/details/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// ==/UserScript==

function extractText(){
    let nums="";
    let split_mark = "- ";
    $("div.g2-tooltip:visible li").each(function () {
        let t = $(this);
        let _tv = t.css("visibility");
        if('visible'!==_tv){
            return;
        }
        let text = t.text();
        let offset = text.indexOf(split_mark);
        if(offset>=0){
            text = text.substring(offset+split_mark.length);
        }
        text = text.replace(new RegExp(/\(.*?\)/, 'g'), "");
        text = text.replace(new RegExp(/elc-/, 'g'), "");
        text = text.replace(new RegExp(/-live/, 'g'), "");
        text = text.replace(new RegExp(/polar-/, 'g'), "");
        // remove disk mount point
        text = text.replace(new RegExp(/-\/dev\/vda1/, 'g'), "");
        // remove polar instance prefix, keep tail
        text = text.replace(new RegExp(/pi-\w{13}/, 'g'), "");
        nums+=text+"\n";
    });
    if (nums.length > 0) {
        console.log(nums);
        navigator.clipboard.writeText(nums).then(() => {console.log('copy done')});
    }
}

(function() {
    'use strict';

    $(document).bind('keydown', function(e) {
        // some aliyun bug pollute alt
        if('x' == e.key && e.altKey){
            console.log("alt on");
            extractText();
        }
        if('x' == e.key && e.ctrlKey){
            console.log("ctrl on");
            extractText();
        }
    });
})();