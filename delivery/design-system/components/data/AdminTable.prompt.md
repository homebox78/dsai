조직&사업부·채널·권한 그룹 등 관리자 테이블 하나로 처리한다. cols/headers로 열을 바꾸고, cells에 가운데 데이터 열을 넣는다.

```jsx
<AdminTable
  cols="minmax(180px,1fr) 108px 96px 96px 84px"
  headers={['채널', '유형', '참여자', '공개 범위', '']}
  rows={[
    { icon:'forum', name:'ESG 전략 TF', sub:'최근 활동 10:42', cells:['그룹','5명'], tag:'공개', tagTone:'open', action:'관리' },
    { icon:'group_add', name:'외부 감사 협업', sub:'외부 협업자 포함', cells:['게스트','3명'], tag:'제한', tagTone:'limit', action:'관리' }
  ]}
  onAction={openChannelModal} />
```

- 태그 톤: 공개=open(blue), 제한=limit(orange), 관리자=admin(green), 비공개·일반=idle.
- 행 클릭이 아니라 우측 액션 버튼으로 편집/관리 모달을 연다.
