import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main1 from './components/Main1';
import Garage from './components/Garage';
import Login from './components/Login/Login';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Main1 />} />
        <Route path="/garage/*" element={<Garage />} />

      </Routes>
    </div>
  );
}

export default App;
