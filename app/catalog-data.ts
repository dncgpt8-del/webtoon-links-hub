export type Locale = string;

export type PlatformId = string;

export type CountryId = string;

export type WorkLink = {
  id: string;
  country: CountryId;
  platform: PlatformId;
  language: Locale;
  region: "domestic" | "overseas";
  status: string;
  url: string;
};

export type WorkItem = {
  id: string;
  title: Record<string, string>;
  aliases: string[];
  hidden?: boolean;
  links: WorkLink[];
};

export type CountryMeta = {
  id: string;
  code: string;
  name: string;
  flag: string;
  aliases: string[];
};

export type PlatformMeta = {
  id: string;
  name: string;
  icon: string;
  tone: string;
  aliases: string[];
};

export const localeNames: Record<string, string> = {
  ko: "한국어",
  en: "영어",
  ja: "일본어",
  zh: "중국어",
  th: "태국어",
  id: "인니어",
  fr: "프랑스어",
  es: "스페인어",
  de: "독일어",
  pt: "포르투갈어",
  ru: "러시아어",
  vi: "베트남어",
  ar: "아랍어",
};

export const countries: Record<string, CountryMeta> = {
  kr: {
    id: "kr",
    code: "KR",
    name: "국내",
    flag: "🇰🇷",
    aliases: ["국내", "한국", "대한민국", "korea", "south korea", "kr"],
  },
  jp: {
    id: "jp",
    code: "JP",
    name: "일본",
    flag: "🇯🇵",
    aliases: ["일본", "japan", "nihon", "jp"],
  },
  us: {
    id: "us",
    code: "US",
    name: "북미",
    flag: "🇺🇸",
    aliases: ["북미", "미국", "usa", "united states", "america", "us"],
  },
  cn: {
    id: "cn",
    code: "CN",
    name: "중국",
    flag: "🇨🇳",
    aliases: ["중국", "china", "cn", "bilibili"],
  },
  th: {
    id: "th",
    code: "TH",
    name: "태국",
    flag: "🇹🇭",
    aliases: ["태국", "thailand", "thai", "th"],
  },
  id: {
    id: "id",
    code: "ID",
    name: "인도네시아",
    flag: "🇮🇩",
    aliases: ["인도네시아", "indonesia", "id"],
  },
  global: {
    id: "global",
    code: "EN",
    name: "글로벌",
    flag: "🌍",
    aliases: ["글로벌", "global", "worldwide"],
  },
  fr: {
    id: "fr",
    code: "FR",
    name: "프랑스",
    flag: "🇫🇷",
    aliases: ["프랑스", "france", "french", "fr"],
  },
  de: {
    id: "de",
    code: "DE",
    name: "독일",
    flag: "🇩🇪",
    aliases: ["독일", "germany", "deutschland", "de"],
  },
  pt: {
    id: "pt",
    code: "PT",
    name: "포르투갈",
    flag: "🇵🇹",
    aliases: ["포르투갈", "portugal", "pt"],
  },
  "pt-br": {
    id: "pt-br",
    code: "PT-BR",
    name: "포르투갈-브라질",
    flag: "🇧🇷",
    aliases: ["포르투갈-브라질", "포르투갈어/브라질", "pt-br", "brazilian portuguese"],
  },
  es: {
    id: "es",
    code: "ES",
    name: "스페인",
    flag: "🇪🇸",
    aliases: ["스페인", "spain", "es"],
  },
  ru: {
    id: "ru",
    code: "RU",
    name: "러시아",
    flag: "🇷🇺",
    aliases: ["러시아", "russia", "ru"],
  },
  vi: {
    id: "vi",
    code: "VN",
    name: "베트남",
    flag: "🇻🇳",
    aliases: ["베트남", "vietnam", "vi", "vn"],
  },
  ar: {
    id: "ar",
    code: "AR",
    name: "아랍",
    flag: "🌙",
    aliases: ["아랍", "아랍어", "arab", "ar"],
  },
};

