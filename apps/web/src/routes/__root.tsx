import { createRootRoute, Link, Outlet, useRouter } from '@tanstack/react-router'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user && router.state.location.pathname !== '/auth/login') {
      router.navigate({ to: '/auth/login', replace: true })
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  // If not authenticated and not on login page, show nothing (redirect will happen)
  if (!user && router.state.location.pathname !== '/auth/login') {
    return null
  }

  // If not authenticated but on login page, show the login page
  if (!user) {
    return <Outlet />
  }

  const handleLogout = () => {
    logout()
    router.navigate({ to: '/auth/login', replace: true })
  }

  return (
    <div>
      <nav className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-primary">Spotilyze</h1>
            <div className="flex space-x-6">
              <Link 
                to="/upload" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Upload
              </Link>
              <Link 
                to="/stats" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Statistics
              </Link>
              <Link 
                to="/settings" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Settings
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground text-sm">
              Welcome, {user.username}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>
      
      <main key={user?.id || 'logged-out'}>
        <Outlet />
      </main>
    </div>
  )
}