'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Bookmark,
  Building2,
  CalendarDays,
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
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useBenefitSearch } from '@/hooks/useBenefitSearch';
import { useLocation } from '@/hooks/useLocation';
import { useUserProfile } from '@/hooks/useUserProfile';
import { normalizedBenefitToWelfareItem } from '@/lib/benefits/normalize';
import { buildPromptSuggestions } from '@/utils/promptSuggestions';
import type { BenefitIntent, NormalizedBenefit } from '@/types/benefit';

const LIFE_STAGE_LABELS: Record<NonNullable<BenefitIntent['lifeStage']>, string> = {
  child: '아동',
  youth: '청년',
  middle: '중년',
  senior: '고령자',
  newlywed: '신혼부부',
  pregnant: '임산부/출산',
  disability: '장애',
  lowincome: '저소득',
};

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

const upcomingSources = [
  { label: '청년정책', env: 'YOUTH_POLICY_API_KEY', status: '키 입력 대기' },
  { label: '고용24', env: 'EMPLOYMENT24_API_KEY', status: '연동 예정' },
  { label: '정부24', env: 'GOV24_API_KEY', status: '연동 예정' },
  { label: '보건복지', env: 'MOHW_HEALTH_API_KEY', status: '연동 예정' },
];

function IntentSummaryCard({ intent }: { intent: BenefitIntent }) {
  const stageLabel = intent.lifeStage ? LIFE_STAGE_LABELS[intent.lifeStage] : null;
  const confidencePct = Math.round(intent.confidence * 100);
  const source = intent.source === 'ai' ? 'Gemini AI' : '규칙 기반 fallback';

  return (
    <div className="ai-intent-card">
      <div className="intent-head">
        <span className="intent-eyebrow">AI 분석 결과</span>
        <span className={`intent-source is-${intent.source}`}>{source} · {confidencePct}%</span>
      </div>

      <div className="intent-row">
        <strong>생애주기</strong>
        <span>{stageLabel ?? '미탐지'}</span>
      </div>
      <div className="intent-row">
        <strong>관심 분야</strong>
        <div className="intent-chip-list">
          {intent.interests.length === 0 && <em>미탐지</em>}
          {intent.interests.map((interest) => <span key={interest} className="intent-chip">{interest}</span>)}
        </div>
      </div>
      <div className="intent-row">
        <strong>지역</strong>
        <span>{[intent.region?.sido, intent.region?.sigungu].filter(Boolean).join(' ') || '미지정'}</span>
      </div>
      <div className="intent-row">
        <strong>긴급도</strong>
        <span className={`intent-urgency is-${intent.urgency}`}>{intent.urgency === 'urgent' ? '마감/급함' : '일반'}</span>
      </div>
      <div className="intent-row">
        <strong>키워드</strong>
        <div className="intent-chip-list">
          {intent.keywords.length === 0 && <em>없음</em>}
          {intent.keywords.map((kw) => <span key={kw} className="intent-chip is-muted">{kw}</span>)}
        </div>
      </div>
    </div>
  );
}

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
    '시설',
    '대관',
    '어르신',
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
  const resultItems = benefitSearch.items.slice(0, 12);
  const displayName = `${location.sidoName.replace('광역시', '').replace('특별시', '')} ${location.sigunguName}`;
  const hasSearched = Boolean(keyword);
  const isResultsMode = activeMenu === 'ai' && hasSearched;

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

  const renderResultCards = (limit = 12) => {
    const items = resultItems.slice(0, limit);

    if (items.length === 0) {
      return (
        <div className="empty-result">
          <FileText size={22} />
          <strong>{benefitSearch.isLoading ? '검색 중입니다.' : '조건에 맞는 후보가 없습니다.'}</strong>
          <p>질문을 조금 더 넓게 바꿔 다시 검색해보세요.</p>
        </div>
      );
    }

    return items.map((item, index) => (
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
            {bookmarks.isSaved(normalizedBenefitToWelfareItem(item).id) ? '저장됨' : '저장'}
          </button>
          <a href={item.applyUrl} target="_blank" rel="noreferrer">
            상세 <ChevronRight size={15} />
          </a>
        </div>
      </article>
    ));
  };

  const renderResultContent = (variant: 'full' | 'panel') => (
    <div className={variant === 'full' ? 'result-focus' : 'result-panel-body'}>
      {variant === 'full' && (
        <div className="result-focus-head">
          <div>
            <span>AI search result</span>
            <h1>{keyword}</h1>
            <p>
              검색 입력 화면은 접고, 지금은 결과 비교와 출처 확인에 집중합니다.
              다시 검색하려면 아래 입력줄에 새 질문을 입력하세요.
            </p>
          </div>
          <button type="button" onClick={() => {
            setKeyword('');
            setIsPanelOpen(false);
          }}>
            검색 화면으로 돌아가기
          </button>
        </div>
      )}

      {variant === 'full' && (
        <div className="result-search-strip">
          <Search size={19} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') runSearch(query);
            }}
            placeholder="새 질문을 입력하세요"
          />
          <button type="button" onClick={() => runSearch(query)}>다시 검색</button>
        </div>
      )}

      <div className="result-dashboard-grid">
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
      </div>

      {benefitSearch.intent && <IntentSummaryCard intent={benefitSearch.intent} />}

      <div className={variant === 'full' ? 'benefit-result-list is-wide' : 'benefit-result-list'}>
        {renderResultCards(variant === 'full' ? 12 : 8)}
      </div>
    </div>
  );

  const renderMenuPanel = () => {
    if (activeMenu === 'benefits') {
      const recommended = resultItems.length > 0 ? resultItems.slice(0, 3) : [];

      return (
        <div className="menu-screen">
          <div className="menu-screen-head">
            <span>Personal benefits</span>
            <h1>내 조건에 맞는 혜택을 한 곳에서 비교합니다.</h1>
            <p>검색 결과가 있으면 실제 후보를 보여주고, 없으면 최종 완성형에 가까운 추천 피드 구조를 먼저 보여줍니다.</p>
          </div>

          <div className="menu-kpi-grid">
            <article><strong>{benefitSearch.totalCount || 0}</strong><span>최근 검색 후보</span></article>
            <article><strong>{bookmarks.count}</strong><span>저장한 혜택</span></article>
            <article><strong>{benefitSearch.activeSources.length}</strong><span>활성 API 출처</span></article>
          </div>

          <div className="menu-card-grid">
            {(recommended.length > 0 ? recommended : [
              { id: 'mock-youth', title: '청년 주거·생활비 지원 후보', sourceLabel: '청년정책 예정', summary: '연령, 거주지, 소득 조건을 기반으로 받을 수 있는 지원을 모아 보여줍니다.', region: displayName, category: '주거/생활', target: '청년', period: '확인 필요' },
              { id: 'mock-work', title: '취업·훈련 지원 후보', sourceLabel: '고용24 예정', summary: '취업 준비, 재직, 전직 상태에 따라 훈련비와 일자리 지원을 추천합니다.', region: '전국', category: '일자리', target: '구직자', period: '상시' },
              { id: 'mock-local', title: '지역 생활시설·상담 후보', sourceLabel: '서울 열린데이터', summary: '현재 위치 주변에서 상담, 대관, 복지시설 정보를 함께 확인합니다.', region: displayName, category: '지역생활', target: '전체', period: '확인 필요' },
            ]).map((item) => (
              <article className="menu-benefit-card" key={item.id}>
                <span>{item.sourceLabel}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <div><b>{item.region}</b><b>{item.category}</b><b>{item.target}</b></div>
              </article>
            ))}
          </div>
        </div>
      );
    }

    if (activeMenu === 'map') {
      return (
        <div className="menu-screen">
          <div className="menu-screen-head">
            <span>Local map</span>
            <h1>{displayName} 주변 복지기관과 생활시설을 따로 봅니다.</h1>
            <p>AI 검색 화면을 복잡하게 만들지 않도록 지도, 기관, 시설대관 정보는 독립 메뉴로 분리합니다.</p>
          </div>

          <div className="map-wireframe">
            <div className="map-canvas-preview">
              <span className="map-pin is-main"><LocateFixed size={18} /></span>
              <span className="map-pin is-a"><Building2 size={16} /></span>
              <span className="map-pin is-b"><ShieldCheck size={16} /></span>
              <span className="map-pin is-c"><CalendarDays size={16} /></span>
            </div>
            <div className="map-side-list">
              {['복지관·상담기관', '주민센터·행정기관', '시설대관·예약', '보건소·돌봄시설'].map((label) => (
                <article key={label}>
                  <Route size={17} />
                  <div>
                    <strong>{label}</strong>
                    <span>현재 위치 반경 기준으로 연결 예정</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeMenu === 'saved') {
      return (
        <div className="menu-screen">
          <div className="menu-screen-head">
            <span>Saved</span>
            <h1>관심 있는 혜택을 저장하고 다시 확인합니다.</h1>
            <p>현재는 localStorage MVP이며, 로그인 연동 뒤 Supabase `saved_services`와 동기화합니다.</p>
          </div>

          <div className="saved-preview-list">
            {bookmarks.bookmarks.length === 0 && (
              <div className="empty-result">
                <Bookmark size={22} />
                <strong>아직 저장한 혜택이 없습니다.</strong>
                <p>검색 결과에서 저장 버튼을 누르면 이 메뉴에 모입니다.</p>
              </div>
            )}
            {bookmarks.bookmarks.slice(0, 6).map((item) => (
              <article key={item.id}>
                <div>
                  <span>{item.category || '기타'} · {item.region || '전국'}</span>
                  <strong>{item.title}</strong>
                  <p>{item.summary}</p>
                </div>
                <button type="button" onClick={() => bookmarks.remove(item.id)}>해제</button>
              </article>
            ))}
          </div>
        </div>
      );
    }

    if (activeMenu === 'history') {
      return (
        <div className="menu-screen">
          <div className="menu-screen-head">
            <span>History</span>
            <h1>최근 질문을 다시 실행하거나 수정해서 검색합니다.</h1>
            <p>사용자가 AI에게 던진 질문을 저장해 이후 마이페이지 추천과 연결할 수 있게 준비합니다.</p>
          </div>

          <div className="history-stack is-screen">
            {history.length === 0 && <p>아직 검색 기록이 없습니다.</p>}
            {history.map((item) => (
              <button key={item} type="button" onClick={() => runSearch(item)}>
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
        <div className="menu-screen">
          <div className="menu-screen-head">
            <span>Profile</span>
            <h1>{hasProfile ? '저장된 사용자 조건을 기반으로 검색합니다.' : '사용자 정보를 입력하면 추천 질문이 더 정교해집니다.'}</h1>
            <p>생년월일, 거주지, 가족 상태, 관심 분야를 저장해 AI intent와 API 라우팅의 기본 조건으로 사용합니다.</p>
          </div>

          <div className="profile-dashboard">
            {[
              ['거주지', profile.region || displayName],
              ['생년월일', profile.birthDate || '미입력'],
              ['성별', profile.gender || '미입력'],
              ['혼인/가족', [profile.maritalStatus, profile.childrenStatus === 'hasChildren' ? '자녀 있음' : '자녀 없음'].filter(Boolean).join(' · ') || '미입력'],
            ].map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>

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
            <strong>{isResultsMode ? '검색 결과' : `${displayName} 기준 맞춤 검색`}</strong>
          </div>
          <div className="topbar-actions">
            <button type="button" title="알림"><Bell size={18} /></button>
            <Link href="/login">로그인</Link>
          </div>
        </header>

        <div className={`ai-workspace ${isResultsMode ? 'is-results-mode' : ''}`}>
          <section className={`ai-command-center ${isResultsMode ? 'is-results-surface' : ''}`}>
            {activeMenu === 'ai' ? (
              isResultsMode ? renderResultContent('full') : (
                <>
                  <div className="command-copy">
                    <span>Ask anything</span>
                    <h1>내 조건을 아는 AI에게 복지 혜택을 물어보세요.</h1>
                    <p>
                      회원정보, 현재 위치, 공공 API 결과를 조합해 받을 가능성이 높은 혜택과
                      신청 근거를 결과 화면에서 바로 정리합니다.
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
                      <p>복지로, 서울 OpenData를 연결했고 청년정책/고용24/정부24/보건복지를 같은 구조로 확장합니다.</p>
                    </article>
                    <article>
                      <span>다음 API</span>
                      <strong>{upcomingSources.length}개 대기</strong>
                      <p>키가 주입되면 connector와 결과 정규화를 순서대로 붙입니다.</p>
                    </article>
                  </div>
                </>
              )
            ) : (
              renderMenuPanel()
            )}
          </section>

          {!isResultsMode && (
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
                renderResultContent('panel')
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
          )}
        </div>
      </section>
    </main>
  );
}
