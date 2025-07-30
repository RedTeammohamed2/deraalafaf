// إضافة هذا في بداية الملف
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "updateCounter") {
        document.getElementById('blockedCount').textContent = request.count;
    }
});

// Initialize popup
document.addEventListener('DOMContentLoaded', function() {
    // Load stats from storage
    loadStatistics();
    
    // Protection toggle handler
    const protectionToggle = document.getElementById('protectionToggle');
    protectionToggle.addEventListener('change', toggleProtection);
    
    // Load protection status
    loadProtectionStatus();
    
    // Update time protected every minute
    setInterval(updateTimeProtected, 60000);
});

// Load statistics from chrome storage
function loadStatistics() {
    // Simulated data - replace with actual chrome.storage.local.get
    const blockedCount = localStorage.getItem('blockedCount') || 0;
    const timeProtected = localStorage.getItem('timeProtected') || 0;
    
    document.getElementById('blockedCount').textContent = blockedCount;
    document.getElementById('timeProtected').textContent = formatTime(timeProtected);
}

// Format time in minutes to days, hours, minutes
function formatTime(minutes) {
    minutes = parseInt(minutes);
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = minutes % 60;
    
    let result = '';
    if (days > 0) result += `${days} يوم `;
    if (hours > 0) result += `${hours} ساعة `;
    if (mins > 0 || result === '') result += `${mins} دقيقة`;
    
    return result.trim();
}

// Load protection status
function loadProtectionStatus() {
    const isProtectionEnabled = localStorage.getItem('protectionEnabled') !== 'false';
    const protectionToggle = document.getElementById('protectionToggle');
    const statusIndicator = document.querySelector('.status-indicator');
    
    protectionToggle.checked = isProtectionEnabled;
    updateStatusIndicator(isProtectionEnabled);
}

// Toggle protection
function toggleProtection(event) {
    const isEnabled = event.target.checked;
    localStorage.setItem('protectionEnabled', isEnabled);
    updateStatusIndicator(isEnabled);
    
    // Send message to background script
    if (chrome && chrome.runtime) {
        chrome.runtime.sendMessage({
            action: 'toggleProtection',
            enabled: isEnabled
        });
    }
}

// Update status indicator
function updateStatusIndicator(isEnabled) {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = statusIndicator.querySelector('span');
    const statusIcon = statusIndicator.querySelector('i');
    
    if (isEnabled) {
        statusIndicator.classList.add('active');
        statusIndicator.style.color = '#2ecc71';
        statusText.textContent = 'الحماية مُفعّلة';
        statusIcon.className = 'fas fa-check-circle';
    } else {
        statusIndicator.classList.remove('active');
        statusIndicator.style.color = '#e74c3c';
        statusText.textContent = 'الحماية مُعطّلة';
        statusIcon.className = 'fas fa-times-circle';
    }
}

// Update time protected
function updateTimeProtected() {
    const currentTime = parseInt(localStorage.getItem('timeProtected') || 0);
    const newTime = currentTime + 1;
    localStorage.setItem('timeProtected', newTime);
    document.getElementById('timeProtected').textContent = formatTime(newTime);
}

// Handle navigation clicks
document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        // Animate button click
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
            
            // Navigate to page
            if (chrome && chrome.tabs) {
                chrome.tabs.create({ url: chrome.runtime.getURL(href) });
            } else {
                // Fallback for testing
                window.location.href = href;
            }
        }, 100);
    });
});