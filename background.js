// قائمة الكلمات المحظورة
const blockedKeywords = [
  // English Keywords
  'porn', 'pornography', 'porno', 'xxx', 'adult', 'sex', 'sexy', 'nude', 'naked', 'nsfw',
  'erotic', 'erotica', 'escort', 'escorts', 'hooker', 'prostitute', 'whore', 'slut', 'bitch',
  'fuck', 'fucking', 'fucked', 'blowjob', 'handjob', 'footjob', 'titjob', 'rimjob',
  'masturbate', 'masturbation', 'jerkoff', 'jackoff', 'cumshot', 'creampie', 'facial',
  'anal', 'oral', 'vaginal', 'penetration', 'intercourse', 'orgasm', 'climax', 'ejaculation',
  'penis', 'dick', 'cock', 'pussy', 'vagina', 'cunt', 'ass', 'anus', 'boobs', 'tits',
  'breasts', 'nipples', 'balls', 'testicles', 'clitoris', 'labia', 'vulva', 'foreskin',
  'milf', 'gilf', 'teen', 'teens', 'virgin', 'amateur', 'mature', 'granny', 'bbw', 'ssbbw',
  'lesbian', 'gay', 'bisexual', 'transgender', 'shemale', 'transsexual', 'ladyboy', 'tranny',
  'incest', 'taboo', 'fetish', 'bdsm', 'bondage', 'dominatrix', 'submissive', 'sadism',
  'masochism', 'voyeur', 'exhibitionist', 'swinger', 'orgy', 'gangbang', 'threesome',
  'hentai', 'anime', 'manga', 'yaoi', 'yuri', 'futanari', 'lolicon', 'shotacon',
  'webcam', 'cam', 'camgirl', 'camboy', 'livecam', 'sexcam', 'stripper', 'striptease',
  'playboy', 'penthouse', 'hustler', 'barely', 'legal', 'jailbait', 'upskirt', 'downblouse',
  'hardcore', 'softcore', 'explicit', 'uncensored', 'x-rated', 'adult-content',
  'phone-sex', 'sexting', 'cybersex', 'virtual-sex', 'sex-chat', 'sex-video',
  'cumming', 'squirt', 'squirting', 'deepthroat', 'gagging', 'fisting', 'pegging',
  'dildo', 'vibrator', 'buttplug', 'sextoy', 'fleshlight', 'pornstar', 'pornstars',
  'horny', 'aroused', 'kinky', 'naughty', 'dirty', 'filthy', 'smut', 'lewd', 'obscene',
  'indecent', 'vulgar', 'raunchy', 'steamy', 'sultry', 'seductive', 'provocative',
  'lingerie', 'panties', 'bra', 'thong', 'g-string', 'stockings', 'fishnet', 'latex',
  'sperm', 'semen', 'jizz', 'load', 'precum', 'clit', 'g-spot', 'erection', 'boner',
  'brothel', 'whorehouse', 'redlight', 'strip-club', 'lap-dance', 'pole-dance',
  'adultery', 'affair', 'cheating', 'cuckold', 'hotwife', 'milking', 'edging', 'gooning',
  'ahegao', 'bukkake', 'futanari', 'netorare', 'tentacle', 'doujin', 'ecchi', 'ero',
  
  // Arabic Keywords
  'سكس', 'جنس', 'نيك', 'اباحي', 'اباحية', 'اباحيه', 'بورنو', 'فاحشة', 'فحش',
  'عري', 'عاري', 'عارية', 'عاريات', 'عراة', 'متعري', 'متعرية', 'تعري',
  'نيك', 'ينيك', 'نكاح', 'جماع', 'مضاجعة', 'ممارسة', 'يمارس', 'زنا', 'زنى',
  'لواط', 'سحاق', 'شذوذ', 'اغتصاب', 'تحرش', 'معاشرة', 'مباشرة', 'وطء',
  'زب', 'زبر', 'قضيب', 'ذكر', 'عضو', 'كس', 'فرج', 'مهبل', 'طيز', 'مؤخرة',
  'صدر', 'ثدي', 'بزاز', 'نهود', 'حلمات', 'خصية', 'بيضات', 'بظر', 'شفرات',
  'شرموطة', 'شرموط', 'عاهرة', 'عاهر', 'قحبة', 'قحاب', 'مومس', 'بغي',
  'ساقطة', 'ساقط', 'فاجرة', 'فاجر', 'داعرة', 'داعر', 'منحرف', 'منحرفة',
  'محارم', 'مثلي', 'مثلية', 'سحاقية', 'لوطي', 'خنثى', 'مخنث', 'متحول',
  'ميلف', 'شقراء', 'سمراء', 'مراهقة', 'مراهق', 'ناضجة', 'عذراء', 'بكر',
  'افلام سكس', 'صور سكس', 'فيديو سكس', 'مقاطع سكس', 'سكس عربي', 'سكس اجنبي',
  'سكس مصري', 'سكس خليجي', 'سكس سعودي', 'سكس مغربي', 'سكس عراقي', 'سكس سوري',
  'كاميرا', 'ويب كام', 'دردشة جنسية', 'محادثة ساخنة', 'ارقام بنات', 'تعارف جنسي',
  'اغراء', 'اثارة', 'مثير', 'مثيرة', 'ساخن', 'ساخنة', 'شهوة', 'شهواني', 'رغبة',
  'متعة', 'لذة', 'نشوة', 'هيجان', 'حشري', 'هايج', 'ممحون', 'ممحونة', 'متناك',
  'قذف', 'مني', 'احتلام', 'استمناء', 'عادة سرية', 'نزول', 'افرازات', 'رعشة',
  'خول', 'متخول', 'ديوث', 'قواد', 'قوادة', 'سفاح', 'سافل', 'وسخ', 'وسخة',
  'بوس', 'تقبيل', 'لحس', 'مص', 'رضع', 'عض', 'تحسس', 'لمس', 'احتكاك',
  'فخذ', 'افخاذ', 'ارداف', 'كفل', 'عجيزة', 'صدور', 'نهود', 'اثداء', 'حلمة',
  'جسم', 'جسد', 'لحم', 'بشرة', 'جلد', 'ملمس', 'ناعم', 'ناعمة', 'طري', 'طرية',
  'زوجي', 'زوجية', 'خيانة', 'خائن', 'خائنة', 'عشيق', 'عشيقة', 'حبيب', 'حبيبة',
  'ليلة حمراء', 'شهر عسل', 'علاقة حميمة', 'علاقة خاصة', 'علاقة سرية', 'لقاء ساخن',
  
  // Chinese Keywords  
  '色情', '黄色', '成人', '裸体', '性爱', '做爱', '性交', '性行为', '淫秽', '下流',
  '鸡巴', '阴茎', '阴道', '乳房', '屁股', '自慰', '手淫', '口交', '肛交', '高潮',
  '妓女', '卖淫', '嫖娼', '色狼', '变态', '同性恋', '双性恋', '人妖', '伪娘',
  'AV', '三级片', '毛片', '黄片', '色片', '情色', '激情', '性感', '诱惑', '春宫',
  '露点', '走光', '偷拍', '自拍', '裸照', '艳照', '床戏', '床上', '调教', '凌辱',
  '轮奸', '迷奸', '强暴', '性侵', '猥亵', '性骚扰', '潜规则', '包养', '援交', '一夜情',
  
  // Japanese Keywords
  'ポルノ', 'セックス', 'エロ', 'アダルト', '裸', 'ヌード', '性行為', '自慰', 'オナニー',
  'フェラ', 'アナル', '巨乳', '痴女', '変態', 'レイプ', 'ゲイ', 'レズ', 'ニューハーフ',
  'AV', 'エロ動画', 'エロ画像', '無修正', 'モザイク', '素人', '熟女', 'ロリ', 'ショタ',
  'エッチ', 'いやらしい', 'セクシー', 'ムラムラ', '欲情', '興奮', '快感', '絶頂', 'イク',
  '風俗', 'ソープ', 'ヘルス', 'デリヘル', 'キャバクラ', 'ホスト', '援助交際', '円光',
  
  // Korean Keywords
  '포르노', '섹스', '야동', '에로', '성인', '알몸', '누드', '성행위', '자위', '섹시',
  '가슴', '엉덩이', '성기', '음경', '질', '오럴', '항문', '매춘', '창녀', '게이',
  '레즈비언', '트랜스젠더', '변태', '몰카', '야한', '19금', '성인물', '벗방',
  '조건만남', '원조교제', '성매매', '룸싸롱', '안마', '키스방', '대딸', '섹파',
  
  // Hindi Keywords
  'चुदाई', 'सेक्स', 'पोर्न', 'नंगा', 'नंगी', 'अश्लील', 'कामुक', 'वासना', 'संभोग',
  'लिंग', 'योनि', 'स्तन', 'गांड', 'वेश्या', 'रंडी', 'कॉल गर्ल', 'मुठ', 'हस्तमैथुन',
  'बलात्कार', 'समलैंगिक', 'गे', 'लेस्बियन', 'किन्नर', 'हिजड़ा', 'कामसूत्र',
  'भाभी', 'देवर', 'जीजा', 'साली', 'कुंवारी', 'कुमारी', 'जवान', 'हॉट', 'सेक्सी',
  
  // Russian Keywords
  'порно', 'секс', 'эротика', 'голый', 'обнаженный', 'трах', 'ебать', 'хуй', 'пизда',
  'сиськи', 'жопа', 'минет', 'анал', 'мастурбация', 'оргазм', 'проститутка', 'шлюха',
  'гей', 'лесбиянка', 'транссексуал', 'фетиш', 'БДСМ', 'извращение', 'похоть', 'разврат',
  'блядь', 'сука', 'развратница', 'потаскуха', 'куртизанка', 'содержанка', 'любовница',
  
  // Spanish Keywords
  'porno', 'sexo', 'desnudo', 'erótico', 'follando', 'coger', 'chingar', 'puta', 'pene',
  'vagina', 'tetas', 'culo', 'mamada', 'orgasmo', 'masturbar', 'prostituta', 'lesbiana',
  'gay', 'transexual', 'fetiche', 'consolador', 'vibrador', 'caliente', 'cachondo',
  
  // French Keywords
  'porno', 'sexe', 'nu', 'érotique', 'baiser', 'foutre', 'bite', 'chatte', 'seins',
  'cul', 'pipe', 'anal', 'masturbation', 'orgasme', 'prostituée', 'pute', 'salope',
  'gay', 'lesbienne', 'transsexuel', 'fétiche', 'libertinage', 'échangiste', 'cochon',
  
  // German Keywords
  'porno', 'sex', 'nackt', 'erotisch', 'ficken', 'schwanz', 'penis', 'vagina', 'titten',
  'arsch', 'blasen', 'anal', 'masturbation', 'orgasmus', 'prostituierte', 'hure', 'nutte',
  'schwul', 'lesbisch', 'transsexuell', 'fetisch', 'geil', 'versaut', 'pervers'
];

