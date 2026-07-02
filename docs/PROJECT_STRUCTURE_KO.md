# WelfareMap 프로젝트 구조 및 구현 기준

> 2026-07-01 기준 정리 문서입니다. 기존 `PROJECT.md`의 작업 히스토리와 함께 사용하며, 이후 화면/기능/API 구조가 바뀔 때 이 문서를 우선 갱신합니다.

## 1. 제품 방향

WelfareMap은 단순 복지 검색 서비스가 아니라, 회원정보와 현재 위치를 기반으로 사용자가 받을 수 있는 복지와 혜택을 AI가 찾아주는 개인 복지 컨시어지 서비스입니다.

핵심 사용 흐름은 다음과 같습니다.

```text
최초 진입
  -> 회원가입/로그인 유도
  -> 사용자 정보 입력
  -> 로그인
  -> 회원정보 기반 AI 프롬프트 예시 노출
  -> 사용자가 자연어로 검색
  -> AI가 요청 의도와 사용자 조건을 구조화
  -> 공공 API / 위치 API / 캐시 DB 호출
  -> 유사 복지 및 혜택 결과 노출
  -> 상세 보기 / 저장 / 신청 체크리스트 / 주변 기관 연결
```

## 2. Figma 디자인 기준

Figma 파일:

- `WelfareMap Design System / Screens`
- URL: https://www.figma.com/design/Ooc7iXnM6pHS3F39RHNrqz

현재 주요 디자인 보드:

- `Trend Concept v3`
  - AI 복지 컨시어지 OS 콘셉트
  - 좌측 NAV, 자연어 검색, API orchestration, 추천 피드, 상세 화면, 제품 흐름 포함
- `User Profile Flow v4`
  - Figma Starter 플랜 페이지 제한 때문에 `Trend Concept v3` 하단 섹션으로 추가
  - 최초 화면, 회원가입/정보 입력, 로그인 후 맞춤 프롬프트, API 검색 결과 패널 흐름 포함

추가 예정:

- `09 Landing / Auth Entry`
  - 기능 없이 로그인/회원가입을 유도하는 최초 진입 화면
- `10 Login / Social OAuth`
  - Google, Kakao, Naver 로그인 구조 화면
  - 현재 Figma MCP 호출 한도 도달로 미반영

## 3. 목표 화면 구조

### 3.1 최초 화면

목적:

- 서비스 가치 전달
- 회원가입/로그인 유도
- 비회원 검색 가능성을 보여주되, 맞춤 추천은 회원정보 저장 후 더 정확해진다는 메시지 전달

주요 요소:

- WelfareMap 브랜드
- 서비스 설명
- `회원가입하고 시작하기` 버튼
- `로그인` 버튼
- 로그인 후 맞춤 프롬프트/추천 결과 미리보기

### 3.2 로그인 화면

목적:

- 소셜 OAuth 기반 로그인 진입
- 이후 사용자 프로필과 추천 조건을 연결

주요 요소:

- Google 로그인
- Kakao 로그인
- Naver 로그인
- 회원가입 이동
- 약관/개인정보 안내

예상 인증 구조:

```text
Social OAuth
  -> Backend OAuth callback
  -> JWT/session 발급
  -> 사용자 프로필 조회/생성
  -> FE 로그인 상태 반영
```

### 3.3 회원가입/사용자 정보 입력

목적:

- AI 추천과 공공 API 검색 조건으로 사용할 사용자 정보를 저장

입력 후보:

- 생년월일
- 성별
- 거주지
- 미혼/기혼
- 자녀 유무
- 생애주기
  - 청년
  - 신혼부부
  - 임신/출산
  - 고령자
  - 장애/질병
  - 저소득
- 관심 혜택
  - 주거
  - 생활비
  - 취업
  - 교육
  - 의료
  - 돌봄

### 3.4 로그인 후 AI 검색 화면

목적:

- 저장된 회원정보를 기반으로 검색창 하단에 맞춤 프롬프트 예시 노출

예시:

- `강남구 사는 29살 청년인데, 나한테 맞는 혜택 찾아줘`
- `월세 지원 받을 수 있는지 확인해줘`
- `생활비나 긴급복지 신청 가능한 거 찾아줘`
- `근처에서 바로 상담 가능한 기관 알려줘`

### 3.5 실제 검색 결과 화면

목적:

- 사용자 프롬프트와 회원정보를 조합해 공공 API 결과를 보여줌

결과 구조:

- 좌측/하단: 유사 복지 및 혜택 리스트
- 우측 패널: AI 분석 결과, 호출 API, 캐시 상태, 추천 근거
- 결과 카드: 제목, 대상, 지역, 신청 가능성, 추천 점수, 상세 보기

## 4. 목표 데이터 흐름

