# WelfareMap 프로젝트 문서

> 지역 기반 복지 정보와 주변 생활 정보를 한곳에서 탐색하고, 사용자 상황에 맞는 정책과 행동을 추천하는 AI 기반 지역생활 복지 플랫폼입니다.

## 1. 프로젝트 개요

| 항목 | 내용 |
| --- | --- |
| 프로젝트명 | WelfareMap |
| 서비스 방향 | 위치 기반 복지 정보 + 지역생활 정보 + AI 맞춤 추천 |
| 시작 시점 | 2026.03 |
| 현재 상태 | 1차 기능 구현 진행 중, 메인 UI 1차 리디자인 및 데이터 기반 섹션 연결 완료 |
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
- Supabase 캐시 연동 코드와 DB migration 초안
- Kakao Local 키워드 검색 기반 주변 복지기관 마커 (복지관 / 주민센터 / 보건소 / 노인·장애인복지관 / 어린이집)

### 아직 더미 또는 미완성인 기능

- 인기 복지 섹션 실제 데이터 연동
- 복지 저장 / 북마크 기능
- 로그인 / 마이페이지
- Supabase 캐시 migration 실제 DB 적용
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

현재 BE는 초기 세팅 상태이며, 실제 도메인 API와 배치 로직은 아직 구현 전입니다.

## 8. 외부 API 연동 현황

| API | 상태 | 용도 |
| --- | --- | --- |
| 복지로 지자체 복지 API | 연동됨 | 지역 복지 목록 조회 |
| 복지로 전국 복지 API | 연동됨 | 전국 공통 복지 목록 조회 |
| Kakao Coord2Region | 연동됨 | GPS 좌표를 행정구역으로 변환 |
| Kakao Keyword Search | 연동됨 | 지역명 검색 후 좌표 조회 |
| Kakao Local 시설 검색 | 연동됨 | 위치 반경 내 복지기관 / 주민센터 / 보건소 등 마커 후보 조회 |
| Supabase 캐시 | 코드 준비됨 / DB 적용 대기 | 기본 복지 조회 결과 캐싱 |
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

현재 Supabase 프로젝트는 확인 시점에 `INACTIVE` 상태였고, MCP 테이블 조회는 DB 연결 timeout으로 검증하지 못했습니다.

2026.06.30 기준 `WelfareList_DB`는 여전히 `INACTIVE`이며 `select 1` 실행도 connection timeout으로 실패했습니다.

로컬에는 다음 migration이 준비되어 있습니다.

- `supabase/migrations/20260630010402_welfare_cache.sql`

포함 내용:

- `welfare_services` 캐시 테이블
- `popular_services` 집계 테이블
- `welfare_deadlines`, `welfare_new` 보안 invoker view
- RLS 활성화
- `anon`, `authenticated`, `service_role` 권한 명시

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
- Kakao / Welfare API 프록시 구조 확인

### 개선 필요

- 인기 복지, 북마크, 로그인, 저장 기능은 아직 미완성
- 필터가 적용된 복지 API 조회는 아직 외부 API를 직접 호출함
- 노출된 Supabase DB 비밀번호는 코드에서 제거했지만, 실제 키 회전은 Supabase Dashboard에서 별도 수행 필요
- `npm audit` 잔여 2건은 Next.js 내부 postcss 전이 의존성으로, `--force` 적용 시 Next 9.x 다운그레이드가 발생해 안전 패치 한계

### 2026.06.30 해결됨

- BE `application.yml` 평문 DB 접속 정보 제거
- BE `build/`, `.gradle/`, `.idea` Git 인덱스 제거
- BE Gradle wrapper jar 복구 및 `gradlew.bat test` 성공 확인
- FE `npm audit` 취약점 6건 → 2건 (중간, 전이의존성)으로 축소 (Next.js `^16.2.9` 패치업)
- FE 지도 마커 실제 기관 좌표 연동 (Kakao Local 키워드 검색)

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

**상태: 2026.06.30 코드 정리 완료, 외부 키 회전 대기**

- BE DB 비밀번호 키 회전
- `application.yml` 환경변수화 완료
- Git에서 빌드 산출물 제거 처리 완료
- Gradle wrapper 복구 완료
- FE/BE Git 상태 정리

### 2순위: FE 데이터 흐름 정리

**상태: 2026.06.30 완료**

- `useWelfareData` 호출 위치를 상위 컴포넌트로 이동 완료
- 지도와 리스트가 같은 데이터를 공유하도록 수정 완료
- 인기/신규/마감 섹션을 실제 데이터 기반으로 전환 완료
- lint 오류 정리 완료

### 3순위: Supabase 캐시 구조 연결

**상태: 2026.06.30 코드 및 migration 준비 완료, DB 비활성화로 적용 대기**

- Supabase 프로젝트 재활성화 필요
- 실제 테이블 존재 여부 확인은 connection timeout으로 미완료
- 복지 API 응답을 `welfare_services`에 캐싱하는 코드 작성 완료
- 기본 조회는 캐시 우선, 필터 조회는 정확도 유지를 위해 외부 API 우선
- 인기/마감/신규 집계 테이블 및 view migration 작성 완료

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

## 15. 운영 메모

- 작업 히스토리와 의사결정은 기존처럼 Notion에 계속 업데이트합니다.
- 로컬 `PROJECT.md`는 코드 저장소에서 프로젝트 상태를 빠르게 파악하기 위한 기준 문서로 사용합니다.
- Notion에는 기획/작업 히스토리/트러블슈팅을 상세 기록하고, Git에는 구현과 함께 이 문서를 최신 상태로 유지합니다.
- 앞으로 주요 작업을 시작하거나 완료할 때 `PROJECT.md`의 작업 우선순위, 히스토리, 결정 사항을 함께 업데이트합니다.
