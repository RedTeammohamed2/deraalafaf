import { AIContentAnalyzer } from './ai-analyzer.js';
import { StorageManager } from './storage-manager.js';
import { NotificationManager } from './notification-manager.js';




async function updateRulesFromServer() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/RedTeammohamed2/BlockWeb/main/blockWeb.json');
    if (!response.ok) throw new Error('Failed to fetch rules');

    const rules = await response.json();
    console.log('Fetched rules:', rules);

    const removeIds = rules.map(rule => rule.id);

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: removeIds,
      addRules: rules
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error updating rules:', chrome.runtime.lastError);
      } else {
        console.log('Dynamic rules updated successfully! Total:', rules.length);

        chrome.declarativeNetRequest.getDynamicRules(current => {
          console.log('Rules currently active:', current);
        });
      }
    });

  } catch (error) {
    console.error('Error fetching rules:', error);
  }
}

updateRulesFromServer();


class ShieldOfChastity {
  constructor() {
    this.analyzer = new AIContentAnalyzer();
    this.storage = new StorageManager();
    this.notifications = new NotificationManager();
    this.isEnabled = true;
    this.adultDomains = [];
    this.adultKeywords = [];
    this.safeSites = [];
    this.safeSearchSettings = {};
    this.init();
  }

  async init() {
    try {
      console.log('Initializing Shield of Chastity...');
      
      // تحميل البيانات من قاعدة البيانات
      await this.loadDatabaseData();
      
      // تحميل الإعدادات
      const settings = await this.storage.getSettings();
      this.isEnabled = settings.protectionEnabled ?? true;

      // إعداد المستمعين
      this.setupListeners();
      
      // إعداد الإنذارات للإحصائيات
      chrome.alarms.create('updateStats', { periodInMinutes: 1 });
      
      // تحديث القواعد
      await this.updateBlockingRules();
      
      // إعداد مراقب الأخطاء العام
      this.setupErrorHandling();
      
      // إعداد النسخ الاحتياطية التلقائية
      this.storage.scheduleAutoBackup();
      
      console.log('Shield of Chastity initialized successfully');
    } catch (error) {
      console.error('Error initializing Shield:', error);
      // محاولة إعادة التهيئة بعد 5 ثوان
      setTimeout(() => this.init(), 5000);
    }
  }

