파일 상세의 메타데이터 탭. 라벨↔값 정의 목록을 라인으로 구분해 보여준다.

```jsx
<MetaPanel rows={[
  { label: '파일명', value: '표준 공급계약서_v3.docx' },
  { label: 'OCR 처리', value: '완료 · 텍스트 추출 218페이지', tone: 'done' },
  { label: 'RAG 색인', value: '완료 · 청크 654개 · 추론 검색 가능', tone: 'done' },
  { label: '인용 현황', value: '에코바디스 답변 3건에서 근거로 사용', tone: 'accent' },
  { label: '보존 기한', value: '2031.12.31 (5년 보존)' }
]} />
```

- 카드가 아니라 라인. 값 강조는 tone으로만 (완료=green, 처리중=amber, 인용=accent).
- 라벨 열 폭은 콘텐츠에 맞춰 labelWidth로 조정.