// قائمة النطاقات المحظورة
const blockedDomains = [
  // Major International Sites
  'pornhub.com', 'xvideos.com', 'xnxx.com', 'xhamster.com', 'redtube.com',
  'youporn.com', 'tube8.com', 'spankbang.com', 'brazzers.com', 'pornhd.com',
  'beeg.com', 'motherless.com', 'porntrex.com', 'eporner.com', 'porn.com',
  'pornpics.com', 'hdporn.com', 'porn300.com', 'pornone.com', 'pornhat.com',
  'tnaflix.com', 'drtuber.com', 'nuvid.com', 'slutload.com', 'pornoxo.com',
  'sunporno.com', 'pornrabbit.com', 'pornid.xxx', 'cliphunter.com', 'xbabe.com',
  'updatetube.com', 'befuck.com', 'pornzog.com', 'iwank.tv', 'fapdu.com',
  'porndoe.com', 'hclips.com', 'porn7.xxx', 'porngo.com', 'porndig.com',
  'pornbimbo.com', 'porngem.com', 'pornhost.com', 'porntube.com', 'pornrox.com',
  'pornmaki.com', 'porn18.xxx', 'pornheed.com', 'pornhits.com', 'pornid.com',
  'pornktube.com', 'pornerbros.com', 'pornjam.com', 'pornxs.com', 'pornfay.com',
  'pornwild.com', 'pornfun.com', 'pornstar.com', 'pornbimbo.com', 'pornflip.com', 'pornrabbit.com',
  'porngif.com', 'pornpics.com', 'pornogratis.com', 'pornolandia.xxx', 'pornotube.com', 'pornovideos.com',
  'sex.com', 'sexvid.xxx', 'sexu.com', 'sexmex.xxx', 'sexarabsex.com', 'sexaraby.com', 'sexaraby.net',
  'sexaraby.org', 'sexaraby.xyz', 'sexaraby.site', 'sexaraby.live', 'sexaraby.online',
  'pornhd.tv', 'pornhd.xyz', 'pornhd.site', 'pornhd.online', 'pornhd.cam', 'pornhd.sex', 'pornhd.xxx',
  'pornhub.net', 'pornhub.org', 'pornhub.xyz', 'pornhub.site', 'pornhub.online', 'pornhub.cam', 'pornhub.sex', 'pornhub.xxx',
  'xvideos.net', 'xvideos.org', 'xvideos.xyz', 'xvideos.site', 'xvideos.online', 'xvideos.cam', 'xvideos.sex', 'xvideos.xxx',
  'xnxx.net', 'xnxx.org', 'xnxx.xyz', 'xnxx.site', 'xnxx.online', 'xnxx.cam', 'xnxx.sex', 'xnxx.xxx',
  
  // Live Cam Sites
  'chaturbate.com', 'livejasmin.com', 'cam4.com', 'camsoda.com', 'myfreecams.com',
  'stripchat.com', 'bongacams.com', 'flirt4free.com', 'imlive.com', 'streamate.com',
  'xcams.com', 'cams.com', 'camster.com', 'camdolls.com', 'camwhores.tv',
  'camgirls.com', 'camfuze.com', 'cam69.com', 'rabbits.cam', 'xlove.com',
  'xlovecam.com', 'camversity.com', 'skyprivate.com', 'camlust.com', 'camcontacts.com',
  
  // Premium/Paid Sites
  'onlyfans.com', 'manyvids.com', 'clips4sale.com', 'loyalfans.com', 'fansly.com',
  'justforfans.com', 'avnstars.com', 'pocketstars.com', 'unlockd.me', 'fancentro.com',
  'modelhub.com', 'pornhubpremium.com', 'ishotmyself.com', 'suicidegirls.com',
  'metart.com', 'x-art.com', 'nubiles.net', 'twistys.com', 'babes.com', 'realitykings.com',
  'mofos.com', 'digitalplayground.com', 'wicked.com', 'evil-angel.com', 'jules-jordan.com',
  
  // Arabic Sites
  'sexalarab.com', 'sexalarab.net', 'sexalarab.org', 'sexalarab.xyz', 'sexalarab.info', 'sexalarab.online', 'sexalarab.store', 'sexalarab.cam', 'sexalarab.sex', 'sexalarab.xxx',
  'sexaraby.com', 'sexaraby.net', 'sexaraby.tv', 'sexaraby.vip', 'sexaraby.site', 'sexaraby.org', 'sexaraby.xyz', 'sexaraby.info', 'sexaraby.online', 'sexaraby.store', 'sexaraby.cam', 'sexaraby.sex', 'sexaraby.xxx',
  'arabsex.com', 'arabsex.net', 'arabsex.tv', 'arabsex.vip', 'arabsex.site', 'arabsex.org', 'arabsex.xyz', 'arabsex.info', 'arabsex.online', 'arabsex.store', 'arabsex.cam', 'arabsex.sex', 'arabsex.xxx',
  'sex4arab.com', 'sex4arab.net', 'sex4arab.tv', 'sex4arab.vip', 'sex4arab.site', 'sex4arab.org', 'sex4arab.xyz', 'sex4arab.info', 'sex4arab.online', 'sex4arab.store', 'sex4arab.cam', 'sex4arab.sex', 'sex4arab.xxx',
  'aflamsex.com', 'aflamsex.net', 'aflamsex.tv', 'aflamsex.vip', 'aflamsex.site', 'aflamsex.org', 'aflamsex.xyz', 'aflamsex.info', 'aflamsex.online', 'aflamsex.store', 'aflamsex.cam', 'aflamsex.sex', 'aflamsex.xxx',
  'shoofsex.com', 'shoofsex.net', 'shoofsex.org', 'shoofsex.xyz', 'shoofsex.info', 'shoofsex.online', 'shoofsex.store', 'shoofsex.cam', 'shoofsex.sex', 'shoofsex.xxx',
  'soursex.com', 'soursex.net', 'soursex.tv', 'soursex.vip', 'soursex.site', 'soursex.org', 'soursex.xyz', 'soursex.info', 'soursex.online', 'soursex.store', 'soursex.cam', 'soursex.sex', 'soursex.xxx',
  'banatsex.com', 'banatsex.net', 'banatsex.tv', 'banatsex.vip', 'banatsex.site', 'banatsex.org', 'banatsex.xyz', 'banatsex.info', 'banatsex.online', 'banatsex.store', 'banatsex.cam', 'banatsex.sex', 'banatsex.xxx',
  'arabxnxx.com', 'arabxnxx.net', 'arabxnxx.org', 'arabxnxx.xyz', 'arabxnxx.info', 'arabxnxx.online', 'arabxnxx.store', 'arabxnxx.cam', 'arabxnxx.sex', 'arabxnxx.xxx',
  'seksaraby.com', 'seksaraby.net', 'seksaraby.org', 'seksaraby.xyz', 'seksaraby.info', 'seksaraby.online', 'seksaraby.store', 'seksaraby.cam', 'seksaraby.sex', 'seksaraby.xxx',
  'xnxxarab.com', 'xnxxarab.net', 'xnxxarab.org', 'xnxxarab.xyz', 'xnxxarab.info', 'xnxxarab.online', 'xnxxarab.store', 'xnxxarab.cam', 'xnxxarab.sex', 'xnxxarab.xxx',
  'pornhubعربي.com', 'pornhubعربي.net', 'pornhubعربي.org', 'pornhubعربي.xyz', 'pornhubعربي.info', 'pornhubعربي.online', 'pornhubعربي.store', 'pornhubعربي.cam', 'pornhubعربي.sex', 'pornhubعربي.xxx',
  'sex-arab.com', 'sex-arab.net', 'sex-arab.org', 'sex-arab.xyz', 'sex-arab.info', 'sex-arab.online', 'sex-arab.store', 'sex-arab.cam', 'sex-arab.sex', 'sex-arab.xxx',
  'arab-porn.com', 'arab-porn.net', 'arab-porn.org', 'arab-porn.xyz', 'arab-porn.info', 'arab-porn.online', 'arab-porn.store', 'arab-porn.cam', 'arab-porn.sex', 'arab-porn.xxx',
  'arabicsex.com', 'arabicsex.net', 'arabicsex.org', 'arabicsex.xyz', 'arabicsex.info', 'arabicsex.online', 'arabicsex.store', 'arabicsex.cam', 'arabicsex.sex', 'arabicsex.xxx',
  'sexegypt.com', 'sexegypt.net', 'sexegypt.tv', 'sexegypt.vip', 'sexegypt.site', 'sexegypt.org', 'sexegypt.xyz', 'sexegypt.info', 'sexegypt.online', 'sexegypt.store', 'sexegypt.cam', 'sexegypt.sex', 'sexegypt.xxx',
  'sexmorocco.com', 'sexmorocco.net', 'sexmorocco.tv', 'sexmorocco.vip', 'sexmorocco.site', 'sexmorocco.org', 'sexmorocco.xyz', 'sexmorocco.info', 'sexmorocco.online', 'sexmorocco.store', 'sexmorocco.cam', 'sexmorocco.sex', 'sexmorocco.xxx',
  'sexalgeria.com', 'sexalgeria.net', 'sexalgeria.tv', 'sexalgeria.vip', 'sexalgeria.site', 'sexalgeria.org', 'sexalgeria.xyz', 'sexalgeria.info', 'sexalgeria.online', 'sexalgeria.store', 'sexalgeria.cam', 'sexalgeria.sex', 'sexalgeria.xxx',
  'sexiraq.com', 'sexiraq.net', 'sexiraq.tv', 'sexiraq.vip', 'sexiraq.site', 'sexiraq.org', 'sexiraq.xyz', 'sexiraq.info', 'sexiraq.online', 'sexiraq.store', 'sexiraq.cam', 'sexiraq.sex', 'sexiraq.xxx',
  'sexsyria.com', 'sexsyria.net', 'sexsyria.tv', 'sexsyria.vip', 'sexsyria.site', 'sexsyria.org', 'sexsyria.xyz', 'sexsyria.info', 'sexsyria.online', 'sexsyria.store', 'sexsyria.cam', 'sexsyria.sex', 'sexsyria.xxx',
  'sexjordan.com', 'sexjordan.net', 'sexjordan.tv', 'sexjordan.vip', 'sexjordan.site', 'sexjordan.org', 'sexjordan.xyz', 'sexjordan.info', 'sexjordan.online', 'sexjordan.store', 'sexjordan.cam', 'sexjordan.sex', 'sexjordan.xxx',
  'sexlebanon.com', 'sexlebanon.net', 'sexlebanon.tv', 'sexlebanon.vip', 'sexlebanon.site', 'sexlebanon.org', 'sexlebanon.xyz', 'sexlebanon.info', 'sexlebanon.online', 'sexlebanon.store', 'sexlebanon.cam', 'sexlebanon.sex', 'sexlebanon.xxx',
  'sexpalestine.com', 'sexpalestine.net', 'sexpalestine.tv', 'sexpalestine.vip', 'sexpalestine.site', 'sexpalestine.org', 'sexpalestine.xyz', 'sexpalestine.info', 'sexpalestine.online', 'sexpalestine.store', 'sexpalestine.cam', 'sexpalestine.sex', 'sexpalestine.xxx',
  'sexgulf.com', 'sexgulf.net', 'sexgulf.tv', 'sexgulf.vip', 'sexgulf.site', 'sexgulf.org', 'sexgulf.xyz', 'sexgulf.info', 'sexgulf.online', 'sexgulf.store', 'sexgulf.cam', 'sexgulf.sex', 'sexgulf.xxx',
  'sexarabia.com', 'sexarabia.net', 'sexarabia.tv', 'sexarabia.vip', 'sexarabia.site', 'sexarabia.org', 'sexarabia.xyz', 'sexarabia.info', 'sexarabia.online', 'sexarabia.store', 'sexarabia.cam', 'sexarabia.sex', 'sexarabia.xxx',
  'sexkuwait.com', 'sexkuwait.net', 'sexkuwait.tv', 'sexkuwait.vip', 'sexkuwait.site', 'sexkuwait.org', 'sexkuwait.xyz', 'sexkuwait.info', 'sexkuwait.online', 'sexkuwait.store', 'sexkuwait.cam', 'sexkuwait.sex', 'sexkuwait.xxx',
  'sexsaudi.com', 'sexsaudi.net', 'sexsaudi.tv', 'sexsaudi.vip', 'sexsaudi.site', 'sexsaudi.org', 'sexsaudi.xyz', 'sexsaudi.info', 'sexsaudi.online', 'sexsaudi.store', 'sexsaudi.cam', 'sexsaudi.sex', 'sexsaudi.xxx',
  'sexemirates.com', 'sexemirates.net', 'sexemirates.tv', 'sexemirates.vip', 'sexemirates.site', 'sexemirates.org', 'sexemirates.xyz', 'sexemirates.info', 'sexemirates.online', 'sexemirates.store', 'sexemirates.cam', 'sexemirates.sex', 'sexemirates.xxx',
  'sexoman.com', 'sexoman.net', 'sexoman.tv', 'sexoman.vip', 'sexoman.site', 'sexoman.org', 'sexoman.xyz', 'sexoman.info', 'sexoman.online', 'sexoman.store', 'sexoman.cam', 'sexoman.sex', 'sexoman.xxx',
  'sexbahrain.com', 'sexbahrain.net', 'sexbahrain.tv', 'sexbahrain.vip', 'sexbahrain.site', 'sexbahrain.org', 'sexbahrain.xyz', 'sexbahrain.info', 'sexbahrain.online', 'sexbahrain.store', 'sexbahrain.cam', 'sexbahrain.sex', 'sexbahrain.xxx',
  'sexqatar.com', 'sexqatar.net', 'sexqatar.tv', 'sexqatar.vip', 'sexqatar.site', 'sexqatar.org', 'sexqatar.xyz', 'sexqatar.info', 'sexqatar.online', 'sexqatar.store', 'sexqatar.cam', 'sexqatar.sex', 'sexqatar.xxx',
  'sexyemen.com', 'sexlibya.com', 'sexsudan.com', 'sextunisia.com',
  'arabtube.com', 'arabporn.net', 'arbsex.com', 'arabicsextube.com', 'arabxxx.com',
  'sxsarabe.com', 'arabsexweb.com', 'sexalarab.net', 'arabsexx.com', 'sixarabe.com',
  'arabsexo.com', 'arab6.com', 'arbxxx.com', 'neekni.com', 'neswangy.com',
  'mozasex.com', 'sexjk.com', 'arabicporn.com', 'pornoelarab.com', 'sexoarab.com',
  'arabsexclips.com', 'arabteen.com', 'sexarabic.net', 'arabpussy.com', 'arabnaar.com',
  
  // Asian Sites  
  'javhd.com', 'jav.guru', 'javfree.me', 'javmost.com', 'javporn.tv', 'javhub.com',
  'asianporn.com', 'asiansex.com', 'asianxxx.com', 'asianpornmovies.com', 'asian18.com',
  'koreansex.com', 'koreanporn.com', 'chinesesex.com', 'chineseporn.com', 'japanesesex.com',
  'japaneseporn.com', 'thaisex.com', 'thaiporn.com', 'indiansex.com', 'indianporn.com',
  'desisex.com', 'desiporn.com', 'pakistanisex.com', 'pakistaniporn.com', 'pinaysex.com',
  'pinayxxx.com', 'indonesiansex.com', 'malaysiansex.com', 'vietnamsex.com', 'asiancams.com',
  
  // Gay Sites
  'gayporn.com', 'gaymaletube.com', 'pornhubgay.com', 'gay.xxx', 'men.com',
  'seancody.com', 'corbinfisher.com', 'gaytube.com', 'boyfriendtv.com', 'manhub.com',
  'gaycock4u.com', 'gay0day.com', 'gayporno.fm', 'xgaytube.tv', 'gaypornhd.com',
  
  // Lesbian Sites
  'lesbianporn.com', 'girlsway.com', 'lesbea.com', 'girlfriendsfilms.com', 'sweetheartvideo.com',
  'lesbianx.com', 'lesbianpornvideos.com', 'pussylickingvideos.com', 'lesbianfreeporn.com',
  
  // Trans Sites
  'shemaletube.com', 'tgirls.com', 'trans500.com', 'transsexual.com', 'tsporn.com',
  'shemaletubevideos.com', 'transgirltube.com', 'trannytube.tv', 'ladyboytube.com',
  
  // Forums & Communities
  'adultfriendfinder.com', 'ashleymadison.com', 'seekingarrangement.com', 'fetlife.com',
  'swinglifestyle.com', 'alt.com', 'passion.com', 'xmatch.com', 'getiton.com', 'nostringsattached.com',
  'benaughty.com', 'flirt.com', 'sexfinder.com', 'localsexfriend.com', 'xxxdating.com',
  
  // Image Hosts
  'imagefap.com', 'imgur.com/r/nsfw', 'eroshare.com', 'pixhost.to', 'imgbox.com',
  'postimage.org', 'imagebam.com', 'imagevenue.com', 'turboimagehost.com', 'pimpandhost.com',
  
  // Reddit NSFW
  'reddit.com/r/gonewild', 'reddit.com/r/nsfw', 'reddit.com/r/realgirls', 'reddit.com/r/nsfw_gifs',
  'reddit.com/r/porninfifteenseconds', 'reddit.com/r/60fpsporn', 'reddit.com/r/porn', 'reddit.com/r/nsfw411',
  
  // Torrent Sites
  'rarbg.to', 'thepiratebay.org', '1337x.to', 'pornolab.net', 'empornium.me',
  'pornbay.org', 'pussytorrents.org', 'bootytape.com', 'pornleech.com', 'cheggit.me',
  
  // Hentai/Anime
  'hentaihaven.com', 'hanime.tv', 'hentaistream.com', 'hentai.xxx', 'fakku.net',
  'nhentai.net', 'e-hentai.org', 'exhentai.org', 'hentai2read.com', 'hentaifox.com',
  'tsumino.com', 'pururin.io', 'doujin-moe.us', 'hitomi.la', 'hentainexus.com',
  
  // Other Languages
  'xnxx.fr', 'pornhub.fr', 'xvideos.es', 'pornhub.de', 'xnxx.desi', 'desiporn.com',
  'hindixxxvideos.com', 'pakistaniporn.tv', 'arabxnxx.org', 'sexurdu.com', 'urdusex.com'
];

