import { motion } from 'framer-motion';
import { Church, MapPin, Phone, Mail, Facebook, Instagram, Youtube, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-amber-800/30">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 p-2 rounded-full">
                <Church className="w-6 h-6 text-amber-800" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-100">Igreja Luz do Mundo</h3>
                <p className="text-xs text-amber-400">Iluminando caminhos com amor</p>
              </div>
            </div>
            <p className="text-amber-200/60 text-sm leading-relaxed mb-4">
              Somos uma comunidade cristã comprometida em proclamar o Evangelho de Jesus Cristo, 
              formando discípulos e servindo à nossa comunidade com amor.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-amber-800/40 hover:bg-amber-700/60 rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon className="w-5 h-5 text-amber-300" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-amber-100 font-bold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-amber-200/60 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-amber-500" />
                <span>Rua da Paz, 123 - Centro<br />São Paulo - SP, 01234-567</span>
              </li>
              <li className="flex items-center gap-3 text-amber-200/60 text-sm">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>(11) 1234-5678</span>
              </li>
              <li className="flex items-center gap-3 text-amber-200/60 text-sm">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>contato@igrejluzmundo.com.br</span>
              </li>
            </ul>
          </div>

          {/* Schedule */}
          <div>
            <h4 className="text-amber-100 font-bold mb-4">Horários</h4>
            <ul className="space-y-2 text-amber-200/60 text-sm">
              <li>
                <span className="text-amber-400">Domingo:</span> 10h e 18h
              </li>
              <li>
                <span className="text-amber-400">Quarta:</span> 19h30
              </li>
              <li>
                <span className="text-amber-400">Sexta:</span> 20h (Jovens)
              </li>
              <li>
                <span className="text-amber-400">Sábado:</span> 16h (Oração)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-amber-800/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-amber-200/50 text-sm">
            © 2024 Igreja Luz do Mundo. Todos os direitos reservados.
          </p>
          <p className="text-amber-200/50 text-sm flex items-center gap-1">
            Feito com <Heart className="w-4 h-4 text-red-500" fill="currentColor" /> para a glória de Deus
          </p>
        </div>
      </div>
    </footer>
  );
}
