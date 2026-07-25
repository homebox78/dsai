대시보드 최상단 4분할. 클릭하면 해당 화면으로 이동시킨다.

```jsx
<div style={{ display: 'flex', borderBottom: '1px solid var(--border-structure)' }}>
  <KpiTile icon="description" label="색인 문서" value="1,284" unit="건" delta="+128" deltaTone="done" progress={82} onClick={goStore} />
</div>
```