export const platforms: Record<string, PlatformMeta> = {
  kakao: {
    id: "kakao",
    name: "카카오페이지",
    icon: "K",
    tone: "amber",
    aliases: ["카카오페이지", "kakaopage", "kakao page"],
  },
  series: {
    id: "series",
    name: "네이버 시리즈",
    icon: "N",
    tone: "emerald",
    aliases: ["네이버", "시리즈", "naver", "series"],
  },
  webtoon: {
    id: "webtoon",
    name: "WEBTOON",
    icon: "W",
    tone: "green",
    aliases: ["webtoon", "라인웹툰", "line webtoon"],
  },
  webnovel: {
    id: "webnovel",
    name: "Webnovel",
    icon: "Wn",
    tone: "indigo",
    aliases: ["webnovel", "웹노벨"],
  },
  piccoma: {
    id: "piccoma",
    name: "Piccoma",
    icon: "P",
    tone: "orange",
    aliases: ["piccoma", "픽코마"],
  },
  kakaoTh: {
    id: "kakaoTh",
    name: "KakaoPage (TH)",
    icon: "K",
    tone: "amber",
    aliases: ["kakaopage th", "카카오페이지 태국"],
  },
  bilibili: {
    id: "bilibili",
    name: "Bilibili Comics",
    icon: "B",
    tone: "cyan",
    aliases: ["bilibili", "빌리빌리"],
  },
  line: {
    id: "line",
    name: "Line Manga",
    icon: "L",
    tone: "lime",
    aliases: ["line manga", "라인망가", "라인만화"],
  },
  pocket: {
    id: "pocket",
    name: "Pocket Comics",
    icon: "Pc",
    tone: "violet",
    aliases: ["pocket comics", "포켓코믹스"],
  },
  tapas: {
    id: "tapas",
    name: "Tapas",
    icon: "T",
    tone: "red",
    aliases: ["tapas", "타파스"],
  },
};

export const defaultCatalogCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMDWo2v54pUCJMgxFOFJaYcukKAnxnh9p_88BQDxRholWzI9q5OfI0o1v517R1qssApRqRRvsD3QgZ/pub?output=csv";

const languageAliases: Record<string, string> = {
  ko: "ko",
  kor: "ko",
  korean: "ko",
  한국어: "ko",
  영어: "en",
  en: "en",
  eng: "en",
  english: "en",
  일본어: "ja",
  ja: "ja",
  jpn: "ja",
  japanese: "ja",
  중국어: "zh",
  zh: "zh",
  chinese: "zh",
  français: "fr",
  francais: "fr",
  프랑스어: "fr",
  fr: "fr",
  french: "fr",
  español: "es",
  espanol: "es",
  태국어: "th",
  th: "th",
  thai: "th",
  deutsch: "de",
  german: "de",
  인니어: "id",
  인도네시아어: "id",
  id: "id",
  indonesian: "id",
  português: "pt",
  portugues: "pt",
  russian: "ru",
  русский: "ru",
  vietnamese: "vi",
  "tiếng việt": "vi",
  arabic: "ar",
};

function normalizeText(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .replace(/\u00a0/g, " ");
}

function normalizeKey(value: string) {
  return normalizeText(value).toLowerCase();
}

function aliasMatches(value: string, aliases: string[]) {
  const normalized = normalizeKey(value);
  return aliases.some((alias) => normalizeKey(alias) === normalized);
}

function lookupMeta<T extends { aliases: string[] }>(
  value: string,
  registry: Record<string, T>,
) {
  const normalized = normalizeText(value);

  const match = Object.entries(registry).find(([, item]) =>
    aliasMatches(normalized, item.aliases),
  );

  return match?.[1] ?? null;
}

export function slugifyId(value: string) {
  const normalized = normalizeText(value).toLowerCase();
  const slug = normalized
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "work";
}

export function getCountryMeta(value: string): CountryMeta {
  const match = lookupMeta(value, countries);

  if (match) {
    return match;
  }

  const name = normalizeText(value) || "기타";
  return {
    id: slugifyId(name),
    code: /^[a-z]{2}(?:-[a-z]{2})?$/i.test(name) ? name.toUpperCase() : "XX",
    name,
    flag: "🌐",
    aliases: [name],
  };
}

export function getPlatformMeta(value: string): PlatformMeta {
  const match = lookupMeta(value, platforms);

  if (match) {
    return match;
  }

  const name = normalizeText(value) || "기타";
  return {
    id: slugifyId(name),
    name,
    icon: name.slice(0, 2).toUpperCase() || "?",
    tone: "violet",
    aliases: [name],
  };
}

