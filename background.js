// 广告域名列表
const adDomains = [
  // 通用广告网络
  "doubleclick.net",
  "google-analytics.com",
  "adnxs.com",
  "advertising.com",
  "googlesyndication.com",
  "amazon-adsystem.com",
  "adtechus.com",
  "adbrite.com",
  "quantserve.com",
  "scorecardresearch.com",
  "zedo.com",
  "admob.com",
  "chitika.com",
  
  // 百度相关
  "pos.baidu.com",
  "cpro.baidu.com",
  "hm.baidu.com",
  "eclick.baidu.com",
  "nsclick.baidu.com",
  "adv.baidu.com",
  "baidustatic.com",
  "cbjs.baidu.com",
  "cpro.baidustatic.com",
  "dup.baidustatic.com",
  
  // Google相关
  "googleadservices.com",
  "pagead2.googlesyndication.com",
  "tpc.googlesyndication.com",
  "googletagservices.com",
  "google-analytics.com",
  "googletagmanager.com",
  "adsense.google.com",
  
  // 其他搜索引擎
  "ads.yahoo.com",
  "gemini.yahoo.com",
  "beap.gemini.yahoo.com",
  "sogou.com/bill",
  "union.360.cn",
  "lianmeng.360.cn",
  "s.360.cn",
  
  // 社交媒体广告
  "ads.twitter.com",
  "ads-twitter.com",
  "ads.facebook.com",
  "an.facebook.com",
  
  // 视频网站广告
  "ads.youtube.com",
  "ads-api.tiktok.com",
  "ad.doubleclick.net",
  "static.doubleclick.net",
  
  // 新增视频网站广告域名
  "vali.cp31.ott.cibntv.net",    // 优酷
  "atm.youku.com",               // 优酷
  "val.atm.youku.com",          // 优酷
  "valf.atm.youku.com",         // 优酷
  "pl.cp31.ott.cibntv.net",     // 优酷
  "ad.api.3g.youku.com",        // 优酷移动端
  "actives.youku.com",          // 优酷活动
  "ad.m.iqiyi.com",             // 爱奇艺移动端
  "cupid.iqiyi.com",            // 爱奇艺
  "t7z.cupid.iqiyi.com",        // 爱奇艺
  "nl.rcd.iqiyi.com",           // 爱奇艺
  "static-s.iqiyi.com",         // 爱奇艺静态资源
  "iqiyipic.com",               // 爱奇艺图片
  "data.video.iqiyi.com",       // 爱奇艺视频数据
  "v.admaster.com.cn",          // 通用视频广告
  "v2.reachmax.cn",             // 通用视频广告
  "ems.youku.com",              // 优酷广告监测
  "ad.qq.com",                  // 腾讯视频
  "lives.l.qq.com",             // 腾讯视频直播广告
  "vv.video.qq.com",            // 腾讯视频
  "wa.gtimg.com",               // 腾讯广告
  "btrace.video.qq.com",        // 腾讯视频追踪
  "adx.ads.oppomobile.com",     // OPPO广告
  "api.ad.xiaomi.com",          // 小米广告
  
  // 中文网站广告
  "union.sina.com.cn",
  "alimama.com",
  "tanx.com",
  "gdt.qq.com",
  "l.qq.com",
  "adm.10jqka.com.cn"
];

// 广告URL关键词
const adKeywords = [
  // 英文关键词
  "ad", "ads", "advert",
  "banner", "popup", "popunder",
  "advertising", "advertisement",
  "commercial", "sponsored",
  "promoted", "marketing",
  "tracking", "analytics",
  
  // 中文关键词
  "guanggao",    // 广告
  "tuiguang",    // 推广
  "tuisong",     // 推送
  "jiaoyi",      // 交易
  "huodong",     // 活动
  "tanchuang",   // 弹窗
  
  // 广告相关
  "cpro",
  "union",
  "adsense",
  "adserv",
  "bidding",
  "banner",
  "sponsor",
  "tracking",
  "click",
  
  // 新增视频广告关键词
  "preroll",           // 前置广告
  "preload",          // 预加载广告
  "preplay",          // 播放前广告
  "midroll",          // 中插广告
  "postroll",         // 后置广告
  "videoad",          // 视频广告
  "adplayer",         // 广告播放器
  "adsdk",            // 广告SDK
  "adapi",            // 广告API
  "adshow",           // 广告展示
  "adstart",          // 广告开始
  "adbreak",          // 广告中断
  "adunit",           // 广告单元
  "advideo",          // 广告视频
  "adplay",           // 广告播放
  "shiping",          // 视频
  "guanggaoshiping",  // 广告视频
  "qianzhishiping",   // 前置视频
  "videotrace",       // 视频追踪
  "videostat",        // 视频统计
];

