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

const platformLogos: Record<string, string> = {
  "카카오페이지": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGr2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDMgNzkuOTY5MGE4NywgMjAyNS8wMy8wNi0xOToxMjowMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NzMzM2VmNjctZDBjZi00MjNjLTlhYTQtODM1NTlhMTI3Zjc5IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NzYxOWU0YWUtODUxNy04ODQ4LTljOWQtOGQ2NDJjNWI3OWZlIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmRiNTMzM2VlLTEyZmUtNDU0OC05MTQ5LTc5ODIyNjgzNWY2ZCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjYtMDYtMzBUMTY6MTI6NDQrMDk6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI2LTA3LTEzVDExOjIzOjU1KzA5OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI2LTA3LTEzVDExOjIzOjU1KzA5OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjgyYTQ3ZWE4LWZmMTQtNDlmYS05Njk2LWM4YzI3M2EwMmI2YyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3MzMzZWY2Ny1kMGNmLTQyM2MtOWFhNC04MzU1OWExMjdmNzkiLz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MTdiNDUwZGMtNWI3Yi1hYTQzLTg4ZjQtZTg1YzYyMWRkMzY2IiBzdEV2dDp3aGVuPSIyMDI2LTA3LTEzVDExOjIzOjU1KzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjYuMTEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkYjUzMzNlZS0xMmZlLTQ1NDgtOTE0OS03OTgyMjY4MzVmNmQiIHN0RXZ0OndoZW49IjIwMjYtMDctMTNUMTE6MjM6NTUrMDk6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyNi4xMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+CvMNtwAABx5JREFUeJztnV2IHeUZx3/PO7ubk6RrItkYChEsCsWgK6gIqR9rgqm0FRGkF37dxFvt3hRB6HWFUoookosq9KLtjVhKUcQ2Jt1k1YsajYIKrR+RBJMLYza7Z3dPzpyZt7zzcZwNml1yds6ZOe/zgzk7M+fszDn7/J//8877vntGwlOsxAAhBKeBGGwAYoEoe16SZYKI+4i4gYA9dNgpMWO41yl9wRpCAs4QMYvhuAj/xHLCuhjYLGZprKDz/ccZWfMZ3YEstxAxLSE/xbLDCYTiiZS+IS6oIdsRbkySFuYxzCAcQHh9rckoqzrAKEjMJG1+I21+mQS9+9vr94GUHrAXxcRwyAq/FXhzNQdItXOJZ6XDr1jibWllwc+zXYNfHYoxScv1Xok5CDy7WoxXOoA7QNB1gIAL/EmWeXQNUlGqRl6aDYexPIjl3He9bGVYXYaHiYIatJmRJR7NDqLUjdyhY/YAHyD86NIOMAJyHswcDUIOyRK7NfBDhPApcCeWM8XdJglyvjj7X+IlWWS31vghw3IdwmtZxLu4q8nU9jsgF3hcWjycvEQFMHzE3IzlueIuiY5116828/yXkIZa/xCTJvYUliNuxeSXdtLiGdoafE/6DJ7PN01S9+FaafGIBt8TLJMI97tVYzcmbYCnkt4irfs+8Wv3IJ2PGA/O8gXLbMvcQPEBIXLjCO6i4B5abFP7946AmHuNtLip28ev+IOLueEOI4vcrdnvJ9Zwq0l6iBT/cJf+EVtdP0BD7d9bbD4KoHgsAM1/f5G1zwm8HLIJikqPlOjR5QnAzSKeAMZLO4MfhMDpwgyf2gjgBzDzDnz8JYwGagSXQxzDtnF48HYQKUzNr4UAroRn/wZ/P1TaGbxgSwMeeANGxoDm+rtAedUlgoktpR3dG3buyGJenI6/juglYMUp+xJNBeA5KgDPUQF4jgrAc1QAnqMC8BwVgOeoADxHBeA5KgDPUQF4jgrAc1QAnqMC8BwVgOeoADxHBeA5KgDPUQF4jgrAc1QAnqMC8BwVgOeoADxHBeA5KgDPUQF4jgrAc1QAnqMC8BwVgOeoADxHBeA5KgDPUQF4jgrAc1QAnqMC8BwVgOeoADxHBeA5KgDPUQF4jgqg4piSvyxYBVBxTpyCWMqLVLm3jBkC9u/fz65du1hcXOz7uTsbrmMiOIxZfjH9uvha3TFkSJienmZycnJAZ/8K/vdH+Dy7dYwKoP/Mzc0N5sTLH8KRKWjNwRXl3TBCBbAK1g7gbkcL78LsHgibsKWcewXlaCOwaiwcg9l7odNM77hWYvAd6gBVovk+zO6Dzrnkrmtl2X4RFUBVaL4HR6dS27+i/MzP0RJQBZKav69vtl9EHaAKmZ/U/G/6ZvtFVACDpHkcjt4F4WKa+X0OvkNLwKBY+A/M7oXO4ILvUAEMKvPf+jmE/Wvtfx9aAgZm+wsDzfwcdYB+2/7Ru6FTjeA7VAD9YuH91PY75wdu+0W0BPTL9mddJ091Mj9HHaBsmq6T565K2X4RdYAyWXgP3vpZGvwK2X4RFUBZLDrb3wvh+Upmfo6WgLL69o/cmQa/xMkc64EKoObj+b2iJaDm4/m9ogKo+Xh+r2gJqPl4fq+oA9R8PL9XVAA1H8/vFS0BNR/P7xUVQM3H83tFS0DNx/N7RR1gVWylx/N7RQWw1vg3qzmeX90SINBqU3uijT8Gvsk6eYYn88sXgIURqXdDI2Iz8dlX4cQfoL1Q+YGdy0HiGc5Jm63r/r/nI3DiLJxpQmNkRSWtBdZCx45x/dY24xsyFQ9Z8BHmykvOC3DNTrhmc03/cOIe2vB1+qOWn2ENlCeAAJgHzlP/ZnLA0OIEYEvNopK/5UrpCWuG19yUNSAGQ6t2LTRlvRCD8Om6HU6pDxZswJyxm/m3FgE/kZh3jW3wQdLS1TLgF2nrb9YQc5AGZ9UFvCPC8IZrBC7EG3hl0O9G6TtvE/OJkWVglN+V3COgVI/fuweTzWD9zDb4i5YBTxA+xPIPt+pKQHpJ0OBpxmipCIactGf2yXzTxBOQLD/kZHwVTySOoKVgeBFewHKkuxl+la2NgMyDOclfpc1DiTNoP/5wYTiGcBvRtz7vLgPpLi77N7LfbuKdwb5TZd1xPb6W+4rBT3aHpwpbNlsiGsEpDsoSt6sTDAHCSWAKyxeXnhTqttLZLy02MGU38edEENowrB95O85wGLjpu4KfPn3xL0XdkhAxymN2nGk7ymLXHZRqk8fJRXaE5zDcg+Xc5U0Lj8G6g2ziJ7bBy90xAxVDtSjGxJXrgEPWBR6mV/PvlW0AhwtyCMHpTAABSF4GLLcSMy0h+7DsyPbpzJ9BUAx4msbzGGascADhdelk+93zbr1nAeT/854GezsRvyDiBgL20GGnxIypK/QPa+gQcIaIoxiOi/AvV+fzWxyJi9caBPB/u0A80Z2HwfoAAAAASUVORK5CYII=",
  "카카오웹툰": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFzGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDMgNzkuOTY5MGE4NywgMjAyNS8wMy8wNi0xOToxMjowMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI2LjExIChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjYtMDYtMzBUMTY6MTI6MDQrMDk6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI2LTA3LTEzVDExOjI0OjU2KzA5OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI2LTA3LTEzVDExOjI0OjU2KzA5OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmYzg1NzhlNC0wNDk4LTcwNDYtYTlkOC1hN2ZlODliOTI0NTkiIHhtcE1NOkRvY3VtZW50SUQ9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",
};

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
      tw: "대만",
      br: "브라질",
      global: "글로벌",
      fr: "프랑스",
      de: "독일",
      pt: "포르투갈",
      es: "스페인",
      ru: "러시아",
      vi: "베트남",
      ar: "아랍",
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
      tw: "Taiwan",
      br: "Brazil",
      global: "Global",
      fr: "France",
      de: "Germany",
      pt: "Portugal",
      es: "Spain",
      ru: "Russia",
      vi: "Vietnam",
      ar: "Arab",
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
      tw: "台湾",
      br: "ブラジル",
      global: "グローバル",
      fr: "フランス",
      de: "ドイツ",
      pt: "ポルトガル",
      es: "スペイン",
      ru: "ロシア",
      vi: "ベトナム",
      ar: "アラブ",
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
  return meta.code;
}

function getCountryName(country: string, locale: UiLocale) {
  const meta = getCountryMeta(country);
  return uiCopy[locale].countryNames[meta.id as keyof CopyMap["countryNames"]] ?? meta.name;
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
  return getCountryName(country, locale);
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

  const priority = ["kr", "global", "jp", "us", "cn", "th", "id", "tw", "br", "fr", "de", "pt", "es", "ru", "vi", "ar"];

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

function compactText(value: string) {
  return normalize(value).replace(/\s+/g, "");
}

function matchesAnyPlatformLabel(link: WorkLink, labels: string[]) {
  const platform = getPlatformMeta(link.platform);
  const candidates = [link.platform, platform.name, ...platform.aliases];
  const normalizedCandidates = candidates.map(compactText);

  return labels.some((label) => normalizedCandidates.includes(compactText(label)));
}

function getCardLinkPriority(link: WorkLink) {
  const countryId = getCountryMeta(link.country).id;

  if (matchesAnyPlatformLabel(link, ["카카오페이지"])) {
    return 0;
  }

  if (matchesAnyPlatformLabel(link, ["카카오웹툰"])) {
    return 1;
  }

  if (matchesAnyPlatformLabel(link, ["네이버웹툰"])) {
    return 2;
  }

  if (matchesAnyPlatformLabel(link, ["네이버 시리즈", "네이버시리즈"])) {
    return 3;
  }

  if (countryId === "kr") {
    return 4;
  }

  if (link.language === "en") {
    return 5;
  }

  return 6;
}

function sortCardLinks(links: WorkLink[]) {
  return links
    .map((link, index) => ({
      link,
      index,
      priority: getCardLinkPriority(link),
    }))
    .sort((left, right) => left.priority - right.priority || left.index - right.index)
    .map((item) => item.link);
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
      getCountryMeta(link.country).code,
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
  const logo = platformLogos[platform.name];

  return (
    <span className={`platform-badge platform-${platform.tone}`}>
      {logo ? (
        <img
          alt=""
          aria-hidden="true"
          src={logo}
          style={{
            borderRadius: "inherit",
            display: "block",
            height: "100%",
            objectFit: "cover",
            width: "100%",
          }}
        />
      ) : (
        platform.icon
      )}
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

  return (
    <div className="link-row">
      <div className="link-platform">
        <PlatformBadge platformId={link.platform} />
        <span>{platform.name}</span>
      </div>
      <div>{getCountryName(link.country, uiLocale)}</div>
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
                  {getCountryLabel(item.id, uiLocale)}
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
          {copy.localeOptions[uiLocale]}
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
            {sortCardLinks(visibleLinks).slice(0, 4).map((link) => {
              const country = getCountryMeta(link.country);
              const platform = getPlatformMeta(link.platform);

              return (
                <span className="work-chip" key={link.id}>
                  <PlatformBadge platformId={link.platform} />
                  <span>
                    {getCountryLabel(link.country, uiLocale)} · {platform.name}
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

