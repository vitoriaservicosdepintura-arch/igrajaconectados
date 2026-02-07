import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Plus, Check, ChevronLeft, ChevronRight, User, Music } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData, Event } from '../../contexts/DataContext';

export function EventsSection() {
  const { t, language } = useLanguage();
  const { events } = useData();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [addedEvents, setAddedEvents] = useState<string[]>([]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr && e.status === 'scheduled');
  };

  const addToCalendar = (event: Event) => {
    const startDate = new Date(`${event.date}T${event.time}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    
    const preacherLabel = language === 'en' ? 'Preacher' : language === 'es' ? 'Predicador' : 'Pregador';
    const worshipLabel = language === 'en' ? 'Worship' : language === 'es' ? 'Alabanza' : 'Louvor';
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\\.\\d{3}/, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\\.\\d{3}/, '')}&details=${encodeURIComponent(event.description + '\n\n' + preacherLabel + ': ' + event.pastorName + '\n' + worshipLabel + ': ' + event.singerName)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
    setAddedEvents([...addedEvents, event.id]);
  };

  // Translated month names
  const monthNames: Record<string, string[]> = {
    pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  };

  // Translated day names
  const dayNames: Record<string, string[]> = {
    pt: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  };

  const currentMonthNames = monthNames[language] || monthNames.pt;
  const currentDayNames = dayNames[language] || dayNames.pt;

  // Get upcoming scheduled events
  const upcomingEvents = events
    .filter(e => e.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <section className="py-20 bg-white" id="events">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-medium mb-4">
            {t('events.title')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('events.upcoming')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('events.subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="bg-gray-50 rounded-3xl p-6 md:p-8 shadow-lg" style={{ perspective: '1000px' }}>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-bold text-gray-900">
                  {currentMonthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {currentDayNames.map((day: string) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {emptyDays.map(i => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {days.map(day => {
                  const dayEvents = getEventsForDay(day);
                  const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth.getMonth() && new Date().getFullYear() === currentMonth.getFullYear();
                  
                  return (
                    <motion.div
                      key={day}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                      className={`aspect-square p-1 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        isToday ? 'bg-gradient-to-br from-orange-500 to-blue-600 text-white' :
                        dayEvents.length > 0 ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-sm font-medium">{day}</span>
                      {dayEvents.length > 0 && (
                        <div className="flex gap-0.5 mt-1">
                          {dayEvents.slice(0, 3).map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-orange-500'}`} />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Events List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('events.upcoming')}</h3>
            
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {t('events.noEvents')}
              </div>
            ) : (
              upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:border-orange-200 transition-colors"
                >
                  {/* Event Poster */}
                  {event.poster && (
                    <div className="h-24 rounded-xl overflow-hidden mb-3">
                      <img src={event.poster} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div className="flex gap-4">
                    {/* Date Badge */}
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex flex-col items-center justify-center text-white">
                      <span className="text-lg font-bold">{new Date(event.date).getDate()}</span>
                      <span className="text-xs">{currentMonthNames[new Date(event.date).getMonth()].slice(0, 3)}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{event.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </span>
                      </div>
                      
                      {/* Pastor and Singer Info */}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {event.pastorName && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded-full">
                            <User className="w-3 h-3" />
                            {event.pastorName}
                          </span>
                        )}
                        {event.singerName && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                            <Music className="w-3 h-3" />
                            {event.singerName}
                          </span>
                        )}
                      </div>
                      
                      <motion.button
                        onClick={() => addToCalendar(event)}
                        disabled={addedEvents.includes(event.id)}
                        className={`mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          addedEvents.includes(event.id)
                            ? 'bg-green-100 text-green-600'
                            : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        {addedEvents.includes(event.id) ? (
                          <>
                            <Check className="w-3 h-3" />
                            {t('events.addedToCalendar')}
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            {t('events.addToCalendar')}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
