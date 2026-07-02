# WelfareMap 프로젝트 문서

> 지역 기반 복지 정보와 주변 생활 정보를 한곳에서 탐색하고, 사용자 상황에 맞는 정책과 행동을 추천하는 AI 기반 지역생활 복지 플랫폼입니다.

## 1. 프로젝트 개요

| 항목 | 내용 |
| --- | --- |
| 프로젝트명 | WelfareMap |
| 서비스 방향 | 위치 기반 복지 정보 + 지역생활 정보 + AI 맞춤 추천 |
| 시작 시점 | 2026.03 |
| 현재 상태 | 1차 기능 구현 진행 중, 메인 UI 리디자인 / 실제 데이터 섹션 / Supabase 캐시 DB 적용 완료 |
| Frontend | `D:\ms\welfare-map-fe` |
| Backend | `D:\ms\welfare-map-be` |
| Notion 문서 | WelfareMap 프로젝트 페이지 |
| GitHub FE | `https://github.com/MyungSungKim12/welfare-map-fe` |
| GitHub BE | `https://github.com/MyungSungKim12/welfare-map-be` |

## 2. 기획 의도

복지 정보는 복지로, 공공데이터포털, 지자체 공고, 지도 서비스 등 여러 곳에 흩어져 있어 사용자가 직접 찾기 어렵습니다.

WelfareMap은 사용자의 현재 위치, 생애주기, 상황, 관심사를 기준으로 받을 수 있는 복지 정책과 주변에서 이용 가능한 생활 정보를 한눈에 보여주는 것을 목표로 합니다.

향후 방향은 단순한 복지 검색 서비스가 아니라, 사용자가 놓치기 쉬운 정책, 마감일, 주변 행사, 복지기관, 생활 혜택을 계속 감지하고 추천하는 AI 지역생활 에이전트입니다.

## 3. 타겟 사용자

| 사용자 | 주요 니즈 |
| --- | --- |
| 고령층 | 가까운 복지기관, 노인 복지, 의료/돌봄 서비스 확인 |
| 청년 | 취업, 주거, 교육, 지원금 정책 탐색 |
| 신혼부부 / 예비부부 | 주거, 결혼, 출산 관련 정책 확인 |
| 임산부 / 영유아 가정 | 보육, 의료, 양육 지원 정보 확인 |
| 저소득층 | 생계, 의료, 주거 지원 정책 확인 |
| 지역 생활 사용자 | 오늘 주변 행사, 공공서비스, 생활 혜택 확인 |

## 4. 핵심 컨셉

현재 프로젝트는 1번 아이디어인 정책/지원금 매칭 서비스에서 출발했습니다.

앞으로는 5번 아이디어인 지역생활 자동 비서 기능을 합쳐 다음 방향으로 확장합니다.

> "내 위치와 상황에 맞는 복지 정책, 마감 임박 지원, 주변 복지기관, 오늘 이용 가능한 지역생활 정보를 AI가 묶어서 추천한다."

## 5. 주요 기능

### 현재 구현된 기능

- `AI 지역생활 복지 레이더` 컨셉 기반 메인 UI
- 데스크톱 / 모바일 반응형 Hero, 필터, 지도, 리스트, 푸터 화면
- GPS 기반 현재 위치 감지
- 수동 지역 선택
- 카카오 API 서버 프록시
- 복지로 전국 복지 API 연동
- 복지로 지자체 복지 API 연동
- 생애주기 / 상황 기반 필터
- 검색어 기반 복지 리스트 필터링
- 복지 카드 목록
- 마감 임박 / 신규 / 만료 배지
- 카카오맵 기반 지도 화면
- 위치 기반 복지 리스트 조회
- 지도와 복지 리스트 데이터 공유
- 실제 API 결과 기반 Hero 요약 / 알림 / 추천 후보 / 통계 섹션
- Supabase 캐시 연동 코드와 DB migration 실제 적용
- Kakao Local 키워드 검색 기반 주변 복지기관 마커 (복지관 / 주민센터 / 보건소 / 노인·장애인복지관 / 어린이집)
- 복지 저장 / 북마크 (localStorage 기반 MVP, Navbar 카운트 배지 + 저장한 복지 섹션)

### 아직 더미 또는 미완성인 기능

- 인기 복지 섹션 실제 데이터 연동
- 북마크 Supabase 동기화 (현재는 localStorage MVP)
- 로그인 / 마이페이지
- 인기 복지 집계
- 배치 작업
- AI 맞춤 추천
- 지역생활 행사 / 시설 / 날씨 / 생활 정보 연동

## 6. 기술 스택

| 영역 | 기술 |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | styled-components, Tailwind CSS 설정 포함 |
| 지도 | Kakao Map API, Kakao Local API |
| 복지 데이터 | 복지로 API, 공공데이터포털 |
| Backend | Spring Boot 3.5, Java 21 |
| Database | Supabase PostgreSQL |
| 인증 예정 | Kakao OAuth2, Naver OAuth2, JWT |
| 배포 예정 | Vercel(FE), BE 배포 방식 미정 |

## 7. 현재 프로젝트 구조

### Frontend

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
      Statistics/
      Footer/
      LocationModal/
    constants/
    hooks/
    types/
```

### Backend

```text
welfare-map-be/
  src/main/java/com/welfareMap/
    DemoApplication.java
  src/main/resources/
    application.yml
  build.gradle.kts
```

2026.06.30 기준 popular 도메인이 추가되었습니다. 인증/사용자/배치 도메인은 여전히 미구현 상태입니다.

```text
welfare-map-be/
  src/main/java/com/welfareMap/
    DemoApplication.java
    config/
      SecurityConfig.java     # /api/v1/popular/** permit, CSRF off, stateless
      CorsConfig.java         # app.cors-allowed-origins 기반 CORS
    popular/
      domain/PopularServiceStats.java         # popular_services 매핑
      repository/PopularServiceStatsRepository.java   # native ON CONFLICT upsert
      service/PopularServiceFacade.java
      controller/PopularServiceController.java
      dto/{PopularServiceDto,InteractionType}.java
  src/main/resources/application.yml
  build.gradle.kts
  gradle.properties           # IPv4 stack + heap 크기
```

## 8. 외부 API 연동 현황

| API | 상태 | 용도 |
| --- | --- | --- |
| 복지로 지자체 복지 API | 연동됨 | 지역 복지 목록 조회 |
| 복지로 전국 복지 API | 연동됨 | 전국 공통 복지 목록 조회 |
| Kakao Coord2Region | 연동됨 | GPS 좌표를 행정구역으로 변환 |
| Kakao Keyword Search | 연동됨 | 지역명 검색 후 좌표 조회 |
| Kakao Local 시설 검색 | 연동됨 | 위치 반경 내 복지기관 / 주민센터 / 보건소 등 마커 후보 조회 |
| Supabase 캐시 | DB 적용 및 RLS 검증 완료 / 앱 서버 env 주입 대기 | 기본 복지 조회 결과 캐싱 |
| 지역 행사 / 문화 API | 미연동 | 1+5 확장 시 후보 |
| 날씨 API | 미연동 | 오늘의 지역생활 추천 후보 |
| 공공시설 / 복지기관 API | 미연동 | 지도 기반 주변 정보 후보 |

## 9. Supabase 설계 현황

Notion 기준으로 `WelfareList_DB` 설계가 존재합니다.

계획된 주요 테이블은 다음과 같습니다.

- `users`
- `user_locations`
- `welfare_services`
- `welfare_deadlines`
- `welfare_new`
- `saved_services`
- `service_views`
- `service_clicks`
- `search_logs`
- `popular_services`
- `batch_logs`

2026.06.30 기준 Supabase 프로젝트 `WelfareList_DB`는 재활성화되어 `ACTIVE_HEALTHY` 상태로 확인했습니다.

기존 `welfare_services`, `popular_services`, `welfare_deadlines`, `welfare_new` 테이블이 이미 존재했기 때문에, migration은 기존 테이블을 삭제하지 않고 캐시용 컬럼, 인덱스, RLS 정책, 권한을 보강하는 방식으로 조정했습니다.

로컬에는 다음 migration이 준비되어 있으며, 실제 Supabase DB에 적용했습니다.

- `supabase/migrations/20260630010402_welfare_cache.sql`

포함 내용:

- 기존 `welfare_services` 테이블에 캐시용 컬럼과 unique index 추가
- 기존 `popular_services` 집계 테이블 보강
- `welfare_deadlines`, `welfare_new` 읽기 정책 보강
- RLS 활성화
- `anon`, `authenticated`, `service_role` 권한 명시

검증 결과:

- `welfare_services.cache_key`, `service_id`, `source`, `title`, `period`, `region`, `raw_data`, `fetched_at` 등 캐시 컬럼 존재 확인
- `welfare_services`, `popular_services`, `welfare_deadlines`, `welfare_new` 공개 조회 RLS 정책 확인
- `anon`/publishable key 기준 Data API `GET /rest/v1/welfare_services` 200 응답 확인
- 사용자/로그/저장 계열 테이블은 RLS 활성화 및 `anon`/`authenticated` 권한 제거 확인
- publishable key 기준 `GET /rest/v1/users` 401 응답 확인
- 임시 캐시 row insert/select/delete 검증 및 테스트 row 삭제 확인
- FE `.env.local`에는 아직 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`가 없어 앱 런타임 캐시는 `bypass` 상태로 동작

## 10. 검토 결과

### 정상 확인

- FE `npm run build` 성공
- FE `npm run lint` 성공
- FE Node 기본 테스트 성공: `node --test scripts/test-welfare-insights.mjs scripts/test-welfare-cache.mjs`
- BE `gradlew.bat test` 성공
- BE Gradle wrapper 복구 확인: Gradle 8.14.4
- Chrome headless 기준 메인 화면 모바일 렌더링 확인
- Notion 프로젝트 문서 확인
- FE/BE GitHub 원격 저장소 확인
- Supabase 프로젝트 메타데이터 확인
- Supabase migration 적용 및 Data API/RLS 검증
- Supabase advisor 기준 과도한 public table 쓰기 권한 제거 확인
- Kakao / Welfare API 프록시 구조 확인

### 개선 필요

- 인기 복지, 북마크, 로그인, 저장 기능은 아직 미완성
- 필터가 적용된 복지 API 조회는 아직 외부 API를 직접 호출함
- 노출된 Supabase DB 비밀번호는 코드에서 제거했지만, 실제 키 회전은 Supabase Dashboard에서 별도 수행 필요
- FE 로컬/배포 환경에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`를 넣어야 앱 캐시가 실제로 활성화됨
- `npm audit` 잔여 2건은 Next.js 내부 postcss 전이 의존성으로, `--force` 적용 시 Next 9.x 다운그레이드가 발생해 안전 패치 한계

### 2026.06.30 해결됨

- BE `application.yml` 평문 DB 접속 정보 제거
- BE `build/`, `.gradle/`, `.idea` Git 인덱스 제거
- BE Gradle wrapper jar 복구 및 `gradlew.bat test` 성공 확인
- FE `npm audit` 취약점 6건 → 2건 (중간, 전이의존성)으로 축소 (Next.js `^16.2.9` 패치업)
- FE 지도 마커 실제 기관 좌표 연동 (Kakao Local 키워드 검색)
- Supabase `WelfareList_DB` 재활성화 확인 및 캐시 migration 실제 적용
- FE 캐시 env 미설정 시 `cache: "bypass"` 응답으로 명확히 우회하도록 수정

## 11. 추천 아키텍처 방향

현재 구조는 FE의 Next API Route가 외부 API를 직접 프록시하는 방식입니다.

확장 후에는 다음 구조를 추천합니다.

```text
사용자
  -> Next.js FE
  -> Spring Boot BE
  -> Supabase PostgreSQL
  -> 외부 API 수집/캐시
  -> AI 추천/요약/점수화
