import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiRotateCw, FiUsers } = FiIcons;

const Navigation = () => {
  const location = useLocation();

  const tabs = [
    { path: '/', label: 'Spin Wheel', icon: FiRotateCw },
    { path: '/groups', label: 'Groups', icon: FiUsers }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white/20 backdrop-blur-lg rounded-2xl p-1 mb-6"
    >
      <div className="flex">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex-1 relative overflow-hidden rounded-xl transition-all duration-300 ${
              location.pathname === tab.path
                ? 'bg-white text-purple-600 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-center py-3 px-4">
              <SafeIcon icon={tab.icon} className="w-5 h-5 mr-2" />
              <span className="font-medium text-sm">{tab.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default Navigation;