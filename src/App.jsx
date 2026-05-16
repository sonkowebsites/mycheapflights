import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import './styles/globals.css';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Guide = lazy(() => import('./pages/Guide'));
const Deals = lazy(() => import('./pages/Deals'));

// Loading fallback
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '16px',
      flexDirection: 'column',
    }}>
      <div style={{ fontSize: '3rem', animation: 'float 2s ease-in-out infinite' }}>✈️</div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
        Loading...
      </p>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />

          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/login" element={<AuthPage mode="login" />} />
              <Route path="/register" element={<AuthPage mode="register" />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/deals" element={<Deals />} />

              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>

          {/* AI Chatbot - appears on all pages */}
          <ChatBot />

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            gutter={12}
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: 'var(--shadow-elevated)',
              },
              success: {
                iconTheme: { primary: 'var(--accent-green)', secondary: 'white' },
              },
              error: {
                iconTheme: { primary: 'var(--accent-coral)', secondary: 'white' },
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
