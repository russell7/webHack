// ==UserScript==
// @name         tongyi enhance
// @namespace    http://gm.russell.nowhere/
// @version      0.3
// @description  easier tongyi operate
// @author       Russell
// @match        https://tongyi.aliyun.com/*
// @match        https://xinghuo.xfyun.cn/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// ==/UserScript==

(function () {
  ("use strict");

  function createDeleteButton() {
    let button = $('<span role="img" class="anticon" style="display: none"><svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false"><use xlink:href="#icon-icon-shanchu"></use></svg></span>');

    button.on("click", function (event) {
      console.log(event);
      submitDeleteAction(this);
    });

    return button;
  }

  function submitDeleteAction(elem) {
      let childrenAnticon = $('[class*="sessionItem--"][class*="activeItem--"]').children('[class*="anticon"]');
      childrenAnticon[1].click()
    setTimeout(() => {
      console.log($('[class*="option--"]'));
      $('[class*="option--"]')[4].click();
      setTimeout(() => {
        $('.ant-btn-dangerous')[0].click();
      }, 300);
    }, 300);
  }

  function attachButtons() {
    const $elements = $('[class*="sessionItem--"]').not('[data-delete-btn-added="true"]');

    $elements.each(function () {
      let button = createDeleteButton();
      $(this).prepend(button.clone(true)); // 为每个找到的元素创建和追加新的按钮
      $(this).attr("data-delete-btn-added", "true"); // 标记为已添加删除按钮
    });
  }

  // 使用循环定时器检查新元素并添加按钮
  function checkAndAttachButtonsPeriodically() {
    attachButtons(); // 首次执行

    setInterval(() => {
      console.log("Checking for new elements...");
      attachButtons(); // 定期执行
    }, 10000); // 例如，每10秒检查一次
  }
  function bindKeyboardEvents() {
    $(document).on("keydown", function (e) {
        // 绑定键盘事件以移动 sessionItem 元素
      let $sessionItem = $('[class*="sessionItem--"]')
      $sessionItem.each((i,n)=>{
        if($(n).is('[class*="activeItem--"]')){
          index = i
        }
      });
      let $current = $('[class*="sessionItem--"][class*="activeItem--"]');
      if (e.altKey && (e.keyCode === 38 || e.keyCode === 40)) {
        // Alt + Up 或 Alt + Down
        if ($current.length === 0) {
          $('[class*="sessionItem--"]')[0].click();
          return;
        }
        if (e.keyCode === 38) {
          // Alt + Up
          index = index - 1
          if(index < 0) index = 0
        } else if (e.keyCode === 40) {
          // Alt + Down
          index = index + 1
          if(index+1 > $sessionItem.length) index = $sessionItem.length -1
        }
        $('[class*="sessionItem--"]')[index].click()
      } else if(e.altKey && e.keyCode === 88) {
          /**
           *  altKey + X
           *  删除选中对话
           */
          $current.children('.anticon').click()
      } else if(e.altKey && e.keyCode === 78){
          /**
           *  altKey + N
           *  新建对话并选中富文本输入框
           */
          $('.tongyi-ui-button').click()
          $('textarea').focus()
      }else if(e.altKey && e.keyCode === 75){
          /**
           * altKey + K
           * 快捷选中富文本输入框
           */
          $('textarea').focus()
      }
    });
  }


  /**
   * 处理星火绑定按键
   */
  function bindXingHuoKeyboardEvents() {
    $(document).on("keydown", function (e) {
      if(e.altKey && e.keyCode === 88) {
        /**
         *  altKey + X
         *  删除选中对话
         */
         $('[class*="HistoryList_list_item_active"]').find('[class*="HistoryList_img_wrap"]').click()

        setTimeout(() => {
          $('[class*="ant-modal-confirm-btns"]').find('[class*="ant-btn-primary"]').click()

        }, 500);
    }
  });
  }

  // 确保页面元素已加载
  let index = 0
  $(document).ready(function () {

    setTimeout(function () {
      const href = window.location.href
        /** 通义 */
      if(href.includes('tongyi')) {
        checkAndAttachButtonsPeriodically();
        bindKeyboardEvents();
      }

      /** 星火 */
      if(href.includes('xinghuo')) {
        bindXingHuoKeyboardEvents()
      }

    }, 1000);
  });
})();
