// حقن كود لفرض البحث الآمن
const enforceGoogleSafeSearch = () => {
    if (window.location.hostname.includes('google.com')) {
      const url = new URL(window.location.href);
      if (url.pathname === '/search' && url.searchParams.get('safe') !== 'active') {
        url.searchParams.set('safe', 'active');
        window.location.replace(url.toString());
      }
    }
  };
  
  const enforceBingSafeSearch = () => {
    if (window.location.hostname.includes('bing.com')) {
      const url = new URL(window.location.href);
      if (url.pathname === '/search' && url.searchParams.get('adlt') !== 'strict') {
        url.searchParams.set('adlt', 'strict');
        window.location.replace(url.toString());
      }
    }
  };
  
  const enforceYouTubeRestricted = () => {
    if (window.location.hostname.includes('youtube.com')) {
      // إضافة كوكي وضع التقييد
      document.cookie = "PREF=f2=8000000&tz=UTC; domain=.youtube.com; path=/";
    }
  };
  
  // تطبيق القواعد
  enforceGoogleSafeSearch();
  enforceBingSafeSearch();
  enforceYouTubeRestricted();