// 检查URL是否包含广告关键词
function containsAdKeyword(url) {
  return adKeywords.some(keyword => url.toLowerCase().includes(keyword));
}

// 检查域名是否是广告域名
function isAdDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    return adDomains.some(domain => hostname.includes(domain));
  } catch (e) {
    return false;
  }
}

// 检查请求类型
function isAdRequest(details) {
  // 检查资源类型
  const adResourceTypes = ['image', 'script', 'xmlhttprequest', 'sub_frame'];
  if (adResourceTypes.includes(details.type)) {
    // 检查请求头
    const headers = details.requestHeaders || [];
    const referer = headers.find(h => h.name.toLowerCase() === 'referer');
    if (referer && containsAdKeyword(referer.value)) {
      return true;
    }
  }
  return false;
}

// 统计数据
let blockedCount = 0;
let startTime = Date.now();
let isBlockingEnabled = true;

// 初始化时从storage恢复状态
chrome.storage.local.get(['isBlockingEnabled', 'blockedCount', 'startTime'], (result) => {
  if (result.isBlockingEnabled !== undefined) {
    isBlockingEnabled = result.isBlockingEnabled;
  }
  if (result.blockedCount !== undefined) {
    blockedCount = result.blockedCount;
  }
  if (result.startTime !== undefined) {
    startTime = result.startTime;
  }
  
  // 设置初始规则状态
  updateRulesetEnabled(isBlockingEnabled);
});

// 更新规则集启用状态
async function updateRulesetEnabled(enabled) {
  try {
    if (enabled) {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: ["ruleset_1"]
      });
    } else {
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: ["ruleset_1"]
      });
    }
  } catch (error) {
    console.error('Error updating ruleset:', error);
  }
}

// 更新统计数据
function updateStats() {
  if (!isBlockingEnabled) return;
  blockedCount++;
  chrome.storage.local.set({ blockedCount });
  
  // 广播统计更新消息
  broadcastMessage({
    type: 'statsUpdate',
    data: {
      blockedCount: blockedCount,
      timeSaved: ((Date.now() - startTime) / 1000).toFixed(1)
    }
  });
}

// 广播消息到所有打开的popup
function broadcastMessage(message) {
  chrome.runtime.sendMessage(message).catch(() => {
    // 忽略错误 - popup可能未打开
  });
}

// 监听规则匹配事件
chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener(
  (info) => {
    if (isBlockingEnabled) {
      updateStats();
    }
  }
);

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  switch (message.type) {
    case 'getStats':
      sendResponse({
        blockedCount: blockedCount,
        timeSaved: ((Date.now() - startTime) / 1000).toFixed(1)
      });
      break;

    case 'toggleBlocking':
      isBlockingEnabled = message.enabled;
      chrome.storage.local.set({ isBlockingEnabled });
      
      // 更新规则集状态
      updateRulesetEnabled(isBlockingEnabled);
      
      // 广播状态更新
      broadcastMessage({
        type: 'blockingStatusUpdate',
        enabled: isBlockingEnabled
      });
      
      sendResponse({ success: true });
      break;

    case 'getBlockingStatus':
      sendResponse({ enabled: isBlockingEnabled });
      break;

    default:
      sendResponse({ error: 'Unknown message type' });
      break;
  }
  
  return true; // 保持消息通道开放
}); 