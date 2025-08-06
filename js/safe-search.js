// Google SafeSearch
const enforceGoogleSafeSearch = () => {
  if (window.location.hostname.includes('google.com')) {
    const url = new URL(window.location.href);
    if (url.pathname === '/search' && url.searchParams.get('safe') !== 'active') {
      url.searchParams.set('safe', 'active');
      window.location.replace(url.toString());
    }
  }
};


// =========================================================================

// Bing SafeSearch
const enforceBingSafeSearch = () => {
  if (window.location.hostname.includes('bing.com')) {
    const url = new URL(window.location.href);
    if (url.pathname === '/search' && url.searchParams.get('adlt') !== 'strict') {
      url.searchParams.set('adlt', 'strict');
      window.location.replace(url.toString());
    }
  }
};

// =========================================================================
// youtube

const enforceYouTubeRestricted = () => {
  if (window.location.hostname.includes('youtube.com')) {
    document.cookie = "PREF=f2=8000000&tz=UTC; domain=.youtube.com; path=/";
    document.cookie = "VISITOR_INFO1_LIVE=fPQ4jCL6EiE; domain=.youtube.com; path=/";
  }
};


// =========================================================================
// duckduckgo

const enforceDuckDuckGoSafeSearch = () => {
  if (window.location.hostname.includes('duckduckgo.com')) {
    const url = new URL(window.location.href);
    if (url.searchParams.get('kp') !== '1') {
      url.searchParams.set('kp', '1');
      window.location.replace(url.toString());
    }
  }
};

// =========================================================================
// yahoo

const enforceYahooSafeSearch = () => {
  if (window.location.hostname.includes('search.yahoo.com')) {
    const url = new URL(window.location.href);
    const safeValue = 'r'; // مستوى أمان Restricted (أعلى مستوى)
    if (url.searchParams.get('vm') !== safeValue) {
      url.searchParams.set('vm', safeValue);
      window.location.replace(url.toString());
    }
  }
};


// =========================================================================
// yandex

const enforceYandexSafeSearch = () => {
  if (window.location.hostname.includes('yandex.com')) {
    const url = new URL(window.location.href);
    if (url.searchParams.get('filter') !== 'strict') {
      url.searchParams.set('filter', 'strict');
      window.location.replace(url.toString());
    }
  }
};
// =========================================================================

// تنفيذ جميع الفروض
enforceGoogleSafeSearch();
enforceBingSafeSearch();
enforceYouTubeRestricted();
enforceDuckDuckGoSafeSearch();
enforceYahooSafeSearch();
enforceYandexSafeSearch();
