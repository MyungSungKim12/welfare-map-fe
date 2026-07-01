'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Bookmark,
  ChevronRight,
  Clock3,
  Compass,
  FileText,
  LayoutGrid,
  LocateFixed,
  MapPinned,
  PanelRightClose,
  PanelRightOpen,
  Radar,
  Search,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useBenefitSearch } from '@/hooks/useBenefitSearch';
import { useLocation } from '@/hooks/useLocation';
import { useUserProfile } from '@/hooks/useUserProfile';
import { normalizedBenefitToWelfareItem } from '@/lib/benefits/normalize';
import { buildPromptSuggestions } from '@/utils/promptSuggestions';
import type { NormalizedBenefit } from '@/types/benefit';

type AppMenu = 'ai' | 'benefits' | 'map' | 'saved' | 'history' | 'profile';

const SEARCH_HISTORY_KEY = 'welfare_search_history_v1';

const menus: { id: AppMenu; label: string; desc: string; icon: typeof Sparkles }[] = [
  { id: 'ai', label: 'AI 검색', desc: '맞춤 혜택 찾기', icon: Sparkles },
  { id: 'benefits', label: '내 맞춤 혜택', desc: '추천 후보', icon: LayoutGrid },
  { id: 'map', label: '지도/주변기관', desc: '위치 기반', icon: MapPinned },
  { id: 'saved', label: '저장한 혜택', desc: '관심 목록', icon: Bookmark },
  { id: 'history', label: '검색 기록', desc: '최근 질문', icon: Clock3 },
  { id: 'profile', label: '마이페이지', desc: '내 조건', icon: UserRound },
];

function readSearchHistory() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SEARCH_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function saveSearchHistory(items: string[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(items.slice(0, 8)));
  } catch {
    // ignore
  }
}

function getBenefitScore(item: NormalizedBenefit, index: number) {
  return Math.max(70, Math.min(99, item.confidence - index));
}

function deriveApiKeyword(query: string) {
  const candidates = [
    '주거',
    '월세',
    '청년',
    '일자리',
    '취업',
    '교육',
    '의료',
    '건강',
    '돌봄',
    '출산',
    '임신',
    '생활',
    '생계',
    '긴급',
  ];
  return candidates.find((candidate) => query.includes(candidate)) ?? '';
}

