import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { pipelineApi, projectStore, StoredProject } from '../api/pipeline'
import { confirmToast } from '../utils/confirmToast'
import { FEATURES } from '../data/features'

const STATUS_COLOR: Record<string, string> = {
  running: '#f59e0b', completed: '#10b981', failed: '#ef4444', wait_user: 'var(--lf-gold)',
}

const STUDIO_TILES: { slug: string, label: string, tint: string }[] = [
  { slug: 'patent-search', label: '특허 검색', tint: 'var(--lf-bg3)' },
  { slug: 'prior-art', label: 'AI 선행기술조사', tint: '#f3e0d2' },
  { slug: 'claim-drafting', label: '청구항 작성', tint: 'var(--lf-bg2)' },
  { slug: 'examiner', label: '명확성 심사', tint: '#f6e9da' },
  { slug: 'drawing', label: '도면 생성', tint: 'var(--lf-bg3)' },
  { slug: 'specification', label: '명세서 작성', tint: '#f3e0d2' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<StoredProject[]>([])
  const [deleteMode, setDeleteMode] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [idea, setIdea] = useState('')

  useEffect(() => { setProjects(projectStore.list()) }, [])

  useEffect(() => {
    const running = projects.filter(p => p.status === 'running')
    if (running.length === 0) return
    const timers = running.map(p =>
      setInterval(async () => {
        try {
          const run = await pipelineApi.getRun(p.run_id)
          if (run.status !== 'running') {
            projectStore.updateStatus(p.run_id, run.status)
            setProjects(projectStore.list())
          }
        } catch { /* ignore */ }
      }, 5000)
    )
    return () => timers.forEach(clearInterval)
  }, [projects])

  function toggleSelect(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  async function handleDeleteSelected() {
    if (!(await confirmToast(`선택한 ${selected.size}개 프로젝트를 삭제하시겠습니까?`))) return
    selected.forEach(id => projectStore.remove(id))
    setProjects(projectStore.list()); setDeleteMode(false); setSelected(new Set())
  }
  async function handleDeleteOne(id: string) {
    if (!(await confirmToast('이 프로젝트를 삭제하시겠습니까?'))) return
    projectStore.remove(id); setProjects(projectStore.list())
  }
  function handleStartIdea(e: FormEvent) {
    e.preventDefault()
    navigate('/create')
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 70px)', marginTop: 70, background: 'var(--lf-bg)' }}>

      {/* Left: 소스 (프로젝트 목록) */}
      <aside style={{ width: 280, flexShrink: 0, borderRight: '1px solid var(--lf-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--lf-border)' }}>
          <Link to="/create" className="btn-fill" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>+ 새 프로젝트</Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px 8px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--lf-mid)' }}>프로젝트 {projects.length}개</span>
          {projects.length > 0 && (
            !deleteMode ? (
              <button onClick={() => setDeleteMode(true)} style={{ fontSize: 11, color: 'var(--lf-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>선택 삭제</button>
            ) : (
              <button onClick={() => { setDeleteMode(false); setSelected(new Set()) }} style={{ fontSize: 11, color: 'var(--lf-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>취소</button>
            )
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 16px' }}>
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--lf-muted)' }}>
              <p style={{ fontSize: 12.5, marginBottom: 6 }}>저장된 프로젝트가 여기에 표시됩니다</p>
              <p style={{ fontSize: 11, lineHeight: 1.7 }}>위의 + 새 프로젝트를 눌러 발명 내용을 입력하면 AI 에이전트가 분석을 시작합니다.</p>
            </div>
          ) : (
            projects.map(project => (
              <div key={project.run_id} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderRadius: 10,
                cursor: 'pointer',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--lf-bg2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                {deleteMode && (
                  <input type="checkbox" style={{ accentColor: 'var(--lf-gold)', width: 14, height: 14, flexShrink: 0 }}
                    checked={selected.has(project.run_id)} onChange={() => toggleSelect(project.run_id)} />
                )}
                <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: STATUS_COLOR[project.status] ?? 'var(--lf-muted)' }} />
                <Link to={`/workstation/${project.run_id}`} style={{ flex: 1, minWidth: 0, fontSize: 13, color: 'var(--lf-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {project.title}
                </Link>
                {!deleteMode && (
                  <button onClick={() => handleDeleteOne(project.run_id)} style={{ flexShrink: 0, fontSize: 13, color: 'var(--lf-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                )}
              </div>
            ))
          )}
        </div>

        {deleteMode && selected.size > 0 && (
          <div style={{ padding: 16, borderTop: '1px solid var(--lf-border)' }}>
            <button onClick={handleDeleteSelected} className="btn-danger" style={{ width: '100%', justifyContent: 'center' }}>삭제 ({selected.size}개)</button>
          </div>
        )}
      </aside>

      {/* Center: 대시보드 */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ padding: '24px 40px', borderBottom: '1px solid var(--lf-border)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{
            width: 36, height: 36, borderRadius: 10, background: 'var(--lf-gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14,
          }}>P</span>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--lf-navy)' }}>내 특허 프로젝트</h1>
            <p style={{ fontSize: 11.5, color: 'var(--lf-muted)' }}>프로젝트 {projects.length}개 · {new Date().toLocaleDateString('ko-KR')}</p>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'var(--lf-mid)', marginBottom: 24 }}>아직 진행 중인 프로젝트가 없습니다.</p>
              <Link to="/create" className="btn-fill">첫 번째 특허 프로젝트 시작하기 →</Link>
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: 640 }}>
              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--lf-mid)', marginBottom: 20 }}>
                왼쪽에서 프로젝트를 선택해 이어서 작업하거나, 새 발명을 등록하세요.
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleStartIdea} style={{ padding: '20px 40px 28px', borderTop: '1px solid var(--lf-border)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, background: 'var(--lf-bg2)',
            borderRadius: 999, padding: '6px 8px 6px 20px',
          }}>
            <input
              value={idea}
              onChange={e => setIdea(e.target.value)}
              placeholder="어떤 발명을 출원하고 싶으신가요? 입력하고 시작하세요..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13.5, color: 'var(--lf-navy)', fontFamily: 'var(--lf-sans)' }}
            />
            <button type="submit" style={{
              width: 34, height: 34, borderRadius: '50%', background: 'var(--lf-dark)', color: '#fff',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </div>
        </form>
      </main>

      {/* Right: 스튜디오 */}
      <aside style={{ width: 320, flexShrink: 0, borderLeft: '1px solid var(--lf-border)', padding: '20px', overflowY: 'auto' }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--lf-navy)', marginBottom: 16 }}>스튜디오</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
          {STUDIO_TILES.map(tile => {
            const feature = FEATURES.find(f => f.slug === tile.slug)
            return (
              <Link key={tile.slug} to={`/features/${tile.slug}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                background: tile.tint, borderRadius: 12, padding: '14px 14px', minHeight: 56,
              }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--lf-navy)' }}>{feature?.name ?? tile.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--lf-mid)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6" /></svg>
              </Link>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--lf-muted)' }}>
          <p style={{ fontSize: 12.5, marginBottom: 8 }}>완료된 프로젝트 결과물이 여기에 표시됩니다</p>
          <p style={{ fontSize: 11, lineHeight: 1.7 }}>프로젝트를 생성하면 청구항·도면·명세서 진행 상태를 확인할 수 있습니다.</p>
        </div>
      </aside>
    </div>
  )
}
