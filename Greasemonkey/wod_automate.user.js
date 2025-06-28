// ==UserScript==
// @name       wod automate
// @namespace  org.holer.webgame.util.wod
// @version    0.2.0
// @description  automate wod routine
// @match      https://*.world-of-dungeons.org/wod/spiel/rewards/vote.php*
// @copyright  2012+, Russell
// ==/UserScript==

script = document.createElement('script');
script.appendChild(document.createTextNode('('+ main +')();'));

var sie = document.body || document.head || document.documentElement;
sie.appendChild(script);

function main() {

    window.wodCh = function (){
        if ($("center > img").length) {
            $("center > a > img").click();
        }
        const voteBtnSelector = "div#htmlComponentVoteButtons span div.vote";
        let extraHonor = $(voteBtnSelector).get($(voteBtnSelector).size()-2);
        if(!/.+\d:\d{2}/.test(extraHonor.innerHTML)){
            $("html.page_bg_with_image body div#page-border table#gadgettable tbody tr td#gadgettable-center-td.gadgettable-column div#gadgettable-center div#gadgettable-center-gadgets div.gadget div.gadget_inner div#main_content div.gadget_body div#htmlComponentVoteButtons.htmlComponentVoteButtons span div.vote a").click();
        }
        $("div.block_body div.block_inner input.button.clickable").click();
    }

    window.addEventListener("load",wodCh,false);
}