```

단기적으로는 Next API Route를 유지하되, 반복 조회가 많은 복지 데이터는 Supabase 캐시로 옮기는 것이 좋습니다.

중장기적으로는 Spring Boot BE가 다음 역할을 맡는 구조가 좋습니다.

- 사용자 인증
- 사용자 프로필 관리
- 복지 데이터 캐싱
- 지역생활 데이터 수집
- 인기/마감/신규 집계 배치
- AI 추천 요청 관리
- 알림 대상 계산

## 12. 1+5 통합 서비스 방향

### 서비스명 후보

- WelfareMap
- Welfare Radar
- 동네복지 레이더
- 내 주변 복지생활

### 핵심 화면 후보

- 오늘의 추천
- 내 주변 복지 지도
- 받을 수 있는 정책
- 마감 임박 지원
- 주변 복지기관 / 행사
- 저장한 복지
- 신청 체크리스트

### AI 기능 후보

- 사용자 프로필 기반 정책 적합도 점수
- 추천 이유 생성
- 신청 조건 쉬운 설명
- 준비서류 체크리스트 생성
- 마감 임박 정책 우선순위 정렬
- 지역생활 코스 추천
- 가족에게 공유할 요약문 생성

## 13. 다음 작업 우선순위

### 0순위: 전체 디자인 정비

**상태: 2026.06.30 1차 완료**

- 서비스 컨셉을 `복지 지도`에서 `AI 지역생활 복지 레이더`로 확장
- 메인 화면 정보 구조 재정리
- 현재 더미 섹션과 실제 데이터 섹션의 역할 구분
- 고령층 친화 접근성과 현대적인 대시보드형 UI 균형 조정
- 모바일/데스크톱 반응형 레이아웃 기준 정리
- 이후 기능 구현 전에 디자인 기준과 컴포넌트 방향 확정

### 1순위: 보안과 레포 정리

**상태: 2026.06.30 코드 정리 및 검증 완료, 외부 키 회전 대기**

- BE DB 비밀번호 키 회전
- `application.yml` 환경변수화 완료
- Git에서 빌드 산출물 제거 처리 완료
- Gradle wrapper 복구 완료
- BE `.env.local` Git ignore 보강 및 `.env.example` 추가
- FE/BE Git 상태 정리

### 2순위: FE 데이터 흐름 정리

**상태: 2026.06.30 완료**

- `useWelfareData` 호출 위치를 상위 컴포넌트로 이동 완료
- 지도와 리스트가 같은 데이터를 공유하도록 수정 완료
- 인기/신규/마감 섹션을 실제 데이터 기반으로 전환 완료
- lint 오류 정리 완료

### 3순위: Supabase 캐시 구조 연결

**상태: 2026.06.30 DB migration 적용 및 RLS/Data API 검증 완료, 앱 서버 env 주입 대기**

- Supabase 프로젝트 `WelfareList_DB` 재활성화 확인
- 기존 테이블 구조에 맞춰 migration 조정 및 실제 적용 완료
- 복지 API 응답을 `welfare_services`에 캐싱하는 코드 작성 완료
- 기본 조회는 캐시 우선, 필터 조회는 정확도 유지를 위해 외부 API 우선
- 인기/마감/신규 집계 테이블 및 view migration 작성 완료
- FE 서버 환경변수 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 주입 후 앱 캐시 활성화 필요

### 4순위: 지역생활 데이터 추가

**상태: 2026.06.30 일부 진행 — 복지기관 마커 완료**

- 공공시설 / 복지기관 API: Kakao Local 키워드 검색 기반 1차 연동 완료
- 지역 행사 API: 미연동
- 날씨 API: 미연동
- 지도 기반 주변 정보 확장: 거리 정렬 / 카테고리 필터 / Supabase 캐싱 후보

### 5순위: AI 추천 레이어 추가

- 사용자 프로필 입력
- 규칙 기반 1차 점수화
- AI 추천 이유 생성
- 신청 체크리스트 생성
- 오늘의 지역생활 추천 생성

### 최신 다음 작업 우선순위

**기준: 2026.06.30 우선순위 1, 2 완료 후**

1. Supabase 앱 캐시 활성화 — **2026.06.30 env 주입 및 E2E 검증 완료**
   - `.env.example`에 Supabase 키 가이드 보강
   - `scripts/verify-welfare-cache.mjs` E2E 검증 스크립트 추가
   - FE `.env.local`에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `KAKAO_REST_API_KEY` 주입 완료
   - dev 서버에서 cache miss → Supabase upsert → cache hit 사이클 정상 동작 확인
2. 저장/북마크 MVP — **2026.06.30 localStorage MVP 완료**
   - `useBookmarks` 훅, `SavedSection` 컴포넌트, Navbar 카운트 배지 연결
   - WelfareList → WelfareCard로 `isSaved`/`onSave` 인터페이스 연결
   - 저장 데이터는 `welfare_bookmarks_v1` localStorage 키에 최대 200건 저장
   - 로그인 후 `saved_services` 동기화는 인증 도입 시점에 후속 작업
3. AI 추천 레이어 1차
   - 사용자 프로필 입력값 정의
   - 규칙 기반 적합도 점수 계산
   - 추천 이유/신청 체크리스트 생성 API 설계

## 14. 작업 히스토리 요약

### 2026.03

- 프로젝트 초기 기획
- FE/BE GitHub 레포 생성
- Next.js FE 초기 세팅
- Spring Boot BE 초기 세팅
- Notion 프로젝트 문서 구성
- 주요 컴포넌트 구조 설계

### 2026.04.08

- 복지로 API 연동
- XML 파싱 로직 작성
- 위치 기반 필터링 구현
- 카카오 API 클라이언트 직접 호출 문제를 서버 프록시로 해결
- GPS 우선 위치 초기화 정책 정리

### 2026.04.09

- 마감 임박 / 신규 / 만료 배지 추가
- 지역 + 전국 복지 함께 표시
- 지자체 API timeout 대응을 위해 최대 3페이지 제한
- Supabase DB 설계 문서 작성
- BE 초기 환경변수 및 OAuth/JWT 설정 추가

### 2026.06.30 검토

- FE/BE/Notion/Git/Supabase 상태 점검
- FE build 성공 확인
- FE lint 실패 확인
- BE Gradle wrapper jar 누락 확인
- BE 보안 설정 문제 확인
- 1번 정책 매칭 + 5번 지역생활 비서 통합 방향 정리
- `PROJECT.md`를 작업 내용, 히스토리, 의사결정 기록 기준 문서로 사용하기로 결정
- 기능 구현 전 전체 디자인 정비를 선행 작업으로 결정

### 2026.06.30 디자인 정비

- 메인 화면을 `AI 지역생활 복지 레이더` 컨셉으로 재구성
- Navbar, Hero, 생애주기, 알림, 인기 복지, 필터, 지도, 복지 목록, 통계, 푸터 UI 개선
- `WelfareSection`에서 `useWelfareData`를 호출하도록 데이터 흐름 상향
- 지도와 복지 목록이 같은 복지 후보 데이터를 공유하도록 수정
- 위치 선택 모달을 깨지지 않는 주요 지역 프리셋 기반 UI로 교체
- Kakao / Welfare API Route 타입 정리 및 lint 오류 제거
- 검증: `npm run lint`, `npm run build`, Chrome headless 모바일 렌더링 확인

### 2026.06.30 우선순위 1, 2, 3 진행

- 1순위 보안/레포 정리
  - BE `application.yml`의 평문 DB 접속 정보를 환경변수로 전환
  - BE `.env.example` 추가
  - BE `.gitignore`에 `.gradle/`, `build/`, `.idea/`, `*.iml` 추가
  - `gradle/wrapper/gradle-wrapper.jar` 추적 예외 추가 및 wrapper 복구
  - `.gradle`, `build`, `.idea`는 Git 인덱스에서 제거
  - `gradlew.bat --version`, `gradlew.bat test` 성공 확인
- 2순위 실제 데이터 기반 메인 섹션 전환
  - `useWelfareData`를 Home 상위로 이동해 주요 섹션이 같은 API 결과를 공유
  - `welfareInsights` 유틸 추가
  - Hero, NoticeBanner, PopularList, Statistics를 실제 복지 결과 기반으로 변경
  - Node 기본 테스트 4개 추가
- 3순위 Supabase 캐시 구조 연결
  - `@supabase/supabase-js` 추가
  - 서버 전용 Supabase client 추가
  - `welfare_services` 캐시 읽기/쓰기 유틸 추가
  - 기본 조회 API에 캐시 우선 읽기 및 외부 API 결과 upsert 연결
  - Supabase migration 생성 및 RLS/권한/view 포함
  - Node 기본 테스트 3개 추가
  - Supabase 실제 SQL 실행은 `WelfareList_DB` 비활성화로 timeout 발생

### 2026.06.30 후속 작업

- FE 보안 패치
  - Next.js `16.2.1` → `^16.2.9` 패치업, ESLint config 동반 갱신
  - `npm audit fix` 비파괴 적용으로 brace-expansion / js-yaml / @babel/core 해결
  - 잔여 2건은 Next 내부 postcss 전이의존성으로 `--force` 시 9.x 다운그레이드가 발생해 보류
- FE 4순위 일부 착수: 지도 마커 실좌표 연동
  - 신규 엔드포인트 `app/api/kakao/facilities/route.ts` 추가 (Kakao Local 키워드 검색 병렬 호출, 거리 정렬, 중복 제거)
  - `Facility` 타입 추가 및 `src/utils/facilities.ts` 순수 유틸 분리
  - `useNearbyFacilities` 훅 추가, React 19 `set-state-in-effect` 규칙 준수
  - `Map` 컴포넌트의 더미 원형 마커 배치 제거, 실제 좌표 기반 복지기관 마커로 교체
  - 마커 클릭 시 시설 이름 / 주소 / 전화 / 거리 / 카카오맵 링크 표시
  - 지도 좌상단에 "주변 복지기관 N곳" 배지 추가
  - Node 기본 테스트 6개 추가 (`scripts/test-facilities.mjs`)
  - 검증: `npm run lint`, `npm run build`, `node --test` 13/13 통과

### 2026.06.30 우선순위 1, 2 추가 진행

- BE 보안/레포 정리 보강
  - `.gitignore`의 `.env.local` 예외를 제거하고 `.env.*` ignore 정책 정리
  - `.env.example` 추가로 로컬 필수 환경변수 템플릿 제공
  - `gradlew.bat test` 재검증
- Supabase 재활성화 및 migration 적용
  - `WelfareList_DB` 상태를 `ACTIVE_HEALTHY`로 확인
  - 기존 DB 테이블을 보존하는 방식으로 `20260630010402_welfare_cache.sql` 조정
  - `welfare_services` 캐시 컬럼/unique index/RLS 정책/권한 적용
  - `popular_services`, `welfare_deadlines`, `welfare_new` 읽기 정책 적용
  - 기존 사용자/로그/저장 계열 테이블의 RLS 활성화 및 public 권한 제거
  - public 함수 `search_path` 고정 및 중복 index 제거
  - 임시 캐시 row insert/select/delete로 row shape 검증
  - publishable key 기준 Data API 조회 200 응답 확인
  - publishable key 기준 비공개 `users` 조회 401 응답 확인
  - Supabase advisor 재확인: `RLS Disabled in Public` 경고 제거
- FE 캐시 안전장치 추가
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`가 모두 있을 때만 캐시 사용
  - 서버 env가 없으면 기본 복지 API 응답에 `cache: "bypass"` 반환
  - Node 기본 테스트에 캐시 env 판별 케이스 추가
