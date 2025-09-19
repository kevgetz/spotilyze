import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>🎵 Spotilyze</h1>
        <div style={{ marginTop: '0.5rem' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
          <Link to="/upload">Upload</Link>
        </div>
      </nav>
      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  )
}