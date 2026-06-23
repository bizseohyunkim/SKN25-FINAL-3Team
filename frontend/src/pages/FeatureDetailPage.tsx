import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FEATURES } from '../data/features'
import Reveal from '../components/Reveal'

export default function FeatureDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const feature = FEATURES.find(f => f.slug === slug)

  if (!feature) {
    return (
      <div className="page-wrap" style={{ textAlign: 'center', paddingTop: 160 }}>
        <p style={{ color: 'var(--lf-mid)', marginBottom: 24 }}>존재하지 않는 기능입니다.</p>
        <Link to="/" className="btn-line">홈으로 돌아가기</Link>
      </div>
    )
  }

  const others = FEATURES.filter(f => f.slug !== feature.slug)

  return (
    <div style={{ paddingTop: 70 }}>
      {/* Dark hero band */}
      <section style={{
        position: 'relative', overflow: 'hidden', background: 'var(--lf-dark)',
        padding: '120px 0 130px', textAlign: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <Reveal variant="scale">
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: 3,
              textTransform: 'uppercase', color: 'var(--lf-gold-lt)', marginBottom: 18,
            }}>Feature</span>
            <h1 style={{ fontSize: 'clamp(32px,4.2vw,50px)', color: '#fff', margin: '0 0 18px' }}>
              <span className="text-gradient-light">{feature.name}</span>
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.75)', maxWidth: 620, margin: '0 auto', lineHeight: 1.85 }}>
              {feature.tagline}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Description + quote */}
      <section style={{ padding: '100px 0', borderBottom: '1px solid var(--lf-border)' }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <Reveal>
            <p style={{ fontSize: 15.5, lineHeight: 2.05, color: 'var(--lf-body)' }}>{feature.description}</p>
            {feature.quote && (
              <div style={{
                marginTop: 32, padding: '24px 28px', background: 'var(--lf-bg2)',
                borderLeft: '3px solid var(--lf-gold)', fontStyle: 'italic',
                fontSize: 14, color: 'var(--lf-mid)', lineHeight: 1.85,
              }}>
                {feature.quote}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* Pipeline steps */}
      <section style={{ padding: '100px 0', background: 'var(--lf-bg2)', borderBottom: '1px solid var(--lf-border)' }}>
        <div className="container">
          <Reveal>
            <span className="label" style={{ marginBottom: 18 }}>How it works</span>
            <h2 style={{ fontSize: 'clamp(24px,2.6vw,34px)', color: 'var(--lf-navy)', marginBottom: 44 }}>
              동작 파이프라인
            </h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--lf-border)', border: '1px solid var(--lf-border)' }}>
            {feature.steps.map((step, i) => (
              <Reveal key={i} delay={i * 70} style={{
                display: 'grid', gridTemplateColumns: '64px 1fr', gap: 24,
                background: 'var(--lf-bg)', padding: '26px 32px',
              }}>
                <span style={{
                  fontFamily: 'Courier New, monospace', fontSize: 13, fontWeight: 700,
                  color: 'var(--lf-gold)',
                }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--lf-navy)', marginBottom: 6 }}>{step.title}</div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.9, color: 'var(--lf-mid)' }}>{step.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Spec pills */}
      <section style={{ padding: '100px 0', borderBottom: '1px solid var(--lf-border)' }}>
        <div className="container">
          <Reveal>
            <span className="label" style={{ marginBottom: 18 }}>Tech spec</span>
            <h2 style={{ fontSize: 'clamp(24px,2.6vw,34px)', color: 'var(--lf-navy)', marginBottom: 36 }}>
              기술 스펙
            </h2>
          </Reveal>
          <Reveal style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {feature.specs.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                border: '1px solid var(--lf-border)', borderRadius: 999, padding: '9px 18px',
                fontSize: 12.5, background: 'var(--lf-bg)',
              }}>
                <span style={{ color: 'var(--lf-gold)', fontWeight: 700 }}>#{s.label}</span>
                <span style={{ color: 'var(--lf-mid)' }}>{s.value}</span>
              </div>
            ))}
          </Reveal>

          <p style={{ marginTop: 36, fontSize: 11, color: 'var(--lf-muted)', fontFamily: 'Courier New, monospace' }}>
            source: {feature.sourceFiles.join(' · ')}
          </p>

          <div style={{ marginTop: 44, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {user ? (
              <Link to="/dashboard" className="btn-fill">대시보드로 이동 →</Link>
            ) : (
              <Link to="/signup" className="btn-fill">명세서 작성하기 →</Link>
            )}
            <Link to="/" className="btn-line">홈으로</Link>
          </div>
        </div>
      </section>

      {/* Other features */}
      <section style={{ padding: '90px 0', background: 'var(--lf-bg2)' }}>
        <div className="container">
          <Reveal>
            <span className="label" style={{ marginBottom: 18 }}>다른 기능 보기</span>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 1, background: 'var(--lf-border)', border: '1px solid var(--lf-border)' }}>
            {others.map((f, i) => (
              <Reveal key={f.slug} delay={i * 60} style={{ background: 'var(--lf-bg)' }}>
                <Link to={`/features/${f.slug}`} style={{
                  display: 'block', padding: '20px 22px', textDecoration: 'none',
                }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--lf-navy)', marginBottom: 5 }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--lf-mid)', lineHeight: 1.6 }}>{f.tagline}</div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