export default function SearchPage() {
  const { location, isLocating, detectLocation } = useLocation();
  const { profile, hasProfile } = useUserProfile();
  const bookmarks = useBookmarks();
  const [activeMenu, setActiveMenu] = useState<AppMenu>('ai');
  const [query, setQuery] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const apiKeyword = useMemo(() => deriveApiKeyword(keyword), [keyword]);
  const benefitSearch = useBenefitSearch({
    query: keyword,
    apiKeyword,
    sidoCd: location.sidoCd,
    sidoName: location.sidoName,
    sigunguName: location.sigunguName === '전체' ? '' : location.sigunguName,
    enabled: Boolean(keyword),
  });
  const promptSuggestions = useMemo(
    () => buildPromptSuggestions(hasProfile ? profile : null),
    [hasProfile, profile],
  );
  const resultItems = benefitSearch.items.slice(0, 8);
  const displayName = `${location.sidoName.replace('광역시', '').replace('특별시', '')} ${location.sigunguName}`;

  useEffect(() => {
    const hydrate = async () => {
      setHistory(readSearchHistory());
    };
    hydrate();
  }, []);

  const runSearch = (nextQuery: string) => {
    const trimmed = nextQuery.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setKeyword(trimmed);
    setIsPanelOpen(true);
    setActiveMenu('ai');
    setHistory((prev) => {
      const next = [trimmed, ...prev.filter((item) => item !== trimmed)].slice(0, 8);
      saveSearchHistory(next);
      return next;
    });
  };

  const selectPrompt = (nextQuery: string) => {
    setQuery(nextQuery);
    setKeyword('');
    setActiveMenu('ai');
    setIsPanelOpen(false);
  };

  const renderMenuPanel = () => {
    if (activeMenu === 'benefits') {
      return (
        <div className="app-context-panel">
          <span>맞춤 혜택</span>
          <h2>검색을 실행하면 우측 패널에서 추천 후보를 비교할 수 있어요.</h2>
          <p>이 메뉴는 이후 사용자 프로필과 저장 데이터를 기준으로 상시 추천 피드를 보여주는 영역으로 확장합니다.</p>
        </div>
      );
    }

    if (activeMenu === 'map') {
      return (
        <div className="app-context-panel">
          <span>지도/주변기관</span>
          <h2>{displayName} 주변 상담 기관과 복지 시설을 분리된 화면으로 제공합니다.</h2>
          <p>지도는 보조 기능으로 메뉴화해 AI 검색 화면을 방해하지 않도록 분리합니다.</p>
        </div>
      );
    }

    if (activeMenu === 'saved') {
      return (
        <div className="app-context-panel">
          <span>저장한 혜택</span>
          <h2>{bookmarks.count}개의 혜택이 저장되어 있어요.</h2>
          <p>로그인 연동 후에는 계정 기준으로 저장 목록과 신청 체크리스트를 이어갑니다.</p>
        </div>
      );
    }

    if (activeMenu === 'history') {
      return (
        <div className="app-context-panel">
          <span>검색 기록</span>
          <h2>최근 질문을 다시 실행할 수 있어요.</h2>
          <div className="history-stack">
            {history.length === 0 && <p>아직 검색 기록이 없습니다.</p>}
            {history.map((item) => (
              <button key={item} type="button" onClick={() => selectPrompt(item)}>
                <Clock3 size={15} />
                {item}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (activeMenu === 'profile') {
      return (
        <div className="app-context-panel">
          <span>마이페이지</span>
          <h2>{hasProfile ? '저장된 사용자 조건을 기반으로 검색합니다.' : '사용자 정보를 입력하면 추천 질문이 더 정교해집니다.'}</h2>
          <p>{profile.region || '거주지 미입력'} · {profile.birthDate || '생년월일 미입력'}</p>
          <Link className="panel-action-link" href="/onboarding">프로필 수정하기</Link>
        </div>
      );
    }

    return null;
  };

  return (
    <main className="ai-app-shell">
      <aside className="ai-sidebar" aria-label="WelfareMap 메뉴">
        <Link className="app-logo" href="/">
          <span><Radar size={19} /></span>
          <strong>WelfareMap</strong>
        </Link>

        <nav className="app-menu-list">
          {menus.map(({ id, label, desc, icon: Icon }) => (
            <button
              className={activeMenu === id ? 'is-active' : ''}
              key={id}
              type="button"
              onClick={() => setActiveMenu(id)}
            >
              <Icon size={18} />
              <span>
                <strong>{label}</strong>
                <small>{desc}</small>
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-profile">
          <span>현재 조건</span>
          <strong>{hasProfile ? profile.region || displayName : displayName}</strong>
          <button type="button" onClick={detectLocation}>
            <LocateFixed size={15} />
            {isLocating ? '확인 중' : '위치 갱신'}
          </button>
        </div>
      </aside>

      <section className="ai-main-stage">
        <header className="app-topbar">
          <div>
            <span>AI welfare concierge</span>
            <strong>{displayName} 기준 맞춤 검색</strong>
          </div>
          <div className="topbar-actions">
            <button type="button" title="알림"><Bell size={18} /></button>
            <Link href="/login">로그인</Link>
          </div>
        </header>

        <div className="ai-workspace">
          <section className="ai-command-center">
            {activeMenu === 'ai' ? (
              <>
                <div className="command-copy">
                  <span>Ask anything</span>
                  <h1>내 조건을 아는 AI에게 복지 혜택을 물어보세요.</h1>
                  <p>
                    회원정보, 현재 위치, 공공 API 결과를 조합해 받을 가능성이 높은 혜택과
                    신청 근거를 우측 패널에서 바로 정리합니다.
                  </p>
                </div>

                <div className="ai-search-box">
                  <Search size={22} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') runSearch(query);
                    }}
                    placeholder="예: 강남구 사는 29살 청년인데 나한테 맞는 혜택 찾아줘"
                  />
                  <button type="button" onClick={() => runSearch(query)}>검색</button>
                </div>

                <div className="prompt-dock">
                  <div>
                    <Sparkles size={16} />
                    <span>{hasProfile ? '회원정보 기반 추천 프롬프트' : '바로 써볼 수 있는 프롬프트'}</span>
                  </div>
                  <div className="prompt-chip-list">
                    {promptSuggestions.map((prompt) => (
                      <button key={prompt} type="button" onClick={() => selectPrompt(prompt)}>
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ai-summary-grid">
                  <article>
                    <span>사용자 조건</span>
                    <strong>{hasProfile ? '프로필 반영' : '기본 추천'}</strong>
                    <p>{hasProfile ? `${profile.region || displayName} · ${profile.birthDate || '생년월일 미입력'}` : '온보딩을 완료하면 개인화됩니다.'}</p>
                  </article>
                  <article>
                    <span>검색 방식</span>
                    <strong>{keyword ? `${benefitSearch.activeSources.length}개 출처 검색` : '통합 라우터 준비'}</strong>
                    <p>복지로 API를 통합 검색 라우터에 연결했고, 정부24/지자체/AI 웹 검색을 같은 구조로 확장합니다.</p>
                  </article>
                  <article>
                    <span>검색 기록</span>
                    <strong>{history.length}개</strong>
                    <p>좌측 메뉴에서 최근 질문을 다시 실행할 수 있습니다.</p>
                  </article>
                </div>
              </>
            ) : (
              renderMenuPanel()
            )}
          </section>

          <aside className={`result-panel ${isPanelOpen ? 'is-open' : ''}`} aria-label="AI 검색 결과 패널">
            <div className="result-panel-head">
              <div>
                <span>AI 추천 결과</span>
                <strong>{keyword || '검색 대기 중'}</strong>
              </div>
              <button type="button" onClick={() => setIsPanelOpen((prev) => !prev)}>
                {isPanelOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
              </button>
            </div>

            {isPanelOpen ? (
              <div className="result-panel-body">
                <div className="ai-analysis-card">
                  <Compass size={18} />
                  <div>
                    <span>분석 요약</span>
                    <p>
                      {benefitSearch.isLoading
                        ? '등록된 혜택 출처에서 후보를 불러오는 중입니다.'
                        : `${displayName} 기준 ${benefitSearch.totalCount}개의 통합 후보를 찾았습니다.`}
                    </p>
                  </div>
                </div>

                <div className="source-orchestration-card">
                  <span>검색 출처</span>
                  <div>
                    {benefitSearch.activeSources.map((source) => (
                      <b key={source.id}>{source.label}</b>
                    ))}
                    {benefitSearch.plannedSources.map((source) => (
                      <em key={source.id}>{source.label} 예정</em>
                    ))}
                  </div>
                </div>

                <div className="benefit-result-list">
                  {resultItems.length === 0 && (
                    <div className="empty-result">
                      <FileText size={22} />
                      <strong>{benefitSearch.isLoading ? '검색 중입니다.' : '조건에 맞는 후보가 없습니다.'}</strong>
                      <p>질문을 조금 더 넓게 바꿔 다시 검색해보세요.</p>
                    </div>
                  )}

                  {resultItems.map((item, index) => (
                    <article className="benefit-result-card" key={item.id}>
                      <div className="benefit-score">
                        <span>{getBenefitScore(item, index)}</span>
                        <small>match</small>
                      </div>
                      <div>
                        <span className="benefit-meta">{item.sourceLabel} · {item.category} · {item.region}</span>
                        <h3>{item.title}</h3>
                        <p>{item.summary}</p>
                        <div className="benefit-tags">
                          <span>{item.target}</span>
                          <span>{item.period}</span>
                        </div>
                      </div>
                      <div className="benefit-actions">
                        <button type="button" onClick={() => bookmarks.toggle(normalizedBenefitToWelfareItem(item))}>
                          <Bookmark size={16} />
                          {bookmarks.savedIds.has(item.raw?.id ?? item.id) ? '저장됨' : '저장'}
                        </button>
                        <a href={item.applyUrl} target="_blank" rel="noreferrer">
                          상세 <ChevronRight size={15} />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <button
                className="result-panel-closed"
                type="button"
                onClick={() => {
                  if (keyword) setIsPanelOpen(true);
                }}
                disabled={!keyword}
              >
                <PanelRightOpen size={18} />
                {keyword ? '결과 패널 열기' : '검색하면 결과가 열려요'}
              </button>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
