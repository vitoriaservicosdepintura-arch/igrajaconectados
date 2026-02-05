import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Timer, CheckCircle, XCircle, Play, RotateCcw, Medal, Zap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { QuizQuestion } from '../../types';

const questions: QuizQuestion[] = [
  { id: '1', question: 'Quem construiu a arca?', options: ['Moisés', 'Noé', 'Abraão', 'Davi'], correctIndex: 1, category: 'Antigo Testamento' },
  { id: '2', question: 'Quantos dias Jesus ficou no deserto?', options: ['7 dias', '30 dias', '40 dias', '12 dias'], correctIndex: 2, category: 'Novo Testamento' },
  { id: '3', question: 'Qual foi o primeiro milagre de Jesus?', options: ['Andar sobre as águas', 'Multiplicar pães', 'Transformar água em vinho', 'Curar um cego'], correctIndex: 2, category: 'Novo Testamento' },
  { id: '4', question: 'Quem foi jogado na cova dos leões?', options: ['Daniel', 'José', 'Jonas', 'Sansão'], correctIndex: 0, category: 'Antigo Testamento' },
  { id: '5', question: 'Quantos livros tem a Bíblia?', options: ['52', '66', '73', '81'], correctIndex: 1, category: 'Geral' },
  { id: '6', question: 'Quem escreveu o maior número de Salmos?', options: ['Salomão', 'Asafe', 'Davi', 'Moisés'], correctIndex: 2, category: 'Antigo Testamento' },
  { id: '7', question: 'Qual o menor versículo da Bíblia?', options: ['João 11:35', 'Lucas 17:32', 'Êxodo 20:13', 'Mateus 5:3'], correctIndex: 0, category: 'Geral' },
  { id: '8', question: 'Quem negou Jesus três vezes?', options: ['João', 'Tiago', 'Judas', 'Pedro'], correctIndex: 3, category: 'Novo Testamento' },
];

const mockRanking = [
  { name: 'Maria Silva', score: 980, avatar: '👩' },
  { name: 'João Santos', score: 920, avatar: '👨' },
  { name: 'Ana Costa', score: 850, avatar: '👩‍🦰' },
  { name: 'Pedro Oliveira', score: 780, avatar: '👨‍🦱' },
  { name: 'Carla Mendes', score: 720, avatar: '👧' },
];

type GameState = 'idle' | 'register' | 'playing' | 'finished';

