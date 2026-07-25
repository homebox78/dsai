# 프로젝트 규칙 (Amber Document Intelligence)

## 아이콘
- 모든 아이콘은 **Google Material Symbols** 사용. 직접 그린 SVG path·이모지·문자 글리프(‹ › ✕ ▼ 등) 금지.
- 로드: `<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">`
- 사용: `<span class="msym">folder</span>` (font-family: 'Material Symbols Rounded'), 크기는 font-size로 제어.
- React 개발 단계에서도 동일 (lucide 등 다른 아이콘 세트 혼용 금지).

## 화면 운영 원칙
- 페이지를 여러 개 만들지 않는다. 한 화면(앱 셸) 안에서 모달·시트·패널 펼치기/접기로 정보를 레이어로 불러온다.
- 라우트는 인증 / 초기 셋업 / 앱 셸 최소 수준. 메뉴 선택은 컨텐츠 영역 교체.

## 표기
- 전 화면 한국어. "워크스페이스" → **조직&사업부**.
- 계층: 조직 → 조직&사업부 → 프로젝트.

## 스택
React 19 + Vite + shadcn/ui + Tailwind v4, zustand, react-pdf, Pretendard.
