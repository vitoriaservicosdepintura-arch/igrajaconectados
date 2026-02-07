import { motion } from 'framer-motion';
import { FiCreditCard, FiBookOpen, FiAward, FiCalendar, FiDownload, FiArrowLeft, FiHeart, FiUser } from 'react-icons/fi';
import { useLanguage } from '../contexts/LanguageContext';

interface MemberAreaProps {
  onBack: () => void;
  username: string;
}

const donations = [
  { id: '1', date: '2025-01-10', amount: 50, currency: 'EUR', project: 'Novo Templo' },
  { id: '2', date: '2024-12-15', amount: 100, currency: 'EUR', project: 'Missões' },
  { id: '3', date: '2024-11-20', amount: 75, currency: 'EUR', project: 'Geral' },
];

const courses = [
  { id: '1', name: 'Fundamentos da Fé', progress: 100, certificate: true },
  { id: '2', name: 'Liderança Cristã', progress: 60, certificate: false },
  { id: '3', name: 'Evangelismo Pessoal', progress: 30, certificate: false },
];

const materials = [
  { id: '1', title: 'Lição 1 - O Amor de Deus', type: 'PDF', date: '2025-01-12' },
  { id: '2', title: 'Lição 2 - A Criação', type: 'PDF', date: '2025-01-19' },
  { id: '3', title: 'Atividades para Crianças', type: 'ZIP', date: '2025-01-19' },
];

export function MemberArea({ onBack, username }: MemberAreaProps) {
  const { t } = useLanguage();

  const stats = [
    { label: t('member.memberSince'), value: '2023', icon: FiCalendar },
    { label: t('member.totalDonated'), value: '€225', icon: FiHeart },
    { label: t('member.certificates'), value: '1', icon: FiAward },
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
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              <FiUser className="w-8 h-8" />
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Donation History */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiCreditCard className="w-5 h-5 text-orange-500" />
              {t('member.donationHistory')}
            </h2>
            <div className="space-y-3">
              {donations.length > 0 ? donations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{donation.project}</p>
                    <p className="text-sm text-gray-500">{new Date(donation.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">€{donation.amount}</p>
                    <button className="text-xs text-orange-500 hover:underline flex items-center gap-1">
                      <FiDownload className="w-3 h-3" />
                      {t('member.downloadReceipt')}
                    </button>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-8">{t('member.noDonations')}</p>
              )}
            </div>
          </motion.div>

          {/* Courses */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiAward className="w-5 h-5 text-orange-500" />
              {t('member.courses')}
            </h2>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{course.name}</p>
                    {course.certificate && (
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                        {t('member.completed')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-blue-600 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{course.progress}%</span>
                  </div>
                  {course.certificate && (
                    <button className="mt-3 text-sm text-orange-500 hover:underline flex items-center gap-1">
                      <FiDownload className="w-4 h-4" />
                      {t('member.downloadCertificate')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sunday School Materials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiBookOpen className="w-5 h-5 text-orange-500" />
              {t('member.sundaySchool')} - {t('member.exclusiveMaterials')}
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {materials.map((material, index) => (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-4 bg-gradient-to-br from-orange-50 to-blue-50 rounded-xl border border-orange-100 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold mb-3">
                    {material.type}
                  </div>
                  <p className="font-medium text-gray-900 mb-1">{material.title}</p>
                  <p className="text-xs text-gray-500">{new Date(material.date).toLocaleDateString()}</p>
                  <button className="mt-3 w-full py-2 bg-white text-orange-600 font-medium rounded-lg text-sm hover:bg-orange-50 transition-colors flex items-center justify-center gap-1">
                    <FiDownload className="w-4 h-4" />
                    {t('member.download')}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