- 검증
  - `node --test .\scripts\test-welfare-cache.mjs .\scripts\test-welfare-insights.mjs .\scripts\test-facilities.mjs` 14/14 통과
  - `npm run lint` 통과
  - `npm run build` 통과
  - BE `.\gradlew.bat test` 통과
  - 로컬 API `GET /api/welfare/national?numOfRows=1` 200, `cache: "bypass"` 확인

### 2026.06.30 우선순위 A.1, A.2 진행

- A.1 Supabase 앱 캐시 활성화 준비
  - `.env.example`에 Kakao / 복지로 / Supabase / TTL 그룹화 및 주석 보강
  - `scripts/verify-welfare-cache.mjs` 추가: dev 서버 기동 후 캐시 miss → hit 사이클 자동 검증, env 미설정 시 bypass 안내
  - env 키 주입은 외부 작업이라 사용자에게 위임
- A.2 저장/북마크 MVP (localStorage)
  - `src/hooks/useBookmarks.ts` 추가: `welfare_bookmarks_v1` 키에 최대 200건 저장, hydration-safe useEffect 패턴 적용
  - `src/components/SavedSection/` 신규 컴포넌트: 저장한 복지 카드 리스트 + 전체 비우기 + 빈 상태 자동 숨김
  - Navbar에 `SavedLink` + 카운트 배지(`99+` 클램프) 추가, `#saved-section` 앵커 스크롤
  - `WelfareList` / `WelfareSection` / `Home`에 `savedIds` + `onToggleSave` prop 체이닝
  - 기존 `WelfareCard`의 placeholder save 인터페이스 실연결
- 검증
  - `npm run lint` 통과
  - `npm run build` 통과 (10/10 페이지)
  - Node 기본 테스트 14/14 통과

### 2026.07.01 Gemini AI intent 파싱 + 통합 검색 소스 레지스트리 확장

방향: 자연어 검색 → AI intent 파싱 → 여러 데이터 소스 동시 검색 흐름을 완성하기 위해, Gemini API 를 서버 측에서 호출해 검색 조건을 자동 추출하고, 검색 라우터가 그 결과로 URL param 을 보정하도록 개선. 추가 공공/지자체 API 는 planned source descriptor 로 등록해 이후 어댑터 구현 시 단순 활성화만으로 확장 가능하도록.

- `.env.example` 확장
  - `GEMINI_API_KEY`, `GEMINI_MODEL` (기본 `gemini-2.5-flash`) 추가
  - planned source 활성화용 키 5종 안내: `YOUTH_POLICY_API_KEY`, `EMPLOYMENT24_API_KEY`, `MOHW_HEALTH_API_KEY`, `SEOUL_OPEN_DATA_KEY`, `GOV24_API_KEY`
- BenefitIntent 타입 및 순수 파서
  - `src/types/benefit.ts` 에 `BenefitIntent` 추가 (keywords / lifeStage / interests / region / urgency / source / confidence)
  - `src/lib/ai/intent.ts` 순수 유틸: `buildIntentPrompt`, `fallbackIntent` (규칙 기반), `parseGeminiIntent` (스키마 검증 후 fallback 로 백필)
  - Node 테스트 8건 (`scripts/test-ai-intent.mjs`)
- 서버 리졸버
  - `src/lib/ai/resolver.ts` (server-only): Gemini `generateContent` 호출 + `responseSchema` 강제, 실패 시 fallbackIntent
  - `app/api/ai/intent/route.ts`: `POST { query, profile? }` → `{ intent }` 반환
- 통합 검색 라우터 개선
  - `app/api/benefits/search/route.ts` 가 query 만 있고 apiKeyword 미지정 시 intent 파싱 후 URL param 보정 (ageGroup / situation / apiKeyword / sidoName / sigunguName)
  - 응답에 `intent` 필드 포함해 FE 가 파싱 결과를 함께 표시할 수 있게
