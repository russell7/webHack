// ==UserScript==
// @name        CNDA report helper
// @namespace   com.erepublik.cnda
// @description automatic fill report for CNDA
// @include     *www.erepublik.com/*/article/*cnda*
// @include     *www.erepublik.com/*/military/*
// @version     1.0.2
// @grant       none
// ==/UserScript==

var script = document.createElement('script');
var sie = document.body || document.head || document.documentElement;
script.appendChild(document.createTextNode('('+ main +')();'));
sie.appendChild(script);

function main() {
    window.cnda_update = function () {
        if (!String.format) {
          String.format = function(format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function(match, number) {
              return typeof args[number] != 'undefined'? args[number] : match ;
            });
          };
        }

        localStorage.setItem('cnda_code', $j("#cnda_code").val());

        var code = $j("#cnda_code").val();
        var name = $j("#cnda_name").val();
        var cnda_division = $j("#cnda_division").val();
        var cnda_hit_count = $j("#cnda_hit_count").val();
        var cnda_hit_damage = $j("#cnda_hit_damage").val();
        var cnda_report = String.format("{0}*{1}*{2}*{3}*{4}*0", code, name, cnda_division, cnda_hit_count, cnda_hit_damage);
        $j("#article_comment").val(cnda_report);
    }

    window.loadBattleFieldData = function () {
        $j("#cnda_division").val(localStorage.getItem('cnda_division'));
        $j("#cnda_hit_count").val(localStorage.getItem('cnda_hit_count'));
        $j("#cnda_hit_damage").val(localStorage.getItem('cnda_hit_damage'));
        cnda_update();
        $j(".std_global_btn.submitComment.testComment").focus();
    }

}

var $j = jQuery.noConflict();

function cnda_battle_field_enhance() {
    var cnda_hit_stats = $j("#personal_stats");
    // monitor hits in battle
    if ( cnda_hit_stats.length ) {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var myObserver = new MutationObserver (mutationHandler);
        var obsConfig = { childList: true, subtree: true };

        //--- Add a target node to the observer. Can only add one node at a time.
        cnda_hit_stats.each ( function () {
            myObserver.observe (this, obsConfig);
        } );
        function cnda_refresh_bfd() {
            var cnda_division = "D" + $j("div.player_holder").attr("data-division").slice(-1);
            var cnda_hit_count = $j("#personal_stats").find("q:nth-child(2)").text().replace(',','');
            var cnda_hit_damage = $j("#personal_stats").find("q:last").text().replace(',','');

            localStorage.setItem('cnda_division', cnda_division);
            localStorage.setItem('cnda_hit_count', cnda_hit_count);
            localStorage.setItem('cnda_hit_damage', cnda_hit_damage);
        }

        function mutationHandler (mutationRecords) {
            cnda_refresh_bfd();
        }
        cnda_hit_stats.append("<span> CNDA is watching</span>");
        cnda_refresh_bfd();
    }
}

var comment_container = $j(".comment_add");
if ( comment_container.length ) {
    var update_battle_field_button = '<br><button class="std_global_btn tinySize" type="button" onclick="loadBattleFieldData()" title="Load from battle field" accesskey="L">Load</button>';
    var code_name_input = '<label> CNDA <input id="cnda_code" onchange="cnda_update()"/></label><label><input id="cnda_name"/></label>';
    var battle_field_input = '<label><input id="cnda_division" onchange="cnda_update()" class="short"/></label><label> hit <input id="cnda_hit_count" onchange="cnda_update()" class="short" type="number"/></label><label> damage <input id="cnda_hit_damage" onchange="cnda_update()" type="number"/></label>';

    comment_container.find("p:first").append( update_battle_field_button + code_name_input + battle_field_input );

    $j("#cnda_code").val(localStorage.getItem('cnda_code'));
    $j("#cnda_name").val($j("a.user_name").text());
    loadBattleFieldData();
} else {
    setTimeout(cnda_battle_field_enhance, 9876);
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('label>input { border-radius: 6px;line-height: 20px;padding-left: 3px;width: 7em; }label>input.short {width: 3em;}');