export function QuizSection() {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState<GameState>('idle');
  const [playerName, setPlayerName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && selectedAnswer === null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswer === null) {
      handleAnswer(-1);
    }
  }, [timeLeft, gameState, selectedAnswer]);

  const startGame = () => {
    if (!playerName.trim()) return;
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameState('playing');
    setTimeLeft(15);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    const correct = index === shuffledQuestions[currentQuestionIndex].correctIndex;
    setSelectedAnswer(index);
    setIsCorrect(correct);
    
    if (correct) {
      const timeBonus = timeLeft * 10;
      setScore(score + 100 + timeBonus);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeLeft(15);
    } else {
      setGameState('finished');
    }
  };

  const getMotivationalMessage = () => {
    const percentage = (score / (shuffledQuestions.length * 250)) * 100;
    if (percentage >= 80) return { emoji: '🏆', message: 'Incrível! Você é um expert bíblico!' };
    if (percentage >= 60) return { emoji: '⭐', message: 'Muito bem! Continue estudando a Palavra!' };
    if (percentage >= 40) return { emoji: '💪', message: 'Bom trabalho! Há sempre mais para aprender!' };
    return { emoji: '📖', message: 'Não desanime! A Palavra de Deus é inesgotável!' };
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-orange-50" id="quiz">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-medium mb-4">
            {t('quiz')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Quiz <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">Bíblico</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Teste seus conhecimentos bíblicos e desafie seus amigos!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {gameState === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl shadow-xl p-8 text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-orange-500 rounded-3xl flex items-center justify-center"
                  >
                    <Zap className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Pronto para o desafio?</h3>
                  <p className="text-gray-600 mb-8">
                    Responda 5 perguntas sobre a Bíblia. Quanto mais rápido, mais pontos!
                  </p>
                  <motion.button
                    onClick={() => setGameState('register')}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-orange-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-5 h-5" />
                    {t('startQuiz')}
                  </motion.button>
                </motion.div>
              )}

              {gameState === 'register' && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl shadow-xl p-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Como devemos te chamar?</h3>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg mb-6"
                    onKeyPress={(e) => e.key === 'Enter' && startGame()}
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={() => setGameState('idle')}
                      className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Voltar
                    </button>
                    <motion.button
                      onClick={startGame}
                      disabled={!playerName.trim()}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white font-bold rounded-xl disabled:opacity-50"
                      whileTap={{ scale: 0.95 }}
                    >
                      Começar!
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {gameState === 'playing' && currentQuestion && (
                <motion.div
                  key={`question-${currentQuestionIndex}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden"
                >
                  {/* Progress Bar */}
                  <div className="h-2 bg-gray-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%` }}
                      className="h-full bg-gradient-to-r from-purple-600 to-orange-500"
                    />
                  </div>

                  <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                        {currentQuestionIndex + 1}/{shuffledQuestions.length}
                      </span>
                      <div className="flex items-center gap-2">
                        <Timer className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-500' : 'text-gray-500'}`} />
                        <span className={`font-bold text-lg ${timeLeft <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
                          {timeLeft}s
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="font-bold text-gray-900">{score}</span>
                      </div>
                    </div>

                    {/* Question */}
                    <div className="mb-8">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">{currentQuestion.category}</span>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                        {currentQuestion.question}
                      </h3>
                    </div>

                    {/* Options */}
                    <div className="grid gap-3 mb-6">
                      {currentQuestion.options.map((option, index) => {
                        let bgClass = 'bg-gray-50 hover:bg-gray-100';
                        if (selectedAnswer !== null) {
                          if (index === currentQuestion.correctIndex) {
                            bgClass = 'bg-green-100 border-green-500';
                          } else if (index === selectedAnswer && !isCorrect) {
                            bgClass = 'bg-red-100 border-red-500';
                          }
                        }

                        return (
                          <motion.button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            disabled={selectedAnswer !== null}
                            className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all ${bgClass} ${
                              selectedAnswer === null ? 'border-transparent' : ''
                            }`}
                            whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                            whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-gray-500">
                                {String.fromCharCode(65 + index)}
                              </span>
                              <span className={selectedAnswer !== null && index === currentQuestion.correctIndex ? 'text-green-700' : 'text-gray-700'}>
                                {option}
                              </span>
                              {selectedAnswer !== null && index === currentQuestion.correctIndex && (
                                <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                              )}
                              {selectedAnswer === index && !isCorrect && (
                                <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Result & Next */}
                    {selectedAnswer !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                      >
                        <p className={`text-lg font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {isCorrect ? '✅ Correto!' : '❌ Ops, errou!'}
                        </p>
                        <motion.button
                          onClick={nextQuestion}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white font-bold rounded-xl"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {currentQuestionIndex < shuffledQuestions.length - 1 ? t('nextQuestion') : 'Ver Resultado'}
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {gameState === 'finished' && (
                <motion.div
                  key="finished"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl shadow-xl p-8 text-center"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1 }}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                  >
                    <Trophy className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{getMotivationalMessage().emoji}</h3>
                  <p className="text-xl font-bold text-gray-900 mb-2">Parabéns, {playerName}!</p>
                  <p className="text-gray-600 mb-6">{getMotivationalMessage().message}</p>
                  
                  <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-100 to-orange-100 rounded-2xl mb-8">
                    <Star className="w-8 h-8 text-yellow-500" />
                    <span className="text-3xl font-bold text-gray-900">{score}</span>
                    <span className="text-gray-500">pontos</span>
                  </div>

                  <motion.button
                    onClick={() => setGameState('idle')}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-orange-500 text-white font-bold rounded-xl flex items-center gap-2 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw className="w-5 h-5" />
                    Jogar Novamente
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Ranking */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Medal className="w-6 h-6 text-yellow-500" />
              {t('ranking')} Global
            </h3>
            
            <div className="space-y-3">
              {mockRanking.map((player, index) => (
                <motion.div
                  key={player.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-100 to-orange-100' :
                    index === 1 ? 'bg-gray-100' :
                    index === 2 ? 'bg-orange-50' : 'bg-gray-50'
                  }`}
                >
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                    index === 0 ? 'bg-yellow-400 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-2xl">{player.avatar}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{player.name}</p>
                  </div>
                  <span className="font-bold text-gray-900">{player.score}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
