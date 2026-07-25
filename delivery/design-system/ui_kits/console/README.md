# Console UI kit

Amber Document Intelligence 콘솔(앱)의 화면 재현. 원본은 목업 `Amber Document Intelligence.dc.html`이며, 이 키트는 그 화면 구조를 디자인 시스템 토큰·컴포넌트 규격으로 다시 조립한 것이다.

## 파일

| 파일 | 내용 |
|---|---|
| `index.html` | 클릭 가능한 셸 — 메뉴로 화면 전환(문서 저장소 · 대시보드 · 증빙자료), 메뉴 접기, 파일 선택. 토큰만 사용한 정적 구현이라 빌드 없이 바로 열린다. |
| `AppShell.jsx` · `AppHeader.jsx` · `SideMenu.jsx` | 셸 구조의 React 참조 구현 (헤더 · 메뉴 · 경계 핸들 · 경로 슬롯) |
| `DashboardScreen.jsx` | KPI 4분할 + 내가 해야 할 일 + 에코바디스 진행 + 우측 위젯 |
| `DocumentStoreScreen.jsx` | 폴더 트리 │ 파일 목록 │ 파일 상세(요약·뷰어) │ 챗봇 4분할 |
| `TaskScreen.jsx` | 상태 레일 │ 업무 목록 │ 상세(워크플로·처리 이력) |
| `EvidenceScreen.jsx` | 평가영역 필터 │ 증빙 매핑 테이블 │ 커버리지 패널 |

`*.jsx` 화면은 `components/` 프리미티브를 조합한 참조 구현이다. 프로덕션(React 19 + Vite)에서는 이 파일들을 출발점으로 쓰고, `index.html`은 디자인 검수용 프리뷰로 본다.

## 규칙

- 화면은 라우팅이 아니라 **컨텐츠 영역 교체**로 전환한다.
- 입력·확인 흐름은 전부 `Modal` / `Sheet` 레이어.
- 패널 접기/펴기는 경계선 위 22px 원형 핸들만 사용.
- 색·간격·타입은 `styles.css` 토큰만 사용 (hex 하드코딩 금지).
