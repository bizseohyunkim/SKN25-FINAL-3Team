import toast from 'react-hot-toast'

export function confirmToast(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    toast.custom(
      (t) => (
        <div
          style={{
            background: '#fff',
            border: '1px solid var(--lf-border)',
            borderRadius: 8,
            boxShadow: '0 8px 28px rgba(0,0,0,.15)',
            padding: '18px 20px',
            maxWidth: 360,
            opacity: t.visible ? 1 : 0,
            transform: t.visible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity .2s, transform .2s',
          }}
        >
          <div style={{ fontSize: 14, color: 'var(--lf-navy)', whiteSpace: 'pre-wrap', marginBottom: 16, lineHeight: 1.5 }}>
            {message}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button
              onClick={() => {
                toast.dismiss(t.id)
                resolve(false)
              }}
              style={{
                padding: '6px 16px', fontSize: 13, borderRadius: 6,
                border: '1px solid var(--lf-border)', background: '#fff',
                color: 'var(--lf-mid)', cursor: 'pointer',
              }}
            >취소</button>
            <button
              onClick={() => {
                toast.dismiss(t.id)
                resolve(true)
              }}
              style={{
                padding: '6px 16px', fontSize: 13, borderRadius: 6,
                border: 'none', background: 'var(--lf-dark)',
                color: '#fff', cursor: 'pointer', fontWeight: 600,
              }}
            >확인</button>
          </div>
        </div>
      ),
      { duration: Infinity }
    )
  })
}