```text
사용자 자연어 입력
  -> AI intent/parser
  -> 사용자 프로필 조건 병합
  -> API Router
  -> 복지로 API
  -> 지자체 복지 API
  -> Kakao Local API
  -> Supabase Cache
  -> 결과 정규화
  -> 유사도/신청 가능성 랭킹
  -> FE 결과 패널 렌더링
```

## 5. 현재 FE 구조

```text
welfare-map-fe/
  app/
    api/
      kakao/
      welfare/
    page.tsx
    layout.tsx
    globals.css
  src/
    components/
      Navbar/
      Hero/
      LifeStage/
      NoticeBanner/
      PopularList/
      Map/
      Filter/
      WelfareCard/
      WelfareList/
      WelfareSection/
      SavedSection/
      Statistics/
      Footer/
      LocationModal/
    hooks/
      useBookmarks.ts
      useLocation.ts
      useNearbyFacilities.ts
      useWelfareData.ts
    lib/
      popular/
      supabase/
      welfare/
    types/
      welfare.ts
    utils/
```

## 6. 다음 소스 수정 우선순위

### 1순위: 최초 화면 / 로그인 화면 라우트 추가

목표:

- `/`를 기능 없는 랜딩/진입 페이지로 전환
- `/login` 소셜 로그인 선택 화면 추가
- 기존 복지 검색 메인 화면은 `/app` 또는 `/search`로 분리

작업 후보:

- `app/page.tsx` 랜딩 페이지화
- `app/login/page.tsx` 추가
- `app/search/page.tsx` 또는 `app/app/page.tsx` 추가
- 기존 Home 검색 화면 이동

### 2순위: 사용자 프로필 온보딩 화면 추가

목표:

- 회원가입 이후 사용자 정보 입력 화면 구현

작업 후보:

- `app/onboarding/page.tsx`
- 사용자 프로필 타입 정의
- localStorage 기반 MVP 저장
- 추후 Supabase `users`/`user_profiles` 연동

### 3순위: 회원정보 기반 프롬프트 추천

목표:

- 저장된 사용자 프로필을 기반으로 검색창 하단 예시 프롬프트 노출

작업 후보:

- `src/utils/promptSuggestions.ts`
- `src/hooks/useUserProfile.ts`
- 검색 화면에 추천 프롬프트 UI 추가

### 4순위: AI 검색/API Router 설계

목표:

- 자연어 프롬프트를 API 호출 조건으로 변환하는 구조 준비

작업 후보:

- `app/api/ai/search/route.ts`
- `src/lib/ai/intent.ts`
- `src/lib/welfare/searchRouter.ts`
- OpenAI API 연동은 후순위로 두고 규칙 기반 MVP 먼저 구현 가능

## 7. 작업 히스토리

### 2026-07-02 지역 오픈데이터 공통 커넥터 추가

- 최종 목표를 `서울 한정`이 아니라 `전국 위치 기반 복지/혜택/생활지원 통합 검색`으로 두고, 서울 열린데이터광장은 첫 번째 지역 오픈데이터 샘플로 연결했다.
- `서울 API 수백 개를 개별 구현`하지 않기 위해 공통 클라이언트 + 서비스 registry + mapper 구조를 추가했다.
  - `src/lib/benefits/seoulOpenData.ts`
  - 서울 OpenAPI 공통 URL 패턴 처리
  - `SEOUL_OPEN_DATA_SERVICES` JSON 설정 지원
  - 개별 env 서비스명 설정 지원
    - `SEOUL_ONE_PERSON_PROGRAM_SERVICE_NAME`
    - `SEOUL_COMPANION_RESTAURANT_SERVICE_NAME`
    - `SEOUL_DASAN_FAQ_SERVICE_NAME`
- 우선 연결 대상 기능군을 3개로 제한했다.
  - 1인가구/참여 프로그램형
  - 취약계층/생활시설 위치형
  - 상담/FAQ형
- `seoul-open-data` 소스를 `active`로 전환하되, `SEOUL_OPEN_DATA_KEY`가 없으면 planned 목록에 남도록 처리했다.
- 통합 검색 라우터가 Gemini intent와 현재 위치 조건을 보고 서울 오픈데이터 호출 여부를 결정하도록 연결했다.
- 일반 텍스트/행 기반 API 응답을 `NormalizedBenefit`으로 변환하는 `normalizeTextBenefit` 유틸을 추가했다.
- 추후 경기/인천/부산 등은 같은 패턴으로 `regionalOpenData` registry를 확장하면 된다.

### 2026-07-01 통합 혜택 검색 라우터 기반 추가

