// Database Types
export interface Igreja {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  logo?: string;
  cores: {
    primary: string;
    secondary: string;
  };
  plano_id: string;
  status: 'ativo' | 'inativo' | 'pendente';
  idioma_padrao: 'pt' | 'en' | 'es';
  data_cadastro: Date;
}

export interface Usuario {
  id: string;
  igreja_id: string;
  nome: string;
  email: string;
  senha: string;
  role: 'admin' | 'pastor' | 'lider' | 'membro';
  telefone?: string;
}

export interface Membro {
  id: string;
  igreja_id: string;
  nome: string;
  email?: string;
  telefone?: string;
  data_batismo?: Date;
  status: 'ativo' | 'inativo';
  foto?: string;
}

export interface EventoCulto {
  id: string;
  igreja_id: string;
  titulo: string;
  descricao?: string;
  data: Date;
  tipo: 'culto' | 'evento';
  pregador?: string;
  cantores?: string;
  imagem?: string;
  local?: string;
}

export interface Aviso {
  id: string;
  igreja_id: string;
  mensagem: string;
  canal: 'whatsapp' | 'email' | 'sms' | 'interno';
  data: Date;
}

export interface QuizEscolinha {
  id: string;
  igreja_id: string;
  pergunta: string;
  opcoes: string[];
  resposta_correta: number;
  imagem?: string;
}

export interface Doacao {
  id: string;
  igreja_id: string;
  membro_id?: string;
  valor: number;
  tipo: 'dizimo' | 'oferta';
  data: Date | string;
  metodo?: 'mbway' | 'iban' | 'pix' | 'transferencia';
  nome_doador?: string;
  whatsapp_doador?: string;
  email_doador?: string;
  mensagem?: string;
  status?: 'pendente' | 'confirmado';
}

export interface Plano {
  id: string;
  nome: string;
  preco: number;
  limites: {
    membros: number;
    recursos: string[];
  };
  popular?: boolean;
}

export type Language = 'pt' | 'en' | 'es';

export interface TranslationStrings {
  [key: string]: string | TranslationStrings;
}
