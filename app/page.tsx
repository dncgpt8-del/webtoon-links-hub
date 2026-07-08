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

const storageKeys = {
  favorites: "webtoonLinks:favorites",
};

const languageOptions = ["ko", "en", "ja", "zh", "th", "id"] as const;
const countryOptions = Object.keys(countries) as CountryId[];
const platformOptions = Object.keys(platforms) as PlatformId[];

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
  link,
  onCopy,
}: {
  copiedKey: string | null;
  link: WorkLink;
  onCopy: (value: string, key: string) => void;
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
        {country.flag} {country.name}
      </div>
      <div>{localeNames[link.language]}</div>
      <div>{link.status}</div>
      <div className="link-actions">
        <a href={link.url} rel="noreferrer" target="_blank">
          바로가기
        </a>
        <button
          onClick={() => onCopy(link.url, link.id)}
          title="링크 복사"
          type="button"
        >
          {copiedKey === link.id ? "복사됨" : "복사"}
        </button>
      </div>
    </div>
  );
}

function LinkGroup({
  copiedKey,
  label,
  links,
  onCopy,
}: {
  copiedKey: string | null;
  label: string;
  links: WorkLink[];
  onCopy: (value: string, key: string) => void;
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
            key={link.id}
            link={link}
            onCopy={onCopy}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<FilterValue<CountryId>>("all");
  const [language, setLanguage] = useState<FilterValue<string>>("all");
  const [platform, setPlatform] = useState<FilterValue<PlatformId>>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [menuOpen, setMenuOpen] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() =>
    knownIdsOnly(readStoredValue<string[]>(storageKeys.favorites, [])),
  );
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
  }, [favorites]);

  const filteredWorks = useMemo(() => {
    const normalizedQuery = normalize(query);

    return catalog
      .filter((work) => !work.hidden)
      .filter((work) => !onlyFavorites || favorites.includes(work.id))
      .filter((work) =>
        work.links.some((link) => {
          const countryMatch = country === "all" || link.country === country;
          const languageMatch = language === "all" || link.language === language;
          const platformMatch = platform === "all" || link.platform === platform;
          return countryMatch && languageMatch && platformMatch;
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
    language,
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
    setLanguage("all");
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
              홈
            </button>
            <span>›</span>
            <button onClick={() => setSelectedWorkId(null)} type="button">
              작품 목록
            </button>
            <span>›</span>
            <strong>{selectedWork.title.ko}</strong>
          </div>

          <div className="detail-hero">
            <div className="detail-copy detail-copy-plain">
              <h1>{selectedWork.title.ko}</h1>
              <p className="aliases">
                {selectedWork.title.en} / {selectedWork.title.ja}
              </p>
              <p className="work-meta">
                {selectedWork.links.length}개 정식 링크 · 즐겨찾기와 링크 복사 지원
              </p>
              <div className="detail-actions">
                <button
                  className={favorite ? "primary-action active" : "primary-action"}
                  onClick={() => toggleFavorite(selectedWork.id)}
                  type="button"
                >
                  ★ 즐겨찾기
                </button>
                <button
                  className="secondary-action"
                  onClick={() => copyWorkLink(selectedWork.id)}
                  type="button"
                >
                  {copiedKey === `work-${selectedWork.id}` ? "복사됨" : "공유하기"}
                </button>
              </div>
            </div>
          </div>

          <section className="official-panel">
            <h2>정식 연재처</h2>
            <LinkGroup
              copiedKey={copiedKey}
              label={`국내 (${domesticLinks.length})`}
              links={domesticLinks}
              onCopy={copyText}
            />
            <LinkGroup
              copiedKey={copiedKey}
              label={`해외 (${overseasLinks.length})`}
              links={overseasLinks}
              onCopy={copyText}
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
        menuOpen={menuOpen}
        onFavorites={() => setOnlyFavorites((value) => !value)}
        onHome={() => resetFilters()}
        onMenu={() => setMenuOpen((value) => !value)}
      />

      <section className="home-hero">
        <div className="hero-main">
          <h1>
            전 세계 모든 <span>정식 연재처</span>를 한눈에
          </h1>
          <p>국내, 해외 모든 플랫폼의 정식 연재 웹툰 링크를 확인하세요.</p>

          <label className="search-box">
            <span>⌕</span>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="작품명으로 검색 (한국어, 영어, 일본어 가능)"
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
              <option value="all">국가 전체</option>
              {countryOptions.map((item) => (
                <option key={item} value={item}>
                  {countries[item].flag} {countries[item].name}
                </option>
              ))}
            </select>

            <select
              onChange={(event) => setLanguage(event.target.value)}
              value={language}
            >
              <option value="all">언어 전체</option>
              {languageOptions.map((item) => (
                <option key={item} value={item}>
                  {localeNames[item]}
                </option>
              ))}
            </select>

            <select
              onChange={(event) =>
                setPlatform(event.target.value as FilterValue<PlatformId>)
              }
              value={platform}
            >
              <option value="all">플랫폼 전체</option>
              {platformOptions.map((item) => (
                <option key={item} value={item}>
                  {platforms[item].name}
                </option>
              ))}
            </select>

            <button onClick={resetFilters} type="button">
              ⟳ 초기화
            </button>
          </div>
        </div>

        <aside className="quick-panel">
          <h2>바로가기</h2>
          <button onClick={() => setCountry("kr")} type="button">
            <span>🌐</span>
            <strong>국가별 보기</strong>
            <small>여러 나라의 정식 연재처 확인</small>
          </button>
          <button onClick={() => setLanguage("ko")} type="button">
            <span>ㄱ</span>
            <strong>언어별 보기</strong>
            <small>언어별 정식 연재 플랫폼 확인</small>
          </button>
          <button onClick={() => setPlatform("kakao")} type="button">
            <span>▦</span>
            <strong>플랫폼별 보기</strong>
            <small>플랫폼별 작품 확인</small>
          </button>
          <button onClick={() => setOnlyFavorites((value) => !value)} type="button">
            <span>♡</span>
            <strong>즐겨찾기</strong>
            <small>내가 저장한 작품 모아보기</small>
          </button>
        </aside>
      </section>

      <section className="content-layout">
        <div className="works-column">
          <div className="section-toolbar">
            <h2>{onlyFavorites ? "즐겨찾기" : "전체 작품"}</h2>
            <div className="toolbar-actions">
              <IconButton
                active={viewMode === "grid"}
                label="카드 보기"
                onClick={() => setViewMode("grid")}
              >
                ▦
              </IconButton>
              <IconButton
                active={viewMode === "list"}
                label="리스트 보기"
                onClick={() => setViewMode("list")}
              >
                ☷
              </IconButton>
            </div>
          </div>

          <p className="result-count">
            {filteredWorks.length} 작품 · {totalLinks} 링크
          </p>

          <div className={viewMode === "grid" ? "work-grid" : "work-list"}>
            {filteredWorks.map((work) => {
              const visibleLinks = work.links.filter((link) => {
                const countryMatch = country === "all" || link.country === country;
                const languageMatch =
                  language === "all" || link.language === language;
                const platformMatch =
                  platform === "all" || link.platform === platform;
                return countryMatch && languageMatch && platformMatch;
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
                  work={work}
                  visibleLinks={visibleLinks}
                  domesticCount={domesticCount}
                  overseasCount={overseasCount}
                />
              );
            })}
          </div>
          {filteredWorks.length === 0 ? (
            <div className="empty-state">조건에 맞는 작품이 없습니다.</div>
          ) : null}
        </div>
      </section>

      <footer className="footer">
        <strong>🌐 WEBTOON LINKS</strong>
        <div>즐겨찾기는 브라우저에 저장됩니다.</div>
      </footer>

      <nav className="bottom-nav">
        <button onClick={resetFilters} type="button">
          ⌂<span>홈</span>
        </button>
        <button onClick={() => setOnlyFavorites(false)} type="button">
          ▤<span>전체 작품</span>
        </button>
        <button onClick={() => setOnlyFavorites(true)} type="button">
          ☆<span>즐겨찾기</span>
        </button>
      </nav>
    </main>
  );
}

function Header({
  favoritesActive,
  menuOpen,
  onFavorites,
  onHome,
  onMenu,
}: {
  favoritesActive: boolean;
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
          홈
        </button>
        <button type="button">전체 작품</button>
        <button type="button">국가</button>
        <button type="button">언어</button>
        <button type="button">플랫폼</button>
      </nav>
      <button
        className={`favorite-link ${favoritesActive ? "active" : ""}`}
        onClick={onFavorites}
        type="button"
      >
        ★ 즐겨찾기
      </button>
      <button className="menu-button" onClick={onMenu} type="button">
        ☰
      </button>
    </header>
  );
}

function WorkCard({
  favorite,
  onFavorite,
  onSelect,
  viewMode,
  work,
  visibleLinks,
  domesticCount,
  overseasCount,
}: {
  favorite: boolean;
  onFavorite: (workId: string) => void;
  onSelect: (workId: string) => void;
  viewMode: ViewMode;
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
            <h3>{work.title.ko}</h3>
            <p>
              {work.title.en} · {work.title.ja}
            </p>
          </div>
        </div>

        <div className="work-body">
          <p className="work-count">
            국내 {domesticCount} · 해외 {overseasCount} · 전체 {work.links.length}
          </p>
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
        title="즐겨찾기"
        type="button"
      >
        ♡
      </button>
    </article>
  );
}
