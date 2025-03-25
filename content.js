// 广告拦截器内容脚本
console.log('AdBlocker Pro content script loaded');

// 监听来自 background.js 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStats') {
    // 获取当前页面的广告拦截统计
    sendResponse({ blocked: window.adBlockerStats || 0 });
  }
});

// 初始化页面统计
window.adBlockerStats = 0;

// 记录被拦截的广告
function logBlockedAd() {
  window.adBlockerStats++;
  // 通知 background.js 更新统计
  chrome.runtime.sendMessage({
    action: 'updateStats',
    stats: window.adBlockerStats
  });
}

// 监听广告元素
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // 检查是否是广告元素
        if (isAdElement(node)) {
          node.style.display = 'none';
          logBlockedAd();
        }
      }
    });
  });
});

// 开始观察 DOM 变化
observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

// 检查元素是否是广告
function isAdElement(element) {
  // 检查常见的广告类名和 ID
  const adClasses = ['ad', 'advertisement', 'sponsored', 'promoted'];
  const adIds = ['ad', 'advertisement', 'sponsored', 'promoted'];
  
  // 检查类名
  if (element.className) {
    const classes = element.className.toLowerCase();
    if (adClasses.some(adClass => classes.includes(adClass))) {
      return true;
    }
  }
  
  // 检查 ID
  if (element.id) {
    const id = element.id.toLowerCase();
    if (adIds.some(adId => id.includes(adId))) {
      return true;
    }
  }
  
  // 检查父元素
  let parent = element.parentElement;
  while (parent) {
    if (isAdElement(parent)) {
      return true;
    }
    parent = parent.parentElement;
  }
  
  return false;
} 