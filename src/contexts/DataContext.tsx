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
  cellId?: string;
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

export interface Comment {
  id: string;
  memberId: string;
  memberName: string;
  memberPhoto?: string;
  text: string;
  createdAt: string;
  targetType: 'event' | 'gallery' | 'media' | 'sundaySchool';
  targetId: string;
}

export interface Cell {
  id: string;
  name: string;
  leaderId: string;
  leaderName: string;
  leaderPhoto?: string;
  day: string;
  time: string;
  address: string;
  lat: number;
  lng: number;
  memberIds: string[];
}

export interface SundaySchoolMaterial {
  id: string;
  title: string;
  description: string;
  type: 'PDF' | 'ZIP' | 'VIDEO';
  category: 'lesson' | 'activities' | 'resources';
  fileUrl?: string;
  createdAt: string;
}

export interface MemberDonation {
  id: string;
  memberId: string;
  amount: number;
  currency: 'EUR' | 'BRL';
  project: string;
  method: 'MBWAY' | 'PIX' | 'Transfer';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface MediaContent {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio';
  thumbnail: string;
  url: string;
  duration: string;
  createdAt: string;
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

  // Comments
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  deleteComment: (id: string) => void;
  getCommentsByTarget: (targetType: string, targetId: string) => Comment[];

  // Cells
  cells: Cell[];
  addCell: (cell: Omit<Cell, 'id'>) => void;
  updateCell: (id: string, cell: Partial<Cell>) => void;
  deleteCell: (id: string) => void;
  getCellByMemberId: (memberId: string) => Cell | undefined;

  // Sunday School Materials
  sundaySchoolMaterials: SundaySchoolMaterial[];
  addSundaySchoolMaterial: (material: Omit<SundaySchoolMaterial, 'id'>) => void;
  deleteSundaySchoolMaterial: (id: string) => void;

  // Member Donations
  memberDonations: MemberDonation[];
  addMemberDonation: (donation: Omit<MemberDonation, 'id'>) => void;
  getMemberDonations: (memberId: string) => MemberDonation[];

  // Media Content
  mediaContent: MediaContent[];
  addMediaContent: (media: Omit<MediaContent, 'id'>) => void;
  deleteMediaContent: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial data
const initialMembers: Member[] = [
  { id: '1', name: 'Maria Silva', email: 'maria@email.com', phone: '+351 912 345 678', status: 'active', joinedAt: '2023-01-15', cellId: '1' },
  { id: '2', name: 'João Santos', email: 'joao@email.com', phone: '+351 923 456 789', status: 'active', joinedAt: '2023-03-20', cellId: '1' },
  { id: '3', name: 'Ana Costa', email: 'ana@email.com', phone: '+351 934 567 890', status: 'active', joinedAt: '2022-08-10', cellId: '1' },
  { id: '4', name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '+351 945 678 901', status: 'active', joinedAt: '2022-01-05', cellId: '1' },
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
    pastorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    singerName: 'Ministério de Louvor',
    singerPhoto: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
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
    pastorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    singerName: 'Banda Adoração',
    singerPhoto: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
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
    pastorPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    singerName: 'DJ Gospel',
    singerPhoto: 'https://images.unsplash.com/photo-1571266028243-d220c6a2f29c?w=100&h=100&fit=crop',
    photos: [],
    status: 'scheduled'
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
  { id: '1', title: 'Culto de Celebração', category: 'Cultos', url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&h=300&fit=crop', createdAt: new Date().toISOString() },
  { id: '2', title: 'Batismo nas Águas', category: 'Batismos', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', createdAt: new Date().toISOString() },
  { id: '3', title: 'Conferência de Jovens', category: 'Eventos', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop', createdAt: new Date().toISOString() },
  { id: '4', title: 'Escolinha Dominical', category: 'Escolinha', url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop', createdAt: new Date().toISOString() },
  { id: '5', title: 'Louvor e Adoração', category: 'Cultos', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop', createdAt: new Date().toISOString() },
  { id: '6', title: 'Missões em Moçambique', category: 'Missões', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop', createdAt: new Date().toISOString() },
];

const initialCells: Cell[] = [
  {
    id: '1',
    name: 'Célula Família Abençoada',
    leaderId: '4',
    leaderName: 'Carlos Oliveira',
    leaderPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    day: 'Quarta-feira',
    time: '20:00',
    address: 'Rua das Flores, 123 - Lisboa',
    lat: 38.7223,
    lng: -9.1393,
    memberIds: ['1', '2', '3', '4']
  },
  {
    id: '2',
    name: 'Célula Jovens em Cristo',
    leaderId: '2',
    leaderName: 'João Santos',
    leaderPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    day: 'Sexta-feira',
    time: '19:30',
    address: 'Av. da Liberdade, 456 - Lisboa',
    lat: 38.7200,
    lng: -9.1450,
    memberIds: ['2']
  }
];

const initialSundaySchoolMaterials: SundaySchoolMaterial[] = [
  { id: '1', title: 'Lição 1 - O Amor de Deus', description: 'Estudo sobre o amor incondicional de Deus', type: 'PDF', category: 'lesson', createdAt: '2025-01-12' },
  { id: '2', title: 'Lição 2 - A Criação', description: 'Como Deus criou o mundo', type: 'PDF', category: 'lesson', createdAt: '2025-01-19' },
  { id: '3', title: 'Atividades para Crianças - Janeiro', description: 'Atividades lúdicas para crianças', type: 'ZIP', category: 'activities', createdAt: '2025-01-19' },
  { id: '4', title: 'Lição 3 - Noé e a Arca', description: 'A história de Noé e a fidelidade de Deus', type: 'PDF', category: 'lesson', createdAt: '2025-01-26' },
  { id: '5', title: 'Recursos para Professores', description: 'Material de apoio para educadores', type: 'PDF', category: 'resources', createdAt: '2025-01-01' },
];

const initialMemberDonations: MemberDonation[] = [
  { id: '1', memberId: '1', amount: 50, currency: 'EUR', project: 'Novo Templo', method: 'MBWAY', status: 'confirmed', createdAt: '2025-01-10' },
  { id: '2', memberId: '1', amount: 100, currency: 'EUR', project: 'Missões', method: 'Transfer', status: 'confirmed', createdAt: '2024-12-15' },
  { id: '3', memberId: '1', amount: 75, currency: 'EUR', project: 'Geral', method: 'PIX', status: 'confirmed', createdAt: '2024-11-20' },
  { id: '4', memberId: '2', amount: 200, currency: 'EUR', project: 'Novo Templo', method: 'Transfer', status: 'confirmed', createdAt: '2025-01-05' },
];

const initialMediaContent: MediaContent[] = [
  { id: '1', title: 'A Fé que Move Montanhas', description: 'Pregação sobre a fé inabalável', type: 'video', thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=200&fit=crop', url: 'https://youtube.com/watch?v=example1', duration: '45:32', createdAt: '2025-01-12' },
  { id: '2', title: 'Podcast: Vida em Cristo', description: 'Reflexões sobre a vida cristã', type: 'audio', thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&h=200&fit=crop', url: 'https://podcast.example.com/ep1', duration: '32:15', createdAt: '2025-01-10' },
  { id: '3', title: 'O Poder da Oração', description: 'Como a oração transforma vidas', type: 'video', thumbnail: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=300&h=200&fit=crop', url: 'https://youtube.com/watch?v=example2', duration: '38:45', createdAt: '2025-01-05' },
];

const initialComments: Comment[] = [
  { id: '1', memberId: '1', memberName: 'Maria Silva', text: 'Culto maravilhoso! Deus seja louvado!', createdAt: '2025-01-15', targetType: 'event', targetId: '1' },
  { id: '2', memberId: '2', memberName: 'João Santos', text: 'Que bênção participar desse momento!', createdAt: '2025-01-14', targetType: 'gallery', targetId: '1' },
  { id: '3', memberId: '3', memberName: 'Ana Costa', text: 'Mensagem muito edificante!', createdAt: '2025-01-12', targetType: 'media', targetId: '1' },
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

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('church_comments');
    return saved ? JSON.parse(saved) : initialComments;
  });

  const [cells, setCells] = useState<Cell[]>(() => {
    const saved = localStorage.getItem('church_cells');
    return saved ? JSON.parse(saved) : initialCells;
  });

  const [sundaySchoolMaterials, setSundaySchoolMaterials] = useState<SundaySchoolMaterial[]>(() => {
    const saved = localStorage.getItem('church_sunday_school');
    return saved ? JSON.parse(saved) : initialSundaySchoolMaterials;
  });

  const [memberDonations, setMemberDonations] = useState<MemberDonation[]>(() => {
    const saved = localStorage.getItem('church_member_donations');
    return saved ? JSON.parse(saved) : initialMemberDonations;
  });

  const [mediaContent, setMediaContent] = useState<MediaContent[]>(() => {
    const saved = localStorage.getItem('church_media');
    return saved ? JSON.parse(saved) : initialMediaContent;
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

  useEffect(() => {
    localStorage.setItem('church_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('church_cells', JSON.stringify(cells));
  }, [cells]);

  useEffect(() => {
    localStorage.setItem('church_sunday_school', JSON.stringify(sundaySchoolMaterials));
  }, [sundaySchoolMaterials]);

  useEffect(() => {
    localStorage.setItem('church_member_donations', JSON.stringify(memberDonations));
  }, [memberDonations]);

  useEffect(() => {
    localStorage.setItem('church_media', JSON.stringify(mediaContent));
  }, [mediaContent]);

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

  // Comments
  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setComments(prev => [newComment, ...prev]);
  };

  const deleteComment = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const getCommentsByTarget = (targetType: string, targetId: string) => {
    return comments.filter(c => c.targetType === targetType && c.targetId === targetId);
  };

  // Cells
  const addCell = (cell: Omit<Cell, 'id'>) => {
    const newCell = { ...cell, id: Date.now().toString() };
    setCells(prev => [...prev, newCell]);
  };

  const updateCell = (id: string, cell: Partial<Cell>) => {
    setCells(prev => prev.map(c => c.id === id ? { ...c, ...cell } : c));
  };

  const deleteCell = (id: string) => {
    setCells(prev => prev.filter(c => c.id !== id));
  };

  const getCellByMemberId = (memberId: string) => {
    return cells.find(c => c.memberIds.includes(memberId));
  };

  // Sunday School Materials
  const addSundaySchoolMaterial = (material: Omit<SundaySchoolMaterial, 'id'>) => {
    const newMaterial = { ...material, id: Date.now().toString() };
    setSundaySchoolMaterials(prev => [...prev, newMaterial]);
  };

  const deleteSundaySchoolMaterial = (id: string) => {
    setSundaySchoolMaterials(prev => prev.filter(m => m.id !== id));
  };

  // Member Donations
  const addMemberDonation = (donation: Omit<MemberDonation, 'id'>) => {
    const newDonation = { ...donation, id: Date.now().toString() };
    setMemberDonations(prev => [...prev, newDonation]);
  };

  const getMemberDonations = (memberId: string) => {
    return memberDonations.filter(d => d.memberId === memberId);
  };

  // Media Content
  const addMediaContent = (media: Omit<MediaContent, 'id'>) => {
    const newMedia = { ...media, id: Date.now().toString() };
    setMediaContent(prev => [...prev, newMedia]);
  };

  const deleteMediaContent = (id: string) => {
    setMediaContent(prev => prev.filter(m => m.id !== id));
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
      comments,
      addComment,
      deleteComment,
      getCommentsByTarget,
      cells,
      addCell,
      updateCell,
      deleteCell,
      getCellByMemberId,
      sundaySchoolMaterials,
      addSundaySchoolMaterial,
      deleteSundaySchoolMaterial,
      memberDonations,
      addMemberDonation,
      getMemberDonations,
      mediaContent,
      addMediaContent,
      deleteMediaContent,
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
