import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FileConverter from './components/FileConverter';
import Statistics from './components/Statistics';
import DonationPage from './components/DonationPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import { Sparkles, Shield, Zap } from 'lucide-react';

function HomePage() {
  return (
    <main className="flex-1 container mx-auto px-4 py-12" role="main">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-5xl font-bold mb-4">
          Convert Files <span className="gradient-text">Effortlessly</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Free, open-source file conversion for everyone. No ads, no signups, no
          nonsense. Just drag, drop, and convert.
        </p>
      </div>

      <div className="relative mb-24">
        <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full"></div>
        <FileConverter />
      </div>

      <div className="mb-24 grid md:grid-cols-3 gap-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent blur-3xl -z-10"></div>

        <div className="glass-card rounded-lg p-8 text-center hover-card">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-6 h-6 text-amber-500" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Free & Open Source</h3>
          <p className="text-gray-400">
            No hidden costs or limitations. Convert files freely and check out
            our code on GitHub.
          </p>
        </div>

        <div className="glass-card rounded-lg p-8 text-center hover-card">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-6 h-6 text-amber-500" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
          <p className="text-gray-400">
            All conversions happen in your browser. Your files never leave your
            device.
          </p>
        </div>

        <div className="glass-card rounded-lg p-8 text-center hover-card">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
            <Zap className="w-6 h-6 text-amber-500" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Multiple Formats</h3>
          <p className="text-gray-400">
            Support for various file formats with more being added regularly.
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent blur-3xl -z-10"></div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Conversion Statistics</h2>
        </div>
        <Statistics />
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
