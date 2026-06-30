# WelfareMap Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 현재 메인 화면을 공공서비스형 생활 대시보드로 재설계하고, 향후 상세/로그인/마이페이지/AI 추천 화면까지 확장 가능한 디자인 기준을 적용한다.

**Architecture:** 기존 Next.js App Router와 styled-components 구조를 유지한다. 기능 로직, API, Supabase cache, 북마크 훅은 변경하지 않고, 컴포넌트 마크업과 스타일만 업무형 정보 구조에 맞게 정리한다.

**Tech Stack:** Next.js 16, React 19, TypeScript, styled-components, lucide-react.

## Global Constraints

- 기능 로직은 유지한다. 데이터 흐름, API, 캐시, 북마크 로직은 이번 리디자인의 대상이 아니다.
- `AI` 문구는 핵심 기능 설명에만 쓰고, 화면 전체를 AI 제품처럼 꾸미지 않는다.
- 반복 카드 반경은 10px-14px 중심으로 줄이고, 큰 패널은 16px까지 허용한다.
- 그림자보다 경계선과 배경 면 분리로 깊이를 만든다.
- 그라데이션, 유리효과, 장식성 배경은 제거하거나 매우 제한한다.
- 버튼 최소 높이 44px, 명확한 focus/hover, 충분한 대비, 모바일 텍스트 줄바꿈 안정성을 지킨다.
- 검증은 `npm run lint`, `npm run build`, 브라우저 시각 확인으로 한다.

---

### Task 1: Global Design Tokens And Workspace Shell

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: existing `Home` component state and props.
- Produces: revised CSS custom properties and workspace class styles used by all section components.

- [ ] **Step 1: Replace global tokens**

Update `:root` in `app/globals.css` with muted GovTech tokens:

```css
:root {
  --color-bg: #f7f8f5;
  --color-bg-soft: #f1f4ef;
  --color-surface: #ffffff;
  --color-surface-subtle: #fbfcfa;
  --color-surface-muted: #eef2ec;
  --color-ink: #17201c;
  --color-muted: #68746e;
  --color-subtle: #8a958f;
  --color-line: #dde3dd;
  --color-line-strong: #cbd5ce;
  --color-primary: #245b4f;
  --color-primary-dark: #1c463d;
  --color-secondary: #263b45;
  --color-info: #6e7f5b;
  --color-info-soft: #edf2e8;
  --color-warn: #a7672b;
  --color-warn-soft: #f7efe4;
  --color-danger: #b84a3a;
  --color-danger-soft: #f8e9e6;
  --radius-sm: 10px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --shadow-sm: 0 6px 18px rgba(23, 32, 28, 0.06);
  --shadow-md: 0 18px 42px rgba(23, 32, 28, 0.1);
}
```

- [ ] **Step 2: Remove decorative page background**

Set `body` background to a restrained solid/linear background and add reusable focus styles:

```css
body {
  background: linear-gradient(180deg, var(--color-bg-soft) 0, var(--color-bg) 280px);
  color: var(--color-ink);
  font-family: 'Noto Sans KR', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

:focus-visible {
  outline: 3px solid rgba(36, 91, 79, 0.28);
  outline-offset: 3px;
}
```

- [ ] **Step 3: Rework workspace CSS**

Change `.search-status`, `.welfare-workspace`, `.workspace-grid`, `.workspace-main`, `.map-panel`, `.list-panel` in `app/globals.css` so panels use smaller radii, lower shadow, and list-first layout.

- [ ] **Step 4: Update metadata wording**

In `app/layout.tsx`, keep title but change description to a quieter dashboard message:

```ts
description: '내 위치 기준 복지 정책, 마감 지원, 주변 기관, 저장한 항목을 한 화면에서 확인하는 지역생활 복지 대시보드',
```

- [ ] **Step 5: Run lint**

Run: `npm run lint`
Expected: exit code 0.

### Task 2: Navbar And Command Center Hero

**Files:**
- Modify: `src/components/Navbar/index.tsx`
- Modify: `src/components/Navbar/Navbar.style.tsx`
- Modify: `src/components/Hero/index.tsx`
- Modify: `src/components/Hero/Hero.style.tsx`

**Interfaces:**
- Consumes: unchanged `Navbar` and `Hero` props.
- Produces: same public component signatures with updated markup class names and styling.

- [ ] **Step 1: Reduce Navbar AI branding**

Change `logo_badge` text from `AI 레이더` to `지역 복지`, and keep `WelfareMap` as brand.

- [ ] **Step 2: Rebuild Navbar layout**

Use a compact service-header layout: brand left, location beside it on desktop, actions right, mobile wrapping only when necessary.

- [ ] **Step 3: Convert Hero copy**

In `Hero/index.tsx`, change eyebrow to `지역생활 대시보드`, title to current-location operational wording, and subtitle to a concise dashboard explanation.

- [ ] **Step 4: Convert HeroPanel to task list**

Replace two large insight cards with compact rows for urgent, new, and checklist preparation. Use existing `insights` data and keep the `#welfare-section` anchor link.

- [ ] **Step 5: Run lint**

Run: `npm run lint`
Expected: exit code 0.

### Task 3: Quick Filters, Action Queue, And Priority List

**Files:**
- Modify: `src/components/LifeStage/index.tsx`
- Modify: `src/components/LifeStage/LifeStage.style.tsx`
- Modify: `src/components/NoticeBanner/index.tsx`
- Modify: `src/components/NoticeBanner/NoticeBanner.style.tsx`
- Modify: `src/components/PopularList/index.tsx`
- Modify: `src/components/PopularList/PopularList.style.tsx`

**Interfaces:**
- Consumes: existing props for `NoticeBanner` and `PopularList`.
- Produces: compact UI components with unchanged exports.

- [ ] **Step 1: Change LifeStage to filter rail**

Keep the six options, but render them as compact buttons with icon, label, and one-line description.

- [ ] **Step 2: Change NoticeBanner to action queue**

Keep the three notice objects, but render as stacked/three-column action rows with severity, title, description, and short status.

- [ ] **Step 3: Change PopularList to compact priority list**

Keep tabs and item source logic, but display ranked items as compact list rows rather than tall cards.

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: exit code 0.

### Task 4: Welfare Workspace, Cards, Saved Section, And Modal

**Files:**
- Modify: `src/components/WelfareSection/index.tsx`
- Modify: `src/components/Filter/Filter.style.tsx`
- Modify: `src/components/WelfareCard/WelfareCard.style.tsx`
- Modify: `src/components/WelfareList/WelfareList.style.tsx`
- Modify: `src/components/SavedSection/SavedSection.style.tsx`
- Modify: `src/components/Map/Map.style.tsx`
- Modify: `src/components/LocationModal/index.tsx`

**Interfaces:**
- Consumes: existing component props and existing `LocationModal` local state.
- Produces: denser policy comparison cards, quieter filters, and modal styling aligned with global tokens.

- [ ] **Step 1: Adjust workspace copy**

Change `WelfareSection` heading to `복지 탐색 작업공간` and explain map/list comparison in a concise operational tone.

- [ ] **Step 2: Reduce filter and map decoration**

Update filter, map, and modal styles to use `--radius-md`, `--color-primary`, `--color-secondary`, and restrained backgrounds.

- [ ] **Step 3: Increase WelfareCard information density**

Reduce padding/radius, make badges smaller, keep save/detail actions clear, and avoid large hover movement.

- [ ] **Step 4: Improve SavedSection**

Style saved items as `내 보관함` area with restrained header and clear count.

- [ ] **Step 5: Run lint**

Run: `npm run lint`
Expected: exit code 0.

### Task 5: Statistics, Footer, Docs, And Final Verification

**Files:**
- Modify: `src/components/Statistics/index.tsx`
- Modify: `src/components/Statistics/Statistics.style.tsx`
- Modify: `src/components/Footer/Footer.style.tsx`
- Modify: `PROJECT.md`

**Interfaces:**
- Consumes: existing `Statistics` props and footer links.
- Produces: toned-down summary section and updated local project history.

- [ ] **Step 1: Tone down Statistics**

Change statistics section from dark marketing band to light summary panel with compact metric cards and category bars.

- [ ] **Step 2: Simplify Footer**

Remove radial decorative background and use simple source/status/footer links layout.

- [ ] **Step 3: Update PROJECT.md**

Add a 2026.07.01 history entry summarizing the redesign implementation.

- [ ] **Step 4: Run full verification**

Run:

```powershell
npm run lint
npm run build
```

Expected: both commands exit code 0.

- [ ] **Step 5: Commit**

Run:

```powershell
git add .
git commit -m "feat: 공공서비스형 UI 리디자인"
```
