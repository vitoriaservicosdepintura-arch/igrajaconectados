import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, CreditCard, Smartphone, Wallet, Copy, Check, QrCode } from 'lucide-react';

const donationAmounts = [50, 100, 200, 500, 1000];

export function DonationsPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'paypal'>('pix');
  const [copied, setCopied] = useState(false);

  const pixKey = 'igreja.luzmundo@pix.com.br';

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const amount = selectedAmount || Number(customAmount) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-amber-950 to-slate-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-600/30 mb-4">
            <Heart className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4">Doações</h1>
          <p className="text-amber-200/70 max-w-2xl mx-auto text-lg">
            "Cada um contribua segundo propôs no seu coração; não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria." - 2 Coríntios 9:7
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Amount Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 rounded-2xl p-6 border border-amber-700/30"
          >
            <h2 className="text-xl font-bold text-amber-100 mb-6">Escolha o Valor</h2>
            
            {/* Preset Amounts */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {donationAmounts.map((value) => (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedAmount(value);
                    setCustomAmount('');
                  }}
                  className={`py-3 rounded-xl font-semibold transition-all ${
                    selectedAmount === value
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-800/40 text-amber-200 hover:bg-amber-700/50'
                  }`}
                >
                  R$ {value}
                </motion.button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <label className="block text-amber-200/80 text-sm mb-2">Ou digite outro valor:</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-semibold">R$</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder="0,00"
                  className="w-full bg-amber-800/30 border border-amber-700/50 rounded-xl py-3 pl-12 pr-4 text-amber-100 placeholder-amber-500/50 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Donation Type */}
            <div className="space-y-3">
              <label className="block text-amber-200/80 text-sm">Tipo de Contribuição:</label>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 px-4 bg-amber-600/30 border border-amber-600/50 rounded-xl text-amber-200 hover:bg-amber-600/40 transition-all">
                  Dízimo
                </button>
                <button className="py-3 px-4 bg-amber-600/30 border border-amber-600/50 rounded-xl text-amber-200 hover:bg-amber-600/40 transition-all">
                  Oferta
                </button>
              </div>
            </div>
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 rounded-2xl p-6 border border-amber-700/30"
          >
            <h2 className="text-xl font-bold text-amber-100 mb-6">Forma de Pagamento</h2>
            
            {/* Payment Methods */}
            <div className="flex gap-3 mb-6">
              {[
                { id: 'pix', icon: Smartphone, label: 'PIX' },
                { id: 'card', icon: CreditCard, label: 'Cartão' },
                { id: 'paypal', icon: Wallet, label: 'PayPal' }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as typeof paymentMethod)}
                  className={`flex-1 py-3 rounded-xl font-medium flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === method.id
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-800/40 text-amber-200 hover:bg-amber-700/50'
                  }`}
                >
                  <method.icon className="w-5 h-5" />
                  <span className="text-sm">{method.label}</span>
                </button>
              ))}
            </div>

            {/* Payment Details */}
            {paymentMethod === 'pix' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 text-center">
                  <QrCode className="w-32 h-32 mx-auto text-gray-800 mb-4" />
                  <p className="text-gray-600 text-sm">Escaneie o QR Code</p>
                </div>
                <div className="bg-amber-800/30 rounded-xl p-4">
                  <p className="text-amber-200/80 text-sm mb-2">Chave PIX (E-mail):</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-amber-900/50 px-3 py-2 rounded-lg text-amber-300 text-sm">
                      {pixKey}
                    </code>
                    <button
                      onClick={handleCopyPix}
                      className="p-2 bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Copy className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Número do Cartão"
                  className="w-full bg-amber-800/30 border border-amber-700/50 rounded-xl py-3 px-4 text-amber-100 placeholder-amber-500/50 focus:outline-none focus:border-amber-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Validade (MM/AA)"
                    className="w-full bg-amber-800/30 border border-amber-700/50 rounded-xl py-3 px-4 text-amber-100 placeholder-amber-500/50 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full bg-amber-800/30 border border-amber-700/50 rounded-xl py-3 px-4 text-amber-100 placeholder-amber-500/50 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Nome no Cartão"
                  className="w-full bg-amber-800/30 border border-amber-700/50 rounded-xl py-3 px-4 text-amber-100 placeholder-amber-500/50 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="text-center py-8">
                <p className="text-amber-200/80 mb-4">Você será redirecionado para o PayPal</p>
                <img
                  src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                  alt="PayPal"
                  className="mx-auto rounded-lg"
                />
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={amount === 0}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                amount > 0
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/30'
                  : 'bg-amber-800/50 text-amber-500/50 cursor-not-allowed'
              }`}
            >
              <Heart className="w-5 h-5" />
              {amount > 0 ? `Doar R$ ${amount.toFixed(2)}` : 'Selecione um valor'}
            </motion.button>
          </motion.div>
        </div>

        {/* Trust Message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-amber-200/60 text-sm max-w-xl mx-auto">
            🔒 Suas informações estão seguras. Todas as transações são criptografadas e processadas por parceiros de pagamento confiáveis.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
