// Script to clean and organize the adultDomains array
const fs = require('fs');
const path = require('path');

// Read the original file
const filePath = path.join(__dirname, 'data', 'blacklist.js');
const content = fs.readFileSync(filePath, 'utf8');

// Extract the adultDomains array using a regex
const arrayMatch = content.match(/export\s+const\s+adultDomains\s*=\s*(\[.*?\])\s*;/s);
if (!arrayMatch) {
  console.error('Could not find adultDomains array in the file');
  process.exit(1);
}

// Extract the array content and parse it
const arrayContent = arrayMatch[1];
// Create a new array by evaluating the content (be careful with this in production)
let domains = [];
try {
  domains = eval(arrayContent);
} catch (e) {
  console.error('Error parsing the array:', e);
  process.exit(1);
}

// Remove duplicates using a Set
const uniqueDomains = [...new Set(domains)];

// Sort alphabetically for better organization
uniqueDomains.sort((a, b) => a.localeCompare(b));

// Create categorized domains
const categorized = {
  main: [],
  international: [],
  studios: [],
  liveCams: [],
  onlyfans: [],
  forums: [],
  hentai: [],
  manga: [],
  torrents: [],
  other: []
};

// Categorize domains
uniqueDomains.forEach(domain => {
  // Main sites
  if (['pornhub', 'xvideos', 'xnxx', 'xhamster', 'youporn', 'redtube', 'tube8', 'spankbang'].some(site => domain.includes(site))) {
    categorized.main.push(domain);
  }
  // International
  else if (domain.match(/\.(es|fr|de|it|jp|ru|br|co|desi)$/)) {
    categorized.international.push(domain);
  }
  // Studios
  else if (['brazzers', 'realitykings', 'naughtyamerica', 'digitalplayground', 'bangbros', 'mofos', 'twistys', 'evilangel', 'vixen', 'blacked', 'tushy', 'deeper', 'slayed', 'wickedpictures', 'penthouse', 'hustler', 'playboy', 'metart', 'kink'].some(studio => domain.includes(studio))) {
    categorized.studios.push(domain);
  }
  // Live cams
  else if (['chaturbate', 'myfreecams', 'bongacams', 'stripchat', 'cams.com', 'cam4', 'livejasmin', 'camsoda', 'streamate', 'flirt4free', 'imlive'].some(site => domain.includes(site))) {
    categorized.liveCams.push(domain);
  }
  // OnlyFans
  else if (['onlyfans', 'fansly', 'manyvids', 'justfor.fans', 'fanvue', 'fancentro', 'onlyfinder', 'findercdn'].some(site => domain.includes(site))) {
    categorized.onlyfans.push(domain);
  }
  // Forums/Communities
  else if (['reddit.com/r/', 'forum.', 'board.', 'community.'].some(site => domain.includes(site))) {
    categorized.forums.push(domain);
  }
  // Hentai
  else if (['hentai', 'fakku', 'nhentai', 'rule34', 'hanime', 'e-hentai', '8muses', 'pururin', 'tsumino'].some(site => domain.includes(site))) {
    categorized.hentai.push(domain);
  }
  // Manga
  else if (['manga', 'doujin', 'manhwa', 'manhua'].some(site => domain.includes(site))) {
    categorized.manga.push(domain);
  }
  // Torrents
  else if (['torrent', 'rarbg', '1337x', 'thepiratebay', 'yts.mx', 'torrentz', 'zooqle', 'torlock', 'idope', 'limetorrents', 'glodls', 'yourbittorrent'].some(site => domain.includes(site))) {
    categorized.torrents.push(domain);
  }
  // Other
  else {
    categorized.other.push(domain);
  }
});

// Generate the new array content
let newArrayContent = '// ===== المواقع الإباحية الرئيسية =====\n';
newArrayContent += categorized.main.map(d => `  "${d}"`).join(',\n');

newArrayContent += '\n\n// ===== مواقع دولية وإقليمية =====\n';
newArrayContent += categorized.international.map(d => `  "${d}"`).join(',\n');

newArrayContent += '\n\n// ===== استوديوهات إنتاج محتوى إباحي =====\n';
newArrayContent += categorized.studios.map(d => `  "${d}"`).join(',\n');

newArrayContent += '\n\n// ===== كاميرات ويب ومحتوى مباشر =====\n';
newArrayContent += categorized.liveCams.map(d => `  "${d}"`).join(',\n');

newArrayContent += '\n\n// ===== منصات المحتوى المدفوع =====\n';
newArrayContent += categorized.onlyfans.map(d => `  "${d}"`).join(',\n');

newArrayContent += '\n\n// ===== مجتمعات ومنتديات =====\n';
newArrayContent += categorized.forums.map(d => `  "${d}"`).join(',\n');

newArrayContent += '\n\n// ===== هنتاي ومحتوى أنمي إباحي =====\n';
newArrayContent += categorized.hentai.map(d => `  "${d}"`).join(',\n');

newArrayContent += '\n\n// ===== مواقع مانجا ومانهوا =====\n';
newArrayContent += categorized.manga.map(d => `  "${d}"`).join(',\n');

newArrayContent += '\n\n// ===== تورنت ومواقع مشاركة الملفات =====\n';
newArrayContent += categorized.torrents.map(d => `  "${d}"`).join(',\n');

newArrayContent += '\n\n// ===== مواقع إضافية =====\n';
newArrayContent += categorized.other.map(d => `  "${d}"`).join(',\n');

// Create the final content
const finalContent = `// قاعدة بيانات المواقع المحظورة
// تم تنظيم القائمة وإزالة التكرارات وتصنيف المواقع بشكل منطقي

export const adultDomains = [
${newArrayContent}
];
`;

// Write to a new file
const outputPath = path.join(__dirname, 'data', 'blacklist_organized.js');
fs.writeFileSync(outputPath, finalContent);

console.log(`Original domains: ${domains.length}`);
console.log(`Unique domains: ${uniqueDomains.length}`);
console.log(`Removed ${domains.length - uniqueDomains.length} duplicates`);
console.log(`Organized file saved to: ${outputPath}`);
