import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Faq from './components/Faq';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Modal from './components/Modal';
import LegalContent, { LEGAL_TITLES } from './components/LegalContent';
import Wizard from './components/wizard/Wizard';

type LegalSlug = 'privacidad' | 'aviso' | 'cookies' | 'leads';

const App: React.FC = () => {
  const [legal, setLegal] = React.useState<LegalSlug | null>(null);

  const onStart = () => {
    const el = document.getElementById('wizard');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onStart={onStart} onLegal={setLegal} />
      <main className="flex-1">
        <Hero onStart={onStart} />
        <Wizard onLegal={setLegal} />
        <HowItWorks />
        <Faq />
      </main>
      <Footer onLegal={setLegal} />

      <CookieBanner onShowPolicy={() => setLegal('cookies')} />

      <Modal
        open={legal !== null}
        onClose={() => setLegal(null)}
        title={legal ? LEGAL_TITLES[legal] : ''}
      >
        {legal && <LegalContent slug={legal} />}
      </Modal>
    </div>
  );
};

export default App;