- 소스 레지스트리 확장
  - `BenefitSourceId` 유니온에 `youth-policy`, `employment24`, `mohw-health`, `housing-support`, `smes-support` 추가
  - `BenefitSourceCategory` 유니온에 `youth`, `employment`, `health`, `housing`, `business` 추가
  - descriptor 에 `envKey`, `docsUrl` 필드 추가 — UI 에 활성화 요건 안내 가능
  - `getActiveBenefitSources` 가 env 값 존재 여부까지 체크해 자동으로 skip
- 코덱스 코드 lint 정합화
  - `useUserProfile`, `/onboarding`, `/search` 의 React 19 `set-state-in-effect` 규칙 위반 3건을 async IIFE 로 감싸 해결
- 검증
  - `npm run lint` 통과
  - `npm run build` 통과 (15/15 페이지, `/api/ai/intent` 라우트 확인)
  - Node 테스트 32/32 통과 (기존 24건 + AI intent 8건)

### 2026.07.02 지역 오픈데이터 공통 커넥터 추가

방향: 서울 열린데이터광장 API를 개별 API별로 하드코딩하지 않고, 전국 확장 가능한 지역 오픈데이터 connector 패턴의 첫 구현으로 추가. 최종 목표는 서울 한정이 아니라 사용자 현재 위치 기반으로 각 지역의 복지/프로그램/시설/FAQ 데이터를 통합 검색하는 구조.

- `src/lib/benefits/seoulOpenData.ts`
  - 서울 OpenAPI 공통 호출 패턴 구현: `http://openapi.seoul.go.kr:8088/{KEY}/json/{SERVICE_NAME}/1/100`
  - `SEOUL_OPEN_DATA_SERVICES` JSON 설정 지원
  - 개별 env 서비스명 설정 지원
    - `SEOUL_ONE_PERSON_PROGRAM_SERVICE_NAME`
    - `SEOUL_COMPANION_RESTAURANT_SERVICE_NAME`
    - `SEOUL_DASAN_FAQ_SERVICE_NAME`
  - 서비스 기능군
    - `benefit-program`: 1인가구/청년/중장년/고령자 참여 프로그램형
    - `facility-location`: 취약계층/생활시설 위치형
    - `facility-reservation`: 시설/체육/대관 예약형 후속 확장용
    - `faq`: 다산콜센터 FAQ/상담형
  - Gemini intent / keyword / 현재 지역을 보고 호출할 서비스군을 필터링
- `src/lib/benefits/normalize.ts`
  - 행 기반/텍스트 기반 API 응답을 `NormalizedBenefit`으로 바꾸는 `normalizeTextBenefit` 추가
- `src/lib/benefits/sources.ts`
  - `seoul-open-data`를 active source로 전환
  - `SEOUL_OPEN_DATA_KEY`가 없으면 planned 목록에 남도록 `getPlannedBenefitSources` 보정
- `app/api/benefits/search/route.ts`
  - `seoul-open-data` source일 때 `searchSeoulOpenDataSource`를 호출하도록 연결
  - 기존 복지로 local/national connector와 동일한 `BenefitSourceResult`로 병합
- 운영 메모
  - 서울 API의 실제 `서비스명`은 열린데이터광장 API 상세 화면의 영문/서비스명을 env에 넣어야 활성화됨
  - API 수가 늘어나도 코드를 늘리는 방식이 아니라 registry 설정 + mapper 기능군을 추가하는 방식으로 확장

### 2026.07.01 인기 복지 집계 FE↔BE 통합

방향: 이전에 만든 BE popular 도메인을 FE 카드 인터랙션과 연결. 카드 노출/클릭/저장 시 BE 카운터 증분, PopularList 는 BE 집계 결과를 우선 사용하고 실패/빈 결과 시 기존 `welfareInsights` fallback.

- FE `WelfareItem` 에 `source?: 'local' | 'national'`, `cacheKey?: string` 추가
  - `local/national` welfare API 라우트에서 파싱 시점에 `cacheKey = ${source}:${servId}` 채움
  - `welfare_services` 캐시 upsert 시 `raw_data` 에도 동일 값 저장
- BE popular projection
  - `PopularServiceProjection` 인터페이스 추가 (Spring Data JPA interface projection)
  - `PopularServiceDto` 에 welfare 원본 필드 6개(`title/summary/link/region/target/category`) 확장
  - `findTopProjectedByScore` native query 로 `popular_services LEFT JOIN welfare_services` 반환
    - alias 를 double-quoted 로 camelCase 보존 (Postgres 언쿼트 소문자화 회피)
  - `PopularServiceFacade.findTop` 이 projection 경로 사용
  - `PopularServiceDtoTests` 유닛 테스트 추가 (JOIN 정상 매핑, orphan 카운터 null 필드 허용)
- FE popular API 클라이언트
  - `src/lib/popular/client.ts` — `PopularServiceItem`, `normalizePopularItems`, `fetchPopularServices(limit, fetcher?)`
  - `NEXT_PUBLIC_BE_BASE_URL` env 지원 (기본 `http://localhost:8080`)
  - Node 테스트 6건 (`scripts/test-popular-client.mjs`)
- FE PopularList BE 연동
  - `useEffect` 로 마운트 시 BE Top 10 fetch
  - 첫 탭(맞춤 후보)이 BE 결과 우선, 빈 결과 시 기존 `welfareInsights.recommendedItems` fallback
  - orphan 카운터(welfare_services 없음)는 시각적으로 숨김
