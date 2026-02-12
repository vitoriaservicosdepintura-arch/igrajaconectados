import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Check } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Culto de Domingo',
    date: '2024-01-14',
    time: '10:00',
    location: 'Templo Principal',
    description: 'Culto de celebração com louvor, adoração e pregação da Palavra.',
    type: 'regular',
    recurring: true
  },
  {
    id: 2,
    title: 'Culto de Quarta',
    date: '2024-01-17',
    time: '19:30',
    location: 'Templo Principal',
    description: 'Estudo bíblico e momento de oração.',
    type: 'regular',
    recurring: true
  },
  {
    id: 3,
    title: 'Conferência de Jovens',
    date: '2024-02-10',
    time: '18:00',
    location: 'Templo Principal',
    description: 'Evento especial para a juventude com louvor, palestrantes convidados e comunhão.',
    type: 'special',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=300&fit=crop'
  },
  {
    id: 4,
    title: 'Retiro Espiritual',
    date: '2024-03-15',
    time: '08:00',
    location: 'Sítio Bênção',
    description: 'Três dias de imersão na presença de Deus. Inclui hospedagem e alimentação.',
    type: 'special',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=300&fit=crop'
  },
  {
    id: 5,
    title: 'Encontro de Casais',
    date: '2024-02-24',
    time: '19:00',
    location: 'Salão de Eventos',
    description: 'Jantar especial e palestra sobre vida a dois segundo os princípios bíblicos.',
    type: 'special',
    image: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&h=300&fit=crop'
  }
];

const regularSchedule = [
  { day: 'Domingo', time: '10:00', event: 'Culto de Celebração' },
  { day: 'Domingo', time: '18:00', event: 'Culto da Família' },
  { day: 'Quarta', time: '19:30', event: 'Estudo Bíblico' },
  { day: 'Sexta', time: '20:00', event: 'Culto de Jovens' },
  { day: 'Sábado', time: '16:00', event: 'Reunião de Oração' }
];

export function EventsPage() {
  const [confirmedEvents, setConfirmedEvents] = useState<number[]>([]);

  const toggleConfirmation = (eventId: number) => {
    setConfirmedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const specialEvents = events.filter(e => e.type === 'special');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-amber-950 to-slate-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4">Cultos e Eventos</h1>
          <p className="text-amber-200/70 max-w-2xl mx-auto text-lg">
            Participe dos nossos cultos e eventos especiais. Você é sempre bem-vindo!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Regular Schedule */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 rounded-2xl p-6 border border-amber-700/30 sticky top-24">
              <h2 className="text-2xl font-bold text-amber-100 mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-amber-400" />
                Agenda Regular
              </h2>
              <div className="space-y-4">
                {regularSchedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-amber-800/20 rounded-xl hover:bg-amber-800/30 transition-colors"
                  >
                    <div className="bg-amber-600/30 px-3 py-2 rounded-lg text-center min-w-[80px]">
                      <div className="text-amber-400 font-bold text-sm">{item.day}</div>
                      <div className="text-amber-200 text-lg font-semibold">{item.time}</div>
                    </div>
                    <div>
                      <p className="text-amber-100 font-medium">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Location */}
              <div className="mt-6 pt-6 border-t border-amber-700/30">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 mt-1" />
                  <div>
                    <p className="text-amber-100 font-medium">Endereço</p>
                    <p className="text-amber-200/70 text-sm">
                      Rua da Paz, 123 - Centro<br />
                      São Paulo - SP, 01234-567
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Special Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <h2 className="text-2xl font-bold text-amber-100 mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-amber-400" />
              Eventos Especiais
            </h2>
            <div className="space-y-6">
              {specialEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 rounded-2xl overflow-hidden border border-amber-700/30 hover:border-amber-500/50 transition-all"
                >
                  {event.image && (
                    <div className="relative h-48">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Evento Especial
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-amber-100 mb-3">{event.title}</h3>
                    <p className="text-amber-200/70 mb-4">{event.description}</p>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-amber-300">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-amber-300">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-amber-300">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleConfirmation(event.id)}
                      className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                        confirmedEvents.includes(event.id)
                          ? 'bg-green-600 text-white'
                          : 'bg-amber-600 hover:bg-amber-500 text-white'
                      }`}
                    >
                      {confirmedEvents.includes(event.id) ? (
                        <>
                          <Check className="w-5 h-5" />
                          Presença Confirmada
                        </>
                      ) : (
                        'Confirmar Presença'
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
