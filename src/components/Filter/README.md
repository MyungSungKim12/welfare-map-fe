# Filter 컴포넌트

## 역할
웹 레이아웃 기준 좌측 사이드바 고정 필터 UI.
나이대, 상황, 지역을 조합하여 맞춤 복지를 필터링한다.

## Props
| Props | 타입 | 설명 |
|---|---|---|
| onFilterChange | (filter: FilterType) => void | 필터 변경 이벤트 |
| defaultFilter | FilterType | 기본 필터 값 |

## FilterType
```ts
type FilterType = {
  ageGroup: 'child' | 'youth' | 'middle' | 'senior' | 'all';
  situation: 'newlywed' | 'pregnant' | 'job' | 'disability' | 'lowincome' | 'all';
  region: string;
};
```

## 주요 기능
- 나이대 필터 (전체 / 영유아 / 청년 / 장년 / 노년)
- 상황 필터 (전체 / 신혼부부 / 임산부 / 취업준비 / 장애인 / 저소득층)
- 필터 초기화 버튼
- 선택된 필터 상태 유지

## 레이아웃
- 웹: 좌측 사이드바 고정 (width: 280px)
- 카드 형태로 위치 정보 + 필터 섹션 분리

## 접근성 고려사항
- 버튼형 칩 필터 (탭 키 접근 가능)
- 선택 / 미선택 색 대비 명확하게 구분
- 큰 터치 영역 확보 (padding 8px 이상)