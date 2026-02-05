import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Types
export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  status: 'active' | 'inactive';
  joinedAt: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  poster?: string;
  pastorName: string;
  pastorPhoto?: string;
  singerName: string;
  singerPhoto?: string;
  photos: string[];
  status: 'scheduled' | 'draft' | 'completed';
}

export interface PrayerRequest {
  id: string;
  name: string;
  message: string;
  isPublic: boolean;
  prayingCount: number;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  url: string;
  eventId?: string;
  createdAt: string;
}

export interface LiveStream {
  id: string;
  title: string;
  youtubeUrl: string;
  scheduledAt: string;
  isLive: boolean;
}

interface DataContextType {
  // Members
  members: Member[];
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  
  // Events
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  
  // Prayer Requests
  prayerRequests: PrayerRequest[];
  addPrayerRequest: (request: Omit<PrayerRequest, 'id' | 'status'>) => void;
  updatePrayerRequest: (id: string, request: Partial<PrayerRequest>) => void;
  deletePrayerRequest: (id: string) => void;
  approvePrayerRequest: (id: string) => void;
  rejectPrayerRequest: (id: string) => void;
  incrementPrayingCount: (id: string) => void;
  
  // Gallery
  galleryPhotos: GalleryPhoto[];
  addGalleryPhoto: (photo: Omit<GalleryPhoto, 'id'>) => void;
  deleteGalleryPhoto: (id: string) => void;
  
  // Live
  liveStream: LiveStream | null;
  setLiveStream: (stream: LiveStream | null) => void;
  youtubeChannelUrl: string;
  setYoutubeChannelUrl: (url: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial data
const initialMembers: Member[] = [
  { id: '1', name: 'Maria Silva', email: 'maria@email.com', phone: '+351 912 345 678', status: 'active', joinedAt: '2023-01-15' },
  { id: '2', name: 'João Santos', email: 'joao@email.com', phone: '+351 923 456 789', status: 'active', joinedAt: '2023-03-20' },
  { id: '3', name: 'Ana Costa', email: 'ana@email.com', phone: '+351 934 567 890', status: 'inactive', joinedAt: '2022-08-10' },
];

const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Culto de Celebração',
    date: '2025-01-19',
    time: '10:00',
    location: 'Templo Principal',
    description: 'Culto dominical com louvor e pregação da Palavra.',
    pastorName: 'Pr. João Silva',
    pastorPhoto: '',
    singerName: 'Ministério de Louvor',
    singerPhoto: '',
    photos: [],
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Noite de Louvor',
    date: '2025-01-22',
    time: '19:30',
    location: 'Templo Principal',
    description: 'Uma noite especial de adoração e comunhão.',
    pastorName: 'Ev. Pedro Santos',
    pastorPhoto: '',
    singerName: 'Banda Adoração',
    singerPhoto: '',
    photos: [],
    status: 'scheduled'
  },
  {
    id: '3',
    title: 'Conferência de Jovens',
    date: '2025-01-25',
    time: '18:00',
    location: 'Salão de Eventos',
    description: 'Evento especial para jovens com palestras e workshops.',
    pastorName: 'Pra. Maria Silva',
    pastorPhoto: '',
    singerName: 'DJ Gospel',
    singerPhoto: '',
    photos: [],
    status: 'draft'
  },
];

const initialPrayerRequests: PrayerRequest[] = [
  { id: '1', name: 'Maria', message: 'Peço oração pela saúde da minha mãe.', isPublic: true, prayingCount: 45, createdAt: new Date().toISOString(), status: 'approved' },
  { id: '2', name: 'João', message: 'Preciso de direção para uma decisão importante no trabalho.', isPublic: true, prayingCount: 32, createdAt: new Date().toISOString(), status: 'approved' },
  { id: '3', name: 'Ana', message: 'Agradeço a Deus pela cura que recebi!', isPublic: true, prayingCount: 78, createdAt: new Date().toISOString(), status: 'approved' },
  { id: '4', name: 'Pedro', message: 'Oração pela paz na minha família.', isPublic: true, prayingCount: 56, createdAt: new Date().toISOString(), status: 'approved' },
  { id: '5', name: 'Carla', message: 'Pela salvação dos meus filhos.', isPublic: true, prayingCount: 89, createdAt: new Date().toISOString(), status: 'approved' },
  { id: '6', name: 'Anônimo', message: 'Preciso de oração urgente (privado)', isPublic: false, prayingCount: 0, createdAt: new Date().toISOString(), status: 'pending' },
];

