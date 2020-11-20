'use strict';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({id: 'change-detection-menu', "title": 'Change Detection', "contexts": ['all']});
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    const port = chrome.tabs.connect(tab.id);
    port.postMessage('start');
    port.onMessage.addListener(msg => {
      if (msg === 'change') {
        chrome.notifications.create('1', {
          type: 'basic',
          iconUrl: 'images/icon128.png',
          title: '変更検知',
          message: '変更があります。確認してください。'
        });
        port.postMessage('notify');
        chrome.notifications.onClicked.addListener((notificationId) => {
          chrome.notifications.clear(notificationId);
          chrome.tabs.update(tab.id, {'active': true});
        });
      }
    });
  });
});
