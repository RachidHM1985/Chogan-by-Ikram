import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import DynamicBackground from './components/DynamicBackground';
import './App.css';

function App() {
  return (
    <div className="App">
      <DynamicBackground />
      {/* Autres composants */}
      <Analytics />
    </div>
  );
}

export default App;