// قائمة الفئات المحظورة
const blockedCategories = [
  'adult',
  'pornography',
  'nudity',
  'sexual-content',
  'explicit-content',
  'mature-content',
  'escort-services',
  'adult-dating',
  'webcam-adult',
  'lingerie-adult',
  'sex-education-explicit',
  'adult-toys',
  'adult-hosting',
  'adult-communities',
  'adult-forums',
  'adult-image-hosting',
  'adult-video-hosting',
  'adult-live-streaming',
  'adult-chat',
  'adult-social-media',
  'fetish-content',
  'bdsm-content',
  'hentai-manga',
  'erotic-literature',
  'adult-games',
  'adult-virtual-reality',
  'adult-animation',
  'adult-comics',
  'strip-clubs',
  'sex-shops',
  'adult-entertainment-venues'
];

  // قائمة المواقع الآمنة (القائمة البيضاء)
  const safeWebsites = [
    'facebook.com',
    'fb.com',
    'facebook.net',
    'fbcdn.net',
    'messenger.com',
    'google.com',
    'youtube.com',
    'instagram.com',
    'twitter.com',
    'tiktok.com',
    'snapchat.com',
    'wikipedia.org',
    'linkedin.com',
    'github.com',
    'microsoft.com',
    'apple.com',
    'amazon.com',
    'netflix.com'
  ];

  // الكلمات المسموح بها في البحث
  const safeSearchWords = [
    // مواقع التواصل الاجتماعي
    'فيسبوك', 'فيس بوك', 'انستقرام', 'انستغرام', 'تويتر', 'تيك توك', 'تيكتوك',
    'يوتيوب', 'يوتيوبر', 'سناب شات', 'سناب', 'ماسنجر', 'تلقرام', 'تليجرام',
    'واتساب', 'واتس اب', 'لينكد ان', 'لينكدان',
    // محركات البحث
    'قوقل', 'جوجل', 'ياهو', 'بينج', 'بينق',
    // منصات الفيديو
    'نتفلكس', 'نتفليكس', 'شاهد', 'ڤي او دي', 'يوتيوب',
    // شركات تقنية
    'ابل', 'سامسونج', 'هواوي', 'مايكروسوفت', 'امازون',
    // مواقع تجارية
    'امازون', 'نون', 'جملون', 'علي اكسبرس', 'علي بابا'
  ];
  
  // التحقق من URL
  function isBlockedUrl(url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      const path = urlObj.pathname.toLowerCase();
      const search = urlObj.search.toLowerCase();

      // التحقق من القائمة البيضاء أولاً
      for (const safe of safeWebsites) {
        if (domain === safe || domain.endsWith('.' + safe)) {
          return false; // السماح بالمواقع الآمنة دائماً
        }
      }
      
      // التحقق من النطاقات المحظورة
      for (const blocked of blockedDomains) {
        // تحقق كامل من النطاق
        if (domain === blocked || domain.endsWith('.' + blocked)) {
          return true;
        }
      }

      // تجزئة المسار إلى كلمات
      const pathWords = path.split(/[\/\-_\.]/);
      const searchWords = decodeURIComponent(search).split(/[\/\-_\.&=?]/);
      const allWords = [...pathWords, ...searchWords].filter(word => word.length > 3);

      // عداد للكلمات المحظورة
      let adultWordsCount = 0;
      
      // التحقق من الكلمات المسموح بها أولاً
      for (const word of allWords) {
        if (safeSearchWords.some(safeWord => 
          word.includes(safeWord) || 
          word.replace(/[أإآا]/g, 'ا').includes(safeWord) ||
          word.replace(/[ىي]/g, 'ي').includes(safeWord)
        )) {
          return false; // السماح بالكلمات الآمنة
        }
      }

      // التحقق من الكلمات المحظورة
      for (const word of allWords) {
        // تجاهل الكلمات القصيرة جداً
        if (word.length < 4) continue;

        for (const keyword of blockedKeywords) {
          // تجنب الكلمات الجزئية
          if (keyword.length < 4) continue;

          // البحث عن تطابق كامل للكلمة
          if (word === keyword || 
              word.startsWith(keyword + '-') || 
              word.endsWith('-' + keyword) || 
              word === keyword.replace(/[-_]/g, '')) {
            adultWordsCount++;
            if (adultWordsCount >= 2) { // نحتاج على الأقل كلمتين محظورتين
              return true;
            }
            break;
          }
        }
      }

      // فحص إضافي للمحتوى في حالة وجود كلمة واحدة مشبوهة
      if (adultWordsCount === 1) {
        // التحقق من وجود كلمات إضافية تدل على المحتوى المحظور
        const suspiciousWords = ['video', 'videos', 'pics', 'pictures', 'images', 'gallery', 
                               'صور', 'فيديو', 'مقاطع', 'افلام', 'مشاهدة', 'تحميل'];
        
        for (const word of allWords) {
          if (suspiciousWords.some(sw => word.includes(sw))) {
            return true;
          }
        }
      }
    } catch (e) {
      console.error('Invalid URL:', url);
      // في حالة عدم صحة الرابط، نتحقق من النص كاملاً
      const urlLower = url.toLowerCase();
      let adultWordsCount = 0;
      
      for (const keyword of blockedKeywords) {
        if (urlLower.includes(keyword)) {
          adultWordsCount++;
          if (adultWordsCount >= 2) {
            return true;
          }
        }
      }
    }
    
    return false;
  }
  
  // اعتراض الطلبات
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      if (isBlockedUrl(details.url)) {
        // إعادة توجيه إلى صفحة الحظر
        return {
          redirectUrl: chrome.runtime.getURL('blocked.html')
        };
      }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
  );

  // مراقبة التابات الجديدة
  chrome.tabs.onCreated.addListener((tab) => {
    if (tab.pendingUrl && isBlockedUrl(tab.pendingUrl)) {
      chrome.tabs.update(tab.id, { url: chrome.runtime.getURL('blocked.html') });
    }
  });

  // مراقبة تحديثات التاب
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && isBlockedUrl(changeInfo.url)) {
      chrome.tabs.update(tabId, { url: chrome.runtime.getURL('blocked.html') });
    }
  });
  
  // تحليل محتوى الصفحة
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkContent') {
      const isBlocked = checkContentForAdult(request.content);
      sendResponse({ blocked: isBlocked });
    }
  });
  
  // فحص المحتوى
  function checkContentForAdult(content) {
    const contentLower = content.toLowerCase();
    let score = 0;
    
    for (const keyword of blockedKeywords) {
      if (contentLower.includes(keyword)) {
        score++;
      }
    }
    
    return score >= 3; // حظر إذا وجدت 3 كلمات محظورة أو أكثر
  }
  
  // إدارة القوائم البيضاء
  let whitelist = [];
  
  chrome.storage.local.get(['whitelist'], function(result) {
    if (result.whitelist) {
      whitelist = result.whitelist;
    }
  });
  
  // تحديث القوائم
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.whitelist) {
      whitelist = changes.whitelist.newValue || [];
    }
  });

  // إعداد CleanBrowsing DNS
  async function setupCleanBrowsingDNS() {
    try {
      // إعدادات CleanBrowsing DNS للتصفية العائلية
      const cleanBrowsingDNS = {
        primary: '185.228.168.168',
        secondary: '185.228.169.168',
        ipv6Primary: '2a0d:2a00:1::1',
        ipv6Secondary: '2a0d:2a00:2::1'
      };

      // تكوين شبكة الواي فاي الحالية
      const networkConfig = {
        networkType: 'wifi',
        dns: {
          servers: [
            cleanBrowsingDNS.primary,
            cleanBrowsingDNS.secondary,
            cleanBrowsingDNS.ipv6Primary,
            cleanBrowsingDNS.ipv6Secondary
          ]
        }
      };

      // طلب أذونات الشبكة إذا لم تكن موجودة
      const permissions = await chrome.permissions.request({
        permissions: ['networking.config']
      });

      if (permissions) {
        // تطبيق إعدادات DNS
        await chrome.networking.config.setNetworkFilter(networkConfig);
        console.log('تم تفعيل CleanBrowsing DNS بنجاح');

        // حفظ حالة التفعيل
        chrome.storage.local.set({ 'dnsEnabled': true });
      }
    } catch (error) {
      console.error('خطأ في إعداد CleanBrowsing DNS:', error);
    }
  }

  // تشغيل عند بدء الإضافة
  setupCleanBrowsingDNS();

  // فحص حالة DNS عند بدء التشغيل
  chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get(['dnsEnabled'], (result) => {
      if (!result.dnsEnabled) {
        setupCleanBrowsingDNS();
      }
    });
  });