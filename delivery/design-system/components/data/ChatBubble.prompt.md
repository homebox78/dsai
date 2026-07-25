채팅룸 메시지 버블. 목업의 chatMsgs 구조와 1:1로 맞춘 컴포넌트다 — 새 스타일을 만들지 말고 이걸 쓴다.

```jsx
<ChatBubble name="이수진" time="오후 2:14" text="행동강령 서명본 확인 부탁드립니다."
  file={{ ext: 'PDF', name: '공급업체 행동강령_서명본.pdf', size: '2.4MB' }} />
<ChatBubble mine name="나" time="오후 2:16" read="읽음 3" text="확인했습니다. 오늘 중 회신하겠습니다."
  reactions={[{ icon: 'thumb_up', count: 2, color: '#1750d8' }]} />
<ChatBubble mine name="나" time="오후 2:20"
  task={{ title: '안전보건 교육 이수 내역 요청', status: '요청됨', tone: 'wait', to: '박지원', due: '~07.28' }} />
```

규칙 (목업과 동일):
- 이름·시간 헤더는 **항상** 버블 위에 온다. 내 메시지 이름은 '나'.
- 버블 radius 8px, 받은 메시지 #f1f5f9 / 보낸 메시지 #1750d8.
- 첨부·업무요청은 **버블 아래 형제 카드**(둥근 버블 안에 넣지 않는다). 첨부=회색 라인, 업무요청=상태색 라인 + 상하 보더 + 330px 고정.
- AI 챗봇의 근거 칩 답변은 이 컴포넌트가 아니라 문서 챗봇 패널 쪽 렌더를 쓴다.
