import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import DynamicBackground from './components/DynamicBackground.js';
import SearchParfums from './components/SearchParfums.js';
import './App.css';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DynamicBackground />} />
          <Route path="/search" element={<SearchParfums />} /> {/* Ajoutez la nouvelle route ici */}
        </Routes>
        <Analytics />
      </div>
    </Router>
  );
}

export default App;