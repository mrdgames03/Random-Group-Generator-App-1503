import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import NameInput from './NameInput';

const { FiUsers, FiShuffle, FiRefreshCw, FiInfo, FiCheckCircle } = FiIcons;

const GroupOrganizer = ({ names, setNames }) => {
  const [groupSize, setGroupSize] = useState(2);
  const [groups, setGroups] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  // Calculate recommendations based on number of names
  useEffect(() => {
    if (names.length < 2) {
      setRecommendations([]);
      return;
    }

    const totalNames = names.length;
    const newRecommendations = [];

    // Generate recommendations for different group sizes
    for (let size = 2; size <= Math.min(8, totalNames); size++) {
      const numGroups = Math.floor(totalNames / size);
      const remainder = totalNames % size;
      
      if (numGroups > 0) {
        let description = '';
        let score = 0;
        
        if (remainder === 0) {
          description = `${numGroups} equal groups of ${size}`;
          score = 100;
        } else {
          description = `${numGroups} groups of ${size}, ${remainder} person${remainder > 1 ? 's' : ''} left over`;
          score = Math.max(0, 100 - (remainder * 20));
        }

        // Bonus points for optimal group sizes
        if (size >= 3 && size <= 5) score += 10;
        if (size === 4) score += 5; // Sweet spot for many activities

        newRecommendations.push({
          size,
          numGroups,
          remainder,
          description,
          score,
          isOptimal: remainder === 0 && size >= 3 && size <= 5
        });
      }
    }

    // Sort by score (best first)
    newRecommendations.sort((a, b) => b.score - a.score);
    setRecommendations(newRecommendations.slice(0, 4)); // Show top 4 recommendations
  }, [names.length]);

  const generateGroups = () => {
    if (names.length < 2) return;

    setIsGenerating(true);
    
    setTimeout(() => {
      const shuffled = [...names].sort(() => Math.random() - 0.5);
      const newGroups = [];
      
      for (let i = 0; i < shuffled.length; i += groupSize) {
        newGroups.push(shuffled.slice(i, i + groupSize));
      }
      
      setGroups(newGroups);
      setIsGenerating(false);
    }, 1000);
  };

  const resetGroups = () => {
    setGroups([]);
  };

  const selectRecommendation = (recommendedSize) => {
    setGroupSize(recommendedSize);
    setGroups([]); // Clear existing groups when changing size
  };

  const getAdviceText = () => {
    const totalNames = names.length;
    
    if (totalNames < 6) {
      return "For small groups, 2-3 people work well for close collaboration.";
    } else if (totalNames < 12) {
      return "Medium groups benefit from 3-4 people for balanced participation.";
    } else if (totalNames < 20) {
      return "For larger groups, 4-5 people per group allows good discussion while staying manageable.";
    } else {
      return "With many participants, 4-6 people per group ensures everyone can contribute effectively.";
    }
  };

  const groupColors = [
    'from-red-400 to-pink-400',
    'from-blue-400 to-purple-400',
    'from-green-400 to-teal-400',
    'from-yellow-400 to-orange-400',
    'from-indigo-400 to-blue-400',
    'from-purple-400 to-pink-400',
    'from-teal-400 to-green-400',
    'from-orange-400 to-red-400'
  ];

  return (
    <div className="space-y-6">
      <NameInput names={names} setNames={setNames} />
      
      {names.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-6"
        >
          <div className="space-y-6">
            {/* Analysis Section */}
            <div className="bg-white/10 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <SafeIcon icon={FiInfo} className="w-5 h-5 text-blue-300" />
                <h3 className="text-white font-semibold">Smart Analysis</h3>
              </div>
              
              <div className="space-y-3">
                <div className="text-white/90 text-sm">
                  <strong>{names.length} people</strong> to organize
                </div>
                
                <div className="text-white/80 text-sm leading-relaxed">
                  {getAdviceText()}
                </div>

                {recommendations.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-white/90 text-sm font-medium">
                      Recommended group sizes:
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {recommendations.map((rec, index) => (
                        <motion.button
                          key={rec.size}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => selectRecommendation(rec.size)}
                          className={`text-left p-3 rounded-xl transition-all duration-300 ${
                            groupSize === rec.size
                              ? 'bg-white/20 ring-2 ring-white/30'
                              : 'bg-white/10 hover:bg-white/15'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {rec.isOptimal && (
                                <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-green-400" />
                              )}
                              <span className="text-white font-medium">
                                Groups of {rec.size}
                              </span>
                            </div>
                            <div className="text-white/60 text-xs">
                              Score: {rec.score}%
                            </div>
                          </div>
                          <div className="text-white/70 text-sm mt-1">
                            {rec.description}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Group Size Selector */}
            <div>
              <label className="block text-white font-medium mb-2">
                Group Size: {groupSize}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="2"
                  max={Math.max(2, Math.min(8, names.length))}
                  value={groupSize}
                  onChange={(e) => setGroupSize(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white font-bold text-lg w-8 text-center">
                  {groupSize}
                </span>
              </div>
              
              {/* Preview of groups */}
              <div className="mt-2 text-white/70 text-sm">
                Will create {Math.floor(names.length / groupSize)} groups
                {names.length % groupSize > 0 && (
                  <span className="text-yellow-300">
                    {' '}with {names.length % groupSize} person{names.length % groupSize > 1 ? 's' : ''} left over
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateGroups}
                disabled={names.length < 2 || isGenerating}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  names.length < 2 || isGenerating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-white text-purple-600 hover:bg-purple-50'
                }`}
              >
                <SafeIcon 
                  icon={isGenerating ? FiRefreshCw : FiShuffle} 
                  className={`w-5 h-5 mr-2 ${isGenerating ? 'animate-spin' : ''}`}
                />
                {isGenerating ? 'Generating...' : 'Generate Groups'}
              </motion.button>

              {groups.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGroups}
                  className="px-4 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors"
                >
                  <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
                </motion.button>
              )}
            </div>

            {names.length < 2 && (
              <p className="text-white/70 text-center">
                Add at least 2 names to organize groups
              </p>
            )}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {groups.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center space-x-2 text-white">
              <SafeIcon icon={FiUsers} className="w-5 h-5" />
              <span className="font-medium">Generated Groups</span>
            </div>
            
            <div className="grid gap-4">
              {groups.map((group, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-r ${groupColors[index % groupColors.length]} rounded-2xl p-4`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold text-lg">
                      Group {index + 1}
                    </h3>
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                      {group.length} members
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.map((name, nameIndex) => (
                      <motion.div
                        key={nameIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.1) + (nameIndex * 0.05) }}
                        className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-lg"
                      >
                        {name}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupOrganizer;