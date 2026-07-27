/**
 * ⚠️ 검수 전용 — 클라이언트 검수가 끝나면 삭제합니다.
 *    제거 명령: npm run remove-qa   (미리보기: npm run remove-qa -- --dry)
 */
/**
 * 작업 목록 · 검수 인덱스 데이터 — 완성 시안(delivery/Amber Document Intelligence.dc.html)의
 * IDX 배열을 그대로 옮긴 것. 116항목 · 7그룹.
 * st = "열기"를 눌렀을 때 재현할 화면 상태(스토어 코어 키 + 뷰 로컬 상태 프리셋).
 * ⚠️ 납품 시 제거 대상.
 */

export type IdxKind = '화면' | '모달' | '시트' | '드롭다운' | '패널' | '오버레이'
export type IdxState = '완료' | '부분' | '범위 외'

export interface IdxItem {
  page: string
  name: string
  kind: IdxKind
  desc: string
  state: IdxState
  st: Record<string, unknown> | null
}

export interface IdxGroup {
  g: string
  icon: string
  items: IdxItem[]
}

export const IDX_GROUPS: IdxGroup[] = [
  {
    g: '인증 · 초기 셋업',
    icon: 'login',
    items: [
      { page: 'p7', name: '로그인', kind: '화면', desc: '블루 컨셉 · AI 파형 애니메이션 배경', state: '완료', st: { view: 'auth', authTab: 'login' } },
      { page: 'p7', name: '회원가입', kind: '화면', desc: '초대 배너 · 비밀번호 강도 미터 · 약관 전체 동의', state: '완료', st: { view: 'auth', authTab: 'signup' } },
      { page: 'p7', name: '계정 찾기', kind: '화면', desc: '재설정 방법 2종 선택(이메일·관리자) · SSO 안내', state: '완료', st: { view: 'auth', authTab: 'find' } },
      { page: 'p7', name: '2단계 인증(2FA)', kind: '화면', desc: 'OTP 6칸 · 카운트다운 · 백업 코드', state: '완료', st: { view: 'auth', authTab: 'twofa' } },
      { page: 'p23', name: '초기 셋업 1 · 조직 생성', kind: '화면', desc: '플랜 선택(액센트 라인) · 사업자번호 · STEP 표기', state: '완료', st: { view: 'onboard', obStep: 0 } },
      { page: 'p24', name: '초기 셋업 2 · 조직&사업부', kind: '화면', desc: '상위 사업부·설명 · 향후 모달 대체', state: '완료', st: { view: 'onboard', obStep: 1 } },
      { page: 'p25', name: '초기 셋업 3 · 프로젝트', kind: '화면', desc: '공개 범위 칩 · 멤버 초대 칩(Enter 추가·삭제)', state: '완료', st: { view: 'onboard', obStep: 2 } },
      { page: 'p23', name: '셋업 · 완료 후 자동 구성 패널', kind: '패널', desc: '기본 폴더·공지 채널·에코바디스 공간·마스터 권한', state: '완료', st: { view: 'onboard', obStep: 2 } },
      { page: 'p23', name: '셋업 · 계층 데이터 출력 패널', kind: '패널', desc: '입력값이 조직→조직&사업부→프로젝트 트리에 실시간 반영', state: '완료', st: { view: 'onboard', obStep: 1 } },
    ],
  },
  {
    g: '공통 셸 · 헤더 (형태1)',
    icon: 'view_sidebar',
    items: [
      { page: 'p5', name: '4단 레이아웃 · 패널 펼침', kind: '화면', desc: '메뉴 | 파일목록 | 컨텐츠 | 챗봇', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'list', menuOpen: true, listCol: true, bot: true } },
      { page: 'p5', name: '메뉴 숨김 (아이콘만)', kind: '패널', desc: '숨김 시 아이콘 노출 · 축소/확대 토글', state: '완료', st: { view: 'app', screen: 'store', menuOpen: false } },
      { page: 'p5', name: '파일목록·챗봇 축소', kind: '패널', desc: '축소 시 확대 아이콘 레일 노출', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'detail', listCol: false, bot: false } },
      { page: 'p8', name: '경로 breadcrumb 영역', kind: '패널', desc: '경로 + 배지 + 우측 액션 버튼', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'detail' } },
      { page: 'p9', name: '조직&사업부 스위처 (N)', kind: '드롭다운', desc: '조직·사업부·프로젝트 전환 + 크레딧 + 생성', state: '완료', st: { view: 'app', wsPopOpen: true, wsPopFrom: 'header' } },
      { page: 'p12', name: '도움말 드롭다운', kind: '드롭다운', desc: '가이드·정책 문서 4종 (상세는 클라이언트 제작)', state: '완료', st: { view: 'app', helpOpen: true } },
      { page: 'p13', name: '알림 드롭다운', kind: '드롭다운', desc: '전체·안읽음·멘션 탭 + 모두 읽음 + 전체보기·설정', state: '완료', st: { view: 'app', notiOpen: true } },
      { page: 'p13', name: '알림 멘션 탭', kind: '드롭다운', desc: '멘션만 필터 · 클릭 시 해당 채팅·업무로 이동', state: '완료', st: { view: 'app', notiOpen: true, notiTab: 'mention' } },
      { page: 'p13', name: '알림 · 모두 읽음 빈 상태', kind: '드롭다운', desc: '안읽음 0건 · 헤더 배지 사라짐', state: '완료', st: { view: 'app', notiOpen: true, notiTab: 'unread', notiRead: { n1: true, n2: true, n3: true, n4: true, n5: true } } },
      { page: 'p14', name: '프로필 드롭다운', kind: '드롭다운', desc: '계정·설정·권한·로그아웃', state: '완료', st: { view: 'app', userOpen: true } },
      { page: 'p17', name: 'AI 챗 시트', kind: '시트', desc: '헤더 ✦ 클릭 시 우측 슬라이드', state: '완료', st: { view: 'app', sheet: 'chat' } },
      { page: 'p10', name: '조직 생성 모달', kind: '모달', desc: '조직/조직&사업부/회원추가 모두 모달', state: '완료', st: { view: 'app', modal: 'org' } },
      { page: 'p11', name: '조직&사업부 생성 모달', kind: '모달', desc: '상위 사업부 지정', state: '완료', st: { view: 'app', modal: 'ws' } },
      { page: 'p11', name: '프로젝트 생성 모달', kind: '모달', desc: '공개/비공개 · 멤버 초대', state: '완료', st: { view: 'app', modal: 'proj' } },
      { page: 'p29', name: '설정 · 내 계정', kind: '모달', desc: '프로필 카드 · 언어·시간대·기본 진입 화면', state: '완료', st: { view: 'app', modal: 'settings', settingTab: 'account' } },
      { page: 'p29', name: '설정 · 보안 및 로그인', kind: '모달', desc: '2FA·신뢰기기·SSO 강제 · 로그인 기록', state: '완료', st: { view: 'app', modal: 'settings', settingTab: 'security' } },
      { page: 'p30', name: '설정 · 조직&사업부', kind: '모달', desc: '초대 권한 · 외부 협업자 · 스토리지 · 삭제', state: '완료', st: { view: 'app', modal: 'settings', settingTab: 'org' } },
      { page: 'p31', name: '설정 · AI·색인 정책', kind: '모달', desc: 'OCR·RAG 자동 실행 · 근거 표시 · 제외 폴더', state: '완료', st: { view: 'app', modal: 'settings', settingTab: 'ai' } },
      { page: 'p29', name: '설정 · 셀렉트 드롭다운', kind: '드롭다운', desc: '언어·시간대·진입화면 등 옵션 목록 열림', state: '완료', st: { view: 'app', modal: 'settings', settingTab: 'account', ddOpen: 'set:lang' } },
      { page: 'p32', name: '설정 · 알림', kind: '모달', desc: '업무·멘션·색인·기한 · 채널 · 방해금지', state: '완료', st: { view: 'app', modal: 'settings', settingTab: 'noti' } },
      { page: 'p26', name: '좌측 메뉴 전체 구조', kind: '패널', desc: '프로젝트/협업공간/문서/에코바디스/시스템', state: '완료', st: { view: 'app', screen: 'dash', menuOpen: true } },
      { page: 'p27', name: '조직&사업부 전환 · 크레딧', kind: '패널', desc: '인증·결제 배지 · 크레딧 1,000 · 구독하기', state: '완료', st: { view: 'app', screen: 'dash', wsPopOpen: true } },
      { page: 'p28', name: '내 프로젝트 목록 · 스크롤', kind: '패널', desc: '조직&사업부 펼침 · 검색 · 전체 보기', state: '완료', st: { view: 'app', screen: 'dash', wsPopOpen: true, wsExpanded: 'w2' } },
      { page: 'p28', name: '프로젝트 검색 필터', kind: '패널', desc: '이름 검색 시 해당 프로젝트만 펼침', state: '완료', st: { view: 'app', screen: 'dash', wsPopOpen: true, projQuery: '계약' } },
      { page: 'p33', name: '현재 프로젝트 요약 카드', kind: '패널', desc: '공개 여부 + members/channels/stores/files', state: '완료', st: { view: 'app', screen: 'dash', wsPopOpen: true } },
      { page: 'p34', name: '초대하기 · 로그아웃', kind: '패널', desc: '팝오버 하단 액션 3종', state: '완료', st: { view: 'app', screen: 'dash', wsPopOpen: true } },
      { page: 'p60', name: '전체 메뉴 오버레이', kind: '오버레이', desc: '메뉴 검색 · 바로가기 · 최근 본 화면', state: '완료', st: { view: 'app', overlay: true } },
      { page: 'p60', name: '전체 메뉴 · 메뉴 검색', kind: '오버레이', desc: '입력 시 일치 항목만 하이라이트', state: '완료', st: { view: 'app', overlay: true, menuQuery: '업무' } },
    ],
  },
  {
    g: '문서 저장소 (파일관리)',
    icon: 'folder_open',
    items: [
      { page: 'p37', name: '초기 진입 · 파일 목록', kind: '화면', desc: '폴더 정보 + 검색 + 목록 테이블', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'list', folder: 'f2', fileId: null } },
      { page: 'p39', name: '폴더 선택 · 2중 파일 목록', kind: '화면', desc: '용도 다른 목록 2종 동시 노출', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'list', folder: 'f4' } },
      { page: 'p40', name: '파일 상세 · 요약 + 뷰어', kind: '화면', desc: '요약 hide/show · 배지 · 문서 보기', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'detail', folder: 'f4', fileId: 'c1', summaryOpen: true } },
      { page: 'p40', name: '파일 상세 · 요약 숨김', kind: '화면', desc: '요약 접은 상태', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'detail', fileId: 'c1', summaryOpen: false } },
      { page: '-', name: '파일 상세 · 메타데이터 탭', kind: '화면', desc: 'OCR·RAG 청크·보존기한·인용 현황', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'detail', folder: 'f4', fileId: 'c1', detailTab: 'meta' } },
      { page: '-', name: '파일 상세 · 버전 탭', kind: '화면', desc: 'v3~v1 이력 · 복원', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'detail', folder: 'f4', fileId: 'c1', detailTab: 'version' } },
      { page: '-', name: '파일 상세 · 활동 탭', kind: '화면', desc: '검색 조회·색인·공유 타임라인', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'detail', folder: 'f4', fileId: 'c1', detailTab: 'activity' } },
      { page: '-', name: '파일 목록 · 상태 필터', kind: '패널', desc: '색인완료 / OCR중 / 대기 필터', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'list', folder: 'f2', listCol: true, fileStatus: 'OCR중' } },
      { page: 'p40', name: '문서 뷰어 (전체화면)', kind: '모달', desc: 'react-pdf 예정 · 문서내 챗봇 동반', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'detail', folder: 'f4', fileId: 'c1', viewer: true } },
      { page: 'p35', name: '챗봇 · 폴더 내 검색', kind: '패널', desc: '검색 요약 → 파일 클릭 시 상세', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'list', bot: true, botTab: 'chat' } },
      { page: 'p40', name: '챗봇 · 문서 내 검색', kind: '패널', desc: '페이지 인용 · 근거 하이라이트', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'detail', fileId: 'c1', bot: true, botTab: 'chat' } },
      { page: 'p36', name: '챗봇 · Task 탭', kind: '패널', desc: '챗봇 영역에서 업무 확인·생성', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'detail', bot: true, botTab: 'task' } },
      { page: 'p38', name: '폴더 추가 모달', kind: '모달', desc: '상위 폴더 · 접근 권한', state: '완료', st: { view: 'app', screen: 'store', modal: 'folder' } },
      { page: 'p41', name: '파일 업로드 모달', kind: '모달', desc: '진행률 + OCR·RAG 색인 토글', state: '완료', st: { view: 'app', screen: 'store', modal: 'upload' } },
      { page: 'p42', name: '새 파일 모달', kind: '모달', desc: '이름 + 유형(doc/hwp/md)', state: '완료', st: { view: 'app', screen: 'store', modal: 'newfile' } },
      { page: 'p43', name: '문서 작성 · 목차+에디터', kind: '화면', desc: '목차 · 본문 · AI 어시스턴트', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'editor', bot: true, botTab: 'chat' } },
      { page: 'p45', name: 'AI 답변 삽입 드롭다운', kind: '드롭다운', desc: '현재 커서/새 문단/교체/표 등 7종', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'editor', bot: true, botTab: 'chat', insertDemo: true } },
      { page: 'p44', name: '목차 편집 시트', kind: '시트', desc: '상세 편집 페이지는 클라이언트 제작', state: '부분', st: { view: 'app', screen: 'store', storeMode: 'editor', sheet: 'toc' } },
      { page: '-', name: '파일 우클릭 컨텍스트 메뉴', kind: '드롭다운', desc: '열기·뷰어·수정·요청·삭제', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'list', ctx: { x: 470, y: 260, id: 'c1' }, fileId: 'c1', folder: 'f4' } },
      { page: '-', name: '챗봇 근거 → 뷰어 페이지 점프', kind: '패널', desc: 'p.47 근거 선택 상태 · 뷰어에 구절 하이라이트', state: '완료', st: { view: 'app', screen: 'store', bot: true, botTab: 'chat', viewer: true, hitDemo: true } },
      { page: '-', name: '파일 삭제 확인 모달', kind: '모달', desc: 'RAG 색인 영향 경고', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'detail', fileId: 'c1', folder: 'f4', modal: 'delete' } },
      { page: '-', name: '파일 목록 · 정렬 전환', kind: '패널', desc: '최신순 / 이름순 / 용량순', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'list', folder: 'f2', sort: 'name' } },
      { page: '-', name: '입력 · 셀렉트 드롭다운 규칙', kind: '드롭다운', desc: '전 화면 셀렉트 = 옵션 목록 + 체크 표시 · 트리거와 동일 폭 · 하단 행은 위로 열림 (네이티브 select 미사용)', state: '완료', st: { view: 'app', modal: 'newfile', ddOpen: 'mf:newfile:1' } },
      { page: '-', name: '폴더 트리 · 검색 필터', kind: '패널', desc: '폴더명 검색으로 트리 축약', state: '완료', st: { view: 'app', screen: 'store', storeMode: 'list', folderQuery: '증빙' } },
    ],
  },
  {
    g: '협업공간 (채팅 + 업무)',
    icon: 'forum',
    items: [
      { page: 'p46', name: '채팅 기본형태 3분할', kind: '화면', desc: '룸 목록 | 대화 | 업무 존', state: '완료', st: { view: 'app', screen: 'chat', room: 'r1', zoneTab: 'task' } },
      { page: 'p47', name: '업무 존 · Task 탭', kind: '패널', desc: '룸 내 요청 목록 · 항상 열림', state: '완료', st: { view: 'app', screen: 'chat', room: 'r2', zoneTab: 'task' } },
      { page: 'p50', name: '업무 존 · 대화방 정보 탭', kind: '패널', desc: '참여자 · 공유 파일', state: '완료', st: { view: 'app', screen: 'chat', room: 'r1', zoneTab: 'info' } },
      { page: '-', name: '채팅 · 대화 내 검색', kind: '패널', desc: '파일·업무 포함 검색 + 결과 건수', state: '완료', st: { view: 'app', screen: 'chat', room: 'r1', roomSearch: true } },
      { page: '-', name: '채팅 · 고정 메시지', kind: '패널', desc: '상단 고정 메시지 펼침', state: '완료', st: { view: 'app', screen: 'chat', room: 'r1', pinnedOpen: true } },
      { page: '-', name: '채팅 · 멘션으로 담당자 지정', kind: '드롭다운', desc: '@이름 선택 시 요청 담당자 연동', state: '완료', st: { view: 'app', screen: 'chat', room: 'r1', mentionOpen: true } },
      { page: '-', name: '채팅 · 2줄 입력 + 액션 바', kind: '패널', desc: 'Enter 전송 / Shift+Enter 줄바꿈 · 첨부·업무요청·멘션', state: '완료', st: { view: 'app', screen: 'chat', room: 'r1' } },
      { page: '-', name: '채팅 · 답장 인용 입력', kind: '패널', desc: '메시지 답장 인용 바 + 취소', state: '완료', st: { view: 'app', screen: 'chat', room: 'r1', replyTo: { who: '이수진', text: '안전보건 교육 이수 내역 자료 부탁드립니다.' } } },
      { page: 'p49', name: '업무 요청 시트', kind: '시트', desc: '담당자·유형·기한·첨부', state: '완료', st: { view: 'app', screen: 'chat', sheet: 'req' } },
      { page: 'p48', name: '채팅방 초대 모달', kind: '모달', desc: '링크 만료 7/30/무제한 · 권한 3종', state: '완료', st: { view: 'app', screen: 'chat', modal: 'invite' } },
      { page: 'p54', name: '대화방 정보 모달', kind: '모달', desc: '참여자 권한 · 알림 설정', state: '완료', st: { view: 'app', screen: 'chat', modal: 'room' } },
      { page: 'p51', name: 'Task 미리보기 · 미리보기', kind: '모달', desc: '빠른 처리 3탭 중 1', state: '완료', st: { view: 'app', screen: 'chat', modal: 'quick', quickTab: 'preview', taskId: 't3' } },
      { page: 'p52', name: 'Task 미리보기 · 버전', kind: '모달', desc: '첨부 버전 이력', state: '완료', st: { view: 'app', screen: 'chat', modal: 'quick', quickTab: 'version', taskId: 't3' } },
      { page: 'p53', name: 'Task 미리보기 · 활동', kind: '모달', desc: '코멘트·상태 변경 타임라인', state: '완료', st: { view: 'app', screen: 'chat', modal: 'quick', quickTab: 'activity', taskId: 't3' } },
      { page: '-', name: '채팅 · 룸 목록 필터', kind: '패널', desc: '전체 / 안읽음 / 업무있음 + 검색', state: '완료', st: { view: 'app', screen: 'chat', room: 'r1', roomFilter: 'unread' } },
      { page: '-', name: '채팅 · 메시지 호버 액션', kind: '패널', desc: '답장 · 고정 · 이 메시지로 업무 요청', state: '완료', st: { view: 'app', screen: 'chat', room: 'r1' } },
    ],
  },
  {
    g: '업무 관리',
    icon: 'task_alt',
    items: [
      { page: 'p55', name: '업무 관리 3분할 + 스트림', kind: '화면', desc: '상태 | 목록 | 상세 | 실시간 스트림', state: '완료', st: { view: 'app', screen: 'task', taskFilter: 'all', taskId: 't1', streamOpen: true } },
      { page: 'p56', name: '리스트 클릭 · 상세 처리', kind: '화면', desc: '타임라인 · 코멘트 · 파일 첨부', state: '완료', st: { view: 'app', screen: 'task', taskFilter: 'mine', taskId: 't3', streamOpen: false } },
      { page: 'p55', name: 'Task 알림 시트', kind: '시트', desc: '헤더 Task 배지 → 슬라이드', state: '완료', st: { view: 'app', screen: 'task', sheet: 'task' } },
      { page: 'p56', name: '업무 · 워크플로 진행 표시', kind: '화면', desc: '요청됨→진행중→검토대기→완료', state: '완료', st: { view: 'app', screen: 'task', taskId: 't4' } },
      { page: '-', name: '업무 · 코멘트 프리셋', kind: '패널', desc: '빠른 문구 4종 + 저장소 문서 첨부', state: '완료', st: { view: 'app', screen: 'task', taskId: 't1' } },
      { page: '-', name: '업무 · 정렬 드롭다운', kind: '드롭다운', desc: '기한순/최신순/상태순 옵션 목록 · 기한초과 필터', state: '완료', st: { view: 'app', screen: 'task', ddOpen: 'taskSort', taskListCol: true, taskDue: 'over' } },
    ],
  },
  {
    g: '에코바디스',
    icon: 'checklist',
    items: [
      { page: 'p57', name: '요약 · 결과보기', kind: '화면', desc: '질문항 결과 + 페이징 + 요청 자료', state: '완료', st: { view: 'app', screen: 'ecoSum', ecoFilter: '전체' } },
      { page: 'p58', name: '처리부 · 문항 상세', kind: '화면', desc: 'OCR 문항 · 폴더 AI 검색 · 답변', state: '완료', st: { view: 'app', screen: 'ecoWork', qId: 'q3', ecoSearch: 'idle', qEdit: false } },
      { page: 'p58', name: '처리부 · OCR 문항 수정', kind: '화면', desc: 'OCR 오인식 직접 수정', state: '완료', st: { view: 'app', screen: 'ecoWork', qId: 'q3', qEdit: true } },
      { page: 'p58', name: '처리부 · 문항 검색·이동', kind: '패널', desc: '문항 검색 + 이전/다음 문항 이동', state: '완료', st: { view: 'app', screen: 'ecoWork', qId: 'q5', ecoQuery: 'ETH' } },
      { page: 'p58', name: '처리부 · 요구 항목 체크', kind: '화면', desc: '평가기관 요구 항목 4종 체크리스트', state: '완료', st: { view: 'app', screen: 'ecoWork', qId: 'q3' } },
      { page: 'p58', name: '처리부 · 근거 발견', kind: '화면', desc: '파일명 + 페이지 + 신뢰도', state: '완료', st: { view: 'app', screen: 'ecoWork', qId: 'q3', ecoSearch: 'hit' } },
      { page: 'p58', name: '처리부 · 근거 미발견', kind: '화면', desc: '챗봇 검색 또는 자료 요청 분기', state: '완료', st: { view: 'app', screen: 'ecoWork', qId: 'q4', ecoSearch: 'miss' } },
      { page: 'p58', name: '처리부 · 챗봇 RAG 검색', kind: '패널', desc: '파일명·페이지 제시 → 답변 채우기', state: '완료', st: { view: 'app', screen: 'ecoWork', qId: 'q3', bot: true, botTab: 'chat' } },
      { page: 'p58', name: '처리부 · 챗봇 Task 탭', kind: '패널', desc: '챗봇 영역에서 자료 요청 생성', state: '완료', st: { view: 'app', screen: 'ecoWork', qId: 'q3', bot: true, botTab: 'task' } },
      { page: '-', name: '증빙자료 매핑', kind: '화면', desc: '문항↔문서↔페이지 · 커버리지', state: '완료', st: { view: 'app', screen: 'ecoDocs', evCat: '전체', evState: '전체' } },
      { page: '-', name: '증빙자료 · 미연결 필터', kind: '화면', desc: '자료 요청으로 연결', state: '완료', st: { view: 'app', screen: 'ecoDocs', evState: '미연결' } },
      { page: 'p58', name: '증빙 팩 내보내기 모달', kind: '모달', desc: '결과를 1개 파일로 다운로드', state: '완료', st: { view: 'app', screen: 'ecoDocs', modal: 'evpack' } },
      { page: 'p59', name: '자료요청 · 요청 목록', kind: '화면', desc: '요청번호·연결문항·담당자·기한·상태 + 상세', state: '완료', st: { view: 'app', screen: 'ecoReq', rqFilter: '전체', rqSel: 'REQ-142' } },
      { page: '-', name: '자료요청 · 기한초과 필터', kind: '화면', desc: '상태 필터 + 담당자별 미제출 요약', state: '완료', st: { view: 'app', screen: 'ecoReq', rqFilter: '기한초과' } },
      { page: '-', name: '자료요청 · 제출 자료 확인', kind: '패널', desc: '제출 파일·진행 이력 → 증빙 반영', state: '완료', st: { view: 'app', screen: 'ecoReq', rqFilter: '전체', rqSel: 'REQ-134' } },
      { page: '-', name: '증빙자료 · 유효기한 임박', kind: '화면', desc: '커버리지 알림 클릭 → 만료임박 필터', state: '완료', st: { view: 'app', screen: 'ecoDocs', evState: '만료임박' } },
      { page: 'p57', name: '요약 · 상태별 필터·페이징', kind: '패널', desc: '답변완료/AI초안/미처리 + 38페이지', state: '완료', st: { view: 'app', screen: 'ecoSum', ecoFilter: 'AI 초안', ecoPage: 2 } },
      { page: '-', name: '요약 · 평가 영역별 진행', kind: '패널', desc: '환경/노동·인권/윤리/조달 진행률 · 클릭 시 필터', state: '완료', st: { view: 'app', screen: 'ecoSum', ecoArea: '지속가능한 조달', ecoQuery: '지속가능한 조달' } },
      { page: '-', name: '요약 · 병목 문항 탭', kind: '패널', desc: '증빙 없음·기한초과·검토 필요 문항', state: '완료', st: { view: 'app', screen: 'ecoSum', ecoAside: 'block' } },
      { page: '-', name: '요약 · 문항 검색', kind: '패널', desc: '문항번호·키워드 검색 + 표시 건수', state: '완료', st: { view: 'app', screen: 'ecoSum', ecoQuery: '온실가스' } },
    ],
  },
  {
    g: '대시보드 · 관리자',
    icon: 'space_dashboard',
    items: [
      { page: 'p59', name: '대시보드 4섹션 + 우측 위젯', kind: '화면', desc: 'KPI · 업무 · 파이프라인 · AI 상태', state: '완료', st: { view: 'app', screen: 'dash' } },
      { page: 'p59', name: '대시보드 · 보낸 요청 탭', kind: '화면', desc: '받은/보낸 전환 · 회신 대기 요약', state: '완료', st: { view: 'app', screen: 'dash', dashTaskTab: 'sent' } },
      { page: 'p19', name: '멤버 관리', kind: '화면', desc: '멤버 테이블 + 권한 배지', state: '완료', st: { view: 'app', screen: 'members', sysTab: 'member' } },
      { page: 'p20', name: '조직&사업부 관리', kind: '화면', desc: '조직&사업부별 프로젝트·멤버·공개범위', state: '완료', st: { view: 'app', screen: 'members', sysTab: 'ws' } },
      { page: 'p21', name: '채널 관리', kind: '화면', desc: '채널 유형·참여자·공개범위 5건', state: '완료', st: { view: 'app', screen: 'members', sysTab: 'channel' } },
      { page: '-', name: '멤버 권한 드롭다운', kind: '드롭다운', desc: '행에서 마스터/편집/댓글/보기 즉시 변경', state: '완료', st: { view: 'app', screen: 'members', sysTab: 'member', ddOpen: 'role:m2' } },
      { page: 'p22', name: '권한 그룹', kind: '화면', desc: '그룹별 인원·문서·관리 권한 4종', state: '완료', st: { view: 'app', screen: 'members', sysTab: 'perm' } },
      { page: '-', name: '대시보드 KPI → 화면 점프', kind: '패널', desc: '색인 문서·업무·답변률 카드 클릭 이동', state: '완료', st: { view: 'app', screen: 'dash' } },
      { page: '-', name: '멤버 다중 선택 · 일괄 액션', kind: '패널', desc: '체크박스 선택 시 권한 변경·내보내기', state: '완료', st: { view: 'app', screen: 'members', sysTab: 'member', memberSel: { u2: true, u4: true } } },
      { page: 'p59', name: '대시보드 · 막힌 문항 점프', kind: '패널', desc: '에코바디스 카드에서 문항·증빙 화면으로 이동', state: '완료', st: { view: 'app', screen: 'dash' } },
      { page: '-', name: '멤버 · 상태 필터', kind: '패널', desc: '활성 / 초대 대기 / 외부 협업자', state: '완료', st: { view: 'app', screen: 'members', sysTab: 'member', memberFilter: 'pending' } },
      { page: 'p10', name: '멤버 추가 모달', kind: '모달', desc: '이메일 초대 + 기본 권한', state: '완료', st: { view: 'app', screen: 'members', modal: 'member' } },
      { page: 'p12', name: '도움말 상세 4종', kind: '화면', desc: '사용가이드·도움말·약관·고객센터', state: '범위 외', st: null },
    ],
  },
]

export const IDX_ALL: IdxItem[] = IDX_GROUPS.flatMap((g) => g.items)
