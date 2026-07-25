대시보드에서 문서 처리 파이프라인을 한 줄로 요약한다. 단계는 4개 안팎, 색으로 상태를 구분한다.

```jsx
<PipelineFlow onStage={goStore} stages={[
  { icon:'upload_file', count:1287, label:'업로드', tone:'idle' },
  { icon:'document_scanner', count:3, label:'OCR 처리', tone:'wait' },
  { icon:'auto_awesome', count:1284, label:'RAG 색인', tone:'done' },
  { icon:'search_insights', count:412, label:'검색 이용', tone:'brand' }
]} />
```

마지막 단계 뒤에는 연결선을 그리지 않는다(컴포넌트가 자동 처리).
