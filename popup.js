// تهيئة المتغيرات
let blockedCount = 0;
let isSettingsOpen = false;
let isStatsOpen = false;

// تحديث حالة الحماية
const statusDiv = document.getElementById('status');
const protectionLevelElement = document.getElementById('protectionLevel');
const blockedCountElement = document.getElementById('blockedCount');

// تحديث الإحصائيات
function updateStats() {
  chrome.storage.local.get(['blockedCount', 'protectionLevel'], function(result) {
    blockedCount = result.blockedCount && Number.isInteger(result.blockedCount) ? result.blockedCount : 0;
    blockedCountElement.textContent = blockedCount.toLocaleString('ar-SA');
    protectionLevelElement.textContent = result.protectionLevel || 'قوي';
  });
}

// إضافة الأحداث للأزرار مع التحقق من وجود العناصر
const statsBtn = document.getElementById('statsBtn');
if (statsBtn) {
  statsBtn.addEventListener('click', function() {
    chrome.tabs.create({ url: 'stats.html' });
  });
}

const settingsBtn = document.getElementById('settingsBtn');
if (settingsBtn) {
  settingsBtn.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });
}

const reportBtn = document.getElementById('reportBtn');
if (reportBtn) {
  reportBtn.addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://t.me/DeraAlafaf_Support' });
  });
}

const helpBtn = document.getElementById('helpBtn');
if (helpBtn) {
  helpBtn.addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://t.me/DeraAlafaf_Help' });
  });
}

// تحديث الحالة عند التغيير مع التحقق من البيانات
chrome.storage.onChanged.addListener(function(changes) {
  if (changes.blockedCount && Number.isInteger(changes.blockedCount.newValue)) {
    blockedCount = changes.blockedCount.newValue;
    blockedCountElement.textContent = blockedCount.toLocaleString('ar-SA');
  }
});

// إزالة الأنيميشن غير الضرورية لتحسين الأداء
// تحديث الإحصائيات عند فتح النافذة
updateStats();
