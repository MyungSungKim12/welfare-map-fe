# 🗺️ WelfareMap (복지맵)

> 내 주변 복지 정보를 한눈에 — 고령화 사회를 위한 지역 기반 복지 정보 통합 서비스

## 📌 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 프로젝트명 | WelfareMap (복지맵) |
| 시작일 | 2026.03 |
| 개발자 | 김명성 |
| 상태 | 🟡 진행 중 |
| 배포 | Vercel |

## 🎯 기획 의도

고령화 사회를 염두하여 나이가 많은 사람들도 쉽게 이용할 수 있는 복지 정보 통합 서비스.
내가 살고 있는 동네 주변의 복지를 한눈에 볼 수 있도록 한다.

**예시 시나리오**
- 인천 미추홀구 거주 어르신 → 해당 지역 복지 서비스 한눈에 확인
- 예비 부부 → 신혼부부 대상 정책/지원금 필터링
- 청년 취업준비생 → 청년 대상 취업 지원 복지 확인

## 🛠️ 기술 스택

| 구분 | 기술 |
|---|---|
| Frontend | Next.js 15, TypeScript, Styled-components |
| Backend | Spring Boot 3, Java 21 |
| Database | Supabase PostgreSQL |
| 지도 | 카카오맵 API |
| 복지 데이터 | 복지로 API, 공공데이터포털 |
| 배포 | Vercel (FE) |

## 🚀 시작하기
```bash
npm install
npm run dev
```

`http://localhost:3000` 으로 접속

## 📁 폴더 구조
```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    lib/
      registry.tsx       ← Styled-components SSR 설정
  components/
    Navbar/              ← 상단 네비게이션 (위치 선택 포함)
    Hero/                ← 메인 히어로 섹션
    LifeStage/           ← 생애주기별 빠른 진입
    NoticeBanner/        ← 공지/안내 배너
    PopularList/         ← 인기/추천 복지
    Map/                 ← 카카오맵 지도 뷰
    Filter/              ← 사이드바 필터 (나이/상황/지역)
    WelfareCard/         ← 복지 서비스 카드
    WelfareList/         ← 복지 카드 리스트 + 지도뷰 전환
    Statistics/          ← 통계 섹션
    Footer/              ← 푸터
  constants/
    data.ts
  types/
    welfare.ts
```

## 🔗 관련 링크

- [Backend 레포](https://github.com/MyungSungKim12/welfare-map-be)
- [Notion 프로젝트 문서](https://www.notion.so/32e3e7df282c812baf0fdd36cb97fb64)
- [GitHub Projects 칸반보드](https://github.com/users/MyungSungKim12/projects)