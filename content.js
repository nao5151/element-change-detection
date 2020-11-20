'use strict';

function init() {
  let target, parentNode;
  document.addEventListener('contextmenu', (e) => {
    target = e.target;
    parentNode = e.target.parentNode;
  }, true);

  const observe = (port) => {
    const observer = new MutationObserver((mutationsList, observer) => {
      port.postMessage('change');
      observer.disconnect();
    });
    observer.observe(parentNode, {attributes: true, childList: true, subtree: true, characterData: true});
  }

  chrome.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(msg => {
      if (msg === 'start') {
        observe(port);
      } else if (msg === 'notify') {
        parentNode = undefined;
        target = undefined;
        port.disconnect();
      }
    });
  });
}
init();
