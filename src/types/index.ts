export interface PrayerRequest {
  id: string;
  name: string;
  message: string;
  isPublic: boolean;
  prayingCount: number;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: Date;
  donations: Donation[];
}

export interface Donation {
  id: string;
  amount: number;
  currency: 'EUR' | 'BRL';
  method: 'MBWAY' | 'PIX' | 'TRANSFER';
  date: Date;
  project?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
}

export interface CellGroup {
  id: string;
  name: string;
  leader: string;
  address: string;
  lat: number;
  lng: number;
  dayOfWeek: string;
  time: string;
}

export type Language = 'pt' | 'en' | 'es';

export interface Translations {
  [key: string]: {
    pt: string;
    en: string;
    es: string;
  };
}
