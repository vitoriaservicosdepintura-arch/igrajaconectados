import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, User, Phone, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CellGroup } from '../../types';

const cells: CellGroup[] = [
  { id: '1', name: 'Célula Família Unida', leader: 'João e Maria', address: 'Rua das Flores, 123', lat: 38.7223, lng: -9.1393, dayOfWeek: 'Quarta-feira', time: '20:00' },
  { id: '2', name: 'Célula Jovens Vencedores', leader: 'Pedro Santos', address: 'Av. da Liberdade, 456', lat: 38.7200, lng: -9.1450, dayOfWeek: 'Sexta-feira', time: '19:30' },
  { id: '3', name: 'Célula Mulheres de Valor', leader: 'Ana Costa', address: 'Praça do Comércio, 78', lat: 38.7075, lng: -9.1364, dayOfWeek: 'Terça-feira', time: '10:00' },
  { id: '4', name: 'Célula Homens de Honra', leader: 'Carlos Mendes', address: 'Rua Augusta, 234', lat: 38.7118, lng: -9.1393, dayOfWeek: 'Sábado', time: '08:00' },
  { id: '5', name: 'Célula Casais', leader: 'António e Teresa', address: 'Bairro Alto, 567', lat: 38.7138, lng: -9.1456, dayOfWeek: 'Quinta-feira', time: '20:30' },
  { id: '6', name: 'Célula Adolescentes', leader: 'Sofia Rodrigues', address: 'Alfama, 89', lat: 38.7103, lng: -9.1303, dayOfWeek: 'Sábado', time: '15:00' },
];

export function CellsSection() {
  const { t } = useLanguage();
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50" id="cells">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-600 text-sm font-medium mb-4">
            {t('cells')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Mapa de <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Células</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encontre uma célula perto de você e faça parte de uma comunidade menor, onde todos se conhecem.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* 3D Map Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div 
              className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-xl"
              style={{ perspective: '1000px', height: '500px' }}
            >
              {/* Stylized Map Background */}
              <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full" viewBox="0 0 400 400">
                  {/* Grid lines */}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <g key={i}>
                      <line x1={i * 20} y1="0" x2={i * 20} y2="400" stroke="#ccc" strokeWidth="0.5" />
                      <line x1="0" y1={i * 20} x2="400" y2={i * 20} stroke="#ccc" strokeWidth="0.5" />
                    </g>
                  ))}
                  {/* Roads */}
                  <path d="M0 200 L400 200" stroke="#999" strokeWidth="8" />
                  <path d="M200 0 L200 400" stroke="#999" strokeWidth="8" />
                  <path d="M50 100 L350 300" stroke="#aaa" strokeWidth="4" />
                  <path d="M100 50 L300 350" stroke="#aaa" strokeWidth="4" />
                </svg>
              </div>

              {/* 3D Cell Markers */}
              {cells.map((cell, index) => {
                const x = 50 + (index % 3) * 120;
                const y = 80 + Math.floor(index / 3) * 160;
                const isHovered = hoveredCell === cell.id;
                const isSelected = selectedCell === cell.id;
                
                return (
                  <motion.div
                    key={cell.id}
                    initial={{ scale: 0, y: 50 }}
                    whileInView={{ scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: 'spring' }}
                    style={{ 
                      position: 'absolute',
                      left: `${x}px`,
                      top: `${y}px`,
                      transformStyle: 'preserve-3d'
                    }}
                    onMouseEnter={() => setHoveredCell(cell.id)}
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() => setSelectedCell(selectedCell === cell.id ? null : cell.id)}
                    className="cursor-pointer"
                  >
                    {/* 3D Pin */}
                    <motion.div
                      animate={{ 
                        y: isHovered || isSelected ? -10 : 0,
                        scale: isHovered || isSelected ? 1.2 : 1,
                        rotateY: isHovered ? 15 : 0
                      }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="relative"
                    >
                      {/* Shadow */}
                      <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/20 rounded-full blur-sm transition-all ${isHovered || isSelected ? 'w-12 opacity-30' : ''}`} />
                      
                      {/* Pin */}
                      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        isSelected 
                          ? 'bg-gradient-to-br from-orange-500 to-red-500' 
                          : 'bg-gradient-to-br from-green-500 to-blue-500'
                      }`}>
                        <span className="text-white text-xl">🏠</span>
                        
                        {/* Pulse effect */}
                        {isSelected && (
                          <motion.div
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 bg-orange-500 rounded-full"
                          />
                        )}
                      </div>
                      
                      {/* Pin point */}
                      <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent transition-colors ${
                        isSelected ? 'border-t-red-500' : 'border-t-blue-500'
                      }`} />
                    </motion.div>

                    {/* Info Popup */}
                    {(isHovered || isSelected) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: -20, scale: 1 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white rounded-xl shadow-xl p-3 z-10"
                      >
                        <p className="font-bold text-gray-900 text-sm truncate">{cell.name}</p>
                        <p className="text-xs text-gray-500">{cell.dayOfWeek} - {cell.time}</p>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <p className="text-xs font-bold text-gray-700 mb-2">Legenda</p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-full" />
                  <span>Célula ativa</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                  <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-full" />
                  <span>Selecionada</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cells List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-3"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Nossas Células</h3>
            
            {cells.map((cell, index) => (
              <motion.div
                key={cell.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCell(selectedCell === cell.id ? null : cell.id)}
                onMouseEnter={() => setHoveredCell(cell.id)}
                onMouseLeave={() => setHoveredCell(null)}
                className={`p-4 rounded-2xl cursor-pointer transition-all ${
                  selectedCell === cell.id
                    ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-xl'
                    : 'bg-white shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold truncate ${selectedCell === cell.id ? 'text-white' : 'text-gray-900'}`}>
                      {cell.name}
                    </h4>
                    <div className={`flex items-center gap-2 text-sm mt-1 ${selectedCell === cell.id ? 'text-white/80' : 'text-gray-500'}`}>
                      <User className="w-3 h-3" />
                      <span>{cell.leader}</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${selectedCell === cell.id ? 'text-white/80' : 'text-gray-500'}`}>
                      <Clock className="w-3 h-3" />
                      <span>{cell.dayOfWeek} às {cell.time}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-transform ${
                    selectedCell === cell.id ? 'text-white rotate-90' : 'text-gray-400'
                  }`} />
                </div>

                {selectedCell === cell.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-white/20"
                  >
                    <div className="flex items-start gap-2 text-sm text-white/90">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{cell.address}</span>
                    </div>
                    <button className="mt-4 w-full py-2 bg-white text-orange-600 font-medium rounded-lg flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      Entrar em Contato
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
