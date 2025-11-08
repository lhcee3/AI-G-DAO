'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminDashboard } from '@/components/admin-dashboard';
import { Eye, EyeOff, Shield, BarChart3 } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_authenticated') === 'true';
    if (isLoggedIn) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === 'Aneesh' && password === 'dishkavdishkav') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      setError('');
    } else {
      setError('Invalid username or password');
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setUsername('');
    setPassword('');
  };

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-purple-500/20 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              Admin Dashboard
            </CardTitle>
            <p className="text-slate-400 mt-2">AI-G-DAO Analytics Portal</p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                placeholder="Enter username"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 pr-10"
                  placeholder="Enter password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">
              Restricted access - Authorized personnel only
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}