  // تحميل البيانات من قاعدة البيانات
  async loadDatabaseData() {
    try {
      console.log('Loading database data...');
      
      // تحميل البيانات من ملف blacklist.js
      const blacklistModule = await import('../data/blacklist.js');
      
      this.adultDomains = blacklistModule.adultDomains || [];
      this.adultKeywords = blacklistModule.adultKeywords || [];
      this.safeSites = blacklistModule.safeSites || [];
      this.safeSearchSettings = blacklistModule.safeSearchSettings || {};
      
      // تنظيف وتوحيد النطاقات
      this.adultDomains = this.adultDomains.map(domain => 
        domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '')
      ).filter(domain => domain.length > 0);
      
      // إزالة التكرارات
      this.adultDomains = [...new Set(this.adultDomains)];
      
      console.log(`Loaded ${this.adultDomains.length} adult domains`);
      console.log(`Loaded ${this.adultKeywords.length} adult keywords`);
      console.log(`Loaded ${this.safeSites.length} safe sites`);
      
      // التحقق من صحة البيانات
      if (!this.adultDomains.length) {
        throw new Error('No adult domains loaded');
      }
      
      // طباعة بعض النطاقات للتحقق
      console.log('Sample domains:', this.adultDomains.slice(0, 10));
      
    } catch (error) {
      console.error('Error loading database data:', error);
      // استخدام بيانات افتراضية في حالة الفشل
      this.loadFallbackData();
    }
  }

  // تحميل بيانات احتياطية
  loadFallbackData() {
    console.log('Loading fallback data...');
    
    this.adultDomains = [
      'pornhub.com', 'xvideos.com', 'xnxx.com', 'xhamster.com',
      'youporn.com', 'redtube.com', 'tube8.com', 'spankbang.com'
    ];
    
    this.adultKeywords = [
      'porn', 'xxx', 'sex', 'nude', 'naked', 'adult', 'nsfw',
      'سكس', 'نيك', 'جنس', 'عاري', 'إباحي', 'بورن'
    ];
    
    this.safeSites = [
      'google.com', 'youtube.com', 'facebook.com', 'twitter.com',
      'wikipedia.org', 'github.com', 'stackoverflow.com'
    ];
    
    this.safeSearchSettings = {
      google: {
        param: "safe",
        value: "active",
        urlPattern: "*://*.google.*/search*"
      },
      bing: {
        param: "adlt",
        value: "strict",
        urlPattern: "*://*.bing.com/search*"
      }
    };
  }

  setupListeners() {
    // مستمع للرسائل
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true;
    });
    
    // مستمع لأخطاء الإضافة
    chrome.runtime.onSuspend.addListener(() => {
      console.log('Extension is being suspended');
    });
    
    chrome.runtime.onInstalled.addListener((details) => {
      console.log('Extension installed/updated:', details.reason);
      if (details.reason === 'install') {
        this.showWelcomeMessage();
      }
    });

    // مستمع للتنقل
    chrome.webNavigation.onBeforeNavigate.addListener((details) => {
      if (details.frameId === 0) {
        this.checkNavigation(details);
      }
    });

    // مستمع للإنذارات
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'updateStats') {
        this.updateDailyStats();
      }
    });

    // مستمع لتغيير التبويبات
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        this.analyzeTab(tab);
      }
    });

    // إعداد مستمعي الإشعارات
    this.notifications.setupListeners();
  }
  
  setupErrorHandling() {
    // معالج الأخطاء العام
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.logError('Global error', event.error);
    });
    
    // معالج الأخطاء غير المعالجة
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.logError('Unhandled promise rejection', event.reason);
    });
  }

  // تسجيل الأخطاء
  async logError(type, error) {
    try {
      const errorLog = {
        type,
        message: error.message || error.toString(),
        stack: error.stack,
        timestamp: Date.now(),
        url: error.url || 'unknown'
      };
      
      const logs = await this.storage.getSecureData('errorLogs') || [];
      logs.push(errorLog);
      
      // الاحتفاظ بآخر 100 خطأ فقط
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      await this.storage.setSecureData('errorLogs', logs);
    } catch (e) {
      console.error('Error logging error:', e);
    }
  }

  // إظهار رسالة الترحيب
  async showWelcomeMessage() {
    try {
      await this.notifications.showSuccess('مرحباً بك في درع العفاف! تم تفعيل الحماية بنجاح 🛡️');
    } catch (error) {
      console.error('Error showing welcome message:', error);
    }
  }

  // معالج الرسائل مع نظام fallback محسن
  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'analyzeContent':
          const analysis = await this.analyzer.analyzePageContent(request.content);
          if (!analysis.safe && this.isEnabled) {
            await this.blockPage(sender.tab.id, analysis);
          }
          sendResponse(analysis);
          break;

        case 'toggleProtection':
          this.isEnabled = request.enabled;
          await this.storage.setSetting('protectionEnabled', this.isEnabled);
          sendResponse({ success: true });
          break;

        case 'getStats':
          const stats = await this.storage.getStats();
          sendResponse(stats);
          break;

        case 'whitelistSite':
          await this.addToWhitelist(request.domain);
          sendResponse({ success: true });
          break;

        case 'reportSite':
          await this.reportSite(request.url, request.reason);
          sendResponse({ success: true });
          break;

        case 'testStats':
          await this.storage.incrementBlockedCount();
          const testStats = await this.storage.getStats();
          sendResponse({ success: true, stats: testStats });
          break;

        case 'incrementBlockedCount':
          try {
            const result = await this.storage.incrementBlockedCount();
            console.log('Blocked count incremented:', result);
            sendResponse({ success: true, stats: result });
          } catch (error) {
            console.error('Error incrementing blocked count:', error);
            const fallbackStats = await this.getFallbackStats();
            sendResponse({ success: false, error: error.message, fallback: fallbackStats });
          }
          break;

        case 'getDynamicStats':
          try {
            const stats = await this.storage.getDynamicStats();
            sendResponse({ success: true, stats });
          } catch (error) {
            console.error('Error getting dynamic stats:', error);
            const fallbackStats = await this.getFallbackStats();
            sendResponse({ success: false, error: error.message, fallback: fallbackStats });
          }
          break;

        case 'updateDynamicStats':
          try {
            const stats = await this.storage.updateDynamicStats();
            sendResponse({ success: true, stats });
          } catch (error) {
            console.error('Error updating dynamic stats:', error);
            const fallbackStats = await this.getFallbackStats();
            sendResponse({ success: false, error: error.message, fallback: fallbackStats });
          }
          break;

        case 'testBlockSite':
          try {
            const stats = await this.storage.incrementBlockedCount();
            await this.storage.addBlockedSite({
              url: request.url,
              timestamp: Date.now(),
              score: 0.9,
              categories: ['test']
            });
            sendResponse({ success: true, stats });
          } catch (error) {
            console.error('Error testing block site:', error);
            sendResponse({ success: false, error: error.message });
          }
          break;

        case 'getDatabaseInfo':
          sendResponse({
            adultDomainsCount: this.adultDomains.length,
            adultKeywordsCount: this.adultKeywords.length,
            safeSitesCount: this.safeSites.length,
            isEnabled: this.isEnabled
          });
          break;

        case 'reloadDatabase':
          await this.loadDatabaseData();
          sendResponse({ success: true, message: 'Database reloaded successfully' });
          break;

        case 'testDomain':
          const testDomain = request.domain || 'best.pornktube.com';
          const isBlocked = this.isDomainBlocked(testDomain);
          sendResponse({ 
            success: true, 
            domain: testDomain,
            isBlocked: isBlocked,
            adultDomainsCount: this.adultDomains.length,
            matchingDomains: this.adultDomains.filter(d => testDomain.includes(d))
          });
          break;

        default:
          sendResponse({ error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Message handler error:', error);
      this.logError('Message handler error', error);
      sendResponse({ error: 'Internal server error', details: error.message });
    }
  }

  // دالة fallback للحصول على الإحصائيات
  async getFallbackStats() {
    try {
      const result = await this.storage.get(['stats', 'dailyStats', 'whitelist', 'reports']);
      return {
        totalBlocked: result.stats?.blockedCount || 0,
        todayBlocked: result.dailyStats?.blockedToday || 0,
        whitelistCount: result.whitelist?.length || 0,
        reportsCount: result.reports?.length || 0,
        date: new Date().toDateString()
      };
    } catch (error) {
      console.error('Fallback stats error:', error);
      return {
        totalBlocked: 0,
        todayBlocked: 0,
        whitelistCount: 0,
        reportsCount: 0,
        date: new Date().toDateString()
      };
    }
  }

  async checkNavigation(details) {
    if (!this.isEnabled) {
      console.log('Protection is disabled');
      return;
    }

    const url = details.url;
    console.log(`Checking navigation to: ${url}`);
    
    try {
      // تجاهل URLs الخاصة
      if (url.startsWith('chrome://') || 
          url.startsWith('chrome-extension://') ||
          url.startsWith('moz-extension://') ||
          url.startsWith('edge://')) {
        console.log('Skipping internal URL');
        return;
      }

      // تحقق من القائمة البيضاء
      if (await this.isWhitelisted(url)) {
        console.log('URL is whitelisted');
        return;
      }

      // فحص شامل للنطاق والنطاقات الفرعية
      const hostname = new URL(url).hostname;
      const isBlocked = this.isDomainBlocked(hostname);
      
      if (isBlocked) {
        console.log(`🚫 Blocking navigation to: ${url}`);
        await this.blockPage(details.tabId, { 
          score: 1, 
          categories: ['adult_domain'],
          confidence: 0.95,
          blockedDomain: hostname,
          originalUrl: url
        });
        return;
      }

      // تحليل URL باستخدام المحلل
      console.log('Analyzing URL with AI analyzer...');
      const urlAnalysis = await this.analyzer.analyzeURL(url);
      
      if (!urlAnalysis.safe) {
        console.log(`🚫 Blocking URL based on AI analysis: ${url}`);
        await this.blockPage(details.tabId, {
          ...urlAnalysis,
          originalUrl: url
        });
      } else {
        console.log(`✅ URL is safe: ${url}`);
      }
    } catch (error) {
      console.error('Error checking navigation:', error);
      this.logError('Navigation check error', error);
    }
  }

  // دالة جديدة لفحص النطاق والنطاقات الفرعية
  isDomainBlocked(hostname) {
    if (!hostname || !this.adultDomains.length) {
      return false;
    }
    
    // تنظيف النطاق
    const cleanHostname = hostname.toLowerCase().trim().replace(/^www\./, '');
    
    console.log(`Checking domain: ${cleanHostname}`);
    console.log(`Total blocked domains: ${this.adultDomains.length}`);
    
    // فحص النطاق الكامل أولاً
    if (this.adultDomains.includes(cleanHostname)) {
      console.log(`✅ Blocked domain (exact match): ${cleanHostname}`);
      return true;
    }
    
    // فحص النطاقات الفرعية
    const domainParts = cleanHostname.split('.');
    
    // فحص جميع النطاقات الفرعية المحتملة
    for (let i = 0; i < domainParts.length - 1; i++) {
      const subDomain = domainParts.slice(i).join('.');
      
      if (this.adultDomains.includes(subDomain)) {
        console.log(`✅ Blocked subdomain: ${cleanHostname} matches ${subDomain}`);
        return true;
      }
    }
    
    // فحص النطاق الرئيسي (آخر جزئين)
    if (domainParts.length >= 2) {
      const mainDomain = domainParts.slice(-2).join('.');
      if (this.adultDomains.includes(mainDomain)) {
        console.log(`✅ Blocked main domain: ${cleanHostname} matches ${mainDomain}`);
        return true;
      }
    }
    
    // فحص النطاق الجذر (آخر جزء)
    const rootDomain = domainParts.slice(-1).join('.');
    if (this.adultDomains.includes(rootDomain)) {
      console.log(`✅ Blocked root domain: ${cleanHostname} matches ${rootDomain}`);
      return true;
    }
    
    // فحص إضافي: البحث عن النطاق في أي جزء من النطاق المدخل
    for (const blockedDomain of this.adultDomains) {
      if (cleanHostname.includes(blockedDomain) || blockedDomain.includes(cleanHostname)) {
        console.log(`✅ Blocked domain (partial match): ${cleanHostname} matches ${blockedDomain}`);
        return true;
      }
    }
    
    console.log(`❌ Domain not blocked: ${cleanHostname}`);
    return false;
  }

  async analyzeTab(tab) {
    if (!this.isEnabled || !tab.url) return;

    try {
      // تجاهل URLs الخاصة
      if (tab.url.startsWith('chrome://') || 
          tab.url.startsWith('chrome-extension://')) return;

      // فحص شامل للنطاق والنطاقات الفرعية
      const hostname = new URL(tab.url).hostname;
      const isBlocked = this.isDomainBlocked(hostname);
      
      if (isBlocked) {
        await this.blockPage(tab.id, { 
          score: 1, 
          categories: ['adult_domain'],
          confidence: 0.95,
          blockedDomain: hostname
        });
      }
    } catch (error) {
      console.error('Error analyzing tab:', error);
      this.logError('Tab analysis error', error);
    }
  }

  async blockPage(tabId, analysis) {
    try {
      console.log(`🚫 Blocking page: Tab ${tabId}, Analysis:`, analysis);
      
      // تحديث الإحصائيات
      await this.storage.incrementBlockedCount();
      
      // حفظ معلومات الموقع المحظور
      const blockedSiteInfo = {
        url: analysis.originalUrl || (await chrome.tabs.get(tabId)).url,
        timestamp: Date.now(),
        score: analysis.score || 1,
        categories: analysis.categories || ['adult_domain'],
        blockedDomain: analysis.blockedDomain,
        confidence: analysis.confidence || 0.95
      };
      
      await this.storage.addBlockedSite(blockedSiteInfo);

      // إظهار إشعار
      await this.notifications.showBlocked();

      // توجيه لصفحة الحظر
      const blockedUrl = chrome.runtime.getURL('pages/blocked.html');
      console.log(`Redirecting to blocked page: ${blockedUrl}`);
      
      await chrome.tabs.update(tabId, {
        url: blockedUrl
      });
      
      console.log(`✅ Successfully blocked and redirected tab ${tabId}`);
    } catch (error) {
      console.error('Error blocking page:', error);
      this.logError('Block page error', error);
      
      // محاولة إعادة التوجيه حتى لو فشل حفظ البيانات
      try {
        const blockedUrl = chrome.runtime.getURL('pages/blocked.html');
        await chrome.tabs.update(tabId, {
          url: blockedUrl
        });
        console.log('Fallback redirect successful');
      } catch (redirectError) {
        console.error('Fallback redirect failed:', redirectError);
      }
    }
  }

  async isWhitelisted(url) {
    try {
      const hostname = new URL(url).hostname;
      const whitelist = await this.storage.getWhitelist();
      
      // فحص النطاق الكامل
      if (this.safeSites.includes(hostname) || whitelist.includes(hostname)) {
        return true;
      }
      
      // إزالة www. والفحص مرة أخرى
      const cleanHostname = hostname.replace(/^www\./, '');
      if (this.safeSites.includes(cleanHostname) || whitelist.includes(cleanHostname)) {
        return true;
      }
      
      // فحص النطاقات الفرعية للقائمة البيضاء
      const domainParts = cleanHostname.split('.');
      
      // فحص جميع النطاقات الفرعية المحتملة
      for (let i = 0; i < domainParts.length - 1; i++) {
        const subDomain = domainParts.slice(i).join('.');
        
        if (this.safeSites.includes(subDomain) || whitelist.includes(subDomain)) {
          return true;
        }
      }
      
      // فحص النطاق الرئيسي
      const mainDomain = domainParts.slice(-2).join('.');
      if (this.safeSites.includes(mainDomain) || whitelist.includes(mainDomain)) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking whitelist:', error);
      return false;
    }
  }

  async addToWhitelist(domain) {
    try {
      const whitelist = await this.storage.getWhitelist();
      if (!whitelist.includes(domain)) {
        whitelist.push(domain);
        await this.storage.setWhitelist(whitelist);
        console.log(`Added ${domain} to whitelist`);
      }
    } catch (error) {
      console.error('Error adding to whitelist:', error);
      this.logError('Add to whitelist error', error);
    }
  }
}

// تهيئة الإضافة
const shield = new ShieldOfChastity();
shield.init();