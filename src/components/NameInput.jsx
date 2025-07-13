import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import FileUpload from './FileUpload';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiX, FiUser } = FiIcons;

const NameInput = ({ names, setNames }) => {
  const [inputValue, setInputValue] = useState('');

  const addName = () => {
    const trimmedName = inputValue.trim();
    if (trimmedName && !names.includes(trimmedName)) {
      setNames([...names, trimmedName]);
      setInputValue('');
    }
  };

  const removeName = (nameToRemove) => {
    setNames(names.filter(name => name !== nameToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addName();
    }
  };

  const handleNamesImported = (importedNames) => {
    // Merge imported names with existing names, removing duplicates
    const mergedNames = [...new Set([...names, ...importedNames])];
    setNames(mergedNames);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-3xl p-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <SafeIcon icon={FiUser} className="w-5 h-5 text-white" />
        <h2 className="text-white font-semibold text-lg">Add Names</h2>
      </div>

      <FileUpload onNamesImported={handleNamesImported} />

      <div className="flex items-center space-x-2 text-white/70 text-sm mb-4">
        <span>or</span>
        <div className="flex-1 border-t border-white/10"></div>
      </div>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a name..."
          className="flex-1 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 px-4 py-3 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addName}
          disabled={!inputValue.trim() || names.includes(inputValue.trim())}
          className={`px-4 py-3 rounded-xl transition-all duration-300 ${
            !inputValue.trim() || names.includes(inputValue.trim())
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-white text-purple-600 hover:bg-purple-50'
          }`}
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
        </motion.button>
      </div>

      <AnimatePresence>
        {names.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-white/80 text-sm mb-2">
              <span>Names ({names.length})</span>
              {names.length > 0 && (
                <button
                  onClick={() => setNames([])}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {names.map((name, index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg"
                >
                  <span>{name}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeName(name)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NameInput;