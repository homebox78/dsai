단일 진행률과 다중 세그먼트(AI 초안/미처리/답변완료) 둘 다 담당한다.

```jsx
<ProgressBar label="OCR 처리" right="62%" value={62} />
<ProgressBar segments={[{width:'66%',color:'var(--green-600)'},{width:'16%',color:'var(--amber-500)'},{width:'18%',color:'var(--red-200)'}]} height={9} />
```
