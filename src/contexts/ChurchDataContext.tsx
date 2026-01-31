import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Tipos de Dados
export interface Evento {
  id: string;
  igreja_id: string;
  titulo: string;
  descricao?: string;
  data: string;
  horario?: string;
  tipo: 'culto' | 'evento';
  local?: string;
  pregador?: string;
  louvor?: string;
  cantores?: string;
  imagem?: string;
}

export interface Membro {
  id: string;
  igreja_id: string;
  nome: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  data_batismo?: string;
  status: 'ativo' | 'inativo';
  avatar?: string;
  foto?: string;
}

export interface QuizQuestion {
  id: string;
  igreja_id: string;
  pergunta: string;
  opcoes: string[];
  resposta_correta: number;
  categoria?: string;
  dificuldade?: 'facil' | 'medio' | 'dificil';
  imagem?: string;
}

export interface Doacao {
  id: string;
  igreja_id: string;
  membro_id?: string;
  nome_doador: string;
  whatsapp_doador: string;
  email_doador?: string;
  valor: number;
  tipo: 'dizimo' | 'oferta';
  metodo: 'mbway' | 'transferencia' | 'pix' | 'iban';
  mensagem?: string;
  data: string;
}

export interface Foto {
  id: string;
  igreja_id: string;
  url: string;
  titulo: string;
  descricao?: string;
  data: string;
}

export interface Video {
  id: string;
  igreja_id: string;
  url: string;
  thumbnail: string;
  titulo: string;
  descricao?: string;
  data: string;
}

export interface Quiz {
  id: string;
  igreja_id: string;
  pergunta: string;
  opcoes: string[];
  resposta_correta: number;
  categoria?: string;
  dificuldade?: 'facil' | 'medio' | 'dificil';
  imagem?: string;
}

export interface Aviso {
  id: string;
  igreja_id: string;
  mensagem: string;
  canal: 'whatsapp' | 'email' | 'sms' | 'interno';
  data: string;
}

export interface Presenca {
  id: string;
  igreja_id: string;
  evento_id: string;
  nome: string;
  whatsapp: string;
  data: string;
}

export interface Mensagem {
  id: string;
  igreja_id: string;
  nome: string;
  whatsapp?: string;
  assunto: string;
  mensagem: string;
  lida: boolean;
  data: string;
}

export interface RankingItem {
  id: string;
  igreja_id: string;
  nome: string;
  pontuacao: number;
  acertos: number;
  erros: number;
  data: string;
}

export interface IgrejaInfo {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  logo?: string;
  cores?: {
    primary: string;
    secondary: string;
  };
}

interface ChurchDataContextType {
  // Igreja Info
  igrejaInfo: IgrejaInfo | null;
  setIgrejaInfo: (info: IgrejaInfo) => void;
  
  // Eventos
  eventos: Evento[];
  setEventos: React.Dispatch<React.SetStateAction<Evento[]>>;
  addEvento: (evento: Omit<Evento, 'id'>) => Promise<void>;
  updateEvento: (id: string, evento: Partial<Evento>) => Promise<void>;
  deleteEvento: (id: string) => Promise<void>;
  
  // Quiz Questions alias
  quizQuestions: Quiz[];
  addMensagemPastor: (mensagem: Omit<Mensagem, 'id'>) => Promise<void>;
  
  // Membros
  membros: Membro[];
  addMembro: (membro: Omit<Membro, 'id'>) => Promise<void>;
  updateMembro: (id: string, membro: Partial<Membro>) => Promise<void>;
  deleteMembro: (id: string) => Promise<void>;
  
  // Doações
  doacoes: Doacao[];
  addDoacao: (doacao: Omit<Doacao, 'id'>) => Promise<void>;
  
  // Fotos
  fotos: Foto[];
  addFoto: (foto: Omit<Foto, 'id'>) => Promise<void>;
  deleteFoto: (id: string) => Promise<void>;
  
