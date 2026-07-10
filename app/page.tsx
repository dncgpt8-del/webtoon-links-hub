"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  catalog,
  getCountryMeta,
  getLocaleLabel as getLanguageLabel,
  getPlatformMeta,
  WorkItem,
  WorkLink,
} from "./catalog-data";

type ViewMode = "grid" | "list";
type FilterValue<T extends string> = T | "all";
type UiLocale = "ko" | "en" | "ja";
type CountryOption = {
  id: string;
  name: string;
  flag: string;
};
type PlatformOption = {
  id: string;
  name: string;
  icon: string;
  tone: string;
};

const storageKeys = {
  locale: "webtoonLinks:locale",
};

const emptyCatalog: WorkItem[] = [];

const uiLocaleOptions = ["ko", "en", "ja"] as const;
const titleDisplayOrder = ["ko", "en", "ja", "zh", "fr", "th", "id"] as const;

const uiCopy = {
  ko: {
    viewGrid: "카드 보기",
    viewList: "리스트 보기",
    heroTitle: "디앤씨웹툰 정식 사이트",
    heroDescription: "국내, 해외 모든 플랫폼의 정식 연재 웹툰 링크를 확인하세요.",
    searchPlaceholder: "작품명 또는 별칭으로 검색",
    countryAll: "국가 전체",
    platformAll: "플랫폼 전체",
    reset: "초기화",
    localeLabel: "언어",
    localeOptions: {
      ko: "한국어",
      en: "English",
      ja: "日本語",
    },
    worksTitle: "전체 작품",
    resultCount: (works: number, links: number) => `${works} 작품 · ${links} 링크`,
    cardCount: (domestic: number, overseas: number, total: number) =>
      `국내 ${domestic} · 해외 ${overseas} · 전체 ${total}`,
    emptyState: "조건에 맞는 작품이 없습니다.",
    footerNote: "작품 데이터는 구글 시트에서 자동 반영됩니다.",
    detailHome: "홈",
    detailList: "작품 목록",
    detailOfficial: "정식 연재처",
    detailLinkCount: (count: number) => `${count}개 정식 링크`,
    detailMetaSuffix: "링크 복사 지원",
    detailShared: "복사됨",
    detailDomestic: "국내",
    detailOverseas: "해외",
    detailOpen: "바로가기",
    detailCopy: "복사",
    detailSearchHint: "작품명 또는 별칭으로 검색",
    countryNames: {
      kr: "국내",
      jp: "일본",
      us: "북미",
      cn: "중국",
      th: "태국",
      id: "인도네시아",
      global: "글로벌",
    },
    localeNames: {
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
    },
    titleOrder: titleDisplayOrder,
  },
  en: {
    viewGrid: "Card view",
    viewList: "List view",
    heroTitle: "D&C Webtoon official site",
    heroDescription: "Find official webtoon links across domestic and overseas platforms.",
    searchPlaceholder: "Search by title or alias",
    countryAll: "All countries",
    platformAll: "All platforms",
    reset: "Reset",
    localeLabel: "Language",
    localeOptions: {
      ko: "Korean",
      en: "English",
      ja: "Japanese",
    },
    worksTitle: "All works",
    resultCount: (works: number, links: number) => `${works} works · ${links} links`,
    cardCount: (domestic: number, overseas: number, total: number) =>
      `Domestic ${domestic} · Overseas ${overseas} · Total ${total}`,
    emptyState: "No works match the current filters.",
    footerNote: "Work data refreshes from Google Sheets.",
    detailHome: "Home",
    detailList: "Work list",
    detailOfficial: "Official release sites",
    detailLinkCount: (count: number) => `${count} official links`,
    detailMetaSuffix: "Link copy supported",
    detailShared: "Copied",
    detailDomestic: "Domestic",
    detailOverseas: "Overseas",
    detailOpen: "Open",
    detailCopy: "Copy",
    detailSearchHint: "Search by title or alias",
    countryNames: {
      kr: "Korea",
      jp: "Japan",
      us: "North America",
      cn: "China",
      th: "Thailand",
      id: "Indonesia",
      global: "Global",
    },
    localeNames: {
      ko: "Korean",
      en: "English",
      ja: "Japanese",
      zh: "Chinese",
      th: "Thai",
      id: "Indonesian",
      fr: "French",
      es: "Spanish",
      de: "German",
      pt: "Portuguese",
      ru: "Russian",
      vi: "Vietnamese",
      ar: "Arabic",
    },
    titleOrder: ["en", "ko", "ja", "zh", "fr", "th", "id"] as const,
  },
  ja: {
    viewGrid: "カード表示",
    viewList: "リスト表示",
    heroTitle: "ディーアンドシーウェブトゥーン公式サイト",
    heroDescription: "国内・海外の公式ウェブトゥーン配信先をまとめて確認できます。",
    searchPlaceholder: "作品名または別名で検索",
    countryAll: "国すべて",
    platformAll: "全プラットフォーム",
    reset: "リセット",
    localeLabel: "言語",
    localeOptions: {
      ko: "韓国語",
      en: "英語",
      ja: "日本語",
    },
    worksTitle: "全作品",
    resultCount: (works: number, links: number) => `${works}作品 · ${links}リンク`,
    cardCount: (domestic: number, overseas: number, total: number) =>
      `国内 ${domestic} · 海外 ${overseas} · 合計 ${total}`,
    emptyState: "条件に合う作品がありません。",
    footerNote: "作品データはGoogleスプレッドシートから反映されます。",
    detailHome: "ホーム",
    detailList: "作品一覧",
    detailOfficial: "公式連載先",
    detailLinkCount: (count: number) => `${count}件の公式リンク`,
    detailMetaSuffix: "リンクコピーに対応",
    detailShared: "コピー済み",
    detailDomestic: "国内",
    detailOverseas: "海外",
    detailOpen: "開く",
    detailCopy: "コピー",
    detailSearchHint: "作品名または別名で検索",
    countryNames: {
      kr: "韓国",
      jp: "日本",
      us: "北米",
      cn: "中国",
      th: "タイ",
      id: "インドネシア",
      global: "グローバル",
    },
    localeNames: {
      ko: "韓国語",
      en: "英語",
      ja: "日本語",
      zh: "中国語",
      th: "タイ語",
      id: "インドネシア語",
      fr: "フランス語",
      es: "スペイン語",
      de: "ドイツ語",
      pt: "ポルトガル語",
      ru: "ロシア語",
      vi: "ベトナム語",
      ar: "アラビア語",
    },
    titleOrder: ["ja", "ko", "en", "zh", "fr", "th", "id"] as const,
  },
} as const;

type CopyMap = (typeof uiCopy)[UiLocale];

function isUiLocale(value: string): value is UiLocale {
  return uiLocaleOptions.includes(value as UiLocale);
}

function getPrimaryTitle(work: WorkItem, locale: UiLocale) {
  const preferredOrder = [locale, "ko", "en", "ja", "zh", "fr", "th", "id"];

  for (const key of preferredOrder) {
    const title = work.title[key];
    if (title) {
      return title;
    }
  }

  return Object.values(work.title)[0] ?? work.id;
}

function getCountryCode(country: string) {
  const meta = getCountryMeta(country);
  return meta.id === "global" ? "EN" : meta.id.toUpperCase();
}

function getSecondaryTitles(work: WorkItem, locale: UiLocale) {
  const primary = getPrimaryTitle(work, locale);
  // Keep card subtitles compact: only show the two requested foreign titles.
  const secondaryTitles = [work.title.en, work.title.ja]
    .filter((title): title is string => Boolean(title))
    .filter((title, index, titles) => titles.indexOf(title) === index)
    .filter((title) => title !== primary);

  return secondaryTitles.join(" · ");
}

function getCountryLabel(country: string, locale: UiLocale) {
  const meta = getCountryMeta(country);
  const localizedName = uiCopy[locale].countryNames[meta.id as keyof CopyMap["countryNames"]] ?? meta.name;
  return `${getCountryCode(country)} ${localizedName}`;
}

function getLocaleLabel(locale: string, uiLocale: UiLocale) {
  return (
    uiCopy[uiLocale].localeNames[locale as keyof CopyMap["localeNames"]] ??
    getLanguageLabel(locale)
  );
}

function collectCountryOptions(works: WorkItem[]): CountryOption[] {
  const seen = new Map<string, CountryOption>();

  for (const work of works) {
    for (const link of work.links) {
      const meta = getCountryMeta(link.country);
      if (!seen.has(meta.id)) {
        seen.set(meta.id, {
          id: meta.id,
          name: meta.name,
          flag: meta.flag,
        });
      }
    }
  }

  const priority = ["kr", "global", "jp", "us", "cn", "th", "id"];

  return Array.from(seen.values()).sort((left, right) => {
    const leftIndex = priority.indexOf(left.id);
    const rightIndex = priority.indexOf(right.id);

    if (leftIndex !== rightIndex) {
      return (leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex) -
        (rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex);
    }

    return left.name.localeCompare(right.name);
  });
}

function collectPlatformOptions(works: WorkItem[]): PlatformOption[] {
  const seen = new Map<string, PlatformOption>();

  for (const work of works) {
    for (const link of work.links) {
      const meta = getPlatformMeta(link.platform);
      if (!seen.has(meta.id)) {
        seen.set(meta.id, {
          id: meta.id,
          name: meta.name,
          icon: meta.icon,
          tone: meta.tone,
        });
      }
    }
  }

  return Array.from(seen.values()).sort((left, right) => left.name.localeCompare(right.name));
}

function isCountrySelected(workLink: WorkLink, selectedCountry: string) {
  return selectedCountry === "all" || getCountryMeta(workLink.country).id === selectedCountry;
}

function isPlatformSelected(workLink: WorkLink, selectedPlatform: string) {
  return selectedPlatform === "all" || getPlatformMeta(workLink.platform).id === selectedPlatform;
}

function buildSearchableText(work: WorkItem) {
  return [
    work.id,
    ...Object.values(work.title),
    ...work.aliases,
    ...work.links.flatMap((link) => [
      link.country,
      getCountryMeta(link.country).name,
      ...getCountryMeta(link.country).aliases,
      link.platform,
      getPlatformMeta(link.platform).name,
      ...getPlatformMeta(link.platform).aliases,
      getLanguageLabel(link.language),
    ]),
  ]
    .join(" ")
    .toLowerCase();
}

function readStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function IconButton({
  active,
  children,
  label,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={`control-icon ${active ? "control-icon-active" : ""}`}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function PlatformBadge({ platformId }: { platformId: string }) {
  const platform = getPlatformMeta(platformId);

  return (
    <span className={`platform-badge platform-${platform.tone}`}>
      {platform.icon}
    </span>
  );
}

function LinkRow({
  copiedKey,
  copy,
  link,
  onCopy,
  uiLocale,
}: {
  copiedKey: string | null;
  copy: CopyMap;
  link: WorkLink;
  onCopy: (value: string, key: string) => void;
  uiLocale: UiLocale;
}) {
  const platform = getPlatformMeta(link.platform);
  const country = getCountryMeta(link.country);

  return (
    <div className="link-row">
      <div className="link-platform">
        <PlatformBadge platformId={link.platform} />
        <span>{platform.name}</span>
      </div>
      <div>
        {country.flag} {getCountryLabel(link.country, uiLocale)}
      </div>
      <div>{getLocaleLabel(link.language, uiLocale)}</div>
      <div className="link-actions">
        <a href={link.url} rel="noreferrer" target="_blank">
          {copy.detailOpen}
        </a>
        <button
          onClick={() => onCopy(link.url, link.id)}
          title={copy.detailCopy}
          type="button"
        >
          {copiedKey === link.id ? copy.detailShared : copy.detailCopy}
        </button>
      </div>
    </div>
  );
}

function LinkGroup({
  copiedKey,
  copy,
  label,
  links,
  onCopy,
  uiLocale,
}: {
  copiedKey: string | null;
  copy: CopyMap;
  label: string;
  links: WorkLink[];
  onCopy: (value: string, key: string) => void;
  uiLocale: UiLocale;
}) {
  if (!links.length) {
    return null;
  }

  return (
    <div className="link-group">
      <h3>{label}</h3>
      <div className="link-table">
        {links.map((link) => (
          <LinkRow
            copiedKey={copiedKey}
            copy={copy}
            key={link.id}
            link={link}
            onCopy={onCopy}
            uiLocale={uiLocale}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [catalogData, setCatalogData] = useState<WorkItem[] | null>(null);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<FilterValue<string>>("all");
  const [uiLocale, setUiLocale] = useState<UiLocale>(() => {
    const stored = readStoredValue<string>(storageKeys.locale, "ko");
    return isUiLocale(stored) ? stored : "ko";
  });
  const [platform, setPlatform] = useState<FilterValue<string>>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const params = new URLSearchParams(window.location.search);
    return params.get("work");
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copy = uiCopy[uiLocale];
  const seededDetailHistoryRef = useRef(false);
  const isCatalogReady = catalogData !== null;
  const activeCatalogData = catalogData ?? emptyCatalog;

  useEffect(() => {
    window.localStorage.setItem(storageKeys.locale, uiLocale);
    document.documentElement.lang = uiLocale;
  }, [uiLocale]);

  useEffect(() => {
    function handlePopState() {
      const params = new URLSearchParams(window.location.search);
      setSelectedWorkId(params.get("work"));
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (seededDetailHistoryRef.current) {
      return;
    }

    seededDetailHistoryRef.current = true;
    if (!selectedWorkId) {
      return;
    }

    const detailUrl = new URL(window.location.href);
    const homeUrl = new URL(window.location.href);
    homeUrl.searchParams.delete("work");

    window.history.replaceState({ webtoonLinks: "detail", work: selectedWorkId }, "", detailUrl);
    window.history.pushState({ webtoonLinks: "home" }, "", homeUrl);
    window.history.pushState({ webtoonLinks: "detail", work: selectedWorkId }, "", detailUrl);
  }, [selectedWorkId]);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      try {
        const response = await fetch("/api/catalog", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to load catalog: ${response.status}`);
        }

        const data = (await response.json()) as { catalog?: WorkItem[] };
        if (!cancelled && Array.isArray(data.catalog) && data.catalog.length > 0) {
          setCatalogData(data.catalog);
        }
      } catch {
        if (!cancelled) {
          setCatalogData(catalog);
        }
      }
    }

    void loadCatalog();
    const timer = window.setInterval(() => {
      void loadCatalog();
    }, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const countryOptions = useMemo(() => collectCountryOptions(activeCatalogData), [activeCatalogData]);
  const platformOptions = useMemo(() => collectPlatformOptions(activeCatalogData), [activeCatalogData]);

  const filteredWorks = useMemo(() => {
    const normalizedQuery = normalize(query);

    return activeCatalogData
      .filter((work) => !work.hidden)
      .filter((work) => work.links.some((link) => isCountrySelected(link, country) && isPlatformSelected(link, platform)))
      .filter((work) => {
        if (!normalizedQuery) {
          return true;
        }

        return buildSearchableText(work).includes(normalizedQuery);
      });
  }, [activeCatalogData, country, platform, query]);

  const selectedWork = selectedWorkId
    ? activeCatalogData.find((work) => work.id === selectedWorkId) ?? null
    : null;

  function resetFilters() {
    setQuery("");
    setCountry("all");
    setPlatform("all");
  }

  function cycleLocale() {
    setUiLocale((current) => {
      const currentIndex = uiLocaleOptions.indexOf(current);
      return uiLocaleOptions[(currentIndex + 1) % uiLocaleOptions.length];
    });
  }

  function syncSelectedWork(workId: string | null, method: "pushState" | "replaceState") {
    setSelectedWorkId(workId);

    const url = new URL(window.location.href);
    if (workId) {
      url.searchParams.set("work", workId);
    } else {
      url.searchParams.delete("work");
    }

    if (method === "pushState") {
      window.history.pushState({ work: workId }, "", url);
    } else {
      window.history.replaceState({ work: workId }, "", url);
    }
  }

  function openWork(workId: string) {
    if (selectedWorkId === workId) {
      return;
    }

    syncSelectedWork(workId, "pushState");
  }

  function closeWork() {
    if (window.history.state?.work) {
      window.history.back();
      return;
    }

    syncSelectedWork(null, "replaceState");
  }

  async function copyText(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const field = document.createElement("textarea");
      field.value = value;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.focus();
      field.select();
      document.execCommand("copy");
      field.remove();
    }

    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1400);
  }

  if (selectedWork) {
    const domesticLinks = selectedWork.links.filter(
      (link) => link.region === "domestic",
    );
    const overseasLinks = selectedWork.links.filter(
      (link) => link.region === "overseas",
    );

    return (
      <main className="site-shell detail-shell">
        <Header
          copy={copy}
          onLocale={cycleLocale}
          onHome={closeWork}
          uiLocale={uiLocale}
        />

        <section className="detail-page">
          <div className="breadcrumb">
            <button onClick={closeWork} type="button">
              {copy.detailHome}
            </button>
            <span>›</span>
            <button onClick={closeWork} type="button">
              {copy.detailList}
            </button>
            <span>›</span>
            <strong>{getPrimaryTitle(selectedWork, uiLocale)}</strong>
          </div>

          <div className="detail-hero">
            <div className="detail-copy detail-copy-plain">
              <h1>{getPrimaryTitle(selectedWork, uiLocale)}</h1>
              <p className="aliases">{getSecondaryTitles(selectedWork, uiLocale)}</p>
              <p className="work-meta">
                {copy.detailLinkCount(selectedWork.links.length)} · {copy.detailMetaSuffix}
              </p>
            </div>
          </div>

          <section className="official-panel">
            <h2>{copy.detailOfficial}</h2>
            <LinkGroup
              copiedKey={copiedKey}
              copy={copy}
              label={`${copy.detailDomestic} (${domesticLinks.length})`}
              links={domesticLinks}
              onCopy={copyText}
              uiLocale={uiLocale}
            />
            <LinkGroup
              copiedKey={copiedKey}
              copy={copy}
              label={`${copy.detailOverseas} (${overseasLinks.length})`}
              links={overseasLinks}
              onCopy={copyText}
              uiLocale={uiLocale}
            />
          </section>
        </section>
      </main>
    );
  }

  const totalLinks = filteredWorks.reduce((count, work) => count + work.links.length, 0);

  return (
    <main className="site-shell">
      <Header
        copy={copy}
        onLocale={cycleLocale}
        onHome={() => resetFilters()}
        uiLocale={uiLocale}
      />

      <section className="home-hero">
        <div className="hero-main">
          <h1>
            {copy.heroTitle}
          </h1>
          <p>{copy.heroDescription}</p>

          <label className="search-box">
            <span>⌕</span>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              value={query}
            />
          </label>

          <div className="filter-grid">
            <select
              onChange={(event) => setCountry(event.target.value as FilterValue<string>)}
              value={country}
            >
              <option value="all">{copy.countryAll}</option>
              {countryOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.flag} {item.name}
                </option>
              ))}
            </select>

            <select
              onChange={(event) => setPlatform(event.target.value as FilterValue<string>)}
              value={platform}
            >
              <option value="all">{copy.platformAll}</option>
              {platformOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <button onClick={resetFilters} type="button">
              ⟳ {copy.reset}
            </button>
          </div>
        </div>
      </section>

      <section className="content-layout">
        <div className="works-column">
          <div className="section-toolbar">
            <h2>{copy.worksTitle}</h2>
            <div className="toolbar-actions">
              <IconButton
                active={viewMode === "grid"}
                label={copy.viewGrid}
                onClick={() => setViewMode("grid")}
              >
                ▦
              </IconButton>
              <IconButton
                active={viewMode === "list"}
                label={copy.viewList}
                onClick={() => setViewMode("list")}
              >
                ☷
              </IconButton>
            </div>
          </div>

            {isCatalogReady ? (
              <>
                <p className="result-count">
                  {copy.resultCount(filteredWorks.length, totalLinks)}
                </p>

                <div className={viewMode === "grid" ? "work-grid" : "work-list"}>
                  {filteredWorks.map((work) => {
                    const visibleLinks = work.links.filter((link) => {
                      return isCountrySelected(link, country) && isPlatformSelected(link, platform);
                    });
                    const domesticCount = visibleLinks.filter(
                      (link) => link.region === "domestic",
                    ).length;
                    const overseasCount = visibleLinks.length - domesticCount;

                    return (
                      <WorkCard
                        key={work.id}
                        onSelect={openWork}
                        viewMode={viewMode}
                        copy={copy}
                        uiLocale={uiLocale}
                        work={work}
                        visibleLinks={visibleLinks}
                        domesticCount={domesticCount}
                        overseasCount={overseasCount}
                      />
                    );
                  })}
                </div>
                {filteredWorks.length === 0 ? (
                  <div className="empty-state">{copy.emptyState}</div>
                ) : null}
              </>
            ) : (
              <div className="empty-state">작품 목록을 불러오는 중...</div>
            )}
          </div>
        </section>

      <footer className="footer">
        <strong>🌐 WEBTOON LINKS</strong>
        <div>{copy.footerNote}</div>
      </footer>
    </main>
  );
}

function Header({
  copy,
  onHome,
  onLocale,
  uiLocale,
}: {
  copy: CopyMap;
  onHome: () => void;
  onLocale: () => void;
  uiLocale: UiLocale;
}) {
  return (
    <header className="topbar" id="top">
      <button className="brand" onClick={onHome} type="button">
        <span>🌐</span>
        WEBTOON LINKS
      </button>
      <div className="topbar-actions">
        <button
          aria-label={copy.localeLabel}
          className="locale-link"
          onClick={onLocale}
          title={copy.localeLabel}
          type="button"
        >
          🌐 {copy.localeOptions[uiLocale]}
        </button>
      </div>
    </header>
  );
}

function WorkCard({
  copy,
  onSelect,
  viewMode,
  uiLocale,
  work,
  visibleLinks,
  domesticCount,
  overseasCount,
}: {
  copy: CopyMap;
  onSelect: (workId: string) => void;
  viewMode: ViewMode;
  uiLocale: UiLocale;
  work: WorkItem;
  visibleLinks: WorkLink[];
  domesticCount: number;
  overseasCount: number;
}) {
  return (
    <article className={`work-card ${viewMode}`}>
      <button className="work-hitbox" onClick={() => onSelect(work.id)} type="button">
        <div className="work-head">
          <div className="work-title-block">
            <h3>{getPrimaryTitle(work, uiLocale)}</h3>
            <p>{getSecondaryTitles(work, uiLocale)}</p>
          </div>
        </div>

        <div className="work-body">
          <p className="work-count">{copy.cardCount(domesticCount, overseasCount, work.links.length)}</p>
          <div className="work-chip-row">
            {visibleLinks.slice(0, 4).map((link) => {
              const country = getCountryMeta(link.country);
              const platform = getPlatformMeta(link.platform);

              return (
                <span className="work-chip" key={link.id}>
                  <PlatformBadge platformId={link.platform} />
                  <span>
                    {country.flag} {platform.name}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </button>
    </article>
  );
}
