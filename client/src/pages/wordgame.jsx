import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Timer, Trophy, RotateCcw, Flag, Zap, Heart, ArrowLeft } from 'lucide-react';

const sampleParagraphs = [
  "The development of modern programming languages has revolutionized the way we build software. From simple scripts to complex applications, code has become the foundation of our digital world.",
  "Cloud computing has transformed the technology landscape, enabling scalable solutions and remote collaboration. Developers can now deploy applications with unprecedented ease and flexibility.",
  "Artificial intelligence continues to push the boundaries of what's possible in software development. Machine learning algorithms are becoming increasingly sophisticated, opening new frontiers.",
];

const TypingRace = () => {
    const [currentText, setCurrentText] = useState('');
    const [upcomingText, setUpcomingText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [stats, setStats] = useState({
      wpm: 0,
      accuracy: 100,
      correctChars: 0,
      totalChars: 0,
      errors: 0,
      combo: 0,
      maxCombo: 0,
      lives: 3
    });
    const [completedText, setCompletedText] = useState('');
    const [currentErrors, setCurrentErrors] = useState([]);
    const inputRef = useRef(null);
    const [showResults, setShowResults] = useState(false);
    const [showComboAlert, setShowComboAlert] = useState(false);
    const navigate = useNavigate();

    const initializeGame = () => {
      const initialParagraphs = sampleParagraphs.join(' ');
      setCurrentText(initialParagraphs.slice(0, 100));
      setUpcomingText(initialParagraphs.slice(100));
      setUserInput('');
      setCompletedText('');
      setTimeLeft(60);
      setCurrentErrors([]);
      setStats({
        wpm: 0,
        accuracy: 100,
        correctChars: 0,
        totalChars: 0,
        errors: 0,
        combo: 0,
        maxCombo: 0,
        lives: 3
      });
      setShowResults(false);
    };
  
    const startGame = () => {
      initializeGame();
      setIsPlaying(true);
      inputRef.current?.focus();
    };
  
    useEffect(() => {
      let timer;
      if (isPlaying && timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              setIsPlaying(false);
              setShowResults(true);
            }
            return prev - 1;
          });
          
          setStats(prev => ({
            ...prev,
            wpm: Math.round((prev.correctChars / 5) * (60 / (60 - timeLeft)))
          }));
        }, 1000);
      }
      return () => clearInterval(timer);
    }, [isPlaying, timeLeft]);
  
    useEffect(() => {
      if (showComboAlert) {
        const timer = setTimeout(() => setShowComboAlert(false), 1000);
        return () => clearTimeout(timer);
      }
    }, [showComboAlert]);
  
    const handleInput = (e) => {
      if (!isPlaying) return;
      
      const value = e.target.value;
      setUserInput(value);
  
      // Track errors for each character
      const newErrors = [];
      let correct = 0;
      let currentCombo = stats.combo;
  
      for (let i = 0; i < value.length; i++) {
        if (value[i] === currentText[i]) {
          correct++;
          currentCombo++;
          if (currentCombo > stats.maxCombo) {
            setStats(prev => ({ ...prev, maxCombo: currentCombo }));
          }
          if (currentCombo % 10 === 0 && currentCombo > 0) {
            setShowComboAlert(true);
          }
        } else {
          newErrors.push(i);
          currentCombo = 0;
          if (stats.lives > 0) {
            setStats(prev => ({ 
              ...prev, 
              lives: prev.lives - 0.1,
              errors: prev.errors + 1 
            }));
          }
        }
      }
  
      setCurrentErrors(newErrors);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        correctChars: prev.correctChars + (value.length > userInput.length ? 1 : 0),
        totalChars: prev.totalChars + (value.length > userInput.length ? 1 : 0),
        accuracy: Math.round((correct / value.length) * 100) || 100,
        combo: currentCombo
      }));
  
      // Check if current chunk is completed
      if (value.length >= currentText.length) {
        setCompletedText(prev => prev + currentText);
        setCurrentText(upcomingText.slice(0, 100));
        setUpcomingText(upcomingText.slice(100));
        setUserInput('');
        setCurrentErrors([]);
      }
  
      // Check if lives are depleted
      if (stats.lives <= 0) {
        setIsPlaying(false);
        setShowResults(true);
      }
    };
  
    const renderText = () => {
      return (
        <div className="relative font-mono text-xl leading-relaxed">
          {userInput.split('').map((char, index) => {
            const isError = currentErrors.includes(index);
            return (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${
                  isError ? 'text-red-400' : 'text-green-400'
                } relative`}
              >
                {char}
                {isError && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 left-0 text-red-500 text-xs"
                  >
                    ●
                  </motion.span>
                )}
              </motion.span>
            );
          })}
          <span className="text-white">{currentText.slice(userInput.length)}</span>
        </div>
      );
    };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-8 flex items-center justify-center">
        <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={()=>{navigate('/dashboard')}}
        className="absolute top-4 left-4 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg flex items-center space-x-2 hover:bg-gray-700/50 transition-all shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Main</span>
      </motion.button>
      <div className="w-full max-w-3xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl">
        <div className="p-8">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Game Header */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Timer className="w-6 h-6 text-blue-400" />
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                        {timeLeft}s
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className={`w-6 h-6 ${stats.lives > 1.5 ? 'text-red-400' : 'text-red-600'}`} />
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-red-400"
                          initial={{ width: '100%' }}
                          animate={{ width: `${(stats.lives / 3) * 100}%` }}
                          transition={{ type: 'spring', damping: 10 }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Start/Restart Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center space-x-2 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isPlaying ? 'Restart' : 'Start Race'}</span>
                  </motion.button>
                </div>

                {/* Combo Alert */}
                <AnimatePresence>
                  {showComboAlert && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span className="font-bold">{stats.combo} COMBO!</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Typing Area */}
                <div className="relative mb-8 bg-gray-800/70 rounded-lg p-6">
                  <div className="text-gray-400 mb-4">{completedText}</div>
                  {renderText()}
                  <div className="text-gray-600 mt-4">{upcomingText}</div>
                </div>

                {/* Input Field */}
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInput}
                  disabled={!isPlaying}
                  className="w-full bg-gray-700/50 backdrop-blur-sm border-2 border-gray-600 rounded-lg px-4 py-3 text-xl font-mono focus:outline-none focus:border-purple-500 transition-all shadow-inner"
                  placeholder={isPlaying ? "Start typing..." : "Press Start Race to begin"}
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mt-8">
                  {/* WPM */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg text-center shadow-lg"
                  >
                    <div className="text-sm text-gray-400 mb-1">WPM</div>
                    <div className="text-2xl font-bold text-blue-400">{stats.wpm}</div>
                  </motion.div>
                  
                  {/* Accuracy */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg text-center shadow-lg"
                  >
                    <div className="text-sm text-gray-400 mb-1">Accuracy</div>
                    <div className="text-2xl font-bold text-green-400">{stats.accuracy}%</div>
                  </motion.div>
                  
                  {/* Combo */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg text-center shadow-lg"
                  >
                    <div className="text-sm text-gray-400 mb-1">Combo</div>
                    <div className="text-2xl font-bold text-yellow-400">{stats.combo}x</div>
                  </motion.div>

                  {/* Errors */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-lg text-center shadow-lg"
                  >
                    <div className="text-sm text-gray-400 mb-1">Errors</div>
                    <div className="text-2xl font-bold text-red-400">{stats.errors}</div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              // Results Screen
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">
                  Race Complete!
                </h2>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-700/30 backdrop-blur-sm p-6 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400 mb-2">{stats.wpm}</div>
                    <div className="text-gray-400">Words per minute</div>
                  </div>
                  
                  <div className="bg-gray-700/30 backdrop-blur-sm p-6 rounded-lg">
                    <div className="text-2xl font-bold text-green-400 mb-2">{stats.accuracy}%</div>
                    <div className="text-gray-400">Accuracy</div>
                  </div>
                  
                  <div className="bg-gray-700/30 backdrop-blur-sm p-6 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400 mb-2">{stats.maxCombo}x</div>
                    <div className="text-gray-400">Max Combo</div>
                  </div>
                  
                  <div className="bg-gray-700/30 backdrop-blur-sm p-6 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400 mb-2">{stats.correctChars}</div>
                    <div className="text-gray-400">Characters typed</div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center space-x-3 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg mx-auto"
                >
                  <Flag className="w-5 h-5" />
                  <span>Race Again</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tips */}
          {!isPlaying && !showResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-center text-gray-400"
            >
              <p className="text-sm">
                💡 Tips: Keep your combo for speed boosts • Watch your lives • Aim for accuracy
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypingRace;