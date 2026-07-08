export type Locale = "ko" | "en" | "ja";

export type PlatformId =
  | "kakao"
  | "series"
  | "webtoon"
  | "webnovel"
  | "piccoma"
  | "kakaoTh"
  | "bilibili"
  | "line"
  | "pocket"
  | "tapas";

export type CountryId =
  | "kr"
  | "jp"
  | "us"
  | "cn"
  | "th"
  | "id"
  | "global";

export type WorkLink = {
  id: string;
  country: CountryId;
  platform: PlatformId;
  language: Locale | "zh" | "th" | "id";
  region: "domestic" | "overseas";
  status: string;
  url: string;
};

export type WorkItem = {
  id: string;
  title: Record<Locale, string>;
  aliases: string[];
  hidden?: boolean;
  links: WorkLink[];
};

export const localeNames: Record<string, string> = {
  ko: "한국어",
  en: "영어",
  ja: "일본어",
  zh: "중국어",
  th: "태국어",
  id: "인니어",
};

export const countries: Record<
  CountryId,
  { name: string; flag: string; aliases: string[] }
> = {
  kr: {
    name: "국내",
    flag: "🇰🇷",
    aliases: ["국내", "한국", "대한민국", "korea", "south korea", "kr"],
  },
  jp: {
    name: "일본",
    flag: "🇯🇵",
    aliases: ["일본", "japan", "nihon", "jp"],
  },
  us: {
    name: "북미",
    flag: "🇺🇸",
    aliases: ["북미", "미국", "usa", "united states", "america", "us"],
  },
  cn: {
    name: "중국",
    flag: "🇨🇳",
    aliases: ["중국", "china", "cn", "bilibili"],
  },
  th: {
    name: "태국",
    flag: "🇹🇭",
    aliases: ["태국", "thailand", "thai", "th"],
  },
  id: {
    name: "인도네시아",
    flag: "🇮🇩",
    aliases: ["인도네시아", "indonesia", "id"],
  },
  global: {
    name: "글로벌",
    flag: "🌍",
    aliases: ["글로벌", "global", "worldwide"],
  },
};

export const platforms: Record<
  PlatformId,
  { name: string; icon: string; tone: string; aliases: string[] }
> = {
  kakao: {
    name: "카카오페이지",
    icon: "K",
    tone: "amber",
    aliases: ["카카오페이지", "kakaopage", "kakao page"],
  },
  series: {
    name: "네이버 시리즈",
    icon: "N",
    tone: "emerald",
    aliases: ["네이버", "시리즈", "naver", "series"],
  },
  webtoon: {
    name: "WEBTOON",
    icon: "W",
    tone: "green",
    aliases: ["webtoon", "라인웹툰", "line webtoon"],
  },
  webnovel: {
    name: "Webnovel",
    icon: "Wn",
    tone: "indigo",
    aliases: ["webnovel", "웹노벨"],
  },
  piccoma: {
    name: "Piccoma",
    icon: "P",
    tone: "orange",
    aliases: ["piccoma", "픽코마"],
  },
  kakaoTh: {
    name: "KakaoPage (TH)",
    icon: "K",
    tone: "amber",
    aliases: ["kakaopage th", "카카오페이지 태국"],
  },
  bilibili: {
    name: "Bilibili Comics",
    icon: "B",
    tone: "cyan",
    aliases: ["bilibili", "빌리빌리"],
  },
  line: {
    name: "Line Manga",
    icon: "L",
    tone: "lime",
    aliases: ["line manga", "라인망가", "라인만화"],
  },
  pocket: {
    name: "Pocket Comics",
    icon: "Pc",
    tone: "violet",
    aliases: ["pocket comics", "포켓코믹스"],
  },
  tapas: {
    name: "Tapas",
    icon: "T",
    tone: "red",
    aliases: ["tapas", "타파스"],
  },
};

