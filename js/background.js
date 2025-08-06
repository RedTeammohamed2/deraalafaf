
// background.js - ملف الخلفية للإضافة

// فتح موقع عند تثبيت الإضافة
chrome.runtime.onInstalled.addListener((details) => {
  // تحقق من نوع التثبيت
  if (details.reason === 'install') {
    // عند التثبيت لأول مرة
    console.log('تم تثبيت الإضافة لأول مرة');
    
    // فتح الموقع في تبويب جديد
    chrome.tabs.create({
      url: 'https://der3lafaf.netlify.app/',
      active: true // جعل التبويب نشط (في المقدمة)
    });
    
    // حفظ وقت التثبيت (اختياري)
    chrome.storage.local.set({
      'extensionInstallTime': Date.now(),
      'installDate': new Date().toISOString()
    });
    
  } else if (details.reason === 'update') {
    // عند تحديث الإضافة
    console.log('تم تحديث الإضافة من الإصدار:', details.previousVersion);
    
  } else if (details.reason === 'chrome_update') {
    // عند تحديث Chrome
    console.log('تم تحديث متصفح Chrome');
  }
});

// تعيين رابط عند إلغاء تثبيت الإضافة
chrome.runtime.setUninstallURL("https://der3lafaf.netlify.app/uninstall");

// دالة إضافية لفتح الموقع يدوياً (اختيارية)
function openWelcomePage() {
  chrome.tabs.create({
    url: 'https://der3lafaf.netlify.app/',
    active: true
  });
}

// استمع لرسائل من popup أو content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openWelcomePage') {
    openWelcomePage();
    sendResponse({success: true});
  }
  
  if (request.action === 'getInstallInfo') {
    chrome.storage.local.get(['extensionInstallTime', 'installDate'], (result) => {
      sendResponse({
        installTime: result.extensionInstallTime,
        installDate: result.installDate,
        isFirstInstall: !!result.extensionInstallTime
      });
    });
    return true; // للإشارة إلى استخدام sendResponse بشكل غير متزامن
  }
});

// دالة للتحقق من التثبيت الأول (يمكن استخدامها في أجزاء أخرى من الإضافة)
async function isFirstInstall() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['extensionInstallTime'], (result) => {
      resolve(!result.extensionInstallTime);
    });
  });
}

// دالة لحساب الوقت منذ التثبيت
async function getTimeSinceInstall() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['extensionInstallTime'], (result) => {
      if (result.extensionInstallTime) {
        const minutes = Math.floor((Date.now() - result.extensionInstallTime) / (1000 * 60));
        resolve(minutes);
      } else {
        resolve(0);
      }
    });
  });
}
// =========================================================================

// قائمة الكلمات المحظورة
const BLOCKED_WORDS = [
    "porn", "sex", "adult", "xxx", "nude", "naked"
];

// حفظ الكلمات في storage عند تشغيل الإضافة
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.set({ 'blockedWords': BLOCKED_WORDS });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ 'blockedWords': BLOCKED_WORDS });
});

// مراقبة تحديث الصفحات
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
        checkUrlForBlockedContent(tab.url, tabId);
    }
});

// مراقبة الصفحات الجديدة
chrome.tabs.onCreated.addListener((tab) => {
    if (tab.url && !tab.url.startsWith('chrome://')) {
        checkUrlForBlockedContent(tab.url, tab.id);
    }
});

// استقبال الرسائل من content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'blockSearch') {
        blockCurrentTab(sender.tab.id);
    } else if (message.action === 'getBlockedWords') {
        chrome.storage.local.get(['blockedWords'], (result) => {
            sendResponse({ words: result.blockedWords || BLOCKED_WORDS });
        });
        return true; // للإشارة أن الاستجابة ستكون async
    }
});

// فحص الرابط للكلمات المحظورة
function checkUrlForBlockedContent(url, tabId) {
    const urlLower = decodeURIComponent(url).toLowerCase();
    
    for (let word of BLOCKED_WORDS) {
        if (urlLower.includes(word.toLowerCase())) {
            blockCurrentTab(tabId);
            break;
        }
    }
}

// حظر الصفحة الحالية
function blockCurrentTab(tabId) {
    const blockedPageUrl = chrome.runtime.getURL('../pages/blocked.html');
    chrome.tabs.update(tabId, { url: blockedPageUrl });
}

// =============================================================================
let blockYoutube = true;
let blockFacebook = true;
let blockInstagram = true;
let blockTiktok = true; // إضافة متغير التيك توك

chrome.storage.local.get(['blockYoutube', 'blockFacebook', 'blockInstagram', 'blockTiktok'], (result) => {
  blockYoutube = result.blockYoutube ?? true;
  blockFacebook = result.blockFacebook ?? true;
  blockInstagram = result.blockInstagram ?? true;
  blockTiktok = result.blockTiktok ?? true; // جلب حالة التيك توك
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'toggleYoutube':
      blockYoutube = message.enabled;
      sendResponse({ status: 'youtube updated' });
      break;
    case 'toggleFacebook':
      blockFacebook = message.enabled;
      sendResponse({ status: 'facebook updated' });
      break;
    case 'toggleInstagram':
      blockInstagram = message.enabled;
      sendResponse({ status: 'instagram updated' });
      break;
    case 'toggleTiktok': // إضافة حالة التيك توك
      blockTiktok = message.enabled;
      sendResponse({ status: 'tiktok updated' });
      break;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.url) return;

  if (blockYoutube && changeInfo.url.includes('/shorts/')) {
    chrome.tabs.update(tabId, { url: chrome.runtime.getURL('../pages/blocked-shorts.html') });
  }
  if (blockFacebook && changeInfo.url.includes('/reel/')) {
    chrome.tabs.update(tabId, { url: chrome.runtime.getURL('../pages/blocked-facebook.html') });
  }
  if (blockInstagram && (changeInfo.url.includes('/reel/') || changeInfo.url.includes('/reels/'))) {
    chrome.tabs.update(tabId, { url: chrome.runtime.getURL('../pages/blocked-inst.html') });
  }
  if (blockTiktok && (changeInfo.url.includes('tiktok.com') || changeInfo.url.includes('tiktokv.com'))) {
    chrome.tabs.update(tabId, { url: chrome.runtime.getURL('../pages/blocked-tiktok.html') });
  }
});

// =========================================================================
