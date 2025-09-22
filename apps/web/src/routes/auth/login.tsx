import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/contexts/AuthContext'

export const Route = createFileRoute('/auth/login')({
  component: LoginComponent,
})

function LoginComponent() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const success = isLogin 
      ? await login(username, password)
      : await register(username, email, password)

    if (success) {
      navigate({ to: '/stats' })
    } else {
      setError(isLogin ? 'Invalid credentials' : 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - App Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-card p-12 flex-col justify-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold text-primary mb-6">
            Spotilyze
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transform your Spotify streaming history into meaningful insights about your music taste.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary text-xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold">Deep Analytics</h3>
                <p className="text-muted-foreground text-sm">Analyze your complete listening history with advanced statistics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary text-xl">🎵</span>
              </div>
              <div>
                <h3 className="font-semibold">Music Discovery</h3>
                <p className="text-muted-foreground text-sm">Discover patterns in your music taste over time</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary text-xl">📈</span>
              </div>
              <div>
                <h3 className="font-semibold">Visual Charts</h3>
                <p className="text-muted-foreground text-sm">Beautiful charts showing your listening habits and trends</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <p className="text-muted-foreground">
              {isLogin ? 'Sign in to view your music analytics' : 'Join Spotilyze to start analyzing your music'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              {!isLogin && (
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}