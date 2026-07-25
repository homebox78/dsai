import { useState } from 'react'
import { Icon } from '@/components/common/icon'
import { ChatbotPanel } from '@/components/common/ChatbotPanel'
import { PanelHandle } from '@/components/layout/PanelHandle'
import { fileStatusTone, filesByFolder, folders, findFile } from '@/mocks/data'
import { useAppStore } from '@/stores/app-store'
import { useLayerStore } from '@/stores/layer-store'
import { FileDetail } from './FileDetail'
import { EditorPane } from './EditorPane'

/** 문서 저장소 (p35~45) — 1영역 폴더 212px | 2영역 목록 264px | 3영역 컨텐츠 | 4영역 챗봇 330px */

const SCOPES: [string, string][] = [
  ['project', '프로젝트'],
  ['ws', '조직&사업부'],
  ['shared', '공유받음'],
]
const STATUS_FILTERS = ['전체', '색인완료', 'OCR중', '대기']
const STATUS_MAP: Record<string, string> = { 색인완료: 'RAG 색인 완료', OCR중: 'OCR 처리중', 대기: '색인 대기' }
const SORTS: [string, string][] = [
  ['recent', '최신순'],
  ['name', '이름순'],
  ['status', '상태순'],
]

export function StoreView() {
  const { folder, fileId, storeMode, botOpen, toggleBot, setFolder, openFile } = useAppStore()
  const openLayer = useLayerStore((s) => s.open)
  const [folderQuery, setFolderQuery] = useState('')
  const [fileQuery, setFileQuery] = useState('')
  const [scope, setScope] = useState('project')
  const [status, setStatus] = useState('전체')
  const [sort, setSort] = useState('recent')
  const [listOpen, setListOpen] = useState(true)

  const curFolder = folders.find((f) => f.id === folder) ?? folders[1]
  const folderFiles = filesByFolder[folder] ?? filesByFolder.f2
  const files = folderFiles
    .filter((f) => !fileQuery.trim() || f.name.includes(fileQuery.trim()) || f.summary.includes(fileQuery.trim()))
    .filter((f) => status === '전체' || f.status === STATUS_MAP[status])
  const curFile = (fileId ? findFile(fileId) : null) ?? folderFiles[0]

  return (
    <div className="flex min-h-0 min-w-[1060px] flex-1">
      {/* 1영역: 폴더 구조 */}
      <div className="flex w-[212px] flex-none flex-col border-r border-ink-200 bg-white">
        <div className="flex-none border-b border-ink-200 px-3 py-2">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">문서 저장소</span>
            <button
              onClick={() => openLayer('folder-create')}
              className="ml-auto whitespace-nowrap rounded-[5px] border border-ink-300 bg-white px-[7px] py-[3px] text-xs2 font-bold text-ink-700 hover:bg-ink-100"
            >
              + 폴더
            </button>
          </div>
          <div className="mb-[7px] flex gap-1">
            {SCOPES.map(([id, label]) => {
              const on = scope === id
              return (
                <button
                  key={id}
                  onClick={() => setScope(id)}
                  className="flex-1 whitespace-nowrap rounded-[5px] border py-1 text-tiny font-bold"
                  style={{
                    background: on ? '#1750d8' : '#fff',
                    borderColor: on ? '#1750d8' : '#cbd5e1',
                    color: on ? '#fff' : '#334155',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-[5px] border-b border-ink-200 pb-1">
            <Icon name="search" size={15} className="text-ink-400" />
            <input
              value={folderQuery}
              onChange={(e) => setFolderQuery(e.target.value)}
              placeholder="폴더명 검색"
              className="min-w-0 flex-1 border-none bg-transparent text-cap outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto py-[5px]">
          {folders
            .filter((f) => !folderQuery.trim() || f.name.includes(folderQuery.trim()))
            .map((f) => {
              const on = f.id === folder
              return (
                <button
                  key={f.id}
                  onClick={() => setFolder(f.id)}
                  className="flex w-full items-center gap-2 border-l-2 py-[7px] pr-2.5 text-left hover:bg-ink-100"
                  style={{
                    paddingLeft: 10 + f.depth * 14,
                    background: on ? '#eff6ff' : 'transparent',
                    borderLeftColor: on ? '#2563eb' : 'transparent',
                    color: on ? '#1d4ed8' : '#334155',
                  }}
                >
                  <Icon name="folder" size={17.9} className="opacity-85" />
                  <span className="min-w-0 flex-1 truncate text-label" style={{ fontWeight: on ? 700 : 500 }}>
                    {f.name}
                  </span>
                  <span className="flex-none whitespace-nowrap text-tiny text-ink-400">{f.count}</span>
                </button>
              )
            })}
        </div>

        <div className="flex-none border-t border-ink-200 px-3 py-2 text-xs2 text-ink-400">
          인덱싱 4.2GB / 20GB
          <div className="mt-[5px] h-1 overflow-hidden rounded-full bg-ink-100">
            <div className="h-full bg-brand-fade" style={{ width: '21%' }} />
          </div>
        </div>
      </div>

      {/* 2영역: 폴더내 파일 목록 */}
      {listOpen && (
        <div className="flex w-[264px] min-w-0 flex-none flex-col border-r border-ink-200 bg-white">
          <div className="flex-none border-b border-ink-200 px-3 py-2">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="min-w-0 flex-1 truncate text-label font-extrabold">{curFolder.name}</span>
              <span className="text-xs2 text-ink-400">{folderFiles.length}개</span>
            </div>
            <div className="mb-2 flex gap-1">
              <button
                onClick={() => openLayer('file-create')}
                className="flex-1 rounded-md bg-brand py-[7px] text-sm2 font-bold text-white hover:bg-brand-dark"
              >
                새 파일
              </button>
              <button
                onClick={() => openLayer('file-upload')}
                className="flex-1 rounded-md border border-ink-300 bg-white py-[7px] text-sm2 font-bold text-ink-700 hover:bg-ink-100"
              >
                파일 업로드
              </button>
            </div>
            <div className="mb-[7px] flex items-center gap-1.5 rounded-md border border-ink-300 bg-ink-50 px-2.5 py-1.5">
              <Icon name="search" size={16} className="text-ink-400" />
              <input
                value={fileQuery}
                onChange={(e) => setFileQuery(e.target.value)}
                placeholder="파일이름 · 요약 · 내용 검색"
                className="min-w-0 flex-1 border-none bg-transparent p-0 text-sm2 outline-none"
              />
            </div>
            <div className="flex gap-1">
              {STATUS_FILTERS.map((label) => {
                const on = status === label
                return (
                  <button
                    key={label}
                    onClick={() => setStatus(label)}
                    className="flex-1 whitespace-nowrap rounded-[5px] border py-[3px] text-mini font-bold"
                    style={{
                      background: on ? '#eff6ff' : '#fff',
                      borderColor: on ? '#bfdbfe' : '#cbd5e1',
                      color: on ? '#1345bd' : '#334155',
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {files.map((f) => {
              const st = fileStatusTone[f.status]
              const on = fileId === f.id
              return (
                <button
                  key={f.id}
                  onClick={() => openFile(f.id)}
                  className="block w-full border-b border-l-2 border-ink-100 px-3 py-2 text-left hover:bg-ink-50"
                  style={{ background: on ? '#eff6ff' : '#fff', borderLeftColor: on ? '#2563eb' : 'transparent' }}
                >
                  <span className="flex items-center gap-2">
                    <span className="flex size-[26px] flex-none items-center justify-center rounded-md bg-ink-100 font-mono text-[8.2px] font-extrabold text-ink-600">
                      {f.ext}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-label font-semibold">{f.name}</span>
                  </span>
                  <span className="mt-1.5 flex items-center gap-1.5 pl-[34px]">
                    <span
                      className="whitespace-nowrap rounded-full px-2 py-0.5 text-mini font-bold"
                      style={{ background: st.bg, color: st.fg }}
                    >
                      {f.status}
                    </span>
                    <span className="whitespace-nowrap text-tiny text-ink-400">
                      {f.pages}p · {f.size}
                    </span>
                    <span className="ml-auto whitespace-nowrap text-tiny text-ink-300">{f.date}</span>
                  </span>
                  {f.status === 'OCR 처리중' && (
                    <span className="mt-[7px] ml-[34px] block h-[3px] overflow-hidden rounded-full bg-ink-100">
                      <span className="block h-full rounded-full bg-warn" style={{ width: '62%' }} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
      <PanelHandle
        side="left"
        open={listOpen}
        onClick={() => setListOpen((v) => !v)}
        title={listOpen ? '파일 목록 접기' : '파일 목록 펼치기'}
      />

      {/* 3영역: 목록 / 상세 / 작성 */}
      <div className="flex min-w-[420px] flex-1 flex-col bg-ink-50">
        {storeMode === 'list' && (
          <>
            <div className="flex h-10 flex-none items-center gap-2 border-b border-ink-200 bg-white px-3.5">
              <span className="whitespace-nowrap text-tiny font-extrabold tracking-[.06em] text-ink-400">파일 목록</span>
              <div className="flex-1" />
              {SORTS.map(([id, label]) => {
                const on = sort === id
                return (
                  <button
                    key={id}
                    onClick={() => setSort(id)}
                    className="rounded-[5px] border px-[9px] py-1 text-cap font-semibold"
                    style={{
                      background: on ? '#eff6ff' : '#fff',
                      borderColor: on ? '#bfdbfe' : '#cbd5e1',
                      color: on ? '#1d4ed8' : '#334155',
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            <div className="flex-1 overflow-auto bg-white">
              <div className="overflow-x-auto">
                <div className="sticky top-0 z-[1] grid min-w-[640px] grid-cols-[minmax(200px,1fr)_78px_62px_62px_84px_92px] gap-2 border-b border-ink-200 bg-white px-[18px] py-[11px] text-xs2 font-extrabold text-ink-400">
                  <span className="truncate">파일명 · 요약</span>
                  <span className="whitespace-nowrap text-center">상태</span>
                  <span className="whitespace-nowrap text-center">페이지</span>
                  <span className="whitespace-nowrap text-center">크기</span>
                  <span className="whitespace-nowrap text-center">등록자</span>
                  <span className="whitespace-nowrap text-center">수정일</span>
                </div>
                {files.map((f) => {
                  const st = fileStatusTone[f.status]
                  return (
                    <button
                      key={f.id}
                      onClick={() => openFile(f.id)}
                      className="grid w-full min-w-[640px] grid-cols-[minmax(200px,1fr)_78px_62px_62px_84px_92px] items-center gap-2 border-b border-ink-100 bg-white px-[18px] py-[11px] text-left hover:bg-ink-50"
                    >
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="flex size-6 flex-none items-center justify-center rounded-[5px] bg-ink-100 font-mono text-[7.3px] font-extrabold text-ink-600">
                            {f.ext}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-body font-semibold">{f.name}</span>
                        </span>
                        <span className="mt-1 block truncate pl-8 text-xs2 text-ink-400">{f.summary}</span>
                      </span>
                      <span className="flex justify-center">
                        <span
                          className="whitespace-nowrap rounded-full px-2 py-0.5 text-mini font-bold"
                          style={{ background: st.bg, color: st.fg }}
                        >
                          {f.status}
                        </span>
                      </span>
                      <span className="text-center text-sm2 text-ink-500">{f.pages}p</span>
                      <span className="text-center text-sm2 text-ink-500">{f.size}</span>
                      <span className="text-center text-sm2 text-ink-500">{f.owner}</span>
                      <span className="text-center text-sm2 text-ink-500">{f.date}</span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 flex items-center justify-center gap-3 text-label text-ink-400">
                좌측 목록에서 문서를 선택하거나 새 문서를 업로드하세요.
              </div>
            </div>
          </>
        )}

        {storeMode === 'detail' && <FileDetail file={curFile} folderName={curFolder.name} />}
        {storeMode === 'editor' && <EditorPane fileName={curFile.name} />}
      </div>

      {/* 4영역: 챗봇 */}
      {botOpen && (
        <ChatbotPanel
          kind="store"
          scopeLabel={storeMode === 'detail' ? `문서: ${curFile.name}` : `폴더: ${curFolder.name}`}
          scopeDesc={
            storeMode === 'detail'
              ? '이 문서 내용에서 찾거나 요약·초안을 만듭니다'
              : '이 폴더의 문서를 대상으로 파일을 찾습니다'
          }
        />
      )}
      <PanelHandle side="right" open={botOpen} onClick={toggleBot} title={botOpen ? '챗봇 접기' : '챗봇 펼치기'} />
    </div>
  )
}