  // Vídeos
  videos: Video[];
  addVideo: (video: Omit<Video, 'id'>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  
  // Quiz
  quizzes: Quiz[];
  addQuiz: (quiz: Omit<Quiz, 'id'>) => Promise<void>;
  
  // Avisos
  avisos: Aviso[];
  addAviso: (aviso: Omit<Aviso, 'id'>) => Promise<void>;
  
  // Presenças
  presencas: Presenca[];
  addPresenca: (presenca: Omit<Presenca, 'id'>) => Promise<void>;
  
  // Mensagens
  mensagens: Mensagem[];
  addMensagem: (mensagem: Omit<Mensagem, 'id'>) => Promise<void>;
  markMensagemAsRead: (id: string) => Promise<void>;
  
  // Ranking
  ranking: RankingItem[];
  addRanking: (item: Omit<RankingItem, 'id'>) => Promise<void>;
  
  // Utilitários
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  isUsingSupabase: boolean;
}

const ChurchDataContext = createContext<ChurchDataContextType | undefined>(undefined);

// Funções de localStorage
const getLocalStorageKey = (igrejaId: string, type: string) => `church_${igrejaId}_${type}`;

const loadFromLocalStorage = <T,>(igrejaId: string, type: string): T[] => {
  try {
    const data = localStorage.getItem(getLocalStorageKey(igrejaId, type));
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = <T,>(igrejaId: string, type: string, data: T[]) => {
  try {
    localStorage.setItem(getLocalStorageKey(igrejaId, type), JSON.stringify(data));
    // Dispara evento para sincronização entre abas/componentes
    window.dispatchEvent(new CustomEvent('churchDataUpdated', { detail: { type, igrejaId } }));
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface ChurchDataProviderProps {
  children: ReactNode;
  igrejaId?: string;
  igrejaNome?: string;
}

export const ChurchDataProvider: React.FC<ChurchDataProviderProps> = ({ 
  children, 
  igrejaId = 'public',
  igrejaNome = 'Igreja'
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingSupabase] = useState(isSupabaseConfigured());
  
  // Estados
  const [igrejaInfo, setIgrejaInfoState] = useState<IgrejaInfo | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [ranking, setRanking] = useState<RankingItem[]>([]);

  // Carregar dados do localStorage ou Supabase
  const loadData = useCallback(async () => {
    if (igrejaId === 'public') {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isUsingSupabase) {
        // Carregar do Supabase
        const [
          eventosRes,
          membrosRes,
          doacoesRes,
          fotosRes,
          videosRes,
          quizzesRes,
          avisosRes,
          presencasRes,
          mensagensRes,
          rankingRes
        ] = await Promise.all([
          supabase.from('eventos').select('*').eq('igreja_id', igrejaId),
          supabase.from('membros').select('*').eq('igreja_id', igrejaId),
          supabase.from('doacoes').select('*').eq('igreja_id', igrejaId),
          supabase.from('fotos').select('*').eq('igreja_id', igrejaId),
          supabase.from('videos').select('*').eq('igreja_id', igrejaId),
          supabase.from('quiz').select('*').eq('igreja_id', igrejaId),
          supabase.from('avisos').select('*').eq('igreja_id', igrejaId),
          supabase.from('presencas').select('*').eq('igreja_id', igrejaId),
          supabase.from('mensagens').select('*').eq('igreja_id', igrejaId),
          supabase.from('ranking').select('*').eq('igreja_id', igrejaId)
        ]);

        setEventos(eventosRes.data || []);
        setMembros(membrosRes.data || []);
        setDoacoes(doacoesRes.data || []);
        setFotos(fotosRes.data || []);
        setVideos(videosRes.data || []);
        setQuizzes(quizzesRes.data || []);
        setAvisos(avisosRes.data || []);
        setPresencas(presencasRes.data || []);
        setMensagens(mensagensRes.data || []);
        setRanking(rankingRes.data || []);
      } else {
        // Carregar do localStorage
        setEventos(loadFromLocalStorage(igrejaId, 'eventos'));
        setMembros(loadFromLocalStorage(igrejaId, 'membros'));
        setDoacoes(loadFromLocalStorage(igrejaId, 'doacoes'));
        setFotos(loadFromLocalStorage(igrejaId, 'fotos'));
        setVideos(loadFromLocalStorage(igrejaId, 'videos'));
        setQuizzes(loadFromLocalStorage(igrejaId, 'quiz'));
        setAvisos(loadFromLocalStorage(igrejaId, 'avisos'));
        setPresencas(loadFromLocalStorage(igrejaId, 'presencas'));
        setMensagens(loadFromLocalStorage(igrejaId, 'mensagens'));
        setRanking(loadFromLocalStorage(igrejaId, 'ranking'));
        
        // Carregar info da igreja
        const infoSaved = localStorage.getItem(getLocalStorageKey(igrejaId, 'info'));
        if (infoSaved) {
          setIgrejaInfoState(JSON.parse(infoSaved));
        } else {
          setIgrejaInfoState({
            id: igrejaId,
            nome: igrejaNome,
            email: '',
            telefone: ''
          });
        }
      }
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [igrejaId, igrejaNome, isUsingSupabase]);

  // Carregar dados ao iniciar
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Escutar atualizações de outras abas/componentes
  useEffect(() => {
    const handleStorageChange = () => {
      if (!isUsingSupabase) {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('churchDataUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('churchDataUpdated', handleStorageChange);
    };
  }, [loadData, isUsingSupabase]);

  // Funções de Igreja Info
  const setIgrejaInfo = useCallback((info: IgrejaInfo) => {
    setIgrejaInfoState(info);
    if (!isUsingSupabase) {
      localStorage.setItem(getLocalStorageKey(igrejaId, 'info'), JSON.stringify(info));
    }
  }, [igrejaId, isUsingSupabase]);

  // Funções de Eventos
  const addEvento = useCallback(async (evento: Omit<Evento, 'id'>) => {
    const newEvento: Evento = { ...evento, id: generateId(), igreja_id: igrejaId };
    
    if (isUsingSupabase) {
      const { error } = await supabase.from('eventos').insert(newEvento);
      if (error) throw error;
    }
    
    const updated = [...eventos, newEvento];
    setEventos(updated);
    saveToLocalStorage(igrejaId, 'eventos', updated);
  }, [eventos, igrejaId, isUsingSupabase]);

  const updateEvento = useCallback(async (id: string, evento: Partial<Evento>) => {
    if (isUsingSupabase) {
      const { error } = await supabase.from('eventos').update(evento).eq('id', id);
      if (error) throw error;
    }
    
    const updated = eventos.map(e => e.id === id ? { ...e, ...evento } : e);
    setEventos(updated);
    saveToLocalStorage(igrejaId, 'eventos', updated);
  }, [eventos, igrejaId, isUsingSupabase]);

  const deleteEvento = useCallback(async (id: string) => {
    if (isUsingSupabase) {
      const { error } = await supabase.from('eventos').delete().eq('id', id);
      if (error) throw error;
    }
    
    const updated = eventos.filter(e => e.id !== id);
    setEventos(updated);
    saveToLocalStorage(igrejaId, 'eventos', updated);
  }, [eventos, igrejaId, isUsingSupabase]);

  // Funções de Membros
  const addMembro = useCallback(async (membro: Omit<Membro, 'id'>) => {
    const newMembro: Membro = { ...membro, id: generateId(), igreja_id: igrejaId };
    
    if (isUsingSupabase) {
      const { error } = await supabase.from('membros').insert(newMembro);
      if (error) throw error;
    }
    
    const updated = [...membros, newMembro];
    setMembros(updated);
    saveToLocalStorage(igrejaId, 'membros', updated);
  }, [membros, igrejaId, isUsingSupabase]);

  const updateMembro = useCallback(async (id: string, membro: Partial<Membro>) => {
    if (isUsingSupabase) {
      const { error } = await supabase.from('membros').update(membro).eq('id', id);
      if (error) throw error;
    }
    
    const updated = membros.map(m => m.id === id ? { ...m, ...membro } : m);
    setMembros(updated);
    saveToLocalStorage(igrejaId, 'membros', updated);
  }, [membros, igrejaId, isUsingSupabase]);

  const deleteMembro = useCallback(async (id: string) => {
    if (isUsingSupabase) {
      const { error } = await supabase.from('membros').delete().eq('id', id);
      if (error) throw error;
    }
    
    const updated = membros.filter(m => m.id !== id);
    setMembros(updated);
    saveToLocalStorage(igrejaId, 'membros', updated);
  }, [membros, igrejaId, isUsingSupabase]);

  // Funções de Doações
  const addDoacao = useCallback(async (doacao: Omit<Doacao, 'id'>) => {
    const newDoacao: Doacao = { ...doacao, id: generateId(), igreja_id: igrejaId };
    
    if (isUsingSupabase) {
      const { error } = await supabase.from('doacoes').insert(newDoacao);
      if (error) throw error;
    }
    
    const updated = [...doacoes, newDoacao];
    setDoacoes(updated);
    saveToLocalStorage(igrejaId, 'doacoes', updated);
  }, [doacoes, igrejaId, isUsingSupabase]);

  // Funções de Fotos
  const addFoto = useCallback(async (foto: Omit<Foto, 'id'>) => {
    const newFoto: Foto = { ...foto, id: generateId(), igreja_id: igrejaId };
    
    if (isUsingSupabase) {
      const { error } = await supabase.from('fotos').insert(newFoto);
      if (error) throw error;
    }
    
    const updated = [...fotos, newFoto];
    setFotos(updated);
    saveToLocalStorage(igrejaId, 'fotos', updated);
  }, [fotos, igrejaId, isUsingSupabase]);

  const deleteFoto = useCallback(async (id: string) => {
    if (isUsingSupabase) {
      const { error } = await supabase.from('fotos').delete().eq('id', id);
      if (error) throw error;
    }
    
    const updated = fotos.filter(f => f.id !== id);
    setFotos(updated);
    saveToLocalStorage(igrejaId, 'fotos', updated);
  }, [fotos, igrejaId, isUsingSupabase]);

  // Funções de Vídeos
  const addVideo = useCallback(async (video: Omit<Video, 'id'>) => {
    const newVideo: Video = { ...video, id: generateId(), igreja_id: igrejaId };
    
    if (isUsingSupabase) {
      const { error } = await supabase.from('videos').insert(newVideo);
      if (error) throw error;
    }
    
    const updated = [...videos, newVideo];
    setVideos(updated);
    saveToLocalStorage(igrejaId, 'videos', updated);
  }, [videos, igrejaId, isUsingSupabase]);

  const deleteVideo = useCallback(async (id: string) => {
    if (isUsingSupabase) {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
    }
    
    const updated = videos.filter(v => v.id !== id);
    setVideos(updated);
    saveToLocalStorage(igrejaId, 'videos', updated);
  }, [videos, igrejaId, isUsingSupabase]);

  // Funções de Quiz
  const addQuiz = useCallback(async (quiz: Omit<Quiz, 'id'>) => {
    const newQuiz: Quiz = { ...quiz, id: generateId(), igreja_id: igrejaId };
    
    if (isUsingSupabase) {
      const { error } = await supabase.from('quiz').insert(newQuiz);
      if (error) throw error;
    }
    
    const updated = [...quizzes, newQuiz];
    setQuizzes(updated);
    saveToLocalStorage(igrejaId, 'quiz', updated);
  }, [quizzes, igrejaId, isUsingSupabase]);

  // Funções de Avisos
  const addAviso = useCallback(async (aviso: Omit<Aviso, 'id'>) => {
    const newAviso: Aviso = { ...aviso, id: generateId(), igreja_id: igrejaId };
    
    if (isUsingSupabase) {
      const { error } = await supabase.from('avisos').insert(newAviso);
      if (error) throw error;
    }
    
    const updated = [...avisos, newAviso];
    setAvisos(updated);
    saveToLocalStorage(igrejaId, 'avisos', updated);
  }, [avisos, igrejaId, isUsingSupabase]);

  // Funções de Presenças
  const addPresenca = useCallback(async (presenca: Omit<Presenca, 'id'>) => {
    const newPresenca: Presenca = { ...presenca, id: generateId(), igreja_id: igrejaId };
    
    if (isUsingSupabase) {
      const { error } = await supabase.from('presencas').insert(newPresenca);
      if (error) throw error;
    }
    
    const updated = [...presencas, newPresenca];
    setPresencas(updated);
    saveToLocalStorage(igrejaId, 'presencas', updated);
  }, [presencas, igrejaId, isUsingSupabase]);

  // Funções de Mensagens
  const addMensagem = useCallback(async (mensagem: Omit<Mensagem, 'id'>) => {
    const newMensagem: Mensagem = { ...mensagem, id: generateId(), igreja_id: igrejaId };
    
    if (isUsingSupabase) {
      const { error } = await supabase.from('mensagens').insert(newMensagem);
      if (error) throw error;
    }
    
    const updated = [...mensagens, newMensagem];
    setMensagens(updated);
    saveToLocalStorage(igrejaId, 'mensagens', updated);
  }, [mensagens, igrejaId, isUsingSupabase]);

  const markMensagemAsRead = useCallback(async (id: string) => {
    if (isUsingSupabase) {
      const { error } = await supabase.from('mensagens').update({ lida: true }).eq('id', id);
      if (error) throw error;
    }
    
    const updated = mensagens.map(m => m.id === id ? { ...m, lida: true } : m);
    setMensagens(updated);
    saveToLocalStorage(igrejaId, 'mensagens', updated);
  }, [mensagens, igrejaId, isUsingSupabase]);

  // Funções de Ranking
  const addRanking = useCallback(async (item: Omit<RankingItem, 'id'>) => {
    const newItem: RankingItem = { ...item, id: generateId(), igreja_id: igrejaId };
    
    if (isUsingSupabase) {
      const { error } = await supabase.from('ranking').insert(newItem);
      if (error) throw error;
    }
    
    const updated = [...ranking, newItem];
    setRanking(updated);
    saveToLocalStorage(igrejaId, 'ranking', updated);
  }, [ranking, igrejaId, isUsingSupabase]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const value: ChurchDataContextType = {
    igrejaInfo,
    setIgrejaInfo,
    eventos,
    setEventos,
    addEvento,
    updateEvento,
    deleteEvento,
    quizQuestions: quizzes,
    addMensagemPastor: addMensagem,
    membros,
    addMembro,
    updateMembro,
    deleteMembro,
    doacoes,
    addDoacao,
    fotos,
    addFoto,
    deleteFoto,
    videos,
    addVideo,
    deleteVideo,
    quizzes,
    addQuiz,
    avisos,
    addAviso,
    presencas,
    addPresenca,
    mensagens,
    addMensagem,
    markMensagemAsRead,
    ranking,
    addRanking,
    loading,
    error,
    refreshData,
    isUsingSupabase
  };

  return (
    <ChurchDataContext.Provider value={value}>
      {children}
    </ChurchDataContext.Provider>
  );
};

export const useChurchData = () => {
  const context = useContext(ChurchDataContext);
  if (context === undefined) {
    throw new Error('useChurchData must be used within a ChurchDataProvider');
  }
  return context;
};

export default ChurchDataContext;
