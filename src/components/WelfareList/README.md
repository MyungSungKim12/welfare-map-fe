# WelfareList 컴포넌트

## 역할
필터링된 복지 서비스 목록을 WelfareCard 리스트로 렌더링하는 컴포넌트.
리스트 뷰 / 지도 뷰 전환 기능을 포함한다.

## Props
| Props | 타입 | 설명 |
|---|---|---|
| items | WelfareItem[] | 복지 서비스 목록 |
| isLoading | boolean | 로딩 상태 |
| savedIds | string[] | 저장된 복지 ID 목록 |
| onSave | (id: string) => void | 저장 이벤트 |
| viewMode | 'list' \| 'map' | 현재 뷰 모드 |
| onViewChange | (mode: 'list' \| 'map') => void | 뷰 전환 이벤트 |

## 주요 기능
- 복지 카드 목록 렌더링
- 리스트 뷰 / 지도 뷰 전환 버튼
- 로딩 스켈레톤 UI
- 결과 없음 상태 처리
- 결과 건수 표시
- 무한 스크롤 (추후 구현)

## 상태별 UI
- 로딩 중: 스켈레톤 카드 3개 표시
- 결과 없음: 안내 메시지 + 필터 초기화 버튼
- 결과 있음: WelfareCard 목록