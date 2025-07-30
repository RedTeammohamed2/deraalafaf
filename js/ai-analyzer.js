// محلل AI متقدم للمحتوى
export class AIContentAnalyzer {
    constructor() {
      this.modelLoaded = false;
      this.threshold = {
        high: 0.85, // زيادة حساسية الكشف
        medium: 0.6,
        low: 0.35
      };
      this.cache = new Map();
      this.maxCacheSize = 500; // زيادة حجم الكاش للأداء الأفضل
      this.cacheTimeout = 60 * 60 * 1000; // ساعة واحدة للكاش
      this.keywords = new Set();
      this.categories = {};
      this.initializeAnalyzer();
    }

    async initializeAnalyzer() {
      try {
        // تهيئة المحلل وتحميل البيانات الأساسية
        const { adultKeywords, contentCategories } = await import('../data/blacklist.js');
        this.keywords = new Set(adultKeywords);
        this.categories = contentCategories;
        this.modelLoaded = true;
        console.log('AI Analyzer initialized successfully');
      } catch (error) {
        console.error('Error initializing analyzer:', error);
        // إعادة المحاولة بعد 5 ثواني
        setTimeout(() => this.initializeAnalyzer(), 5000);
      }
    }
  
    // تحليل النص باستخدام خوارزميات متعددة
    async analyzeText(text) {
      if (!text || text.length < 10) return { safe: true, score: 0 };
  
      // التحقق من الذاكرة المؤقتة
      const cacheKey = this.generateHash(text);
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
  
      const results = await Promise.all([
        this.keywordAnalysis(text),
        this.patternAnalysis(text),
        this.contextAnalysis(text),
        this.sentimentAnalysis(text)
      ]);
  
      const score = this.calculateFinalScore(results);
      const result = {
        safe: score < this.threshold.medium,
        score: score,
        categories: this.detectCategories(text),
        confidence: this.calculateConfidence(results)
      };
  
      // حفظ في الذاكرة المؤقتة مع timestamp
      const cacheEntry = {
        ...result,
        timestamp: Date.now()
      };
      
      // تنظيف الكاش القديم
      this.cleanCache();
      
      if (this.cache.size >= this.maxCacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      this.cache.set(cacheKey, cacheEntry);
      return result;
    }
  
    // تحليل بالكلمات المفتاحية
    async keywordAnalysis(text) {
      // استخدام الكلمات المفتاحية المحملة مسبقاً
      if (!this.modelLoaded) {
        await this.initializeAnalyzer();
      }
      
      const lowerText = text.toLowerCase();
      let score = 0;
      let matchedKeywords = [];
      
      // تقسيم النص إلى كلمات للتحليل السياقي
      const words = lowerText.split(/\s+/);
      const windowSize = 3; // حجم نافذة السياق
      
      // فحص الكلمات المفردة
      for (const keyword of this.keywords) {
        if (lowerText.includes(keyword)) {
          // زيادة الوزن للكلمات الأكثر حساسية
          const keywordWeight = keyword.length > 5 ? 0.15 : 0.1;
          score += keywordWeight;
          matchedKeywords.push(keyword);
        }
      }
      
      // فحص سياق الكلمات (كلمات متجاورة)
      for (let i = 0; i <= words.length - windowSize; i++) {
        const phrase = words.slice(i, i + windowSize).join(' ');
        for (const keyword of this.keywords) {
          if (phrase.includes(keyword)) {
            // زيادة الوزن للعبارات المشبوهة
            score += 0.2;
            if (!matchedKeywords.includes(keyword)) {
              matchedKeywords.push(keyword);
            }
          }
        }
      }
  
      return { 
        score: Math.min(score, 1), 
        matches: matchedKeywords 
      };
    }
  
    // تحليل بالأنماط
    async patternAnalysis(text) {
      const { contentCategories } = await import('../data/blacklist.js');
      let score = 0;
  
      for (const category of Object.values(contentCategories)) {
        if (category.patterns) {
          for (const pattern of category.patterns) {
            const matches = text.match(pattern);
            if (matches) {
              score += (matches.length * 0.05 * category.severity) / 10;
            }
          }
        }
      }
  
      return { score: Math.min(score, 1) };
    }
  
    // تحليل السياق
    async contextAnalysis(text) {
      // تحليل السياق المحيط بالكلمات
      const suspiciousContexts = [
        /watch.{0,20}(free|online|now)/gi,
        /click.{0,20}here.{0,20}(to|for)/gi,
        /must.{0,20}be.{0,20}(18|adult)/gi,
        /age.{0,20}verification/gi
      ];
  
      let score = 0;
      for (const pattern of suspiciousContexts) {
        if (pattern.test(text)) {
          score += 0.15;
        }
      }
  
      return { score: Math.min(score, 1) };
    }
  
    // تحليل المشاعر والنبرة
    async sentimentAnalysis(text) {
      // تحليل بسيط للمشاعر
      const negativeWords = [
        'explicit', 'mature', 'restricted', 'prohibited',
        'inappropriate', 'offensive', 'disturbing'
      ];
  
      let score = 0;
      const lowerText = text.toLowerCase();
  
      for (const word of negativeWords) {
        if (lowerText.includes(word)) {
          score += 0.1;
        }
      }
  
      return { score: Math.min(score, 1) };
    }
  
    // حساب النتيجة النهائية
    calculateFinalScore(results) {
      const weights = [0.4, 0.3, 0.2, 0.1]; // أوزان مختلفة لكل تحليل
      let finalScore = 0;
  
      results.forEach((result, index) => {
        finalScore += result.score * weights[index];
      });
  
      return finalScore;
    }
  
    // اكتشاف الفئات
    detectCategories(text) {
      const categories = [];
      const lowerText = text.toLowerCase();
  
      if (/porn|xxx|adult/gi.test(lowerText)) {
        categories.push('pornography');
      }
      if (/nude|naked/gi.test(lowerText)) {
        categories.push('nudity');
      }
      if (/violence|gore|blood/gi.test(lowerText)) {
        categories.push('violence');
      }
      if (/gambl|casino|bet/gi.test(lowerText)) {
        categories.push('gambling');
      }
  
      return categories;
    }
  
    // حساب مستوى الثقة
    calculateConfidence(results) {
      const scores = results.map(r => r.score);
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
      
      // ثقة عالية = تباين منخفض
      return 1 - Math.min(variance * 2, 1);
    }
  
    // توليد hash للنص
    generateHash(text) {
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return hash.toString();
    }
  
    // تحليل الصور (يحتاج API خارجي)
    async analyzeImage(imageUrl) {
      // يمكن استخدام خدمة مثل Google Vision API
      // أو Microsoft Azure Computer Vision
      return { safe: true, score: 0 };
    }
  
    // تحليل الصفحة الكاملة
    async analyzePageContent(pageData) {
      // استخدام Promise.all لتحليل جميع العناصر بشكل متوازي لتحسين الأداء
      const [textAnalysis, titleAnalysis, urlAnalysis, metaAnalysis] = await Promise.all([
        this.analyzeText(pageData.text || ''),
        this.analyzeText(pageData.title || ''),
        this.analyzeURL(pageData.url || ''),
        this.analyzeText(pageData.meta || '') // تحليل البيانات الوصفية
      ]);
      
      // تحسين أوزان التحليل
      const weights = {
        text: 0.45,
        title: 0.25,
        url: 0.2,
        meta: 0.1
      };
      
      // دمج النتائج مع الأوزان المحسنة
      const finalScore = (
        textAnalysis.score * weights.text +
        titleAnalysis.score * weights.title +
        urlAnalysis.score * weights.url +
        metaAnalysis.score * weights.meta
      );
      
      // دمج الفئات من جميع التحليلات
      const allCategories = new Set([
        ...(textAnalysis.categories || []),
        ...(titleAnalysis.categories || []),
        ...(urlAnalysis.categories || [])
      ]);
      
      // حساب مستوى الثقة الإجمالي
      const confidenceScores = [
        textAnalysis.confidence || 0.5,
        titleAnalysis.confidence || 0.5,
        urlAnalysis.confidence || 0.5
      ];
      const avgConfidence = confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length;
  
      return {
        safe: finalScore < this.threshold.medium,
        score: finalScore,
        confidence: avgConfidence,
        categories: Array.from(allCategories),
        details: {
          text: textAnalysis,
          title: titleAnalysis,
          url: urlAnalysis,
          meta: metaAnalysis
        }
      };
    }
  
    // تحليل URL
    async analyzeURL(url) {
      if (!this.modelLoaded) {
        await this.initializeAnalyzer();
      }
      
      try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace(/^www\./, '');
        const path = urlObj.pathname.toLowerCase();
        const query = urlObj.search.toLowerCase();
        
        // فحص النطاق الرئيسي والنطاقات الفرعية
        const domainParts = domain.split('.');
        for (let i = 0; i < domainParts.length - 1; i++) {
          const subDomain = domainParts.slice(i).join('.');
          if (adultDomains.includes(subDomain)) {
            return { 
              safe: false, 
              score: 1, 
              confidence: 0.95,
              categories: ['adult_domain']
            };
          }
        }
        
        // فحص مواقع Reddit المحظورة بشكل أكثر دقة
        if (domain === 'reddit.com' || domain.endsWith('.reddit.com')) {
          // تحسين قائمة المسارات المحظورة
          const redditBlockedPaths = [
            '/r/nsfw', '/r/nsfw2', '/r/nsfw_gif', '/r/nsfw_videos',
            '/r/nsfw_hardcore', '/r/nsfw_amateurs', '/r/nsfw_teens',
            '/r/nsfw_gifs', '/r/nsfw_gif_sets', '/r/nsfw_hd',
            '/r/gonewild', '/r/realgirls', '/r/nsfw_html5',
            '/r/nsfw_hd_html5', '/r/nsfw_hd_gif', '/r/nsfw_hd_gif_sets',
            '/r/porn', '/r/sex', '/r/hentai', '/r/rule34'
          ];
          
          for (const blockedPath of redditBlockedPaths) {
            if (path.startsWith(blockedPath) || path.includes(blockedPath + '/')) {
              return { 
                safe: false, 
                score: 1, 
                confidence: 0.9,
                categories: ['reddit_nsfw']
              };
            }
          }
        }
        
        // فحص أجزاء URL بشكل أكثر شمولية
        const urlParts = [
          ...domain.split('.'),
          ...path.split(/[\/\-\_\.]/),
          ...query.replace(/[\?\&\=]/g, ' ').split(' ')
        ].filter(part => part.length > 2); // تجاهل الأجزاء القصيرة جداً
        
        let score = 0;
        let matchedKeywords = [];
        
        // استخدام الكلمات المفتاحية المحملة مسبقاً
        for (const part of urlParts) {
          for (const keyword of this.keywords) {
            if (part.includes(keyword)) {
              score += 0.25; // زيادة الوزن للكلمات المفتاحية في URL
              matchedKeywords.push(keyword);
            }
          }
        }
        
        // فحص أنماط URL المشبوهة
        const suspiciousPatterns = [
          /adult|xxx|porn|sex/i,
          /nude|naked|pussy|cock|dick/i,
          /escort|stripper|webcam/i,
          /over18|18plus|18\+/i
        ];
        
        for (const pattern of suspiciousPatterns) {
          if (pattern.test(url)) {
            score += 0.3;
          }
        }
        
        // تحديد الفئات
        const categories = [];
        if (score > 0.5) categories.push('suspicious_url');
        if (matchedKeywords.length > 0) categories.push('adult_keywords');
        
        return { 
          safe: score < this.threshold.medium, 
          score: Math.min(score, 1),
          confidence: 0.7 + (matchedKeywords.length * 0.05),
          categories: categories
        };
      } catch (error) {
        console.error('Error analyzing URL:', error);
        return { safe: true, score: 0, confidence: 0.5 };
      }
    }
    
    // تنظيف الكاش القديم
    cleanCache() {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > this.cacheTimeout) {
          this.cache.delete(key);
        }
      }
    }
  }