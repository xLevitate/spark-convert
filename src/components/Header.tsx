import { Sparkles, Github, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  
  return (
    <header className="border-b border-gray-800/50 backdrop-blur-md sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link 
            to="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            aria-label="SparkConvert Home"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-500" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">SparkConvert</h1>
          </Link>
          
          <nav className="flex items-center gap-4" role="navigation">
            <Link
              to="/donate"
              className={`flex items-center gap-2 transition-colors
                ${location.pathname === '/donate' ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'}`}
              aria-current={location.pathname === '/donate' ? 'page' : undefined}
            >
              <Heart className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline">Support</span>
            </Link>
            <a
              href="https://github.com/xLevitate/spark-convert"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors"
              aria-label="View source code on GitHub"
            >
              <Github className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