export function normalizeLanguageCode(value: string) {
  const normalized = normalizeKey(value);
  return languageAliases[normalized] ?? normalized;
}

export function getLocaleLabel(locale: string) {
  return localeNames[normalizeLanguageCode(locale)] ?? (normalizeText(locale) || locale);
}

export function parseBooleanFlag(value: string | undefined) {
  const normalized = normalizeKey(value ?? "");
  return ["true", "1", "yes", "y", "예", "공개", "show", "visible"].includes(normalized);
}

function parseCsvRows(csvText: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const next = csvText[index + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
        continue;
      }

      if (char === '"') {
        inQuotes = false;
        continue;
      }

      cell += char;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(cell);
      cell = "";
      continue;
    }

    if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    if (char !== "\r") {
      cell += char;
    }
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows
    .map((columns) =>
      columns.map((column, index) =>
        index === 0 ? column.replace(/^\ufeff/, "") : column,
      ),
    )
    .filter((columns) => columns.some((value) => normalizeText(value).length > 0));
}

function headerIndex(headers: string[], aliases: string[]) {
  const normalizedHeaders = headers.map((header) => normalizeKey(header));
  for (const alias of aliases) {
    const index = normalizedHeaders.indexOf(normalizeKey(alias));
    if (index >= 0) {
      return index;
    }
  }
  return -1;
}

export function parseCatalogCsv(csvText: string): WorkItem[] {
  const rows = parseCsvRows(csvText);
  if (!rows.length) {
    return [];
  }

  const headers = rows[0];
  const workIdIndex = headerIndex(headers, ["작품ID", "작품 ID", "workid", "work id", "작품명"]);
  const countryIndex = headerIndex(headers, ["국가", "country"]);
  const languageIndex = headerIndex(headers, ["언어", "language"]);
  const platformIndex = headerIndex(headers, ["플랫폼", "platform"]);
  const titleIndex = headerIndex(headers, ["현지제목", "현지 제목", "title", "현지명"]);
  const urlIndex = headerIndex(headers, ["URL", "url", "링크"]);
  const visibleIndex = headerIndex(headers, ["노출", "visible", "공개"]);

  if (
    workIdIndex < 0 ||
    countryIndex < 0 ||
    languageIndex < 0 ||
    platformIndex < 0 ||
    titleIndex < 0 ||
    urlIndex < 0
  ) {
    return [];
  }

  const grouped = new Map<
    string,
    {
      id: string;
      title: Record<string, string>;
      aliases: Set<string>;
      links: WorkLink[];
      linkKeys: Set<string>;
    }
  >();

  for (const columns of rows.slice(1)) {
    const workId = normalizeText(columns[workIdIndex] ?? "");
    const country = normalizeText(columns[countryIndex] ?? "");
    const language = normalizeLanguageCode(columns[languageIndex] ?? "");
    const platform = normalizeText(columns[platformIndex] ?? "");
    const title = normalizeText(columns[titleIndex] ?? "");
    const url = normalizeText(columns[urlIndex] ?? "");
    const visible = visibleIndex < 0 ? true : parseBooleanFlag(columns[visibleIndex]);

    if (!workId || !country || !language || !platform || !title || !url || !visible) {
      continue;
    }

    const id = slugifyId(workId);
    const linkKey = `${country}::${platform}::${language}::${url}`;
    const current = grouped.get(id) ?? {
      id,
      title: {},
      aliases: new Set<string>(),
      links: [],
      linkKeys: new Set<string>(),
    };

    current.title[language] = title;
    current.title.ko = current.title.ko ?? workId;
    current.aliases.add(workId);
    current.aliases.add(title);

    if (!current.linkKeys.has(linkKey)) {
      current.linkKeys.add(linkKey);
      current.links.push({
        id: `${id}-${current.links.length + 1}`,
        country,
        platform,
        language,
        region: getCountryMeta(country).id === "kr" ? "domestic" : "overseas",
        status: "",
        url,
      });
    }

    grouped.set(id, current);
  }

  return Array.from(grouped.values())
    .map((work) => ({
      id: work.id,
      title: work.title,
      aliases: Array.from(work.aliases).map((item) => normalizeText(item)).filter(Boolean),
      links: work.links,
    }))
    .filter((work) => work.links.length > 0);
}

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
