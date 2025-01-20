// ==UserScript==
// @name         ai enhance
// @namespace    http://gm.russell.nowhere/
// @version      0.3
// @description  easier ai operate
// @author       Russell
// @match        https://tongyi.aliyun.com/*
// @match        https://xinghuo.xfyun.cn/*
// @match        https://kimi.moonshot.cn/*
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
      $(this).prepend(button.clone(true));
      $(this).attr("data-delete-btn-added", "true");
    });
  }

  /**
   * 使用循环定时器检查新元素并添加按钮
   */
  function checkAndAttachButtonsPeriodically() {
    attachButtons();

    setInterval(() => {
      console.log("Checking for new elements...");
      attachButtons();
    }, 10000);
  }

  function gotoSessionTongyi($current, e, $sessionItem) {
    // Alt + Up 或 Alt + Down
    if ($current.length === 0) {
      $('[class*="sessionItem--"]')[0].click();
      return;
    }
    if (e.keyCode === 38) {
      // Alt + Up
      index = index - 1
      if (index < 0) index = 0
    } else if (e.keyCode === 40) {
      // Alt + Down
      index = index + 1
      if (index + 1 > $sessionItem.length) index = $sessionItem.length - 1
    }
    $('[class*="sessionItem--"]')[index].click()
  }

  function bindKeyboardEventsTongyi() {
    $(document).on("keydown", function (e) {
      // 绑定键盘事件以移动 sessionItem 元素
      let $sessionItem = $('[class*="sessionItem--"]')
      $sessionItem.each((i, n) => {
        if ($(n).is('[class*="activeItem--"]')) {
          index = i
        }
      });
      let $current = $('[class*="sessionItem--"][class*="activeItem--"]');
      if (e.altKey && (e.keyCode === 38 || e.keyCode === 40)) {
        gotoSessionTongyi($current, e, $sessionItem);
      } else if (e.altKey && e.keyCode === 88) {
        /**
         *  altKey + X
         *  删除选中对话
         */
        $current.children('.anticon').click()
      } else if (e.altKey && e.keyCode === 78) {
        /**
         *  altKey + N
         *  新建对话并选中富文本输入框
         */
        $('.tongyi-ui-button').click()
        $('textarea').focus()
      } else if (e.altKey && e.keyCode === 75) {
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

  function newSession_Kimi(){
    if ($('[class^="myAgentTool___"]').length) {
      $('[class^="myAgentTool___"]')[0].click();
    } else if ($('.sidebar-action-button.new-chat>button').length) {
      $('.sidebar-action-button.new-chat>button')[0].click();
    }
  }

  function removeKimiSession() {
    if ($('.chat-header-content').length) {
      $('.chat-header-content').click();
      setTimeout(() => {
        $('.chat-operations').find('.danger').click()
        setTimeout(() => {
          $('.confirm-action').find('.btn-confirm').click()
        }, 500);
      }, 500);
    } else if ($('[class^="chatHeaderBox___"]').length) {
      $('[class^="chatHeaderBox___"]')[0].children[0].click();
      setTimeout(() => {
        $('.MuiList-root').find('[class*="delete___"]')[0].click()
        setTimeout(function () {
          $('.MuiDialogActions-root').find('.MuiButtonBase-root')[1].click()
          setTimeout(() => {
            newSession_Kimi();
          }, 50);
        }, 100);
      }, 100);
    }
  }

  /**
   * 处理KiMi绑定按键
   */
  function bindKiMiKeyboardEvents() {
    $(document).on("keydown", function (e) {
      if(e.altKey && e.keyCode === 88) {
        removeKimiSession();
      }

      if(e.altKey && e.keyCode === 78){
        newSession_Kimi();
      }
    });
  }

  // 确保页面元素已加载
  let index = 0
  $(document).ready(function () {

    setTimeout(function () {
      const href = window.location.href
      if(href.includes('tongyi')) {
        checkAndAttachButtonsPeriodically();
        bindKeyboardEventsTongyi();
      }

      if(href.includes('xinghuo')) {
        bindXingHuoKeyboardEvents()
      }

      if(href.includes('kimi')) {
        bindKiMiKeyboardEvents()
      }

    }, 1000);
  });
})();
