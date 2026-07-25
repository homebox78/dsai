폼 입력과 목록 검색 입력을 함께 담당한다.

```jsx
<Input label="조직 이름" required placeholder="예: Amber Evolution" />
<Input underline icon="search" placeholder="파일명·내용 검색" />
```

포커스는 항상 블루 보더 + 3px 링(`--focus-ring`). 네이티브 outline은 쓰지 않는다.