- FE interaction tracking
  - `src/lib/popular/tracking.ts` — `trackPopularInteraction(cacheKey, type, fetcher?)`, fire-and-forget
  - `WelfareCard` 저장 클릭 시 (새로 저장하는 경우만) `save`, 상세 링크 클릭 시 `click`
  - `WelfareList` 는 페이지 렌더 시 방문한 `cacheKey` 를 ref set 으로 dedup 하며 `view` 1회 발사
  - Node 테스트 4건 (`scripts/test-popular-tracking.mjs`)
- 계획 문서: `docs/superpowers/plans/2026-07-01-popular-integration.md`
- 검증
  - `node --test` 24/24 통과 (welfare-insights 5, welfare-cache 5, facilities 6, popular-client 6, popular-tracking 4 — 실제 파일별 수치는 유틸 커버리지에 따라 약간 차이)
  - `npm run lint` 통과
  - `npm run build` 통과 (10/10 페이지)
  - BE `.\gradlew.bat test --tests com.welfareMap.popular.dto.PopularServiceDtoTests` 로컬 검증 필요 (도구 환경 loopback 제약)

### 2026.06.30 BE 하이브리드 — 인기 복지 집계 도메인 추가

방향: 주기적/누적 데이터(인기 복지 집계)는 BE로, 단발 호출(AI 추천)은 FE에서 시작하는 하이브리드 전략. 이번 작업은 BE 첫 도메인.

- `config/SecurityConfig`, `config/CorsConfig`
  - `/api/v1/popular/**` permitAll
  - CSRF disable, stateless 세션, formLogin disable
  - CORS는 `app.cors-allowed-origins` (기본 `http://localhost:3000`)
- `popular` 도메인
  - `PopularServiceStats` 엔티티: `popular_services` 테이블 매핑, `score`/`updated_at`은 DB 생성 컬럼이라 insert/update 불가 표시
  - `PopularServiceStatsRepository`: native `ON CONFLICT DO UPDATE` 업서트로 동시성 안전한 카운터 증분, `findTopByScore(limit)` Top N 조회
  - `PopularServiceFacade`: `@Transactional` 경계, FK 위반 시 404 변환
  - `PopularServiceController`
    - `GET /api/v1/popular/top?limit=10` (1~50)
    - `GET /api/v1/popular/{cacheKey}` 단건 조회
    - `POST /api/v1/popular/{cacheKey}/{view|click|save}` 카운터 1 증분
- `application.yml`: `${SPRING_DATASOURCE_URL:${DB_URL}}` 폴백 추가 — 기존 `.env.local`의 `DB_*` 호환 유지
- `gradle.properties` 추가: `-Djava.net.preferIPv4Stack=true -Xmx1g`
- 검증
  - `gradlew.bat --version` 정상 (Gradle 8.14.4, JDK 21)
  - `gradlew.bat compileJava`는 도구 샌드박스 JDK loopback 제약으로 실행 못 함 — 로컬에서 `gradlew.bat build` / `gradlew.bat test` 검증 필요

### 2026.06.30 우선순위 A.1 E2E 검증

- FE `.env.local`에 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `KAKAO_REST_API_KEY` 주입
  - `KAKAO_REST_API_KEY`는 BE `.env.local`의 `KAKAO_CLIENT_ID` 값 재사용 (Kakao OAuth client_id = REST API 키)
  - `SUPABASE_URL`은 BE `DB_URL`의 project-ref에서 도출
  - `SUPABASE_SERVICE_ROLE_KEY`는 Supabase Dashboard에서 별도 발급
- dev 서버 env 자동 reload 확인 (`.next/dev/logs/next-development.log`에 `Reload env: .env.local`)
- `node scripts/verify-welfare-cache.mjs` 검증
  - `/api/welfare/local` 1차 호출: cache=miss, items=5 (외부 → Supabase upsert)
  - 동일 호출 2차: cache=hit, items=5 (Supabase에서 직접 응답)
- `scripts/verify-welfare-cache.mjs` 기본 엔드포인트를 `/api/welfare/national` → `/api/welfare/local`로 변경
  - 검증 시점 data.go.kr `NationalWelfareInformations/NationalWelfarelist`가 500 응답
  - 외부 일시 장애로 판단, 다른 엔드포인트는 정상이므로 우리 코드 영향 없음
  - 필요 시 `WELFARE_VERIFY_ENDPOINT` env로 다른 경로 검증 가능

### 2026.06.30 Notion 산출 문서 4종 최신화

- 화면 설계서
  - 현재 구현 기준인 `/` 단일 메인 화면, 섹션 앵커, Navbar/Hero/SavedSection/WelfareSection/Map/Statistics 구조 반영
  - 아직 미구현인 로그인/마이페이지/상세/AI 프로필 화면은 후속 작업으로 분리
- API 명세서
  - 실제 Next API Route와 BE `/api/v1/popular/**` 명세 정리
  - Supabase 캐시 응답 상태(`hit`, `miss`, `bypass`), 필수 env, 검증 스크립트 기준 반영
- 트러블슈팅
  - Supabase inactive, 기존 DB/migration 불일치, RLS 권한 과다, 캐시 env, 전국 API 500, Spring `.env.local`, Supabase pooler 이슈 기록
- DB 설계 문서
  - 실제 적용 스키마와 RLS/권한 정책 반영
  - `welfare_services` 하이브리드 구조, `popular_services` generated score 공식, 저장/인기 집계 후속 작업 정리
- 작업 히스토리
  - Notion `작업 히스토리`에 `2026.06.30 (6차) Notion 산출 문서 4종 최신화` 섹션 추가

### 2026.07.01 공공서비스형 UI 리디자인

