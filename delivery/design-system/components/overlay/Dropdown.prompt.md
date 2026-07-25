`position:relative` 트리거 안에 넣어 사용한다. 목록이 길면 내부에서만 스크롤된다 (최대 320px).

```jsx
<div style={{ position: 'relative' }}>
  <IconButton icon="notifications" onBrand badge={4} onClick={toggle} />
  <Dropdown open={open} width={306} header={<span>알림</span>}>…</Dropdown>
</div>
```
