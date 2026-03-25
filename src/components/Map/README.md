# Map 컴포넌트

## 역할
카카오맵 API를 활용한 지도 컴포넌트. 주변 복지 서비스 위치를 마커로 표시한다.

## Props
| Props | 타입 | 설명 |
|---|---|---|
| center | { lat: number, lng: number } | 지도 중심 좌표 |
| markers | WelfareMarker[] | 복지 서비스 마커 목록 |
| onMarkerClick | (id: string) => void | 마커 클릭 이벤트 |

## 주요 기능
- 현재 위치 기반 지도 초기화
- 복지 서비스 마커 표시
- 마커 클릭 시 해당 복지 정보 카드 하이라이트
- 지도 이동 시 해당 영역 복지 정보 재조회

## 주의사항
- 카카오맵 API 키는 환경변수로 관리 (`NEXT_PUBLIC_KAKAO_MAP_KEY`)
- SSR 비활성화 필요 (`dynamic import` with `ssr: false`)