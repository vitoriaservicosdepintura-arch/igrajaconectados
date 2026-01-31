import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
// Para usar em produção, crie um projeto em https://supabase.com
// e substitua as variáveis abaixo pelas suas credenciais

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://seu-projeto.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sua-chave-anonima';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Verifica se o Supabase está configurado
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://seu-projeto.supabase.co' && 
         supabaseAnonKey !== 'sua-chave-anonima';
};

// Tipos para as tabelas do Supabase
export interface SupabaseIgreja {
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
  created_at: string;
}

export interface SupabaseEvento {
  id: string;
  igreja_id: string;
  titulo: string;
  descricao?: string;
  data: string;
  horario: string;
  tipo: 'culto' | 'evento';
  local?: string;
  pregador?: string;
  louvor?: string;
  imagem?: string;
  created_at: string;
}

export interface SupabaseMembro {
  id: string;
  igreja_id: string;
  nome: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  data_batismo?: string;
  status: 'ativo' | 'inativo';
  created_at: string;
}

export interface SupabaseDoacao {
  id: string;
  igreja_id: string;
  nome_doador: string;
  whatsapp_doador: string;
  email_doador?: string;
  valor: number;
  tipo: 'dizimo' | 'oferta';
  metodo: 'mbway' | 'transferencia' | 'pix';
  mensagem?: string;
  data: string;
  created_at: string;
}

export interface SupabaseFoto {
  id: string;
  igreja_id: string;
  url: string;
  titulo: string;
  descricao?: string;
  data: string;
  created_at: string;
}

export interface SupabaseVideo {
  id: string;
  igreja_id: string;
  url: string;
  thumbnail: string;
  titulo: string;
  descricao?: string;
  data: string;
  created_at: string;
}

export interface SupabaseQuiz {
  id: string;
  igreja_id: string;
  pergunta: string;
  opcoes: string[];
  resposta_correta: number;
  categoria?: string;
  dificuldade?: 'facil' | 'medio' | 'dificil';
  imagem?: string;
  created_at: string;
}

export interface SupabaseAviso {
  id: string;
  igreja_id: string;
  mensagem: string;
  canal: 'whatsapp' | 'email' | 'sms' | 'interno';
  data: string;
  created_at: string;
}

export interface SupabasePresenca {
  id: string;
  igreja_id: string;
  evento_id: string;
  nome: string;
  whatsapp: string;
  data: string;
  created_at: string;
}

export interface SupabaseMensagem {
  id: string;
  igreja_id: string;
  nome: string;
  whatsapp?: string;
  assunto: string;
  mensagem: string;
  lida: boolean;
  data: string;
  created_at: string;
}

export interface SupabaseRanking {
  id: string;
  igreja_id: string;
  nome: string;
  pontuacao: number;
  acertos: number;
  erros: number;
  data: string;
  created_at: string;
}

/*
SQL para criar as tabelas no Supabase:

-- Tabela de Igrejas
CREATE TABLE igrejas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  endereco TEXT,
  logo TEXT,
  cores JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Eventos
CREATE TABLE eventos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  igreja_id UUID REFERENCES igrejas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  tipo TEXT CHECK (tipo IN ('culto', 'evento')) DEFAULT 'culto',
  local TEXT,
  pregador TEXT,
  louvor TEXT,
  imagem TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Membros
CREATE TABLE membros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  igreja_id UUID REFERENCES igrejas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  whatsapp TEXT,
  data_batismo DATE,
  status TEXT CHECK (status IN ('ativo', 'inativo')) DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Doações
CREATE TABLE doacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  igreja_id UUID REFERENCES igrejas(id) ON DELETE CASCADE,
  nome_doador TEXT NOT NULL,
  whatsapp_doador TEXT NOT NULL,
  email_doador TEXT,
  valor DECIMAL(10,2) NOT NULL,
  tipo TEXT CHECK (tipo IN ('dizimo', 'oferta')) DEFAULT 'oferta',
  metodo TEXT CHECK (metodo IN ('mbway', 'transferencia', 'pix')) DEFAULT 'mbway',
  mensagem TEXT,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Fotos
CREATE TABLE fotos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  igreja_id UUID REFERENCES igrejas(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Vídeos
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  igreja_id UUID REFERENCES igrejas(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  data DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Quiz
CREATE TABLE quiz (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  igreja_id UUID REFERENCES igrejas(id) ON DELETE CASCADE,
  pergunta TEXT NOT NULL,
  opcoes JSONB NOT NULL,
  resposta_correta INTEGER NOT NULL,
  categoria TEXT,
  dificuldade TEXT CHECK (dificuldade IN ('facil', 'medio', 'dificil')) DEFAULT 'facil',
  imagem TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Avisos
CREATE TABLE avisos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  igreja_id UUID REFERENCES igrejas(id) ON DELETE CASCADE,
  mensagem TEXT NOT NULL,
  canal TEXT CHECK (canal IN ('whatsapp', 'email', 'sms', 'interno')) DEFAULT 'interno',
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Presenças
CREATE TABLE presencas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  igreja_id UUID REFERENCES igrejas(id) ON DELETE CASCADE,
  evento_id UUID REFERENCES eventos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Mensagens
CREATE TABLE mensagens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  igreja_id UUID REFERENCES igrejas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  whatsapp TEXT,
  assunto TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Ranking
CREATE TABLE ranking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  igreja_id UUID REFERENCES igrejas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  pontuacao INTEGER DEFAULT 0,
  acertos INTEGER DEFAULT 0,
  erros INTEGER DEFAULT 0,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) para todas as tabelas
ALTER TABLE igrejas ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE doacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz ENABLE ROW LEVEL SECURITY;
ALTER TABLE avisos ENABLE ROW LEVEL SECURITY;
ALTER TABLE presencas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de leitura para visitantes
CREATE POLICY "Eventos públicos" ON eventos FOR SELECT USING (true);
CREATE POLICY "Fotos públicas" ON fotos FOR SELECT USING (true);
CREATE POLICY "Videos públicos" ON videos FOR SELECT USING (true);
CREATE POLICY "Doações públicas" ON doacoes FOR SELECT USING (true);

-- Políticas de inserção para visitantes (doações e presenças)
CREATE POLICY "Inserir doações" ON doacoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Inserir presenças" ON presencas FOR INSERT WITH CHECK (true);
CREATE POLICY "Inserir mensagens" ON mensagens FOR INSERT WITH CHECK (true);

*/
