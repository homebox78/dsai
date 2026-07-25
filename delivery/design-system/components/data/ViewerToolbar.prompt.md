전체화면 문서 뷰어의 상단 툴바. 목업 문서 뷰어 헤더와 1:1이다.

```jsx
<ViewerToolbar ext="DOCX" name="표준 공급계약서_v3.docx" page={47} pages={218}
  onPrev={prev} onNext={next} onClose={close} />
```

- 페이지 페이저는 회색(#e2e8f0) 캡슐 안에 이전/다음 버튼 + "47 / 218p".
- OCR·RAG 배지는 초록(준비 완료 신호). 처리중이면 각각 숨기거나 상위에서 앰버 배지로 대체.
