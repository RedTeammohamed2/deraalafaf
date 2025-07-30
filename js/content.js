class ContentScanner {
    constructor() {
      this.observer = null;
      this.scanInterval = null;
      this.lastScan = 0;
      this.processQueue = [];
      this.isProcessing = false;
      this.blockedElements = new Set();
      this.init();
    }
  
    init() {
      // فحص أولي
      this.scanPage();
  
      // إعداد المراقب
      this.setupObserver();
  
      // فحص دوري محسن - زيادة الفاصل الزمني لتحسين الأداء
      this.scanInterval = setInterval(() => {
        // فحص ما إذا كانت الصفحة نشطة
        if (!document.hidden && document.visibilityState === 'visible') {
          this.scanPage();
        }
      }, 15000); // زيادة الفاصل إلى 15 ثانية
  
      // مستمع للأحداث
      this.setupEventListeners();
    }
  
    setupObserver() {
      this.observer = new MutationObserver((mutations) => {
        // تجنب الفحص المتكرر
        if (Date.now() - this.lastScan < 1000) return;
        
        const hasSignificantChange = mutations.some(mutation => 
          mutation.addedNodes.length > 0 || 
          mutation.type === 'characterData'
        );
  
        if (hasSignificantChange) {
          this.scanPage();
        }
      });
  
      if (document.body) {
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }
    }
  
    setupEventListeners() {
      // حظر النقر الأيمن على الصور المشبوهة
      document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
          const src = e.target.src || '';
          if (this.isSuspiciousMedia(src)) {
            e.preventDefault();
            this.blurElement(e.target);
          }
        }
      });
  
      // مراقبة الصور الجديدة
      document.addEventListener('load', (e) => {
        if (e.target.tagName === 'IMG') {
          this.checkImage(e.target);
        }
      }, true);
  
      // مراقبة الفيديوهات
      document.addEventListener('play', (e) => {
        if (e.target.tagName === 'VIDEO') {
          this.checkVideo(e.target);
        }
      }, true);
    }
  
    async scanPage() {
      // تجنب الفحص المتكرر
      const now = Date.now();
      if (now - this.lastScan < 2000) return;
      this.lastScan = now;
      
      // إضافة المهمة إلى قائمة الانتظار
      this.addToProcessQueue(async () => {
        try {
          // جمع محتوى الصفحة بشكل أكثر كفاءة
          const pageContent = {
            title: document.title,
            url: window.location.href,
            text: this.extractText(),
            images: document.images.length,
            videos: document.getElementsByTagName('video').length,
            links: this.extractLinks(),
            meta: this.extractMetadata()
          };
      
          // إرسال للتحليل
          const response = await chrome.runtime.sendMessage({
            action: 'analyzeContent',
            content: pageContent
          });
      
          if (response && !response.safe) {
            this.handleUnsafeContent(response);
          }
          
          // فحص الوسائط بشكل متوازي
          await this.scanMedia();
        } catch (error) {
          console.error('Error scanning page:', error);
        }
      });
    }
    
    // إضافة مهمة إلى قائمة الانتظار
    addToProcessQueue(task) {
      this.processQueue.push(task);
      this.processNextTask();
    }
    
    // معالجة المهام بشكل متسلسل
    async processNextTask() {
      if (this.isProcessing || this.processQueue.length === 0) return;
      
      this.isProcessing = true;
      const task = this.processQueue.shift();
      
      try {
        await task();
      } catch (error) {
        console.error('Error processing task:', error);
      } finally {
        this.isProcessing = false;
        this.processNextTask();
      }
    }
  
    extractText() {
      // استخراج النص مع تجنب العناصر المخفية
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            
            const style = window.getComputedStyle(parent);
            if (style.display === 'none' || style.visibility === 'hidden') {
              return NodeFilter.FILTER_REJECT;
            }
            
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
  
      let text = '';
      let node;
      let count = 0;
      
      while ((node = walker.nextNode()) && count < 1000) {
        text += node.textContent + ' ';
        count++;
      }
  
      return text.substring(0, 5000); // حد أقصى 5000 حرف
    }
  
    extractLinks() {
      const links = Array.from(document.links).slice(0, 100);
      return links.map(link => ({
        href: link.href,
        text: link.textContent.substring(0, 100)
      }));
    }
  
    extractMetadata() {
      const meta = {};
      const metaTags = document.getElementsByTagName('meta');
      
      for (const tag of metaTags) {
        const name = tag.getAttribute('name') || tag.getAttribute('property');
        const content = tag.getAttribute('content');
        
        if (name && content) {
          meta[name] = content;
        }
      }
      
      return meta;
    }
  
    async scanMedia() {
      // استخدام تقنية تقسيم المهام لتحسين الأداء
      return new Promise(resolve => {
        // استخدام requestAnimationFrame للحفاظ على أداء الصفحة
        requestAnimationFrame(async () => {
          // فحص الصور بدفعات
          const images = Array.from(document.getElementsByTagName('img'));
          await this.processBatch(images, this.checkImage.bind(this), 10);
          
          // فحص الفيديوهات
          const videos = Array.from(document.getElementsByTagName('video'));
          await this.processBatch(videos, this.checkVideo.bind(this), 5);
          
          // فحص iframes
          const iframes = Array.from(document.getElementsByTagName('iframe'));
          await this.processBatch(iframes, this.checkIframe.bind(this), 5);
          
          resolve();
        });
      });
    }
    
    // معالجة العناصر على دفعات
    async processBatch(elements, processFn, batchSize) {
      // تجاهل العناصر التي تم حظرها بالفعل
      const unprocessedElements = elements.filter(el => !this.blockedElements.has(el));
      
      for (let i = 0; i < unprocessedElements.length; i += batchSize) {
        const batch = unprocessedElements.slice(i, i + batchSize);
        
        // معالجة الدفعة الحالية
        const promises = batch.map(element => processFn(element));
        await Promise.all(promises);
        
        // السماح للمتصفح بالتنفس بين الدفعات
        if (i + batchSize < unprocessedElements.length) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
    }
  
    async checkImage(img) {
      // تجاهل الصور التي تم فحصها بالفعل
      if (img.hasAttribute('data-soc-checked') || this.blockedElements.has(img)) {
        return;
      }
      
      // تجاهل الصور الصغيرة والأيقونات
      if (img.naturalWidth < 100 || img.naturalHeight < 100) {
        img.setAttribute('data-soc-checked', 'true');
        return;
      }
      
      // فحص حجم الصورة ونسبة العرض إلى الارتفاع
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        
        // تحقق من الصور المشبوهة
        const isSuspicious = (
          // نسب مشبوهة للصور
          (aspectRatio > 0.5 && aspectRatio < 2) &&
          // فحص المصدر والنص البديل
          (this.isSuspiciousMedia(img.src) || this.isSuspiciousAlt(img.alt))
        );
        
        if (isSuspicious) {
          this.blurElement(img);
        }
      } else if (img.src) {
        // للصور التي لم تحمل بعد، نضيف مستمع للتحميل
        img.addEventListener('load', () => this.checkImage(img), { once: true });
      }
      
      // تمييز الصورة كمفحوصة
      img.setAttribute('data-soc-checked', 'true');
    }
  
    async checkVideo(video) {
      // تجاهل الفيديوهات التي تم فحصها بالفعل
      if (video.hasAttribute('data-soc-checked') || this.blockedElements.has(video)) {
        return;
      }
      
      // فحص مصدر الفيديو والصورة المصغرة
      const sources = [video.src, video.currentSrc, video.poster];
      let isSuspicious = false;
      
      for (const src of sources) {
        if (src && this.isSuspiciousMedia(src)) {
          isSuspicious = true;
          break;
        }
      }
      
      // فحص مصادر الفيديو الإضافية
      if (!isSuspicious) {
        const sourceElements = video.querySelectorAll('source');
        for (const source of sourceElements) {
          if (source.src && this.isSuspiciousMedia(source.src)) {
            isSuspicious = true;
            break;
          }
        }
      }
      
      if (isSuspicious) {
        this.blockVideo(video);
      }
      
      // تمييز الفيديو كمفحوص
      video.setAttribute('data-soc-checked', 'true');
    }
  
    checkIframe(iframe) {
      // فحص مصدر iframe
      if (iframe.src && this.isSuspiciousURL(iframe.src)) {
        this.removeElement(iframe);
      }
    }
  
    isSuspiciousMedia(src) {
      if (!src) return false;
      
      const suspiciousPatterns = [
        /porn|xxx|sex|nude|adult/i,
        /\d{3,}x\d{3,}/i, // أحجام مشبوهة
        /thumb|preview/i // صور مصغرة
      ];
      
      return suspiciousPatterns.some(pattern => pattern.test(src));
    }
  
    isSuspiciousAlt(alt) {
      if (!alt) return false;
      
      const keywords = ['sexy', 'hot', 'nude', 'xxx', 'porn'];
      const lowerAlt = alt.toLowerCase();
      
      return keywords.some(keyword => lowerAlt.includes(keyword));
    }
  
    isSuspiciousURL(url) {
      const patterns = [
        /porn|xxx|adult|sex/i,
        /\/(video|cam|live)/i
      ];
      
      return patterns.some(pattern => pattern.test(url));
    }
  
    blurElement(element) {
      // تجنب تكرار تطبيق التأثير على نفس العنصر
      if (element.hasAttribute('data-blocked') || this.blockedElements.has(element)) {
        return;
      }
      
      // إضافة العنصر إلى قائمة العناصر المحظورة
      this.blockedElements.add(element);
      
      // تطبيق تأثير التمويه
      element.style.filter = 'blur(20px)';
      element.style.transition = 'filter 0.3s';
      element.setAttribute('data-blocked', 'true');
      
      try {
        // إنشاء حاوية للتحذير إذا لم تكن موجودة
        let container = element.parentElement;
        if (!container) return;
        
        // التأكد من أن الحاوية لديها موضع نسبي
        const containerStyle = window.getComputedStyle(container);
        if (containerStyle.position === 'static') {
          container.style.position = 'relative';
        }
        
        // إضافة تحذير
        const warningId = `soc-warning-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const warning = document.createElement('div');
        warning.id = warningId;
        warning.className = 'soc-warning';
        warning.textContent = '⚠️ محتوى محظور';
        warning.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255,0,0,0.8);
          color: white;
          padding: 10px;
          border-radius: 5px;
          pointer-events: none;
          z-index: 1000;
          font-size: 14px;
          font-weight: bold;
          text-align: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;
        
        // إضافة التحذير إلى الحاوية
        container.appendChild(warning);
        
        // إضافة مستمع لإزالة التحذير عند إزالة العنصر
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.removedNodes) {
              for (const node of mutation.removedNodes) {
                if (node === element) {
                  const warningElement = document.getElementById(warningId);
                  if (warningElement) warningElement.remove();
                  observer.disconnect();
                  this.blockedElements.delete(element);
                }
              }
            }
          });
        });
        
        observer.observe(container, { childList: true });
      } catch (error) {
        console.error('Error applying blur effect:', error);
      }
    }
  
    blockVideo(video) {
      video.pause();
      video.src = '';
      video.style.display = 'none';
      
      const placeholder = document.createElement('div');
      placeholder.className = 'soc-blocked-video';
      placeholder.innerHTML = `
        <div style="
          background: #f44336;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px;
        ">
          <h3>🚫 فيديو محظور</h3>
          <p>تم حظر هذا المحتوى لحمايتك</p>
        </div>
      `;
      
      video.parentElement.insertBefore(placeholder, video);
    }
  
    removeElement(element) {
      element.remove();
    }
  
    handleUnsafeContent(analysis) {
      // إضافة تحذير في أعلى الصفحة
      if (!document.getElementById('soc-warning-banner')) {
        const banner = document.createElement('div');
        banner.id = 'soc-warning-banner';
        banner.className = 'soc-warning-banner';
        banner.innerHTML = `
          <div style="
            background: #ff5722;
            color: white;
            padding: 15px;
            text-align: center;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 999999;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          ">
            ⚠️ تحذير: تم اكتشاف محتوى غير لائق في هذه الصفحة
            <button onclick="this.parentElement.remove()" style="
              margin-left: 20px;
              background: white;
              color: #ff5722;
              border: none;
              padding: 5px 15px;
              border-radius: 3px;
              cursor: pointer;
            ">إغلاق</button>
          </div>
        `;
        document.body.appendChild(banner);
      }
    }
  
    destroy() {
      if (this.observer) {
        this.observer.disconnect();
      }
      if (this.scanInterval) {
        clearInterval(this.scanInterval);
      }
    }
  }
  
  // تشغيل الماسح
try {
  const scanner = new ContentScanner();

  // تنظيف عند إغلاق الصفحة
  window.addEventListener('unload', () => {
    scanner.destroy();
  });
} catch (error) {
  console.error('Error initializing ContentScanner:', error);
}