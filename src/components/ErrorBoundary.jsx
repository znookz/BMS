import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100vh', gap: 12,
          fontFamily: 'var(--font-sans)', color: 'var(--text)',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'var(--danger-50)', color: 'var(--danger)',
            display: 'grid', placeItems: 'center', fontSize: 28,
          }}>!</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-strong)' }}>
            เกิดข้อผิดพลาดที่ไม่คาดคิด
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 400, textAlign: 'center' }}>
            {this.state.error.message}
          </div>
          <button
            style={{
              marginTop: 8, padding: '8px 20px', borderRadius: 8,
              background: 'var(--navy-700)', color: '#fff',
              border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            }}
            onClick={() => window.location.reload()}
          >
            โหลดหน้าใหม่
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
