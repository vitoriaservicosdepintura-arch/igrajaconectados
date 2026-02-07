import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCreditCard, FiBookOpen, FiCalendar, FiDownload, FiArrowLeft, 
  FiHeart, FiUser, FiImage, FiPlay, FiMapPin, FiUsers, FiClock,
  FiMessageCircle, FiSend, FiX, FiChevronRight, FiHome, FiVideo,
  FiHeadphones, FiDollarSign
} from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';

interface MemberAreaProps {
  onBack: () => void;
  username: string;
}

type TabType = 'overview' | 'events' | 'gallery' | 'media' | 'donations' | 'cell' | 'sundaySchool';

export function MemberArea({ onBack, username }: MemberAreaProps) {
  const { t, language } = useLanguage();
  const { 
    events, 
    galleryPhotos, 
    addComment, 
    getCommentsByTarget,
    cells,
    getCellByMemberId,
    sundaySchoolMaterials,
    getMemberDonations,
    mediaContent,
    members
  } = useData();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [newComment, setNewComment] = useState('');
  const [commentTarget, setCommentTarget] = useState<{ type: 'event' | 'gallery' | 'media' | 'sundaySchool'; id: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Find current member
  const currentMember = members.find(m => m.name.toLowerCase().includes(username.toLowerCase())) || members[0];
  const memberId = currentMember?.id || '1';

  // Get member's cell
  const myCell = getCellByMemberId(memberId) || cells[0];
  const cellMembers = myCell ? members.filter(m => myCell.memberIds.includes(m.id)) : [];

  // Get member's donations
  const myDonations = getMemberDonations(memberId);
  const totalDonated = myDonations.reduce((acc, d) => acc + d.amount, 0);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES');
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !commentTarget) return;
    
    addComment({
      memberId: memberId,
      memberName: username,
      text: newComment,
      targetType: commentTarget.type,
      targetId: commentTarget.id,
    });
    
    setNewComment('');
    setCommentTarget(null);
  };

  const getCommentsForTarget = (type: 'event' | 'gallery' | 'media' | 'sundaySchool', id: string) => {
    return getCommentsByTarget(type, id);
  };

  // Translation helpers
  const getProjectName = (project: string) => {
    const projects: { [key: string]: { [key: string]: string } } = {
      'Novo Templo': { pt: 'Novo Templo', en: 'New Temple', es: 'Nuevo Templo' },
      'Missões': { pt: 'Missões', en: 'Missions', es: 'Misiones' },
      'Geral': { pt: 'Geral', en: 'General', es: 'General' },
      'Escolinha': { pt: 'Escolinha Dominical', en: 'Sunday School', es: 'Escuela Dominical' },
    };
    return projects[project]?.[language] || project;
  };

  const getDayName = (day: string) => {
    const days: { [key: string]: { [key: string]: string } } = {
      'Segunda-feira': { pt: 'Segunda-feira', en: 'Monday', es: 'Lunes' },
      'Terça-feira': { pt: 'Terça-feira', en: 'Tuesday', es: 'Martes' },
      'Quarta-feira': { pt: 'Quarta-feira', en: 'Wednesday', es: 'Miércoles' },
      'Quinta-feira': { pt: 'Quinta-feira', en: 'Thursday', es: 'Jueves' },
      'Sexta-feira': { pt: 'Sexta-feira', en: 'Friday', es: 'Viernes' },
      'Sábado': { pt: 'Sábado', en: 'Saturday', es: 'Sábado' },
      'Domingo': { pt: 'Domingo', en: 'Sunday', es: 'Domingo' },
    };
    return days[day]?.[language] || day;
  };

  const getRoleName = (role: string) => {
    const roles: { [key: string]: { [key: string]: string } } = {
      'Líder': { pt: 'Líder', en: 'Leader', es: 'Líder' },
      'Anfitrião': { pt: 'Anfitrião', en: 'Host', es: 'Anfitrión' },
      'Anfitriã': { pt: 'Anfitriã', en: 'Host', es: 'Anfitriona' },
      'Membro': { pt: 'Membro', en: 'Member', es: 'Miembro' },
    };
    return roles[role]?.[language] || role;
  };

  const tabs = [
    { id: 'overview' as TabType, label: t('member.profile'), icon: FiUser },
    { id: 'events' as TabType, label: t('member.events'), icon: FiCalendar },
    { id: 'gallery' as TabType, label: t('member.gallery'), icon: FiImage },
    { id: 'media' as TabType, label: t('member.media'), icon: FiPlay },
    { id: 'donations' as TabType, label: t('member.donations'), icon: FiCreditCard },
    { id: 'cell' as TabType, label: t('member.myCell'), icon: FiHome },
    { id: 'sundaySchool' as TabType, label: t('member.sundaySchool'), icon: FiBookOpen },
  ];

  const stats = [
    { label: t('member.memberSince'), value: currentMember?.joinedAt ? new Date(currentMember.joinedAt).getFullYear().toString() : '2023', icon: FiCalendar },
    { label: t('member.totalDonated'), value: `€${totalDonated}`, icon: FiHeart },
    { label: t('member.myCell'), value: myCell?.name.split(' ').slice(1, 3).join(' ') || '-', icon: FiUsers },
  ];

  return (
    <section className="py-20 bg-gray-50 min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onBack}
              className="p-2 bg-white rounded-xl shadow-md hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
              {currentMember?.photo ? (
                <img src={currentMember.photo} alt={username} className="w-full h-full object-cover" />
              ) : (
                <FiUser className="w-8 h-8" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('member.welcome')}, {username}!</h1>
              <p className="text-gray-500">{t('member.title')}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-lg">
              <stat.icon className="w-8 h-8 text-orange-500 mb-3" />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-2 mb-8 overflow-x-auto"
        >
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              {/* Upcoming Events Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FiCalendar className="w-5 h-5 text-orange-500" />
                    {t('member.upcomingEvents')}
                  </h2>
                  <button onClick={() => setActiveTab('events')} className="text-orange-500 hover:underline flex items-center gap-1">
                    {t('member.viewAll')} <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {events.filter(e => e.status === 'scheduled').slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.time} - {event.location}</p>
                      </div>
                    </div>
                  ))}
                  {events.filter(e => e.status === 'scheduled').length === 0 && (
                    <p className="text-gray-500 text-center py-4">{t('member.noEvents')}</p>
                  )}
                </div>
              </div>

              {/* Recent Donations Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FiCreditCard className="w-5 h-5 text-orange-500" />
                    {t('member.donationHistory')}
                  </h2>
                  <button onClick={() => setActiveTab('donations')} className="text-orange-500 hover:underline flex items-center gap-1">
                    {t('member.viewAll')} <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {myDonations.slice(0, 3).map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">{getProjectName(donation.project)}</p>
                        <p className="text-sm text-gray-500">{formatDate(donation.createdAt)}</p>
                      </div>
                      <p className="font-bold text-green-600">€{donation.amount}</p>
                    </div>
                  ))}
                  {myDonations.length === 0 && (
                    <p className="text-gray-500 text-center py-4">{t('member.noDonations')}</p>
                  )}
                </div>
              </div>

              {/* My Cell Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FiHome className="w-5 h-5 text-orange-500" />
                    {t('member.myCell')}
                  </h2>
                  <button onClick={() => setActiveTab('cell')} className="text-orange-500 hover:underline flex items-center gap-1">
                    {t('member.viewAll')} <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {myCell ? (
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-2">{myCell.name}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2"><FiUser className="w-4 h-4" /> {myCell.leaderName}</p>
                      <p className="flex items-center gap-2"><FiCalendar className="w-4 h-4" /> {getDayName(myCell.day)} - {myCell.time}</p>
                      <p className="flex items-center gap-2"><FiMapPin className="w-4 h-4" /> {myCell.address}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">{t('member.noCell')}</p>
                )}
              </div>

              {/* Sunday School Materials Preview */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FiBookOpen className="w-5 h-5 text-orange-500" />
                    {t('member.sundaySchool')}
                  </h2>
                  <button onClick={() => setActiveTab('sundaySchool')} className="text-orange-500 hover:underline flex items-center gap-1">
                    {t('member.viewAll')} <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {sundaySchoolMaterials.slice(0, 2).map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          {material.type}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{material.title}</p>
                          <p className="text-sm text-gray-500">{formatDate(material.createdAt)}</p>
                        </div>
                      </div>
                      <button className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg">
                        <FiDownload className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiCalendar className="w-5 h-5 text-orange-500" />
                {t('member.upcomingEvents')}
              </h2>
              <div className="space-y-6">
                {events.filter(e => e.status === 'scheduled').map((event) => (
                  <div key={event.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      {event.poster && (
                        <div className="md:w-48 h-32 md:h-auto">
                          <img src={event.poster} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1"><FiCalendar className="w-4 h-4" /> {formatDate(event.date)}</span>
                              <span className="flex items-center gap-1"><FiClock className="w-4 h-4" /> {event.time}</span>
                              <span className="flex items-center gap-1"><FiMapPin className="w-4 h-4" /> {event.location}</span>
                            </div>
                            
                            {/* Pastor and Singer Info */}
                            <div className="flex flex-wrap gap-4 mt-4">
                              {event.pastorName && (
                                <div className="flex items-center gap-2">
                                  {event.pastorPhoto ? (
                                    <img src={event.pastorPhoto} alt={event.pastorName} className="w-10 h-10 rounded-full object-cover" />
                                  ) : (
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                      <FiUser className="w-5 h-5 text-orange-500" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-xs text-gray-500">{t('events.preacher')}</p>
                                    <p className="text-sm font-medium text-gray-900">{event.pastorName}</p>
                                  </div>
                                </div>
                              )}
                              {event.singerName && (
                                <div className="flex items-center gap-2">
                                  {event.singerPhoto ? (
                                    <img src={event.singerPhoto} alt={event.singerName} className="w-10 h-10 rounded-full object-cover" />
                                  ) : (
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                      <FiHeadphones className="w-5 h-5 text-blue-500" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-xs text-gray-500">{t('events.singer')}</p>
                                    <p className="text-sm font-medium text-gray-900">{event.singerName}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Comments Section */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-700 flex items-center gap-2">
                              <FiMessageCircle className="w-4 h-4" />
                              {t('member.comments')} ({getCommentsForTarget('event', event.id).length})
                            </h4>
                            <button
                              onClick={() => setCommentTarget({ type: 'event', id: event.id })}
                              className="text-orange-500 hover:underline text-sm flex items-center gap-1"
                            >
                              {t('member.addComment')}
                            </button>
                          </div>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {getCommentsForTarget('event', event.id).map((comment) => (
                              <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900 text-sm">{comment.memberName}</span>
                                  <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                                </div>
                                <p className="text-sm text-gray-600">{comment.text}</p>
                              </div>
                            ))}
                            {getCommentsForTarget('event', event.id).length === 0 && (
                              <p className="text-gray-400 text-sm">{t('member.noComments')}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {events.filter(e => e.status === 'scheduled').length === 0 && (
                  <p className="text-gray-500 text-center py-8">{t('member.noEvents')}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiImage className="w-5 h-5 text-orange-500" />
                {t('member.galleryPhotos')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryPhotos.map((photo) => (
                  <div key={photo.id} className="group relative">
                    <div 
                      className="aspect-square rounded-xl overflow-hidden cursor-pointer"
                      onClick={() => setSelectedImage(photo.url)}
                    >
                      <img src={photo.url} alt={photo.category} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs">{photo.category}</p>
                    </div>
                    {/* Comment button */}
                    <button
                      onClick={() => setCommentTarget({ type: 'gallery', id: photo.id })}
                      className="absolute top-2 right-2 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <FiMessageCircle className="w-4 h-4 text-gray-600" />
                    </button>
                    {/* Comments count */}
                    {getCommentsForTarget('gallery', photo.id).length > 0 && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                        {getCommentsForTarget('gallery', photo.id).length}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {galleryPhotos.length === 0 && (
                <p className="text-gray-500 text-center py-8">{t('member.noPhotos')}</p>
              )}
            </motion.div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <motion.div
              key="media"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiPlay className="w-5 h-5 text-orange-500" />
                {t('member.recentMedia')}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaContent.map((media) => (
                  <div key={media.id} className="border border-gray-100 rounded-2xl overflow-hidden group">
                    <div className="relative aspect-video">
                      <img src={media.thumbnail} alt={media.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          {media.type === 'video' ? (
                            <FiVideo className="w-8 h-8 text-orange-500" />
                          ) : (
                            <FiHeadphones className="w-8 h-8 text-orange-500" />
                          )}
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-white text-xs">
                        {media.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">{media.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{formatDate(media.createdAt)}</p>
                      <div className="flex items-center justify-between">
                        <button className="text-orange-500 hover:underline text-sm flex items-center gap-1">
                          {media.type === 'video' ? t('member.watchSermon') : t('member.listenPodcast')}
                        </button>
                        <button
                          onClick={() => setCommentTarget({ type: 'media', id: media.id })}
                          className="p-2 text-gray-400 hover:text-orange-500 relative"
                        >
                          <FiMessageCircle className="w-4 h-4" />
                          {getCommentsForTarget('media', media.id).length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                              {getCommentsForTarget('media', media.id).length}
                            </span>
                          )}
                        </button>
                      </div>
                      {/* Comments */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="space-y-2 max-h-24 overflow-y-auto">
                          {getCommentsForTarget('media', media.id).slice(0, 2).map((comment) => (
                            <div key={comment.id} className="text-sm">
                              <span className="font-medium text-gray-900">{comment.memberName}:</span>
                              <span className="text-gray-600 ml-1">{comment.text}</span>
                            </div>
                          ))}
                          {getCommentsForTarget('media', media.id).length === 0 && (
                            <p className="text-gray-400 text-xs">{t('member.noComments')}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {mediaContent.length === 0 && (
                <p className="text-gray-500 text-center py-8">{t('member.noMedia')}</p>
              )}
            </motion.div>
          )}

          {/* Donations Tab */}
          {activeTab === 'donations' && (
            <motion.div
              key="donations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiCreditCard className="w-5 h-5 text-orange-500" />
                {t('member.donationHistory')}
              </h2>
              
              {/* Summary */}
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <FiDollarSign className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-2xl font-bold text-green-700">€{totalDonated}</p>
                  <p className="text-sm text-green-600">{t('member.totalDonated')}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <FiHeart className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-blue-700">{myDonations.length}</p>
                  <p className="text-sm text-blue-600">{t('donations.supporters')}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                  <FiCalendar className="w-8 h-8 text-orange-600 mb-2" />
                  <p className="text-2xl font-bold text-orange-700">{currentMember?.joinedAt ? new Date(currentMember.joinedAt).getFullYear() : '2023'}</p>
                  <p className="text-sm text-orange-600">{t('member.memberSince')}</p>
                </div>
              </div>

              {/* Donations List */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('member.donationDate')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('member.donationProject')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('member.donationMethod')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('member.donationAmount')}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">{t('member.donationStatus')}</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {myDonations.map((donation) => (
                      <tr key={donation.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{formatDate(donation.createdAt)}</td>
                        <td className="py-3 px-4 text-gray-900">{getProjectName(donation.project)}</td>
                        <td className="py-3 px-4 text-gray-600">{donation.method}</td>
                        <td className="py-3 px-4 font-bold text-green-600">{donation.currency === 'EUR' ? '€' : 'R$'}{donation.amount}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            donation.status === 'confirmed' 
                              ? 'bg-green-100 text-green-600' 
                              : donation.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {t('member.donationConfirmed')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-orange-500 hover:underline flex items-center gap-1 text-sm">
                            <FiDownload className="w-4 h-4" />
                            {t('member.downloadReceipt')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {myDonations.length === 0 && (
                <p className="text-gray-500 text-center py-8">{t('member.noDonations')}</p>
              )}
            </motion.div>
          )}

          {/* Cell Tab */}
          {activeTab === 'cell' && (
            <motion.div
              key="cell"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiHome className="w-5 h-5 text-orange-500" />
                {t('member.cellDetails')}
              </h2>
              
              {myCell ? (
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Cell Info */}
                  <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-2xl p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{myCell.name}</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        {myCell.leaderPhoto ? (
                          <img src={myCell.leaderPhoto} alt={myCell.leaderName} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow" />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {myCell.leaderName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-500">{t('member.cellLeader')}</p>
                          <p className="font-bold text-gray-900">{myCell.leaderName}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4">
                          <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <FiCalendar className="w-4 h-4" />
                            <span className="text-sm">{t('member.cellDay')}</span>
                          </div>
                          <p className="font-medium text-gray-900">{getDayName(myCell.day)}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                          <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <FiClock className="w-4 h-4" />
                            <span className="text-sm">{t('member.cellTime')}</span>
                          </div>
                          <p className="font-medium text-gray-900">{myCell.time}</p>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <FiMapPin className="w-4 h-4" />
                          <span className="text-sm">{t('member.cellAddress')}</span>
                        </div>
                        <p className="font-medium text-gray-900">{myCell.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cell Members */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FiUsers className="w-5 h-5 text-orange-500" />
                      {t('member.cellMembers')} ({cellMembers.length})
                    </h3>
                    <div className="space-y-3">
                      {cellMembers.map((member) => {
                        const isLeader = member.id === myCell.leaderId;
                        const isCurrentUser = member.name.toLowerCase().includes(username.toLowerCase());
                        
                        return (
                          <div key={member.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                            {member.photo ? (
                              <img src={member.photo} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                {member.name.charAt(0)}
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-500">{isLeader ? getRoleName('Líder') : getRoleName('Membro')}</p>
                            </div>
                            {isCurrentUser && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                                {language === 'pt' ? 'Você' : language === 'en' ? 'You' : 'Tú'}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiHome className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t('member.noCell')}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Sunday School Tab */}
          {activeTab === 'sundaySchool' && (
            <motion.div
              key="sundaySchool"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiBookOpen className="w-5 h-5 text-orange-500" />
                {t('member.sundaySchoolMaterials')}
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Lessons */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{t('member.lesson')}s</h3>
                  <div className="space-y-3">
                    {sundaySchoolMaterials.filter(m => m.category === 'lesson').map((material) => (
                      <motion.div
                        key={material.id}
                        whileHover={{ y: -2 }}
                        className="p-4 bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl border border-orange-100 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {material.type}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{material.title}</p>
                            <p className="text-sm text-gray-500">{material.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatDate(material.createdAt)}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setCommentTarget({ type: 'sundaySchool', id: material.id })}
                              className="p-2 text-gray-400 hover:text-orange-500 hover:bg-white rounded-lg transition-colors relative"
                            >
                              <FiMessageCircle className="w-5 h-5" />
                              {getCommentsForTarget('sundaySchool', material.id).length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                                  {getCommentsForTarget('sundaySchool', material.id).length}
                                </span>
                              )}
                            </button>
                            <button className="p-2 bg-white text-orange-500 rounded-lg hover:bg-orange-50 transition-colors">
                              <FiDownload className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Activities & Resources */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{t('member.activities')}</h3>
                  <div className="space-y-3">
                    {sundaySchoolMaterials.filter(m => m.category === 'activities' || m.category === 'resources').map((material) => (
                      <motion.div
                        key={material.id}
                        whileHover={{ y: -2 }}
                        className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-100 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {material.type}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{material.title}</p>
                            <p className="text-xs text-gray-500">{formatDate(material.createdAt)}</p>
                          </div>
                          <button className="p-2 bg-white text-green-500 rounded-lg hover:bg-green-50 transition-colors">
                            <FiDownload className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comment Modal */}
        <AnimatePresence>
          {commentTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setCommentTarget(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{t('member.addComment')}</h3>
                  <button onClick={() => setCommentTarget(null)} className="p-2 hover:bg-gray-100 rounded-full">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900">{username}</span>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t('member.writeComment')}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={4}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-4 h-4" />
                  {t('member.sendComment')}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={selectedImage}
                alt="Gallery"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white"
              >
                <FiX className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
