"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  catalog,
  countries,
  CountryId,
  localeNames,
  PlatformId,
  platforms,
  WorkItem,
  WorkLink,
} from "./catalog-data";

type ViewMode = "grid" | "list";
type FilterValue<T extends string> = T | "all";
type UiLocale = "ko" | "en" | "ja";

const storageKeys = {
  favorites: "webtoonLinks:favorites",
  locale: "webtoonLinks:locale",
};

const uiLocaleOptions = ["ko", "en", "ja"] as const;
const countryOptions = Object.keys(countries) as CountryId[];
const platformOptions = Object.keys(platforms) as PlatformId[];

const uiCopy = {
  ko: {
    navHome: "홈",
    navWorks: "전체 작품",
    navCountry: "국가",
    navLocale: "언어",
    navPlatform: "플랫폼",
    favorites: "즐겨찾기",
    viewGrid: "카드 보기",
    viewList: "리스트 보기",
    heroPrefix: "전 세계 모든",
    heroHighlight: "정식 연재처",
    heroSuffix: "를 한눈에",
    heroDescription: "국내, 해외 모든 플랫폼의 정식 연재 웹툰 링크를 확인하세요.",
    searchPlaceholder: "작품명으로 검색 (한국어, 영어, 일본어 가능)",
    countryAll: "국가 전체",
    platformAll: "플랫폼 전체",
    reset: "초기화",
    localeLabel: "언어",
    localeOptions: {
      ko: "한국어",
      en: "English",
      ja: "日本語",
    },
    quickHeading: "바로가기",
    quickCountry: "국가별 보기",
    quickCountryDesc: "여러 나라의 정식 연재처 확인",
    quickLocale: "언어 바꾸기",
    quickLocaleDesc: "사이트 언어를 변경해서 보기",
    quickPlatform: "플랫폼별 보기",
    quickPlatformDesc: "플랫폼별 작품 확인",
    quickFavorites: "즐겨찾기",
    quickFavoritesDesc: "내가 저장한 작품 모아보기",
    worksTitle: "전체 작품",
    favoritesTitle: "즐겨찾기",
    resultCount: (works: number, links: number) => `${works} 작품 · ${links} 링크`,
    cardCount: (domestic: number, overseas: number, total: number) =>
      `국내 ${domestic} · 해외 ${overseas} · 전체 ${total}`,
    cardFavorite: "즐겨찾기",
    emptyState: "조건에 맞는 작품이 없습니다.",
    footerNote: "즐겨찾기는 브라우저에 저장됩니다.",
    detailHome: "홈",
    detailList: "작품 목록",
    detailOfficial: "정식 연재처",
    detailLinkCount: (count: number) => `${count}개 정식 링크`,
    detailMetaSuffix: "즐겨찾기와 링크 복사 지원",
    detailFavorite: "즐겨찾기",
    detailShare: "공유하기",
    detailShared: "복사됨",
    detailDomestic: "국내",
    detailOverseas: "해외",
    detailOpen: "바로가기",
    detailCopy: "복사",
    detailStatus: "연재 상태",
    detailSearchHint: "작품명으로 검색 (한국어, 영어, 일본어 가능)",
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
    },
    statusNames: {
      ongoing: "연재중",
    },
    titleOrder: ["ko", "en", "ja"] as const,
  },
  en: {
    navHome: "Home",
    navWorks: "All Works",
    navCountry: "Country",
    navLocale: "Language",
    navPlatform: "Platform",
    favorites: "Favorites",
    viewGrid: "Card view",
    viewList: "List view",
    heroPrefix: "All",
    heroHighlight: "official release platforms",
    heroSuffix: "in one place",
    heroDescription: "Find official webtoon links across domestic and overseas platforms.",
    searchPlaceholder: "Search by title (Korean, English, or Japanese)",
    countryAll: "All countries",
    platformAll: "All platforms",
    reset: "Reset",
    localeLabel: "Language",
    localeOptions: {
      ko: "Korean",
      en: "English",
      ja: "Japanese",
    },
    quickHeading: "Shortcuts",
    quickCountry: "View by country",
    quickCountryDesc: "Check official releases across countries",
    quickLocale: "Change language",
    quickLocaleDesc: "Switch the site language",
    quickPlatform: "View by platform",
    quickPlatformDesc: "Browse works by platform",
    quickFavorites: "Favorites",
    quickFavoritesDesc: "Open the works you saved",
    worksTitle: "All works",
    favoritesTitle: "Favorites",
    resultCount: (works: number, links: number) => `${works} works · ${links} links`,
    cardCount: (domestic: number, overseas: number, total: number) =>
      `Domestic ${domestic} · Overseas ${overseas} · Total ${total}`,
    cardFavorite: "Favorite",
    emptyState: "No works match the current filters.",
    footerNote: "Favorites are saved in your browser.",
    detailHome: "Home",
    detailList: "Work list",
    detailOfficial: "Official release sites",
    detailLinkCount: (count: number) => `${count} official links`,
    detailMetaSuffix: "Favorites and link copy supported",
    detailFavorite: "Favorite",
    detailShare: "Share",
    detailShared: "Copied",
    detailDomestic: "Domestic",
    detailOverseas: "Overseas",
    detailOpen: "Open",
    detailCopy: "Copy",
    detailStatus: "Status",
    detailSearchHint: "Search by title (Korean, English, or Japanese)",
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
    },
    statusNames: {
      ongoing: "Ongoing",
    },
    titleOrder: ["en", "ko", "ja"] as const,
  },
  ja: {
    navHome: "ホーム",
    navWorks: "全作品",
    navCountry: "国",
    navLocale: "言語",
    navPlatform: "プラットフォーム",
    favorites: "お気に入り",
    viewGrid: "カード表示",
    viewList: "リスト表示",
    heroPrefix: "世界中の",
    heroHighlight: "公式連載先",
    heroSuffix: "をひと目で",
    heroDescription: "国内・海外の公式ウェブトゥーン配信先をまとめて確認できます。",
    searchPlaceholder: "作品名で検索（韓国語・英語・日本語）",
    countryAll: "国すべて",
    platformAll: "全プラットフォーム",
    reset: "リセット",
    localeLabel: "言語",
    localeOptions: {
      ko: "韓国語",
      en: "英語",
      ja: "日本語",
    },
    quickHeading: "ショートカット",
    quickCountry: "国別で見る",
    quickCountryDesc: "各国の公式配信先を確認",
    quickLocale: "言語を切替",
    quickLocaleDesc: "サイトの表示言語を切り替える",
    quickPlatform: "プラットフォーム別",
    quickPlatformDesc: "プラットフォームごとに作品を確認",
    quickFavorites: "お気に入り",
    quickFavoritesDesc: "保存した作品を見る",
    worksTitle: "全作品",
    favoritesTitle: "お気に入り",
    resultCount: (works: number, links: number) => `${works}作品 · ${links}リンク`,
    cardCount: (domestic: number, overseas: number, total: number) =>
      `国内 ${domestic} · 海外 ${overseas} · 合計 ${total}`,
    cardFavorite: "お気に入り",
    emptyState: "条件に合う作品がありません。",
    footerNote: "お気に入りはブラウザに保存されます。",
    detailHome: "ホーム",
    detailList: "作品一覧",
    detailOfficial: "公式連載先",
    detailLinkCount: (count: number) => `${count}件の公式リンク`,
    detailMetaSuffix: "お気に入りとリンクコピーに対応",
    detailFavorite: "お気に入り",
    detailShare: "共有",
    detailShared: "コピー済み",
    detailDomestic: "国内",
    detailOverseas: "海外",
    detailOpen: "開く",
    detailCopy: "コピー",
    detailStatus: "連載状況",
    detailSearchHint: "作品名で検索（韓国語・英語・日本語）",
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
    },
    statusNames: {
      ongoing: "連載中",
    },
    titleOrder: ["ja", "ko", "en"] as const,
  },
} as const;

type CopyMap = (typeof uiCopy)["ko"];

function isUiLocale(value: string): value is UiLocale {
  return uiLocaleOptions.includes(value as UiLocale);
}

function getPrimaryTitle(work: WorkItem, locale: UiLocale) {
  return work.title[locale] ?? work.title.ko;
}

function getSecondaryTitles(work: WorkItem, locale: UiLocale) {
  return uiCopy[locale].titleOrder
    .filter((item) => item !== locale)
    .map((item) => work.title[item])
    .join(" · ");
}

function getCountryLabel(country: CountryId, locale: UiLocale) {
  return uiCopy[locale].countryNames[country];
}

function getLocaleLabel(locale: WorkLink["language"], uiLocale: UiLocale) {
  return uiCopy[uiLocale].localeNames[locale as keyof CopyMap["localeNames"]] ?? localeNames[locale];
}

function getStatusLabel(status: string, locale: UiLocale) {
  if (status === "연재중") {
    return uiCopy[locale].statusNames.ongoing;
  }

  return status;
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

function knownIdsOnly(ids: string[]) {
  const knownIds = new Set(catalog.map((work) => work.id));
  return ids.filter((id) => knownIds.has(id));
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

function PlatformBadge({ platformId }: { platformId: PlatformId }) {
  const platform = platforms[platformId];

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
  const platform = platforms[link.platform];
  const country = countries[link.country];

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
      <div>{getStatusLabel(link.status, uiLocale)}</div>
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
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<FilterValue<CountryId>>("all");
  const [uiLocale, setUiLocale] = useState<UiLocale>(() => {
    const stored = readStoredValue<string>(storageKeys.locale, "ko");
    return isUiLocale(stored) ? stored : "ko";
  });
  const [platform, setPlatform] = useState<FilterValue<PlatformId>>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [menuOpen, setMenuOpen] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() =>
    knownIdsOnly(readStoredValue<string[]>(storageKeys.favorites, [])),
  );
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const params = new URLSearchParams(window.location.search);
    const workId = params.get("work");

    return workId && catalog.some((work) => work.id === workId) ? workId : null;
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copy = uiCopy[uiLocale];

  useEffect(() => {
    window.localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.locale, uiLocale);
    document.documentElement.lang = uiLocale;
  }, [uiLocale]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedWorkId) {
      url.searchParams.set("work", selectedWorkId);
    } else {
      url.searchParams.delete("work");
    }

    window.history.replaceState({}, "", url);
  }, [selectedWorkId]);

  const filteredWorks = useMemo(() => {
    const normalizedQuery = normalize(query);

    return catalog
      .filter((work) => !work.hidden)
      .filter((work) => !onlyFavorites || favorites.includes(work.id))
      .filter((work) =>
        work.links.some((link) => {
          const countryMatch = country === "all" || link.country === country;
          const platformMatch = platform === "all" || link.platform === platform;
          return countryMatch && platformMatch;
        }),
      )
      .filter((work) => {
        if (!normalizedQuery) {
          return true;
        }

        const searchable = [
          work.title.ko,
          work.title.en,
          work.title.ja,
          ...work.aliases,
          ...work.links.flatMap((link) => [
            countries[link.country].name,
            ...countries[link.country].aliases,
            platforms[link.platform].name,
            ...platforms[link.platform].aliases,
            localeNames[link.language],
          ]),
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(normalizedQuery);
      });
  }, [
    country,
    favorites,
    onlyFavorites,
    platform,
    query,
  ]);

  const selectedWork = selectedWorkId
    ? catalog.find((work) => work.id === selectedWorkId) ?? null
    : null;

  function toggleFavorite(workId: string) {
    setFavorites((current) =>
      current.includes(workId)
        ? current.filter((id) => id !== workId)
        : [...current, workId],
    );
  }

  function resetFilters() {
    setQuery("");
    setCountry("all");
    setPlatform("all");
    setOnlyFavorites(false);
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

  async function copyWorkLink(workId: string) {
    const url = new URL(window.location.href);
    url.searchParams.set("work", workId);
    await copyText(url.toString(), `work-${workId}`);
  }

  if (selectedWork) {
    const domesticLinks = selectedWork.links.filter(
      (link) => link.region === "domestic",
    );
    const overseasLinks = selectedWork.links.filter(
      (link) => link.region === "overseas",
    );
    const favorite = favorites.includes(selectedWork.id);

    return (
      <main className="site-shell detail-shell">
        <Header
          favoritesActive={onlyFavorites}
          copy={copy}
          menuOpen={menuOpen}
          onFavorites={() => {
            setOnlyFavorites((value) => !value);
            setSelectedWorkId(null);
          }}
          onHome={() => setSelectedWorkId(null)}
          onMenu={() => setMenuOpen((value) => !value)}
        />

        <section className="detail-page">
          <div className="breadcrumb">
            <button onClick={() => setSelectedWorkId(null)} type="button">
              {copy.detailHome}
            </button>
            <span>›</span>
            <button onClick={() => setSelectedWorkId(null)} type="button">
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
              <div className="detail-actions">
                <button
                  className={favorite ? "primary-action active" : "primary-action"}
                  onClick={() => toggleFavorite(selectedWork.id)}
                  type="button"
                >
                  ★ {copy.detailFavorite}
                </button>
                <button
                  className="secondary-action"
                  onClick={() => copyWorkLink(selectedWork.id)}
                  type="button"
                >
                  {copiedKey === `work-${selectedWork.id}` ? copy.detailShared : copy.detailShare}
                </button>
              </div>
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
        favoritesActive={onlyFavorites}
        copy={copy}
        menuOpen={menuOpen}
        onFavorites={() => setOnlyFavorites((value) => !value)}
        onHome={() => resetFilters()}
        onMenu={() => setMenuOpen((value) => !value)}
      />

      <section className="home-hero">
        <div className="hero-main">
          <h1>
            {copy.heroPrefix} <span>{copy.heroHighlight}</span>
            {" "}
            {copy.heroSuffix}
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
              onChange={(event) =>
                setCountry(event.target.value as FilterValue<CountryId>)
              }
              value={country}
            >
              <option value="all">{copy.countryAll}</option>
              {countryOptions.map((item) => (
                <option key={item} value={item}>
                  {countries[item].flag} {getCountryLabel(item, uiLocale)}
                </option>
              ))}
            </select>

            <div className="locale-switch" aria-label={copy.localeLabel} role="group">
              {uiLocaleOptions.map((item) => (
                <button
                  aria-pressed={uiLocale === item}
                  className={uiLocale === item ? "active" : ""}
                  key={item}
                  onClick={() => setUiLocale(item)}
                  type="button"
                >
                  {copy.localeOptions[item]}
                </button>
              ))}
            </div>

            <select
              onChange={(event) =>
                setPlatform(event.target.value as FilterValue<PlatformId>)
              }
              value={platform}
            >
              <option value="all">{copy.platformAll}</option>
              {platformOptions.map((item) => (
                <option key={item} value={item}>
                  {platforms[item].name}
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
            <h2>{onlyFavorites ? copy.favoritesTitle : copy.worksTitle}</h2>
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

          <p className="result-count">
            {copy.resultCount(filteredWorks.length, totalLinks)}
          </p>

          <div className={viewMode === "grid" ? "work-grid" : "work-list"}>
            {filteredWorks.map((work) => {
              const visibleLinks = work.links.filter((link) => {
                const countryMatch = country === "all" || link.country === country;
                const platformMatch =
                  platform === "all" || link.platform === platform;
                return countryMatch && platformMatch;
              });
              const domesticCount = visibleLinks.filter(
                (link) => link.region === "domestic",
              ).length;
              const overseasCount = visibleLinks.length - domesticCount;

              return (
                <WorkCard
                  favorite={favorites.includes(work.id)}
                  key={work.id}
                onFavorite={toggleFavorite}
                onSelect={setSelectedWorkId}
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
        </div>
      </section>

      <footer className="footer">
        <strong>🌐 WEBTOON LINKS</strong>
        <div>{copy.footerNote}</div>
      </footer>

      <nav className="bottom-nav">
        <button onClick={resetFilters} type="button">
          ⌂<span>{copy.detailHome}</span>
        </button>
        <button onClick={() => setOnlyFavorites(false)} type="button">
          ▤<span>{copy.navWorks}</span>
        </button>
        <button onClick={() => setOnlyFavorites(true)} type="button">
          ☆<span>{copy.favorites}</span>
        </button>
      </nav>
    </main>
  );
}

function Header({
  favoritesActive,
  copy,
  menuOpen,
  onFavorites,
  onHome,
  onMenu,
}: {
  favoritesActive: boolean;
  copy: CopyMap;
  menuOpen: boolean;
  onFavorites: () => void;
  onHome: () => void;
  onMenu: () => void;
}) {
  return (
    <header className="topbar" id="top">
      <button className="brand" onClick={onHome} type="button">
        <span>🌐</span>
        WEBTOON LINKS
      </button>
      <nav className={`top-nav ${menuOpen ? "open" : ""}`}>
        <button className="active" onClick={onHome} type="button">
          {copy.navHome}
        </button>
        <button type="button">{copy.navWorks}</button>
        <button type="button">{copy.navCountry}</button>
        <button type="button">{copy.navLocale}</button>
        <button type="button">{copy.navPlatform}</button>
      </nav>
      <button
        className={`favorite-link ${favoritesActive ? "active" : ""}`}
        onClick={onFavorites}
        type="button"
      >
        ★ {copy.favorites}
      </button>
      <button className="menu-button" onClick={onMenu} type="button">
        ☰
      </button>
    </header>
  );
}

function WorkCard({
  favorite,
  copy,
  onFavorite,
  onSelect,
  viewMode,
  uiLocale,
  work,
  visibleLinks,
  domesticCount,
  overseasCount,
}: {
  favorite: boolean;
  copy: CopyMap;
  onFavorite: (workId: string) => void;
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
              const country = countries[link.country];
              const platform = platforms[link.platform];

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

      <button
        className={`heart-button ${favorite ? "active" : ""}`}
        onClick={() => onFavorite(work.id)}
        title={copy.cardFavorite}
        type="button"
      >
        ♡
      </button>
    </article>
  );
}
