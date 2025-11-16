import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Community from './components/Community';
import Trackers from './pages/Trackers';
import PostDetail from './pages/PostDetail';
import BottomNav from './components/BottomNav';
import { PostsProvider } from './context/PostsContext';
import './App.css';

// Initial posts data - in a real app, this would come from an API
const initialPosts = [
  {
    id: "1",
    title: "Welcome to Hello Mom Community!",
    content: "This is a safe space for all mothers to share experiences, ask questions, and support each other.",
    author: "Admin",
    category: "All",
    votes: 5,
    bookmarked: false,
    comments: [],
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "First Trimester Tips",
    content: "What helped you the most during your first trimester? Share your experiences!",
    author: "Sarah",
    category: "Pregnancy",
    flair: "Advice",
    votes: 12,
    bookmarked: true,
    comments: [
      {
        id: "c1",
        content: "Ginger tea really helped with my morning sickness!",
        author: "Emma",
        postId: "2",
        createdAt: new Date(),
        replies: [
          {
            id: "r1",
            content: "I'll definitely try that! Thanks for the tip!",
            author: "You",
            postId: "2",
            parentId: "c1",
            createdAt: new Date(),
          },
        ],
      },
    ],
    createdAt: new Date(Date.now() - 86400000),
  },
];

function App() {
  return (
    <Router>
      <PostsProvider initialPosts={initialPosts}>
        <div className="min-h-screen bg-background pb-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/community" element={<Community />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/trackers" element={<Trackers />} />
          </Routes>
          <BottomNav />
        </div>
      </PostsProvider>
    </Router>
  );
}

export default App;