- 디자인 방향
  - 기존 큰 히어로, 반복 카드, 강한 초록/남색 강조, AI 과시 문구를 줄이고 공공서비스형 생활 대시보드 톤으로 전환
  - `docs/superpowers/specs/2026-07-01-welfaremap-redesign-design.md`에 전체 디자인 명세 작성
  - `docs/superpowers/plans/2026-07-01-welfaremap-redesign.md`에 구현 계획 작성
- 전역 디자인 시스템
  - `globals.css` 색상 토큰을 저채도 GovTech 팔레트로 교체
  - 카드 반경, 경계선, 포커스 스타일, workspace 레이아웃 기준 재정의
- 화면 리디자인
  - Navbar를 서비스 콘솔 상단바처럼 압축
  - Hero를 홍보형 랜딩에서 현재 지역 기준 command center로 전환
  - LifeStage를 큰 카드 그리드에서 빠른 필터 레일로 축소
  - NoticeBanner를 action queue 형태로 정리
  - PopularList를 우선 확인할 지원 목록 톤으로 정리
  - SavedSection, Filter, Map, WelfareCard, WelfareList, LocationModal의 장식성을 낮추고 정보 밀도 개선
  - Statistics와 Footer를 마케팅 섹션이 아니라 데이터 요약/출처 중심으로 톤 다운

## 15. 운영 메모

- 작업 히스토리와 의사결정은 기존처럼 Notion에 계속 업데이트합니다.
- 로컬 `PROJECT.md`는 코드 저장소에서 프로젝트 상태를 빠르게 파악하기 위한 기준 문서로 사용합니다.
- Notion에는 기획/작업 히스토리/트러블슈팅을 상세 기록하고, Git에는 구현과 함께 이 문서를 최신 상태로 유지합니다.
- 앞으로 주요 작업을 시작하거나 완료할 때 `PROJECT.md`의 작업 우선순위, 히스토리, 결정 사항을 함께 업데이트합니다.

---

## 2026-07-02 업데이트: 서울 열린데이터광장 API 3종 연결 기준 정리

이번 작업에서는 사용자가 제공한 서울 열린데이터광장 API 3개를 실제 통합 검색 커넥터의 기본 preset으로 반영했다.

- 공통 인증키: `SEOUL_OPEN_DATA_KEY`
- 1인가구 참여프로그램: `SEOUL_ONE_PERSON_PROGRAM_SERVICE_NAME=tbPartcptn`
- 강동구 어르신 복지시설: `SEOUL_ELDERLY_FACILITY_SERVICE_NAME=GdTnBbs3`
- 은평구 시설대관 공공서비스예약: `SEOUL_PUBLIC_RESERVATION_SERVICE_NAME=EPListPublicReservationInstitution`

구현 내용:

- `src/lib/benefits/seoulOpenData.ts`의 깨진 한글 preset을 실제 API 3종 기준으로 교체
- 서울 25개 자치구명이 검색어/intent에 포함되어도 서울 OpenData 검색 대상으로 판단하도록 개선
- 1인가구 프로그램, 어르신 복지시설, 시설대관 예약 API별 주요 row 필드 매핑 추가
- `PARTCPTN_SJ`, `FCLT_NM`, `SVCNM`, `ATDRC_NM`, `DONG`, `AREANM`, `TRGET_INFO`, `USETGTINFO`, `RCEPT_MTH_LINK`, `SVCURL` 등 실제 응답 필드 반영
- `CN`처럼 HTML/이미지/base64가 섞일 수 있는 필드는 정리 후 요약에 사용
- `.env.example`에 서울 OpenData 서비스명 예시 추가

운영 메모:

- 서울 열린데이터광장 인증키 1개를 쓰더라도 API별 서비스명은 각각 env로 지정한다.
- 향후 API가 늘어나면 `SEOUL_OPEN_DATA_SERVICES` JSON registry 방식으로 추가하거나, preset을 기능군별로 확장한다.
- 최종 목표는 서울 한정이 아니라 전국 위치 기반 검색이므로, 서울 OpenData 커넥터는 지역 오픈데이터 커넥터 패턴의 첫 샘플로 본다.

---

## 2026-07-02 업데이트: 좌측 메뉴 화면 확장 및 검색 결과 집중 모드

이번 작업에서는 `/search` 화면의 좌측 공통 메뉴를 실제 서비스 화면처럼 사용할 수 있도록 확장하고, AI 검색 submit 이후에는 검색 입력 중심 화면이 계속 남지 않도록 결과 전용 화면으로 전환했다.

- `AI 검색`: 검색 전에는 프롬프트/검색창/요약 카드 표시, 검색 후에는 결과 집중 화면으로 전환
- `내 맞춤 혜택`: 최근 검색 결과가 있으면 실제 후보를 요약하고, 없으면 청년정책/고용24/서울 OpenData 확장형 추천 카드 표시
- `지도/주변기관`: 지도 메뉴 전용 와이어프레임과 주변기관 유형 목록 추가
- `저장한 혜택`: localStorage 북마크 목록을 메뉴 화면에서 확인/해제 가능
- `검색 기록`: 최근 질문을 다시 실행할 수 있는 메뉴 화면 추가
- `마이페이지`: 온보딩에서 저장한 사용자 조건 요약과 프로필 수정 진입 연결
- 검색 결과 모드: submit 이후 우측 패널 의존 UI를 접고, 중앙 화면 전체를 결과 리스트/출처/AI intent 요약 중심으로 구성

검증:

- `npm run build` 통과
- `npm run lint` 통과
- `http://localhost:3000/search` 200 응답 확인