export const catalog: WorkItem[] = [
  {
    id: "solo-leveling",
    title: {
      ko: "나 혼자만 레벨업",
      en: "Solo Leveling",
      ja: "俺だけレベルアップな件",
    },
    aliases: ["solo leveling", "俺だけレベルアップな件", "我独自升级"],
    links: [
      {
        id: "solo-kakao",
        country: "kr",
        platform: "kakao",
        language: "ko",
        region: "domestic",
        status: "연재중",
        url: "https://page.kakao.com/",
      },
      {
        id: "solo-series",
        country: "kr",
        platform: "series",
        language: "ko",
        region: "domestic",
        status: "연재중",
        url: "https://series.naver.com/",
      },
      {
        id: "solo-tapas",
        country: "us",
        platform: "tapas",
        language: "en",
        region: "overseas",
        status: "연재중",
        url: "https://tapas.io/",
      },
      {
        id: "solo-webnovel",
        country: "global",
        platform: "webnovel",
        language: "en",
        region: "overseas",
        status: "연재중",
        url: "https://www.webnovel.com/",
      },
      {
        id: "solo-piccoma",
        country: "jp",
        platform: "piccoma",
        language: "ja",
        region: "overseas",
        status: "연재중",
        url: "https://piccoma.com/",
      },
      {
        id: "solo-kakao-th",
        country: "th",
        platform: "kakaoTh",
        language: "th",
        region: "overseas",
        status: "연재중",
        url: "https://th.kakaowebtoon.com/",
      },
      {
        id: "solo-bilibili",
        country: "cn",
        platform: "bilibili",
        language: "zh",
        region: "overseas",
        status: "연재중",
        url: "https://www.bilibilicomics.com/",
      },
      {
        id: "solo-line",
        country: "id",
        platform: "line",
        language: "id",
        region: "overseas",
        status: "연재중",
        url: "https://www.webtoons.com/id/",
      },
      {
        id: "solo-pocket",
        country: "global",
        platform: "pocket",
        language: "en",
        region: "overseas",
        status: "연재중",
        url: "https://www.pocketcomics.com/",
      },
    ],
  },
  {
    id: "omniscient-reader",
    title: {
      ko: "전지적 독자 시점",
      en: "Omniscient Reader",
      ja: "全知的な読者の視点から",
    },
    aliases: ["omniscient reader", "orv", "전독시"],
    links: [
      {
        id: "orv-naver",
        country: "kr",
        platform: "series",
        language: "ko",
        region: "domestic",
        status: "연재중",
        url: "https://series.naver.com/",
      },
      {
        id: "orv-webtoon",
        country: "global",
        platform: "webtoon",
        language: "en",
        region: "overseas",
        status: "연재중",
        url: "https://www.webtoons.com/",
      },
      {
        id: "orv-line",
        country: "jp",
        platform: "line",
        language: "ja",
        region: "overseas",
        status: "연재중",
        url: "https://manga.line.me/",
      },
    ],
  },
  {
    id: "return-of-mount-hua",
    title: {
      ko: "화산귀환",
      en: "Return of the Mount Hua Sect",
      ja: "花山転生",
    },
    aliases: ["return of mount hua", "화귀", "mount hua"],
    links: [
      {
        id: "hwasan-naver",
        country: "kr",
        platform: "series",
        language: "ko",
        region: "domestic",
        status: "연재중",
        url: "https://series.naver.com/",
      },
      {
        id: "hwasan-webtoon",
        country: "global",
        platform: "webtoon",
        language: "en",
        region: "overseas",
        status: "연재중",
        url: "https://www.webtoons.com/",
      },
      {
        id: "hwasan-line",
        country: "jp",
        platform: "line",
        language: "ja",
        region: "overseas",
        status: "연재중",
        url: "https://manga.line.me/",
      },
    ],
  },
  {
    id: "lookism",
    title: {
      ko: "외모지상주의",
      en: "Lookism",
      ja: "外見至上主義",
    },
    aliases: ["lookism", "外見至上主義"],
    links: [
      {
        id: "lookism-webtoon-kr",
        country: "kr",
        platform: "webtoon",
        language: "ko",
        region: "domestic",
        status: "연재중",
        url: "https://comic.naver.com/",
      },
      {
        id: "lookism-webtoon-global",
        country: "global",
        platform: "webtoon",
        language: "en",
        region: "overseas",
        status: "연재중",
        url: "https://www.webtoons.com/",
      },
    ],
  },
  {
    id: "tower-of-god",
    title: {
      ko: "신의 탑",
      en: "Tower of God",
      ja: "神之塔",
    },
    aliases: ["tower of god", "tog", "神之塔"],
    links: [
      {
        id: "tog-webtoon-kr",
        country: "kr",
        platform: "webtoon",
        language: "ko",
        region: "domestic",
        status: "연재중",
        url: "https://comic.naver.com/",
      },
      {
        id: "tog-webtoon-global",
        country: "global",
        platform: "webtoon",
        language: "en",
        region: "overseas",
        status: "연재중",
        url: "https://www.webtoons.com/",
      },
    ],
  },
  {
    id: "raeliana",
    title: {
      ko: "그녀가 공작저로 가야 했던 사정",
      en: "Why Raeliana Ended Up at the Duke's Mansion",
      ja: "彼女が公爵邸に行った理由",
    },
    aliases: ["raeliana", "공작저", "彼女が公爵邸に行った理由"],
    links: [
      {
        id: "raeliana-kakao",
        country: "kr",
        platform: "kakao",
        language: "ko",
        region: "domestic",
        status: "완결",
        url: "https://page.kakao.com/",
      },
      {
        id: "raeliana-tapas",
        country: "us",
        platform: "tapas",
        language: "en",
        region: "overseas",
        status: "완결",
        url: "https://tapas.io/",
      },
      {
        id: "raeliana-piccoma",
        country: "jp",
        platform: "piccoma",
        language: "ja",
        region: "overseas",
        status: "완결",
        url: "https://piccoma.com/",
      },
    ],
  },
];
