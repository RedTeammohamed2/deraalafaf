const LAST_BLOCK_DATE_KEY = "lastBlockedDate";

// ============== دوال العداد ==============
function getTimeDiffString(startDate, endDate) {
  const diffMs = endDate - startDate;
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) {
    return `مر ${diffSeconds} ثانية${diffSeconds !== 1 ? "ً" : ""} بدون محتوى إباحي`;
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `مر ${diffMinutes} دقيقة${diffMinutes !== 1 ? "ً" : ""} بدون محتوى إباحي`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `مر ${diffHours} ساعة${diffHours !== 1 ? "ً" : ""} بدون محتوى إباحي`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `مر ${diffDays} يوم${diffDays !== 1 ? "ًا" : ""} بدون محتوى إباحي`;
}

function updateCounter() {
  const counterEl = document.getElementById("days-counter");
  if (!counterEl) return;

  let lastDateStr = localStorage.getItem(LAST_BLOCK_DATE_KEY);

  if (!lastDateStr) {
    const now = new Date();
    localStorage.setItem(LAST_BLOCK_DATE_KEY, now.toISOString());
    lastDateStr = now.toISOString();
  }

  const lastDate = new Date(lastDateStr);
  const now = new Date();

  const diffMs = now - lastDate;
  if (diffMs < 0) {
    localStorage.setItem(LAST_BLOCK_DATE_KEY, now.toISOString());
    counterEl.textContent = "مر 0 ثانية بدون محتوى إباحي";
    return;
  }

  counterEl.textContent = getTimeDiffString(lastDate, now);
}

function resetCounter() {
  const now = new Date();
  localStorage.setItem(LAST_BLOCK_DATE_KEY, now.toISOString());
  updateCounter();
}


// -----------------------------------------------------------------------------
// new section =================================================

// ============== دوال أزرار التحكم ==============
function updateButton(button, enabled, label) {
  if (!button) return;
  button.textContent = `حجب ${label}: ${enabled ? 'مفعل' : 'غير مفعل'}`;
  button.setAttribute('aria-pressed', enabled);
  button.style.backgroundColor = enabled ? '#27ae60' : '#ccc';
  button.style.color = enabled ? 'white' : '#666';
}

function setupToggle(storageKey, button, label, actionName) {
  if (!button) return;
  
  button.addEventListener('click', () => {
    chrome.storage.local.get([storageKey], (result) => {
      const enabled = !(result[storageKey] ?? true);
      chrome.storage.local.set({ [storageKey]: enabled }, () => {
        updateButton(button, enabled, label);
        chrome.runtime.sendMessage({ 
          action: actionName, 
          enabled: enabled 
        });
      });
    });
  });
}

function initializePage() {
  // تهيئة العداد
  updateCounter();
  const resetBtn = document.getElementById("reset-counter-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetCounter);
  }
  setInterval(updateCounter, 1000);


  // تهيئة أزرار التحكم
  const buttons = {
    youtube: document.getElementById('toggle-youtube'),
    facebook: document.getElementById('toggle-facebook'),
    instagram: document.getElementById('toggle-instagram'),
    tiktok: document.getElementById('toggle-tiktok')
  };

  // جلب الإعدادات الحالية وتحديث الأزرار
  chrome.storage.local.get(
    ['blockYoutube', 'blockFacebook', 'blockInstagram', 'blockTiktok'], 
    (result) => {
      updateButton(buttons.youtube, result.blockYoutube ?? true, 'يوتيوب شورتس');
      updateButton(buttons.facebook, result.blockFacebook ?? true, 'فيسبوك ريلز');
      updateButton(buttons.instagram, result.blockInstagram ?? true, 'إنستجرام ريلز');
      updateButton(buttons.tiktok, result.blockTiktok ?? true, 'تيك توك');

      // إعداد النقرات للأزرار
      if (buttons.youtube) setupToggle('blockYoutube', buttons.youtube, 'يوتيوب شورتس', 'toggleYoutube');
      if (buttons.facebook) setupToggle('blockFacebook', buttons.facebook, 'فيسبوك ريلز', 'toggleFacebook');
      if (buttons.instagram) setupToggle('blockInstagram', buttons.instagram, 'إنستجرام ريلز', 'toggleInstagram');
      if (buttons.tiktok) setupToggle('blockTiktok', buttons.tiktok, 'تيك توك', 'toggleTiktok');
    }
  );
}

// تشغيل التهيئة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", initializePage);


// ========================================================================
function checkPasswordBeforeAccess() {
  const overlay = document.getElementById("password-overlay");
  const input = document.getElementById("password-input");
  const button = document.getElementById("password-submit");
  const warning = document.getElementById("password-warning");
  const title = document.getElementById("password-title");

  chrome.storage.local.get("extensionPassword", (result) => {
    const savedPassword = result.extensionPassword;

    if (!savedPassword) {
      // أول مرة - تعيين كلمة مرور
      title.textContent = "قم بتعيين كلمة مرور للدخول";
      button.textContent = "تأكيد";
      button.onclick = () => {
        const newPass = input.value.trim();
        if (newPass.length < 4) {
          warning.textContent = "كلمة المرور يجب أن تكون 4 أحرف أو أكثر";
          return;
        }
        chrome.storage.local.set({ extensionPassword: newPass }, () => {
          overlay.style.display = "none";
          alert("⚠️ تنبيه: لا تنسَ كلمة المرور! لا يمكن استرجاعها لاحقًا.");
          initializePage();
        });
      };
    } else {
      // كلمة مرور محفوظة - يطلب إدخالها
      button.onclick = () => {
        if (input.value === savedPassword) {
          overlay.style.display = "none";
          initializePage();
        } else {
          warning.textContent = "❌ كلمة المرور غير صحيحة!";
        }
      };
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  checkPasswordBeforeAccess();
});
// ========================================================================