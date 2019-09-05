// ==UserScript==
// @name         rap2 ui enhance
// @namespace    http://holer.org/
// @version      0.1
// @description  make rap2 ui easier. show formatted desc for api.
// @author       Russell
// @match        http://rap2.taobao.org/repository/editor*
// @grant        none
// ==/UserScript==

function enhance(){
    var desc_block = document.querySelector("div.InterfaceSummary ul.summary li:last-child span:last-child span:last-child");
    if(!desc_block){
        console.log("not found");
        return ;
    }
    if(document.querySelector("div.InterfaceSummary ul.summary li:last-child span:last-child span:last-child pre")){
        console.log("already replaced");
        return;
    }
    var desc_format = document.createElement("pre");
    desc_format.innerHTML = desc_block.innerHTML;
    desc_block.innerHTML="";
    desc_block.appendChild(desc_format);
}

window.onload = function(){
    setTimeout(enhance,500);
};

window.onclick = function(){
    setTimeout(enhance,500);
};