- 기존 `/api/welfare/local`, `/api/welfare/national`을 직접 병합하던 구조에서 확장 가능한 통합 혜택 검색 구조로 전환했다.
- 공통 검색 타입을 추가했다.
  - `src/types/benefit.ts`
  - `BenefitSourceDescriptor`
  - `BenefitSearchRequest`
  - `NormalizedBenefit`
  - `BenefitSearchResponse`
- 혜택 출처 레지스트리를 추가했다.
  - `src/lib/benefits/sources.ts`
  - 현재 활성 출처: 복지로 지자체 복지, 복지로 중앙부처 복지
  - 확장 예정 출처: 정부24/보조금 혜택, 지자체 오픈데이터, AI 웹/RAG 검색
- 복지 API 결과를 공통 결과 포맷으로 변환하는 정규화 레이어를 추가했다.
  - `src/lib/benefits/normalize.ts`
  - 기존 `WelfareItem`을 `NormalizedBenefit`으로 변환
  - 저장 기능 호환을 위해 `NormalizedBenefit`을 다시 `WelfareItem`으로 변환하는 유틸 포함
- 통합 검색 API 라우터를 추가했다.
  - `app/api/benefits/search/route.ts`
  - 현재는 기존 복지로 local/national API를 소스 커넥터처럼 호출
  - 이후 API 소스가 추가되어도 FE는 동일한 `NormalizedBenefit[]` 구조를 사용
- 클라이언트 검색 훅을 추가했다.
  - `src/hooks/useBenefitSearch.ts`
  - `/api/benefits/search`를 호출하고 통합 검색 결과/출처 상태를 반환
- `/search` 우측 결과 패널을 통합 검색 결과 기준으로 변경했다.
  - 결과 카드에 출처 라벨 표시
  - 활성/예정 검색 출처 표시
  - 저장 기능은 기존 북마크 구조와 호환 유지

### 2026-07-01 AI 검색 프롬프트 선택 UX 수정

- 추천 프롬프트/검색 기록 클릭 시 즉시 검색되지 않도록 변경했다.
- 추천 프롬프트/검색 기록 클릭은 검색창 입력값만 채우고, 실제 검색은 `검색` 버튼 또는 Enter 입력 시 실행하도록 분리했다.
- 검색 submit 시점에만 우측 결과 패널이 열리도록 유지했다.
- 검색 전에는 우측 패널의 `결과 패널 열기` 액션을 비활성 안내 상태로 표시한다.

### 2026-07-01 AI 검색 앱형 레이아웃 전환

- `/search`를 스크롤형 정보 나열 화면에서 스크롤 없는 앱형 메인 화면으로 재구성했다.
- 좌측 공통 메뉴를 추가했다.
  - AI 검색
  - 내 맞춤 혜택
  - 지도/주변기관
  - 저장한 혜택
  - 검색 기록
  - 마이페이지
- 중앙 영역을 AI 검색 전용 커맨드 센터로 변경했다.
  - 사용자 프로필 기반 추천 프롬프트 노출
  - 자연어 검색 입력
  - 검색 전 사용자 조건/검색 방식/검색 기록 요약
- 검색 실행 시 우측 결과 패널이 열리도록 변경했다.
  - 복지 후보 리스트
  - 추천 매칭 점수
  - 저장 버튼
  - 상세 링크
  - 패널 닫기/열기
- 검색 기록을 `localStorage`에 저장해 좌측 `검색 기록` 메뉴에서 다시 실행할 수 있도록 했다.
- 자연어 문장 전체를 그대로 API 필터에 넣지 않고, `주거`, `청년`, `의료`, `돌봄` 등 핵심 키워드를 추출해 기존 복지 API 필터에 전달하는 MVP 방식을 적용했다.
- 기존 지도/위치기반 복지/저장/통계 기능은 삭제하지 않고, 메뉴형 기능으로 분리해 이후 화면별 상세 기능으로 확장하는 방향으로 정리했다.

### 2026-07-01 Figma 콘셉트 코드 적용

- Figma `Trend Concept v3` / `User Profile Flow v4` 기준으로 검색 화면의 시각 방향을 AI 복지 컨시어지 워크스페이스 형태로 재정리했다.
- `/search` Hero 영역을 자연어 AI 검색 중심으로 변경했다.
  - 검색 타이틀/설명 문구를 AI 컨시어지 목적에 맞게 수정
  - 온보딩에서 저장한 사용자 프로필 기반 추천 프롬프트 노출
  - 추천 프롬프트 클릭 시 바로 검색 실행
- `src/utils/promptSuggestions.ts` 추가
  - 사용자 생년월일, 거주지, 생애주기, 관심 혜택을 바탕으로 검색 예시 문구 생성
  - 프로필이 없을 경우 기본 검색 예시 제공
- 전역 디자인 토큰을 미니멀한 흰색/검정/뉴트럴 중심으로 재정리했다.
  - `app/globals.css`
  - 검색 결과 워크스페이스, 상태 배너, 필터/지도/리스트 패널 톤 조정
