import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { GalleryPage } from './components/GalleryPage';
import { EventsPage } from './components/EventsPage';
import { DonationsPage } from './components/DonationsPage';
import { QuizPage } from './components/QuizPage';
import { MembersPage } from './components/MembersPage';

export function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'events':
        return <EventsPage />;
      case 'donations':
        return <DonationsPage />;
      case 'quiz':
        return <QuizPage />;
      case 'members':
        return <MembersPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
