import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Community from './components/Community';
import Trackers from './pages/Trackers';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import { PostsProvider } from './context/PostsContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Component to handle authenticated routes
const AuthenticatedApp = () => {
  return (
    <PostsProvider>
      <div className="min-h-screen bg-background pb-16">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post/:id"
            element={
              <ProtectedRoute>
                <PostDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trackers"
            element={
              <ProtectedRoute>
                <Trackers />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ProtectedRoute>
          <BottomNav />
        </ProtectedRoute>
      </div>
    </PostsProvider>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </Router>
  );
}

export default App;
