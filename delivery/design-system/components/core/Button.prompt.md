Amber의 기본 버튼 — 화면·모달마다 프라이머리 1개, 나머지는 secondary/ghost로 위계를 낮춘다.

```jsx
<Button variant="primary" size="md" icon="upload">파일 업로드</Button>
<Button variant="secondary">취소</Button>
<Button variant="link" iconEnd="chevron_right">전체 보기</Button>
```

- 모달·시트 푸터에서는 `fullWidth`를 두 버튼에 함께 걸어 5:5 폭으로 배치한다.
- 딥블루 헤더 위 컨트롤은 `variant="onBrand"`.
- 아이콘은 Material Symbols Rounded 이름 문자열만 넘긴다 (SVG 금지).
