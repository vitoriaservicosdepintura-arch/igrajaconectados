export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Quem construiu a arca?",
    options: ["Moisés", "Noé", "Abraão", "Davi"],
    correctAnswer: 1,
    difficulty: "easy"
  },
  {
    id: 2,
    question: "Quantos dias Jesus ficou no deserto?",
    options: ["7 dias", "30 dias", "40 dias", "100 dias"],
    correctAnswer: 2,
    difficulty: "easy"
  },
  {
    id: 3,
    question: "Qual foi o primeiro milagre de Jesus?",
    options: ["Multiplicação dos pães", "Transformar água em vinho", "Curar um cego", "Andar sobre as águas"],
    correctAnswer: 1,
    difficulty: "easy"
  },
  {
    id: 4,
    question: "Quantos apóstolos Jesus escolheu?",
    options: ["7", "10", "12", "14"],
    correctAnswer: 2,
    difficulty: "easy"
  },
  {
    id: 5,
    question: "Quem traiu Jesus?",
    options: ["Pedro", "Tomé", "Judas Iscariotes", "João"],
    correctAnswer: 2,
    difficulty: "easy"
  },
  {
    id: 6,
    question: "Quem escreveu a maior parte do Novo Testamento?",
    options: ["Pedro", "Paulo", "João", "Lucas"],
    correctAnswer: 1,
    difficulty: "medium"
  },
  {
    id: 7,
    question: "Qual profeta foi engolido por um grande peixe?",
    options: ["Elias", "Eliseu", "Jonas", "Daniel"],
    correctAnswer: 2,
    difficulty: "medium"
  },
  {
    id: 8,
    question: "Quem foi o primeiro rei de Israel?",
    options: ["Davi", "Saul", "Salomão", "Samuel"],
    correctAnswer: 1,
    difficulty: "medium"
  },
  {
    id: 9,
    question: "Quantos livros tem a Bíblia?",
    options: ["56", "66", "72", "78"],
    correctAnswer: 1,
    difficulty: "medium"
  },
  {
    id: 10,
    question: "Em qual monte Moisés recebeu os Dez Mandamentos?",
    options: ["Monte das Oliveiras", "Monte Sinai", "Monte Carmelo", "Monte Sião"],
    correctAnswer: 1,
    difficulty: "medium"
  },
  {
    id: 11,
    question: "Qual é o menor livro da Bíblia?",
    options: ["Judas", "Filemom", "2 João", "3 João"],
    correctAnswer: 3,
    difficulty: "hard"
  },
  {
    id: 12,
    question: "Quem era o pai de João Batista?",
    options: ["José", "Zacarias", "Simeão", "Elias"],
    correctAnswer: 1,
    difficulty: "hard"
  }
];
