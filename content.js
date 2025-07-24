// فحص محتوى الصفحة
function scanPageContent() {
  const bodyText = document.body.innerText || '';
  const pageTitle = document.title || '';
  const metaDescription = document.querySelector('meta[name="description"]')?.content || '';
  const keywords = document.querySelector('meta[name="keywords"]')?.content || '';
  const h1Text = Array.from(document.getElementsByTagName('h1')).map(h => h.innerText).join(' ');
  
  // تجميع المحتوى مع إعطاء وزن أكبر للعناوين والكلمات المفتاحية
  const contentParts = {
    title: pageTitle,
    h1: h1Text,
    meta: `${metaDescription} ${keywords}`,
    body: bodyText
  };
  
  // تحليل المحتوى
  const analysisResult = analyzeContent(contentParts);
  
  // إرسال المحتوى للفحص مع نتيجة التحليل
  chrome.runtime.sendMessage({
    action: 'checkContent',
    content: analysisResult.content,
    score: analysisResult.score,
    context: analysisResult.context
  }, response => {
    if (response && response.blocked) {
      blockPage();
    }
  });
}

// حظر الصفحة
function blockPage() {
  document.documentElement.innerHTML = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>الصفحة محظورة</title>
      <style>
        /* ============ أساسيات ============ */
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;font-family:'Tajawal',Arial,Helvetica,sans-serif}
        
        /* ============ خلفية متدرّجة ============ */
        body{
          display:flex;
          align-items:center;
          justify-content:center;
          background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
        }

        /* ============ البطاقة ============ */
        .card{
          width:90%;
          max-width:520px;
          background:#fff;
          border-radius:18px;
          box-shadow:0 25px 60px rgba(0,0,0,.25);
          padding:60px 40px 50px;
          text-align:center;
          animation:fadeIn .7s ease-out;
        }
        @keyframes fadeIn{
          from{opacity:0;transform:translateY(40px)}
          to{opacity:1;transform:translateY(0)}
        }

        .card h1{
          font-size:28px;
          color:#ef4444;
          margin-bottom:18px;
        }

        .card p{
          font-size:16px;
          color:#4b5563;
          line-height:1.9;
          margin-bottom:32px;
        }

        /* ============ الأزرار ============ */
        .btn{
          appearance:none;border:none;cursor:pointer;
          font-size:15px;font-weight:600;
          border-radius:30px;padding:12px 32px;
          transition:.25s;
        }
        .btn-primary{
          background:#3b82f6;color:#fff;
        }
        .btn-primary:hover{background:#2563eb;box-shadow:0 4px 15px rgba(59,130,246,.35)}
        .btn-secondary{
          background:#e5e7eb;color:#374151;margin-inline-start:10px;
        }
        .btn-secondary:hover{background:#d1d5db}
        
        /* ============ أيقونة دائرية ============ */
        .icon-holder{
          width:100px;height:100px;margin:-110px auto 25px;
          background:#ef4444;
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          font-size:48px;color:#fff;
          box-shadow:0 10px 25px rgba(239,68,68,.45);
        }
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;600&display=swap" rel="stylesheet">
    </head>
    <body>
      <div class="card">
        <div class="icon-holder">🚫</div>
        <h1>تم حظر هذه الصفحة</h1>
        <p>
          اتقِ الله حيثما كنت، فإن الله يراك…<br>
          الإباحية سمٌّ يهلكك في الدنيا ويثقل وزرك في الآخرة.
        </p>
        <div>
          <button class="btn btn-primary" onclick="history.back()">العودة للخلف</button>
          <button class="btn btn-secondary" onclick="location.href='https://www.google.com'">الصفحة الرئيسية</button>
        </div>
      </div>
    </body>
    </html>
  `;
}

// فحص الصور
function scanImages() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // يمكن إضافة فحص للصور هنا
    if (img.alt && containsBlockedKeywords(img.alt)) {
      img.style.display = 'none';
    }
  });
}

// تحليل المحتوى بشكل متقدم
function analyzeContent(contentParts) {
  const safeContextPatterns = [
    /medical|health|doctor|clinic|hospital|treatment/i,
    /education|research|study|academic|science/i,
    /news|article|report|journalism/i
  ];

  const resultScore = {
    title: 0,
    h1: 0,
    meta: 0,
    body: 0,
    total: 0
  };

  // الأوزان لكل جزء من المحتوى
  const weights = {
    title: 3,
    h1: 2.5,
    meta: 2,
    body: 1
  };

  // فحص كل جزء من المحتوى
  for (const [part, content] of Object.entries(contentParts)) {
    if (!content) continue;
    
    const contentLower = content.toLowerCase();
    let partScore = 0;
    let suspiciousWords = [];

    // فحص السياق الآمن أولاً
    const isSafeContext = safeContextPatterns.some(pattern => pattern.test(contentLower));
    
    // إذا كان السياق آمناً، نقلل من درجة الحظر
    const contextMultiplier = isSafeContext ? 0.3 : 1;

    // تحليل تكرار الكلمات المحظورة
    chrome.runtime.sendMessage({ action: 'getBlockedKeywords' }, blockedKeywords => {
      for (const keyword of blockedKeywords) {
        // تجاهل الكلمات القصيرة جداً لتجنب الإنذارات الكاذبة
        if (keyword.length < 4) continue;

        const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = (contentLower.match(keywordRegex) || []).length;
        
        if (matches > 0) {
          partScore += matches;
          suspiciousWords.push({ word: keyword, count: matches });
        }
      }
    });

    // تطبيق الوزن والسياق
    resultScore[part] = partScore * weights[part] * contextMultiplier;
  }

  // حساب النتيجة النهائية
  resultScore.total = Object.entries(resultScore)
    .filter(([key]) => key !== 'total')
    .reduce((sum, [_, score]) => sum + score, 0);

  return {
    score: resultScore,
    content: contentParts.body,
    context: {
      isSafeContext: safeContextPatterns.some(pattern => 
        pattern.test(contentParts.body.toLowerCase())
      ),
      contentType: determineContentType(contentParts)
    }
  };
}

// تحديد نوع المحتوى
function determineContentType(contentParts) {
  const allContent = Object.values(contentParts).join(' ').toLowerCase();
  
  if (/\b(article|news|blog|post)\b/.test(allContent)) return 'article';
  if (/\b(shop|product|price|buy)\b/.test(allContent)) return 'commerce';
  if (/\b(medical|health|treatment|symptom)\b/.test(allContent)) return 'medical';
  if (/\b(study|research|education|academic)\b/.test(allContent)) return 'educational';
  
  return 'general';
}

// التحقق من الكلمات المحظورة مع السياق
function containsBlockedKeywords(text) {
  const textLower = text.toLowerCase();
  
  // التحقق من السياق الآمن
  const safeContexts = [
    { pattern: /medical|health|doctor/i, threshold: 2 },
    { pattern: /education|research|study/i, threshold: 2 },
    { pattern: /news|article|report/i, threshold: 2 }
  ];

  // إذا كان في سياق آمن، نزيد عتبة الحظر
  const isSafeContext = safeContexts.some(ctx => ctx.pattern.test(textLower));
  const blockThreshold = isSafeContext ? 3 : 2;

  let suspiciousWordCount = 0;
  
  chrome.runtime.sendMessage({ action: 'getBlockedKeywords' }, blockedKeywords => {
    for (const word of blockedKeywords) {
      if (word.length < 4) continue; // تجاهل الكلمات القصيرة
      
      const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
      if (wordRegex.test(textLower)) {
        suspiciousWordCount++;
        if (suspiciousWordCount >= blockThreshold) {
          return true;
        }
      }
    }
  });

  return false;
}

// بدء الفحص
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    scanPageContent();
    scanImages();
  });
} else {
  scanPageContent();
  scanImages();
}

// مراقبة التغييرات الديناميكية
const observer = new MutationObserver(() => {
  scanImages();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});