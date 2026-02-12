import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Trophy, Clock, Check, X, RotateCcw, Sparkles } from 'lucide-react';
import { quizQuestions, QuizQuestion } from '../data/quizQuestions';

type Difficulty = 'all' | 'easy' | 'medium' | 'hard';

const leaderboard = [
  { name: 'Maria Santos', score: 980, avatar: '👩' },
  { name: 'João Silva', score: 920, avatar: '👨' },
  { name: 'Ana Oliveira', score: 850, avatar: '👩‍🦰' },
  { name: 'Pedro Costa', score: 780, avatar: '👨‍🦱' },
  { name: 'Lucia Ferreira', score: 720, avatar: '👩‍🦳' }
];

export function QuizPage() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const filteredQuestions = difficulty === 'all'
    ? quizQuestions
    : quizQuestions.filter(q => q.difficulty === difficulty);

  const startGame = () => {
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setTimeLeft(30);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing' || showAnswer) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(-1);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, showAnswer, currentQuestionIndex]);

  const handleAnswer = (answerIndex: number) => {
    if (showAnswer) return;
    
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);

    const currentQuestion = questions[currentQuestionIndex];
    if (answerIndex === currentQuestion.correctAnswer) {
      const timeBonus = Math.floor(timeLeft * 3);
      const difficultyBonus = currentQuestion.difficulty === 'hard' ? 50 : currentQuestion.difficulty === 'medium' ? 30 : 10;
      setScore(prev => prev + 100 + timeBonus + difficultyBonus);
      setCorrectAnswers(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 >= questions.length) {
        setGameState('result');
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowAnswer(false);
        setTimeLeft(30);
      }
    }, 2000);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-amber-950 to-slate-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Menu */}
        <AnimatePresence mode="wait">
          {gameState === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-600/30 mb-6">
                <HelpCircle className="w-10 h-10 text-amber-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4">Quiz Bíblico</h1>
              <p className="text-amber-200/70 max-w-xl mx-auto mb-8">
                Teste seus conhecimentos sobre a Bíblia e desafie seus amigos!
              </p>

              {/* Difficulty Selection */}
              <div className="max-w-md mx-auto mb-8">
                <p className="text-amber-200/80 mb-4">Escolha a dificuldade:</p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: 'all', label: 'Todos', color: 'bg-amber-600' },
                    { id: 'easy', label: 'Fácil', color: 'bg-green-600' },
                    { id: 'medium', label: 'Médio', color: 'bg-yellow-600' },
                    { id: 'hard', label: 'Difícil', color: 'bg-red-600' }
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDifficulty(d.id as Difficulty)}
                      className={`py-2 px-3 rounded-xl font-medium text-sm transition-all ${
                        difficulty === d.id
                          ? `${d.color} text-white`
                          : 'bg-amber-800/40 text-amber-200 hover:bg-amber-700/50'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-12 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-amber-500/30 transition-all"
              >
                Começar Quiz
              </motion.button>

              {/* Leaderboard */}
              <div className="mt-12 bg-gradient-to-br from-amber-900/40 to-amber-800/20 rounded-2xl p-6 border border-amber-700/30">
                <h2 className="text-xl font-bold text-amber-100 mb-6 flex items-center justify-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  Ranking
                </h2>
                <div className="space-y-3">
                  {leaderboard.map((player, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-3 rounded-xl ${
                        index === 0 ? 'bg-amber-600/30' : 'bg-amber-800/20'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${
                        index === 0 ? 'bg-amber-500 text-white' : 'bg-amber-700/50 text-amber-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="text-2xl">{player.avatar}</div>
                      <div className="flex-1 text-left">
                        <p className="text-amber-100 font-medium">{player.name}</p>
                      </div>
                      <div className="text-amber-400 font-bold">{player.score} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Playing */}
          {gameState === 'playing' && currentQuestion && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Progress & Timer */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-medium">
                    Pergunta {currentQuestionIndex + 1}/{questions.length}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-100 font-bold">{score}</span>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    timeLeft <= 10 ? 'bg-red-600/30 text-red-400' : 'bg-amber-600/30 text-amber-300'
                  }`}>
                    <Clock className="w-5 h-5" />
                    <span className="font-bold">{timeLeft}s</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-amber-900/50 rounded-full mb-8 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / 30) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>

              {/* Question */}
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 rounded-2xl p-8 border border-amber-700/30 mb-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentQuestion.difficulty === 'easy' ? 'bg-green-600/30 text-green-400' :
                    currentQuestion.difficulty === 'medium' ? 'bg-yellow-600/30 text-yellow-400' :
                    'bg-red-600/30 text-red-400'
                  }`}>
                    {currentQuestion.difficulty === 'easy' ? 'Fácil' :
                     currentQuestion.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-amber-100">
                  {currentQuestion.question}
                </h2>
              </motion.div>

              {/* Options */}
              <div className="grid gap-4">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: showAnswer ? 1 : 1.02 }}
                    whileTap={{ scale: showAnswer ? 1 : 0.98 }}
                    onClick={() => handleAnswer(index)}
                    disabled={showAnswer}
                    className={`w-full p-4 rounded-xl text-left font-medium transition-all flex items-center gap-4 ${
                      showAnswer
                        ? index === currentQuestion.correctAnswer
                          ? 'bg-green-600 text-white'
                          : index === selectedAnswer
                            ? 'bg-red-600 text-white'
                            : 'bg-amber-800/30 text-amber-200/50'
                        : 'bg-amber-800/40 text-amber-100 hover:bg-amber-700/50 border border-amber-700/30 hover:border-amber-500/50'
                    }`}
                  >
                    <span className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showAnswer && index === currentQuestion.correctAnswer && (
                      <Check className="w-6 h-6" />
                    )}
                    {showAnswer && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                      <X className="w-6 h-6" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Result */}
          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 rounded-3xl p-8 border border-amber-700/30">
                <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-amber-100 mb-2">Quiz Finalizado!</h2>
                <p className="text-amber-200/70 mb-8">Confira seu desempenho:</p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-amber-800/30 rounded-xl p-4">
                    <div className="text-3xl font-bold text-amber-400">{score}</div>
                    <div className="text-amber-200/60 text-sm">Pontos</div>
                  </div>
                  <div className="bg-amber-800/30 rounded-xl p-4">
                    <div className="text-3xl font-bold text-green-400">{correctAnswers}</div>
                    <div className="text-amber-200/60 text-sm">Acertos</div>
                  </div>
                  <div className="bg-amber-800/30 rounded-xl p-4">
                    <div className="text-3xl font-bold text-amber-200">
                      {Math.round((correctAnswers / questions.length) * 100)}%
                    </div>
                    <div className="text-amber-200/60 text-sm">Precisão</div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-full flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Jogar Novamente
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setGameState('menu')}
                    className="px-8 py-3 bg-amber-800/50 text-amber-200 font-bold rounded-full"
                  >
                    Menu
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
