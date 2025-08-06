fetch(chrome.runtime.getURL('../rules/blocking_rules.json'))
  .then(response => response.json())
  .then(data => {
    // احسب أكبر id موجود
    const maxId = data.reduce((max, item) => item.id > max ? item.id : max, 0);

    // حدث المحتوى داخل العنصر
    document.getElementById('blockedCount').textContent = maxId;
  })
  .catch(err => {
    console.error('خطأ في تحميل بيانات JSON:', err);
  });


// ------------------------------------------------------------------------------------
// دالة لتهيئة وقت التثبيت (تستخدم مرة واحدة فقط عند التثبيت)
function initializeInstallTime() {
  // تحقق من عدم وجود وقت تثبيت مسجل مسبقاً
  if (!localStorage.getItem('extensionInstallTime')) {
    const installTime = Date.now();
    localStorage.setItem('extensionInstallTime', installTime.toString());
    console.log('تم تسجيل وقت التثبيت:', new Date(installTime));
  }
}

// دالة لحساب الدقائق منذ التثبيت
function getMinutesSinceInstall() {
  const installTime = localStorage.getItem('extensionInstallTime');
  
  if (!installTime) {
    // إذا لم يكن هناك وقت تثبيت مسجل، قم بتسجيله الآن
    initializeInstallTime();
    return 0;
  }
  
  const currentTime = Date.now();
  const installTimeMs = parseInt(installTime);
  const timeDifferenceMs = currentTime - installTimeMs;
  const minutes = Math.floor(timeDifferenceMs / (1000 * 60));
  
  return minutes;
}

// دالة لتنسيق عرض الوقت المحمي
function formatProtectedTime(minutes) {
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;
  
  let result = [];
  
  if (days > 0) {
    result.push(`${days} ${days === 1 ? 'يوم' : 'أيام'}`);
  }
  if (hours > 0) {
    result.push(`${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`);
  }
  if (mins > 0 || result.length === 0) {
    result.push(`${mins} ${mins === 1 ? 'دقيقة' : 'دقائق'}`);
  }
  
  return result.join(' و ');
}

// دالة لتحديث عرض الوقت
function updateProtectedTimeDisplay() {
  const protectedMinutes = getMinutesSinceInstall();
  const timeElement = document.getElementById('timeProtected');
  
  if (timeElement) {
    timeElement.textContent = formatProtectedTime(protectedMinutes);
  }
  
  console.log(`الوقت المحمي: ${protectedMinutes} دقيقة`);
}

// دالة للتشغيل عند تحميل الصفحة
function onPageLoad() {
  // تهيئة وقت التثبيت إذا لم يكن موجوداً
  initializeInstallTime();
  
  // تحديث عرض الوقت
  updateProtectedTimeDisplay();
  
  // تحديث الوقت كل دقيقة
  setInterval(updateProtectedTimeDisplay, 60000);
}

// تشغيل الكود عند تحميل الصفحة
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onPageLoad);
} else {
  onPageLoad();
}

// دوال إضافية للإدارة والصيانة

// دالة لإعادة تعيين وقت التثبيت (للاختبار فقط)
function resetInstallTime() {
  localStorage.removeItem('extensionInstallTime');
  console.log('تم إعادة تعيين وقت التثبيت');
  initializeInstallTime();
  updateProtectedTimeDisplay();
}

// دالة للحصول على معلومات تفصيلية
function getDetailedTimeInfo() {
  const installTime = localStorage.getItem('extensionInstallTime');
  
  if (!installTime) {
    return { error: 'لم يتم العثور على وقت التثبيت' };
  }
  
  const installDate = new Date(parseInt(installTime));
  const currentDate = new Date();
  const minutes = getMinutesSinceInstall();
  
  return {
    installDate: installDate.toLocaleString('ar-EG'),
    currentDate: currentDate.toLocaleString('ar-EG'),
    totalMinutes: minutes,
    formattedTime: formatProtectedTime(minutes)
  };
}

// دالة لتصدير الإعدادات (اختيارية)
function exportTimeData() {
  return {
    installTime: localStorage.getItem('extensionInstallTime'),
    currentTime: Date.now(),
    protectedMinutes: getMinutesSinceInstall()
  };
}
// ------------------------------------------------------------------------------------


