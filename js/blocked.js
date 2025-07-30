// زيادة العداد عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['blockedCount'], function(result) {
        let count = result.blockedCount || 0;
        count++;
        
        chrome.storage.local.set({ blockedCount: count }, function() {
            document.getElementById('blockedCount').textContent = count;
            
            // إرسال رسالة لتحديث النافذة المنبثقة
            chrome.runtime.sendMessage({
                action: "updateCounter",
                count: count
            });
        });
    });
});