const initialGalleryPhotos: GalleryPhoto[] = [
  { id: '1', title: 'Culto de Celebração', category: 'Cultos', url: '', createdAt: new Date().toISOString() },
  { id: '2', title: 'Batismo nas Águas', category: 'Batismos', url: '', createdAt: new Date().toISOString() },
  { id: '3', title: 'Conferência de Jovens', category: 'Eventos', url: '', createdAt: new Date().toISOString() },
  { id: '4', title: 'Escolinha Dominical', category: 'Escolinha', url: '', createdAt: new Date().toISOString() },
  { id: '5', title: 'Louvor e Adoração', category: 'Cultos', url: '', createdAt: new Date().toISOString() },
  { id: '6', title: 'Missões em Moçambique', category: 'Missões', url: '', createdAt: new Date().toISOString() },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('church_members');
    return saved ? JSON.parse(saved) : initialMembers;
  });
  
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('church_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });
  
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(() => {
    const saved = localStorage.getItem('church_prayers');
    return saved ? JSON.parse(saved) : initialPrayerRequests;
  });
  
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(() => {
    const saved = localStorage.getItem('church_gallery');
    return saved ? JSON.parse(saved) : initialGalleryPhotos;
  });
  
  const [liveStream, setLiveStream] = useState<LiveStream | null>(null);
  
  const [youtubeChannelUrl, setYoutubeChannelUrl] = useState<string>(() => {
    const saved = localStorage.getItem('church_youtube_url');
    return saved || 'https://www.youtube.com/@IgrejaConectada';
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('church_members', JSON.stringify(members));
  }, [members]);
  
  useEffect(() => {
    localStorage.setItem('church_events', JSON.stringify(events));
  }, [events]);
  
  useEffect(() => {
    localStorage.setItem('church_prayers', JSON.stringify(prayerRequests));
  }, [prayerRequests]);
  
  useEffect(() => {
    localStorage.setItem('church_gallery', JSON.stringify(galleryPhotos));
  }, [galleryPhotos]);
  
  useEffect(() => {
    localStorage.setItem('church_youtube_url', youtubeChannelUrl);
  }, [youtubeChannelUrl]);

  // Members
  const addMember = (member: Omit<Member, 'id'>) => {
    const newMember = { ...member, id: Date.now().toString() };
    setMembers(prev => [...prev, newMember]);
  };
  
  const updateMember = (id: string, member: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...member } : m));
  };
  
  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  // Events
  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = { ...event, id: Date.now().toString() };
    setEvents(prev => [...prev, newEvent]);
  };
  
  const updateEvent = (id: string, event: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...event } : e));
  };
  
  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Prayer Requests
  const addPrayerRequest = (request: Omit<PrayerRequest, 'id' | 'status'>) => {
    const newRequest: PrayerRequest = {
      ...request,
      id: Date.now().toString(),
      status: request.isPublic ? 'approved' : 'pending'
    };
    setPrayerRequests(prev => [newRequest, ...prev]);
  };
  
  const updatePrayerRequest = (id: string, request: Partial<PrayerRequest>) => {
    setPrayerRequests(prev => prev.map(r => r.id === id ? { ...r, ...request } : r));
  };
  
  const deletePrayerRequest = (id: string) => {
    setPrayerRequests(prev => prev.filter(r => r.id !== id));
  };
  
  const approvePrayerRequest = (id: string) => {
    setPrayerRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };
  
  const rejectPrayerRequest = (id: string) => {
    setPrayerRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };
  
  const incrementPrayingCount = (id: string) => {
    setPrayerRequests(prev => prev.map(r => r.id === id ? { ...r, prayingCount: r.prayingCount + 1 } : r));
  };

  // Gallery
  const addGalleryPhoto = (photo: Omit<GalleryPhoto, 'id'>) => {
    const newPhoto = { ...photo, id: Date.now().toString() };
    setGalleryPhotos(prev => [...prev, newPhoto]);
  };
  
  const deleteGalleryPhoto = (id: string) => {
    setGalleryPhotos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <DataContext.Provider value={{
      members,
      addMember,
      updateMember,
      deleteMember,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      prayerRequests,
      addPrayerRequest,
      updatePrayerRequest,
      deletePrayerRequest,
      approvePrayerRequest,
      rejectPrayerRequest,
      incrementPrayingCount,
      galleryPhotos,
      addGalleryPhoto,
      deleteGalleryPhoto,
      liveStream,
      setLiveStream,
      youtubeChannelUrl,
      setYoutubeChannelUrl,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
