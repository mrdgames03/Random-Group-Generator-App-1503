import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './components/Navigation';
import SpinWheel from './components/SpinWheel';
import GroupOrganizer from './components/GroupOrganizer';
import './App.css';

function App() {
  const [names, setNames] = useState([]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500">
        <div className="container mx-auto px-4 py-6 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Name Picker</h1>
            <p className="text-purple-100">Spin the wheel or organize groups</p>
          </motion.div>

          <Navigation />
          
          <Routes>
            <Route 
              path="/" 
              element={<SpinWheel names={names} setNames={setNames} />} 
            />
            <Route 
              path="/groups" 
              element={<GroupOrganizer names={names} setNames={setNames} />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;