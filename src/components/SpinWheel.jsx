import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import NameInput from './NameInput';
import WheelCanvas from './WheelCanvas';

const { FiPlay, FiRefreshCw, FiTrophy } = FiIcons;

const SpinWheel = ({ names, setNames }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef(null);

  const spinWheel = () => {
    if (names.length < 2 || isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    const spinAmount = Math.random() * 360 + 1440; // 4+ full rotations
    const newRotation = rotation + spinAmount;
    setRotation(newRotation);

    // Calculate winner based on final position
    setTimeout(() => {
      const normalizedRotation = (360 - (newRotation % 360)) % 360;
      const sectionAngle = 360 / names.length;
      const winnerIndex = Math.floor(normalizedRotation / sectionAngle);
      
      setWinner(names[winnerIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  const resetWheel = () => {
    setRotation(0);
    setWinner(null);
    setIsSpinning(false);
  };

  return (
    <div className="space-y-6">
      <NameInput names={names} setNames={setNames} />
      
      {names.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-6"
        >
          <div className="relative">
            <WheelCanvas
              ref={wheelRef}
              names={names}
              rotation={rotation}
              isSpinning={isSpinning}
            />
            
            {/* Center button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={spinWheel}
                disabled={names.length < 2 || isSpinning}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  names.length < 2 || isSpinning
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-white text-purple-600 hover:bg-purple-50'
                }`}
              >
                <SafeIcon 
                  icon={isSpinning ? FiRefreshCw : FiPlay} 
                  className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`}
                />
              </motion.button>
            </div>
          </div>

          {names.length < 2 && (
            <p className="text-white/70 text-center mt-4">
              Add at least 2 names to spin the wheel
            </p>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-center"
          >
            <SafeIcon icon={FiTrophy} className="w-12 h-12 mx-auto mb-3 text-white" />
            <h3 className="text-xl font-bold text-white mb-2">Winner!</h3>
            <p className="text-2xl font-bold text-white">{winner}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetWheel}
              className="mt-4 bg-white/20 backdrop-blur-lg text-white px-6 py-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              Spin Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpinWheel;