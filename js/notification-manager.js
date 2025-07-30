export class NotificationManager {
    constructor() {
      this.notificationQueue = [];
      this.isProcessing = false;
    }
  
    async showBlocked() {
      const settings = await chrome.storage.local.get('settings');
      if (!settings.settings?.notifications) return;
  
      const messages = [
        'تم حظر محتوى غير لائق 🛡️',
        'تمت حمايتك من محتوى ضار ✅',
        'درع العفاف يحميك 🔒'
      ];
  
      const message = messages[Math.floor(Math.random() * messages.length)];
  
      await this.createNotification({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icon1.png'),
        title: 'درع العفاف',
        message: message,
        buttons: [
          { title: 'استغفر الله' },
          { title: 'عرض الإحصائيات' }
        ]
      });
    }
  
    async showWarning(message) {
      await this.createNotification({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icon1.png'),
        title: 'تحذير',
        message: message
      });
    }
  
    async showSuccess(message) {
      await this.createNotification({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icon1.png'),
        title: 'نجاح',
        message: message
      });
    }
  
    async createNotification(options) {
      return new Promise((resolve) => {
        chrome.notifications.create(
          `soc-${Date.now()}`,
          options,
          (notificationId) => {
            resolve(notificationId);
            
            // إغلاق تلقائي بعد 5 ثوان
            setTimeout(() => {
              chrome.notifications.clear(notificationId);
            }, 5000);
          }
        );
      });
    }
  
    setupListeners() {
      chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
        if (notificationId.startsWith('soc-')) {
          if (buttonIndex === 0) {
            // فتح صفحة الاستغفار
            chrome.tabs.create({
              url: chrome.runtime.getURL('pages/istighfar.html')
            });
          } else if (buttonIndex === 1) {
            // فتح الإحصائيات
            chrome.action.openPopup();
          }
        }
      });
    }
  }