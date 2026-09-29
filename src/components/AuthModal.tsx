import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, Sparkles, ShieldCheck, Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, authError, clearAuthError } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, displayName || 'Traveller');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-6 text-white relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-black text-xl shadow-inner">
              <Compass className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase tracking-widest font-bold bg-white/20 px-2 py-0.5 rounded-full">
                  Official MMT
                </span>
                <span className="text-xs text-rose-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" /> AI Powered
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">MMT Trip Assistant</h2>
            </div>
          </div>
          <p className="text-rose-100 text-sm mt-1 leading-relaxed">
            Sign in to unlock conversational trip planning, anti-bias recommendations, and real-time cloud itinerary syncing.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Trust Highlights */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center gap-2 text-xs font-medium text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Hard Budget Ceiling</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center gap-2 text-xs font-medium text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Anti-Popularity Bias</span>
            </div>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between">
              <span>{authError}</span>
              <button 
                onClick={clearAuthError} 
                className="text-red-500 hover:text-red-800 font-bold ml-2 text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative bg-white px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Or with email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="traveller@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Free Account' : 'Sign In & Plan Trip'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign In / Sign Up */}
          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                clearAuthError();
              }}
              className="text-xs font-medium text-rose-600 hover:text-rose-700 underline underline-offset-4 cursor-pointer"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
