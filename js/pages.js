// Common functionality for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'blocked.html':
            initBlockedPage();
            break;
        case 'help.html':
            initHelpPage();
            break;
        case 'istighfar.html':
            initIstighfarPage();
            break;
        case 'report.html':
            initReportPage();
            break;
        case 'settings.html':
            initSettingsPage();
            break;
    }
});

// Blocked Page Functions
function initBlockedPage() {
    loadBlockedItems();
    
    // Filter buttons
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterBlockedItems(this.dataset.filter);
        });
    });
    
    // Clear all button
    document.getElementById('clearAll').addEventListener('click', clearBlockedHistory);
}

function loadBlockedItems() {
    // Simulated data
    const blockedItems = [
        { url: 'example1.com', date: new Date(), type: 'auto' },
        { url: 'example2.com', date: new Date(Date.now() - 86400000), type: 'manual' }
    ];
    
    const blockedList = document.getElementById('blockedList');
    blockedList.innerHTML = '';
    
    blockedItems.forEach(item => {
        const itemElement = createBlockedItemElement(item);
        blockedList.appendChild(itemElement);
    });
    
    // Update stats
    document.getElementById('totalBlocked').textContent = blockedItems.length;
    document.getElementById('todayBlocked').textContent = blockedItems.filter(item => 
        isToday(item.date)
    ).length;
}

function createBlockedItemElement(item) {
    const div = document.createElement('div');
    div.className = 'blocked-item';
    div.innerHTML = `
        <div class="blocked-info">
            <h4>${item.url}</h4>
            <p>${formatDate(item.date)} - ${item.type === 'auto' ? 'حظر تلقائي' : 'حظر يدوي'}</p>
        </div>
        <button class="remove-btn" onclick="removeBlockedItem('${item.url}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    return div;
}

function clearBlockedHistory() {
    if (confirm('هل أنت متأكد من مسح جميع السجلات؟')) {
        localStorage.removeItem('blockedItems');
        loadBlockedItems();
    }
}

// Help Page Functions
function initHelpPage() {
    // FAQ accordion
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            faqItem.classList.toggle('active');
        });
    });
    
    // Search functionality
    document.getElementById('searchHelp').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.faq-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });
}

// Istighfar Page Functions
function initIstighfarPage() {
    // Load saved counts
    loadDhikrCounts();
    
    // Counter buttons
    document.querySelectorAll('.counter-btn').forEach(button => {
        button.addEventListener('click', function() {
            const dhikrType = this.dataset.dhikr;
            incrementDhikr(dhikrType);
        });
    });
    
    // Reset button
    document.getElementById('resetCounters').addEventListener('click', resetAllCounters);
}

function loadDhikrCounts() {
    const dhikrTypes = ['istighfar', 'protection', 'tasbih', 'salawat'];
    dhikrTypes.forEach(type => {
        const count = localStorage.getItem(`dhikr_${type}`) || 0;
        document.getElementById(`${type}Count`).textContent = count;
    });
}

function incrementDhikr(type) {
    const countElement = document.getElementById(`${type}Count`);
    let count = parseInt(countElement.textContent);
    count++;
    countElement.textContent = count;
    localStorage.setItem(`dhikr_${type}`, count);
    
    // Animate button
    const button = document.querySelector(`[data-dhikr="${type}"]`);
    button.style.transform = 'scale(1.1)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}

function resetAllCounters() {
    if (confirm('هل تريد إعادة تعيين جميع العدادات؟')) {
        const dhikrTypes = ['istighfar', 'protection', 'tasbih', 'salawat'];
        dhikrTypes.forEach(type => {
            localStorage.removeItem(`dhikr_${type}`);
        });
        loadDhikrCounts();
    }
}

// Report Page Functions
function initReportPage() {
    const form = document.getElementById('reportForm');
    form.addEventListener('submit', handleReportSubmit);
}

function handleReportSubmit(e) {
    e.preventDefault();
    
    const formData = {
        type: document.getElementById('reportType').value,
        url: document.getElementById('websiteUrl').value,
        description: document.getElementById('description').value,
        email: document.getElementById('email').value
    };
    
    // Simulate sending report
    console.log('Report submitted:', formData);
    
    // Show success message
    document.getElementById('reportForm').style.display = 'none';
    document.getElementById('reportSuccess').style.display = 'block';
    
    // Reset form after 3 seconds
    setTimeout(() => {
        document.getElementById('reportForm').reset();
        document.getElementById('reportForm').style.display = 'block';
        document.getElementById('reportSuccess').style.display = 'none';
    }, 3000);
}

// Settings Page Functions
function initSettingsPage() {
    // Load saved settings
    loadSettings();
    
    // Save button
    document.getElementById('saveSettings').addEventListener('click', saveSettings);
    
    // Reset button
    document.getElementById('resetSettings').addEventListener('click', resetSettings);
    
    // List edit buttons
    document.getElementById('whitelistBtn').addEventListener('click', () => editList('whitelist'));
    document.getElementById('blacklistBtn').addEventListener('click', () => editList('blacklist'));
}

function loadSettings() {
    const settings = {
        protectionLevel: localStorage.getItem('protectionLevel') || 'moderate',
        notifications: localStorage.getItem('notifications') !== 'false',
        blockImages: localStorage.getItem('blockImages') !== 'false',
        language: localStorage.getItem('language') || 'ar',
        statistics: localStorage.getItem('statistics') !== 'false'
    };
    
    document.getElementById('protectionLevel').value = settings.protectionLevel;
    document.getElementById('notifications').checked = settings.notifications;
    document.getElementById('blockImages').checked = settings.blockImages;
    document.getElementById('language').value = settings.language;
    document.getElementById('statistics').checked = settings.statistics;
}

function saveSettings() {
    const settings = {
        protectionLevel: document.getElementById('protectionLevel').value,
        notifications: document.getElementById('notifications').checked,
        blockImages: document.getElementById('blockImages').checked,
        language: document.getElementById('language').value,
        statistics: document.getElementById('statistics').checked
    };
    
    Object.entries(settings).forEach(([key, value]) => {
        localStorage.setItem(key, value);
    });
    
    // Show success message
    alert('تم حفظ الإعدادات بنجاح!');
}

function resetSettings() {
    if (confirm('هل تريد إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟')) {
        localStorage.clear();
        loadSettings();
    }
}

function editList(listType) {
    // Placeholder for list editing functionality
    alert(`فتح محرر ${listType === 'whitelist' ? 'القائمة البيضاء' : 'القائمة السوداء'}`);
}

// Utility Functions
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('ar', options).format(date);
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

function filterBlockedItems(filter) {
    // Implement filtering logic based on filter type
    console.log('Filtering by:', filter);
}

function removeBlockedItem(url) {
    console.log('Removing:', url);
    // Implement removal logic
}