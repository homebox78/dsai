앱은 단일 셸이며, 입력·확인 흐름은 전부 이 모달로 겹쳐 띄운다.

```jsx
<Modal title="파일 업로드" sub="업로드 후 OCR·RAG 색인을 실행합니다" width={520}
  footer={<><Button fullWidth>취소</Button><Button variant="primary" fullWidth>업로드</Button></>}>
  …
</Modal>
```
