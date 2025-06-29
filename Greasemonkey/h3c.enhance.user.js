// ==UserScript==
// @name         NAT Toggle State
// @namespace    http://holer.org/
// @version      0.1.0
// @description  Add toggle button to NAT data rows and change state
// @author       Russell
// @match        http://10.12.100.2/cgi-bin/luci/
// @match        http://10.12.100.2/cgi-bin/luci/#admin/networknew/natSetting
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        addNavBtn();
        setTimeout(addToggleButtons, 2000);
    });

    function addNavBtn() {
        const navBtn = $('<button style="right:30rem;position: absolute;top: 1rem;z-index: 1;" href="/cgi-bin/luci/#admin/networknew/natSetting">NAT</button>');
        $('.tabmenu.l1 .tabmenu-item-language.level1Li').after(navBtn);
        navBtn.click(function() {
            $('.tabmenu-item-natSetting a:first').click();
            setTimeout(addToggleButtons, 2000);
        });
    }

    function addToggleButtons() {
        console.log("GM addToggleButtons");
        // 假设 NAT 数据行有特定的类名或标识，这里需要根据实际情况修改选择器
        $('.table.table-striped.table-bordered tr').each(function() {
            const row = $(this);
            const stateCell = row.find('td').eq(7);
            const currentOn = stateCell.text().trim() === 'On';

            const toggleBtn = $('<button class="toggle-btn" style="padding: 0;margin-left: 1rem;margin-right: 0;">Toggle</button>');
            toggleBtn.css('background-color', currentOn ? 'green' : 'red');

            // 绑定点击事件
            toggleBtn.click(function() {
                toggleState(row, currentOn);
            });

            stateCell.append(toggleBtn);
        });
        console.log("GM addToggleButtons done");
    }

    function toggleState(row, currentState) {
        const editBtn = row.find('.icon-edit'); // 请根据实际 Edit 按钮的选择器修改
        editBtn.click();

        setTimeout(function() {
            // 修改弹出的 State
            const stateSelect = $('#Enable');
            stateSelect.val(String(!currentState));

            // 点击 Apply 按钮
            const applyBtn = $('#submit');
            applyBtn.click();
            row.find('.toggle-btn').css('background-color', !currentState? 'green' :'red');

            setTimeout(addToggleButtons, 2000);
        }, 500); // 根据实际情况调整等待时间
    }
})();
