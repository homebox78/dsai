패널 접기/펴기는 이 핸들로만 조작한다 (헤더 햄버거·하단 바 사용 금지). 인접 패널 사이 0폭 컨테이너로 넣는다.

```jsx
<aside style={{ width: 234 }}>…</aside>
<PanelToggleHandle side="left" open={menuOpen} title="메뉴 접기" onClick={toggle} />
<main>…</main>
```
