'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Info } from 'lucide-react';

export function WarningBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="alert-warning mb-6 relative"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold mb-1">
              Important Disclaimer
            </div>
            <p className="text-sm leading-relaxed">
              Shmoo points are <strong>non-transferrable</strong> and have <strong>no intrinsic monetary value</strong>.
            </p>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-red-300/50"
                >
                  <div className="text-sm space-y-2">
                    <p>
                      • Points are generated for <strong>demonstration purposes only</strong>
                    </p>
                    <p>
                      • Each click may incur a small network fee (0.001 ETH)
                    </p>
                    <p>
                      • Points cannot be sold, traded, or exchanged for value
                    </p>
                    <p>
                      • This is an experimental application on Base network
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-sm underline hover:no-underline flex items-center gap-1"
            >
              <Info className="w-3 h-3" />
              {isExpanded ? 'Show Less' : 'Learn More'}
            </button>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-red-600 rounded transition-colors flex-shrink-0"
            title="Dismiss warning"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