- 주요 검색 화면 컴포넌트 스타일을 Figma 콘셉트에 맞춰 통일했다.
  - `Navbar`
  - `Hero`
  - `LifeStage`
  - `NoticeBanner`
  - `PopularList`
  - `Filter`
  - `WelfareList`
  - `WelfareCard`

### 2026-07-01 2순위 소스 작업

- `/onboarding` 페이지 추가
  - 생년월일, 거주지, 성별, 혼인 상태, 자녀 여부, 생애주기, 관심 혜택 입력 UI
  - 저장 후 `/search`로 이동하는 임시 MVP 흐름
  - 로그인 연결 전에도 사용자 프로필 기반 검색 흐름을 먼저 체험할 수 있는 구조
- `src/hooks/useUserProfile.ts` 추가
  - `localStorage` 기반 사용자 프로필 저장/조회/초기화 훅
  - 추후 Supabase Auth 연결 시 `user_profiles` 테이블 저장 구조로 전환 예정
- 랜딩/로그인 진입 흐름 수정
  - `/`의 `회원가입하고 시작하기` CTA를 `/onboarding`으로 연결
  - `/login`의 `회원가입` 링크를 `/onboarding`으로 연결
- `app/globals.css`에 온보딩 전용 반응형 스타일 추가

### 2026-07-01

- Figma `Trend Concept v3` 디자인 보드 생성
- AI 복지 컨시어지 OS 방향으로 전체 UI 콘셉트 재정리
- 회원정보 기반 검색 흐름 `User Profile Flow v4` 섹션 추가
- 최초 화면/로그인 화면 추가 설계 완료
- Figma Starter 플랜 MCP 호출 한도 도달로 `09 Landing / Auth Entry`, `10 Login / Social OAuth` 프레임은 추후 반영 예정

### 2026-07-01 1순위 소스 작업

- `/`를 기능 없는 최초 랜딩 페이지로 전환
  - 서비스 가치 설명
  - `회원가입하고 시작하기`, `로그인`, `둘러보기` 진입 버튼
  - 로그인 후 맞춤 프롬프트/추천 결과 미리보기
- 기존 복지 검색 메인 화면을 `/search`로 분리
  - 기존 `Home` 검색 기능은 `app/search/page.tsx`로 보존
  - 검색어 상태 문구의 깨진 한글 일부 수정
- `/login` 페이지 추가
  - Google, Kakao, Naver 소셜 로그인 버튼 UI
  - 회원가입 이동 영역
  - 로그인 후 제공 기능 안내
- `app/globals.css`에 랜딩/로그인 전용 반응형 스타일 추가
- 검증 참고
  - `npm run lint`는 실행 승인 거절로 미검증

---

## 2026-07-02 업데이트: 서울 열린데이터광장 API 3종 preset 확정

서울 열린데이터광장 연동은 일단 사용자가 제공한 API 3개를 기준으로 실제 검색 결과에 붙였다.

환경변수:

- `SEOUL_OPEN_DATA_KEY`: 서울 열린데이터광장 인증키
- `SEOUL_ONE_PERSON_PROGRAM_SERVICE_NAME=tbPartcptn`
- `SEOUL_ELDERLY_FACILITY_SERVICE_NAME=GdTnBbs3`
- `SEOUL_PUBLIC_RESERVATION_SERVICE_NAME=EPListPublicReservationInstitution`

연동 API:

- `[1인가구포털]서울시 1인가구 참여프로그램 현황`
- `[강동구 어르신복지시설]서울시 강동구 어르신 복지시설 현황`
- `[공공서비스예약 정보]서울시 은평구 시설대관 공공서비스예약 정보`

구현 기준:

- 공통 URL 패턴은 `http://openapi.seoul.go.kr:8088/{KEY}/json/{SERVICE_NAME}/1/100`
- API별 응답 row를 `NormalizedBenefit`으로 변환해 기존 통합 검색 결과와 같은 카드 UI에서 표시
- 검색어나 Gemini intent에 `서울` 또는 서울 25개 자치구명이 포함되면 서울 OpenData 검색 대상에 포함
- 1인가구/청년/중장년/고령자/어르신/예약/시설/대관 같은 기능군 키워드로 호출할 서비스를 좁힘
- HTML, 이미지 base64가 섞인 설명 필드는 정리해서 요약에 사용

향후 확장:

- 서울 외 지역 API는 동일한 registry + mapper 패턴으로 `regionalOpenData` 형태로 확장한다.
- API 수가 많아지면 개별 API를 모두 직접 붙이기보다 기능군별 대표 API부터 연결하고, 검색 품질을 보면서 registry를 늘린다.
